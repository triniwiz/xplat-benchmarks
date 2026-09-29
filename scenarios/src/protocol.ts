import { isScenarioId, type ScenarioId, type Size } from './scenarios';

// Wire protocol between the in-app runner and the harness HTTP server.
//
//   harness ── deep link xplatbench://run?host=H&run=R ──▶ app
//   app ── GET  http://H/plan?run=R ─────────────────────▶ harness
//   app ── POST http://H/hello  RunInfo ─────────────────▶ harness
//   app ── POST http://H/case   CaseResult (per case) ───▶ harness
//   app ── POST http://H/done   DoneMessage ─────────────▶ harness
//
// `xplatbench://show?scenario=S&size=Z` mounts one scenario and leaves it on
// screen (used by the scroll/memory drivers and for visual checks).

export const PROTOCOL_VERSION = 1;
export const DEFAULT_PORT = 9797;
export const URL_SCHEME = 'xplatbench';
export const LOG_PREFIX = 'XPLATBENCH';

export type AppId =
  | 'ns-core'
  | 'ns-core-mason'
  | 'ns-angular-mason'
  | 'ns-vue-mason'
  | 'ns-react-mason'
  | 'ns-svelte-mason'
  | 'ns-solid-mason'
  | 'react-native'
  | 'lynx';

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
  /** Pause after each unmount, ms. */
  cooldownMs: number;
  /** Max wait for any mount/mutate/unmount before the case is failed, ms. */
  timeoutMs: number;
  cases: PlanCase[];
}

export interface RunInfo {
  runId: string;
  app: AppId;
  platform: 'ios' | 'android';
  osVersion?: string;
  deviceModel?: string;
  /** Package name → version, e.g. { '@nativescript/core': '9.1.2' }. */
  framework: Record<string, string>;
  /** Screen width in dp, for checking every app laid out at the same width. */
  screenWidth?: number;
  startedAt: number;
}

export interface CaseResult {
  runId: string;
  app: AppId;
  scenario: ScenarioId;
  size: Size;
  fixtureHash: string;
  /** Series name ('mount', 'unmount', or a mutation name) → ms per measured iteration. */
  samples: Record<string, number[]>;
  /**
   * Optional breakdowns, ms per iteration, keyed `<series>.<name>`: marks relative to t0
   * (e.g. 'mount.layout' = sentinel laid out) and engine-reported durations.
   */
  phases?: Record<string, number[]>;
  error?: string;
}

export interface DoneMessage {
  runId: string;
  app: AppId;
  ok: boolean;
  error?: string;
  durationMs: number;
}

export type LaunchCommand =
  | { mode: 'run'; host: string; runId: string }
  | { mode: 'show'; scenario: ScenarioId; size: Size };

/** Parses a launch URL without relying on a URL global (not on every engine). */
export function parseLaunchUrl(url: string | null | undefined): LaunchCommand | null {
  if (!url) return null;
  const m = /^xplatbench:\/\/([a-z]+)\/?(?:\?(.*))?$/.exec(url.trim());
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

export function runUrl(host: string, runId: string): string {
  return `${URL_SCHEME}://run?host=${encodeURIComponent(host)}&run=${encodeURIComponent(runId)}`;
}

export function showUrl(scenario: ScenarioId, size: Size): string {
  return `${URL_SCHEME}://show?scenario=${scenario}&size=${size}`;
}
