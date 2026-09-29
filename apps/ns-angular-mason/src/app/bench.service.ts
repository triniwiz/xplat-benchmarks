import { Injectable, signal } from '@angular/core';
import { createController, launchQueue } from '../ns-common/controller';
import type { ScenarioFixture } from '../shared/generate';
import type { ScenarioId, Size } from '../shared/scenarios';

const APP = 'ns-angular-mason';

// Angular binding for ns-common/controller.ts: the mounted scenario and the
// status line are signals the root template renders.
@Injectable({ providedIn: 'root' })
export class BenchService {
  readonly current = signal<ScenarioFixture | null>(null);
  readonly status = signal(`${APP} · ready`);
  /** Set by the first mount; the home screen is not re-rendered between iterations. */
  readonly started = signal(false);

  private readonly controller = createController({
    app: APP,
    render: (f) => {
      if (f) this.started.set(true);
      this.current.set(f);
    },
    setStatus: (text) => this.status.set(text),
  });

  constructor() {
    launchQueue.attach((url) => this.controller.handleUrl(url));
  }

  sentinelLayout() {
    this.controller.sentinelLayout();
  }

  setMutator(fn: ((name: string) => void) | null) {
    this.controller.setMutator(fn);
  }

  show(scenario: ScenarioId, size: Size) {
    this.controller.show(scenario, size);
  }
}
