# Results: 2026-10-17-ipad-a16-beta118

- Device: Mali's iPad (device), ios 26.7
- Rounds: 3, warmup 3, iterations 20 per round
- Cells: median ms · p90 ms (n). Lower is better.
- `<series>` = until painted (layout + next frame); `<series>.layout` = until the tree was laid out.

## Versions

- **NativeScript Core**: @nativescript/core 9.1.3-next.2, @nativescript/ios 9.1.0-next.2026-10-13-38342327982, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38
- **NativeScript Core + Mason**: @nativescript/core 9.1.3-next.2, @nativescript/ios 9.1.0-next.2026-10-13-38342327982, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38, @triniwiz/nativescript-masonkit 1.0.0-beta.118
- **React Native**: react-native 0.87.1, react 19.2.3, @shopify/flash-list 2.3.2
- **Lynx**: @lynx-js/react 0.126.2, @lynx-js/rspeedy 0.18.0, lynx-sdk 4.1.0
- **Native iOS (UIKit)**: UIKit 26.7
- **Native iOS + Mason**: UIKit 26.7, Mason 1.0.0-beta.118
- **Native iOS (SwiftUI)**: SwiftUI 26.7
- **DartNative**: dartnative 1.2.0, dart 3.12.0-192.0.dev

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
- **DartNative**: DartNative 1.2: Flutter-style widgets in AOT Dart, mounted as real Android Views (iOS: UIKit) and laid out by Yoga, all on the main thread. Release build (arm64). Dart ports of the seeded generator, hash and runner; clock is a Dart Stopwatch. DartNative has no release mode for the iOS simulator, so iOS numbers come from a device.
- **DartNative**: The app is licensed (key compiled in); on a cold start the key is exchanged for a token in the background, which can overlap the first case (warmup covers it).
- **DartNative**: Painted: setState is applied in the next frame (diff, native view mutations and Yoga layout in one main-thread pass). The scenario root registers a post-frame callback from its build; the first one that sees the 1 dp sentinel's native frame (findRenderObject → localToGlobal/size) at a new position or size is the `layout` mark, with a per-frame fallback. The second DartNativePerformance frame callback (Choreographer / CADisplayLink) after the mark ends the sample. Android: the flush lands between vsyncs and the views are drawn in the next frame's traversal, so this is the frame after the one that drew them, as the native apps. iOS: the flush runs inside the display-link tick and the first callback fires in that same tick (91% of samples within 2 ms of the mark), so the second one is the next frame, as native-ios. The end time is taken inside that callback (Dart microtasks queued from it can run tens of ms later). `built` is the scenario root's build.
- **DartNative**: Borders: DartNative only renders uniform borders, so one-sided ones are extra views: the chain's left border is an outer box in the border colour with 1 dp left padding, table/list row bottoms and the nav's right edge are 1 dp ColoredBoxes, styled-cards v3 is a 4 dp band inside a 1 dp grey frame.
- **DartNative**: tree-fanout: rows are Row + Expanded, columns Column(stretch). relayout-resize: FractionallySizedBox is not supported by DartNative 1.2 (logged as a fallback that renders nothing), so 80% is Row(Expanded(flex: 4), Spacer(flex: 1)); the tree widget is reused so only the frame changes. relayout-style passes a flag down and rebuilds every node.
- **DartNative**: flex-wrap-tiles: Wrap; tiles in a line do not stretch to the tallest one (Wrap has no stretch). insert-remove: tiles are unkeyed, the Flutter default for stateless children. With a ValueKey per tile the same insert took ~5.5 s and the remove ~11 s at S (keyed reorder path), so keyed M/L would hit the step timeout.
- **DartNative**: grid-dashboard: flex-emulated, as React Native: header, then a Row(stretch) of nav and a Column of stat pairs (Row(stretch) of two Expanded cards) and table rows (Expanded flex 2/1/1/1). Row stretch is Yoga's; IntrinsicHeight rendered nothing.
- **DartNative**: Text: Text with TextStyle; line height via TextStyle.height only where React Native sets lineHeight; font sizes are SP (font scale 1 on the test device). Clamp is maxLines: 2 with ellipsis.
- **DartNative**: styled-cards: v0 BoxShadow (an elevation shadow on Android), v1 per-corner BorderRadius with a 2 dp border, v2 LinearGradient corner to corner, v4 Opacity + Transform.rotate + Transform.scale, v5 ClipRRect.
- **DartNative**: list-scroll: FastList (RecyclerView) with one builder for the three item types; the FastList itself is the sentinel (its first layout builds the visible rows).
- **DartNative**: No gc() hook in Dart; unmount clears the body and waits 2 frames.

