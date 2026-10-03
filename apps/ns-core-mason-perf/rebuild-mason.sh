#!/usr/bin/env bash
# Point ns-core-mason-perf at a local masonkit build, for A/B work on Mason itself.
# Usage: apps/ns-core-mason-perf/rebuild-mason.sh [--ios] [path/to/nativescript-mason]
#   default checkout: ../nativescript-mason next to this repo
#   --ios also rebuilds the iOS simulator framework (otherwise the committed one is used)
set -euo pipefail
APP_DIR="$(cd "$(dirname "$0")" && pwd)"
IOS=0
if [ "${1:-}" = "--ios" ]; then IOS=1; shift; fi
MASON="$(cd "${1:-$APP_DIR/../../../nativescript-mason}" && pwd)"
PKG="$MASON/packages/nativescript-masonkit"
export ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}" PATH="$HOME/.cargo/bin:$PATH"

(cd "$PKG/src-native/mason-android" &&
  ./gradlew :masonkit:assembleRelease -Prust.targets=arm64 --no-daemon --console=plain -q)
(cd "$MASON" && npx nx run nativescript-masonkit:build.all --skip-nx-cache >/dev/null)
cp "$PKG/src-native/mason-android/masonkit/build/outputs/aar/masonkit-release.aar" \
  "$MASON/dist/packages/nativescript-masonkit/platforms/android/masonkit-release.aar"

if [ "$IOS" = 1 ]; then
  BUILD="$(mktemp -d)"
  (cd "$PKG/src-native/mason-ios" && xcodebuild -project Mason/Mason.xcodeproj -scheme Mason -sdk iphonesimulator \
    -destination 'generic/platform=iOS Simulator' -configuration Release build BUILD_DIR="$BUILD" \
    SKIP_INSTALL=NO BUILD_LIBRARY_FOR_DISTRIBUTION=YES -quiet)
  SLICE="$MASON/dist/packages/nativescript-masonkit/platforms/ios/Mason.xcframework/ios-arm64_x86_64-simulator"
  rm -rf "${SLICE:?}/Mason.framework" && cp -R "$BUILD/Release-iphonesimulator/Mason.framework" "$SLICE/"
fi

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
