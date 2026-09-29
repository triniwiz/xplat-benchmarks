const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const PACKAGES = [
  '@nativescript/core',
  '@nativescript/ios',
  '@nativescript/android',
  '@nativescript/webpack',
  '@triniwiz/nativescript-masonkit',
  '@angular/core',
  '@nativescript/angular',
];

module.exports = function benchVersions(appDir) {
  const out = {};
  for (const name of PACKAGES) {
    try {
      out[name] = JSON.parse(readFileSync(join(appDir, 'node_modules', name, 'package.json'), 'utf8')).version;
    } catch {
    }
  }
  return out;
};

module.exports.benchDefines = function benchDefines(appDir) {
  return { __BENCH_VERSIONS__: JSON.stringify(module.exports(appDir)), __WINDOWS__: 'false' };
};
