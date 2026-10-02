# Results: 2026-10-01-iphone17promax-sim-native-mason

- Device: iPhone 17 Pro Max (simulator), ios 26.4
- Rounds: 2, warmup 3, iterations 10 per round
- Cells: median ms · p90 ms (n). Lower is better.
- `<series>` = until painted (layout + next frame); `<series>.layout` = until the tree was laid out.
- ⚠️ simulator run — smoke-test numbers only.

## Versions

- **NativeScript Core**: @nativescript/core 9.1.3-next.2, @nativescript/ios 9.1.0, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38
- **NativeScript Core + Mason (local build)**: @nativescript/core 9.1.3-next.2, @nativescript/ios 9.1.0, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38, @triniwiz/nativescript-masonkit 1.0.0-beta.106
- **React Native**: react-native 0.87.1, react 19.2.3, @shopify/flash-list 2.3.2
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

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 19.8 · 24.3 (20) | 17.3 · 18.6 (20) | 16.5 · 16.8 (20) | 33.2 · 33.3 (20) | 32.7 · 33.2 (20) | 33.3 · 33.5 (20) |
| M | 32.8 · 34.7 (20) | 29.2 · 30.6 (20) | 16.5 · 17.3 (20) | 41.7 · 49.9 (20) | 49.4 · 49.7 (20) | 33.2 · 33.3 (20) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 9.0 · 13.0 (20) | 10.9 · 12.3 (20) | – | – | – | – |
| M | 17.5 · 18.1 (20) | 16.4 · 17.2 (20) | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 1.3 · 2.6 (20) | 0.7 · 2.1 (20) | – | – | – | – |
| M | 1.0 · 1.1 (20) | 0.8 · 0.9 (20) | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 18.8 · 23.2 (20) | 12.6 · 13.6 (20) | 10.4 · 12.3 (20) | 24.6 · 26.1 (20) | 18.6 · 20.1 (20) | 19.2 · 20.3 (20) |
| M | 31.7 · 33.5 (20) | 18.4 · 19.2 (20) | 11.7 · 14.3 (20) | 29.7 · 32.2 (20) | 18.3 · 18.9 (20) | 19.6 · 20.9 (20) |

## Tree fan-out (`tree-fanout`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 89.4 · 92.7 (20) | 68.0 · 70.3 (20) | 33.7 · 49.9 (20) | 49.7 · 49.9 (20) | 33.1 · 35.9 (20) | 66.5 · 66.6 (20) |
| M | 268 · 277 (20) | 180 · 184 (20) | 83.2 · 83.8 (20) | 99.9 · 100.0 (20) | 66.6 · 69.6 (20) | 199 · 200 (20) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 38.0 · 38.7 (20) | 58.5 · 60.3 (20) | – | – | – | – |
| M | 95.8 · 99.7 (20) | 152 · 156 (20) | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 6.0 · 6.1 (20) | 4.6 · 5.0 (20) | – | – | – | – |
| M | 13.3 · 14.7 (20) | 12.4 · 13.0 (20) | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 87.1 · 90.3 (20) | 62.8 · 64.8 (20) | 32.2 · 39.2 (20) | 37.6 · 43.1 (20) | 20.4 · 23.7 (20) | 55.4 · 58.4 (20) |
| M | 261 · 271 (20) | 164 · 169 (20) | 72.9 · 76.3 (20) | 78.3 · 79.8 (20) | 47.2 · 51.7 (20) | 186 · 192 (20) |

## Flex-wrap tiles (`flex-wrap-tiles`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 222 · 231 (20) | 178 · 183 (20) | 100.0 · 101 (20) | 167 · 168 (20) | 84.9 · 99.5 (20) | 83.3 · 83.3 (20) |
| M | 859 · 904 (20) | 651 · 700 (20) | 599 · 634 (20) | 667 · 716 (20) | 300 · 300 (20) | 249 · 250 (20) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 102 · 106 (20) | 114 · 118 (20) | – | – | – | – |
| M | 376 · 395 (20) | 413 · 456 (20) | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 9.3 · 9.9 (20) | 8.7 · 9.3 (20) | – | – | – | – |
| M | 30.0 · 31.1 (20) | 28.6 · 30.5 (20) | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 194 · 203 (20) | 153 · 159 (20) | 86.9 · 88.7 (20) | 120 · 124 (20) | 61.4 · 65.9 (20) | 55.4 · 59.0 (20) |
| M | 756 · 793 (20) | 559 · 603 (20) | 595 · 628 (20) | 479 · 514 (20) | 197 · 206 (20) | 183 · 188 (20) |

