# Results: 2026-10-02-iphone17promax-sim-fair

- Device: iPhone 17 Pro Max (simulator), ios 26.4
- Rounds: 1, warmup 3, iterations 10 per round
- Cells: median ms · p90 ms (n). Lower is better.
- `<series>` = until painted (layout + next frame); `<series>.layout` = until the tree was laid out.
- ⚠️ simulator run — smoke-test numbers only.

## Versions

- **NativeScript Core**: @nativescript/core 9.1.3-next.2, @nativescript/ios 9.1.0, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38
- **NativeScript Core + Mason (local build)**: @nativescript/core 9.1.3-next.2, @nativescript/ios 9.1.0, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38, @triniwiz/nativescript-masonkit 1.0.0-beta.106
- **React Native**: react-native 0.87.1, react 19.2.3, @shopify/flash-list 2.3.2
- **Lynx**: @lynx-js/react 0.126.2, @lynx-js/rspeedy 0.18.0, lynx-sdk 4.1.0
- **Native iOS (UIKit)**: UIKit 26.4.1
- **Native iOS + Mason**: Mason 1.0.0-beta.106, UIKit 26.4.1
- **Native iOS (SwiftUI)**: SwiftUI 26.4.1

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

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 20.6 · 24.7 (30) | 17.0 · 22.4 (30) | 16.5 · 16.9 (30) | 17.0 · 33.1 (30) | 16.6 · 32.1 (30) | 31.8 · 32.7 (30) | 31.6 · 33.1 (30) |
| M | 33.2 · 34.3 (30) | 26.9 · 28.5 (30) | 16.6 · 33.0 (30) | 33.0 · 49.0 (30) | 28.8 · 32.4 (30) | 16.6 · 32.2 (30) | 31.9 · 33.2 (30) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 10.2 · 14.1 (30) | 9.9 · 12.0 (30) | – | – | – | – | – |
| M | 17.0 · 18.6 (30) | 14.4 · 15.6 (30) | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 1.7 · 4.0 (30) | 0.6 · 1.3 (30) | – | – | – | – | – |
| M | 0.9 · 1.1 (30) | 0.8 · 0.8 (30) | – | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 19.8 · 23.7 (30) | 12.0 · 15.5 (30) | 8.1 · 10.6 (30) | 15.0 · 21.0 (30) | 9.0 · 14.0 (30) | 5.5 · 6.7 (30) | 6.8 · 9.0 (30) |
| M | 32.1 · 33.0 (30) | 16.3 · 17.7 (30) | 13.1 · 16.8 (30) | 26.0 · 38.1 (30) | 16.5 · 24.8 (30) | 7.0 · 9.0 (30) | 9.6 · 11.7 (30) |

## Tree fan-out (`tree-fanout`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 90.8 · 94.1 (30) | 59.7 · 61.7 (30) | 33.1 · 49.8 (30) | 33.0 · 87.8 (30) | 45.0 · 49.9 (30) | 22.0 · 33.2 (30) | 65.9 · 66.6 (30) |
| M | 267 · 272 (30) | 154 · 158 (30) | 83.3 · 83.5 (30) | 67.0 · 135 (30) | 89.6 · 99.9 (30) | 50.3 · 66.6 (30) | 183 · 199 (30) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 38.2 · 39.8 (30) | 51.0 · 52.5 (30) | – | – | – | – | – |
| M | 96.5 · 98.4 (30) | 128 · 132 (30) | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 5.6 · 6.4 (30) | 4.5 · 5.0 (30) | – | – | – | – | – |
| M | 12.7 · 14.3 (30) | 11.7 · 12.7 (30) | – | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 88.4 · 91.7 (30) | 54.8 · 56.9 (30) | 30.3 · 36.5 (30) | 26.0 · 84.9 (30) | 34.2 · 43.9 (30) | 17.7 · 27.2 (30) | 55.3 · 57.4 (30) |
| M | 261 · 265 (30) | 139 · 144 (30) | 71.4 · 74.6 (30) | 63.0 · 120 (30) | 77.7 · 81.5 (30) | 39.7 · 47.6 (30) | 178 · 183 (30) |

