# Results: 2026-09-29-sm-a536e-android-first

- Device: samsung SM-A536E (device), android 16
- Rounds: 1, warmup 2, iterations 10 per round
- Cells: median ms · p90 ms (n). Lower is better.
- `<series>` = until painted (layout + next frame); `<series>.layout` = until the tree was laid out.

## Versions

- **NativeScript Core**: @nativescript/core 9.1.3-next.2, @nativescript/ios 9.1.0, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38
- **NativeScript Core + Mason**: @nativescript/core 9.1.3-next.2, @nativescript/ios 9.1.0, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38, @triniwiz/nativescript-masonkit 1.0.0-beta.104
- **NativeScript Angular + Mason**: @nativescript/core 9.1.3-next.2, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38, @triniwiz/nativescript-masonkit 1.0.0-beta.104, @angular/core 22.0.8, @nativescript/angular 22.0.1
- **NativeScript Vue + Mason**: @nativescript/core 9.1.3-next.2, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38, @triniwiz/nativescript-masonkit 1.0.0-beta.104
- **NativeScript React + Mason**: @nativescript/core 9.1.3-next.2, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38, @triniwiz/nativescript-masonkit 1.0.0-beta.104
- **NativeScript Svelte + Mason**: @nativescript/core 9.1.3-next.2, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38, @triniwiz/nativescript-masonkit 1.0.0-beta.104
- **NativeScript Solid + Mason**: @nativescript/core 9.1.3-next.2, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38, @triniwiz/nativescript-masonkit 1.0.0-beta.104
- **React Native**: react-native 0.87.1, react 19.2.3, @shopify/flash-list 2.3.2
- **Lynx**: @lynx-js/react 0.126.2, @lynx-js/rspeedy 0.18.0, lynx-sdk 4.1.0

## Known deviations

