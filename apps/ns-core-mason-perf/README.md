# ns-core-mason-perf (dev only)

This is `ns-core-mason` built against a **local** nativescript-mason build, so Mason changes can be measured side by side with the published package on the same device. Its app id is `org.xplatbench.nscoremasonperf`. It isn't one of the benchmark stacks.

To rebuild the vendored package from a nativescript-mason checkout (the `perf/xplat-benchmarks` branch lives in the `../nativescript-mason-perf` worktree):

```bash
cd ../nativescript-mason-perf/packages/nativescript-masonkit/src-native/mason-android
./gradlew :masonkit:assembleRelease -Prust.targets=arm64 --no-daemon
cd ../../../..
npx nx run nativescript-masonkit:build --skip-nx-cache
cp packages/nativescript-masonkit/src-native/mason-android/masonkit/build/outputs/aar/masonkit-release.aar \
   dist/packages/nativescript-masonkit/platforms/android/
(cd dist/packages/nativescript-masonkit && npm pack --pack-destination /tmp)
```

Then copy the tarball to `vendor/masonkit-perf-<commit>.tgz`, point the dependency at it, and `npm install`. Name the tarball after the commit: npm caches `file:` tarballs by integrity. `vendor/` is git-ignored.