## Flex-wrap tiles (`flex-wrap-tiles`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 220 · 226 (30) | 149 · 153 (30) | 99.7 · 100 (30) | 100 · 313 (30) | 135 · 167 (30) | 66.7 · 83.3 (30) | 66.6 · 83.3 (30) |
| M | 867 · 894 (30) | 577 · 589 (30) | 600 · 766 (30) | 525 · 734 (30) | 667 · 699 (30) | 209 · 300 (30) | 232 · 249 (30) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 101 · 104 (30) | 91.7 · 94.6 (30) | – | – | – | – | – |
| M | 379 · 389 (30) | 345 · 353 (30) | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 9.2 · 9.8 (30) | 8.7 · 9.2 (30) | – | – | – | – | – |
| M | 30.2 · 31.3 (30) | 29.4 · 31.0 (30) | – | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 193 · 198 (30) | 127 · 131 (30) | 84.2 · 87.3 (30) | 92.0 · 307 (30) | 117 · 122 (30) | 56.9 · 62.6 (30) | 53.8 · 57.8 (30) |
| M | 762 · 781 (30) | 488 · 500 (30) | 593 · 750 (30) | 519 · 725 (30) | 479 · 489 (30) | 185 · 197 (30) | 175 · 182 (30) |

## Grid dashboard (`grid-dashboard`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 77.5 · 80.8 (30) | 57.2 · 59.6 (30) | 47.5 · 49.9 (30) | 33.0 · 49.1 (30) | 49.6 · 65.9 (30) | 29.2 · 49.9 (30) | 32.3 · 48.6 (30) |
| M | 229 · 241 (30) | 182 · 185 (30) | 99.9 · 101 (30) | 167 · 222 (30) | 233 · 249 (30) | 79.3 · 99.9 (30) | 82.2 · 99.0 (30) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 41.2 · 43.3 (30) | 38.3 · 39.8 (30) | – | – | – | – | – |
| M | 114 · 118 (30) | 111 · 113 (30) | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 4.1 · 4.8 (30) | 2.9 · 3.3 (30) | – | – | – | – | – |
| M | 12.2 · 13.6 (30) | 9.7 · 10.8 (30) | – | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 72.7 · 75.9 (30) | 50.3 · 52.0 (30) | 33.2 · 39.8 (30) | 28.5 · 37.1 (30) | 44.1 · 48.2 (30) | 25.2 · 34.7 (30) | 26.5 · 33.7 (30) |
| M | 213 · 224 (30) | 156 · 159 (30) | 92.6 · 97.3 (30) | 165 · 207 (30) | 203 · 212 (30) | 71.4 · 79.5 (30) | 73.4 · 78.6 (30) |

## Text flow (`text-flow`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 50.0 · 53.6 (30) | 39.2 · 39.9 (30) | 66.3 · 67.1 (30) | 33.0 · 50.0 (30) | 48.8 · 49.9 (30) | 17.2 · 48.3 (30) | 26.8 · 49.0 (30) |
| M | 166 · 171 (30) | 126 · 128 (30) | 191 · 200 (30) | 99.0 · 102 (30) | 82.6 · 150 (30) | 49.8 · 117 (30) | 98.9 · 99.9 (30) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 13.7 · 14.7 (30) | 9.0 · 9.5 (30) | – | – | – | – | – |
| M | 41.7 · 43.6 (30) | 24.0 · 24.7 (30) | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 0.8 · 0.9 (30) | 0.9 · 0.9 (30) | – | – | – | – | – |
| M | 2.6 · 2.9 (30) | 2.5 · 2.7 (30) | – | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 28.7 · 31.6 (30) | 19.5 · 20.2 (30) | 57.7 · 64.8 (30) | 30.0 · 34.2 (30) | 18.1 · 22.6 (30) | 15.5 · 21.0 (30) | 17.3 · 20.4 (30) |
| M | 88.0 · 91.7 (30) | 54.7 · 56.2 (30) | 182 · 199 (30) | 94.0 · 99.8 (30) | 76.0 · 80.5 (30) | 41.1 · 46.5 (30) | 49.2 · 53.5 (30) |