- **NativeScript Core**: styled-cards v5: core does not clip children to border-radius (overflow: hidden unsupported).
- **NativeScript Core + Mason**: Mason-native frame: Mason root, status Text, Mason Scroll host and Mason Ul; the window root is a core GridLayout only to apply Android insets.
- **NativeScript Core + Mason**: list-scroll: Mason Ul with keyed templates needs apps/ns-common/patches (masonkit 1.0.0-beta.104 ignores itemTemplates; Android onCreate treats the view type as a data index).
- **NativeScript Core + Mason**: list-scroll: each Ul cell has an extra full-width Mason root (cells size to max-content and ignore root margins).
- **NativeScript Core + Mason**: list-scroll (iOS): the first screen of the Mason Ul fills only ~7 cells and leaves the rest blank (masonkit 1.0.0-beta.104).
- **NativeScript Core + Mason**: text-flow: no line clamp in Mason, so the 2-line clamp paragraphs render in full.
- **NativeScript Core + Mason**: styled-cards v4: stylesheet `transform` (rotate/scale) is not applied inside a Mason-native tree (it was when the host was a core ScrollView; masonkit 1.0.0-beta.104, Android).
- **NativeScript Angular + Mason**: Mason-native frame: Mason root, status Text, Mason Scroll host and Mason Ul; the window root is a core GridLayout only to apply Android insets.
- **NativeScript Angular + Mason**: list-scroll: Mason Ul with keyed templates needs apps/ns-common/patches (masonkit 1.0.0-beta.104 ignores itemTemplates; Android onCreate treats the view type as a data index).
- **NativeScript Angular + Mason**: list-scroll: each Ul cell has an extra full-width Mason root (cells size to max-content and ignore root margins).
- **NativeScript Angular + Mason**: list-scroll (iOS): the first screen of the Mason Ul fills only ~7 cells and leaves the rest blank (masonkit 1.0.0-beta.104).
- **NativeScript Angular + Mason**: text-flow: no line clamp in Mason, so the 2-line clamp paragraphs render in full.
- **NativeScript Angular + Mason**: styled-cards v4: stylesheet `transform` (rotate/scale) is not applied inside a Mason-native tree (it was when the host was a core ScrollView; masonkit 1.0.0-beta.104, Android).
- **NativeScript Vue + Mason**: Mason-native frame: Mason root, status Text, Mason Scroll host and Mason Ul; the window root is a core GridLayout only to apply Android insets.
- **NativeScript Vue + Mason**: list-scroll: Mason Ul with keyed templates needs apps/ns-common/patches (masonkit 1.0.0-beta.104 ignores itemTemplates; Android onCreate treats the view type as a data index).
- **NativeScript Vue + Mason**: list-scroll: each Ul cell has an extra full-width Mason root (cells size to max-content and ignore root margins).
- **NativeScript Vue + Mason**: list-scroll (iOS): the first screen of the Mason Ul fills only ~7 cells and leaves the rest blank (masonkit 1.0.0-beta.104).
- **NativeScript Vue + Mason**: text-flow: no line clamp in Mason, so the 2-line clamp paragraphs render in full.
- **NativeScript Vue + Mason**: styled-cards v4: stylesheet `transform` (rotate/scale) is not applied inside a Mason-native tree (it was when the host was a core ScrollView; masonkit 1.0.0-beta.104, Android).
- **NativeScript React + Mason**: Mason-native frame: Mason root, status Text, Mason Scroll host and Mason Ul; the window root is a core GridLayout only to apply Android insets.
- **NativeScript React + Mason**: list-scroll: Mason Ul with keyed templates needs apps/ns-common/patches (masonkit 1.0.0-beta.104 ignores itemTemplates; Android onCreate treats the view type as a data index).
- **NativeScript React + Mason**: list-scroll: each Ul cell has an extra full-width Mason root (cells size to max-content and ignore root margins).
- **NativeScript React + Mason**: list-scroll (iOS): the first screen of the Mason Ul fills only ~7 cells and leaves the rest blank (masonkit 1.0.0-beta.104).
- **NativeScript React + Mason**: text-flow: no line clamp in Mason, so the 2-line clamp paragraphs render in full.
- **NativeScript React + Mason**: styled-cards v4: stylesheet `transform` (rotate/scale) is not applied inside a Mason-native tree (it was when the host was a core ScrollView; masonkit 1.0.0-beta.104, Android).
- **NativeScript Svelte + Mason**: Mason-native frame: Mason root, status Text, Mason Scroll host and Mason Ul; the window root is a core GridLayout only to apply Android insets.
- **NativeScript Svelte + Mason**: list-scroll: Mason Ul with keyed templates needs apps/ns-common/patches (masonkit 1.0.0-beta.104 ignores itemTemplates; Android onCreate treats the view type as a data index).
- **NativeScript Svelte + Mason**: list-scroll: each Ul cell has an extra full-width Mason root (cells size to max-content and ignore root margins).
- **NativeScript Svelte + Mason**: list-scroll (iOS): the first screen of the Mason Ul fills only ~7 cells and leaves the rest blank (masonkit 1.0.0-beta.104).
- **NativeScript Svelte + Mason**: text-flow: no line clamp in Mason, so the 2-line clamp paragraphs render in full.
- **NativeScript Svelte + Mason**: styled-cards v4: stylesheet `transform` (rotate/scale) is not applied inside a Mason-native tree (it was when the host was a core ScrollView; masonkit 1.0.0-beta.104, Android).
- **NativeScript Solid + Mason**: Mason-native frame: Mason root, status Text, Mason Scroll host and Mason Ul; the window root is a core GridLayout only to apply Android insets.
- **NativeScript Solid + Mason**: list-scroll: Mason Ul with keyed templates needs apps/ns-common/patches (masonkit 1.0.0-beta.104 ignores itemTemplates; Android onCreate treats the view type as a data index).
- **NativeScript Solid + Mason**: list-scroll: each Ul cell has an extra full-width Mason root (cells size to max-content and ignore root margins).
- **NativeScript Solid + Mason**: list-scroll (iOS): the first screen of the Mason Ul fills only ~7 cells and leaves the rest blank (masonkit 1.0.0-beta.104).
- **NativeScript Solid + Mason**: text-flow: no line clamp in Mason, so the 2-line clamp paragraphs render in full.
- **NativeScript Solid + Mason**: styled-cards v4: stylesheet `transform` (rotate/scale) is not applied inside a Mason-native tree (it was when the host was a core ScrollView; masonkit 1.0.0-beta.104, Android).
- **React Native**: grid-dashboard: flex-emulated (React Native has no CSS grid).
- **React Native**: Text uses allowFontScaling={false} and textBreakStrategy="simple" to lay out like the other apps (dp text, greedy line breaking).
- **React Native**: list-scroll: FlashList v2; the mount mark is the list container layout, as for the other apps' lists.
- **Lynx**: Clock: Date.now() (1 ms resolution); Lynx's background thread has no performance.now().
- **Lynx**: Painted is observed on the background thread: layoutchange events cross from the main thread, as any Lynx app would see them.
- **Lynx**: grid-dashboard: grid placed by line numbers (Lynx has no grid-template-areas).
- **Lynx**: Host registers the Log and HTTP services only (no images in the scenarios); Lynx logs an image-prefetch error at load.

