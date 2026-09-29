import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { DEFAULT_PORT, PROTOCOL_VERSION, URL_SCHEME, appScheme, runUrl, showUrl, type Plan, type PlanCase } from '../../scenarios/src/protocol';
import { SCENARIOS, SIZES, getScenario, isScenarioId, type ScenarioKind, type Size } from '../../scenarios/src/scenarios';
import { APPS, getApp, type AppDef } from './apps';
import { androidDriver, listAndroid } from './devices/android';
import { iosDriver, listIos } from './devices/ios';
import type { DeviceDriver, Platform, Target } from './devices/types';
import { RESULTS_DIR, ROOT, SCENARIOS_SRC } from './paths';
import { paletteClasses } from '../../scenarios/scripts/css';
import { buildApp } from './build';
import { writeReport, type ResultFile } from './report';
import { startServer } from './server';

const USAGE = `Usage: npm run bench -- <command> [options]

Commands
  devices                              List connected Android devices and booted iOS simulators / paired iPhones
  sync [app...]                        Copy scenarios/src into each app's shared/ folder (default: all apps present)
  build --platform android [--apps a,b] [--install] [--device <id>]
                                       Sync, then release-build each app to build/<platform>/<app>.apk (optionally install)
  run --platform <ios|android>         Run the in-app layout suite and write results/<date>-<device>/
      [--device <id>] [--apps a,b] [--scenarios id,..|mount|relayout|scroll] [--sizes S,M,L]
      [--iterations 20] [--warmup 3] [--cooldown 100] [--rounds 3] [--app-cooldown 20]
      [--port ${DEFAULT_PORT}] [--host ip:port] [--out dir]
  show --platform <p> --app <id> --scenario <id> [--size M] [--device <id>] [--screenshot out.png]
                                       Open one scenario on screen (visual parity checks)
  report <results-dir>                 Write REPORT.md for a results folder
`;

const log = (msg: string) => console.log(`[bench] ${msg}`);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const list = (v: string | undefined) => (v ? v.split(',').map((s) => s.trim()).filter(Boolean) : []);

async function resolveTarget(platform: string | undefined, deviceId: string | undefined): Promise<Target> {
  if (platform !== 'ios' && platform !== 'android') throw new Error('--platform ios|android is required');
  const targets = platform === 'android' ? await listAndroid() : await listIos();
  if (deviceId) {
    const t = targets.find((x) => x.id === deviceId || x.name === deviceId);
    if (!t) throw new Error(`Device ${deviceId} not found. Run \`npm run bench -- devices\`.`);
    return t;
  }
  if (targets.length !== 1) {
    throw new Error(
      targets.length ? `Several ${platform} targets connected; pass --device <id>.` : `No ${platform} target found.`,
    );
  }
  return targets[0];
}

function driverFor(target: Target, host?: string): DeviceDriver {
  return target.platform === 'android' ? androidDriver(target) : iosDriver(target, host);
}

function resolveCases(scenarios: string[], sizes: string[]): PlanCase[] {
  const kinds: ScenarioKind[] = ['mount', 'relayout', 'scroll'];
  const ids = new Set<string>();
  for (const s of scenarios.length ? scenarios : ['mount', 'relayout']) {
    if (s === 'all') SCENARIOS.forEach((d) => ids.add(d.id));
    else if ((kinds as string[]).includes(s)) SCENARIOS.filter((d) => d.kind === s).forEach((d) => ids.add(d.id));
    else if (isScenarioId(s)) ids.add(s);
    else throw new Error(`Unknown scenario or kind: ${s}`);
  }
  const sz = (sizes.length ? sizes : [...SIZES]) as Size[];
  for (const s of sz) if (!SIZES.includes(s)) throw new Error(`Unknown size: ${s}`);
  const cases: PlanCase[] = [];
  for (const def of SCENARIOS) {
    if (!ids.has(def.id)) continue;
    for (const size of sz) cases.push({ scenario: def.id, size });
  }
  return cases;
}

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Android targets the component explicitly; iOS needs a scheme only this app claims. */
const schemeFor = (app: AppDef, platform: Platform) => (platform === 'ios' ? appScheme(app.id) : URL_SCHEME);

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ---- commands --------------------------------------------------------------

