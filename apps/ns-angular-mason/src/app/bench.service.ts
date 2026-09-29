import { Injectable, signal } from '@angular/core';
import { gc, now } from '../ns-common/clock';
import { nextFrames } from '../ns-common/frames';
import { deviceInfo } from '../ns-common/info';
import { fixtureFor, type ScenarioFixture } from '../shared/generate';
import { parseLaunchUrl } from '../shared/protocol';
import { runPlan, type BenchAdapter, type PaintTiming } from '../shared/runner';
import type { ScenarioId, Size } from '../shared/scenarios';

const APP = 'ns-angular-mason';

/** Launch URLs received before (or after) the service exists. */
export const launchUrls = {
  queue: [] as string[],
  listener: null as ((url: string) => void) | null,
  push(url: string) {
    if (this.listener) this.listener(url);
    else this.queue.push(url);
  },
};

// Owns the mounted scenario (a signal the root template renders) and the
// "painted" handshake: scenario templates end with a sentinel whose
// (layoutChanged) calls sentinelLayout(); the pending mount/mutate resolves
// one frame after it, like ns-common/frames.ts waitPainted().
@Injectable({ providedIn: 'root' })
export class BenchService {
  readonly current = signal<ScenarioFixture | null>(null);
  readonly status = signal(`${APP} · ready`);
  /** Set by the first mount; the home screen is not re-rendered between iterations. */
  readonly started = signal(false);

  private pending: ((t: PaintTiming) => void) | null = null;
  private mutator: ((name: string) => void) | null = null;

  constructor() {
    launchUrls.listener = (url) => this.handleUrl(url);
    for (const url of launchUrls.queue.splice(0)) this.handleUrl(url);
  }

  sentinelLayout() {
    const resolve = this.pending;
    if (!resolve) return;
    this.pending = null;
    const layout = now();
    nextFrames(1).then(() => resolve({ marks: { layout } }));
  }

  setMutator(fn: ((name: string) => void) | null) {
    this.mutator = fn;
  }

  private expectPaint(): Promise<PaintTiming> {
    return new Promise((resolve) => (this.pending = resolve));
  }

  readonly adapter: BenchAdapter = {
    app: APP,
    now,
    info: deviceInfo,
    gc,
    align: () => nextFrames(1),
    mount: (f) => {
      const painted = this.expectPaint();
      this.started.set(true);
      this.current.set(f);
      return painted;
    },
    mutate: (_f, name) => {
      const painted = this.expectPaint();
      this.mutator!(name);
      return painted;
    },
    unmount: async () => {
      this.pending = null;
      this.current.set(null);
      await nextFrames(2); // change detection runs on the first frame, removal lays out on the next
    },
  };

  show(scenario: ScenarioId, size: Size) {
    this.status.set(`${APP} · ${scenario}/${size}`);
    const t0 = now();
    this.adapter.mount(fixtureFor(scenario, size)).then(() => {
      this.status.set(`${APP} · ${scenario}/${size} · ${(now() - t0).toFixed(1)} ms`);
    });
  }

  private handleUrl(url: string) {
    const cmd = parseLaunchUrl(url);
    if (!cmd) return;
    if (cmd.mode === 'show') return this.show(cmd.scenario, cmd.size);
    runPlan(this.adapter, cmd.host, cmd.runId, (s) => {
      // Only on case boundaries: a status relayout must not land inside a measured iteration.
      if (s.iteration === 0) this.status.set(`${APP} · ${s.phase} ${s.caseIndex + 1}/${s.caseCount} ${s.label}`);
    });
  }
}