## Grid dashboard (`grid-dashboard`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 75.7 · 78.7 (20) | 61.9 · 63.9 (20) | 49.5 · 50.6 (20) | 66.4 · 66.6 (20) | 49.5 · 49.9 (20) | 49.3 · 49.9 (20) |
| M | 233 · 240 (20) | 192 · 201 (20) | 99.9 · 101 (20) | 233 · 249 (20) | 116 · 117 (20) | 91.6 · 100.0 (20) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 40.4 · 41.4 (20) | 43.3 · 44.5 (20) | – | – | – | – |
| M | 115 · 118 (20) | 123 · 128 (20) | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 4.2 · 4.9 (20) | 3.0 · 3.2 (20) | – | – | – | – |
| M | 13.5 · 14.1 (20) | 10.4 · 10.7 (20) | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 71.1 · 74.0 (20) | 55.0 · 56.9 (20) | 39.4 · 43.7 (20) | 47.9 · 49.7 (20) | 32.2 · 33.9 (20) | 35.9 · 42.3 (20) |
| M | 217 · 224 (20) | 167 · 175 (20) | 92.0 · 96.6 (20) | 205 · 218 (20) | 79.6 · 83.5 (20) | 74.1 · 79.7 (20) |

## Text flow (`text-flow`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 49.8 · 51.8 (20) | 40.0 · 40.8 (20) | 66.6 · 83.1 (20) | 65.8 · 66.1 (20) | 66.4 · 82.9 (20) | 48.2 · 49.9 (20) |
| M | 166 · 171 (20) | 130 · 134 (20) | 199 · 233 (20) | 166 · 166 (20) | 133 · 133 (20) | 110 · 117 (20) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 13.9 · 14.3 (20) | 9.1 · 9.9 (20) | – | – | – | – |
| M | 42.6 · 43.8 (20) | 26.0 · 27.7 (20) | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 0.8 · 0.9 (20) | 0.8 · 1.0 (20) | – | – | – | – |
| M | 2.9 · 3.1 (20) | 2.3 · 2.6 (20) | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 28.8 · 30.2 (20) | 19.4 · 21.0 (20) | 62.7 · 68.5 (20) | 32.9 · 38.3 (20) | 31.5 · 34.4 (20) | 17.8 · 23.4 (20) |
| M | 88.8 · 93.1 (20) | 58.1 · 59.8 (20) | 183 · 217 (20) | 86.4 · 89.9 (20) | 55.2 · 57.2 (20) | 54.0 · 60.2 (20) |

## Styled cards (`styled-cards`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 84.4 · 90.0 (20) | 87.1 · 93.5 (20) | 65.5 · 66.6 (20) | 66.1 · 66.2 (20) | 66.5 · 66.6 (20) | 49.7 · 52.1 (20) |
| M | 306 · 322 (20) | 307 · 320 (20) | 149 · 150 (20) | 283 · 300 (20) | 183 · 183 (20) | 117 · 120 (20) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 46.8 · 48.5 (20) | 49.8 · 53.1 (20) | – | – | – | – |
| M | 156 · 162 (20) | 166 · 173 (20) | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 3.5 · 3.7 (20) | 3.1 · 3.4 (20) | – | – | – | – |
| M | 12.3 · 12.8 (20) | 11.2 · 11.9 (20) | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 74.9 · 79.9 (20) | 63.3 · 67.9 (20) | 51.3 · 56.5 (20) | 49.1 · 53.1 (20) | 33.7 · 35.0 (20) | 32.5 · 41.3 (20) |
| M | 269 · 283 (20) | 217 · 226 (20) | 136 · 148 (20) | 231 · 241 (20) | 81.0 · 84.3 (20) | 91.3 · 93.4 (20) |

