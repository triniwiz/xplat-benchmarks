import { fixtureFor, type ScenarioFixture } from './generate';
import {
  LOG_PREFIX,
  PROTOCOL_VERSION,
  type AppId,
  type ArtifactMessage,
  type CaseResult,
  type DoneMessage,
  type Plan,
  type RunInfo,
} from './protocol';
import { getScenario } from './scenarios';

// Framework-agnostic benchmark loop. Each app implements BenchAdapter; the
// runner owns timing, iteration, warmup and reporting so every app is measured
// identically.

export interface PaintTiming {
  /**
   * End timestamp on the adapter's `now()` clock, when the engine reports its
   * own paint time (Lynx PipelineEntry.paintEnd). Otherwise the runner
   * reads `now()` when the promise resolves.
   */
  end?: number;
  /** Durations already computed by the engine (ms), e.g. Lynx layoutEnd - layoutStart. */
  phases?: Record<string, number>;
  /** Absolute timestamps on the `now()` clock; recorded as `mark - t0` (e.g. 'layout' = sentinel laid out). */
  marks?: Record<string, number>;
}

export interface BenchAdapter {
  app: AppId;
  /** Monotonic-ish ms clock. Must share a clock with PaintTiming.end. */
  now(): number;
  info(): Omit<RunInfo, 'runId' | 'app' | 'startedAt'>;
  /**
   * Mount the scenario into the bench host and resolve once the tree is laid
   * out and the next frame has been produced (see README "painted").
   */
  mount(fixture: ScenarioFixture): Promise<PaintTiming | void>;
  /** Apply a named mutation (ScenarioDef.mutations) and resolve once painted. */
  mutate(fixture: ScenarioFixture, mutation: string): Promise<PaintTiming | void>;
  /** Remove the tree and resolve once the empty host is painted. */
  unmount(): Promise<void>;
  /**
   * Resolve at the start of a display frame. Awaited before every t0 so the
   * wait for the next vsync is consistent rather than random (0..1 frame).
   */
  align?(): Promise<void>;
  /** Best-effort GC hint between iterations. */
  gc?(): void;
  /** Optional counters reported once after the last case (e.g. live native nodes, for leak checks). */
  diagnostics?(): Promise<Record<string, number>> | Record<string, number>;
  /** Start a JS CPU profile (Plan.profile). */
  profileStart?(label: string): void;
  /** Stop it; returns the profile as text (.cpuprofile JSON), if available. */
  profileStop?(label: string): Promise<string | undefined> | string | undefined;
  log?(message: string): void;
}

export interface RunStatus {
  phase: 'fetching' | 'running' | 'done' | 'failed';
  caseIndex: number;
  caseCount: number;
  iteration: number;
  label: string;
}

