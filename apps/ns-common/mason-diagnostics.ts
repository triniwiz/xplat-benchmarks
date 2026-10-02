import { gc } from './clock';

declare const org: any;
declare const java: any;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

declare const NSCMason: any;

export async function masonDiagnostics(): Promise<Record<string, number>> {
  if (__APPLE__) return iosDiagnostics();
  if (!__ANDROID__) return {};
  for (let i = 0; i < 2; i++) {
    gc();
    java.lang.System.gc();
    java.lang.System.runFinalization();
    await sleep(1000);
  }
  const mason = org.nativescript.mason.masonkit.Mason.getShared();
  if (typeof mason.debugStats !== 'function') return { debugStats: 0 };
  const out: Record<string, number> = {};
  const it = mason.debugStats().entrySet().iterator();
  while (it.hasNext()) {
    const e = it.next();
    out[String(e.getKey())] = Number(e.getValue());
  }
  return out;
}

async function iosDiagnostics(): Promise<Record<string, number>> {
  for (let i = 0; i < 2; i++) {
    gc();
    await sleep(1000);
  }
  const mason = NSCMason.shared;
  if (typeof mason?.debugStats !== 'function') return { debugStats: 0 };
  const stats = mason.debugStats();
  const out: Record<string, number> = {};
  const keys = stats.allKeys;
  for (let i = 0; i < keys.count; i++) {
    const key = keys.objectAtIndex(i);
    out[String(key)] = Number(stats.objectForKey(key));
  }
  return out;
}
