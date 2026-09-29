declare const __time: undefined | (() => number);

export const now: () => number = __ANDROID__
  ? () => java.lang.System.nanoTime() / 1e6
  : typeof __time === 'function'
    ? () => Number(__time!())
    : () => Date.now();

export function gc(): void {
  const g = globalThis as any;
  if (typeof g.__collect === 'function') g.__collect();
  else if (typeof g.gc === 'function') g.gc();
}