## Nested chain (`nested-chain`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 33.3 · 33.6 (60) | 50.0 · 50.0 (60) | 33.3 · 33.4 (60) | 33.0 · 34.0 (60) | 21.1 · 23.4 (60) | 16.6 · 16.6 (60) | 16.6 · 16.6 (60) | 29.6 · 32.6 (60) |
| M | 50.0 · 66.7 (60) | 66.7 · 83.4 (60) | 33.3 · 33.4 (60) | 66.0 · 67.0 (60) | 38.0 · 43.0 (60) | 17.6 · 19.3 (60) | 23.9 · 27.6 (60) | 30.2 · 45.6 (60) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 21.4 · 22.4 (60) | 30.6 · 32.3 (60) | – | – | – | – | – | – |
| M | 36.3 · 39.4 (60) | 46.8 · 53.8 (60) | – | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 2.9 · 3.1 (60) | 3.2 · 3.3 (60) | – | – | – | – | – | 0.5 · 0.7 (60) |
| M | 5.1 · 5.2 (60) | 5.6 · 5.8 (60) | – | – | – | – | – | 0.5 · 0.6 (60) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 31.5 · 32.7 (60) | 32.8 · 34.7 (60) | 18.4 · 21.5 (60) | 29.0 · 32.0 (60) | 19.2 · 21.4 (60) | 10.9 · 11.6 (60) | 13.2 · 15.1 (60) | 14.9 · 16.1 (60) |
| M | 48.2 · 51.3 (60) | 49.7 · 56.8 (60) | 27.1 · 30.5 (60) | 51.0 · 58.2 (60) | 33.9 · 38.4 (60) | 17.0 · 18.7 (60) | 23.8 · 27.5 (60) | 25.2 · 26.5 (60) |

## Tree fan-out (`tree-fanout`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 83.3 · 83.4 (60) | 66.7 · 66.8 (60) | 66.6 · 66.7 (60) | 66.0 · 83.0 (60) | 55.3 · 57.7 (60) | 38.2 · 43.8 (60) | 50.2 · 51.8 (60) | 64.7 · 66.3 (60) |
| M | 150 · 150 (60) | 150 · 150 (60) | 66.7 · 66.7 (60) | 83.0 · 116 (60) | 66.8 · 67.6 (60) | 64.5 · 71.7 (60) | 158 · 159 (60) | 98.8 · 111 (60) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 42.2 · 44.3 (60) | 56.8 · 58.1 (60) | – | – | – | – | – | – |
| M | 78.3 · 79.5 (60) | 119 · 120 (60) | – | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 8.9 · 10.3 (60) | 6.2 · 6.5 (60) | – | – | – | – | – | 0.5 · 0.6 (60) |
| M | 14.0 · 14.4 (60) | 13.5 · 14.0 (60) | – | – | – | – | – | 0.6 · 0.7 (60) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 69.1 · 71.2 (60) | 61.4 · 62.8 (60) | 51.9 · 58.1 (60) | 51.0 · 70.2 (60) | 52.4 · 54.6 (60) | 36.7 · 42.3 (60) | 50.1 · 51.7 (60) | 46.0 · 52.0 (60) |
| M | 140 · 142 (60) | 132 · 133 (60) | 58.0 · 59.0 (60) | 70.5 · 102 (60) | 61.5 · 62.4 (60) | 62.1 · 69.2 (60) | 158 · 158 (60) | 82.7 · 84.7 (60) |

