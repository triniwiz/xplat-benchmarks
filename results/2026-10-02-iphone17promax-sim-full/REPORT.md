# Results: 2026-10-02-iphone17promax-sim-full

- Device: iPhone 17 Pro Max (simulator), ios 26.4
- Rounds: 1, warmup 3, iterations 10 per round
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
| S | 20.4 · 25.4 (30) | 18.5 · 20.5 (30) | 16.6 · 17.3 (30) | 33.2 · 33.3 (30) | 33.2 · 33.3 (30) | 33.2 · 33.3 (30) |
| M | 33.3 · 35.0 (30) | 27.6 · 28.9 (30) | 16.7 · 33.4 (30) | 49.3 · 49.9 (30) | 33.3 · 49.9 (30) | 33.0 · 33.3 (30) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 10.3 · 11.6 (30) | 10.8 · 12.2 (30) | – | – | – | – |
| M | 17.7 · 18.6 (30) | 14.6 · 15.3 (30) | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 1.0 · 2.8 (30) | 0.7 · 0.9 (30) | – | – | – | – |
| M | 0.9 · 1.1 (30) | 0.8 · 0.8 (30) | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 19.3 · 23.7 (30) | 12.7 · 13.9 (30) | 9.8 · 13.2 (30) | 24.1 · 26.4 (30) | 18.9 · 20.2 (30) | 19.4 · 21.3 (30) |
| M | 32.1 · 33.7 (30) | 16.5 · 17.5 (30) | 13.2 · 19.4 (30) | 30.7 · 35.0 (30) | 18.6 · 19.9 (30) | 19.2 · 19.9 (30) |

## Tree fan-out (`tree-fanout`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 109 · 111 (30) | 60.6 · 69.2 (30) | 34.1 · 49.9 (30) | 49.9 · 50.0 (30) | 33.3 · 49.1 (30) | 66.1 · 66.6 (30) |
| M | 335 · 340 (30) | 164 · 194 (30) | 83.5 · 100 (30) | 100.0 · 117 (30) | 67.3 · 83.2 (30) | 233 · 233 (30) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 41.1 · 42.0 (30) | 51.7 · 56.5 (30) | – | – | – | – |
| M | 116 · 119 (30) | 136 · 160 (30) | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 6.0 · 6.7 (30) | 4.2 · 4.7 (30) | – | – | – | – |
| M | 13.6 · 14.6 (30) | 11.9 · 12.8 (30) | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 106 · 108 (30) | 55.9 · 62.7 (30) | 31.3 · 40.6 (30) | 36.8 · 44.5 (30) | 23.7 · 27.9 (30) | 56.4 · 61.3 (30) |
| M | 327 · 331 (30) | 148 · 174 (30) | 82.7 · 84.7 (30) | 84.7 · 89.3 (30) | 51.1 · 54.5 (30) | 222 · 224 (30) |

## Flex-wrap tiles (`flex-wrap-tiles`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 276 · 280 (30) | 156 · 187 (30) | 99.8 · 101 (30) | 199 · 200 (30) | 86.5 · 100.0 (30) | 82.8 · 83.3 (30) |
| M | 1094 · 1121 (30) | 608 · 740 (30) | 816 · 1035 (30) | 850 · 866 (30) | 284 · 351 (30) | 299 · 300 (30) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 123 · 126 (30) | 96.8 · 112 (30) | – | – | – | – |
| M | 478 · 490 (30) | 366 · 443 (30) | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 9.8 · 10.3 (30) | 8.4 · 9.1 (30) | – | – | – | – |
| M | 31.9 · 32.8 (30) | 30.9 · 31.8 (30) | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 240 · 245 (30) | 133 · 158 (30) | 94.1 · 98.7 (30) | 138 · 146 (30) | 62.6 · 69.6 (30) | 57.7 · 62.1 (30) |
| M | 960 · 986 (30) | 513 · 625 (30) | 807 · 1034 (30) | 604 · 617 (30) | 193 · 238 (30) | 220 · 226 (30) |

