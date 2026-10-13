import 'scenarios.dart';

const protocolVersion = 1;
const logPrefix = 'XPLATBENCH';

sealed class LaunchCommand {}

class RunCommand extends LaunchCommand {
  RunCommand(this.host, this.runId);
  final String host;
  final String runId;
}

class ShowCommand extends LaunchCommand {
  ShowCommand(this.scenario, this.size);
  final String scenario;
  final String size;
}

final _launchUrl = RegExp(r'^xplatbench(?:-[a-z0-9-]+)?:\/\/([a-z]+)\/?(?:\?(.*))?$');

LaunchCommand? parseLaunchUrl(String? url) {
  if (url == null) return null;
  final m = _launchUrl.firstMatch(url.trim());
  if (m == null) return null;
  final query = <String, String>{};
  for (final pair in (m.group(2) ?? '').split('&')) {
    if (pair.isEmpty) continue;
    final i = pair.indexOf('=');
    final k = Uri.decodeComponent(i < 0 ? pair : pair.substring(0, i));
    query[k] = i < 0 ? '' : Uri.decodeComponent(pair.substring(i + 1));
  }
  final host = query['host'], run = query['run'], scenario = query['scenario'];
  if (m.group(1) == 'run' && host != null && host.isNotEmpty && run != null && run.isNotEmpty) {
    return RunCommand(host, run);
  }
  if (m.group(1) == 'show' && scenario != null && isScenarioId(scenario)) {
    final size = query['size'] ?? 'M';
    if (sizes.contains(size)) return ShowCommand(scenario, size);
  }
  return null;
}
