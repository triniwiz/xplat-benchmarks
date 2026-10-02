import { File, Folder, Utils, knownFolders } from '@nativescript/core';

declare const __startCPUProfiler: undefined | ((name: string, intervalUs?: number) => void);
declare const __stopCPUProfiler: undefined | ((name: string) => boolean);

export function profileStart(label: string): void {
  if (typeof __startCPUProfiler === 'function') __startCPUProfiler(label, 200);
}

export function profileStop(label: string): string | undefined {
  if (typeof __stopCPUProfiler !== 'function') return undefined;
  const stopped = __stopCPUProfiler(label) as unknown;
  if (__APPLE__) return readIosProfile(label, stopped);
  if (!__ANDROID__) return undefined;
  const app = Utils.android.getApplicationContext() as android.content.Context;
  const dirs = [app.getFilesDir(), app.getCacheDir(), app.getExternalFilesDir(null), app.getFilesDir().getParentFile()];
  for (const dir of dirs) {
    const found = dir?.listFiles();
    if (!found) continue;
    for (let i = 0; i < found.length; i++) {
      const f = found[i];
      const name = f.getName();
      if (!name.endsWith('.cpuprofile') || name.indexOf(`-${label}-`) < 0) continue;
      const path = f.getAbsolutePath();
      const text = File.fromPath(path).readTextSync();
      f.delete();
      if (!text) throw new Error(`${path} is empty`);
      return text;
    }
  }
  throw new Error(`__stopCPUProfiler returned ${stopped}; no ${label} .cpuprofile in ${dirs.map((d) => d?.getAbsolutePath()).join(', ')}`);
}

function readIosProfile(label: string, stopped: unknown): string {
  const docs: Folder = knownFolders.documents();
  const found = docs.getEntitiesSync().filter((e) => e.name.endsWith('.cpuprofile') && e.name.indexOf(`-${label}-`) >= 0);
  if (!found.length) throw new Error(`__stopCPUProfiler returned ${stopped}; no ${label} .cpuprofile in ${docs.path}`);
  found.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
  const file = File.fromPath(found[0].path);
  const text = file.readTextSync();
  for (const e of found) File.fromPath(e.path).removeSync();
  if (!text) throw new Error(`${file.path} is empty`);
  return text;
}
