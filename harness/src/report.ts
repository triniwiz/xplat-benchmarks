import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import type { AppId } from '../../scenarios/src/protocol';
import { SCENARIOS, SIZES } from '../../scenarios/src/scenarios';
import { APPS } from './apps';
import type { Target } from './devices/types';
import { MANIFEST } from './paths';
import type { RunRecord } from './server';
import { summarize } from './stats';

export interface ResultFile {
  round: number;
  target: Target;
  device: Record<string, string>;
  record: RunRecord;
}

export function loadResults(dir: string): ResultFile[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')) as ResultFile)
    .filter((r) => r.record?.plan);
}

type SeriesMap = Map<string, Map<AppId, number[]>>; // "scenario/size/series" → app → samples

const fmt = (v: number) => (Number.isFinite(v) ? (v >= 100 ? v.toFixed(0) : v.toFixed(1)) : '–');

export function buildReport(dir: string): string {
  const files = loadResults(dir);
  if (!files.length) throw new Error(`No result files in ${dir}`);
  const manifest: Record<string, { hash: string }> = existsSync(MANIFEST)
    ? JSON.parse(readFileSync(MANIFEST, 'utf8'))
    : {};

  const series: SeriesMap = new Map();
  const problems: string[] = [];
  const appsSeen = new Set<AppId>();
  const versions = new Map<AppId, Record<string, string>>();

  for (const f of files) {
    const { record } = f;
    const app = record.plan.app;
    appsSeen.add(app);
    if (record.info) versions.set(app, record.info.framework);
    if (record.timedOut) problems.push(`round ${f.round} ${app}: timed out (${record.cases.length}/${record.plan.cases.length} cases)`);
    if (record.done && !record.done.ok) problems.push(`round ${f.round} ${app}: ${record.done.error}`);
    for (const c of record.cases) {
      const key = `${c.scenario}/${c.size}`;
      if (c.error) {
        problems.push(`round ${f.round} ${app} ${key}: ${c.error}`);
        continue;
      }
      const expected = manifest[key]?.hash;
      if (expected && c.fixtureHash !== expected) {
        problems.push(`round ${f.round} ${app} ${key}: fixture hash ${c.fixtureHash} ≠ manifest ${expected}`);
      }
      for (const [name, values] of Object.entries(c.samples)) {
        const k = `${key}/${name}`;
        let byApp = series.get(k);
        if (!byApp) series.set(k, (byApp = new Map()));
        byApp.set(app, [...(byApp.get(app) ?? []), ...values]);
      }
    }
  }

  const apps = APPS.filter((a) => appsSeen.has(a.id));
  const first = files[0];
  const out: string[] = [];
  out.push(`# Results: ${basename(dir)}`, '');
  const deviceName = [first.device.manufacturer, first.device.model ?? first.target.name].filter(Boolean).join(' ');
  out.push(`- Device: ${deviceName} (${first.target.kind}), ${first.target.platform} ${first.device.osVersion ?? first.target.osVersion ?? ''}`);
  out.push(`- Rounds: ${new Set(files.map((f) => f.round)).size}, warmup ${first.record.plan.warmup}, iterations ${first.record.plan.iterations} per round`);
  out.push(`- Cells: median ms · p90 ms (n). Lower is better.`);
  if (first.target.kind !== 'device') out.push(`- ⚠️ ${first.target.kind} run — smoke-test numbers only.`);
  out.push('');

  out.push('## Versions', '');
  for (const a of apps) {
    const v = versions.get(a.id);
    out.push(`- **${a.title}**: ${v ? Object.entries(v).map(([k, x]) => `${k} ${x}`).join(', ') : 'unknown'}`);
  }
  out.push('');

  if (problems.length) {
    out.push('## Problems', '', ...problems.map((p) => `- ${p}`), '');
  }

  for (const def of SCENARIOS) {
    const names = ['mount', ...def.mutations];
    const blocks: string[] = [];
    for (const name of names) {
      const rows: string[] = [];
      for (const size of SIZES) {
        const byApp = series.get(`${def.id}/${size}/${name}`);
        if (!byApp) continue;
        const cells = apps.map((a) => {
          const s = summarize(byApp.get(a.id) ?? []);
          return s.n ? `${fmt(s.median)} · ${fmt(s.p90)} (${s.n})` : '–';
        });
        rows.push(`| ${size} | ${cells.join(' | ')} |`);
      }
      if (!rows.length) continue;
      blocks.push(
        `**${name}**`,
        '',
        `| size | ${apps.map((a) => a.title).join(' | ')} |`,
        `|---|${apps.map(() => '---:').join('|')}|`,
        ...rows,
        '',
      );
    }
    if (blocks.length) out.push(`## ${def.title} (\`${def.id}\`, ${def.kind})`, '', ...blocks);
  }

  return out.join('\n');
}

export function writeReport(dir: string): string {
  const md = buildReport(dir);
  const path = join(dir, 'REPORT.md');
  writeFileSync(path, md);
  return path;
}
