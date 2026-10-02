# xplat-benchmarks

This repo benchmarks layout performance and CSS support on deep and heavy layouts across cross-platform frameworks, on iOS and Android. NativeScript is the main subject and is tested in three variants. React Native and Lynx are the comparison stacks.

| App | Stack | Status |
|---|---|---|
| `ns-core` | NativeScript Core with plain layouts (StackLayout, GridLayout, FlexboxLayout) and core CSS | running |
| `ns-core-mason` | NativeScript Core with [`@triniwiz/nativescript-masonkit`](https://github.com/triniwiz/nativescript-mason), Mason-native (Mason root, Scroll, Ul) | running |
| `ns-angular-mason` | NativeScript Angular 22 (zoneless, OnPush) + Mason | running |
| `ns-vue-mason` | nativescript-vue 3 + Mason | running |
| `ns-react-mason` | NativeScript React 19 (`@nativescript-community/react`, dominative) + Mason | running |
| `ns-svelte-mason` | svelte-native 1.0 (Svelte 4) + Mason | running |
| `ns-solid-mason` | `@nativescript-community/solid-js` (dominative) + Mason | running |
| `react-native` | React Native 0.87.1 bare CLI, Fabric, Hermes, FlashList v2 | running |
| `lynx` | ReactLynx (rspeedy) bundle in a minimal native host on Lynx SDK 4.1.0 | running |
| `ng-native` | Angular Native (Expo host) | running (iOS) |
| `ns-core-mason-perf` | `ns-core-mason` on a local masonkit build (`rebuild-mason.sh`), for A/B work on Mason itself | running |

Native baselines, no framework and no JS. Each one ports the seeded generator, data hash and runner to Swift or Kotlin and builds every scenario by hand:

| App | Stack |
|---|---|
| `native-ios` | Swift + UIKit, Auto Layout with nested `UIStackView`s |
| `native-ios-swiftui` | SwiftUI in a `UIHostingController` (custom `Layout`s for wrap and weighted rows, `LazyVStack` for the list) |
| `native-ios-mason` | Swift + Mason's Swift API (`MasonUIView`, `MasonText`), UIKit scroll host |
| `native-android` | Kotlin + Android Views (`FlexboxLayout`, `RecyclerView`) |
| `native-android-compose` | Jetpack Compose (`FlowRow`, `LazyColumn`), foundation only |
| `native-android-mason` | Kotlin + Mason's Kotlin API, all-Mason frame like the NS Mason apps |

The Android baselines share their fixtures, hash and runner through `apps/native-android-common`.

`ns-core` and `ns-core-mason` are a controlled pair. They build identical trees with the same imperative helper; only the element classes and the CSS differ. Comparing them isolates the layout engine. Every `ns-*-mason` app shares one stylesheet and the same element structure, so comparing any of them with `ns-core-mason` isolates the cost of that framework.

The Mason apps share these pieces:
- **Frame:** Mason end to end (Mason root, status `Text`, Mason `Scroll` host, Mason `Ul`). The window root is a core `GridLayout` whose only job is to apply the Android edge-to-edge insets.
- **Controller:** declarative frameworks drive the same controller, [apps/ns-common/controller.ts](apps/ns-common/controller.ts).
- **List cells:** each framework has a small bridge that renders `Ul` item templates with its own components.
- **Deviations:** known deviations are listed in every report (see `notes` in [harness/src/apps.ts](harness/src/apps.ts)).

## What is measured

| Metric | How | Where |
|---|---|---|
| Mount / first layout | In-app runner: from `t0` to the moment the tree is "painted" (see below). Median and p90 over 20 iterations × 3 rounds. | in-app, all stacks |
| Relayout / update | In-app runner: a named mutation on a mounted tree (resize, restyle every node, insert/remove 100), timed to "painted". | in-app, all stacks |
| Scroll FPS / jank | Real fling gestures injected by the OS test framework. On Android: Macrobenchmark `FrameTimingMetric`. On iOS: XCUITest `XCTOSSignpostMetric.scrollingAndDecelerationMetric` (hitch ratio). | external drivers (phase 4) |
| Cold start | Android: Macrobenchmark `StartupTimingMetric`. iOS: `XCTApplicationLaunchMetric`. | external drivers (phase 4) |
| Memory | Android: `MemoryUsageMetric`. iOS: `XCTMemoryMetric`. Measured on the heavy scenarios, opened via deep link. | external drivers (phase 4) |
| CSS support | About 30 single-feature probes, screenshotted and pixel-diffed against headless Chromium. Output is a pass / partial / fail matrix. | `bench css` (phase 5) |

The scenarios are described in [scenarios/spec.md](scenarios/spec.md): nested-chain, tree-fanout, flex-wrap-tiles, grid-dashboard, text-flow, styled-cards, relayout-resize, relayout-style, insert-remove, list-scroll and scroll-plain. Each comes in three sizes, S, M and L, so the results show how a stack scales, not a single data point.

### "Painted"

Each scenario root ends with a 1 dp sentinel view. Mount or mutation time runs from `t0` (just before the framework is told to render) until the sentinel's layout callback has fired and one more frame has run:

| Stack | End of measurement |
|---|---|
| NativeScript (all three) | Sentinel `layoutChanged`, then `requestAnimationFrame` ×2 |
| React Native | Sentinel `onLayout` (Fabric), then `requestAnimationFrame` |
| Lynx | `PipelineEntry.paintEnd` from `lynx.performance`, for a `__lynx_timing_flag` on the root. Uses the same Unix-ms clock as `t0`. Also reports `layoutStart`/`layoutEnd` as a phase breakdown. |

The native baselines take the same marks: a sentinel's layout callback (UIKit `layoutSubviews`, SwiftUI a tiny `UIViewRepresentable`, Android an `OnLayoutChangeListener`, Compose `onGloballyPositioned`), then one `CADisplayLink` or Choreographer frame. One difference matters when comparing mutations: in the iOS baselines `setNeedsLayout` waits for UIKit's next update (about 16.5 ms at 60 Hz on the simulator) before any work runs, while the NativeScript apps lay out in the same turn. Compare mutation numbers within the native group, or measure work with a synchronous `layoutIfNeeded`.

Every app runs the same runner, [scenarios/src/runner.ts](scenarios/src/runner.ts), which handles warmup, iterations, unmount, GC hints and reporting. Each app only implements `mount`, `mutate` and `unmount`.

### Fairness rules

- **Same data everywhere.** Fixtures are generated inside each app from a seeded PRNG ([scenarios/src/generate.ts](scenarios/src/generate.ts)), so no JSON is bundled and none is parsed at startup. Each app reports the hash of the data it generated, and `bench report` flags any mismatch against [scenarios/fixtures/manifest.json](scenarios/fixtures/manifest.json).
- **Same look everywhere.** Every app is checked against the browser reference in `scenarios/reference/` before its numbers count.
- **Release builds.** Published numbers come from real devices. Simulator and emulator runs are smoke tests, and the report marks them.
- **Randomized order.** App order is shuffled each round, apps cool down in between, and thermal status is recorded (Android).
- **Idiomatic code.** Each stack uses its own conventions: GridLayout in NS core, Angular signals with `@for` and OnPush, RN `StyleSheet`, and the recycling lists each ecosystem recommends (ListView / Mason `Ul` / FlashList / `<list>`). RN's view flattening stays on; the report notes it where it matters.

## Running

Requirements: Node 22 or later, Xcode, the Android SDK, and the NativeScript CLI (`ns`).

```bash
npm install
npm run fixtures            # regenerate fixtures, the manifest and the browser reference
npm test                    # determinism, protocol end-to-end, stats
npm run bench -- devices    # list connected targets
npm run bench -- sync       # copy scenarios/src into every app (the harness does this before builds)

# In-app layout suite (the apps must be installed; release builds):
npm run bench -- run --platform android --rounds 3
npm run bench -- run --platform ios --device <udid> --apps ns-core,ns-core-mason --scenarios mount --sizes S,M

# Open one scenario on screen, e.g. to check visual parity:
npm run bench -- show --platform android --app ns-core-mason --scenario grid-dashboard --size S --screenshot /tmp/dash.png

npm run bench -- report results/<folder>
```

- **How the app reaches the harness.**
  - The harness serves plans and collects results on port 9797.
  - Android reaches it through `adb reverse`.
  - Physical iOS devices reach the Mac's LAN IP over Wi-Fi; pass `--host ip:port` to override it.
- **Launching.** Apps are launched cold with `xplatbench://run?host=…&run=…`. `xplatbench://show?scenario=…&size=…` mounts one scenario and leaves it on screen.
- **Output.** Results go to `results/<date>-<device>-<platform>/`: one JSON file per round and app, plus `REPORT.md`.

### Device hygiene

For numbers you intend to publish:
- Charge the device, turn on airplane mode, and set a fixed brightness.
- Close background apps.
- Let the device cool down between suites; the harness waits `--app-cooldown` seconds, 20 by default, between apps.
- Test at least one mid-range Android phone, not only flagships.

On an emulator:
- **Compile every app ahead of time after each install.** A fresh `adb install` leaves an app at dexopt `verify` (interpreted, then JIT), which runs about 9x slower and drifts run to run: `adb shell cmd package compile -m speed -f <package>`.
- **Give the AVD enough RAM** (8 GB). With several large APKs installed, 4 GB swaps during a run and stalls whole scenarios.
- **Sanity-check before trusting a run**: native-android flex-wrap M should take about 100 ms. A busy host (load above its core count) starves the emulator the same way.
- Prefer a real device for anything you publish.

## Results

Curated runs live in `results/` (committed with `-f`). The latest ones:

**iOS, iPhone 17 Pro Max simulator, 2026-10-02** ([report](results/2026-10-02-iphone17promax-sim-full/REPORT.md)), masonkit from [nativescript-mason#76](https://github.com/triniwiz/nativescript-mason/pull/76), 3 rounds. Geometric mean of medians against UIKit, lower is faster. Mutations are compared within the native group only (see "Painted").

| | mount S | mount M | mutate S | mutate M |
|---|---:|---:|---:|---:|
| UIKit | 1.00 | 1.00 | 1.00 | 1.00 |
| SwiftUI | 0.82 | 0.77 | 1.49 | 4.44 |
| UIKit + Mason | 0.71 | 0.54 | 1.03 | 1.11 |
| NativeScript Core + Mason | 0.90 | 0.95 | | |
| NativeScript Core | 1.39 | 1.54 | | |
| React Native | 0.68 | 0.73 | 1.52 | 4.29 |
| Lynx | 0.67 | 0.70 | 0.41 | 0.85 |

Lynx is timed to its own `paintEnd` (see "Painted"), so like the NativeScript apps its mutations carry no UIKit wait.

Size M mount, median ms:

| | tree-fanout | tiles | dashboard | text-flow | styled-cards |
|---|---:|---:|---:|---:|---:|
| UIKit | 99.7 | 849.7 | 283.3 | 183.3 | 341.4 |
| SwiftUI | 232.7 | 299.6 | 99.7 | 116.5 | 133.3 |
| UIKit + Mason | 67.3 | 283.3 | 100.8 | 133.3 | 183.2 |
| NativeScript Core + Mason | 164.2 | 607.8 | 192.9 | 129.4 | 303.5 |
| NativeScript Core | 336.7 | 1090.6 | 285.0 | 199.2 | 374.5 |
| React Native | 83.1 | 816.5 | 116.6 | 258.2 | 165.8 |
| Lynx | 75.0 | 641.0 | 200.0 | 116.5 | 167.0 |

**Android, Pixel 9 Pro emulator** ([report](results/2026-10-01-pixel9pro-emu-native-compose/REPORT.md)), size M mount, median ms. An emulator run, so only the ratios mean much. It predates the masonkit fixes in [nativescript-mason#76](https://github.com/triniwiz/nativescript-mason/pull/76), which cut native + Mason mutations from about 18 ms to 1 to 4 ms until laid out.

| Size M | tree-fanout | tiles | dashboard | text-flow | styled-cards |
|---|---:|---:|---:|---:|---:|
| Views | 19.0 | 104.4 | 29.3 | 32.9 | 31.0 |
| Compose | 47.4 | 104.2 | 38.8 | 50.7 | 51.4 |
| Views + Mason | 23.9 | 147.7 | 40.7 | 46.7 | 56.2 |
| NativeScript Core | 69.4 | 338.0 | 95.6 | 50.2 | 114.1 |
| NativeScript Core + Mason | 83.0 | 273.3 | 88.2 | 54.4 | 112.6 |
| React Native | 73.5 | 361.5 | 84.2 | 67.1 | 99.7 |

## Layout

```
scenarios/   shared source of truth: spec, tokens, seeded generator, runner and protocol, browser reference
harness/     Node CLI: devices, sync, run (HTTP plan/result server + deep links), show, report
apps/        one independent project per stack (no workspace hoisting across stacks)
drivers/     Android Macrobenchmark module and iOS XCUITest project (phase 4)
results/     raw results (git-ignored; commit curated runs with -f)
```