## Grid dashboard (`grid-dashboard`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 89.1 · 92.1 (30) | 60.5 · 68.9 (30) | 49.5 · 50.9 (30) | 66.2 · 66.6 (30) | 49.9 · 50.0 (30) | 49.6 · 49.9 (30) |
| M | 286 · 297 (30) | 193 · 229 (30) | 117 · 118 (30) | 283 · 300 (30) | 102 · 119 (30) | 99.8 · 116 (30) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 43.2 · 45.7 (30) | 40.1 · 43.0 (30) | – | – | – | – |
| M | 139 · 144 (30) | 117 · 138 (30) | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 3.9 · 4.5 (30) | 3.0 · 3.2 (30) | – | – | – | – |
| M | 13.9 · 14.5 (30) | 10.7 · 11.3 (30) | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 83.0 · 86.0 (30) | 53.0 · 59.4 (30) | 39.0 · 46.0 (30) | 47.0 · 49.3 (30) | 32.7 · 36.2 (30) | 35.7 · 40.0 (30) |
| M | 266 · 276 (30) | 165 · 196 (30) | 104 · 112 (30) | 248 · 258 (30) | 75.7 · 85.3 (30) | 84.1 · 89.9 (30) |

## Text flow (`text-flow`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 54.2 · 55.6 (30) | 39.4 · 40.5 (30) | 82.8 · 83.6 (30) | 66.3 · 68.3 (30) | 66.5 · 83.2 (30) | 47.9 · 49.9 (30) |
| M | 201 · 207 (30) | 130 · 149 (30) | 250 · 269 (30) | 183 · 200 (30) | 133 · 150 (30) | 116 · 117 (30) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 13.7 · 14.4 (30) | 8.6 · 9.3 (30) | – | – | – | – |
| M | 45.2 · 47.3 (30) | 24.6 · 25.8 (30) | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 0.9 · 1.0 (30) | 0.9 · 0.9 (30) | – | – | – | – |
| M | 2.9 · 3.1 (30) | 2.5 · 2.6 (30) | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 29.0 · 30.6 (30) | 18.9 · 19.9 (30) | 71.9 · 74.4 (30) | 33.5 · 38.0 (30) | 31.8 · 36.2 (30) | 17.5 · 25.6 (30) |
| M | 104 · 107 (30) | 57.0 · 65.1 (30) | 248 · 255 (30) | 91.9 · 94.8 (30) | 54.9 · 57.1 (30) | 55.4 · 59.0 (30) |

## Styled cards (`styled-cards`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 102 · 104 (30) | 82.3 · 93.7 (30) | 50.1 · 66.8 (30) | 66.4 · 66.6 (30) | 66.6 · 67.5 (30) | 49.8 · 66.3 (30) |
| M | 378 · 392 (30) | 303 · 362 (30) | 166 · 183 (30) | 341 · 350 (30) | 183 · 217 (30) | 133 · 133 (30) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 51.4 · 53.3 (30) | 43.9 · 47.1 (30) | – | – | – | – |
| M | 192 · 199 (30) | 151 · 177 (30) | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 3.3 · 3.6 (30) | 3.0 · 3.2 (30) | – | – | – | – |
| M | 12.8 · 13.6 (30) | 11.4 · 12.1 (30) | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 88.9 · 91.3 (30) | 57.7 · 64.0 (30) | 48.6 · 57.5 (30) | 48.3 · 50.8 (30) | 33.7 · 35.5 (30) | 32.3 · 42.4 (30) |
| M | 331 · 344 (30) | 206 · 244 (30) | 158 · 167 (30) | 281 · 291 (30) | 82.8 · 95.3 (30) | 97.8 · 102 (30) |

## Relayout: root resize (`relayout-resize`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 107 · 112 (30) | 60.5 · 68.6 (30) | 33.4 · 50.2 (30) | 49.8 · 49.9 (30) | 33.3 · 48.6 (30) | 66.6 · 66.6 (30) |
| M | 328 · 338 (30) | 158 · 194 (30) | 91.6 · 100 (30) | 99.9 · 117 (30) | 69.0 · 83.2 (30) | 233 · 235 (30) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 40.7 · 42.6 (30) | 51.3 · 57.3 (30) | – | – | – | – |
| M | 114 · 117 (30) | 131 · 160 (30) | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 6.1 · 7.1 (30) | 4.5 · 4.8 (30) | – | – | – | – |
| M | 13.9 · 14.6 (30) | 12.2 · 13.0 (30) | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 104 · 109 (30) | 55.6 · 62.4 (30) | 31.1 · 37.7 (30) | 35.7 · 45.0 (30) | 20.3 · 28.0 (30) | 60.1 · 62.9 (30) |
| M | 320 · 330 (30) | 143 · 175 (30) | 83.4 · 85.3 (30) | 84.8 · 89.8 (30) | 52.1 · 56.1 (30) | 224 · 229 (30) |

