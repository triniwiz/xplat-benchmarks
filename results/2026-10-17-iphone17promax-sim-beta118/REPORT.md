# Results: 2026-10-17-iphone17promax-sim-beta118

- Device: iPhone 17 Pro Max (simulator), ios 26.4
- Rounds: 3, warmup 3, iterations 20 per round
- Cells: median ms · p90 ms (n). Lower is better.
- `<series>` = until painted (layout + next frame); `<series>.layout` = until the tree was laid out.
- ⚠️ simulator run — smoke-test numbers only.

## Versions

- **NativeScript Core**: @nativescript/core 9.1.3-next.2, @nativescript/ios 9.1.0-next.2026-10-13-38342327982, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38
- **NativeScript Core + Mason**: @nativescript/core 9.1.3-next.2, @nativescript/ios 9.1.0-next.2026-10-13-38342327982, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38, @triniwiz/nativescript-masonkit 1.0.0-beta.118
- **React Native**: react-native 0.87.1, react 19.2.3, @shopify/flash-list 2.3.2
- **Lynx**: @lynx-js/react 0.126.2, @lynx-js/rspeedy 0.18.0, lynx-sdk 4.1.0
- **Native iOS (UIKit)**: UIKit 26.4.1
- **Native iOS + Mason**: Mason 1.0.0-beta.118, UIKit 26.4.1
- **Native iOS (SwiftUI)**: SwiftUI 26.4.1

## Known deviations

