#!/usr/bin/env bash
set -euo pipefail
APP_DIR="$(cd "$(dirname "$0")" && pwd)"
MASON="$(cd "${1:-$APP_DIR/../../../nativescript-mason-perf}" && pwd)"
export ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}" PATH="$HOME/.cargo/bin:$PATH"

(cd "$MASON/packages/nativescript-masonkit/src-native/mason-android" &&
  ./gradlew :masonkit:assembleRelease -Prust.targets=arm64 --no-daemon --console=plain -q)
(cd "$MASON" && npx nx run nativescript-masonkit:build --skip-nx-cache >/dev/null)
cp "$MASON/packages/nativescript-masonkit/src-native/mason-android/masonkit/build/outputs/aar/masonkit-release.aar" \
  "$MASON/dist/packages/nativescript-masonkit/platforms/android/masonkit-release.aar"

SHA="$(git -C "$MASON" rev-parse --short HEAD)$(git -C "$MASON" diff --quiet HEAD -- packages crates || echo -dirty-$(date +%s))"
TMP="$(mktemp -d)"
(cd "$MASON/dist/packages/nativescript-masonkit" && npm pack --pack-destination "$TMP" >/dev/null)
mkdir -p "$APP_DIR/vendor" && rm -f "$APP_DIR"/vendor/*.tgz
mv "$TMP"/*.tgz "$APP_DIR/vendor/masonkit-perf-$SHA.tgz"
cd "$APP_DIR"
node -e '
const fs = require("fs"); const p = JSON.parse(fs.readFileSync("package.json"));
p.dependencies["@triniwiz/nativescript-masonkit"] = "file:vendor/masonkit-perf-'"$SHA"'.tgz";
fs.writeFileSync("package.json", JSON.stringify(p, null, 2) + "\n");'
rm -rf node_modules/@triniwiz package-lock.json
npm install --no-audit --no-fund >/dev/null
echo "masonkit-perf-$SHA installed"
