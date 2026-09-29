import type { Rng } from './prng';

const WORDS = [
  'layout', 'native', 'render', 'frame', 'measure', 'flex', 'grid', 'view',
  'style', 'border', 'shadow', 'radius', 'gradient', 'column', 'row', 'wrap',
  'align', 'justify', 'content', 'baseline', 'stretch', 'center', 'padding',
  'margin', 'inset', 'track', 'span', 'area', 'template', 'auto', 'fill',
  'basis', 'grow', 'shrink', 'order', 'gap', 'overflow', 'clip', 'scroll',
  'opacity', 'transform', 'rotate', 'scale', 'translate', 'font', 'weight',
  'line', 'height', 'letter', 'spacing', 'ellipsis', 'text', 'image', 'cover',
  'contain', 'aspect', 'ratio', 'minimum', 'maximum', 'percent', 'pixel',
  'device', 'density', 'thread',
] as const;

export function words(rng: Rng, count: number): string {
  const out: string[] = [];
  for (let i = 0; i < count; i++) out.push(rng.pick(WORDS));
  return out.join(' ');
}

export function title(rng: Rng, min = 2, max = 4): string {
  const w = words(rng, rng.int(min, max));
  return w.charAt(0).toUpperCase() + w.slice(1);
}

export function sentence(rng: Rng, min: number, max: number): string {
  return title(rng, min, max) + '.';
}

export function paragraph(rng: Rng, minWords: number, maxWords: number): string {
  const target = rng.int(minWords, maxWords);
  const parts: string[] = [];
  let count = 0;
  while (count < target) {
    const n = Math.min(rng.int(4, 12), target - count);
    parts.push(sentence(rng, n, n));
    count += n;
  }
  return parts.join(' ');
}
