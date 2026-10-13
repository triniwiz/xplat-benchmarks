
import 'package:dartnative/dartnative.dart';

import 'bench.dart';
import 'bench/generate.dart';
import 'bench/scenarios.dart';
import 'dartnative_plugin_registrant.dart';
import 'list.dart';
import 'scenarios.dart';
import 'tokens.dart';

void main() {
  DartNativePluginRegistrant.registerAll();
  SystemChrome.defaultStyle = const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarBrightness: Brightness.light,
    statusBarIconBrightness: Brightness.dark,
    systemNavigationBarColor: Colors.transparent,
    systemNavigationBarIconBrightness: Brightness.dark,
  );
  runApp(const BenchApp());
  WidgetsBinding.instance.addPostFrameCallback((_) => bench.handleLaunch(launchEnv('XPLATBENCH_URL')));
}

class BenchApp extends StatelessWidget {
  const BenchApp({super.key});

  @override
  Widget build(BuildContext context) {
    bench.screenWidth = MediaQuery.of(context).size.width;
    return Scaffold(
      brightness: Brightness.light,
      backgroundColor: bg,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ValueListenableBuilder<String>(
              valueListenable: bench.status,
              builder: (context, status, _) => Container(
                height: 24,
                color: surface,
                padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
                child: Text(status, style: ts(11, muted)),
              ),
            ),
            Expanded(
              child: ValueListenableBuilder<ScenarioFixture?>(
                valueListenable: bench.current,
                builder: (context, f, _) {
                  if (f != null && f.fixture == 'list-scroll') return BenchList(data: f.data as ListData);
                  return SingleChildScrollView(
                    child: f != null ? scenarioFor(f) : (bench.started ? const SizedBox.shrink() : const Home()),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class Home extends StatelessWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: [
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Text('xplat-benchmarks · DartNative', style: ts(16, textColor, bold: true)),
          ),
          for (final sc in scenarios)
            Padding(
              padding: const EdgeInsets.only(bottom: 4),
              child: Row(
                children: [
                  Expanded(child: Text(sc.title, style: ts(13, textColor))),
                  for (final size in sizes)
                    GestureDetector(
                      onTap: () => bench.show(sc.id, size),
                      child: Container(
                        margin: const EdgeInsets.only(left: 4),
                        padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 10),
                        decoration: BoxDecoration(color: paletteLight[4], borderRadius: BorderRadius.circular(4)),
                        child: Text(size, style: ts(12, textColor)),
                      ),
                    ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
