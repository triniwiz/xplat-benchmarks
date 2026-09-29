import type { View } from '@nativescript/core';
import { now } from './clock';
import { requestAnimationFrame } from '@nativescript/core/animation-frame';

export function nextFrames(n = 2): Promise<void> {
  return new Promise((resolve) => {
    const tick = () => (--n <= 0 ? resolve() : requestAnimationFrame(tick));
    requestAnimationFrame(tick);
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