## Styled cards (`styled-cards`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 85.8 · 88.9 (30) | 78.4 · 80.6 (30) | 49.8 · 66.2 (30) | 50.0 · 97.8 (30) | 49.7 · 66.1 (30) | 48.5 · 66.6 (30) | 32.2 · 49.0 (30) |
| M | 305 · 316 (30) | 288 · 291 (30) | 133 · 150 (30) | 134 · 517 (30) | 274 · 283 (30) | 167 · 183 (30) | 83.3 · 116 (30) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 47.2 · 48.9 (30) | 41.9 · 43.7 (30) | – | – | – | – | – |
| M | 155 · 163 (30) | 143 · 146 (30) | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 3.3 · 3.8 (30) | 3.1 · 3.2 (30) | – | – | – | – | – |
| M | 11.4 · 12.9 (30) | 11.3 · 12.2 (30) | – | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 76.2 · 78.7 (30) | 55.1 · 57.7 (30) | 40.7 · 53.1 (30) | 41.5 · 92.4 (30) | 39.4 · 47.9 (30) | 23.4 · 33.9 (30) | 27.3 · 32.7 (30) |
| M | 268 · 277 (30) | 195 · 198 (30) | 132 · 135 (30) | 131 · 508 (30) | 230 · 236 (30) | 76.0 · 81.6 (30) | 81.3 · 85.1 (30) |

## Relayout: root resize (`relayout-resize`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 92.9 · 95.7 (30) | 60.0 · 62.2 (30) | 33.3 · 33.9 (30) | 33.0 · 34.0 (30) | 36.2 · 49.9 (30) | 21.8 · 33.2 (30) | 65.8 · 66.6 (30) |
| M | 269 · 279 (30) | 157 · 160 (30) | 83.3 · 83.8 (30) | 67.0 · 466 (30) | 98.4 · 99.7 (30) | 51.5 · 66.6 (30) | 191 · 200 (30) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 38.8 · 40.6 (30) | 51.1 · 53.1 (30) | – | – | – | – | – |
| M | 95.9 · 102 (30) | 131 · 134 (30) | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 6.3 · 7.1 (30) | 4.5 · 4.8 (30) | – | – | – | – | – |
| M | 12.4 · 14.5 (30) | 11.8 · 12.5 (30) | – | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 90.5 · 93.1 (30) | 55.1 · 57.3 (30) | 30.4 · 32.0 (30) | 24.0 · 28.0 (30) | 30.7 · 35.9 (30) | 17.0 · 25.6 (30) | 57.3 · 59.4 (30) |
| M | 263 · 272 (30) | 142 · 146 (30) | 71.2 · 74.2 (30) | 64.0 · 459 (30) | 77.3 · 81.6 (30) | 43.8 · 47.2 (30) | 183 · 188 (30) |

**shrink**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 40.4 · 42.0 (30) | 13.4 · 15.3 (30) | 16.6 · 17.0 (30) | 17.0 · 17.0 (30) | 32.8 · 33.3 (30) | 16.6 · 33.3 (30) | 33.1 · 33.3 (30) |
| M | 116 · 120 (30) | 19.2 · 21.2 (30) | 33.3 · 50.0 (30) | 17.0 · 17.0 (30) | 33.0 · 33.3 (30) | 33.3 · 33.3 (30) | 133 · 133 (30) |

**shrink.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 39.9 · 41.5 (30) | 9.5 · 11.3 (30) | 14.3 · 14.8 (30) | 5.0 · 6.0 (30) | 0.8 · 1.0 (30) | 2.8 · 3.8 (30) | 29.5 · 30.0 (30) |
| M | 115 · 119 (30) | 7.0 · 9.3 (30) | 32.1 · 36.8 (30) | 10.0 · 11.0 (30) | 1.5 · 1.6 (30) | 7.3 · 8.1 (30) | 119 · 121 (30) |

