#!/bin/bash
# Release simulator build: expo prebuild, pass XPLATBENCH_URL to JS as the launchUrl initial prop, xcodebuild.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT="${1:-build/ios}"
npx expo prebuild -p ios --clean
DELEGATE=ios/XplatBenchNG/AppDelegate.swift
FROM='factory.startReactNative(withModuleName: "main", in: window, launchOptions: launchOptions)'
TO='factory.startReactNative(withModuleName: "main", in: window, initialProperties: ["launchUrl": ProcessInfo.processInfo.environment["XPLATBENCH_URL"] ?? ""], launchOptions: launchOptions)'
grep -qF "$FROM" "$DELEGATE" || { echo "SceneDelegate start call not found in $DELEGATE"; exit 1; }
python3 -c "import sys; p,f,t=sys.argv[1:]; s=open(p).read(); open(p,'w').write(s.replace(f,t))" "$DELEGATE" "$FROM" "$TO"
xcodebuild -workspace ios/XplatBenchNG.xcworkspace -scheme XplatBenchNG -configuration Release -sdk iphonesimulator \
  -destination "generic/platform=iOS Simulator" -derivedDataPath "$OUT" build
find "$OUT/Build/Products/Release-iphonesimulator" -maxdepth 1 -name "*.app"
