#!/bin/bash
# Release APK (arm64, AOT) with the DartNative version compiled in; copies it to $1 when given.
set -euo pipefail
cd "$(dirname "$0")/.."
export PATH="$HOME/zero/bin:$PATH"
VERSION="$(dn --version 2>/dev/null | sed -n 's/^DartNative \([^ ]*\).*/\1/p' | head -1)"
dn build apk --release --target-platform android-arm64 --dart-define=DN_VERSION="$VERSION"
APK=build/app/outputs/dn-apk/app-release.apk
if [ -n "${1:-}" ]; then cp "$APK" "$1"; fi
echo "$APK"
