import { useSyncExternalStore } from 'react';
import { createController, launchQueue } from './ns-common/controller';
import type { ScenarioFixture } from './shared/generate';

const APP = 'ns-react-mason';

/** Minimal external store; useSyncExternalStore renders synchronously on change. */
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
      return () => listeners.delete(l);
    },
  };
}

export function useStore<T>(store: ReturnType<typeof createStore<T>>): T {
  return useSyncExternalStore(store.subscribe, store.get);
}

export const current = createStore<ScenarioFixture | null>(null);
export const status = createStore(`${APP} · ready`);
export const started = createStore(false);

export const controller = createController({
  app: APP,
  render(f) {
    if (f) started.set(true);
    current.set(f);
  },
  setStatus: (text) => status.set(text),
});

launchQueue.attach((url) => controller.handleUrl(url));
