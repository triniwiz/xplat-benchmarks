#!/usr/bin/env bash
# Release build for the iOS simulator (arm64) into apps/native-ios-mason/build; prints the .app path.
# Mason comes from vendor/Mason.xcframework. If it is missing, it is copied from a nativescript-mason
# checkout's dist (MASON_REPO, default ../nativescript-mason next to this repo), with its version.
# Usage: scripts/build-ios.sh [extra xcodebuild args]
set -euo pipefail
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ROOT="$(cd "$APP_DIR/../.." && pwd)"
DERIVED="$APP_DIR/build"
LOG="$DERIVED/xcodebuild.log"
VENDOR="$APP_DIR/vendor"
MASON_REPO="${MASON_REPO:-$(cd "$ROOT/.." && pwd)/nativescript-mason}"
mkdir -p "$DERIVED" "$VENDOR"
if [ ! -d "$VENDOR/Mason.xcframework" ]; then
  SRC="$MASON_REPO/dist/packages/nativescript-masonkit/platforms/ios/Mason.xcframework"
  [ -d "$SRC" ] || { echo "no $VENDOR/Mason.xcframework and no $SRC to copy (set MASON_REPO)" >&2; exit 1; }
  cp -R "$SRC" "$VENDOR/"
  sed -n 's/^ *"version": *"\([^"]*\)".*/\1/p' "$MASON_REPO/packages/nativescript-masonkit/package.json" | head -1 > "$VENDOR/MASON_VERSION"
fi
MASON_VERSION="$(cat "$VENDOR/MASON_VERSION" 2>/dev/null || echo unknown)"
if ! xcodebuild \
  -project "$APP_DIR/NativeIOSMason.xcodeproj" \
  -scheme NativeIOSMason \
  -configuration Release \
  -sdk iphonesimulator \
  -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath "$DERIVED" \
  ARCHS=arm64 ONLY_ACTIVE_ARCH=YES \
  COMPILER_INDEX_STORE_ENABLE=NO \
  MASON_VERSION="$MASON_VERSION" \
  "$@" build > "$LOG" 2>&1; then
  grep -E "error:|BUILD FAILED" "$LOG" | head -40 >&2 || tail -40 "$LOG" >&2
  echo "build failed; full log: $LOG" >&2
  exit 1
fi
APP="$DERIVED/Build/Products/Release-iphonesimulator/NativeIOSMason.app"
[ -d "$APP" ] || { echo "build succeeded but $APP is missing" >&2; exit 1; }
echo "$APP"