## Relayout: root resize (`relayout-resize`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 90.6 · 95.4 (20) | 64.2 · 66.4 (20) | 33.2 · 49.5 (20) | 49.4 · 49.9 (20) | 33.2 · 35.0 (20) | 66.2 · 66.6 (20) |
| M | 264 · 274 (20) | 173 · 182 (20) | 83.4 · 83.8 (20) | 99.6 · 99.7 (20) | 67.6 · 72.2 (20) | 199 · 202 (20) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 37.2 · 39.8 (20) | 55.5 · 57.3 (20) | – | – | – | – |
| M | 96.1 · 99.4 (20) | 146 · 152 (20) | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 5.8 · 7.1 (20) | 4.6 · 4.8 (20) | – | – | – | – |
| M | 13.6 · 14.5 (20) | 12.0 · 12.8 (20) | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 88.3 · 93.1 (20) | 59.5 · 61.5 (20) | 31.1 · 33.0 (20) | 39.3 · 42.8 (20) | 22.5 · 24.3 (20) | 60.4 · 62.0 (20) |
| M | 258 · 268 (20) | 158 · 166 (20) | 74.7 · 76.9 (20) | 78.2 · 84.4 (20) | 50.4 · 53.6 (20) | 192 · 197 (20) |

**shrink**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 40.2 · 41.5 (20) | 10.9 · 13.5 (20) | 16.5 · 17.4 (20) | 33.0 · 33.3 (20) | 33.2 · 33.3 (20) | 32.7 · 33.2 (20) |
| M | 114 · 117 (20) | 19.6 · 21.3 (20) | 50.0 · 50.4 (20) | 33.0 · 33.1 (20) | 49.4 · 50.0 (20) | 133 · 133 (20) |

**shrink.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 39.7 · 41.0 (20) | 7.1 · 9.5 (20) | 13.9 · 14.6 (20) | 16.7 · 17.0 (20) | 20.1 · 21.1 (20) | 30.5 · 31.5 (20) |
| M | 113 · 116 (20) | 7.3 · 8.2 (20) | 36.5 · 37.8 (20) | 17.1 · 17.3 (20) | 24.4 · 25.3 (20) | 127 · 128 (20) |

**grow**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 40.7 · 42.0 (20) | 16.7 · 17.0 (20) | 16.6 · 17.3 (20) | 33.3 · 33.3 (20) | 33.3 · 33.3 (20) | 32.7 · 33.3 (20) |
| M | 145 · 149 (20) | 19.4 · 21.0 (20) | 49.5 · 50.1 (20) | 33.3 · 33.3 (20) | 49.4 · 49.9 (20) | 66.2 · 66.7 (20) |

**grow.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 40.2 · 41.5 (20) | 12.9 · 13.1 (20) | 12.9 · 13.9 (20) | 17.1 · 17.3 (20) | 20.3 · 21.7 (20) | 18.8 · 19.4 (20) |
| M | 144 · 148 (20) | 7.2 · 7.9 (20) | 35.4 · 36.4 (20) | 17.4 · 17.5 (20) | 24.4 · 25.1 (20) | 52.1 · 53.5 (20) |

## Relayout: restyle every node (`relayout-style`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 91.2 · 93.7 (20) | 65.8 · 70.0 (20) | 33.6 · 50.0 (20) | 49.7 · 49.9 (20) | 33.1 · 49.1 (20) | 58.0 · 66.6 (20) |
| M | 263 · 270 (20) | 175 · 180 (20) | 83.3 · 84.0 (20) | 99.8 · 100.0 (20) | 66.8 · 77.0 (20) | 199 · 200 (20) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 38.9 · 40.1 (20) | 56.2 · 59.2 (20) | – | – | – | – |
| M | 95.9 · 97.5 (20) | 148 · 151 (20) | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 6.7 · 7.2 (20) | 4.6 · 5.0 (20) | – | – | – | – |
| M | 14.0 · 14.5 (20) | 12.2 · 12.9 (20) | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 88.9 · 91.2 (20) | 61.0 · 64.2 (20) | 31.9 · 36.6 (20) | 37.8 · 40.3 (20) | 22.4 · 25.8 (20) | 49.4 · 58.6 (20) |
| M | 256 · 263 (20) | 160 · 164 (20) | 73.0 · 75.4 (20) | 77.4 · 80.7 (20) | 49.1 · 55.3 (20) | 185 · 194 (20) |

**restyle**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 50.0 · 51.7 (20) | 18.0 · 19.3 (20) | 33.3 · 33.7 (20) | 33.1 · 33.2 (20) | 33.0 · 33.3 (20) | 50.0 · 50.5 (20) |
| M | 172 · 178 (20) | 59.9 · 62.0 (20) | 50.0 · 50.8 (20) | 33.2 · 33.3 (20) | 49.5 · 49.9 (20) | 150 · 150 (20) |

