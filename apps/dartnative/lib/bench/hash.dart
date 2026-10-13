import 'dart:convert';

import 'prng.dart';

int fnv1a(String input) {
  var h = 0x811c9dc5;
  for (final c in input.codeUnits) {
    h = imul(h ^ c, 0x01000193);
  }
  return h;
}

String hashData(Object? data) => fnv1a(jsonEncode(data)).toRadixString(16).padLeft(8, '0');