## Flex-wrap tiles (`flex-wrap-tiles`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 150 · 150 (60) | 135 · 138 (60) | 83.4 · 83.4 (60) | 83.0 · 100 (60) | 97.2 · 98.1 (60) | 51.5 · 53.2 (60) | 56.3 · 59.2 (60) | 131 · 143 (60) |
| M | 567 · 583 (60) | 539 · 550 (60) | 533 · 618 (60) | 217 · 317 (60) | 415 · 420 (60) | 137 · 139 (60) | 138 · 141 (60) | 329 · 331 (60) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 80.8 · 82.6 (60) | 88.9 · 90.2 (60) | – | – | – | – | – | – |
| M | 283 · 288 (60) | 334 · 341 (60) | – | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 9.8 · 10.1 (60) | 9.7 · 9.9 (60) | – | – | – | – | – | 0.6 · 0.7 (60) |
| M | 29.2 · 29.7 (60) | 29.7 · 30.3 (60) | – | – | – | – | – | 0.8 · 0.8 (60) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 127 · 129 (60) | 119 · 121 (60) | 72.5 · 76.3 (60) | 74.0 · 88.0 (60) | 87.3 · 88.2 (60) | 49.9 · 51.7 (60) | 56.1 · 59.0 (60) | 114 · 117 (60) |
| M | 483 · 492 (60) | 471 · 481 (60) | 533 · 614 (60) | 211 · 303 (60) | 332 · 335 (60) | 132 · 134 (60) | 138 · 140 (60) | 305 · 307 (60) |

## Grid dashboard (`grid-dashboard`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 83.3 · 83.4 (60) | 66.7 · 66.8 (60) | 66.6 · 66.7 (60) | 66.0 · 67.0 (60) | 64.2 · 67.2 (60) | 45.6 · 52.0 (60) | 50.4 · 59.0 (60) | 78.6 · 80.2 (60) |
| M | 150 · 150 (60) | 167 · 167 (60) | 83.4 · 83.5 (60) | 100 · 150 (60) | 182 · 183 (60) | 66.6 · 66.8 (60) | 64.5 · 66.7 (60) | 128 · 130 (60) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 47.6 · 50.7 (60) | 46.4 · 47.6 (60) | – | – | – | – | – | – |
| M | 89.2 · 89.9 (60) | 102 · 103 (60) | – | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 8.4 · 9.3 (60) | 4.6 · 4.7 (60) | – | – | – | – | – | 0.6 · 0.6 (60) |
| M | 13.5 · 13.8 (60) | 11.4 · 11.6 (60) | – | – | – | – | – | 0.7 · 0.7 (60) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 65.5 · 68.9 (60) | 58.4 · 59.8 (60) | 53.9 · 57.5 (60) | 51.0 · 53.0 (60) | 60.9 · 64.0 (60) | 44.5 · 51.1 (60) | 50.3 · 58.9 (60) | 53.1 · 54.0 (60) |
| M | 136 · 137 (60) | 142 · 143 (60) | 77.6 · 79.2 (60) | 99.0 · 146 (60) | 173 · 174 (60) | 64.5 · 65.0 (60) | 64.3 · 66.3 (60) | 104 · 108 (60) |

