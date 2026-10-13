#!/usr/bin/env bash
# Release build for the iOS simulator (or a device with IOS_SDK=iphoneos TEAM=<id>) into apps/native-ios/build; prints the .app path.
# Usage: scripts/build-ios.sh [extra xcodebuild args]
set -euo pipefail
SDK="${IOS_SDK:-iphonesimulator}"
if [ "$SDK" = iphoneos ]; then
  DEST='generic/platform=iOS'; SIGN=(-allowProvisioningUpdates DEVELOPMENT_TEAM="${TEAM:?TEAM is required for device builds}" CODE_SIGN_STYLE=Automatic CODE_SIGN_IDENTITY="Apple Development")
else
  DEST='generic/platform=iOS Simulator'; SIGN=()
fi
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DERIVED="$APP_DIR/build"
LOG="$DERIVED/xcodebuild.log"
mkdir -p "$DERIVED"
if ! xcodebuild \
  -project "$APP_DIR/NativeIOS.xcodeproj" \
  -scheme NativeIOS \
  -configuration Release \
  -sdk "$SDK" \
  -destination "$DEST" \
  -derivedDataPath "$DERIVED" \
  ARCHS="$([ "$SDK" = iphoneos ] && echo arm64 || uname -m)" ONLY_ACTIVE_ARCH=YES \
  COMPILER_INDEX_STORE_ENABLE=NO \
  ${SIGN[@]+"${SIGN[@]}"} "$@" build > "$LOG" 2>&1; then
  grep -E "error:|BUILD FAILED" "$LOG" | head -40 >&2 || tail -40 "$LOG" >&2
  echo "build failed; full log: $LOG" >&2
  exit 1
fi
APP="$DERIVED/Build/Products/Release-$SDK/NativeIOS.app"
[ -d "$APP" ] || { echo "build succeeded but $APP is missing" >&2; exit 1; }
echo "$APP"
