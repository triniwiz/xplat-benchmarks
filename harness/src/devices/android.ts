import { run, tryRun } from '../exec';
import type { DeviceDriver, Target } from './types';

const ADB = process.env.ANDROID_HOME ? `${process.env.ANDROID_HOME}/platform-tools/adb` : 'adb';

const adb = (serial: string, ...args: string[]) => run(ADB, ['-s', serial, ...args]);

const shq = (s: string) => `'${s.replace(/'/g, `'\\''`)}'`;

export async function listAndroid(): Promise<Target[]> {
  const res = await tryRun(ADB, ['devices', '-l']);
  if (!res) return [];
  const targets: Target[] = [];
  for (const line of res.stdout.split('\n').slice(1)) {
    const m = /^(\S+)\s+device\b(.*)$/.exec(line.trim());
    if (!m) continue;
    const model = /model:(\S+)/.exec(m[2])?.[1] ?? m[1];
    targets.push({
      platform: 'android',
      id: m[1],
      name: model.replace(/_/g, ' '),
      kind: m[1].startsWith('emulator-') ? 'emulator' : 'device',
    });
  }
  return targets;
}

export function androidDriver(target: Target): DeviceDriver {
  const serial = target.id;
  const prop = async (name: string) => (await adb(serial, 'shell', 'getprop', name)).stdout.trim();
  return {
    target,
    async prepare(port) {
      await adb(serial, 'reverse', `tcp:${port}`, `tcp:${port}`);
      return `127.0.0.1:${port}`;
    },
    async isInstalled(pkg) {
      const res = await tryRun(ADB, ['-s', serial, 'shell', 'pm', 'path', pkg]);
      return !!res && res.stdout.includes('package:');
    },
    async launchUrl(pkg, url, activity) {
      await adb(serial, 'shell', 'am', 'force-stop', pkg);
      const component = activity ? ['-n', shq(`${pkg}/${activity}`)] : [pkg];
      await adb(serial, 'shell', 'am', 'start', '-W', '-a', 'android.intent.action.VIEW', '-d', shq(url), ...component);
    },
    async stop(pkg) {
      await adb(serial, 'shell', 'am', 'force-stop', pkg);
    },
    async memory(pkg) {
      const res = await tryRun(ADB, ['-s', serial, 'shell', 'dumpsys', 'meminfo', pkg]);
      if (!res) return undefined;
      const summary = res.stdout.slice(res.stdout.indexOf('App Summary'));
      const kb = (label: string) => {
        const m = new RegExp(`${label}:\\s+(\\d+)`).exec(summary);
        return m ? Number(m[1]) : undefined;
      };
      const out: Record<string, number> = {};
      for (const [key, label] of [['javaHeapKB', 'Java Heap'], ['nativeHeapKB', 'Native Heap'], ['graphicsKB', 'Graphics'], ['totalPssKB', 'TOTAL PSS']] as const) {
        const v = kb(label);
        if (v !== undefined) out[key] = v;
      }
      return Object.keys(out).length ? out : undefined;
    },
    async forceGc(pkg) {
      const file = '/data/local/tmp/xplatbench-gc.hprof';
      await tryRun(ADB, ['-s', serial, 'shell', 'am', 'dumpheap', '-g', pkg, file]);
      await new Promise((r) => setTimeout(r, 3000));
      await tryRun(ADB, ['-s', serial, 'shell', 'rm', '-f', file]);
    },
    async install(apk) {
      await run(ADB, ['-s', serial, 'install', '-r', apk], { timeoutMs: 300_000 });
    },
    async screenshot(outPath) {
      const remote = '/data/local/tmp/xplatbench-screen.png';
      await adb(serial, 'shell', 'screencap', '-p', remote);
      await adb(serial, 'pull', remote, outPath);
      await adb(serial, 'shell', 'rm', remote);
    },
    async describe() {
      const thermal = await tryRun(ADB, ['-s', serial, 'shell', 'dumpsys', 'thermalservice']);
      return {
        manufacturer: await prop('ro.product.manufacturer'),
        model: await prop('ro.product.model'),
        osVersion: await prop('ro.build.version.release'),
        sdk: await prop('ro.build.version.sdk'),
        abi: await prop('ro.product.cpu.abi'),
        thermalStatus: /Thermal Status:\s*(\d+)/.exec(thermal?.stdout ?? '')?.[1] ?? 'unknown',
      };
    },
  };
}
