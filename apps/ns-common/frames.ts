import type { View } from '@nativescript/core';
import { FPSCallback } from '@nativescript/core/fps-meter/fps-native';
import { now } from './clock';

let waiting: (() => void)[] = [];
let clock: FPSCallback | undefined;

function onFrame() {
  const cbs = waiting;
  waiting = [];
  for (const cb of cbs) cb();
  if (!waiting.length) clock!.stop();
}

export function nextFrames(n = 2): Promise<void> {
  return new Promise((resolve) => {
    const tick = () => (--n <= 0 ? resolve() : waiting.push(tick));
    waiting.push(tick);
    clock ??= new FPSCallback(onFrame);
    clock.start();
  });
}

export function waitPainted(sentinel: View): Promise<{ marks: { layout: number } }> {
  return new Promise((resolve) => {
    const onLayout = () => {
      const layout = now();
      sentinel.off('layoutChanged', onLayout);
      nextFrames(1).then(() => resolve({ marks: { layout } }));
    };
    sentinel.on('layoutChanged', onLayout);
  });
}
