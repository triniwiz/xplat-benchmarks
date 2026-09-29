# ns-common

This folder holds the NativeScript glue shared by `ns-core`, `ns-core-mason` and `ns-angular-mason`. It covers:

- deep-link launch handling
- the frame and layout waits behind "painted"
- the clock
- device info
- the tree-building helper

`npm run bench -- sync` copies it into each NS app, next to `shared/` (which is the copy of `scenarios/src`). Edit the files here, never the copies.

`webpack-versions.cjs` is not copied. The apps' `webpack.config.js` requires it straight from this folder so it can bake the installed package versions into the bundle.