## Problems

- round 1 ns-angular-mason: timed out (26/27 cases)
- round 1 ns-core-mason: insert-remove/L: Error: timeout after 90000ms: insert-remove/L mount
- round 1 ns-core-mason grid-dashboard/M: Error: timeout after 90000ms: grid-dashboard/M mount
- round 1 ns-core-mason grid-dashboard/L: Error: timeout after 90000ms: grid-dashboard/L mount
- round 1 ns-core-mason text-flow/S: Error: timeout after 90000ms: text-flow/S mount
- round 1 ns-core-mason text-flow/M: Error: timeout after 90000ms: text-flow/M mount
- round 1 ns-core-mason text-flow/L: Error: timeout after 90000ms: text-flow/L mount
- round 1 ns-core-mason styled-cards/S: Error: timeout after 90000ms: styled-cards/S mount
- round 1 ns-core-mason styled-cards/M: Error: timeout after 90000ms: styled-cards/M mount
- round 1 ns-core-mason styled-cards/L: Error: timeout after 90000ms: styled-cards/L mount
- round 1 ns-core-mason relayout-resize/S: Error: timeout after 90000ms: relayout-resize/S mount
- round 1 ns-core-mason relayout-resize/M: Error: timeout after 90000ms: relayout-resize/M mount
- round 1 ns-core-mason relayout-resize/L: Error: timeout after 90000ms: relayout-resize/L mount
- round 1 ns-core-mason relayout-style/S: Error: timeout after 90000ms: relayout-style/S mount
- round 1 ns-core-mason relayout-style/M: Error: timeout after 90000ms: relayout-style/M mount
- round 1 ns-core-mason relayout-style/L: Error: timeout after 90000ms: relayout-style/L mount
- round 1 ns-core-mason insert-remove/S: Error: timeout after 90000ms: insert-remove/S mount
- round 1 ns-core-mason insert-remove/M: Error: timeout after 90000ms: insert-remove/M mount
- round 1 ns-core-mason insert-remove/L: Error: timeout after 90000ms: insert-remove/L mount
- round 1 ns-react-mason: timed out (26/27 cases)
- round 1 ns-solid-mason: insert-remove/L: Error: java.lang.OutOfMemoryError: Failed to allocate a 7416 byte allocation with 2432032 free bytes and 2375KB until OOM, target footprint 268435456, growth limit 268435456; giving up on allocation because <1% of heap free after GC.
- round 1 ns-solid-mason insert-remove/L: Error: java.lang.OutOfMemoryError: Failed to allocate a 7416 byte allocation with 2432032 free bytes and 2375KB until OOM, target footprint 268435456, growth limit 268435456; giving up on allocation because <1% of heap free after GC.
- round 1 ns-svelte-mason: timed out (26/27 cases)
- round 1 ns-vue-mason: timed out (26/27 cases)

## Nested chain (`nested-chain`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 26.5 · 30.4 (10) | 48.8 · 52.5 (10) | 78.6 · 91.5 (10) | 53.6 · 58.5 (10) | 51.0 · 55.6 (10) | 55.8 · 59.7 (10) | 51.6 · 58.5 (10) | 24.9 · 32.6 (10) | 17.0 · 20.3 (10) |
| M | 42.5 · 53.9 (10) | 74.0 · 81.5 (10) | 125 · 132 (10) | 129 · 138 (10) | 78.2 · 81.5 (10) | 123 · 130 (10) | 80.4 · 84.0 (10) | 33.2 · 35.2 (10) | 25.0 · 26.2 (10) |
| L | 97.7 · 100.0 (10) | 120 · 127 (10) | 207 · 218 (10) | 185 · 196 (10) | 120 · 131 (10) | 209 · 227 (10) | 129 · 135 (10) | 49.4 · 55.7 (10) | 33.0 · 68.5 (10) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 24.0 · 27.7 (10) | 44.0 · 47.4 (10) | 73.9 · 86.4 (10) | 48.8 · 53.5 (10) | 46.2 · 50.2 (10) | 51.1 · 55.0 (10) | 46.8 · 53.8 (10) | 21.6 · 23.3 (10) | 8.0 · 13.1 (10) |
| M | 38.9 · 48.5 (10) | 67.8 · 75.2 (10) | 119 · 126 (10) | 120 · 129 (10) | 71.6 · 75.7 (10) | 114 · 121 (10) | 74.5 · 77.5 (10) | 27.2 · 29.9 (10) | 17.0 · 22.1 (10) |
| L | 89.1 · 90.9 (10) | 111 · 119 (10) | 198 · 210 (10) | 171 · 184 (10) | 111 · 123 (10) | 197 · 215 (10) | 121 · 127 (10) | 18.8 · 47.8 (10) | 28.0 · 62.8 (10) |