// Bare globals, not globalThis.x: some engines (Lynx's background thread)
// expose fetch/console/timers as globals that are not properties of globalThis.
declare const fetch: (url: string, init?: object) => Promise<any>;
declare const setTimeout: (fn: () => void, ms: number) => unknown;
declare const clearTimeout: (id: unknown) => void;
declare const console: { log(message: string): void };

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout<T>(promise: Promise<T>, ms: number, what: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timeout after ${ms}ms: ${what}`)), ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return (await res.json()) as T;
}

/** POST with retries: a result must not be lost to a transient network blip. */
async function postJson(url: string, body: unknown, attempts = 4): Promise<void> {
  const payload = JSON.stringify(body);
  for (let i = 1; ; i++) {
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload });
      if (!res.ok) throw new Error(`POST ${url} → ${res.status}`);
      return;
    } catch (e) {
      if (i >= attempts) throw e;
      await sleep(500 * 2 ** (i - 1));
    }
  }
}

function emit(adapter: BenchAdapter, kind: string, payload: unknown): void {
  const line = `${LOG_PREFIX}_${kind} ${JSON.stringify(payload)}`;
  (adapter.log ?? ((m: string) => console.log(m)))(line);
}

export async function runCase(
  adapter: BenchAdapter,
  plan: Plan,
  fixture: ScenarioFixture,
  onIteration?: (i: number) => void,
): Promise<CaseResult> {
  const def = getScenario(fixture.scenario);
  const samples: Record<string, number[]> = { mount: [], unmount: [] };
  for (const m of def.mutations) samples[m] = [];
  const phases: Record<string, number[]> = {};
  const label = `${fixture.scenario}/${fixture.size}`;

  const record = (series: string, t0: number, end: number, timing: PaintTiming | void, measured: boolean) => {
    if (!measured) return;
    samples[series].push(end - t0);
    if (!timing) return;
    for (const k in timing.phases) (phases[`${series}.${k}`] ??= []).push(timing.phases[k]);
    for (const k in timing.marks) (phases[`${series}.${k}`] ??= []).push(timing.marks[k] - t0);
  };

  const total = plan.warmup + plan.iterations;
  for (let i = 0; i < total; i++) {
    onIteration?.(i);
    const measured = i >= plan.warmup;

    const align = () => (adapter.align ? withTimeout(adapter.align(), plan.timeoutMs, `${label} align`) : undefined);

    await align();
    let t0 = adapter.now();
    let timing = await withTimeout(adapter.mount(fixture), plan.timeoutMs, `${label} mount`);
    record('mount', t0, (timing && timing.end) ?? adapter.now(), timing, measured);

    for (const m of def.mutations) {
      await align();
      t0 = adapter.now();
      timing = await withTimeout(adapter.mutate(fixture, m), plan.timeoutMs, `${label} ${m}`);
      record(m, t0, (timing && timing.end) ?? adapter.now(), timing, measured);
    }

    await align();
    t0 = adapter.now();
    await withTimeout(adapter.unmount(), plan.timeoutMs, `${label} unmount`);
    record('unmount', t0, adapter.now(), undefined, measured);

    adapter.gc?.();
    await sleep(plan.cooldownMs);
  }

  const result: CaseResult = {
    runId: plan.runId,
    app: plan.app,
    scenario: fixture.scenario,
    size: fixture.size,
    fixtureHash: fixture.hash,
    samples,
  };
  if (Object.keys(phases).length) result.phases = phases;
  return result;
}

/**
 * Fetch the plan from the harness, run every case and report results.
 * Never throws; failures are reported to the harness and the log.
 */
export async function runPlan(
  adapter: BenchAdapter,
  host: string,
  runId: string,
  onStatus?: (s: RunStatus) => void,
): Promise<void> {
  const base = `http://${host}`;
  const started = adapter.now();
  const status: RunStatus = { phase: 'fetching', caseIndex: 0, caseCount: 0, iteration: 0, label: '' };
  const update = (patch: Partial<RunStatus>) => onStatus?.(Object.assign(status, patch));
  update({});

  let plan: Plan;
  try {
    plan = await getJson<Plan>(`${base}/plan?run=${encodeURIComponent(runId)}`);
    if (plan.protocol !== PROTOCOL_VERSION) {
      throw new Error(`protocol mismatch: app ${PROTOCOL_VERSION}, harness ${plan.protocol}`);
    }
    const info: RunInfo = { ...adapter.info(), runId, app: adapter.app, startedAt: Date.now() };
    await postJson(`${base}/hello`, info);
  } catch (e) {
    update({ phase: 'failed', label: String(e) });
    emit(adapter, 'ERROR', { runId, error: String(e) });
    return;
  }

  let ok = true;
  let lastError: string | undefined;
  update({ phase: 'running', caseCount: plan.cases.length });
  for (let c = 0; c < plan.cases.length; c++) {
    const { scenario, size } = plan.cases[c];
    update({ caseIndex: c, iteration: 0, label: `${scenario}/${size}` });
    let result: CaseResult;
    try {
      const fixture = fixtureFor(scenario, size);
      const label = `${scenario}-${size}`;
      if (plan.profile) adapter.profileStart?.(label);
      try {
        result = await runCase(adapter, plan, fixture, (i) => update({ iteration: i }));
      } finally {
        if (plan.profile) {
          try {
            const content = await adapter.profileStop?.(label);
            if (content) await postJson(`${base}/artifact`, { runId, name: `${label}.cpuprofile`, content } satisfies ArtifactMessage);
          } catch (e) {
            // Release builds drop console output, so report the failure as an artifact.
            emit(adapter, 'ERROR', { runId, error: `profile ${label}: ${e}` });
            await postJson(`${base}/artifact`, { runId, name: `${label}.error.txt`, content: String(e) } satisfies ArtifactMessage).catch(() => {});
          }
        }
      }
    } catch (e) {
      ok = false;
      lastError = `${scenario}/${size}: ${e}`;
      result = {
        runId,
        app: adapter.app,
        scenario,
        size,
        fixtureHash: '',
        samples: {},
        error: String(e),
      };
      try {
        await adapter.unmount();
      } catch {
        // host may already be empty
      }
    }
    emit(adapter, 'RESULT', result);
    try {
      await postJson(`${base}/case`, result);
    } catch (e) {
      emit(adapter, 'ERROR', { runId, error: `post case: ${e}` });
    }
  }

  let diagnostics: Record<string, number> | undefined;
  try {
    diagnostics = adapter.diagnostics ? await adapter.diagnostics() : undefined;
  } catch (e) {
    emit(adapter, 'ERROR', { runId, error: `diagnostics: ${e}` });
  }
  const done: DoneMessage = { runId, app: adapter.app, ok, error: lastError, durationMs: adapter.now() - started, diagnostics };
  update({ phase: ok ? 'done' : 'failed', label: lastError ?? 'done' });
  emit(adapter, 'DONE', done);
  try {
    await postJson(`${base}/done`, done);
  } catch (e) {
    emit(adapter, 'ERROR', { runId, error: `post done: ${e}` });
  }
}
