import { File, Utils } from '@nativescript/core';

declare const __startCPUProfiler: undefined | ((name: string) => void);
declare const __stopCPUProfiler: undefined | ((name: string) => boolean);

export function profileStart(label: string): void {
  if (typeof __startCPUProfiler === 'function') __startCPUProfiler(label);
}

export function profileStop(label: string): string | undefined {
  if (typeof __stopCPUProfiler !== 'function') return undefined;
  const stopped = __stopCPUProfiler(label) as unknown;
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
