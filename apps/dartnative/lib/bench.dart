import 'dart:async';
import 'dart:io';

import 'package:dartnative/dartnative.dart';

import 'bench/generate.dart';
import 'bench/protocol.dart';
import 'bench/runner.dart';

const appId = 'dartnative';

String? launchEnv(String key) {
  if (!Platform.isIOS) return Platform.environment[key];
  final file = File('${Directory.systemTemp.path}/xplatbench-launch');
  if (!file.existsSync()) return null;
  final lines = file.readAsLinesSync();
  final value = switch (key) {
    'XPLATBENCH_URL' => lines.elementAtOrNull(0),
    'XPLATBENCH_DEVICE' => lines.elementAtOrNull(1),
    _ => null,
  };
  return value == null || value.isEmpty ? null : value;
}

typedef Geometry = (double, double, double, double);

class Bench implements BenchAdapter {
  final current = ValueNotifier<ScenarioFixture?>(null);
  final status = ValueNotifier<String>('$appId · ready');
  final sentinelKey = GlobalKey();
  bool started = false;
  double screenWidth = 0;
  void Function(String name)? mutator;

  final _clock = Stopwatch()..start();
  final _frameWaiters = <void Function(double t)>[];
  bool _ticking = false;

  @override
  String get app => appId;

  @override
  double now() => _clock.elapsedMicroseconds / 1000.0;

  @override
  Map<String, Object?> info() => {
        'platform': Platform.isIOS ? 'ios' : 'android',
        'osVersion': Platform.operatingSystemVersion,
        'deviceModel': ?launchEnv('XPLATBENCH_DEVICE'),
        'framework': {
          'dartnative': const String.fromEnvironment('DN_VERSION', defaultValue: 'unknown'),
          'dart': Platform.version.split(' ').first,
        },
        'screenWidth': screenWidth,
      };

  void _onFrame(Duration _) {
    if (_frameWaiters.isEmpty) return;
    final t = now();
    final waiters = List.of(_frameWaiters);
    _frameWaiters.clear();
    for (final w in waiters) {
      w(t);
    }
  }

  void onNextFrame(void Function(double t) callback) {
    _frameWaiters.add(callback);
    if (!_ticking && DartNativePerformance.nativeTimerAvailable) {
      _ticking = true;
      DartNativePerformance.addFrameTimingCallback(_onFrame);
    } else if (!_ticking) {
      Timer(const Duration(milliseconds: 16), () => _onFrame(Duration.zero));
    }
  }

  Future<void> nextFrame() {
    final c = Completer<void>();
    onNextFrame((_) => c.complete());
    return c.future;
  }

  Geometry? _sentinel() {
    final box = sentinelKey.currentContext?.findRenderObject();
    if (box is! RenderBox) return null;
    final o = box.localToGlobal(Offset.zero);
    return (o.dx, o.dy, box.size.width, box.size.height);
  }

  void Function()? _check;
  double? _built;

  void rootBuilt() {
    if (_check == null) return;
    _built ??= now();
    WidgetsBinding.instance.addPostFrameCallback((_) => _check?.call());
  }

  Future<PaintTiming> _painted(Geometry? before) {
    final done = Completer<PaintTiming>();
    _built = null;
    void check() {
      if (_check != check) return;
      final g = _sentinel();
      if (g != null && g.$4 > 0 && g != before) {
        _check = null;
        final layout = now();
        final built = _built;
        onNextFrame((_) => onNextFrame((t) => done.complete(PaintTiming(end: t, marks: {'layout': layout, 'built': ?built}))));
      } else {
        onNextFrame((_) => check());
      }
    }

    _check = check;
    onNextFrame((_) => check());
    return done.future;
  }

  @override
  Future<PaintTiming?> mount(ScenarioFixture fixture) {
    started = true;
    current.value = fixture;
    return _painted(null);
  }

  @override
  Future<PaintTiming?> mutate(ScenarioFixture fixture, String mutation) {
    final before = _sentinel();
    mutator!(mutation);
    return _painted(before);
  }

  @override
  Future<void> unmount() async {
    _check = null;
    current.value = null;
    await nextFrame();
    await nextFrame();
  }

  @override
  Future<void> align() => nextFrame();

  @override
  void log(String message) => print(message);

  Future<void> show(String scenario, String size) async {
    status.value = '$appId · $scenario/$size';
    await unmount();
    final t0 = now();
    await mount(fixtureFor(scenario, size));
    status.value = '$appId · $scenario/$size · ${(now() - t0).toStringAsFixed(1)} ms';
  }

  void handleLaunch(String? url) {
    switch (parseLaunchUrl(url)) {
      case ShowCommand(:final scenario, :final size):
        show(scenario, size);
      case RunCommand(:final host, :final runId):
        runPlan(this, host, runId, (s) {
          if (s.iteration == 0) status.value = '$appId · ${s.phase} ${s.caseIndex + 1}/${s.caseCount} ${s.label}';
        });
      case null:
        break;
    }
  }
}

final bench = Bench();
