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
];

export function getApp(id: string): AppDef {
  const app = APPS.find((a) => a.id === id);
  if (!app) throw new Error(`Unknown app "${id}". Known: ${APPS.map((a) => a.id).join(', ')}`);
  return app;
}

export function appPath(app: AppDef, ...parts: string[]): string {
  return join(ROOT, app.dir, ...parts);
}