## Text flow (`text-flow`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 83.3 · 83.4 (60) | 66.7 · 66.7 (60) | 83.3 · 83.4 (60) | 67.0 · 67.0 (60) | 39.1 · 43.8 (60) | 30.1 · 36.2 (60) | 35.0 · 42.1 (60) | 78.0 · 90.5 (60) |
| M | 133 · 134 (60) | 83.4 · 83.5 (60) | 183 · 183 (60) | 100 · 102 (60) | 75.1 · 76.8 (60) | 45.8 · 50.1 (60) | 50.0 · 52.3 (60) | 145 · 158 (60) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 32.0 · 36.2 (60) | 25.0 · 30.3 (60) | – | – | – | – | – | – |
| M | 41.6 · 43.0 (60) | 24.0 · 24.6 (60) | – | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 4.4 · 4.7 (60) | 4.8 · 4.9 (60) | – | – | – | – | – | 0.5 · 0.6 (60) |
| M | 3.4 · 3.5 (60) | 3.2 · 3.3 (60) | – | – | – | – | – | 0.7 · 0.8 (60) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 49.5 · 54.3 (60) | 39.1 · 45.8 (60) | 69.7 · 76.5 (60) | 54.0 · 56.0 (60) | 38.2 · 42.8 (60) | 29.6 · 35.8 (60) | 34.9 · 42.0 (60) | 59.2 · 61.9 (60) |
| M | 76.3 · 78.4 (60) | 48.5 · 49.5 (60) | 168 · 171 (60) | 91.0 · 97.1 (60) | 73.8 · 75.4 (60) | 45.1 · 48.8 (60) | 49.0 · 52.2 (60) | 127 · 130 (60) |

## Styled cards (`styled-cards`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 66.7 · 83.4 (60) | 83.3 · 83.5 (60) | 66.7 · 83.3 (60) | 67.0 · 68.6 (60) | 62.2 · 64.2 (60) | 46.0 · 52.4 (60) | 50.0 · 57.7 (60) | 92.4 · 94.2 (60) |
| M | 200 · 200 (60) | 250 · 250 (60) | 117 · 117 (60) | 117 · 168 (60) | 185 · 188 (60) | 69.8 · 71.6 (60) | 70.3 · 71.1 (60) | 159 · 160 (60) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 44.9 · 47.6 (60) | 49.2 · 50.2 (60) | – | – | – | – | – | – |
| M | 116 · 117 (60) | 131 · 132 (60) | – | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 4.4 · 4.7 (60) | 4.4 · 4.6 (60) | – | – | – | – | – | 0.6 · 0.7 (60) |
| M | 12.1 · 12.4 (60) | 12.1 · 12.4 (60) | – | – | – | – | – | 0.7 · 0.7 (60) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 60.4 · 64.0 (60) | 61.1 · 62.1 (60) | 62.9 · 71.2 (60) | 64.0 · 67.0 (60) | 59.8 · 61.8 (60) | 44.8 · 51.3 (60) | 49.5 · 57.5 (60) | 65.8 · 69.9 (60) |
| M | 168 · 170 (60) | 173 · 174 (60) | 111 · 116 (60) | 104 · 160 (60) | 178 · 182 (60) | 67.9 · 69.7 (60) | 70.1 · 70.9 (60) | 139 · 143 (60) |

## Relayout: root resize (`relayout-resize`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 66.7 · 67.4 (60) | 100.0 · 100 (60) | 66.6 · 66.7 (60) | 67.0 · 67.0 (60) | 55.7 · 62.9 (60) | 38.0 · 44.8 (60) | 52.2 · 52.8 (60) | 71.1 · 74.8 (60) |
| M | 150 · 150 (60) | 150 · 150 (60) | 66.7 · 66.8 (60) | 83.0 · 117 (60) | 76.6 · 83.3 (60) | 68.5 · 71.4 (60) | 162 · 164 (60) | 107 · 108 (60) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 38.2 · 39.4 (60) | 82.4 · 84.4 (60) | – | – | – | – | – | – |
| M | 79.3 · 80.0 (60) | 127 · 128 (60) | – | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 6.9 · 7.3 (60) | 18.8 · 20.0 (60) | – | – | – | – | – | 0.5 · 0.6 (60) |
| M | 14.2 · 14.5 (60) | 16.1 · 16.6 (60) | – | – | – | – | – | 0.6 · 0.6 (60) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 64.1 · 65.8 (60) | 87.6 · 89.7 (60) | 51.7 · 58.0 (60) | 51.0 · 55.1 (60) | 52.6 · 59.7 (60) | 36.3 · 43.1 (60) | 52.1 · 52.7 (60) | 45.9 · 48.5 (60) |
| M | 142 · 143 (60) | 139 · 140 (60) | 58.2 · 60.7 (60) | 70.0 · 114 (60) | 71.1 · 76.5 (60) | 65.8 · 68.8 (60) | 161 · 163 (60) | 84.9 · 87.9 (60) |

