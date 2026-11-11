import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { delimiter, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const hostApp = join(appDir, 'hosts', 'android', 'app');
const exe = process.platform === 'win32' ? 'nsh.exe' : 'nsh';

function nshHome() {
  if (process.env.NSH_HOME) return process.env.NSH_HOME;
  for (const dir of (process.env.PATH ?? '').split(delimiter)) {
    const candidate = dir && join(dir, exe);
    if (candidate && existsSync(candidate)) return dirname(dirname(realpathSync(candidate)));
  }
  throw new Error(`prepare-android: no ${exe} on PATH; install nsh (https://nsh.dev) or set NSH_HOME to its install directory`);
}

const home = nshHome();
const nsh = join(home, 'bin', exe);
const aar = join(home, 'embed', 'android', 'nsh.aar');
for (const file of [nsh, aar]) {
  if (!existsSync(file)) throw new Error(`prepare-android: ${file} is missing in the nsh install at ${home}`);
}

mkdirSync(join(hostApp, 'libs'), { recursive: true });
copyFileSync(aar, join(hostApp, 'libs', 'nsh.aar'));

const assets = join(hostApp, 'src', 'main', 'assets', 'nsh');
rmSync(assets, { recursive: true, force: true });
execFileSync(nsh, ['build', 'App.tsx', '--release', '--out', assets], { cwd: appDir, stdio: 'inherit' });

const version = execFileSync(nsh, ['--version'], { encoding: 'utf8' }).trim().replace(/^nsh /, '');
writeFileSync(join(hostApp, 'src', 'main', 'assets', 'nsh-version.txt'), version);
