#!/usr/bin/env bash
# Release-build the iOS apps for the simulator into build/ios/<app>.app and install them.
# Usage: scripts/build-ios.sh <simulator-udid> [app ...]   (default: every app with an iOS build)
# The harness `build` command covers Android only; this is the iOS counterpart.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SIM="${1:?usage: scripts/build-ios.sh <simulator-udid> [app ...]}"; shift || true
APPS=("$@")
if [ ${#APPS[@]} -eq 0 ]; then
  APPS=(ns-core ns-core-mason ns-angular-mason ns-vue-mason ns-react-mason ns-svelte-mason ns-solid-mason
        react-native lynx native-ios native-ios-swiftui native-ios-mason)
fi
export LANG="${LANG:-en_US.UTF-8}" LC_ALL="${LC_ALL:-en_US.UTF-8}"   # CocoaPods needs a UTF-8 locale
OUT="$ROOT/build/ios"; LOGS="$ROOT/build/logs"; DD="$ROOT/build/ios-derived"
mkdir -p "$OUT" "$LOGS"
cd "$ROOT" && npm run bench -- sync >/dev/null

xcode_app() { # <workspace> <scheme> <log> -> prints the built .app
  xcodebuild -workspace "$1" -scheme "$2" -configuration Release -sdk iphonesimulator \
    -destination 'generic/platform=iOS Simulator' -derivedDataPath "$DD/$2" build > "$3" 2>&1
  find "$DD/$2/Build/Products/Release-iphonesimulator" -maxdepth 1 -name '*.app' | head -1
}

build_one() { # <app> <log> <dest> -> prints the built .app
  case "$1" in
    ns-*)
      rm -rf "$3"
      (cd "$ROOT/apps/$1" && ns build ios --release --copy-to "$3" > "$2" 2>&1) && echo "$3" ;;
    react-native)
      xcode_app "$ROOT/apps/react-native/ios/XplatBenchRN.xcworkspace" XplatBenchRN "$2" ;;
    lynx)
      (cd "$ROOT/apps/lynx/bundle" && npm run build > "$2" 2>&1 && cp dist/main.lynx.bundle ../hosts/ios/main.lynx.bundle) &&
        xcode_app "$ROOT/apps/lynx/hosts/ios/Hello-Lynx.xcworkspace" Hello-Lynx "$2" ;;
    native-ios*|ng-native)
      "$ROOT/apps/$1/scripts/build-ios.sh" 2> "$2" | tail -1 ;;
    *) echo "unknown app $1" >&2; return 1 ;;
  esac
}

failed=()
for app in "${APPS[@]}"; do
  log="$LOGS/$app-ios.log"; dest="$OUT/$app.app"
  echo "== $app"
  built="$(build_one "$app" "$log" "$dest" || true)"
  if [ -z "$built" ] || [ ! -d "$built" ]; then
    echo "   FAILED, see $log"; failed+=("$app"); continue
  fi
  if [ "$built" != "$dest" ]; then rm -rf "$dest"; cp -R "$built" "$dest"; fi
  xcrun simctl install "$SIM" "$dest" && echo "   installed $dest"
done
[ ${#failed[@]} -eq 0 ] || { echo "failed: ${failed[*]}" >&2; exit 1; }
