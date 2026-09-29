export interface Summary {
  n: number;
  min: number;
  max: number;
  mean: number;
  median: number;
  p90: number;
  stddev: number;
  /** Median absolute deviation. */
  mad: number;
}

/** Linear-interpolated percentile, p in [0, 100]. `sorted` must be ascending. */
export function percentile(sorted: readonly number[], p: number): number {
  if (!sorted.length) return NaN;
  const idx = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

export function summarize(values: readonly number[]): Summary {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  if (!n) return { n, min: NaN, max: NaN, mean: NaN, median: NaN, p90: NaN, stddev: NaN, mad: NaN };
  const mean = sorted.reduce((s, v) => s + v, 0) / n;
  const variance = n > 1 ? sorted.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1) : 0;
  const median = percentile(sorted, 50);
  const deviations = sorted.map((v) => Math.abs(v - median)).sort((a, b) => a - b);
  return {
    n,
    min: sorted[0],
    max: sorted[n - 1],
    mean,
    median,
    p90: percentile(sorted, 90),
    stddev: Math.sqrt(variance),
    mad: percentile(deviations, 50),
  };
}