**shrink**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 16.7 · 16.8 (60) | 16.7 · 16.7 (60) | 33.3 · 33.4 (60) | 17.0 · 17.0 (60) | 16.6 · 16.7 (60) | 16.6 · 16.7 (60) | 25.7 · 25.9 (60) | 24.4 · 25.9 (60) |
| M | 50.0 · 50.1 (60) | 16.7 · 16.7 (60) | 33.4 · 33.4 (60) | 17.0 · 17.0 (60) | 16.6 · 16.7 (60) | 16.6 · 16.7 (60) | 112 · 114 (60) | 23.6 · 25.1 (60) |

**shrink.built**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | – | – | 0.1 · 0.2 (60) |
| M | – | – | – | – | – | – | – | 0.1 · 0.2 (60) |

**shrink.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 15.5 · 15.6 (60) | 1.3 · 1.4 (60) | 17.3 · 17.9 (60) | 6.0 · 10.0 (60) | 0.7 · 0.7 (60) | 2.2 · 2.6 (60) | 25.4 · 25.6 (60) | 15.1 · 20.3 (60) |
| M | 42.2 · 42.4 (60) | 3.2 · 3.2 (60) | 25.7 · 25.8 (60) | 11.0 · 12.0 (60) | 0.9 · 0.9 (60) | 3.5 · 3.8 (60) | 111 · 113 (60) | 14.2 · 14.9 (60) |

**grow**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 16.7 · 16.8 (60) | 16.7 · 16.7 (60) | 16.6 · 33.4 (60) | 17.0 · 17.0 (60) | 16.7 · 16.7 (60) | 16.6 · 16.6 (60) | 16.6 · 16.8 (60) | 24.5 · 26.1 (60) |
| M | 50.0 · 50.1 (60) | 16.6 · 16.7 (60) | 33.3 · 33.4 (60) | 17.0 · 17.0 (60) | 16.6 · 16.7 (60) | 16.7 · 16.8 (60) | 41.1 · 41.8 (60) | 41.1 · 56.9 (60) |

**grow.built**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | – | – | 0.1 · 0.2 (60) |
| M | – | – | – | – | – | – | – | 0.1 · 0.1 (60) |

**grow.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 15.1 · 15.2 (60) | 1.4 · 1.5 (60) | 15.6 · 17.0 (60) | 7.0 · 10.0 (60) | 0.7 · 0.9 (60) | 4.2 · 4.4 (60) | 9.5 · 9.5 (60) | 14.2 · 16.1 (60) |
| M | 42.0 · 42.4 (60) | 3.1 · 3.2 (60) | 24.8 · 25.0 (60) | 10.0 · 11.0 (60) | 0.8 · 0.9 (60) | 3.7 · 3.9 (60) | 40.2 · 40.8 (60) | 28.2 · 30.0 (60) |

## Relayout: restyle every node (`relayout-style`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 66.7 · 66.8 (60) | 66.7 · 66.8 (60) | 66.6 · 66.7 (60) | 66.0 · 67.0 (60) | 55.3 · 57.2 (60) | 37.9 · 44.0 (60) | 52.2 · 54.5 (60) | 72.6 · 73.9 (60) |
| M | 150 · 150 (60) | 150 · 150 (60) | 66.7 · 66.8 (60) | 83.0 · 116 (60) | 68.0 · 70.6 (60) | 68.4 · 75.3 (60) | 169 · 170 (60) | 105 · 107 (60) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 36.3 · 37.3 (60) | 56.1 · 57.0 (60) | – | – | – | – | – | – |
| M | 80.5 · 82.8 (60) | 121 · 122 (60) | – | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 6.5 · 6.8 (60) | 6.0 · 6.2 (60) | – | – | – | – | – | 0.5 · 0.6 (60) |
| M | 15.0 · 15.9 (60) | 13.6 · 14.2 (60) | – | – | – | – | – | 0.6 · 0.6 (60) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 61.5 · 62.8 (60) | 60.8 · 61.6 (60) | 51.5 · 57.4 (60) | 51.0 · 55.0 (60) | 52.3 · 54.2 (60) | 36.3 · 42.2 (60) | 52.1 · 54.4 (60) | 45.9 · 50.1 (60) |
| M | 143 · 145 (60) | 133 · 135 (60) | 57.8 · 58.6 (60) | 67.0 · 108 (60) | 62.6 · 65.1 (60) | 65.7 · 72.6 (60) | 169 · 170 (60) | 85.4 · 89.6 (60) |

