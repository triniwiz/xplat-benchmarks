import { ref, shallowRef } from 'nativescript-vue';
import { createController, launchQueue } from './ns-common/controller';
import type { ScenarioFixture } from './shared/generate';

const APP = 'ns-vue-mason';

export const current = shallowRef<ScenarioFixture | null>(null);
export const status = ref(`${APP} · ready`);
export const started = ref(false);

export const controller = createController({
  app: APP,
  render(f) {
    if (f) started.value = true;
    current.value = f;
  },
  setStatus: (text) => (status.value = text),
});

launchQueue.attach((url) => controller.handleUrl(url));
