import 'dart:math' as math;

import 'prng.dart';

const _words = [
  'layout', 'native', 'render', 'frame', 'measure', 'flex', 'grid', 'view',
  'style', 'border', 'shadow', 'radius', 'gradient', 'column', 'row', 'wrap',
  'align', 'justify', 'content', 'baseline', 'stretch', 'center', 'padding',
  'margin', 'inset', 'track', 'span', 'area', 'template', 'auto', 'fill',
  'basis', 'grow', 'shrink', 'order', 'gap', 'overflow', 'clip', 'scroll',
  'opacity', 'transform', 'rotate', 'scale', 'translate', 'font', 'weight',
  'line', 'height', 'letter', 'spacing', 'ellipsis', 'text', 'image', 'cover',
  'contain', 'aspect', 'ratio', 'minimum', 'maximum', 'percent', 'pixel',
  'device', 'density', 'thread',
];

String words(Rng rng, int count) => [for (var i = 0; i < count; i++) rng.pick(_words)].join(' ');

String title(Rng rng, [int min = 2, int max = 4]) {
  final w = words(rng, rng.integer(min, max));
  return w[0].toUpperCase() + w.substring(1);
}

String sentence(Rng rng, int min, int max) => '${title(rng, min, max)}.';

String paragraph(Rng rng, int minWords, int maxWords) {
  final target = rng.integer(minWords, maxWords);
  final parts = <String>[];
  var count = 0;
  while (count < target) {
    final n = math.min(rng.integer(4, 12), target - count);
    parts.add(sentence(rng, n, n));
    count += n;
  }
  return parts.join(' ');
}
