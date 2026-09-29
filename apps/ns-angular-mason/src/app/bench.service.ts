import { Injectable, signal } from '@angular/core';
import { createController, launchQueue } from '../ns-common/controller';
import type { ScenarioFixture } from '../shared/generate';
import type { ScenarioId, Size } from '../shared/scenarios';

const APP = 'ns-angular-mason';

@Injectable({ providedIn: 'root' })
export class BenchService {
  readonly current = signal<ScenarioFixture | null>(null);
  readonly status = signal(`${APP} · ready`);
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
