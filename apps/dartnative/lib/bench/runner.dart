import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'generate.dart';
import 'protocol.dart';
import 'scenarios.dart';

class PaintTiming {
  PaintTiming({this.end, this.marks = const {}});
  final double? end;
  final Map<String, double> marks;
}

abstract class BenchAdapter {
  String get app;
  double now();
  Map<String, Object?> info();
  Future<PaintTiming?> mount(ScenarioFixture fixture);
  Future<PaintTiming?> mutate(ScenarioFixture fixture, String mutation);
  Future<void> unmount();
  Future<void> align();
  void log(String message);
}

class RunStatus {
  String phase = 'fetching';
  int caseIndex = 0;
  int caseCount = 0;
  int iteration = 0;
  String label = '';
}

final _http = HttpClient();

Future<Map<String, dynamic>> _getJson(String url) async {
  final req = await _http.getUrl(Uri.parse(url));
  final res = await req.close();
  final body = await res.transform(utf8.decoder).join();
  if (res.statusCode < 200 || res.statusCode >= 300) throw StateError('GET $url → ${res.statusCode}');
  return jsonDecode(body) as Map<String, dynamic>;
}

Future<void> _postJson(String url, Object body, {int attempts = 4}) async {
  final payload = utf8.encode(jsonEncode(body));
  for (var i = 1;; i++) {
    try {
      final req = await _http.postUrl(Uri.parse(url));
      req.headers.contentType = ContentType.json;
      req.contentLength = payload.length;
      req.add(payload);
      final res = await req.close();
      await res.drain<void>();
      if (res.statusCode < 200 || res.statusCode >= 300) throw StateError('POST $url → ${res.statusCode}');
      return;
    } catch (e) {
      if (i >= attempts) rethrow;
      await Future<void>.delayed(Duration(milliseconds: 500 * (1 << (i - 1))));
    }
  }
}

void _emit(BenchAdapter adapter, String kind, Object payload) => adapter.log('${logPrefix}_$kind ${jsonEncode(payload)}');

Future<T> _step<T>(Future<T> future, int ms, String what) =>
    future.timeout(Duration(milliseconds: ms), onTimeout: () => throw TimeoutException('timeout after ${ms}ms: $what'));

Future<Map<String, Object?>> runCase(BenchAdapter adapter, Map<String, dynamic> plan, ScenarioFixture fixture,
    [void Function(int)? onIteration]) async {
  final def = getScenario(fixture.scenario);
  final samples = <String, List<double>>{'mount': [], 'unmount': []};
  for (final m in def.mutations) {
    samples[m] = [];
  }
  final phases = <String, List<double>>{};
  final label = '${fixture.scenario}/${fixture.size}';
  final timeoutMs = plan['timeoutMs'] as int;

  void record(String series, double t0, double end, PaintTiming? timing, bool measured) {
    if (!measured) return;
    samples[series]!.add(end - t0);
    if (timing == null) return;
    timing.marks.forEach((k, v) => (phases['$series.$k'] ??= []).add(v - t0));
  }

  Future<void> align() => _step(adapter.align(), timeoutMs, '$label align');

  final warmup = plan['warmup'] as int;
  final total = warmup + (plan['iterations'] as int);
  for (var i = 0; i < total; i++) {
    onIteration?.call(i);
    final measured = i >= warmup;

    await align();
    var t0 = adapter.now();
    var timing = await _step(adapter.mount(fixture), timeoutMs, '$label mount');
    record('mount', t0, timing?.end ?? adapter.now(), timing, measured);

    for (final m in def.mutations) {
      await align();
      t0 = adapter.now();
      timing = await _step(adapter.mutate(fixture, m), timeoutMs, '$label $m');
      record(m, t0, timing?.end ?? adapter.now(), timing, measured);
    }

    await align();
    t0 = adapter.now();
    await _step(adapter.unmount(), timeoutMs, '$label unmount');
    record('unmount', t0, adapter.now(), null, measured);

    await Future<void>.delayed(Duration(milliseconds: plan['cooldownMs'] as int));
  }

  return {
    'runId': plan['runId'],
    'app': plan['app'],
    'scenario': fixture.scenario,
    'size': fixture.size,
    'fixtureHash': fixture.hash,
    'samples': samples,
    if (phases.isNotEmpty) 'phases': phases,
  };
}

Future<void> runPlan(BenchAdapter adapter, String host, String runId, [void Function(RunStatus)? onStatus]) async {
  final base = 'http://$host';
  final started = adapter.now();
  final status = RunStatus();
  void update(void Function(RunStatus s) patch) {
    patch(status);
    onStatus?.call(status);
  }

  update((_) {});

  Map<String, dynamic> plan;
  try {
    plan = await _getJson('$base/plan?run=${Uri.encodeComponent(runId)}');
    if (plan['protocol'] != protocolVersion) {
      throw StateError('protocol mismatch: app $protocolVersion, harness ${plan['protocol']}');
    }
    await _postJson('$base/hello', {
      ...adapter.info(),
      'runId': runId,
      'app': adapter.app,
      'startedAt': DateTime.now().millisecondsSinceEpoch,
    });
  } catch (e) {
    update((s) => s
      ..phase = 'failed'
      ..label = '$e');
    _emit(adapter, 'ERROR', {'runId': runId, 'error': '$e'});
    return;
  }

  var ok = true;
  String? lastError;
  final cases = (plan['cases'] as List).cast<Map<String, dynamic>>();
  update((s) => s
    ..phase = 'running'
    ..caseCount = cases.length);
  for (var c = 0; c < cases.length; c++) {
    final scenario = cases[c]['scenario'] as String;
    final size = cases[c]['size'] as String;
    update((s) => s
      ..caseIndex = c
      ..iteration = 0
      ..label = '$scenario/$size');
    Map<String, Object?> result;
    try {
      result = await runCase(adapter, plan, fixtureFor(scenario, size), (i) => update((s) => s.iteration = i));
    } catch (e) {
      ok = false;
      lastError = '$scenario/$size: $e';
      result = {
        'runId': runId,
        'app': adapter.app,
        'scenario': scenario,
        'size': size,
        'fixtureHash': '',
        'samples': <String, Object?>{},
        'error': '$e',
      };
      try {
        await adapter.unmount();
      } catch (_) {}
    }
    _emit(adapter, 'RESULT', result);
    try {
      await _postJson('$base/case', result);
    } catch (e) {
      _emit(adapter, 'ERROR', {'runId': runId, 'error': 'post case: $e'});
    }
  }

  final done = {
    'runId': runId,
    'app': adapter.app,
    'ok': ok,
    'error': ?lastError,
    'durationMs': adapter.now() - started,
  };
  update((s) => s
    ..phase = ok ? 'done' : 'failed'
    ..label = lastError ?? 'done');
  _emit(adapter, 'DONE', done);
  try {
    await _postJson('$base/done', done);
  } catch (e) {
    _emit(adapter, 'ERROR', {'runId': runId, 'error': 'post done: $e'});
  }
}
