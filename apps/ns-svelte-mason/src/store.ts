import { writable } from 'svelte/store';
import { createController, launchQueue } from './ns-common/controller';
import type { ScenarioFixture } from './shared/generate';

const APP = 'ns-svelte-mason';

export const current = writable<ScenarioFixture | null>(null);
export const status = writable(`${APP} · ready`);
export const started = writable(false);

export const controller = createController({
  app: APP,
  render(f) {
    if (f) started.set(true);
    current.set(f);
  },
  setStatus: (text) => status.set(text),
});

launchQueue.attach((url) => controller.handleUrl(url));
