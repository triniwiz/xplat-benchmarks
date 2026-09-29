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
}

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