**grow**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 39.5 · 41.0 (30) | 16.6 · 17.1 (30) | 16.7 · 17.1 (30) | 17.0 · 17.0 (30) | 16.6 · 16.6 (30) | 16.6 · 16.6 (30) | 16.6 · 32.7 (30) |
| M | 145 · 152 (30) | 19.3 · 20.8 (30) | 33.4 · 50.0 (30) | 17.0 · 17.0 (30) | 16.6 · 16.6 (30) | 16.6 · 16.7 (30) | 65.2 · 66.7 (30) |

**grow.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 39.0 · 40.5 (30) | 12.6 · 12.9 (30) | 12.8 · 13.7 (30) | 5.0 · 6.0 (30) | 0.8 · 1.1 (30) | 2.8 · 3.8 (30) | 12.4 · 13.1 (30) |
| M | 144 · 151 (30) | 6.9 · 8.0 (30) | 32.7 · 36.0 (30) | 10.0 · 11.0 (30) | 1.5 · 1.6 (30) | 7.2 · 7.6 (30) | 49.6 · 50.8 (30) |

## Relayout: restyle every node (`relayout-style`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 90.6 · 95.9 (30) | 60.0 · 62.3 (30) | 33.3 · 49.8 (30) | 33.0 · 49.1 (30) | 45.1 · 49.5 (30) | 20.5 · 33.1 (30) | 66.4 · 66.6 (30) |
| M | 268 · 273 (30) | 156 · 160 (30) | 83.3 · 83.5 (30) | 67.0 · 452 (30) | 99.4 · 99.7 (30) | 53.3 · 66.6 (30) | 199 · 200 (30) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 37.2 · 40.6 (30) | 51.2 · 53.3 (30) | – | – | – | – | – |
| M | 97.3 · 100 (30) | 130 · 133 (30) | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 6.0 · 7.1 (30) | 4.5 · 4.9 (30) | – | – | – | – | – |
| M | 13.6 · 14.6 (30) | 12.2 · 12.9 (30) | – | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 88.2 · 93.6 (30) | 55.1 · 57.3 (30) | 30.4 · 35.5 (30) | 27.5 · 34.2 (30) | 31.6 · 37.0 (30) | 16.5 · 21.4 (30) | 57.3 · 59.6 (30) |
| M | 261 · 266 (30) | 142 · 145 (30) | 71.4 · 75.1 (30) | 61.5 · 445 (30) | 77.7 · 80.6 (30) | 45.4 · 49.5 (30) | 183 · 187 (30) |

**restyle**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 51.2 · 54.0 (30) | 16.1 · 16.9 (30) | 33.3 · 33.4 (30) | 17.0 · 17.0 (30) | 32.8 · 33.3 (30) | 16.6 · 31.8 (30) | 49.8 · 50.0 (30) |
| M | 176 · 178 (30) | 54.1 · 55.4 (30) | 50.0 · 50.0 (30) | 17.0 · 17.0 (30) | 33.0 · 33.3 (30) | 33.3 · 33.3 (30) | 149 · 150 (30) |

**restyle.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 50.4 · 53.2 (30) | 11.9 · 12.5 (30) | 18.4 · 19.4 (30) | 7.0 · 9.0 (30) | 2.2 · 3.0 (30) | 3.1 · 4.2 (30) | 34.3 · 35.5 (30) |
| M | 174 · 177 (30) | 40.7 · 42.0 (30) | 47.2 · 48.5 (30) | 15.0 · 16.0 (30) | 5.9 · 6.1 (30) | 8.4 · 9.6 (30) | 138 · 139 (30) |

**restore**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 51.8 · 54.0 (30) | 16.0 · 17.2 (30) | 16.8 · 33.3 (30) | 17.0 · 17.0 (30) | 16.6 · 16.7 (30) | 16.6 · 16.7 (30) | 49.9 · 50.0 (30) |
| M | 147 · 150 (30) | 47.1 · 49.3 (30) | 50.0 · 50.1 (30) | 16.0 · 17.0 (30) | 16.6 · 16.7 (30) | 16.6 · 16.6 (30) | 149 · 150 (30) |

