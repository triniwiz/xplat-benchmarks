#!/usr/bin/env node
// Builds a signed release APK as `whisker build apk` does, minus its interactive credentials store:
// generate gen/android, then let Gradle and the Whisker plugin build the Rust library.
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GEN = join(APP, 'gen', 'android');
const PACKAGE = 'xplatbench-whisker';
const win = process.platform === 'win32';

const apkOut = process.argv[2];
if (!apkOut) fail('usage: node scripts/build-android.mjs <apkOut>');

function fail(message) {
  console.error(`build-android: ${message}`);
  process.exit(1);
}

function onPath(name) {
  const exts = win ? ['.exe', '.cmd', '.bat', ''] : [''];
  for (const dir of (process.env.PATH ?? '').split(win ? ';' : ':')) {
    for (const ext of exts) if (dir && existsSync(join(dir, name + ext))) return join(dir, name + ext);
  }
  return null;
}

function tool(name, hint) {
  const cargoBin = join(homedir(), '.cargo', 'bin', name + (win ? '.exe' : ''));
  const found = onPath(name) ?? (existsSync(cargoBin) ? cargoBin : null);
  if (!found) fail(`\`${name}\` not found on PATH or in ~/.cargo/bin (${hint})`);
  return found;
}

function run(cmd, args, opts = {}) {
  console.log(`$ ${cmd} ${args.join(' ')}`);
  const r = spawnSync(cmd, args, { stdio: 'inherit', ...opts, env: { ...process.env, ...opts.env } });
  if (r.error) fail(`${cmd}: ${r.error.message}`);
  if (r.status !== 0) fail(`${cmd} exited with ${r.status}`);
}

// On Windows, whisker-cng writes `\\?\` paths into settings.gradle.kts that Gradle cannot open, and
// whisker-build 0.18 looks up the NDK clang and llvm-ar without their `.cmd`/`.exe` suffixes, so the
// plugin's `whisker build-android` step fails.
function buildRustWithoutWhiskerOnWindows(whisker, cargo, sdk) {
  tool('cargo-ndk', 'cargo install cargo-ndk');
  const abi = 'arm64-v8a';
  const WHISKER_BUILD_NDKS = ['27.1.12297006', '27.0.12077973', '26.3.11579264', '26.1.10909125', '25.1.8937393', '23.1.7779620'];
  const ndkRoot = join(sdk, 'ndk');
  const ndkVersion = WHISKER_BUILD_NDKS.find((v) => existsSync(join(ndkRoot, v)));
  const ndk = process.env.ANDROID_NDK_HOME ?? (ndkVersion && join(ndkRoot, ndkVersion));
  if (!ndk || !existsSync(ndk)) fail(`no supported NDK in ${ndkRoot} (need one of ${WHISKER_BUILD_NDKS.join(', ')})`);

  const settings = join(GEN, 'settings.gradle.kts');
  writeFileSync(settings, readFileSync(settings, 'utf8').replace(/file\("\\+\?\\+([A-Za-z]:)/g, 'file("$1'));

  const minSdk = readFileSync(join(GEN, 'app', 'build.gradle.kts'), 'utf8').match(/\bminSdk = (\d+)/)?.[1];
  if (!minSdk) fail('no minSdk in gen/android/app/build.gradle.kts');
  const exports = join(APP, 'target', '.whisker', 'android-jni-exports.ver');
  mkdirSync(dirname(exports), { recursive: true });
  const WHISKER_BUILD_EXPORTED_SYMBOLS = ['create', 'tick', 'pause', 'resume', 'destroy', 'dispatch_event', 'dispatch_pointer', 'dispatch_module_event', 'dispatch_resource_event'];
  writeFileSync(exports, `{\n  global:\n    Java_*;\n    JNI_OnLoad;\n${WHISKER_BUILD_EXPORTED_SYMBOLS.map((s) => `    whisker_view_${s};\n`).join('')}};\n`);
  const WHISKER_BUILD_LINK_ARGS = [
    '-C', `link-arg=-Wl,--version-script=${exports.replaceAll('\\', '/')}`,
    '-C', 'link-arg=-Wl,-z,max-page-size=16384',
  ];
  const WHISKER_BUILD_RELEASE_PROFILE = {
    CARGO_PROFILE_RELEASE_LTO: 'fat',
    CARGO_PROFILE_RELEASE_CODEGEN_UNITS: '1',
    CARGO_PROFILE_RELEASE_OPT_LEVEL: 'z',
    CARGO_PROFILE_RELEASE_STRIP: 'symbols',
    CARGO_PROFILE_RELEASE_PANIC: 'abort',
  };
  run(
    cargo,
    ['ndk', '-t', abi, '-P', minSdk, 'rustc', '--release', '-p', PACKAGE, '--crate-type', 'cdylib', '--', ...WHISKER_BUILD_LINK_ARGS],
    { cwd: APP, env: { ANDROID_NDK_HOME: ndk, ...WHISKER_BUILD_RELEASE_PROFILE } },
  );
  const lib = `lib${PACKAGE.replaceAll('-', '_')}.so`;
  const jniLibs = join(GEN, 'app', 'src', 'main', 'jniLibs', abi);
  mkdirSync(jniLibs, { recursive: true });
  for (const stale of readdirSync(jniLibs)) if (stale !== lib) fail(`unexpected ${join(jniLibs, stale)}`);
  copyFileSync(join(APP, 'target', 'aarch64-linux-android', 'release', lib), join(jniLibs, lib));

  const shim = join(GEN, '.xplatbench', 'whisker.cmd');
  mkdirSync(dirname(shim), { recursive: true });
  writeFileSync(shim, `@echo off\r\nif "%1"=="build-android" exit /b 0\r\n"${whisker}" %*\r\n`);
  return shim;
}

const whisker = tool('whisker', 'cargo install whisker-cli --version 0.18.0');
const cargo = tool('cargo', 'install Rust from https://rustup.rs');
const sdk = process.env.ANDROID_HOME ?? process.env.ANDROID_SDK_ROOT;
if (!sdk || !existsSync(sdk)) fail('set ANDROID_HOME to the Android SDK');
const keystore = join(homedir(), '.android', 'debug.keystore');
if (!existsSync(keystore)) fail(`missing ${keystore}; build any Android app once in debug to create it`);

run(cargo, ['run', '--quiet', '--bin', 'whisker-config', '--features', 'whisker-config', '--', 'android'], { cwd: APP });

const env = {
  WHISKER_CLI: win ? buildRustWithoutWhiskerOnWindows(whisker, cargo, sdk) : whisker,
  ANDROID_HOME: sdk,
  WHISKER_ANDROID_KEYSTORE: keystore,
  WHISKER_ANDROID_KEYSTORE_PASSWORD: 'android',
  WHISKER_ANDROID_KEY_ALIAS: 'androiddebugkey',
  WHISKER_ANDROID_KEY_PASSWORD: 'android',
};
const gradleArgs = [':app:assembleRelease', '--no-daemon', '--console=plain', '-q'];
if (win) run('cmd.exe', ['/d', '/c', join(GEN, 'gradlew.bat'), ...gradleArgs], { cwd: GEN, env });
else run(join(GEN, 'gradlew'), gradleArgs, { cwd: GEN, env });

copyFileSync(join(GEN, 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk'), apkOut);
console.log(`build-android: ${apkOut}`);
