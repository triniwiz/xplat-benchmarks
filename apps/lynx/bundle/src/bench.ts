import { useEffect, useState } from '@lynx-js/react';
import { fixtureFor, type ScenarioFixture } from './shared/generate';
import { parseLaunchUrl } from './shared/protocol';
import { runPlan, type BenchAdapter, type PaintTiming } from './shared/runner';
import type { ScenarioId, Size } from './shared/scenarios';

// ReactLynx binding of the bench protocol, same design as the other apps:
// App renders `current`; scenario trees end with a sentinel whose
// bindlayoutchange calls sentinelLayout(); a pending mount/mutate resolves one
// frame after it. Runs on the background thread (handlers and effects).

declare const __BENCH_VERSIONS__: Record<string, string>;

const APP = 'lynx';

export function createStore<T>(initial: T) {
  let value = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    set(next: T) {
      value = next;
      listeners.forEach((l) => l());
    },
    subscribe(l: () => void) {
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    },
  };
}
export type Store<T> = ReturnType<typeof createStore<T>>;

export function useStore<T>(store: Store<T>): T {
  const [value, setValue] = useState(store.get());
  useEffect(() => store.subscribe(() => setValue(store.get())), [store]);
  return value;
}

export const current = createStore<ScenarioFixture | null>(null);
export const status = createStore(`${APP} · ready`);
export const started = createStore(false);

// Bare globals (typeof checks): Lynx's background-thread globals are not all
// properties of globalThis. No high-resolution clock is guaranteed there.
declare const performance: { now(): number } | undefined;
const now: () => number =
  typeof performance !== 'undefined' && typeof performance.now === 'function' ? () => performance.now() : () => Date.now();

const nextFrames = (n: number) =>
  new Promise<void>((resolve) => {
    const tick = () => (--n <= 0 ? resolve() : requestAnimationFrame(tick));
    requestAnimationFrame(tick);
  });

let pending: ((t: PaintTiming) => void) | null = null;
let mutator: ((name: string) => void) | null = null;
const expectPaint = () => new Promise<PaintTiming>((resolve) => (pending = resolve));

export function sentinelLayout() {
  const resolve = pending;
  if (!resolve) return;
  pending = null;
  const layout = now();
  nextFrames(1).then(() => resolve({ marks: { layout } }));
}

export function setMutator(fn: ((name: string) => void) | null) {
  mutator = fn;
}

const globalProps = () => ((lynx as any).__globalProps ?? {}) as Record<string, string>;

export const adapter: BenchAdapter = {
  app: APP,
  now,
  info: () => {
    const g = globalProps();
    return {
      platform: g.platform === 'ios' ? 'ios' : 'android',
      osVersion: g.osVersion,
      deviceModel: g.deviceModel,
      framework: { ...__BENCH_VERSIONS__, 'lynx-sdk': g.lynxSdk ?? 'unknown' },
      screenWidth: typeof SystemInfo !== 'undefined' ? (SystemInfo.pixelWidth as number) / (SystemInfo.pixelRatio as number) : undefined,
    };
  },
  align: () => nextFrames(1),
  mount(f) {
    const painted = expectPaint();
    started.set(true);
    current.set(f);
    return painted;
  },
  mutate(_f, name) {
    const painted = expectPaint();
    mutator!(name);
    return painted;
  },
  async unmount() {
    pending = null;
    current.set(null);
    await nextFrames(2);
  },
};

export function show(scenario: ScenarioId, size: Size) {
  status.set(`${APP} · ${scenario}/${size}`);
  const t0 = now();
  adapter.mount(fixtureFor(scenario, size)).then(() => {
    status.set(`${APP} · ${scenario}/${size} · ${(now() - t0).toFixed(1)} ms`);
  });
}

/** Handle the launch URL the host passed in globalProps (the harness always cold-starts). */
export function startFromLaunchUrl() {
  const cmd = parseLaunchUrl(globalProps().launchUrl);
  if (!cmd) {
    // Nothing to run: show what the host passed in, for debugging the launch path.
    status.set(`${APP} · ready · launchUrl=${JSON.stringify(globalProps().launchUrl ?? null)}`);
    return;
  }
  if (cmd.mode === 'show') return show(cmd.scenario, cmd.size);
  runPlan(adapter, cmd.host, cmd.runId, (s) => {
    // Only on case boundaries: a status re-render must not land inside a measured iteration.
    if (s.iteration === 0) status.set(`${APP} · ${s.phase} ${s.caseIndex + 1}/${s.caseCount} ${s.label}`);
  });
}
