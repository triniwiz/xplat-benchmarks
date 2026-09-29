import { File, Utils } from '@nativescript/core';

// JS CPU profiles through the NativeScript Android runtime's profiler globals
// (bench run --cpu-profile). The runtime writes <dir>/<app>-<name>-<sec>.<usec>.cpuprofile
// into the app's private storage; the app reads it back and sends it to the harness,
// since release builds can't be pulled with run-as.
//
// As of @nativescript/android 9 (2026-09), __stopCPUProfiler returns false and writes
// nothing: start and stop each create their own v8::CpuProfiler, so stop never finds
// the profile. profileStop then throws, and the runner reports it as <case>.error.txt.

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
