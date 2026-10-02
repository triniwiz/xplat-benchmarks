import { isScenarioId, type ScenarioId, type Size } from './scenarios';

export const PROTOCOL_VERSION = 1;
export const DEFAULT_PORT = 9797;
export const URL_SCHEME = 'xplatbench';

export function appScheme(app: string): string {
  return `${URL_SCHEME}-${app}`;
}
export const LOG_PREFIX = 'XPLATBENCH';

export type AppId =
  | 'ns-core'
  | 'ns-core-mason'
  | 'ns-core-mason-perf'
  | 'ns-angular-mason'
  | 'ns-vue-mason'
  | 'ns-react-mason'
  | 'ns-svelte-mason'
  | 'ns-solid-mason'
  | 'react-native'
  | 'lynx'
  | 'ng-native'
  | 'native-ios'
  | 'native-ios-mason'
  | 'native-ios-swiftui'
  | 'native-android'
  | 'native-android-mason'
  | 'native-android-compose';

export interface PlanCase {
  scenario: ScenarioId;
  size: Size;
}

export interface Plan {
  protocol: number;
  runId: string;
  app: AppId;
  warmup: number;
  iterations: number;
  cooldownMs: number;
  timeoutMs: number;
  profile?: boolean;
  cases: PlanCase[];
}

export interface ArtifactMessage {
  runId: string;
  name: string;
  content: string;
}

export interface RunInfo {
  runId: string;
  app: AppId;
  platform: 'ios' | 'android';
  osVersion?: string;
  deviceModel?: string;
  framework: Record<string, string>;
  screenWidth?: number;
  startedAt: number;
}

export interface CaseResult {
  runId: string;
  app: AppId;
  scenario: ScenarioId;
  size: Size;
  fixtureHash: string;
  samples: Record<string, number[]>;
  phases?: Record<string, number[]>;
  error?: string;
}

export interface DoneMessage {
  runId: string;
  app: AppId;
  ok: boolean;
  error?: string;
  durationMs: number;
  diagnostics?: Record<string, number>;
}

export type LaunchCommand =
  | { mode: 'run'; host: string; runId: string }
  | { mode: 'show'; scenario: ScenarioId; size: Size };

export function parseLaunchUrl(url: string | null | undefined): LaunchCommand | null {
  if (!url) return null;
  const m = /^xplatbench(?:-[a-z0-9-]+)?:\/\/([a-z]+)\/?(?:\?(.*))?$/.exec(url.trim());
  if (!m) return null;
  const query: Record<string, string> = {};
  for (const pair of (m[2] ?? '').split('&')) {
    if (!pair) continue;
    const i = pair.indexOf('=');
    const k = decodeURIComponent(i < 0 ? pair : pair.slice(0, i));
    query[k] = i < 0 ? '' : decodeURIComponent(pair.slice(i + 1));
  }
  if (m[1] === 'run' && query.host && query.run) {
    return { mode: 'run', host: query.host, runId: query.run };
  }
  if (m[1] === 'show' && query.scenario && isScenarioId(query.scenario)) {
    const size = (query.size ?? 'M') as Size;
    if (size === 'S' || size === 'M' || size === 'L') return { mode: 'show', scenario: query.scenario, size };
  }
  return null;
}

export function runUrl(host: string, runId: string, scheme = URL_SCHEME): string {
  return `${scheme}://run?host=${encodeURIComponent(host)}&run=${encodeURIComponent(runId)}`;
}

export function showUrl(scenario: ScenarioId, size: Size, scheme = URL_SCHEME): string {
  return `${scheme}://show?scenario=${scenario}&size=${size}`;
}
