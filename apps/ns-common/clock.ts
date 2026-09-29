declare const __time: undefined | (() => number);

/** High-resolution ms clock (sub-ms on both platforms). */
export const now: () => number = __ANDROID__
  ? () => java.lang.System.nanoTime() / 1e6
  : typeof __time === 'function'
    ? () => Number(__time!())
    : () => Date.now();

/** Best-effort full GC between iterations. */
export function gc(): void {
  const g = globalThis as any;
  if (typeof g.__collect === 'function') g.__collect();
  else if (typeof g.gc === 'function') g.gc();
}