**restyle.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 49.3 · 50.9 (20) | 13.6 · 14.8 (20) | 18.5 · 19.9 (20) | 17.1 · 17.2 (20) | 20.3 · 21.4 (20) | 35.3 · 35.7 (20) |
| M | 170 · 176 (20) | 46.3 · 47.8 (20) | 47.6 · 49.3 (20) | 17.9 · 18.1 (20) | 24.4 · 25.0 (20) | 141 · 146 (20) |

**restore**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 50.4 · 51.3 (20) | 18.2 · 19.2 (20) | 16.7 · 33.6 (20) | 33.3 · 33.3 (20) | 33.3 · 33.3 (20) | 49.4 · 49.8 (20) |
| M | 146 · 150 (20) | 51.9 · 54.3 (20) | 50.0 · 50.6 (20) | 33.3 · 33.3 (20) | 49.5 · 50.0 (20) | 150 · 166 (20) |

**restore.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 49.6 · 50.5 (20) | 13.8 · 14.8 (20) | 15.9 · 18.3 (20) | 17.4 · 17.5 (20) | 21.1 · 22.8 (20) | 35.7 · 36.5 (20) |
| M | 145 · 148 (20) | 39.2 · 40.3 (20) | 47.2 · 48.5 (20) | 18.1 · 18.2 (20) | 24.3 · 25.0 (20) | 146 · 152 (20) |

## Insert / remove at head (`insert-remove`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 217 · 224 (20) | 174 · 179 (20) | 99.7 · 100 (20) | 167 · 168 (20) | 99.5 · 99.9 (20) | 83.2 · 83.3 (20) |
| M | 850 · 880 (20) | 681 · 707 (20) | 483 · 683 (20) | 666 · 683 (20) | 300 · 304 (20) | 249 · 252 (20) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 99.8 · 105 (20) | 114 · 116 (20) | – | – | – | – |
| M | 372 · 386 (20) | 435 · 454 (20) | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 9.7 · 10.0 (20) | 8.9 · 9.5 (20) | – | – | – | – |
| M | 30.1 · 30.6 (20) | 29.5 · 30.4 (20) | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 190 · 196 (20) | 151 · 155 (20) | 85.3 · 91.7 (20) | 119 · 123 (20) | 64.5 · 67.5 (20) | 59.6 · 62.8 (20) |
| M | 748 · 773 (20) | 583 · 605 (20) | 477 · 671 (20) | 473 · 482 (20) | 198 · 205 (20) | 185 · 193 (20) |

**insert**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 177 · 184 (20) | 80.1 · 85.1 (20) | 83.3 · 100 (20) | 66.5 · 68.3 (20) | 49.5 · 49.6 (20) | 49.4 · 49.4 (20) |
| M | 367 · 386 (20) | 88.7 · 92.6 (20) | 350 · 387 (20) | 82.8 · 99.5 (20) | 49.9 · 50.0 (20) | 83.0 · 83.4 (20) |

**insert.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 165 · 172 (20) | 69.6 · 74.6 (20) | 82.7 · 87.6 (20) | 45.0 · 47.3 (20) | 30.1 · 30.9 (20) | 27.2 · 29.1 (20) |
| M | 353 · 372 (20) | 78.4 · 81.0 (20) | 343 · 371 (20) | 51.9 · 54.4 (20) | 37.9 · 38.6 (20) | 72.6 · 75.5 (20) |

**remove**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 73.8 · 90.5 (20) | 7.5 · 9.5 (20) | 83.3 · 133 (20) | 33.0 · 33.3 (20) | 32.9 · 33.2 (20) | 33.3 · 33.3 (20) |
| M | 277 · 282 (20) | 14.9 · 16.6 (20) | 325 · 359 (20) | 49.4 · 50.0 (20) | 32.9 · 33.0 (20) | 49.4 · 49.8 (20) |

**remove.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 73.0 · 89.6 (20) | 5.6 · 8.9 (20) | 82.4 · 124 (20) | 16.5 · 16.8 (20) | 18.9 · 19.2 (20) | 20.2 · 20.7 (20) |
| M | 274 · 279 (20) | 13.1 · 14.1 (20) | 313 · 352 (20) | 21.6 · 22.6 (20) | 26.0 · 26.9 (20) | 39.2 · 42.5 (20) |