async function cmdDevices() {
  const targets = [...(await listAndroid()), ...(await listIos())];
  if (!targets.length) return log('No devices found.');
  for (const t of targets) console.log(`${t.platform.padEnd(8)} ${t.kind.padEnd(10)} ${t.id}  ${t.name} ${t.osVersion ?? ''}`);
}

function cmdSync(ids: string[]) {
  const apps = ids.length ? ids.map(getApp) : APPS.filter((a) => existsSync(join(ROOT, a.dir)));
  const copyTs = (fromDir: string, toRel: string, label: string) => {
    const files = readdirSync(fromDir).filter((f) => f.endsWith('.ts'));
    const dest = join(ROOT, toRel);
    rmSync(dest, { recursive: true, force: true });
    mkdirSync(dest, { recursive: true });
    for (const f of files) cpSync(join(fromDir, f), join(dest, f));
    writeFileSync(join(dest, 'README.md'), `Copied from ${label} by \`npm run bench -- sync\`. Do not edit here.\n`);
    log(`synced ${files.length} files → ${toRel}`);
  };
  for (const app of apps) {
    copyTs(SCENARIOS_SRC, app.sharedDir, 'scenarios/src');
    for (const extra of app.extraShared ?? []) copyTs(join(ROOT, extra.from), extra.to, extra.from);
    if (app.paletteCss) {
      writeFileSync(join(ROOT, app.sharedDir, 'palette.css'), `/* Generated from scenarios/src/tokens.ts by bench sync. */\n${paletteClasses()}\n`);
    }
  }
}

async function cmdRun(argv: string[]) {
  const { values } = parseArgs({
    args: argv,
    options: {
      platform: { type: 'string' },
      device: { type: 'string' },
      apps: { type: 'string' },
      scenarios: { type: 'string' },
      sizes: { type: 'string' },
      iterations: { type: 'string', default: '20' },
      warmup: { type: 'string', default: '3' },
      cooldown: { type: 'string', default: '100' },
      rounds: { type: 'string', default: '3' },
      'app-cooldown': { type: 'string', default: '20' },
      'step-timeout': { type: 'string', default: '60' },
      port: { type: 'string', default: String(DEFAULT_PORT) },
      host: { type: 'string' },
      out: { type: 'string' },
    },
  });

  const target = await resolveTarget(values.platform, values.device);
  const driver = driverFor(target, values.host);
  const platform = target.platform as Platform;
  const cases = resolveCases(list(values.scenarios), list(values.sizes));
  const plan = {
    warmup: Number(values.warmup),
    iterations: Number(values.iterations),
    cooldownMs: Number(values.cooldown),
    timeoutMs: Number(values['step-timeout']) * 1000,
  };

  let apps: AppDef[] = list(values.apps).map(getApp);
  if (!apps.length) {
    apps = [];
    for (const a of APPS) if (await driver.isInstalled(a.bundleId[platform])) apps.push(a);
    if (!apps.length) throw new Error(`None of the benchmark apps are installed on ${target.name}.`);
  }

  const device = await driver.describe();
  const date = new Date().toISOString().slice(0, 10);
  const outDir = values.out ?? join(RESULTS_DIR, `${date}-${slug(device.model ?? target.name)}-${platform}`);
  mkdirSync(outDir, { recursive: true });

  // Generous per-run timeout: every step may take up to step-timeout.
  const steps = cases.reduce((n, c) => n + 2 + getScenario(c.scenario).mutations.length, 0);
  const runTimeoutMs = 60_000 + steps * (plan.warmup + plan.iterations) * Math.min(plan.timeoutMs, 10_000);

  const server = await startServer(Number(values.port), log);
  const host = await driver.prepare(server.port);
  log(`${target.name} (${target.kind}) → harness at ${host}; ${apps.length} apps × ${cases.length} cases × ${values.rounds} rounds`);

  try {
    const rounds = Number(values.rounds);
    for (let round = 1; round <= rounds; round++) {
      const order = shuffle(apps);
      log(`round ${round}/${rounds}: ${order.map((a) => a.id).join(', ')}`);
      for (const app of order) {
        const runId = `r${round}-${app.id}-${Date.now().toString(36)}`;
        const full: Plan = { protocol: PROTOCOL_VERSION, runId, app: app.id, ...plan, cases };
        const finished = server.addRun(full, { timeoutMs: runTimeoutMs, onProgress: (m) => log(`${app.id}: ${m}`) });
        await driver.launchUrl(app.bundleId[platform], runUrl(host, runId, schemeFor(app, platform)), app.androidActivity);
        const record = await finished;
        await driver.stop(app.bundleId[platform]);
        if (record.timedOut) log(`${app.id}: TIMED OUT after ${record.cases.length} cases`);
        const file: ResultFile = { round, target, device: { ...device, ...(await driver.describe()) }, record };
        writeFileSync(join(outDir, `r${round}-${app.id}.json`), JSON.stringify(file, null, 1));
        log(`${app.id}: wrote r${round}-${app.id}.json; cooling down ${values['app-cooldown']}s`);
        await sleep(Number(values['app-cooldown']) * 1000);
      }
    }
  } finally {
    await server.close();
  }
  log(`report: ${writeReport(outDir)}`);
}