## Tree fan-out (`tree-fanout`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 215 · 221 (10) | 217 · 227 (10) | 457 · 484 (10) | 363 · 379 (10) | 228 · 237 (10) | 436 · 451 (10) | 231 · 238 (10) | 85.6 · 96.7 (10) | 57.5 · 77.2 (10) |
| M | 556 · 573 (10) | 636 · 651 (10) | 1238 · 1279 (10) | 1026 · 1060 (10) | 661 · 671 (10) | 1237 · 1268 (10) | 656 · 683 (10) | 248 · 257 (10) | 121 · 253 (10) |
| L | 1687 · 1758 (10) | 1749 · 1844 (10) | 3433 · 3489 (10) | 2848 · 2939 (10) | 1784 · 1848 (10) | 3292 · 3463 (10) | 1851 · 1922 (10) | 954 · 992 (10) | 404 · 517 (10) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 202 · 214 (10) | 200 · 212 (10) | 444 · 467 (10) | 337 · 357 (10) | 209 · 222 (10) | 410 · 430 (10) | 215 · 222 (10) | 69.5 · 83.8 (10) | 52.5 · 70.1 (10) |
| M | 519 · 542 (10) | 594 · 616 (10) | 1190 · 1236 (10) | 953 · 997 (10) | 614 · 630 (10) | 1176 · 1201 (10) | 621 · 642 (10) | 93.6 · 97.8 (10) | 116 · 246 (10) |
| L | 1573 · 1629 (10) | 1633 · 1720 (10) | 3309 · 3379 (10) | 2659 · 2766 (10) | 1673 · 1724 (10) | 3105 · 3280 (10) | 1728 · 1805 (10) | 289 · 293 (10) | 400 · 514 (10) |

## Flex-wrap tiles (`flex-wrap-tiles`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 707 · 726 (10) | 678 · 745 (10) | 892 · 941 (10) | 1020 · 1098 (10) | 811 · 881 (10) | 1191 · 1233 (10) | 825 · 885 (10) | 395 · 433 (10) | 91.0 · 138 (10) |
| M | 2773 · 2854 (10) | 3130 · 4522 (10) | 3643 · 3685 (10) | 4413 · 4823 (10) | 3240 · 3301 (10) | 4861 · 4889 (10) | 3299 · 3326 (10) | 2036 · 2146 (10) | 571 · 746 (10) |
| L | 5826 · 6626 (10) | 10659 · 12312 (10) | 10679 · 11962 (10) | 13154 · 13792 (10) | 8838 · 8970 (10) | 14086 · 14186 (10) | 11558 · 12344 (10) | 6868 · 6962 (10) | 1452 · 1559 (10) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 675 · 700 (10) | 639 · 710 (10) | 843 · 898 (10) | 952 · 1039 (10) | 758 · 840 (10) | 1106 · 1174 (10) | 770 · 845 (10) | 95.8 · 363 (10) | 86.5 · 130 (10) |
| M | 2636 · 2712 (10) | 2962 · 4384 (10) | 3484 · 3500 (10) | 4185 · 4591 (10) | 3084 · 3122 (10) | 4630 · 4664 (10) | 3139 · 3157 (10) | 699 · 714 (10) | 566 · 736 (10) |
| L | 5542 · 6303 (10) | 10107 · 11720 (10) | 10187 · 11488 (10) | 12546 · 13131 (10) | 8404 · 8551 (10) | 13450 · 13620 (10) | 10914 · 11768 (10) | 1752 · 1795 (10) | 1448 · 1550 (10) |

## Grid dashboard (`grid-dashboard`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 164 · 167 (10) | 339 · 465 (10) | 383 · 545 (10) | 329 · 491 (10) | 246 · 363 (10) | 362 · 418 (10) | 368 · 399 (10) | 111 · 123 (10) | 49.5 · 112 (10) |
| M | 530 · 554 (10) | – | 1432 · 1566 (10) | 1194 · 1295 (10) | 968 · 1077 (10) | 1344 · 1441 (10) | 1271 · 1437 (10) | 384 · 408 (10) | 179 · 275 (10) |
| L | 1421 · 1444 (10) | – | 3911 · 4018 (10) | 3189 · 3379 (10) | 2938 · 3178 (10) | 3518 · 3700 (10) | 3573 · 3799 (10) | 1160 · 1237 (10) | 509 · 709 (10) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 156 · 160 (10) | 326 · 451 (10) | 367 · 528 (10) | 302 · 472 (10) | 234 · 352 (10) | 344 · 399 (10) | 350 · 380 (10) | 94.9 · 107 (10) | 41.5 · 103 (10) |
| M | 510 · 536 (10) | – | 1369 · 1517 (10) | 1148 · 1242 (10) | 934 · 1040 (10) | 1297 · 1394 (10) | 1191 · 1392 (10) | 136 · 338 (10) | 173 · 269 (10) |
| L | 1363 · 1375 (10) | – | 3761 · 3878 (10) | 3043 · 3233 (10) | 2823 · 3038 (10) | 3374 · 3571 (10) | 3414 · 3651 (10) | 349 · 354 (10) | 507 · 706 (10) |