**shrink**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 51.1 · 54.1 (30) | 8.4 · 15.4 (30) | 16.2 · 17.0 (30) | 33.2 · 33.3 (30) | 33.3 · 33.3 (30) | 49.5 · 50.0 (30) |
| M | 145 · 150 (30) | 20.2 · 24.7 (30) | 49.9 · 50.3 (30) | 33.2 · 33.3 (30) | 49.6 · 50.0 (30) | 167 · 167 (30) |

**shrink.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 50.5 · 53.5 (30) | 3.2 · 11.4 (30) | 14.6 · 15.2 (30) | 16.9 · 17.0 (30) | 20.2 · 21.4 (30) | 36.0 · 36.8 (30) |
| M | 144 · 149 (30) | 7.8 · 9.3 (30) | 45.8 · 46.9 (30) | 17.2 · 17.5 (30) | 24.5 · 25.4 (30) | 154 · 158 (30) |

**grow**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 50.4 · 51.8 (30) | 15.5 · 17.0 (30) | 16.2 · 17.3 (30) | 33.3 · 33.3 (30) | 33.3 · 33.3 (30) | 33.3 · 33.3 (30) |
| M | 180 · 187 (30) | 20.6 · 24.1 (30) | 50.0 · 50.6 (30) | 33.3 · 33.3 (30) | 49.8 · 50.0 (30) | 66.6 · 66.6 (30) |

**grow.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 49.7 · 51.2 (30) | 11.7 · 13.1 (30) | 14.5 · 15.0 (30) | 17.0 · 17.2 (30) | 20.8 · 21.9 (30) | 19.3 · 19.6 (30) |
| M | 179 · 185 (30) | 7.9 · 8.8 (30) | 44.0 · 45.2 (30) | 17.4 · 17.5 (30) | 24.3 · 24.6 (30) | 63.2 · 63.9 (30) |

## Relayout: restyle every node (`relayout-style`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 109 · 113 (30) | 60.9 · 69.8 (30) | 33.3 · 50.2 (30) | 49.9 · 65.2 (30) | 33.4 · 49.4 (30) | 66.3 · 66.7 (30) |
| M | 325 · 332 (30) | 159 · 192 (30) | 99.5 · 100 (30) | 99.9 · 117 (30) | 66.6 · 83.1 (30) | 233 · 235 (30) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 41.1 · 42.2 (30) | 52.1 · 57.8 (30) | – | – | – | – |
| M | 114 · 117 (30) | 131 · 158 (30) | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 6.5 · 7.2 (30) | 4.6 · 4.9 (30) | – | – | – | – |
| M | 14.1 · 14.7 (30) | 12.3 · 12.9 (30) | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 106 · 110 (30) | 56.0 · 63.3 (30) | 31.0 · 36.6 (30) | 36.1 · 45.7 (30) | 24.1 · 28.1 (30) | 59.9 · 64.5 (30) |
| M | 317 · 324 (30) | 143 · 173 (30) | 84.0 · 85.3 (30) | 85.1 · 90.3 (30) | 44.5 · 55.4 (30) | 224 · 229 (30) |

**restyle**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 65.3 · 67.8 (30) | 17.4 · 20.7 (30) | 33.3 · 34.0 (30) | 33.3 · 33.3 (30) | 33.3 · 33.3 (30) | 49.9 · 50.0 (30) |
| M | 217 · 224 (30) | 55.1 · 67.4 (30) | 66.7 · 67.2 (30) | 33.3 · 33.3 (30) | 49.7 · 50.0 (30) | 183 · 183 (30) |

