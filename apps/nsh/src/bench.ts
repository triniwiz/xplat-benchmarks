import { host, platform, windowSize } from 'nsh';
import { fixtureFor } from './shared/generate';
import { parseLaunchUrl } from './shared/protocol';
import { runPlan, type BenchAdapter, type PaintTiming } from './shared/runner';
import type { ScenarioId, Size } from './shared/scenarios';
import { APP, MUTATIONS, isMutation, render, status } from './store';

const now = () => performance.now();

const nextFrames = (n: number) =>
  new Promise<void>((resolve) => {
    const tick = () => (--n <= 0 ? resolve() : requestAnimationFrame(tick));
    requestAnimationFrame(tick);
  });

let pending: ((t: PaintTiming) => void) | null = null;
const expectPaint = () => new Promise<PaintTiming>((resolve) => (pending = resolve));

export function sentinelLayout() {
  const resolve = pending;
  if (!resolve) return;
  pending = null;
  const layout = now();
  nextFrames(2).then(() => resolve({ marks: { layout } }));
}

const param = (key: string) => {
  const v = host.params[key];
  return typeof v === 'string' ? v : undefined;
};

export const adapter: BenchAdapter = {
  app: APP,
  now,
  info: () => ({
    platform: platform.os === 'ios' ? 'ios' : 'android',
    osVersion: param('osVersion') ?? platform.version,
    deviceModel: param('deviceModel'),
    framework: { nsh: param('nshVersion') ?? 'unknown' },
    screenWidth: windowSize().width,
  }),
  align: () => nextFrames(1),
  mount(f) {
    const painted = expectPaint();
    render(f);
    return painted;
  },
  mutate(_f, name) {
    if (!isMutation(name)) throw new Error(`unknown mutation ${name}`);
    const painted = expectPaint();
    MUTATIONS[name]();
    return painted;
  },
  async unmount() {
    pending = null;
    render(null);
    await nextFrames(2);
  },
};

function show(scenario: ScenarioId, size: Size) {
  status.set(`${APP} · ${scenario}/${size}`);
  const t0 = now();
  adapter.mount(fixtureFor(scenario, size)).then(() => {
    status.set(`${APP} · ${scenario}/${size} · ${(now() - t0).toFixed(1)} ms`);
  });
}

export function startFromLaunchUrl() {
  const url = param('launchUrl') ?? '';
  const cmd = parseLaunchUrl(url);
  if (!cmd) return status.set(`${APP} · ready · launchUrl=${JSON.stringify(url)}`);
  if (cmd.mode === 'show') return show(cmd.scenario, cmd.size);
  runPlan(adapter, cmd.host, cmd.runId, (s) => {
    if (s.iteration === 0) status.set(`${APP} · ${s.phase} ${s.caseIndex + 1}/${s.caseCount} ${s.label}`);
  });
}
