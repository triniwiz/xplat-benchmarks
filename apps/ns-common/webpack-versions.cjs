// Reads installed versions of the packages that matter for a result, for
// DefinePlugin(__BENCH_VERSIONS__). Used from each NS app's webpack.config.js.
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
      // not a dependency of this app
    }
  }
  return out;
};

/**
 * Extra DefinePlugin values for every NS bench app: installed versions, plus
 * __WINDOWS__ (masonkit >= 1.0.0-beta.104 references it; @nativescript/webpack 5.0.x
 * does not define it).
 */
module.exports.benchDefines = function benchDefines(appDir) {
  return { __BENCH_VERSIONS__: JSON.stringify(module.exports(appDir)), __WINDOWS__: 'false' };
};
