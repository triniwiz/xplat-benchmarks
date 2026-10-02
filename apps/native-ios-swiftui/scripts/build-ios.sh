#!/usr/bin/env bash
# Release build for the iOS simulator into apps/native-ios-swiftui/build; prints the .app path.
# Usage: scripts/build-ios.sh [extra xcodebuild args]
set -euo pipefail
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DERIVED="$APP_DIR/build"
LOG="$DERIVED/xcodebuild.log"
mkdir -p "$DERIVED"
if ! xcodebuild \
  -project "$APP_DIR/NativeIOSSwiftUI.xcodeproj" \
  -scheme NativeIOSSwiftUI \
  -configuration Release \
  -sdk iphonesimulator \
  -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath "$DERIVED" \
  ARCHS="$(uname -m)" ONLY_ACTIVE_ARCH=YES \
  COMPILER_INDEX_STORE_ENABLE=NO \
  "$@" build > "$LOG" 2>&1; then
  grep -E "error:|BUILD FAILED" "$LOG" | head -40 >&2 || tail -40 "$LOG" >&2
  echo "build failed; full log: $LOG" >&2
  exit 1
fi
APP="$DERIVED/Build/Products/Release-iphonesimulator/NativeIOSSwiftUI.app"
[ -d "$APP" ] || { echo "build succeeded but $APP is missing" >&2; exit 1; }
echo "$APP"
