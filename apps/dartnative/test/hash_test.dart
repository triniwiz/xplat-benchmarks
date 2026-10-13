import 'dart:convert';
import 'dart:io';

import 'package:test/test.dart';
import 'package:xplatbench_dn/bench/generate.dart';
import 'package:xplatbench_dn/bench/protocol.dart';
import 'package:xplatbench_dn/bench/scenarios.dart';

void main() {
  test('fixture hashes match scenarios/fixtures/manifest.json', () {
    final manifest = jsonDecode(File('../../scenarios/fixtures/manifest.json').readAsStringSync()) as Map<String, dynamic>;
    final mismatches = <String>[];
    for (final s in scenarios) {
      for (final size in sizes) {
        final key = '${s.id}/$size';
        final expected = (manifest[key] as Map<String, dynamic>)['hash'];
        final actual = fixtureFor(s.id, size).hash;
        if (actual != expected) mismatches.add('$key: expected $expected, got $actual');
      }
    }
    expect(mismatches, isEmpty);
    expect(manifest.length, scenarios.length * sizes.length);
  });

  test('parses launch urls', () {
    final run = parseLaunchUrl('xplatbench-dartnative://run?host=127.0.0.1%3A9797&run=abc');
    expect(run, isA<RunCommand>());
    expect((run as RunCommand).host, '127.0.0.1:9797');
    expect(run.runId, 'abc');
    final show = parseLaunchUrl('xplatbench://show?scenario=grid-dashboard&size=S');
    expect((show as ShowCommand).scenario, 'grid-dashboard');
    expect(show.size, 'S');
    expect(parseLaunchUrl('xplatbench://show?scenario=nope'), isNull);
  });
}
