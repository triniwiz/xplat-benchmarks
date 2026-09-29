import { Dimensions, Linking, Platform } from 'react-native';
import { useSyncExternalStore } from 'react';
import { fixtureFor, type ScenarioFixture } from './shared/generate';
import { parseLaunchUrl } from './shared/protocol';
import { runPlan, type BenchAdapter, type PaintTiming } from './shared/runner';
import type { ScenarioId, Size } from './shared/scenarios';

const APP = 'react-native';

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
  return useSyncExternalStore(store.subscribe, store.get);
}

export const current = createStore<ScenarioFixture | null>(null);
export const status = createStore(`${APP} · ready`);
export const started = createStore(false);

const now = () => (globalThis as any).performance.now() as number;
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

const versions = {
  'react-native': require('react-native/package.json').version,
  react: require('react/package.json').version,
  '@shopify/flash-list': require('@shopify/flash-list/package.json').version,
};

export const adapter: BenchAdapter = {
  app: APP,
  now,
  info: () => ({
    platform: Platform.OS === 'ios' ? 'ios' : 'android',
    osVersion: String(Platform.Version),
    deviceModel: Platform.OS === 'android' ? `${(Platform.constants as any).Manufacturer} ${(Platform.constants as any).Model}` : undefined,
    framework: versions,
    screenWidth: Dimensions.get('window').width,
  }),
  gc: () => (globalThis as any).gc?.(),
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

function handleUrl(url: string | null | undefined) {
  const cmd = parseLaunchUrl(url);
  if (!cmd) return;
  if (cmd.mode === 'show') return show(cmd.scenario, cmd.size);
  runPlan(adapter, cmd.host, cmd.runId, (s) => {
    if (s.iteration === 0) status.set(`${APP} · ${s.phase} ${s.caseIndex + 1}/${s.caseCount} ${s.label}`);
  });
}

let listening = false;
export function listenForLaunchUrls(initialProp?: string) {
  if (listening) return;
  listening = true;
  if (initialProp) handleUrl(initialProp);
  else Linking.getInitialURL().then(handleUrl);
  Linking.addEventListener('url', (e) => handleUrl(e.url));
}
