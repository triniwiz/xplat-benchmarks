#!/usr/bin/env bash
# Compiles the Swift fixture port for macOS and compares every hash with scenarios/fixtures/manifest.json.
set -euo pipefail
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ROOT="$(cd "$APP_DIR/../.." && pwd)"
OUT="$APP_DIR/build/selfcheck"
mkdir -p "$OUT"
xcrun swiftc -O -o "$OUT/hashcheck" "$APP_DIR"/NativeIOS/Fixtures/*.swift "$APP_DIR/selfcheck/main.swift"
"$OUT/hashcheck" > "$OUT/hashes.txt"
node -e '
const fs = require("fs");
const m = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
const lines = fs.readFileSync(process.argv[2], "utf8").trim().split("\n");
let bad = 0;
for (const l of lines) {
  const [k, h] = l.split(" ");
  const want = m[k] && m[k].hash;
  const ok = want === h;
  if (!ok) bad++;
  console.log(`${ok ? "ok  " : "FAIL"} ${k.padEnd(20)} swift ${h} manifest ${want}`);
}
const missing = Object.keys(m).filter((k) => !lines.some((l) => l.startsWith(k + " ")));
for (const k of missing) { bad++; console.log(`MISSING ${k}`); }
console.log(bad ? `${bad} mismatches` : `all ${lines.length} hashes match manifest.json`);
process.exit(bad ? 1 : 0);
' "$ROOT/scenarios/fixtures/manifest.json" "$OUT/hashes.txt"