async function cmdBuild(argv: string[]) {
  const { values } = parseArgs({
    args: argv,
    options: {
      platform: { type: 'string' },
      apps: { type: 'string' },
      install: { type: 'boolean', default: false },
      device: { type: 'string' },
    },
  });
  const platform = values.platform as Platform;
  if (platform !== 'ios' && platform !== 'android') throw new Error('--platform ios|android is required');
  const apps = list(values.apps).length ? list(values.apps).map(getApp) : APPS.filter((a) => existsSync(join(ROOT, a.dir)));
  const driver = values.install ? driverFor(await resolveTarget(platform, values.device)) : null;
  cmdSync(apps.map((a) => a.id));
  const failed: string[] = [];
  for (const app of apps) {
    const t0 = Date.now();
    try {
      const artifact = await buildApp(app, platform);
      log(`${app.id}: built ${artifact} in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
      if (driver) {
        await driver.install(artifact);
        log(`${app.id}: installed on ${driver.target.name}`);
      }
    } catch (e) {
      failed.push(app.id);
      log(`${app.id}: FAILED ${e instanceof Error ? e.message : e}`);
    }
  }
  if (failed.length) throw new Error(`build failed for: ${failed.join(', ')}`);
}

async function cmdShow(argv: string[]) {
  const { values } = parseArgs({
    args: argv,
    options: {
      platform: { type: 'string' },
      device: { type: 'string' },
      app: { type: 'string' },
      scenario: { type: 'string' },
      size: { type: 'string', default: 'M' },
      screenshot: { type: 'string' },
      settle: { type: 'string', default: '3' },
    },
  });
  if (!values.app || !values.scenario || !isScenarioId(values.scenario)) throw new Error('--app and --scenario are required');
  const target = await resolveTarget(values.platform, values.device);
  const driver = driverFor(target);
  const app = getApp(values.app);
  // iOS asks before a URL switches from one foreground app to another; stop the others first.
  for (const other of APPS) if (other.id !== app.id) await driver.stop(other.bundleId[target.platform]);
  await driver.launchUrl(
    app.bundleId[target.platform],
    showUrl(values.scenario, values.size as Size, schemeFor(app, target.platform)),
    app.androidActivity,
  );
  if (values.screenshot) {
    await sleep(Number(values.settle) * 1000);
    await driver.screenshot(values.screenshot);
    log(`screenshot → ${values.screenshot}`);
  }
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  switch (command) {
    case 'devices':
      return cmdDevices();
    case 'sync':
      return cmdSync(rest);
    case 'run':
      return cmdRun(rest);
    case 'build':
      return cmdBuild(rest);
    case 'show':
      return cmdShow(rest);
    case 'report':
      if (!rest[0]) throw new Error('report <results-dir>');
      return log(`wrote ${writeReport(rest[0])}`);
    default:
      console.log(USAGE);
      process.exitCode = command && command !== 'help' ? 1 : 0;
  }
}

main().catch((e) => {
  console.error(`[bench] ${e instanceof Error ? e.message : e}`);
  process.exit(1);
});