## Text flow (`text-flow`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 48.0 · 48.7 (10) | – | 132 · 265 (10) | 101 · 130 (10) | 105 · 108 (10) | 121 · 138 (10) | 115 · 126 (10) | 66.0 · 69.8 (10) | 33.0 · 37.2 (10) |
| M | 178 · 186 (10) | – | 494 · 624 (10) | 391 · 525 (10) | 390 · 532 (10) | 446 · 583 (10) | 425 · 587 (10) | 229 · 246 (10) | 66.0 · 82.1 (10) |
| L | 510 · 519 (10) | – | 1659 · 1725 (10) | 1411 · 1437 (10) | 1267 · 1283 (10) | 1656 · 1700 (10) | 1352 · 1379 (10) | 554 · 642 (10) | 257 · 474 (10) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 39.9 · 40.4 (10) | – | 104 · 230 (10) | 73.6 · 99.7 (10) | 79.6 · 81.0 (10) | 92.7 · 102 (10) | 87.7 · 96.4 (10) | 50.8 · 52.0 (10) | 29.0 · 33.7 (10) |
| M | 145 · 154 (10) | – | 379 · 515 (10) | 276 · 413 (10) | 277 · 430 (10) | 336 · 472 (10) | 308 · 480 (10) | 170 · 185 (10) | 63.0 · 74.3 (10) |
| L | 419 · 427 (10) | – | 1192 · 1245 (10) | 918 · 947 (10) | 842 · 855 (10) | 1181 · 1281 (10) | 950 · 973 (10) | 94.8 · 134 (10) | 247 · 473 (10) |

## Styled cards (`styled-cards`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 154 · 165 (10) | – | 458 · 663 (10) | 372 · 524 (10) | 499 · 625 (10) | 429 · 620 (10) | 435 · 539 (10) | 144 · 154 (10) | 42.5 · 56.6 (10) |
| M | 593 · 599 (10) | – | 2044 · 2147 (10) | 1658 · 1877 (10) | 1570 · 1908 (10) | 1868 · 2105 (10) | 1901 · 1974 (10) | 441 · 498 (10) | 117 · 403 (10) |
| L | 1925 · 1960 (10) | – | 6740 · 6908 (10) | 5533 · 6217 (10) | 5939 · 5959 (10) | 6197 · 6906 (10) | 6128 · 6205 (10) | 1681 · 1715 (10) | 699 · 793 (10) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 145 · 156 (10) | – | 428 · 623 (10) | 339 · 497 (10) | 455 · 585 (10) | 396 · 592 (10) | 400 · 506 (10) | 127 · 135 (10) | 40.0 · 49.1 (10) |
| M | 563 · 568 (10) | – | 1925 · 2021 (10) | 1536 · 1661 (10) | 1440 · 1800 (10) | 1729 · 1950 (10) | 1773 · 1848 (10) | 138 · 172 (10) | 113 · 397 (10) |
| L | 1789 · 1828 (10) | – | 6136 · 6307 (10) | 4976 · 5673 (10) | 5528 · 5551 (10) | 5652 · 6262 (10) | 5689 · 5771 (10) | 457 · 472 (10) | 694 · 787 (10) |

