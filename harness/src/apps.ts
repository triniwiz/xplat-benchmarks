import { join } from 'node:path';
import type { AppId } from '../../scenarios/src/protocol';
import { ROOT } from './paths';

export interface AppDef {
  id: AppId;
  title: string;
  /** Project directory, relative to repo root. */
  dir: string;
  /** Where `bench sync` copies scenarios/src, relative to repo root. */
  sharedDir: string;
  /** Extra shared source folders `bench sync` copies (*.ts only), relative to repo root. */
  extraShared?: { from: string; to: string }[];
  /** Also write <sharedDir>/palette.css (the tokens' color classes) for CSS-styled apps. */
  paletteCss?: boolean;
  bundleId: { ios: string; android: string };
  /** Android launch activity (for `am start -n`), when not the default. */
  androidActivity: string;
  /** Known deviations from the spec, printed in every report. */
  notes?: string[];
}

const MASON_NOTES = [
  'Mason-native frame: Mason root, status Text, Mason Scroll host and Mason Ul; the window root is a core GridLayout only to apply Android insets.',
  'list-scroll: Mason Ul with keyed templates needs apps/ns-common/patches (masonkit 1.0.0-beta.104 ignores itemTemplates; Android onCreate treats the view type as a data index).',
  'list-scroll: each Ul cell has an extra full-width Mason root (cells size to max-content and ignore root margins).',
  'text-flow: no line clamp in Mason, so the 2-line clamp paragraphs render in full.',
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
    id: 'ns-angular-mason',
    title: 'NativeScript Angular + Mason',
    dir: 'apps/ns-angular-mason',
    sharedDir: 'apps/ns-angular-mason/src/shared',
    extraShared: [{ from: 'apps/ns-common', to: 'apps/ns-angular-mason/src/ns-common' }],
    paletteCss: true,
    bundleId: { ios: 'org.xplatbench.nsngmason', android: 'org.xplatbench.nsngmason' },
    androidActivity: NS_ACTIVITY,
    notes: [
      ...MASON_NOTES,
      'styled-cards v4: stylesheet `transform` is not applied under installMasonKit() (masonkit 1.0.0-beta.104, Android).',
    ],
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
    extraShared: [{ from: 'apps/ns-common', to: 'apps/ns-react-mason/src/ns-common' }],
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
    extraShared: [{ from: 'apps/ns-common', to: 'apps/ns-solid-mason/src/ns-common' }],
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
  },
  {
    id: 'lynx',
    title: 'Lynx',
    dir: 'apps/lynx',
    sharedDir: 'apps/lynx/bundle/src/shared',
    bundleId: { ios: 'org.xplatbench.lynx', android: 'org.xplatbench.lynx' },
    androidActivity: '.MainActivity',
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
