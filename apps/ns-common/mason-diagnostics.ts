import { gc } from './clock';

declare const org: any;
declare const java: any;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Leak check for Mason apps (Android): collect JS, then Java (so JS-released
 * views/nodes become unreachable and their Cleaners free the Rust nodes), then
 * read Mason.debugStats(). Builds without that API (the published beta)
 * report only { debugStats: 0 }.
 */
export async function masonDiagnostics(): Promise<Record<string, number>> {
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