## Relayout: root resize (`relayout-resize`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 127 · 133 (10) | – | 654 · 813 (10) | 312 · 508 (10) | 291 · 348 (10) | 459 · 668 (10) | 301 · 366 (10) | 73.4 · 85.8 (10) | 51.0 · 63.9 (10) |
| M | 352 · 360 (10) | – | 1694 · 1923 (10) | 1159 · 1197 (10) | 989 · 1155 (10) | 1228 · 1357 (10) | 965 · 1158 (10) | 223 · 225 (10) | 99.5 · 422 (10) |
| L | 1198 · 1239 (10) | – | 4993 · 5098 (10) | 3113 · 3328 (10) | 3023 · 3506 (10) | 3639 · 3702 (10) | 3034 · 3317 (10) | 927 · 992 (10) | 263 · 609 (10) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 119 · 123 (10) | – | 635 · 793 (10) | 292 · 488 (10) | 270 · 326 (10) | 438 · 647 (10) | 284 · 344 (10) | 60.1 · 67.4 (10) | 47.0 · 55.1 (10) |
| M | 331 · 345 (10) | – | 1633 · 1876 (10) | 1110 · 1125 (10) | 927 · 1111 (10) | 1163 · 1302 (10) | 911 · 1114 (10) | 96.3 · 169 (10) | 93.5 · 416 (10) |
| L | 1117 · 1152 (10) | – | 4824 · 4964 (10) | 2968 · 3181 (10) | 2836 · 3354 (10) | 3501 · 3561 (10) | 2909 · 3162 (10) | 294 · 298 (10) | 259 · 602 (10) |

**shrink**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 14.3 · 18.4 (10) | – | 21.0 · 23.9 (10) | 21.7 · 24.5 (10) | 22.8 · 26.5 (10) | 20.3 · 22.9 (10) | 18.8 · 33.4 (10) | 27.7 · 30.1 (10) | 26.0 · 26.1 (10) |
| M | 31.4 · 36.0 (10) | – | 43.6 · 50.8 (10) | 41.2 · 52.4 (10) | 42.6 · 54.1 (10) | 40.9 · 62.1 (10) | 37.6 · 39.6 (10) | 27.5 · 90.9 (10) | 42.0 · 44.5 (10) |
| L | 75.6 · 80.5 (10) | – | 108 · 115 (10) | 96.7 · 123 (10) | 111 · 135 (10) | 101 · 115 (10) | 97.5 · 135 (10) | 64.8 · 490 (10) | 109 · 137 (10) |

**shrink.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 5.7 · 9.2 (10) | – | 12.2 · 15.0 (10) | 11.1 · 12.8 (10) | 12.5 · 15.8 (10) | 10.3 · 13.7 (10) | 10.1 · 24.9 (10) | 9.9 · 10.6 (10) | 20.0 · 22.0 (10) |
| M | 7.7 · 14.5 (10) | – | 20.3 · 24.4 (10) | 16.5 · 20.8 (10) | 18.7 · 23.4 (10) | 18.4 · 30.9 (10) | 16.3 · 17.9 (10) | 18.6 · 20.0 (10) | 37.0 · 40.0 (10) |
| L | 29.1 · 34.3 (10) | – | 46.7 · 49.5 (10) | 37.1 · 51.0 (10) | 44.7 · 67.4 (10) | 33.2 · 38.5 (10) | 36.1 · 58.2 (10) | 54.8 · 56.1 (10) | 105 · 134 (10) |

**grow**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 7.3 · 8.3 (10) | – | 16.5 · 19.4 (10) | 12.6 · 15.7 (10) | 14.8 · 17.9 (10) | 13.9 · 17.8 (10) | 13.6 · 17.1 (10) | 24.2 · 25.5 (10) | 26.0 · 26.0 (10) |
| M | 20.7 · 29.6 (10) | – | 33.4 · 35.4 (10) | 27.2 · 30.7 (10) | 30.7 · 39.6 (10) | 21.8 · 28.9 (10) | 23.5 · 29.3 (10) | 66.1 · 99.8 (10) | 44.5 · 58.0 (10) |
| L | 54.6 · 58.6 (10) | – | 84.0 · 93.9 (10) | 69.7 · 80.9 (10) | 82.8 · 91.9 (10) | 70.6 · 93.7 (10) | 67.8 · 83.4 (10) | 76.9 · 448 (10) | 117 · 134 (10) |

**grow.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 1.2 · 2.2 (10) | – | 10.7 · 14.3 (10) | 4.3 · 9.0 (10) | 7.8 · 12.2 (10) | 4.9 · 10.6 (10) | 5.0 · 11.1 (10) | 9.3 · 9.6 (10) | 18.0 · 19.4 (10) |
| M | 4.4 · 10.7 (10) | – | 19.4 · 21.9 (10) | 13.1 · 16.1 (10) | 18.1 · 19.9 (10) | 9.8 · 15.6 (10) | 10.2 · 14.9 (10) | 31.0 · 39.8 (10) | 36.0 · 47.6 (10) |
| L | 12.7 · 15.4 (10) | – | 48.5 · 51.6 (10) | 29.6 · 33.5 (10) | 41.7 · 49.4 (10) | 29.3 · 55.2 (10) | 30.0 · 34.7 (10) | 66.0 · 69.9 (10) | 112 · 126 (10) |

