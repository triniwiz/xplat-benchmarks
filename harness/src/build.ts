import { spawn } from 'node:child_process';
import { copyFileSync, createWriteStream, existsSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import type { AppDef } from './apps';
import type { Platform } from './devices/types';
import { ROOT } from './paths';

// Release builds per stack. Android only for now; outputs are copied to
// build/<platform>/<app>.apk and logs to build/logs/<app>-<platform>.log.

export const BUILD_DIR = join(ROOT, 'build');

const ANDROID_HOME = process.env.ANDROID_HOME ?? join(homedir(), 'Library', 'Android', 'sdk');

// Local release signing with the Android debug keystore (never for distribution).
const DEBUG_KEYSTORE = [
  '--key-store-path', join(homedir(), '.android', 'debug.keystore'),
  '--key-store-password', 'android',
  '--key-store-alias', 'androiddebugkey',
  '--key-store-alias-password', 'android',
];

interface Step {
  cwd: string;
  cmd: string;
  args: string[];
}

function steps(app: AppDef, platform: Platform, apkOut: string): { steps: Step[]; artifact?: string } {
  const dir = join(ROOT, app.dir);
  if (platform !== 'android') throw new Error('bench build: only --platform android is implemented so far');
  if (app.id.startsWith('ns-')) {
    return {
      steps: [{ cwd: dir, cmd: 'ns', args: ['build', 'android', '--release', ...DEBUG_KEYSTORE, '--copy-to', apkOut] }],
    };
  }
  if (app.id === 'react-native') {
    return {
      steps: [{ cwd: join(dir, 'android'), cmd: './gradlew', args: ['assembleRelease', '-PreactNativeArchitectures=arm64-v8a', '--console=plain', '-q'] }],
      artifact: join(dir, 'android/app/build/outputs/apk/release/app-release.apk'),
    };
  }
  if (app.id === 'lynx') {
    return {
      steps: [
        { cwd: join(dir, 'bundle'), cmd: 'npm', args: ['run', 'build'] },
        { cwd: join(dir, 'hosts/android'), cmd: './gradlew', args: ['assembleRelease', '--console=plain', '-q'] },
      ],
      artifact: join(dir, 'hosts/android/app/build/outputs/apk/release/app-release.apk'),
    };
  }
  throw new Error(`No build recipe for ${app.id}`);
}

function exec(step: Step, logPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const log = createWriteStream(logPath, { flags: 'a' });
    log.write(`\n$ (cd ${step.cwd} && ${step.cmd} ${step.args.join(' ')})\n`);
    const child = spawn(step.cmd, step.args, { cwd: step.cwd, env: { ...process.env, ANDROID_HOME } });
    child.stdout.pipe(log, { end: false });
    child.stderr.pipe(log, { end: false });
    child.on('error', reject);
    child.on('close', (code) => {
      log.end();
      code === 0 ? resolve() : reject(new Error(`${step.cmd} exited ${code}; see ${logPath}`));
    });
  });
}

/** Build one app in release mode; returns the artifact path. */
export async function buildApp(app: AppDef, platform: Platform): Promise<string> {
  const outDir = join(BUILD_DIR, platform);
  const logDir = join(BUILD_DIR, 'logs');
  mkdirSync(outDir, { recursive: true });
  mkdirSync(logDir, { recursive: true });
  const apkOut = join(outDir, `${app.id}.apk`);
  const logPath = join(logDir, `${app.id}-${platform}.log`);
  const plan = steps(app, platform, apkOut);
  for (const step of plan.steps) await exec(step, logPath);
  if (plan.artifact) copyFileSync(plan.artifact, apkOut);
  if (!existsSync(apkOut)) throw new Error(`${app.id}: build finished but ${apkOut} is missing; see ${logPath}`);
  return apkOut;
}