**restyle**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 23.0 · 23.2 (60) | 16.7 · 16.8 (60) | 33.4 · 33.4 (60) | 17.0 · 17.0 (60) | 16.6 · 16.7 (60) | 16.6 · 16.7 (60) | 27.2 · 28.1 (60) | 23.3 · 40.2 (60) |
| M | 66.7 · 66.9 (60) | 50.0 · 50.1 (60) | 50.1 · 50.1 (60) | 17.0 · 17.0 (60) | 16.6 · 16.8 (60) | 16.6 · 16.8 (60) | 151 · 153 (60) | 22.1 · 23.7 (60) |

**restyle.built**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | – | – | 0.1 · 0.2 (60) |
| M | – | – | – | – | – | – | – | 0.1 · 0.2 (60) |

**restyle.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 22.6 · 22.7 (60) | 11.9 · 12.0 (60) | 23.0 · 24.1 (60) | 9.0 · 13.0 (60) | 2.6 · 2.7 (60) | 3.0 · 3.4 (60) | 26.8 · 27.7 (60) | 20.3 · 21.1 (60) |
| M | 63.9 · 64.6 (60) | 34.9 · 35.5 (60) | 36.1 · 36.7 (60) | 15.0 · 16.0 (60) | 10.3 · 10.4 (60) | 4.7 · 5.0 (60) | 151 · 152 (60) | 15.7 · 16.9 (60) |

**restore**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 22.4 · 22.6 (60) | 16.7 · 16.8 (60) | 33.4 · 33.4 (60) | 17.0 · 17.0 (60) | 16.6 · 16.7 (60) | 16.6 · 16.7 (60) | 28.8 · 28.9 (60) | 22.8 · 25.9 (60) |
| M | 83.3 · 83.5 (60) | 50.0 · 50.2 (60) | 50.0 · 50.1 (60) | 17.0 · 17.0 (60) | 16.6 · 16.8 (60) | 16.6 · 16.8 (60) | 131 · 133 (60) | 55.1 · 56.5 (60) |

**restore.built**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | – | – | 0.1 · 0.2 (60) |
| M | – | – | – | – | – | – | – | 0.1 · 0.1 (60) |

**restore.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 22.0 · 22.1 (60) | 11.4 · 11.6 (60) | 19.3 · 20.7 (60) | 9.0 · 12.0 (60) | 3.0 · 3.0 (60) | 5.6 · 6.0 (60) | 28.5 · 28.6 (60) | 16.3 · 21.1 (60) |
| M | 67.2 · 67.8 (60) | 33.7 · 34.2 (60) | 35.1 · 35.6 (60) | 14.0 · 15.0 (60) | 5.8 · 5.9 (60) | 4.9 · 5.2 (60) | 130 · 132 (60) | 29.8 · 31.6 (60) |

