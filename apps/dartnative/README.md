# dartnative

The [DartNative](https://dartnative.com) stack: Flutter-style widgets in AOT Dart, mounted as real UIKit / Android views and laid out by Yoga on the main thread. The scenarios, generator, hash and runner are Dart ports in `lib/` (`lib/bench/` is plain Dart and runs under `dn test`).

## Setup

1. Install the `dn` CLI (unpacks to `~/zero` and adds `~/zero/bin` to your shell profile):
   ```sh
   curl -fsSL https://cdn.dartnative.com/install.sh | sh
   dn --version     # first run downloads the engine (a few hundred MB)
   dn doctor        # Android needs SDK 36 / build-tools 36
   ```
2. Set a licence key. Apps other than DartNative's official demos need one (subscription at [dartpub.dev/framework](https://dartpub.dev/framework)); without it the app shows "App Temporarily Unavailable".
   ```sh
   dn config --license-key dnk_...
   ```
   The key is compiled into each build; at launch the app exchanges it for a token in the background (needs network).
3. Check the fixtures match the TypeScript generator:
   ```sh
   cd apps/dartnative && dn test
   ```

## Android

Release APK (arm64, AOT), installed and compiled ahead of time like the other apps:

```sh
npm run bench -- build --platform android --install --device <serial> --apps dartnative
npm run bench -- run --platform android --device <serial> --apps dartnative,native-android --sizes S,M --rounds 3
```

`scripts/build-android.sh [out.apk]` is the build step on its own. `MainActivity` copies the launch URL into `XPLATBENCH_URL` before Dart starts.

## iOS

`dn` has no release mode for the simulator (debug/JIT only), so iOS numbers need a physical device. Release builds sign automatically with your Apple development team (`TEAM`; for the dartnative app the script writes it to the gitignored `ios/DartNative/Team.xcconfig`):

```sh
TEAM=<team-id> scripts/build-ios.sh <device-id> dartnative   # CoreDevice id from `xcrun devicectl list devices`
npm run bench -- devices                                    # the harness uses the hardware UDID
npm run bench -- run --platform ios --device <hardware-udid> --apps dartnative,native-ios --sizes S,M --rounds 3
```

- Keep the device unlocked (Auto-Lock: Never) and on the Mac's Wi-Fi; tap Allow on the Local Network prompt on the first launch of each app.
- Dart's `Platform.environment` is empty on iOS, so `AppDelegate.swift` writes `XPLATBENCH_URL` and the device model to `tmp/xplatbench-launch` for Dart to read.

## Debugging

- A blank subtree usually means an unsupported widget: look for `DN-FALLBACK` in logcat (`FractionallySizedBox` is one, despite the docs).
- `dn analyze` before building; `adb logcat | grep dartnative` for Android logs.
