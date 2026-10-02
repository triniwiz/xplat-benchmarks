# Results: 2026-10-01-pixel9pro-emu-native-compose

- Device: Google sdk_gphone16k_arm64 (emulator), android 17
- Rounds: 2, warmup 3, iterations 10 per round
- Cells: median ms · p90 ms (n). Lower is better.
- `<series>` = until painted (layout + next frame); `<series>.layout` = until the tree was laid out.
- ⚠️ emulator run — smoke-test numbers only.

## Versions

- **NativeScript Core**: @nativescript/core 9.1.3-next.2, @nativescript/ios 9.1.0, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38
- **NativeScript Core + Mason (local build)**: @nativescript/core 9.1.3-next.2, @nativescript/ios 9.1.0, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38, @triniwiz/nativescript-masonkit 1.0.0-beta.106
- **React Native**: react-native 0.87.1, react 19.2.3, @shopify/flash-list 2.3.2
- **Native Android (Views)**: android-views API 37, flexbox 3.0.0, recyclerview 1.4.0
- **Native Android + Mason**: masonkit 1.0.0-beta.106 (local AAR), android API 37
- **Native Android (Jetpack Compose)**: jetpack-compose BOM 2026.09.00, android API 37

## Known deviations

- **NativeScript Core**: styled-cards v5: core does not clip children to border-radius (overflow: hidden unsupported).
- **NativeScript Core + Mason (local build)**: Mason-native frame: Mason root, status Text, Mason Scroll host and Mason Ul; the window root is a core GridLayout only to apply Android insets.
- **NativeScript Core + Mason (local build)**: list-scroll: each Ul cell has an extra full-width Mason root (cells size to max-content and ignore root margins).
- **NativeScript Core + Mason (local build)**: list-scroll (iOS): the first screen of the Mason Ul fills only ~7 cells and leaves the rest blank (masonkit 1.0.0-beta.104).
- **NativeScript Core + Mason (local build)**: text-flow: no line clamp in Mason, so the 2-line clamp paragraphs render in full.
- **NativeScript Core + Mason (local build)**: styled-cards v4: stylesheet `transform` (rotate/scale) is not applied inside a Mason-native tree (it was when the host was a core ScrollView; masonkit 1.0.0-beta.105, Android).
- **React Native**: grid-dashboard: flex-emulated (React Native has no CSS grid).
- **React Native**: Text uses allowFontScaling={false} and textBreakStrategy="simple" to lay out like the other apps (dp text, greedy line breaking).
- **React Native**: list-scroll: FlashList v2; the mount mark is the list container layout, as for the other apps' lists.
- **Native Android (Views)**: Native baseline, Android only: Kotlin + Android Views, no framework. Kotlin ports of the seeded generator, hash and runner; clock is System.nanoTime().
- **Native Android (Views)**: Layout is nested LinearLayouts (weights for flex: 1, MATCH_PARENT children for cross-axis stretch); borders and radii are background drawables (GradientDrawable, a small per-side border drawable), with border widths added to the padding.
- **Native Android (Views)**: flex-wrap-tiles / insert-remove: FlexboxLayout (com.google.android.flexbox) with flexWrap=wrap; remove is removeViews(0, 100).
- **Native Android (Views)**: grid-dashboard: flex-emulated, as in React Native (Android Views have no CSS grid); table rows use 2:1:1:1 weights.
- **Native Android (Views)**: Text: TextView with dp sizes, includeFontPadding=false, simple break strategy, no hyphenation (as React Native); lineHeight only where styles.ts sets it.
- **Native Android (Views)**: styled-cards: v0 shadow is a 3 dp elevation shadow (not a CSS blur), v2 gradient is GradientDrawable TL_BR, v4 is View alpha/rotation/scale, v5 clips with clipToOutline.
- **Native Android (Views)**: Painted: the sentinel's OnLayoutChangeListener records the `layout` mark (it is the last child, laid out after the rest of the tree in the same traversal); the next Choreographer frame ends the sample. Steps resume inside the Choreographer frame callback, so a mount's layout runs in that same frame (as requestAnimationFrame in NativeScript).
- **Native Android (Views)**: list-scroll: RecyclerView with one view type per item type; the RecyclerView is the sentinel (its first layout builds the visible cells).
- **Native Android (Views)**: gc() is Runtime.gc() between iterations; unmount waits 2 frames.
- **Native Android + Mason**: Mason without NativeScript or JS, Android only: the native-android runner, clock and painted rule, with every element built from Kotlin through masonkit (local masonkit-release.aar copied into app/libs).
- **Native Android + Mason**: Frame is Mason end to end, as in the NativeScript + Mason apps: a Mason root with the status Text and a Mason Scroll host (native-android uses a ScrollView).
- **Native Android + Mason**: Styles: the typed Style API in one configure batch per element (display, flex, sizes, padding, margin, border widths/colours/style, radii, colours, fonts); Mason CSS strings for box-shadow, transform, the gradient (backgroundImage) and grid templates/areas. Opacity is View.alpha, as in NativeScript.
- **Native Android + Mason**: grid-dashboard: Mason CSS grid (template areas), as the NativeScript + Mason apps; native-android and React Native emulate it with flex.
- **Native Android + Mason**: text-flow: no line clamp in Mason, so the 2-line clamp paragraphs render in full (as in the NativeScript + Mason apps).
- **Native Android + Mason**: Painted: as native-android (sentinel OnLayoutChangeListener, then one Choreographer frame). Mason defers relayout after a style change to its own postOnAnimation compute, so mutation samples include that scheduling, as in the NativeScript + Mason apps.
- **Native Android + Mason**: list-scroll: Mason ListView (the RecyclerView-backed list behind the NativeScript Mason Ul) with one view type per item type; each cell is a full-width Mason root and badges are rebuilt on every bind, as in those apps.
- **Native Android (Jetpack Compose)**: Jetpack Compose, Android only: the native-android Kotlin fixtures, hash, runner and clock (apps/native-android-common) in a ComponentActivity. The whole frame (status text, scroll host, scenario) is one composition; Compose BOM 2026.09.00 (Compose 1.12.1), foundation only, no Material.
- **Native Android (Jetpack Compose)**: Layout is Column/Row/Box with weights for flex: 1; borders are Modifier.border or a per-side drawBehind, drawn inside the box with the border width added to the padding; margins are an outer padding. Release build without R8, as native-android (`-Pminify` builds an R8 variant).
- **Native Android (Jetpack Compose)**: tree-fanout: cross-axis stretch is not emulated (siblings have identical subtrees, so heights already match); restyle recomposes every inner node (padding and border colour are read in composition).
- **Native Android (Jetpack Compose)**: flex-wrap-tiles / insert-remove: FlowRow with fillMaxRowHeight for align-items: stretch; tiles are a SnapshotStateList keyed by id, insert is addAll(0, 100) and remove is removeRange(0, 100).
- **Native Android (Jetpack Compose)**: grid-dashboard: flex-emulated with Row/Column, as native-android and React Native (no custom Layout); table rows use 2:1:1:1 weights. The nav column and each stat pair stretch to the row height with IntrinsicSize.Min + fillMaxHeight, an extra intrinsic pass (native-android's MATCH_PARENT children cost a second measure).
- **Native Android (Jetpack Compose)**: Text: BasicText with dp sizes (independent of font scale), LineBreak.Simple, Hyphens.None and Compose's default includeFontPadding=false; lineHeight uses LineHeightStyle(Top, Trim.Both) to place the extra leading where TextView's line spacing puts it.
- **Native Android (Jetpack Compose)**: styled-cards: v0 shadow is Modifier.shadow(3 dp), the same elevation shadow as native-android; v2 gradient is Brush.linearGradient corner to corner; v4 is a graphicsLayer (alpha, rotation, scale); v5 clips with Modifier.clip.
- **Native Android (Jetpack Compose)**: Painted: the 1 dp sentinel Box after all scenario content carries Modifier.onGloballyPositioned. Its first callback after a mount or mutation is the `layout` mark (Compose dispatches it once the whole measure/layout pass is done, before draw) and the next Choreographer frame ends the sample, as native-android. Every mutation moves or resizes the sentinel.
- **Native Android (Jetpack Compose)**: Mutations write snapshot state (mutableStateOf, SnapshotStateList). Compose recomposes on its own frame clock, so a write made in the runner's Choreographer callback is composed in a later frame and samples include that wait (native-android lays out in the same frame). Extra marks: `frame` (first frame after the write) and, for mount, `composed` (SideEffect once the scenario composition is applied).
- **Native Android (Jetpack Compose)**: list-scroll: LazyColumn with key = id and one contentType per item type; the LazyColumn is the sentinel (its first layout composes the visible cells).
- **Native Android (Jetpack Compose)**: gc() is Runtime.gc() between iterations; unmount clears the body state and waits 2 frames.

## Memory after run (MB, highest round)

| app | Java heap | native heap | graphics | total PSS |
|---|---:|---:|---:|---:|
| NativeScript Core | 25 | 90 | – | 201 |
| NativeScript Core + Mason (local build) | 8 | 77 | – | 182 |
| React Native | 23 | 119 | – | 199 |
| Native Android (Views) | 3 | 25 | – | 43 |
| Native Android + Mason | 7 | 35 | – | 61 |
| Native Android (Jetpack Compose) | 6 | 35 | – | 67 |

## Nested chain (`nested-chain`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 7.5 · 17.4 (20) | 18.9 · 22.4 (20) | 39.4 · 49.0 (20) | 16.6 · 18.4 (20) | 16.6 · 17.1 (20) | 32.6 · 33.9 (20) |
| M | 17.8 · 19.9 (20) | 19.8 · 22.7 (20) | 38.9 · 48.5 (20) | 16.5 · 19.8 (20) | 16.7 · 18.0 (20) | 33.1 · 34.0 (20) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 5.3 · 7.1 (20) | 6.7 · 7.5 (20) | – | 0.9 · 1.7 (20) | 2.6 · 3.7 (20) | 0.2 · 0.3 (20) |
| M | 7.7 · 9.0 (20) | 8.9 · 10.4 (20) | – | 1.6 · 3.2 (20) | 2.1 · 3.1 (20) | 0.2 · 1.0 (20) |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 0.4 · 0.5 (20) | 0.4 · 0.6 (20) | – | 0.7 · 1.1 (20) | 2.3 · 3.2 (20) | 0.0 · 0.0 (20) |
| M | 0.4 · 1.0 (20) | 0.5 · 0.7 (20) | – | 1.2 · 2.7 (20) | 1.9 · 2.6 (20) | 0.0 · 0.1 (20) |

**mount.composed**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | 20.5 · 22.8 (20) |
| M | – | – | – | – | – | 21.0 · 25.6 (20) |

**mount.frame**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | 16.5 · 18.6 (20) |
| M | – | – | – | – | – | 16.7 · 20.3 (20) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 6.7 · 16.4 (20) | 17.3 · 20.1 (20) | 20.0 · 24.1 (20) | 1.1 · 1.9 (20) | 4.0 · 5.0 (20) | 23.3 · 26.4 (20) |
| M | 17.0 · 18.9 (20) | 18.0 · 20.6 (20) | 20.3 · 23.2 (20) | 1.8 · 3.8 (20) | 3.5 · 4.6 (20) | 24.0 · 28.0 (20) |

## Tree fan-out (`tree-fanout`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 30.2 · 32.3 (20) | 32.5 · 38.0 (20) | 41.2 · 50.4 (20) | 16.5 · 17.6 (20) | 16.1 · 17.2 (20) | 34.5 · 39.2 (20) |
| M | 69.4 · 72.2 (20) | 83.0 · 93.7 (20) | 73.5 · 85.1 (20) | 19.0 · 23.6 (20) | 23.9 · 28.0 (20) | 47.4 · 50.9 (20) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 23.8 · 26.7 (20) | 24.1 · 26.2 (20) | – | 2.4 · 3.6 (20) | 6.5 · 8.0 (20) | 0.2 · 0.3 (20) |
| M | 54.9 · 57.1 (20) | 60.6 · 64.5 (20) | – | 4.3 · 5.2 (20) | 12.8 · 14.8 (20) | 0.2 · 0.3 (20) |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 1.6 · 3.0 (20) | 1.7 · 2.0 (20) | – | 1.9 · 3.2 (20) | 6.0 · 7.5 (20) | 0.0 · 0.1 (20) |
| M | 3.7 · 4.3 (20) | 4.4 · 5.8 (20) | – | 3.6 · 4.5 (20) | 12.0 · 13.8 (20) | 0.0 · 0.0 (20) |

**mount.composed**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | 25.5 · 29.0 (20) |
| M | – | – | – | – | – | 30.7 · 33.9 (20) |

**mount.frame**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | 16.4 · 18.1 (20) |
| M | – | – | – | – | – | 16.7 · 19.0 (20) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 28.0 · 30.3 (20) | 29.0 · 33.4 (20) | 23.9 · 24.9 (20) | 5.3 · 6.6 (20) | 7.8 · 9.7 (20) | 31.1 · 34.9 (20) |
| M | 64.3 · 66.8 (20) | 72.6 · 87.2 (20) | 48.6 · 53.0 (20) | 14.5 · 17.5 (20) | 16.4 · 18.4 (20) | 42.6 · 45.8 (20) |

## Flex-wrap tiles (`flex-wrap-tiles`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 85.4 · 91.2 (20) | 80.5 · 94.4 (20) | 89.1 · 96.8 (20) | 25.8 · 33.3 (20) | 46.3 · 50.3 (20) | 53.9 · 58.7 (20) |
| M | 338 · 369 (20) | 273 · 282 (20) | 361 · 376 (20) | 104 · 107 (20) | 148 · 154 (20) | 104 · 108 (20) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 74.4 · 79.3 (20) | 49.4 · 54.6 (20) | – | 16.0 · 17.9 (20) | 17.7 · 20.1 (20) | 0.2 · 0.3 (20) |
| M | 293 · 309 (20) | 164 · 173 (20) | – | 72.2 · 74.2 (20) | 59.4 · 63.2 (20) | 0.2 · 0.2 (20) |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 2.4 · 3.0 (20) | 1.9 · 2.5 (20) | – | 15.4 · 17.2 (20) | 16.8 · 18.9 (20) | 0.2 · 0.3 (20) |
| M | 7.6 · 8.8 (20) | 7.1 · 8.0 (20) | – | 69.3 · 72.2 (20) | 51.4 · 55.7 (20) | 0.2 · 0.2 (20) |

**mount.composed**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | 26.1 · 28.4 (20) |
| M | – | – | – | – | – | 43.4 · 45.9 (20) |

**mount.frame**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | 26.2 · 28.5 (20) |
| M | – | – | – | – | – | 43.5 · 46.0 (20) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 81.2 · 86.6 (20) | 74.0 · 85.9 (20) | 76.1 · 79.9 (20) | 21.7 · 24.8 (20) | 39.8 · 43.5 (20) | 47.9 · 53.4 (20) |
| M | 321 · 339 (20) | 248 · 261 (20) | 198 · 265 (20) | 89.6 · 93.5 (20) | 123 · 129 (20) | 91.2 · 95.6 (20) |

## Grid dashboard (`grid-dashboard`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 32.3 · 34.1 (10) | 28.3 · 30.4 (20) | 50.0 · 52.3 (20) | 16.1 · 17.1 (20) | 16.3 · 16.9 (20) | 33.5 · 34.9 (20) |
| M | 95.6 · 102 (20) | 88.2 · 99.2 (20) | 84.2 · 86.8 (20) | 29.3 · 32.1 (20) | 40.7 · 43.6 (20) | 38.8 · 42.2 (20) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 28.3 · 30.0 (10) | 19.6 · 21.2 (20) | – | 4.7 · 5.8 (20) | 6.6 · 7.8 (20) | 0.2 · 0.3 (20) |
| M | 84.6 · 89.5 (20) | 58.3 · 73.0 (20) | – | 13.2 · 15.3 (20) | 15.4 · 18.0 (20) | 0.2 · 0.2 (20) |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 1.4 · 1.5 (10) | 0.8 · 1.1 (20) | – | 4.3 · 5.3 (20) | 6.0 · 7.2 (20) | 0.0 · 0.0 (20) |
| M | 4.0 · 4.5 (20) | 2.3 · 2.7 (20) | – | 12.3 · 14.1 (20) | 13.9 · 17.1 (20) | 0.0 · 0.0 (20) |

**mount.composed**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | 20.3 · 23.2 (20) |
| M | – | – | – | – | – | 22.9 · 24.7 (20) |

**mount.frame**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | 17.2 · 18.9 (20) |
| M | – | – | – | – | – | 16.6 · 18.0 (20) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 30.6 · 32.4 (10) | 26.2 · 28.1 (20) | 33.0 · 36.8 (20) | 7.8 · 9.5 (20) | 11.4 · 13.1 (20) | 24.9 · 27.1 (20) |
| M | 91.4 · 97.8 (20) | 82.2 · 94.1 (20) | 70.4 · 72.6 (20) | 24.9 · 27.7 (20) | 35.0 · 38.1 (20) | 34.4 · 37.0 (20) |

## Text flow (`text-flow`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 21.9 · 25.9 (20) | 22.8 · 32.9 (20) | 33.6 · 50.7 (20) | 16.2 · 16.9 (20) | 16.7 · 18.5 (20) | 33.0 · 33.8 (20) |
| M | 50.2 · 53.5 (20) | 54.4 · 57.4 (20) | 67.1 · 70.0 (20) | 32.9 · 35.2 (20) | 46.7 · 49.0 (20) | 50.7 · 52.6 (20) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 8.3 · 9.4 (20) | 4.3 · 4.9 (20) | – | 2.2 · 3.3 (20) | 1.5 · 2.1 (20) | 0.1 · 0.2 (20) |
| M | 23.8 · 26.1 (20) | 12.0 · 14.1 (20) | – | 5.5 · 6.5 (20) | 4.2 · 4.9 (20) | 0.1 · 0.3 (20) |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 0.5 · 0.5 (20) | 0.3 · 0.4 (20) | – | 1.8 · 2.9 (20) | 1.3 · 1.8 (20) | 0.0 · 0.0 (20) |
| M | 1.0 · 1.1 (20) | 0.7 · 0.8 (20) | – | 5.2 · 5.9 (20) | 3.9 · 4.4 (20) | 0.0 · 0.0 (20) |

**mount.composed**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | 18.1 · 19.5 (20) |
| M | – | – | – | – | – | 18.9 · 20.1 (20) |

**mount.frame**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | 16.7 · 18.2 (20) |
| M | – | – | – | – | – | 16.4 · 17.6 (20) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 18.9 · 22.4 (20) | 19.6 · 29.6 (20) | 28.5 · 34.2 (20) | 7.0 · 8.7 (20) | 11.3 · 13.2 (20) | 25.1 · 27.7 (20) |
| M | 39.8 · 42.9 (20) | 44.3 · 47.2 (20) | 54.5 · 57.7 (20) | 22.0 · 24.4 (20) | 36.3 · 38.5 (20) | 39.8 · 41.8 (20) |

## Styled cards (`styled-cards`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 33.1 · 38.3 (20) | 33.2 · 44.3 (20) | 67.3 · 79.9 (20) | 16.5 · 17.7 (20) | 17.3 · 18.9 (20) | 32.5 · 33.4 (20) |
| M | 114 · 118 (20) | 113 · 119 (20) | 99.7 · 102 (20) | 31.0 · 34.9 (20) | 56.2 · 58.8 (20) | 51.4 · 54.4 (20) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 27.8 · 29.9 (20) | 20.9 · 22.7 (20) | – | 6.2 · 7.8 (20) | 6.5 · 7.2 (20) | 0.1 · 0.2 (20) |
| M | 95.6 · 98.7 (20) | 71.3 · 77.8 (20) | – | 17.9 · 19.5 (20) | 19.2 · 20.9 (20) | 0.1 · 0.2 (20) |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 1.1 · 1.3 (20) | 0.9 · 1.2 (20) | – | 5.7 · 7.3 (20) | 6.2 · 6.9 (20) | 0.0 · 0.0 (20) |
| M | 3.3 · 3.9 (20) | 2.8 · 3.3 (20) | – | 17.3 · 18.6 (20) | 17.8 · 19.1 (20) | 0.0 · 0.0 (20) |

**mount.composed**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | 19.4 · 21.7 (20) |
| M | – | – | – | – | – | 23.4 · 25.1 (20) |

**mount.frame**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | 16.5 · 18.9 (20) |
| M | – | – | – | – | – | 16.5 · 18.0 (20) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 30.8 · 35.8 (20) | 29.6 · 40.0 (20) | 39.1 · 49.8 (20) | 8.0 · 10.7 (20) | 12.9 · 14.1 (20) | 24.4 · 26.4 (20) |
| M | 107 · 110 (20) | 101 · 107 (20) | 83.1 · 87.3 (20) | 23.4 · 25.9 (20) | 44.9 · 46.9 (20) | 42.8 · 45.0 (20) |

## Relayout: root resize (`relayout-resize`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 27.6 · 29.1 (20) | 27.3 · 32.1 (20) | 33.3 · 35.3 (20) | 15.8 · 18.1 (20) | 16.6 · 17.7 (20) | 33.3 · 34.3 (20) |
| M | 63.3 · 65.0 (20) | 71.9 · 77.8 (20) | 65.1 · 83.1 (20) | 20.2 · 23.3 (20) | 17.7 · 19.4 (20) | 33.3 · 33.8 (20) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 22.3 · 23.8 (20) | 21.7 · 24.1 (20) | – | 2.2 · 2.5 (20) | 4.0 · 4.6 (20) | 0.1 · 0.2 (20) |
| M | 51.1 · 53.2 (20) | 56.9 · 60.9 (20) | – | 4.7 · 5.5 (20) | 10.7 · 11.8 (20) | 0.1 · 0.2 (20) |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 1.3 · 1.4 (20) | 1.0 · 1.2 (20) | – | 1.7 · 2.1 (20) | 3.5 · 4.0 (20) | 0.0 · 0.0 (20) |
| M | 2.6 · 3.0 (20) | 2.8 · 3.6 (20) | – | 3.9 · 4.7 (20) | 9.8 · 10.7 (20) | 0.0 · 0.0 (20) |

**mount.composed**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | 20.0 · 22.3 (20) |
| M | – | – | – | – | – | 22.1 · 24.7 (20) |

**mount.frame**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | 16.6 · 18.7 (20) |
| M | – | – | – | – | – | 16.5 · 17.9 (20) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 25.0 · 27.2 (20) | 25.5 · 30.5 (20) | 22.8 · 23.7 (20) | 5.1 · 5.8 (20) | 4.8 · 5.6 (20) | 21.4 · 23.4 (20) |
| M | 58.0 · 59.5 (20) | 68.0 · 73.0 (20) | 43.6 · 48.5 (20) | 15.6 · 18.1 (20) | 13.1 · 14.1 (20) | 24.1 · 27.3 (20) |

**shrink**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 9.7 · 20.3 (20) | 13.2 · 18.1 (20) | 33.9 · 35.5 (20) | 16.8 · 18.5 (20) | 33.4 · 34.5 (20) | 33.4 · 34.7 (20) |
| M | 16.0 · 25.6 (20) | 17.6 · 22.4 (20) | 47.7 · 50.5 (20) | 16.5 · 17.9 (20) | 32.5 · 33.3 (20) | 33.6 · 34.3 (20) |

**shrink.frame**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | 16.2 · 17.2 (20) |
| M | – | – | – | – | – | 16.4 · 17.9 (20) |

**shrink.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 6.4 · 17.3 (20) | 11.4 · 15.9 (20) | 17.3 · 18.7 (20) | 0.8 · 1.0 (20) | 17.3 · 19.7 (20) | 18.0 · 19.0 (20) |
| M | 9.8 · 18.9 (20) | 13.0 · 18.6 (20) | 17.2 · 18.6 (20) | 1.6 · 2.1 (20) | 18.7 · 20.2 (20) | 19.4 · 21.6 (20) |

**grow**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 17.2 · 18.2 (20) | 16.9 · 18.9 (20) | 33.2 · 34.3 (20) | 16.8 · 18.2 (20) | 33.6 · 34.7 (20) | 33.1 · 33.8 (20) |
| M | 16.4 · 17.8 (20) | 16.2 · 17.7 (20) | 48.8 · 50.9 (20) | 16.4 · 18.0 (20) | 33.4 · 34.1 (20) | 33.0 · 34.2 (20) |

**grow.frame**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | 16.3 · 17.3 (20) |
| M | – | – | – | – | – | 16.4 · 17.7 (20) |

**grow.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 14.4 · 15.8 (20) | 15.0 · 16.6 (20) | 15.8 · 17.5 (20) | 0.6 · 1.0 (20) | 17.7 · 19.2 (20) | 18.2 · 19.6 (20) |
| M | 10.3 · 12.2 (20) | 12.3 · 13.4 (20) | 18.1 · 19.9 (20) | 1.2 · 1.8 (20) | 20.0 · 21.8 (20) | 19.2 · 20.8 (20) |

## Relayout: restyle every node (`relayout-style`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 26.6 · 29.6 (20) | 27.0 · 29.1 (20) | 50.3 · 54.2 (20) | 16.8 · 17.8 (20) | 16.6 · 17.3 (20) | 33.7 · 34.9 (20) |
| M | 63.4 · 66.5 (20) | 70.2 · 75.7 (20) | 66.6 · 83.4 (20) | 19.8 · 22.6 (20) | 17.9 · 18.9 (20) | 32.8 · 33.8 (20) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 22.2 · 25.0 (20) | 21.7 · 23.0 (20) | – | 1.7 · 2.1 (20) | 3.3 · 4.4 (20) | 0.1 · 0.3 (20) |
| M | 51.7 · 54.5 (20) | 55.9 · 62.0 (20) | – | 4.6 · 5.4 (20) | 10.6 · 11.3 (20) | 0.1 · 0.2 (20) |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 1.3 · 1.3 (20) | 1.0 · 1.3 (20) | – | 1.3 · 1.7 (20) | 2.8 · 3.8 (20) | 0.0 · 0.1 (20) |
| M | 2.8 · 3.1 (20) | 3.0 · 3.3 (20) | – | 3.9 · 4.5 (20) | 9.5 · 10.2 (20) | 0.0 · 0.0 (20) |

**mount.composed**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | 19.2 · 22.2 (20) |
| M | – | – | – | – | – | 22.2 · 23.8 (20) |

**mount.frame**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | 16.7 · 19.1 (20) |
| M | – | – | – | – | – | 16.2 · 17.5 (20) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 24.4 · 27.4 (20) | 25.0 · 26.8 (20) | 22.2 · 25.6 (20) | 3.7 · 4.9 (20) | 4.2 · 5.2 (20) | 20.3 · 23.9 (20) |
| M | 57.9 · 60.9 (20) | 66.2 · 72.0 (20) | 46.9 · 48.8 (20) | 15.1 · 17.7 (20) | 13.0 · 13.9 (20) | 24.8 · 26.8 (20) |

**restyle**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 12.5 · 22.3 (20) | 17.7 · 22.9 (20) | 50.4 · 52.2 (20) | 16.5 · 17.5 (20) | 33.1 · 33.8 (20) | 33.3 · 34.5 (20) |
| M | 21.9 · 25.7 (20) | 29.2 · 33.5 (20) | 54.9 · 66.1 (20) | 16.3 · 17.3 (20) | 33.0 · 33.9 (20) | 33.1 · 33.6 (20) |

**restyle.frame**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | 16.6 · 17.7 (20) |
| M | – | – | – | – | – | 16.6 · 17.9 (20) |

**restyle.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 9.2 · 18.8 (20) | 14.8 · 20.9 (20) | 17.3 · 19.1 (20) | 2.2 · 2.6 (20) | 17.1 · 18.2 (20) | 19.7 · 21.9 (20) |
| M | 15.6 · 18.6 (20) | 25.2 · 29.4 (20) | 19.5 · 34.9 (20) | 9.8 · 11.2 (20) | 18.8 · 20.1 (20) | 22.3 · 24.1 (20) |

**restore**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 15.9 · 17.4 (20) | 17.1 · 17.7 (20) | 49.6 · 52.0 (20) | 16.5 · 17.9 (20) | 33.6 · 35.1 (20) | 34.3 · 35.7 (20) |
| M | 15.0 · 16.0 (20) | 16.5 · 18.1 (20) | 52.2 · 55.2 (20) | 32.9 · 33.9 (20) | 33.6 · 34.4 (20) | 33.4 · 34.4 (20) |

**restore.frame**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | 16.2 · 17.6 (20) |
| M | – | – | – | – | – | 16.4 · 18.0 (20) |

**restore.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 13.4 · 15.0 (20) | 14.7 · 16.0 (20) | 16.9 · 18.7 (20) | 2.2 · 2.8 (20) | 17.7 · 19.1 (20) | 19.3 · 20.8 (20) |
| M | 9.9 · 11.2 (20) | 12.7 · 14.4 (20) | 18.2 · 20.2 (20) | 8.4 · 8.9 (20) | 19.0 · 20.0 (20) | 21.5 · 22.6 (20) |

## Insert / remove at head (`insert-remove`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 81.4 · 85.0 (20) | 71.2 · 85.2 (20) | 83.3 · 84.8 (20) | 22.8 · 32.4 (20) | 37.6 · 40.0 (20) | 37.0 · 40.0 (20) |
| M | 332 · 353 (20) | 271 · 281 (20) | 256 · 359 (20) | 101 · 104 (20) | 130 · 140 (20) | 79.5 · 82.8 (20) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 71.0 · 73.9 (20) | 48.2 · 52.1 (20) | – | 13.7 · 16.8 (20) | 11.6 · 13.2 (20) | 0.2 · 0.2 (20) |
| M | 288 · 307 (20) | 165 · 173 (20) | – | 68.4 · 71.1 (20) | 52.1 · 54.6 (20) | 0.2 · 0.2 (20) |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 2.3 · 2.6 (20) | 2.0 · 2.3 (20) | – | 13.0 · 15.9 (20) | 10.6 · 12.1 (20) | 0.1 · 0.2 (20) |
| M | 8.2 · 9.0 (20) | 7.8 · 8.6 (20) | – | 66.5 · 69.1 (20) | 44.0 · 47.2 (20) | 0.2 · 0.2 (20) |

**mount.composed**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | 20.7 · 22.1 (20) |
| M | – | – | – | – | – | 35.2 · 37.5 (20) |

**mount.frame**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | 20.8 · 22.2 (20) |
| M | – | – | – | – | – | 35.3 · 37.5 (20) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 77.2 · 80.2 (20) | 66.0 · 79.3 (20) | 69.2 · 70.8 (20) | 19.5 · 23.4 (20) | 28.8 · 31.3 (20) | 32.0 · 36.6 (20) |
| M | 317 · 334 (20) | 249 · 259 (20) | 130 · 247 (20) | 86.2 · 88.2 (20) | 105 · 111 (20) | 71.2 · 74.1 (20) |

**insert**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 40.9 · 48.4 (20) | 31.6 · 34.4 (20) | 63.7 · 68.0 (20) | 16.1 · 17.1 (20) | 18.4 · 33.4 (20) | 33.2 · 35.4 (20) |
| M | 47.9 · 55.5 (20) | 37.3 · 38.6 (20) | 132 · 236 (20) | 16.7 · 17.4 (20) | 24.9 · 27.5 (20) | 46.8 · 51.6 (20) |

**insert.frame**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | 16.4 · 17.5 (20) |
| M | – | – | – | – | – | 17.0 · 18.8 (20) |

**insert.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 38.7 · 45.8 (20) | 28.7 · 31.1 (20) | 44.6 · 48.7 (20) | 11.6 · 13.0 (20) | 12.1 · 12.8 (20) | 29.1 · 31.4 (20) |
| M | 43.8 · 51.5 (20) | 33.4 · 34.8 (20) | 71.6 · 118 (20) | 12.3 · 13.7 (20) | 17.8 · 20.6 (20) | 35.5 · 39.5 (20) |

**remove**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 13.0 · 20.3 (20) | 12.3 · 20.8 (20) | 34.6 · 39.3 (20) | 16.8 · 18.0 (20) | 32.9 · 35.0 (20) | 41.1 · 41.7 (20) |
| M | 12.9 · 21.3 (20) | 15.7 · 22.8 (20) | 163 · 173 (20) | 16.6 · 17.7 (20) | 17.6 · 33.9 (20) | 172 · 179 (20) |

**remove.frame**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | 16.1 · 17.6 (20) |
| M | – | – | – | – | – | 16.7 · 17.4 (20) |

**remove.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native Android (Views) | Native Android + Mason | Native Android (Jetpack Compose) |
|---|---:|---:|---:|---:|---:|---:|
| S | 11.5 · 18.3 (20) | 10.4 · 19.2 (20) | 23.4 · 25.1 (20) | 1.2 · 2.1 (20) | 1.8 · 2.3 (20) | 38.6 · 39.3 (20) |
| M | 10.0 · 19.1 (20) | 13.5 · 20.2 (20) | 70.5 · 78.6 (20) | 3.2 · 3.6 (20) | 4.9 · 5.6 (20) | 165 · 171 (20) |
