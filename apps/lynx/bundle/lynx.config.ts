import { readFileSync } from 'node:fs';
import { defineConfig } from '@lynx-js/rspeedy';
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin';

const version = (pkg: string) => JSON.parse(readFileSync(new URL(`./node_modules/${pkg}/package.json`, import.meta.url), 'utf8')).version;

export default defineConfig({
  plugins: [
    pluginReactLynx({
      defaultDisplayLinear: false,
    }),
  ],
  source: {
    define: {
      __BENCH_VERSIONS__: JSON.stringify({
        '@lynx-js/react': version('@lynx-js/react'),
        '@lynx-js/rspeedy': version('@lynx-js/rspeedy'),
      }),
    },
  },
});
