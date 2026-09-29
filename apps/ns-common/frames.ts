import type { View } from '@nativescript/core';
import { now } from './clock';
import { requestAnimationFrame } from '@nativescript/core/animation-frame';

/** Resolve after `n` display frames (CADisplayLink / Choreographer). */
export function nextFrames(n = 2): Promise<void> {
  return new Promise((resolve) => {
    const tick = () => (--n <= 0 ? resolve() : requestAnimationFrame(tick));
    requestAnimationFrame(tick);
  });
}

/**
 * "Painted": the sentinel's next layoutChanged (its bounds changed relative to
 * its parent, which every scenario mount and mutation guarantees), then one
 * frame, by which time the frame containing that layout has been committed
 * (Android draws in the same traversal; iOS commits in the same CA transaction).
 * Resolves with a 'layout' mark taken when the sentinel was laid out.
 * Register before triggering the change.
 */
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