## Relayout: restyle every node (`relayout-style`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 142 · 147 (10) | – | 534 · 797 (10) | 321 · 381 (10) | 307 · 384 (10) | 401 · 619 (10) | 297 · 467 (10) | 75.5 · 83.1 (10) | 50.5 · 52.6 (10) |
| M | 400 · 406 (10) | – | 1791 · 1859 (10) | 1210 · 1335 (10) | 1161 · 1393 (10) | 1105 · 1131 (10) | 1004 · 1177 (10) | 217 · 223 (10) | 99.0 · 146 (10) |
| L | 1419 · 1442 (10) | – | 5073 · 5422 (10) | 3123 · 3340 (10) | 3042 · 3529 (10) | 3718 · 3916 (10) | 3056 · 3301 (10) | 972 · 1078 (10) | 272 · 561 (10) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 135 · 139 (10) | – | 516 · 782 (10) | 302 · 363 (10) | 287 · 366 (10) | 382 · 596 (10) | 280 · 446 (10) | 59.7 · 68.9 (10) | 44.5 · 47.2 (10) |
| M | 374 · 386 (10) | – | 1738 · 1802 (10) | 1162 · 1282 (10) | 1118 · 1345 (10) | 1048 · 1074 (10) | 952 · 1125 (10) | 95.9 · 168 (10) | 96.0 · 139 (10) |
| L | 1324 · 1348 (10) | – | 4885 · 5257 (10) | 2956 · 3213 (10) | 2917 · 3387 (10) | 3589 · 3766 (10) | 2927 · 3152 (10) | 292 · 313 (10) | 265 · 559 (10) |

**restyle**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 26.2 · 31.7 (10) | – | 75.2 · 82.5 (10) | 91.0 · 120 (10) | 83.5 · 116 (10) | 85.4 · 106 (10) | 87.9 · 113 (10) | 44.4 · 47.5 (10) | 26.0 · 28.7 (10) |
| M | 71.1 · 73.0 (10) | – | 227 · 235 (10) | 211 · 222 (10) | 215 · 287 (10) | 248 · 250 (10) | 217 · 268 (10) | 73.7 · 83.1 (10) | 51.0 · 73.1 (10) |
| L | 199 · 209 (10) | – | 713 · 746 (10) | 713 · 889 (10) | 716 · 746 (10) | 685 · 734 (10) | 698 · 878 (10) | 221 · 635 (10) | 134 · 154 (10) |

**restyle.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 15.8 · 17.2 (10) | – | 68.2 · 72.6 (10) | 82.4 · 109 (10) | 75.7 · 106 (10) | 77.6 · 97.0 (10) | 81.0 · 102 (10) | 28.1 · 28.6 (10) | 22.5 · 24.3 (10) |
| M | 44.4 · 53.1 (10) | – | 203 · 210 (10) | 195 · 204 (10) | 195 · 264 (10) | 225 · 228 (10) | 199 · 247 (10) | 62.5 · 64.6 (10) | 43.0 · 63.1 (10) |
| L | 174 · 182 (10) | – | 657 · 678 (10) | 646 · 828 (10) | 662 · 688 (10) | 633 · 655 (10) | 644 · 817 (10) | 179 · 190 (10) | 126 · 148 (10) |

**restore**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 21.0 · 21.7 (10) | – | 73.9 · 78.4 (10) | 79.8 · 84.8 (10) | 82.5 · 108 (10) | 76.9 · 83.2 (10) | 76.1 · 99.4 (10) | 42.3 · 44.9 (10) | 25.0 · 33.0 (10) |
| M | 57.5 · 58.3 (10) | – | 224 · 232 (10) | 201 · 216 (10) | 222 · 252 (10) | 231 · 237 (10) | 204 · 250 (10) | 85.7 · 131 (10) | 50.5 · 58.3 (10) |
| L | 182 · 188 (10) | – | 830 · 908 (10) | 684 · 862 (10) | 858 · 920 (10) | 782 · 864 (10) | 696 · 892 (10) | 227 · 618 (10) | 135 · 158 (10) |

