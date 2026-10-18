#!/usr/bin/env bash
# Release-build the iOS apps into build/ios/<app>.app (build/ios-device/ for a device) and install them.
# Usage: scripts/build-ios.sh <simulator-or-device-udid> [app ...]   (default: every app with an iOS build)
# Device builds sign automatically with TEAM=<your Apple team id>. DartNative has no simulator release build.
# The harness `build` command covers Android only; this is the iOS counterpart.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
UDID="${1:?usage: scripts/build-ios.sh <simulator-or-device-udid> [app ...]}"; shift || true
APPS=("$@")
if [ ${#APPS[@]} -eq 0 ]; then
  APPS=(ns-core ns-core-mason ns-angular-mason ns-vue-mason ns-react-mason ns-svelte-mason ns-solid-mason
        react-native lynx native-ios native-ios-swiftui native-ios-mason)
fi
if xcrun simctl list devices | grep -q "$UDID"; then
  DEVICE=0; SDK=iphonesimulator; DEST='generic/platform=iOS Simulator'; SIGN=(ARCHS="$(uname -m)" ONLY_ACTIVE_ARCH=YES)
else
  DEVICE=1; SDK=iphoneos; DEST='generic/platform=iOS'
  export TEAM="${TEAM:?set TEAM to your Apple development team id for device builds}"
  SIGN=(-allowProvisioningUpdates DEVELOPMENT_TEAM="$TEAM" CODE_SIGN_STYLE=Automatic CODE_SIGN_IDENTITY="Apple Development")
fi
export IOS_SDK="$SDK"
export LANG="${LANG:-en_US.UTF-8}" LC_ALL="${LC_ALL:-en_US.UTF-8}"   # CocoaPods needs a UTF-8 locale
SUFFIX="$([ "$DEVICE" = 1 ] && echo -device || true)"
OUT="$ROOT/build/ios$SUFFIX"; LOGS="$ROOT/build/logs"; DD="$ROOT/build/ios-derived$SUFFIX"
mkdir -p "$OUT" "$LOGS"
cd "$ROOT" && npm run bench -- sync >/dev/null

xcode_app() { # <workspace> <scheme> <log> -> prints the built .app
  xcodebuild -workspace "$1" -scheme "$2" -configuration Release -sdk "$SDK" \
    -destination "$DEST" -derivedDataPath "$DD/$2" ${SIGN[@]+"${SIGN[@]}"} build > "$3" 2>&1 &&
  find "$DD/$2/Build/Products/Release-$SDK" -maxdepth 1 -name '*.app' | head -1
}

build_one() { # <app> <log> <dest> -> prints the built .app
  case "$1" in
    ns-*)
      rm -rf "$3"
      if [ "$DEVICE" = 1 ]; then
        (cd "$ROOT/apps/$1" && ns build ios --release --for-device --team-id "$TEAM" > "$2" 2>&1) &&
          find "$ROOT/apps/$1/platforms/ios/build/Release-iphoneos" -path '*.xcarchive/Products/Applications/*.app' -maxdepth 4 | head -1
      else
        (cd "$ROOT/apps/$1" && ns build ios --release --copy-to "$3" > "$2" 2>&1) && echo "$3"
      fi ;;
    dartnative)
      [ "$DEVICE" = 1 ] || { echo "dartnative: no release build for the simulator" >&2; return 1; }
      printf 'DEVELOPMENT_TEAM = %s\nCODE_SIGN_STYLE = Automatic\n' "$TEAM" > "$ROOT/apps/dartnative/ios/DartNative/Team.xcconfig"
      (cd "$ROOT/apps/dartnative" && PATH="$HOME/zero/bin:$PATH" &&
        dn build ios --release --dart-define=DN_VERSION="$(dn --version 2>/dev/null | sed -n 's/^DartNative \([^ ]*\).*/\1/p' | head -1)" > "$2" 2>&1) &&
        echo "$ROOT/apps/dartnative/build/ios/iphoneos/Runner.app" ;;
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
  if [ "$DEVICE" = 1 ]; then
    xcrun devicectl device install app --device "$UDID" "$dest" > /dev/null && echo "   installed $dest"
  else
    xcrun simctl install "$UDID" "$dest" && echo "   installed $dest"
  fi
done
[ ${#failed[@]} -eq 0 ] || { echo "failed: ${failed[*]}" >&2; exit 1; }