**restore.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 51.0 · 53.1 (30) | 11.9 · 12.8 (30) | 16.2 · 17.8 (30) | 7.0 · 9.0 (30) | 2.3 · 3.1 (30) | 3.2 · 4.7 (30) | 35.6 · 36.3 (30) |
| M | 145 · 148 (30) | 34.8 · 36.5 (30) | 45.1 · 46.7 (30) | 15.0 · 16.0 (30) | 6.3 · 6.6 (30) | 8.8 · 9.6 (30) | 143 · 145 (30) |

## Insert / remove at head (`insert-remove`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 220 · 224 (30) | 151 · 155 (30) | 100.0 · 100 (30) | 100 · 152 (30) | 166 · 167 (30) | 81.7 · 83.3 (30) | 66.6 · 83.3 (30) |
| M | 865 · 875 (30) | 615 · 628 (30) | 483 · 637 (30) | 458 · 799 (30) | 683 · 700 (30) | 267 · 283 (30) | 232 · 249 (30) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 100 · 104 (30) | 92.1 · 96.2 (30) | – | – | – | – | – |
| M | 379 · 381 (30) | 371 · 379 (30) | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 8.9 · 10.0 (30) | 9.0 · 9.4 (30) | – | – | – | – | – |
| M | 30.3 · 31.1 (30) | 29.4 · 30.3 (30) | – | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 193 · 196 (30) | 128 · 132 (30) | 84.3 · 88.1 (30) | 95.5 · 137 (30) | 118 · 123 (30) | 59.0 · 62.2 (30) | 55.1 · 58.9 (30) |
| M | 761 · 768 (30) | 517 · 529 (30) | 475 · 629 (30) | 453 · 783 (30) | 480 · 490 (30) | 185 · 190 (30) | 175 · 181 (30) |

**insert**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 178 · 182 (30) | 70.3 · 72.5 (30) | 100.0 · 100 (30) | 50.0 · 82.4 (30) | 66.4 · 82.5 (30) | 33.0 · 33.7 (30) | 33.2 · 33.4 (30) |
| M | 374 · 379 (30) | 81.0 · 82.8 (30) | 350 · 370 (30) | 100 · 117 (30) | 83.3 · 99.9 (30) | 33.4 · 50.0 (30) | 83.2 · 83.3 (30) |

**insert.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 166 · 170 (30) | 60.7 · 61.9 (30) | 85.5 · 87.9 (30) | 38.0 · 79.6 (30) | 46.4 · 48.1 (30) | 22.3 · 23.9 (30) | 26.1 · 27.4 (30) |
| M | 360 · 365 (30) | 70.3 · 71.9 (30) | 347 · 364 (30) | 89.0 · 111 (30) | 53.3 · 54.9 (30) | 30.9 · 32.0 (30) | 70.4 · 73.2 (30) |

**remove**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 74.5 · 78.6 (30) | 6.0 · 8.2 (30) | 99.7 · 118 (30) | 17.0 · 17.0 (30) | 32.9 · 33.2 (30) | 32.7 · 33.2 (30) | 32.2 · 33.3 (30) |
| M | 280 · 283 (30) | 14.7 · 16.6 (30) | 317 · 317 (30) | 17.0 · 17.0 (30) | 49.7 · 50.0 (30) | 31.9 · 33.0 (30) | 48.9 · 50.0 (30) |

**remove.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|---:|
| S | 73.7 · 77.7 (30) | 5.5 · 7.5 (30) | 83.5 · 115 (30) | 6.0 · 6.5 (30) | 7.9 · 8.5 (30) | 3.7 · 4.0 (30) | 11.4 · 12.7 (30) |
| M | 277 · 280 (30) | 13.0 · 15.2 (30) | 309 · 315 (30) | 13.0 · 13.0 (30) | 19.8 · 20.5 (30) | 10.9 · 11.4 (30) | 37.9 · 39.4 (30) |