**restore.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 14.8 · 15.1 (10) | – | 69.3 · 73.0 (10) | 75.6 · 77.9 (10) | 78.1 · 98.6 (10) | 71.4 · 76.6 (10) | 70.6 · 94.4 (10) | 27.4 · 29.0 (10) | 22.0 · 25.0 (10) |
| M | 41.0 · 42.1 (10) | – | 208 · 216 (10) | 189 · 206 (10) | 211 · 240 (10) | 215 · 218 (10) | 192 · 227 (10) | 71.5 · 79.2 (10) | 43.5 · 56.3 (10) |
| L | 139 · 141 (10) | – | 792 · 866 (10) | 649 · 830 (10) | 824 · 874 (10) | 754 · 828 (10) | 646 · 854 (10) | 202 · 219 (10) | 132 · 149 (10) |

## Insert / remove at head (`insert-remove`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 606 · 633 (10) | – | 1291 · 1480 (10) | 1059 · 1207 (10) | 1157 · 1430 (10) | 1216 · 1466 (10) | 1202 · 1451 (10) | 353 · 381 (10) | 104 · 115 (10) |
| M | 2721 · 2836 (10) | – | 7762 · 20296 (10) | 4957 · 7061 (10) | 5280 · 5607 (10) | 5608 · 9430 (10) | 5604 · 7153 (10) | 1911 · 1967 (10) | 460 · 753 (10) |
| L | 7121 · 7258 (10) | – | – | – | – | – | – | 6747 · 6986 (10) | 1466 · 1504 (10) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 582 · 606 (10) | – | 1221 · 1424 (10) | 1007 · 1164 (10) | 1095 · 1384 (10) | 1157 · 1410 (10) | 1126 · 1395 (10) | 101 · 328 (10) | 98.5 · 111 (10) |
| M | 2583 · 2701 (10) | – | 6761 · 20066 (10) | 4721 · 5891 (10) | 5021 · 5381 (10) | 5369 · 7977 (10) | 5378 · 6934 (10) | 694 · 711 (10) | 455 · 738 (10) |
| L | 6764 · 6901 (10) | – | – | – | – | – | – | 1751 · 1876 (10) | 1459 · 1494 (10) |

**insert**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 311 · 338 (10) | – | 489 · 732 (10) | 487 · 722 (10) | 567 · 781 (10) | 468 · 559 (10) | 540 · 774 (10) | 316 · 325 (10) | 58.5 · 92.0 (10) |
| M | 375 · 387 (10) | – | 3704 · 6858 (10) | 650 · 1501 (10) | 709 · 913 (10) | 714 · 2920 (10) | 752 · 3379 (10) | 597 · 1252 (10) | 117 · 214 (10) |
| L | 437 · 507 (10) | – | – | – | – | – | – | 2931 · 4651 (10) | 284 · 316 (10) |

**insert.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 294 · 314 (10) | – | 457 · 696 (10) | 457 · 692 (10) | 536 · 760 (10) | 440 · 529 (10) | 514 · 745 (10) | 88.8 · 240 (10) | 54.0 · 88.6 (10) |
| M | 340 · 352 (10) | – | 3669 · 6825 (10) | 604 · 1454 (10) | 670 · 871 (10) | 677 · 2866 (10) | 706 · 3341 (10) | 251 · 261 (10) | 113 · 211 (10) |
| L | 372 · 440 (10) | – | – | – | – | – | – | 519 · 548 (10) | 279 · 308 (10) |

**remove**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 20.9 · 21.3 (10) | – | 26.4 · 52.3 (10) | 24.4 · 47.3 (10) | 24.0 · 33.5 (10) | 24.1 · 41.2 (10) | 24.9 · 36.2 (10) | 129 · 167 (10) | 30.0 · 34.0 (10) |
| M | 37.5 · 39.1 (10) | – | 56.4 · 133 (10) | 69.9 · 261 (10) | 60.7 · 90.9 (10) | 57.9 · 91.9 (10) | 55.3 · 68.9 (10) | 403 · 893 (10) | 125 · 260 (10) |
| L | 90.3 · 118 (10) | – | – | – | – | – | – | 3858 · 4057 (10) | 509 · 544 (10) |

**remove.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 15.8 · 16.4 (10) | – | 20.7 · 43.2 (10) | 19.5 · 38.4 (10) | 19.6 · 22.4 (10) | 19.1 · 30.2 (10) | 20.5 · 27.3 (10) | 49.0 · 55.2 (10) | 24.0 · 27.1 (10) |
| M | 20.9 · 21.6 (10) | – | 36.4 · 107 (10) | 51.5 · 246 (10) | 41.7 · 70.8 (10) | 43.2 · 73.1 (10) | 36.9 · 48.2 (10) | 162 · 165 (10) | 122 · 257 (10) |
| L | 30.0 · 35.7 (10) | – | – | – | – | – | – | 422 · 429 (10) | 505 · 537 (10) |
