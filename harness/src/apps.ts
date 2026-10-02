import { join } from 'node:path';
import type { AppId } from '../../scenarios/src/protocol';
import { ROOT } from './paths';

export interface AppDef {
  id: AppId;
  title: string;
  dir: string;
  sharedDir: string;
  extraShared?: { from: string; to: string }[];
  paletteCss?: boolean;
  bundleId: { ios: string; android: string };
  androidActivity: string;
  notes?: string[];
}

const MASON_NOTES = [
  'Mason-native frame: Mason root, status Text, Mason Scroll host and Mason Ul; the window root is a core GridLayout only to apply Android insets.',
  'list-scroll: each Ul cell has an extra full-width Mason root (cells size to max-content and ignore root margins).',
  'list-scroll (iOS): the first screen of the Mason Ul fills only ~7 cells and leaves the rest blank (masonkit 1.0.0-beta.104).',
  'text-flow: no line clamp in Mason, so the 2-line clamp paragraphs render in full.',
  'styled-cards v4: stylesheet `transform` (rotate/scale) is not applied inside a Mason-native tree (it was when the host was a core ScrollView; masonkit 1.0.0-beta.105, Android).',
];


const NS_ACTIVITY = 'com.tns.NativeScriptActivity';

export const APPS: readonly AppDef[] = [
  {
    id: 'ns-core',
    title: 'NativeScript Core',
    dir: 'apps/ns-core',
    sharedDir: 'apps/ns-core/app/shared',
    extraShared: [{ from: 'apps/ns-common', to: 'apps/ns-core/app/ns-common' }],
    paletteCss: true,
    bundleId: { ios: 'org.xplatbench.nscore', android: 'org.xplatbench.nscore' },
    androidActivity: NS_ACTIVITY,
    notes: ['styled-cards v5: core does not clip children to border-radius (overflow: hidden unsupported).'],
  },
  {
    id: 'ns-core-mason',
    title: 'NativeScript Core + Mason',
    dir: 'apps/ns-core-mason',
    sharedDir: 'apps/ns-core-mason/app/shared',
    extraShared: [{ from: 'apps/ns-common', to: 'apps/ns-core-mason/app/ns-common' }],
    paletteCss: true,
    bundleId: { ios: 'org.xplatbench.nscoremason', android: 'org.xplatbench.nscoremason' },
    androidActivity: NS_ACTIVITY,
    notes: MASON_NOTES,
  },
  {
    id: 'ns-core-mason-perf',
    title: 'NativeScript Core + Mason (local build)',
    dir: 'apps/ns-core-mason-perf',
    sharedDir: 'apps/ns-core-mason-perf/app/shared',
    extraShared: [{ from: 'apps/ns-common', to: 'apps/ns-core-mason-perf/app/ns-common' }],
    paletteCss: true,
    bundleId: { ios: 'org.xplatbench.nscoremasonperf', android: 'org.xplatbench.nscoremasonperf' },
    androidActivity: NS_ACTIVITY,
    notes: MASON_NOTES,
  },
  {
    id: 'ns-angular-mason',
    title: 'NativeScript Angular + Mason',
    dir: 'apps/ns-angular-mason',
    sharedDir: 'apps/ns-angular-mason/src/shared',
    extraShared: [{ from: 'apps/ns-common', to: 'apps/ns-angular-mason/src/ns-common' }],
    paletteCss: true,
    bundleId: { ios: 'org.xplatbench.nsngmason', android: 'org.xplatbench.nsngmason' },
    androidActivity: NS_ACTIVITY,
    notes: MASON_NOTES,
  },
  {
    id: 'ns-vue-mason',
    title: 'NativeScript Vue + Mason',
    dir: 'apps/ns-vue-mason',
    sharedDir: 'apps/ns-vue-mason/src/shared',
    extraShared: [{ from: 'apps/ns-common', to: 'apps/ns-vue-mason/src/ns-common' }],
    paletteCss: true,
    bundleId: { ios: 'org.xplatbench.nsvuemason', android: 'org.xplatbench.nsvuemason' },
    androidActivity: NS_ACTIVITY,
    notes: MASON_NOTES,
  },
  {
    id: 'ns-react-mason',
    title: 'NativeScript React + Mason',
    dir: 'apps/ns-react-mason',
    sharedDir: 'apps/ns-react-mason/src/shared',
    extraShared: [
      { from: 'apps/ns-common', to: 'apps/ns-react-mason/src/ns-common' },
      { from: 'apps/ns-dominative', to: 'apps/ns-react-mason/src/ns-dominative' },
    ],
    paletteCss: true,
    bundleId: { ios: 'org.xplatbench.nsreactmason', android: 'org.xplatbench.nsreactmason' },
    androidActivity: NS_ACTIVITY,
    notes: MASON_NOTES,
  },
  {
    id: 'ns-svelte-mason',
    title: 'NativeScript Svelte + Mason',
    dir: 'apps/ns-svelte-mason',
    sharedDir: 'apps/ns-svelte-mason/src/shared',
    extraShared: [{ from: 'apps/ns-common', to: 'apps/ns-svelte-mason/src/ns-common' }],
    paletteCss: true,
    bundleId: { ios: 'org.xplatbench.nssveltemason', android: 'org.xplatbench.nssveltemason' },
    androidActivity: NS_ACTIVITY,
    notes: MASON_NOTES,
  },
  {
    id: 'ns-solid-mason',
    title: 'NativeScript Solid + Mason',
    dir: 'apps/ns-solid-mason',
    sharedDir: 'apps/ns-solid-mason/src/shared',
    extraShared: [
      { from: 'apps/ns-common', to: 'apps/ns-solid-mason/src/ns-common' },
      { from: 'apps/ns-dominative', to: 'apps/ns-solid-mason/src/ns-dominative' },
    ],
    paletteCss: true,
    bundleId: { ios: 'org.xplatbench.nssolidmason', android: 'org.xplatbench.nssolidmason' },
    androidActivity: NS_ACTIVITY,
    notes: MASON_NOTES,
  },
  {
    id: 'react-native',
    title: 'React Native',
    dir: 'apps/react-native',
    sharedDir: 'apps/react-native/src/shared',
    bundleId: { ios: 'org.xplatbench.rn', android: 'org.xplatbench.rn' },
    androidActivity: '.MainActivity',
    notes: [
      'grid-dashboard: flex-emulated (React Native has no CSS grid).',
      'Text uses allowFontScaling={false} and textBreakStrategy="simple" to lay out like the other apps (dp text, greedy line breaking).',
      'list-scroll: FlashList v2; the mount mark is the list container layout, as for the other apps\' lists.',
    ],
  },
  {
    id: 'lynx',
    title: 'Lynx',
    dir: 'apps/lynx',
    sharedDir: 'apps/lynx/bundle/src/shared',
    paletteCss: true,
    bundleId: { ios: 'org.xplatbench.lynx', android: 'org.xplatbench.lynx' },
    androidActivity: '.MainActivity',
    notes: [
      'Clock: Date.now() (1 ms resolution); Lynx\'s background thread has no performance.now().',
      'Painted is observed on the background thread: layoutchange events cross from the main thread, as any Lynx app would see them.',
      'grid-dashboard: grid placed by line numbers (Lynx has no grid-template-areas).',
      'Host registers the Log and HTTP services only (no images in the scenarios); Lynx logs an image-prefetch error at load.',
    ],
  },
  {
    id: 'ng-native',
    title: 'Angular Native',
    dir: 'apps/ng-native',
    sharedDir: 'apps/ng-native/src/shared',
    paletteCss: true,
    bundleId: { ios: 'org.xplatbench.ngnative', android: 'org.xplatbench.ngnative' },
    androidActivity: '.MainActivity',
    notes: [
      'Angular 22 driving React Native Fabric through @ng-native (Expo SDK 57, React Native 0.86); styles are component CSS compiled at build time.',
      'grid-dashboard: flex-emulated, as in React Native (no CSS grid).',
      'Recursive tree and chain levels are components with a display: contents host, so they add no box, like React components.',
      'list-scroll is not implemented.',
    ],
  },
  {
    id: 'native-ios',
    title: 'Native iOS (UIKit)',
    dir: 'apps/native-ios',
    // The fixture generator, hash and runner are Swift ports (apps/native-ios/NativeIOS/{Fixtures,Bench});
    // sync still copies the TS here, unused. Hashes are checked by apps/native-ios/scripts/check-hashes.sh.
    sharedDir: 'apps/native-ios/shared',
    bundleId: { ios: 'org.xplatbench.nativeios', android: 'org.xplatbench.nativeios' },
    androidActivity: '.MainActivity',
    notes: [
      'Native baseline, iOS only: Swift + UIKit, no framework. Swift ports of the seeded generator, hash and runner; clock is CACurrentMediaTime().',
      'Layout is Auto Layout with nested UIStackViews for every flex row/column (padding and border widths as layout margins, one-sided borders as edge CALayers).',
      'flex-wrap-tiles / insert-remove: UIKit has no wrapping stack, so a small non-virtualized container packs the tiles into lines in layoutSubviews (tiles measured once with systemLayoutSizeFitting, stretched to the line height).',
      'grid-dashboard: flex-emulated, as in React Native (UIKit has no CSS grid); table rows use 2:1:1:1 width constraints.',
      'Painted: after mount/mutation the sentinel and scroll host get setNeedsLayout; Core Animation lays layers out top-down and depth-first, so the sentinel\'s layoutSubviews (the `layout` mark) runs once everything before it is placed; the next CADisplayLink tick ends the sample.',
      'list-scroll: UITableView with self-sizing cells and one reuse identifier per item type; the mount mark is the table\'s first layoutSubviews (visible cells built).',
    ],
  },
  {
    id: 'native-ios-mason',
    title: 'Native iOS + Mason',
    dir: 'apps/native-ios-mason',
    // Same Swift fixture/runner ports as native-ios; hashes are checked by apps/native-ios-mason/scripts/check-hashes.sh.
    sharedDir: 'apps/native-ios-mason/shared',
    bundleId: { ios: 'org.xplatbench.nativeiosmason', android: 'org.xplatbench.nativeiosmason' },
    androidActivity: '.MainActivity',
    notes: [
      'Mason without NativeScript or JS, iOS only: the native-ios harness (Swift fixtures, runner, clock) with every scenario tree built through Mason\'s Swift API (MasonUIView, MasonText, MasonStyle), matching the NativeScript + Mason stylesheet.',
      'Chrome is UIKit: status label and a UIScrollView host (the NativeScript + Mason apps use a Mason Scroll). The host\'s layoutSubviews computes the Mason root at its width with a max-content height and applies the frames.',
      'Styles: typed MasonStyle setters for display, flex, sizes, padding, margin, border widths and colours; Mason CSS strings for border style, border-radius, box-shadow, transform, the gradient and grid templates/areas. Opacity is UIView.alpha, as in NativeScript.',
      'grid-dashboard: Mason CSS grid (template areas), as the NativeScript + Mason apps; React Native and native-ios emulate it with flex.',
      'text-flow: no line clamp in Mason, so the 2-line clamp paragraphs render in full (as in the NativeScript + Mason apps).',
      'Painted: as native-ios. The sentinel is a plain UIView leaf after every other node; the host\'s layoutSubviews does the Mason pass first (Core Animation lays out top-down, depth-first), so the sentinel\'s layoutSubviews (the `layout` mark) runs after Mason has placed every view and the Mason views\' own layoutSubviews have run; the next CADisplayLink tick ends the sample.',
      'list-scroll: UITableView as in native-ios, each cell a Mason root (the NativeScript + Mason item templates) computed at the table width in systemLayoutSizeFitting; badges are rebuilt on every bind, as in those apps.',
    ],
  },
  {
    id: 'native-ios-swiftui',
    title: 'Native iOS (SwiftUI)',
    dir: 'apps/native-ios-swiftui',
    // Same Swift fixture/runner ports as native-ios; hashes are checked by apps/native-ios-swiftui/scripts/check-hashes.sh.
    sharedDir: 'apps/native-ios-swiftui/shared',
    bundleId: { ios: 'org.xplatbench.nativeiosswiftui', android: 'org.xplatbench.nativeiosswiftui' },
    androidActivity: '.MainActivity',
    notes: [
      'SwiftUI baseline, iOS only: the native-ios harness (Swift fixtures, runner, clock) with every scenario tree as SwiftUI views (VStack/HStack/ZStack, Text, shapes, modifiers), matching native-ios scenario by scenario. Deployment target iOS 17.',
      'Chrome: a UIHostingController root with the status Text above a vertical ScrollView (non-lazy VStack content), as native-ios. The scene delegate and URL handling are UIKit, as in native-ios.',
      'State: mutations only change @Observable models read by the views (relayout-resize width fraction, relayout-style flag passed down the tree, insert-remove tile array); nothing pokes UIKit.',
      'flex-wrap-tiles / insert-remove: a custom SwiftUI Layout packs the fixed-width tiles into lines and proposes each the line height (as native-ios\'s WrapView); not lazy.',
      'grid-dashboard: flex-emulated with stacks, as native-ios (no SwiftUI Grid); table rows are a small custom Layout giving 2:1:1:1 widths, equal-height rows use HStack + fixedSize(vertical).',
      'relayout-resize: a one-child custom Layout proposes 100% / 80% of the width.',
      'Text: Text with the same system fonts; absolute line heights are lineSpacing plus half the extra above and below (glyphs centred, as native-ios); the 2-line clamp is lineLimit(2) with tail truncation.',
      'styled-cards: v0 shadow is .shadow(radius 3, y 2) on the card shape, v1 UnevenRoundedRectangle, v2 a LinearGradient with end points computed for CSS 135deg (GeometryReader), v4 compositingGroup + opacity + scale + rotation, v5 clipShape.',
      'Painted: as native-ios. The sentinel (a 1pt UIViewRepresentable after the scenario content) takes a generation number bumped in the same transaction as the mount/mutation; updateUIView marks it with setNeedsLayout, and its layoutSubviews (the `layout` mark) only counts once that generation is applied, i.e. after the hosting view has run the SwiftUI update and layout for it. The next CADisplayLink tick ends the sample.',
      'Mutation `layout` marks include the wait for the next UI update, the same semantics as native-ios (~16.5 ms at 60 Hz on the simulator there); SwiftUI applies a state change in that next update, not synchronously.',
      'list-scroll: ScrollView + LazyVStack (not List), rows built as they come on screen; the mount mark is the list container\'s layout (sentinel behind the scroll view), with the first screen of rows built.',
    ],
  },
  {
    id: 'native-android',
    title: 'Native Android (Views)',
    dir: 'apps/native-android',
    // The fixture generator, hash and runner are Kotlin ports shared with native-android-mason
    // (apps/native-android-common); sync still copies the TS here, unused. `./gradlew test` checks the hashes.
    sharedDir: 'apps/native-android/shared',
    bundleId: { ios: 'org.xplatbench.nativeandroid', android: 'org.xplatbench.nativeandroid' },
    androidActivity: '.MainActivity',
    notes: [
      'Native baseline, Android only: Kotlin + Android Views, no framework. Kotlin ports of the seeded generator, hash and runner; clock is System.nanoTime().',
      'Layout is nested LinearLayouts (weights for flex: 1, MATCH_PARENT children for cross-axis stretch); borders and radii are background drawables (GradientDrawable, a small per-side border drawable), with border widths added to the padding.',
      'flex-wrap-tiles / insert-remove: FlexboxLayout (com.google.android.flexbox) with flexWrap=wrap; remove is removeViews(0, 100).',
      'grid-dashboard: flex-emulated, as in React Native (Android Views have no CSS grid); table rows use 2:1:1:1 weights.',
      'Text: TextView with dp sizes, includeFontPadding=false, simple break strategy, no hyphenation (as React Native); lineHeight only where styles.ts sets it.',
      'styled-cards: v0 shadow is a 3 dp elevation shadow (not a CSS blur), v2 gradient is GradientDrawable TL_BR, v4 is View alpha/rotation/scale, v5 clips with clipToOutline.',
      'Painted: the sentinel\'s OnLayoutChangeListener records the `layout` mark (it is the last child, laid out after the rest of the tree in the same traversal); the next Choreographer frame ends the sample. Steps resume inside the Choreographer frame callback, so a mount\'s layout runs in that same frame (as requestAnimationFrame in NativeScript).',
      'list-scroll: RecyclerView with one view type per item type; the RecyclerView is the sentinel (its first layout builds the visible cells).',
      'gc() is Runtime.gc() between iterations; unmount waits 2 frames.',
    ],
  },
  {
    id: 'native-android-mason',
    title: 'Native Android + Mason',
    dir: 'apps/native-android-mason',
    // Same Kotlin fixture/runner ports as native-android (apps/native-android-common).
    sharedDir: 'apps/native-android-mason/shared',
    bundleId: { ios: 'org.xplatbench.nativeandroidmason', android: 'org.xplatbench.nativeandroidmason' },
    androidActivity: '.MainActivity',
    notes: [
      'Mason without NativeScript or JS, Android only: the native-android runner, clock and painted rule, with every element built from Kotlin through masonkit (local masonkit-release.aar copied into app/libs).',
      'Frame is Mason end to end, as in the NativeScript + Mason apps: a Mason root with the status Text and a Mason Scroll host (native-android uses a ScrollView).',
      'Styles: the typed Style API in one configure batch per element (display, flex, sizes, padding, margin, border widths/colours/style, radii, colours, fonts); Mason CSS strings for box-shadow, transform, the gradient (backgroundImage) and grid templates/areas. Opacity is View.alpha, as in NativeScript.',
      'grid-dashboard: Mason CSS grid (template areas), as the NativeScript + Mason apps; native-android and React Native emulate it with flex.',
      'text-flow: no line clamp in Mason, so the 2-line clamp paragraphs render in full (as in the NativeScript + Mason apps).',
      'Painted: as native-android (sentinel OnLayoutChangeListener, then one Choreographer frame). Mason defers relayout after a style change to its own postOnAnimation compute, so mutation samples include that scheduling, as in the NativeScript + Mason apps.',
      'list-scroll: Mason ListView (the RecyclerView-backed list behind the NativeScript Mason Ul) with one view type per item type; each cell is a full-width Mason root and badges are rebuilt on every bind, as in those apps.',
    ],
  },
  {
    id: 'native-android-compose',
    title: 'Native Android (Jetpack Compose)',
    dir: 'apps/native-android-compose',
    // Same Kotlin fixture/runner ports as native-android (apps/native-android-common).
    sharedDir: 'apps/native-android-compose/shared',
    bundleId: { ios: 'org.xplatbench.nativeandroidcompose', android: 'org.xplatbench.nativeandroidcompose' },
    androidActivity: '.MainActivity',
    notes: [
      'Jetpack Compose, Android only: the native-android Kotlin fixtures, hash, runner and clock (apps/native-android-common) in a ComponentActivity. The whole frame (status text, scroll host, scenario) is one composition; Compose BOM 2026.09.00 (Compose 1.12.1), foundation only, no Material.',
      'Layout is Column/Row/Box with weights for flex: 1; borders are Modifier.border or a per-side drawBehind, drawn inside the box with the border width added to the padding; margins are an outer padding. Release build without R8, as native-android (`-Pminify` builds an R8 variant).',
      'tree-fanout: cross-axis stretch is not emulated (siblings have identical subtrees, so heights already match); restyle recomposes every inner node (padding and border colour are read in composition).',
      'flex-wrap-tiles / insert-remove: FlowRow with fillMaxRowHeight for align-items: stretch; tiles are a SnapshotStateList keyed by id, insert is addAll(0, 100) and remove is removeRange(0, 100).',
      'grid-dashboard: flex-emulated with Row/Column, as native-android and React Native (no custom Layout); table rows use 2:1:1:1 weights. The nav column and each stat pair stretch to the row height with IntrinsicSize.Min + fillMaxHeight, an extra intrinsic pass (native-android\'s MATCH_PARENT children cost a second measure).',
      'Text: BasicText with dp sizes (independent of font scale), LineBreak.Simple, Hyphens.None and Compose\'s default includeFontPadding=false; lineHeight uses LineHeightStyle(Top, Trim.Both) to place the extra leading where TextView\'s line spacing puts it.',
      'styled-cards: v0 shadow is Modifier.shadow(3 dp), the same elevation shadow as native-android; v2 gradient is Brush.linearGradient corner to corner; v4 is a graphicsLayer (alpha, rotation, scale); v5 clips with Modifier.clip.',
      'Painted: the 1 dp sentinel Box after all scenario content carries Modifier.onGloballyPositioned. Its first callback after a mount or mutation is the `layout` mark (Compose dispatches it once the whole measure/layout pass is done, before draw) and the next Choreographer frame ends the sample, as native-android. Every mutation moves or resizes the sentinel.',
      'Mutations write snapshot state (mutableStateOf, SnapshotStateList). Compose recomposes on its own frame clock, so a write made in the runner\'s Choreographer callback is composed in a later frame and samples include that wait (native-android lays out in the same frame). Extra marks: `frame` (first frame after the write) and, for mount, `composed` (SideEffect once the scenario composition is applied).',
      'list-scroll: LazyColumn with key = id and one contentType per item type; the LazyColumn is the sentinel (its first layout composes the visible cells).',
      'gc() is Runtime.gc() between iterations; unmount clears the body state and waits 2 frames.',
    ],
  },
];

export function getApp(id: string): AppDef {
  const app = APPS.find((a) => a.id === id);
  if (!app) throw new Error(`Unknown app "${id}". Known: ${APPS.map((a) => a.id).join(', ')}`);
  return app;
}

export function appPath(app: AppDef, ...parts: string[]): string {
  return join(ROOT, app.dir, ...parts);
}
