# xplat-benchmarks

This repo benchmarks layout performance and CSS support on deep and heavy layouts across cross-platform frameworks, on iOS and Android. NativeScript is the main subject and is tested in three variants. React Native and Lynx are the comparison stacks.

| App | Stack | Status |
|---|---|---|
| `ns-core` | NativeScript Core with plain layouts (StackLayout, GridLayout, FlexboxLayout) and core CSS | planned (phase 2) |
| `ns-core-mason` | NativeScript Core with [`@triniwiz/nativescript-masonkit`](https://github.com/triniwiz/nativescript-mason) | planned (phase 2) |
| `ns-angular-mason` | NativeScript Angular 21 with masonkit (`installMasonKit()`) | planned (phase 2) |
| `react-native` | React Native 0.87 bare CLI, Fabric and Hermes | planned (phase 3) |
| `lynx` | ReactLynx (rspeedy) bundle in minimal native hosts built on Lynx SDK 4.1 | planned (phase 3) |

`ns-core` and `ns-core-mason` are a controlled pair. They build identical trees with the same imperative helper; only the element classes and the CSS differ. Comparing them isolates the layout engine. Comparing `ns-core-mason` with `ns-angular-mason` isolates the cost of Angular.

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

## Layout

```
scenarios/   shared source of truth: spec, tokens, seeded generator, runner and protocol, browser reference
harness/     Node CLI: devices, sync, run (HTTP plan/result server + deep links), show, report
apps/        one independent project per stack (no workspace hoisting across stacks)
drivers/     Android Macrobenchmark module and iOS XCUITest project (phase 4)
results/     raw results (git-ignored; commit curated runs with -f)
```
