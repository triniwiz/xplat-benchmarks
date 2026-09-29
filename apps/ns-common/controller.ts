import { gc, now } from './clock';
import { nextFrames } from './frames';
import { deviceInfo } from './info';
import { fixtureFor, type ScenarioFixture } from '../shared/generate';
import { parseLaunchUrl, type AppId } from '../shared/protocol';
import { runPlan, type BenchAdapter, type PaintTiming } from '../shared/runner';
import type { ScenarioId, Size } from '../shared/scenarios';

// Bench controller for declarative frameworks (Angular, Vue, React, Svelte,
// Solid). The framework renders `fixture` reactively; scenario templates end
// with a sentinel whose layoutChanged handler calls sentinelLayout(). A
// pending mount/mutate resolves one frame after that (as frames.ts
// waitPainted does for the imperative apps). Mutations are delegated to
// whichever scenario component registered a mutator.

export interface ControllerHooks {
  app: AppId;
  /** Render the scenario (or nothing). Called synchronously; the framework may schedule its own update. */
  render(fixture: ScenarioFixture | null): void;
  setStatus(text: string): void;
}

export interface BenchController {
  adapter: BenchAdapter;
  sentinelLayout(): void;
  setMutator(fn: ((name: string) => void) | null): void;
  show(scenario: ScenarioId, size: Size): void;
  handleUrl(url: string): void;
}

export function createController(hooks: ControllerHooks): BenchController {
  const { app } = hooks;
  let pending: ((t: PaintTiming) => void) | null = null;
  let mutator: ((name: string) => void) | null = null;
  const expectPaint = () => new Promise<PaintTiming>((resolve) => (pending = resolve));

  const adapter: BenchAdapter = {
    app,
    now,
    info: deviceInfo,
    gc,
    align: () => nextFrames(1),
    mount(f) {
      const painted = expectPaint();
      hooks.render(f);
      return painted;
    },
    mutate(_f, name) {
      const painted = expectPaint();
      mutator!(name);
      return painted;
    },
    async unmount() {
      pending = null;
      hooks.render(null);
      await nextFrames(2); // the framework's update may land on the first frame; removal lays out on the next
    },
  };

  const controller: BenchController = {
    adapter,
    sentinelLayout() {
      const resolve = pending;
      if (!resolve) return;
      pending = null;
      const layout = now();
      nextFrames(1).then(() => resolve({ marks: { layout } }));
    },
    setMutator(fn) {
      mutator = fn;
    },
    show(scenario, size) {
      hooks.setStatus(`${app} · ${scenario}/${size}`);
      const t0 = now();
      adapter.mount(fixtureFor(scenario, size)).then(() => {
        hooks.setStatus(`${app} · ${scenario}/${size} · ${(now() - t0).toFixed(1)} ms`);
      });
    },
    handleUrl(url) {
      const cmd = parseLaunchUrl(url);
      if (!cmd) return;
      if (cmd.mode === 'show') return controller.show(cmd.scenario, cmd.size);
      runPlan(adapter, cmd.host, cmd.runId, (s) => {
        // Only on case boundaries: a status relayout must not land inside a measured iteration.
        if (s.iteration === 0) hooks.setStatus(`${app} · ${s.phase} ${s.caseIndex + 1}/${s.caseCount} ${s.label}`);
      });
    },
  };
  return controller;
}

/** Launch URLs can arrive before the framework has mounted; queue them until a controller exists. */
export const launchQueue = {
  urls: [] as string[],
  handler: null as ((url: string) => void) | null,
  push(url: string) {
    if (launchQueue.handler) launchQueue.handler(url);
    else launchQueue.urls.push(url);
  },
  attach(handler: (url: string) => void) {
    launchQueue.handler = handler;
    for (const url of launchQueue.urls.splice(0)) handler(url);
  },
};