**restyle.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 64.3 · 66.8 (30) | 12.9 · 15.3 (30) | 20.1 · 20.8 (30) | 17.3 · 17.5 (30) | 20.3 · 21.5 (30) | 42.3 · 43.2 (30) |
| M | 215 · 222 (30) | 42.0 · 51.2 (30) | 60.4 · 61.8 (30) | 18.2 · 18.4 (30) | 24.4 · 25.5 (30) | 175 · 179 (30) |

**restore**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 65.2 · 67.2 (30) | 16.7 · 20.6 (30) | 33.3 · 33.8 (30) | 33.3 · 33.3 (30) | 33.3 · 33.3 (30) | 49.8 · 50.0 (30) |
| M | 184 · 188 (30) | 47.9 · 59.2 (30) | 66.7 · 67.4 (30) | 33.3 · 33.3 (30) | 49.8 · 50.0 (30) | 199 · 200 (30) |

**restore.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 64.2 · 66.2 (30) | 12.7 · 15.4 (30) | 20.1 · 20.7 (30) | 17.4 · 17.5 (30) | 20.8 · 21.6 (30) | 44.6 · 45.4 (30) |
| M | 182 · 186 (30) | 35.9 · 43.6 (30) | 58.2 · 60.2 (30) | 18.2 · 18.4 (30) | 24.6 · 25.5 (30) | 182 · 186 (30) |

## Insert / remove at head (`insert-remove`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 270 · 281 (30) | 153 · 188 (30) | 99.7 · 117 (30) | 200 · 200 (30) | 99.7 · 100.0 (30) | 83.0 · 83.3 (30) |
| M | 1082 · 1101 (30) | 757 · 774 (30) | 717 · 883 (30) | 849 · 883 (30) | 283 · 366 (30) | 300 · 300 (30) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 122 · 124 (30) | 95.0 · 111 (30) | – | – | – | – |
| M | 472 · 485 (30) | 458 · 467 (30) | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 10.0 · 10.5 (30) | 8.9 · 9.2 (30) | – | – | – | – |
| M | 31.9 · 33.5 (30) | 31.0 · 32.0 (30) | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 236 · 245 (30) | 131 · 157 (30) | 98.1 · 101 (30) | 139 · 146 (30) | 63.8 · 67.0 (30) | 59.7 · 63.6 (30) |
| M | 951 · 967 (30) | 637 · 650 (30) | 708 · 869 (30) | 603 · 619 (30) | 189 · 240 (30) | 220 · 226 (30) |

**insert**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 220 · 229 (30) | 70.1 · 89.5 (30) | 117 · 133 (30) | 83.3 · 100.0 (30) | 49.8 · 50.0 (30) | 49.7 · 50.0 (30) |
| M | 463 · 475 (30) | 98.9 · 102 (30) | 400 · 483 (30) | 116 · 117 (30) | 49.9 · 66.6 (30) | 99.9 · 100 (30) |

**insert.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 205 · 214 (30) | 60.4 · 76.7 (30) | 115 · 130 (30) | 58.3 · 61.4 (30) | 30.7 · 33.7 (30) | 33.2 · 34.7 (30) |
| M | 446 · 458 (30) | 86.1 · 88.3 (30) | 385 · 472 (30) | 67.2 · 69.9 (30) | 37.0 · 43.2 (30) | 89.6 · 91.6 (30) |

**remove**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 88.2 · 93.3 (30) | 7.4 · 9.5 (30) | 117 · 117 (30) | 33.3 · 33.3 (30) | 32.7 · 33.3 (30) | 33.0 · 33.3 (30) |
| M | 343 · 350 (30) | 16.4 · 18.8 (30) | 416 · 446 (30) | 50.0 · 50.0 (30) | 33.0 · 33.3 (30) | 51.8 · 52.9 (30) |

**remove.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) | React Native | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) |
|---|---:|---:|---:|---:|---:|---:|
| S | 87.3 · 92.3 (30) | 5.7 · 7.9 (30) | 107 · 112 (30) | 16.9 · 16.9 (30) | 19.2 · 19.5 (30) | 20.7 · 20.8 (30) |
| M | 339 · 347 (30) | 14.8 · 15.7 (30) | 405 · 430 (30) | 27.0 · 28.1 (30) | 26.0 · 28.5 (30) | 49.5 · 50.4 (30) |
