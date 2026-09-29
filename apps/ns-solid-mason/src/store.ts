import { createSignal } from 'solid-js';
import { createController, launchQueue } from './ns-common/controller';
import type { ScenarioFixture } from './shared/generate';

const APP = 'ns-solid-mason';

export const [current, setCurrent] = createSignal<ScenarioFixture | null>(null);
export const [status, setStatus] = createSignal(`${APP} · ready`);
export const [started, setStarted] = createSignal(false);

export const controller = createController({
  app: APP,
  render(f) {
    if (f) setStarted(true);
    setCurrent(f);
  },
  setStatus,
});

launchQueue.attach((url) => controller.handleUrl(url));