## Insert / remove at head (`insert-remove`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 150 · 150 (60) | 150 · 150 (60) | 83.4 · 83.4 (60) | 92.0 · 137 (60) | 97.5 · 101 (60) | 61.4 · 64.5 (60) | 57.7 · 59.4 (60) | 138 · 139 (60) |
| M | 583 · 584 (60) | 550 · 550 (60) | 467 · 600 (60) | 259 · 334 (60) | 420 · 426 (60) | 137 · 138 (60) | 140 · 143 (60) | 320 · 333 (60) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 78.7 · 79.9 (60) | 92.3 · 94.4 (60) | – | – | – | – | – | – |
| M | 289 · 293 (60) | 335 · 341 (60) | – | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 9.2 · 9.5 (60) | 10.6 · 11.0 (60) | – | – | – | – | – | 0.7 · 0.7 (60) |
| M | 28.3 · 28.9 (60) | 29.0 · 29.4 (60) | – | – | – | – | – | 0.8 · 0.9 (60) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 125 · 126 (60) | 123 · 125 (60) | 71.9 · 73.4 (60) | 83.0 · 134 (60) | 87.6 · 90.9 (60) | 59.6 · 62.7 (60) | 57.6 · 59.3 (60) | 114 · 120 (60) |
| M | 494 · 498 (60) | 475 · 481 (60) | 456 · 591 (60) | 249 · 329 (60) | 336 · 340 (60) | 132 · 133 (60) | 139 · 143 (60) | 305 · 310 (60) |

**insert**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 100.0 · 100 (60) | 66.6 · 66.7 (60) | 66.7 · 66.7 (60) | 33.0 · 34.0 (60) | 35.9 · 36.0 (60) | 16.6 · 16.7 (60) | 19.2 · 19.3 (60) | 87.5 · 88.6 (60) |
| M | 217 · 217 (60) | 66.7 · 66.8 (60) | 283 · 283 (60) | 51.0 · 67.0 (60) | 54.1 · 57.0 (60) | 25.2 · 25.7 (60) | 52.2 · 54.2 (60) | 185 · 199 (60) |

**insert.built**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | – | – | 0.2 · 0.2 (60) |
| M | – | – | – | – | – | – | – | 0.1 · 0.4 (60) |

**insert.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 81.9 · 83.0 (60) | 48.2 · 48.5 (60) | 62.3 · 62.8 (60) | 23.0 · 26.0 (60) | 30.0 · 30.1 (60) | 13.4 · 13.5 (60) | 19.1 · 19.2 (60) | 66.1 · 67.1 (60) |
| M | 200 · 203 (60) | 54.8 · 56.3 (60) | 268 · 282 (60) | 49.5 · 63.1 (60) | 38.0 · 39.8 (60) | 17.8 · 17.9 (60) | 51.8 · 52.7 (60) | 167 · 170 (60) |

**remove**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 33.3 · 33.5 (60) | 16.7 · 16.8 (60) | 66.7 · 83.4 (60) | 17.0 · 17.0 (60) | 16.6 · 16.7 (60) | 16.6 · 16.7 (60) | 16.6 · 16.8 (60) | 54.4 · 55.7 (60) |
| M | 134 · 150 (60) | 16.7 · 16.8 (60) | 283 · 367 (60) | 33.0 · 34.0 (60) | 29.7 · 31.3 (60) | 16.6 · 16.6 (60) | 28.3 · 28.5 (60) | 150 · 165 (60) |

**remove.built**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | – | – | – | – | – | – | – | 0.2 · 0.2 (60) |
| M | – | – | – | – | – | – | – | 0.1 · 0.2 (60) |

**remove.layout**

| size | NativeScript Core | NativeScript Core + Mason | React Native | Lynx | Native iOS (UIKit) | Native iOS + Mason | Native iOS (SwiftUI) | DartNative |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 32.2 · 32.8 (60) | 3.6 · 3.6 (60) | 66.4 · 67.0 (60) | 5.5 · 6.0 (60) | 5.9 · 6.0 (60) | 1.8 · 1.8 (60) | 7.8 · 7.9 (60) | 39.2 · 39.6 (60) |
| M | 133 · 135 (60) | 6.8 · 6.9 (60) | 274 · 366 (60) | 26.0 · 29.0 (60) | 16.3 · 17.3 (60) | 5.0 · 5.2 (60) | 27.8 · 28.1 (60) | 134 · 138 (60) |