- **NativeScript Core**: styled-cards v5: core does not clip children to border-radius (overflow: hidden unsupported).
- **NativeScript Core + Mason**: Mason-native frame: Mason root, status Text, Mason Scroll host and Mason Ul; the window root is a core GridLayout only to apply Android insets.
- **NativeScript Core + Mason**: list-scroll: each Ul cell has an extra full-width Mason root (cells size to max-content and ignore root margins).
- **NativeScript Core + Mason**: list-scroll (iOS): the first screen of the Mason Ul fills only ~7 cells and leaves the rest blank (masonkit 1.0.0-beta.104).
- **NativeScript Core + Mason**: text-flow: no line clamp in Mason, so the 2-line clamp paragraphs render in full.
- **NativeScript Core + Mason**: styled-cards v4: stylesheet `transform` (rotate/scale) is not applied inside a Mason-native tree (it was when the host was a core ScrollView; masonkit 1.0.0-beta.105, Android).
- **React Native**: grid-dashboard: flex-emulated (React Native has no CSS grid).
- **React Native**: Text uses allowFontScaling={false} and textBreakStrategy="simple" to lay out like the other apps (dp text, greedy line breaking).
- **React Native**: list-scroll: FlashList v2; the mount mark is the list container layout, as for the other apps' lists.
- **Lynx**: Clock: Date.now() (1 ms resolution); Lynx's background thread has no performance.now().
- **Lynx**: Painted is observed on the background thread: layoutchange events cross from the main thread, as any Lynx app would see them.
- **Lynx**: grid-dashboard: grid placed by line numbers (Lynx has no grid-template-areas).
- **Lynx**: Host registers the Log and HTTP services only (no images in the scenarios); Lynx logs an image-prefetch error at load.
- **Native iOS (UIKit)**: Native baseline, iOS only: Swift + UIKit, no framework. Swift ports of the seeded generator, hash and runner; clock is CACurrentMediaTime().
- **Native iOS (UIKit)**: Layout is Auto Layout with nested UIStackViews for every flex row/column (padding and border widths as layout margins, one-sided borders as edge CALayers).
- **Native iOS (UIKit)**: flex-wrap-tiles / insert-remove: UIKit has no wrapping stack, so a small non-virtualized container packs the tiles into lines in layoutSubviews (tiles measured once with systemLayoutSizeFitting, stretched to the line height).
- **Native iOS (UIKit)**: grid-dashboard: flex-emulated, as in React Native (UIKit has no CSS grid); table rows use 2:1:1:1 width constraints.
- **Native iOS (UIKit)**: Painted: after mount/mutation the sentinel and scroll host get setNeedsLayout; Core Animation lays layers out top-down and depth-first, so the sentinel's layoutSubviews (the `layout` mark) runs once everything before it is placed; the next CADisplayLink tick ends the sample.
- **Native iOS (UIKit)**: list-scroll: UITableView with self-sizing cells and one reuse identifier per item type; the mount mark is the table's first layoutSubviews (visible cells built).
- **Native iOS + Mason**: Mason without NativeScript or JS, iOS only: the native-ios harness (Swift fixtures, runner, clock) with every scenario tree built through Mason's Swift API (MasonUIView, MasonText, MasonStyle), matching the NativeScript + Mason stylesheet.
- **Native iOS + Mason**: Chrome is UIKit: status label and a UIScrollView host (the NativeScript + Mason apps use a Mason Scroll). The host's layoutSubviews computes the Mason root at its width with a max-content height and applies the frames.
- **Native iOS + Mason**: Styles: typed MasonStyle setters for display, flex, sizes, padding, margin, border widths and colours; Mason CSS strings for border style, border-radius, box-shadow, transform, the gradient and grid templates/areas. Opacity is UIView.alpha, as in NativeScript.
- **Native iOS + Mason**: grid-dashboard: Mason CSS grid (template areas), as the NativeScript + Mason apps; React Native and native-ios emulate it with flex.
- **Native iOS + Mason**: text-flow: no line clamp in Mason, so the 2-line clamp paragraphs render in full (as in the NativeScript + Mason apps).
- **Native iOS + Mason**: Painted: as native-ios. The sentinel is a plain UIView leaf after every other node; the host's layoutSubviews does the Mason pass first (Core Animation lays out top-down, depth-first), so the sentinel's layoutSubviews (the `layout` mark) runs after Mason has placed every view and the Mason views' own layoutSubviews have run; the next CADisplayLink tick ends the sample.
- **Native iOS + Mason**: list-scroll: UITableView as in native-ios, each cell a Mason root (the NativeScript + Mason item templates) computed at the table width in systemLayoutSizeFitting; badges are rebuilt on every bind, as in those apps.
- **Native iOS (SwiftUI)**: SwiftUI baseline, iOS only: the native-ios harness (Swift fixtures, runner, clock) with every scenario tree as SwiftUI views (VStack/HStack/ZStack, Text, shapes, modifiers), matching native-ios scenario by scenario. Deployment target iOS 17.
- **Native iOS (SwiftUI)**: Chrome: a UIHostingController root with the status Text above a vertical ScrollView (non-lazy VStack content), as native-ios. The scene delegate and URL handling are UIKit, as in native-ios.
- **Native iOS (SwiftUI)**: State: mutations only change @Observable models read by the views (relayout-resize width fraction, relayout-style flag passed down the tree, insert-remove tile array); nothing pokes UIKit.
- **Native iOS (SwiftUI)**: flex-wrap-tiles / insert-remove: a custom SwiftUI Layout packs the fixed-width tiles into lines and proposes each the line height (as native-ios's WrapView); not lazy.
- **Native iOS (SwiftUI)**: grid-dashboard: flex-emulated with stacks, as native-ios (no SwiftUI Grid); table rows are a small custom Layout giving 2:1:1:1 widths, equal-height rows use HStack + fixedSize(vertical).
- **Native iOS (SwiftUI)**: relayout-resize: a one-child custom Layout proposes 100% / 80% of the width.
- **Native iOS (SwiftUI)**: Text: Text with the same system fonts; absolute line heights are lineSpacing plus half the extra above and below (glyphs centred, as native-ios); the 2-line clamp is lineLimit(2) with tail truncation.
- **Native iOS (SwiftUI)**: styled-cards: v0 shadow is .shadow(radius 3, y 2) on the card shape, v1 UnevenRoundedRectangle, v2 a LinearGradient with end points computed for CSS 135deg (GeometryReader), v4 compositingGroup + opacity + scale + rotation, v5 clipShape.
- **Native iOS (SwiftUI)**: Painted: as native-ios. The sentinel (a 1pt UIViewRepresentable after the scenario content) takes a generation number bumped in the same transaction as the mount/mutation; updateUIView marks it with setNeedsLayout, and its layoutSubviews (the `layout` mark) only counts once that generation is applied, i.e. after the hosting view has run the SwiftUI update and layout for it. The next CADisplayLink tick ends the sample.
- **Native iOS (SwiftUI)**: Mutation `layout` marks include the wait for the next UI update, the same semantics as native-ios (~16.5 ms at 60 Hz on the simulator there); SwiftUI applies a state change in that next update, not synchronously.
- **Native iOS (SwiftUI)**: list-scroll: ScrollView + LazyVStack (not List), rows built as they come on screen; the mount mark is the list container's layout (sentinel behind the scroll view), with the first screen of rows built.

## Nested chain (`nested-chain`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 24.7 · 33.2 (60) | 33.3 · 35.4 (60) | 16.5 · 16.8 (60) | 32.0 · 33.0 (60) | 16.6 · 17.0 (60) | 16.6 · 16.6 (60) | 16.6 · 16.6 (60) |
| M | 48.4 · 49.9 (60) | 50.0 · 50.1 (60) | 32.8 · 33.3 (60) | 49.0 · 50.0 (60) | 27.4 · 33.2 (60) | 16.6 · 49.3 (60) | 16.6 · 31.6 (60) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 15.0 · 17.0 (60) | 17.2 · 22.3 (60) | – | – | – | – | – |
| M | 23.5 · 26.6 (60) | 27.0 · 28.3 (60) | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 2.5 · 2.9 (60) | 2.0 · 3.1 (60) | – | – | – | – | – |
| M | 3.5 · 4.3 (60) | 1.2 · 1.3 (60) | – | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 22.6 · 25.4 (60) | 19.4 · 24.9 (60) | 12.3 · 14.9 (60) | 21.0 · 26.0 (60) | 12.1 · 15.1 (60) | 7.7 · 8.8 (60) | 9.2 · 11.0 (60) |
| M | 34.5 · 38.6 (60) | 29.4 · 30.7 (60) | 17.4 · 21.5 (60) | 35.5 · 40.0 (60) | 22.8 · 25.6 (60) | 8.4 · 11.2 (60) | 14.9 · 17.6 (60) |

## Tree fan-out (`tree-fanout`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 82.7 · 83.3 (60) | 83.4 · 83.4 (60) | 49.9 · 50.0 (60) | 48.5 · 105 (60) | 45.0 · 49.9 (60) | 29.4 · 33.3 (60) | 65.1 · 66.6 (60) |
| M | 183 · 185 (60) | 167 · 183 (60) | 83.3 · 83.4 (60) | 67.0 · 252 (60) | 85.8 · 91.3 (60) | 55.8 · 58.3 (60) | 183 · 198 (60) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 41.5 · 43.3 (60) | 62.4 · 65.7 (60) | – | – | – | – | – |
| M | 93.2 · 95.2 (60) | 142 · 146 (60) | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 6.5 · 7.1 (60) | 5.9 · 6.7 (60) | – | – | – | – | – |
| M | 14.0 · 14.4 (60) | 14.2 · 14.7 (60) | – | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 72.3 · 74.8 (60) | 67.4 · 71.0 (60) | 37.5 · 39.4 (60) | 36.0 · 88.8 (60) | 39.5 · 44.0 (60) | 27.5 · 29.7 (60) | 55.8 · 58.2 (60) |
| M | 171 · 178 (60) | 156 · 161 (60) | 69.8 · 73.6 (60) | 66.0 · 251 (60) | 78.2 · 81.8 (60) | 52.6 · 53.9 (60) | 177 · 182 (60) |

## Flex-wrap tiles (`flex-wrap-tiles`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 199 · 200 (60) | 183 · 183 (60) | 91.6 · 100 (60) | 100 · 283 (60) | 128 · 140 (60) | 60.3 · 66.7 (60) | 56.9 · 83.3 (60) |
| M | 702 · 733 (60) | 650 · 699 (60) | 583 · 716 (60) | 517 · 733 (60) | 633 · 683 (60) | 194 · 265 (60) | 232 · 249 (60) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 98.7 · 103 (60) | 105 · 110 (60) | – | – | – | – | – |
| M | 357 · 371 (60) | 395 · 421 (60) | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 9.7 · 10.1 (60) | 10.0 · 10.4 (60) | – | – | – | – | – |
| M | 30.9 · 31.6 (60) | 32.4 · 33.3 (60) | – | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 161 · 169 (60) | 146 · 155 (60) | 83.3 · 86.2 (60) | 93.0 · 279 (60) | 115 · 121 (60) | 58.1 · 59.9 (60) | 56.0 · 59.7 (60) |
| M | 600 · 629 (60) | 562 · 595 (60) | 569 · 700 (60) | 506 · 721 (60) | 448 · 476 (60) | 177 · 189 (60) | 174 · 185 (60) |

## Grid dashboard (`grid-dashboard`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 83.0 · 83.4 (60) | 83.3 · 83.4 (60) | 49.8 · 50.0 (60) | 49.0 · 50.0 (60) | 51.1 · 66.5 (60) | 33.3 · 39.1 (60) | 39.2 · 49.8 (60) |
| M | 200 · 200 (60) | 201 · 233 (60) | 99.9 · 100 (60) | 183 · 419 (60) | 233 · 249 (60) | 79.2 · 84.1 (60) | 76.0 · 99.9 (60) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 44.0 · 46.4 (60) | 49.7 · 51.3 (60) | – | – | – | – | – |
| M | 112 · 116 (60) | 123 · 133 (60) | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 4.9 · 5.3 (60) | 4.1 · 4.5 (60) | – | – | – | – | – |
| M | 14.1 · 14.7 (60) | 11.8 · 12.4 (60) | – | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 64.6 · 67.8 (60) | 64.7 · 67.0 (60) | 40.1 · 44.4 (60) | 36.0 · 40.0 (60) | 47.5 · 50.8 (60) | 30.9 · 34.2 (60) | 38.1 · 42.2 (60) |
| M | 176 · 184 (60) | 176 · 195 (60) | 90.3 · 95.6 (60) | 167 · 408 (60) | 201 · 209 (60) | 76.7 · 79.3 (60) | 75.3 · 80.1 (60) |

## Text flow (`text-flow`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 66.3 · 66.7 (60) | 50.0 · 66.7 (60) | 82.5 · 83.2 (60) | 50.0 · 51.0 (60) | 29.1 · 66.5 (60) | 18.2 · 51.4 (60) | 25.5 · 49.8 (60) |
| M | 166 · 167 (60) | 133 · 150 (60) | 199 · 217 (60) | 100 · 116 (60) | 83.2 · 85.2 (60) | 44.6 · 116 (60) | 55.7 · 101 (60) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 18.1 · 19.2 (60) | 11.4 · 13.2 (60) | – | – | – | – | – |
| M | 46.2 · 47.8 (60) | 26.4 · 28.0 (60) | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 1.3 · 1.5 (60) | 1.2 · 1.6 (60) | – | – | – | – | – |
| M | 3.0 · 3.3 (60) | 3.2 · 3.4 (60) | – | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 34.0 · 35.6 (60) | 24.4 · 27.1 (60) | 67.5 · 70.0 (60) | 38.0 · 40.2 (60) | 27.3 · 29.4 (60) | 16.6 · 21.4 (60) | 23.8 · 27.8 (60) |
| M | 87.6 · 90.6 (60) | 61.0 · 64.0 (60) | 197 · 204 (60) | 93.0 · 98.1 (60) | 80.4 · 82.4 (60) | 43.6 · 45.2 (60) | 54.7 · 56.8 (60) |

## Styled cards (`styled-cards`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 83.2 · 83.4 (60) | 100 · 100 (60) | 66.2 · 66.7 (60) | 50.0 · 67.6 (60) | 49.9 · 51.9 (60) | 30.6 · 50.0 (60) | 38.6 · 49.8 (60) |
| M | 265 · 283 (60) | 317 · 350 (60) | 133 · 150 (60) | 134 · 500 (60) | 235 · 266 (60) | 83.2 · 98.3 (60) | 83.8 · 89.8 (60) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 49.3 · 51.5 (60) | 53.8 · 56.3 (60) | – | – | – | – | – |
| M | 143 · 153 (60) | 158 · 176 (60) | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 3.9 · 4.1 (60) | 4.1 · 4.5 (60) | – | – | – | – | – |
| M | 12.5 · 13.1 (60) | 12.6 · 13.1 (60) | – | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 69.6 · 72.9 (60) | 69.1 · 72.0 (60) | 50.6 · 55.5 (60) | 49.0 · 55.5 (60) | 47.3 · 48.9 (60) | 23.7 · 31.4 (60) | 38.4 · 41.3 (60) |
| M | 215 · 232 (60) | 216 · 239 (60) | 128 · 133 (60) | 131 · 492 (60) | 225 · 229 (60) | 77.6 · 82.9 (60) | 83.2 · 85.5 (60) |

## Relayout: root resize (`relayout-resize`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 82.7 · 83.4 (60) | 83.1 · 83.3 (60) | 49.6 · 50.0 (60) | 50.0 · 51.0 (60) | 45.2 · 49.9 (60) | 31.0 · 33.2 (60) | 65.0 · 66.0 (60) |
| M | 183 · 200 (60) | 183 · 183 (60) | 83.3 · 83.4 (60) | 82.5 · 453 (60) | 85.1 · 99.3 (60) | 56.3 · 58.3 (60) | 183 · 199 (60) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 41.1 · 42.5 (60) | 70.3 · 73.3 (60) | – | – | – | – | – |
| M | 94.4 · 98.1 (60) | 146 · 154 (60) | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 6.6 · 6.8 (60) | 7.9 · 9.9 (60) | – | – | – | – | – |
| M | 14.4 · 14.8 (60) | 14.6 · 15.3 (60) | – | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 71.9 · 74.5 (60) | 75.9 · 78.6 (60) | 35.0 · 36.1 (60) | 36.5 · 40.0 (60) | 41.9 · 45.3 (60) | 25.8 · 29.7 (60) | 57.2 · 58.1 (60) |
| M | 174 · 185 (60) | 160 · 170 (60) | 70.4 · 74.4 (60) | 67.5 · 437 (60) | 77.1 · 79.5 (60) | 52.9 · 54.6 (60) | 180 · 183 (60) |

**shrink**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 20.4 · 21.6 (60) | 16.7 · 17.2 (60) | 16.6 · 16.7 (60) | 17.0 · 17.0 (60) | 33.3 · 33.4 (60) | 16.7 · 33.3 (60) | 32.7 · 33.3 (60) |
| M | 66.6 · 66.7 (60) | 16.6 · 16.8 (60) | 33.3 · 34.1 (60) | 17.0 · 17.0 (60) | 32.7 · 33.3 (60) | 33.3 · 33.3 (60) | 133 · 133 (60) |

**shrink.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 20.0 · 21.0 (60) | 1.8 · 2.4 (60) | 13.4 · 14.1 (60) | 5.0 · 6.0 (60) | 0.6 · 0.7 (60) | 2.0 · 2.4 (60) | 28.9 · 29.9 (60) |
| M | 52.8 · 56.8 (60) | 5.1 · 5.4 (60) | 31.9 · 32.7 (60) | 9.0 · 10.0 (60) | 1.2 · 1.4 (60) | 4.2 · 4.6 (60) | 117 · 120 (60) |

**grow**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 19.6 · 21.2 (60) | 16.7 · 17.2 (60) | 16.6 · 16.7 (60) | 17.0 · 17.0 (60) | 16.6 · 16.7 (60) | 16.6 · 16.6 (60) | 16.6 · 33.3 (60) |
| M | 66.7 · 66.7 (60) | 16.7 · 17.3 (60) | 33.3 · 34.9 (60) | 17.0 · 17.0 (60) | 16.6 · 16.6 (60) | 16.6 · 16.7 (60) | 50.0 · 66.2 (60) |

**grow.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 19.3 · 20.7 (60) | 2.0 · 2.3 (60) | 11.9 · 12.5 (60) | 5.0 · 6.0 (60) | 0.7 · 0.8 (60) | 2.5 · 4.0 (60) | 12.0 · 12.7 (60) |
| M | 52.9 · 56.3 (60) | 5.1 · 5.6 (60) | 31.7 · 32.9 (60) | 9.0 · 10.0 (60) | 1.3 · 1.5 (60) | 4.7 · 5.2 (60) | 48.5 · 50.3 (60) |

## Relayout: restyle every node (`relayout-style`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 82.8 · 83.4 (60) | 83.3 · 83.4 (60) | 49.9 · 50.0 (60) | 49.0 · 50.0 (60) | 45.7 · 49.9 (60) | 32.1 · 33.3 (60) | 66.0 · 66.2 (60) |
| M | 183 · 200 (60) | 167 · 183 (60) | 83.3 · 83.4 (60) | 67.0 · 121 (60) | 84.3 · 88.4 (60) | 55.9 · 58.4 (60) | 183 · 199 (60) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 40.1 · 42.2 (60) | 63.9 · 65.7 (60) | – | – | – | – | – |
| M | 94.4 · 98.3 (60) | 144 · 154 (60) | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 6.2 · 6.7 (60) | 6.1 · 6.3 (60) | – | – | – | – | – |
| M | 14.3 · 14.8 (60) | 14.3 · 14.7 (60) | – | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 70.5 · 74.9 (60) | 69.2 · 71.4 (60) | 34.9 · 36.5 (60) | 38.0 · 39.0 (60) | 42.4 · 44.7 (60) | 26.0 · 29.9 (60) | 56.1 · 58.6 (60) |
| M | 173 · 184 (60) | 159 · 170 (60) | 69.8 · 72.9 (60) | 66.0 · 107 (60) | 76.5 · 77.9 (60) | 52.4 · 54.3 (60) | 180 · 183 (60) |

**restyle**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 30.4 · 33.3 (60) | 16.9 · 17.8 (60) | 32.1 · 33.4 (60) | 16.0 · 17.0 (60) | 33.0 · 33.3 (60) | 31.7 · 33.3 (60) | 49.4 · 49.5 (60) |
| M | 83.3 · 100 (60) | 49.5 · 50.6 (60) | 50.0 · 50.7 (60) | 17.0 · 17.0 (60) | 16.6 · 33.3 (60) | 33.3 · 33.3 (60) | 149 · 150 (60) |

**restyle.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 29.2 · 31.3 (60) | 15.2 · 16.1 (60) | 17.3 · 18.2 (60) | 8.0 · 9.0 (60) | 2.1 · 2.6 (60) | 2.7 · 3.2 (60) | 33.5 · 34.8 (60) |
| M | 79.6 · 86.1 (60) | 43.4 · 44.7 (60) | 45.2 · 46.8 (60) | 15.0 · 16.0 (60) | 5.3 · 5.6 (60) | 5.6 · 6.3 (60) | 133 · 137 (60) |

**restore**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 28.5 · 33.3 (60) | 16.7 · 17.5 (60) | 16.6 · 19.7 (60) | 17.0 · 17.1 (60) | 16.6 · 16.6 (60) | 16.6 · 16.7 (60) | 36.1 · 50.0 (60) |
| M | 99.9 · 100 (60) | 49.4 · 49.5 (60) | 50.0 · 50.7 (60) | 17.0 · 17.0 (60) | 16.6 · 16.6 (60) | 16.6 · 16.6 (60) | 149 · 150 (60) |

**restore.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 27.8 · 30.2 (60) | 14.9 · 15.8 (60) | 15.3 · 16.2 (60) | 7.0 · 8.0 (60) | 2.6 · 3.1 (60) | 3.1 · 4.3 (60) | 35.0 · 35.6 (60) |
| M | 85.9 · 90.9 (60) | 42.7 · 43.6 (60) | 42.5 · 44.7 (60) | 15.0 · 16.0 (60) | 5.6 · 6.1 (60) | 6.5 · 7.0 (60) | 139 · 143 (60) |

## Insert / remove at head (`insert-remove`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 199 · 199 (60) | 183 · 183 (60) | 99.8 · 100 (60) | 116 · 451 (60) | 127 · 130 (60) | 62.1 · 83.2 (60) | 57.3 · 83.2 (60) |
| M | 700 · 733 (60) | 653 · 684 (60) | 467 · 605 (60) | 442 · 798 (60) | 636 · 650 (60) | 194 · 268 (60) | 232 · 233 (60) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 98.1 · 100 (60) | 108 · 113 (60) | – | – | – | – | – |
| M | 353 · 370 (60) | 398 · 414 (60) | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 9.9 · 10.2 (60) | 10.4 · 10.8 (60) | – | – | – | – | – |
| M | 30.0 · 31.1 (60) | 32.1 · 32.6 (60) | – | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 158 · 164 (60) | 150 · 158 (60) | 84.0 · 87.7 (60) | 99.0 · 437 (60) | 114 · 116 (60) | 59.3 · 62.0 (60) | 56.7 · 59.1 (60) |
| M | 593 · 622 (60) | 566 · 593 (60) | 462 · 598 (60) | 436 · 782 (60) | 449 · 457 (60) | 174 · 187 (60) | 173 · 177 (60) |

**insert**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 117 · 133 (60) | 82.7 · 83.3 (60) | 98.9 · 100 (60) | 50.0 · 66.0 (60) | 50.4 · 66.7 (60) | 33.3 · 33.3 (60) | 33.3 · 49.5 (60) |
| M | 233 · 250 (60) | 82.6 · 99.5 (60) | 333 · 367 (60) | 100 · 117 (60) | 66.6 · 83.3 (60) | 36.9 · 49.9 (60) | 81.7 · 83.3 (60) |

**insert.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 104 · 112 (60) | 62.5 · 67.0 (60) | 83.5 · 95.3 (60) | 37.0 · 49.2 (60) | 43.1 · 45.7 (60) | 21.3 · 22.4 (60) | 26.0 · 27.8 (60) |
| M | 219 · 232 (60) | 70.0 · 74.7 (60) | 323 · 352 (60) | 90.5 · 108 (60) | 50.1 · 51.7 (60) | 26.9 · 28.8 (60) | 66.9 · 70.4 (60) |

**remove**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 49.9 · 50.0 (60) | 32.7 · 32.9 (60) | 83.3 · 99.4 (60) | 16.0 · 17.0 (60) | 32.8 · 33.3 (60) | 16.6 · 32.9 (60) | 16.6 · 33.1 (60) |
| M | 166 · 167 (60) | 31.8 · 33.1 (60) | 301 · 416 (60) | 16.0 · 17.0 (60) | 32.7 · 48.4 (60) | 31.8 · 33.1 (60) | 49.4 · 50.0 (60) |

**remove.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 40.3 · 41.9 (60) | 4.8 · 5.1 (60) | 79.4 · 83.4 (60) | 5.0 · 6.0 (60) | 8.1 · 8.3 (60) | 3.1 · 3.3 (60) | 11.1 · 12.1 (60) |
| M | 151 · 161 (60) | 9.6 · 10.2 (60) | 295 · 405 (60) | 12.0 · 13.0 (60) | 19.2 · 19.6 (60) | 7.5 · 8.2 (60) | 36.1 · 38.7 (60) |
