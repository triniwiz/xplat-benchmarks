import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { networkInterfaces, tmpdir } from 'node:os';
import { join } from 'node:path';
import { run, tryRun } from '../exec';
import type { DeviceDriver, Target } from './types';

async function devicectlJson(args: string[]): Promise<any> {
  const dir = mkdtempSync(join(tmpdir(), 'xplatbench-'));
  const out = join(dir, 'out.json');
  try {
    await run('xcrun', ['devicectl', ...args, '--json-output', out, '--quiet']);
    return JSON.parse(readFileSync(out, 'utf8'));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

export async function listIos(): Promise<Target[]> {
  const targets: Target[] = [];
  const sims = await tryRun('xcrun', ['simctl', 'list', 'devices', 'booted', '-j']);
  if (sims) {
    const data = JSON.parse(sims.stdout) as { devices: Record<string, { udid: string; name: string; state: string }[]> };
    for (const [runtime, list] of Object.entries(data.devices)) {
      const osVersion = /iOS-(\d+)-(\d+)/.exec(runtime)?.slice(1).join('.');
      for (const d of list) {
        if (d.state === 'Booted') targets.push({ platform: 'ios', id: d.udid, name: d.name, kind: 'simulator', osVersion });
      }
    }
  }
  try {
    const data = await devicectlJson(['list', 'devices']);
    for (const d of data?.result?.devices ?? []) {
      if (d?.connectionProperties?.tunnelState === 'unavailable') continue;
      targets.push({
        platform: 'ios',
        id: d.hardwareProperties?.udid ?? d.identifier,
        name: d.deviceProperties?.name ?? d.identifier,
        kind: 'device',
        osVersion: d.deviceProperties?.osVersionNumber,
      });
    }
  } catch {
    // devicectl missing or no devices paired
  }
  return targets;
}

/** First non-internal IPv4 address; physical iOS devices reach the harness over Wi-Fi. */
export function lanAddress(): string {
  for (const list of Object.values(networkInterfaces())) {
    for (const a of list ?? []) {
      if (a.family === 'IPv4' && !a.internal) return a.address;
    }
  }
  throw new Error('No LAN IPv4 address found; pass --host explicitly');
}

export function iosDriver(target: Target, hostOverride?: string): DeviceDriver {
  const sim = target.kind === 'simulator';
  return {
    target,
    async prepare(port) {
      if (hostOverride) return hostOverride;
      return sim ? `127.0.0.1:${port}` : `${lanAddress()}:${port}`;
    },
    async isInstalled(bundleId) {
      if (sim) return !!(await tryRun('xcrun', ['simctl', 'get_app_container', target.id, bundleId]));
      try {
        const data = await devicectlJson(['device', 'info', 'apps', '--device', target.id, '--bundle-id', bundleId]);
        return (data?.result?.apps ?? []).length > 0;
      } catch {
        return false;
      }
    },
    async launchUrl(bundleId, url) {
      if (sim) {
        await tryRun('xcrun', ['simctl', 'terminate', target.id, bundleId]);
        await run('xcrun', ['simctl', 'openurl', target.id, url]);
      } else {
        await run('xcrun', [
          'devicectl', 'device', 'process', 'launch',
          '--device', target.id, '--terminate-existing', '--payload-url', url, bundleId,
        ]);
      }
    },
    async stop(bundleId) {
      if (sim) await tryRun('xcrun', ['simctl', 'terminate', target.id, bundleId]);
      // Physical devices: the next launch uses --terminate-existing.
    },
    async screenshot(outPath) {
      if (!sim) throw new Error('Screenshots of physical iOS devices are not scriptable; use the simulator or QuickTime');
      await run('xcrun', ['simctl', 'io', target.id, 'screenshot', outPath]);
    },
    async describe() {
      return { name: target.name, kind: target.kind, osVersion: target.osVersion ?? 'unknown' };
    },
  };
}
