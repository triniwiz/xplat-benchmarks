# Results: 2026-09-29-sm-a536e-beta105

- Device: samsung SM-A536E (device), android 16
- Rounds: 1, warmup 2, iterations 10 per round
- Cells: median ms · p90 ms (n). Lower is better.
- `<series>` = until painted (layout + next frame); `<series>.layout` = until the tree was laid out.

## Versions

- **NativeScript Core**: @nativescript/core 9.1.3-next.2, @nativescript/ios 9.1.0, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38
- **NativeScript Core + Mason**: @nativescript/core 9.1.3-next.2, @nativescript/ios 9.1.0, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38, @triniwiz/nativescript-masonkit 1.0.0-beta.105
- **NativeScript Angular + Mason**: @nativescript/core 9.1.3-next.2, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38, @triniwiz/nativescript-masonkit 1.0.0-beta.105, @angular/core 22.0.8, @nativescript/angular 22.0.1
- **NativeScript Vue + Mason**: @nativescript/core 9.1.3-next.2, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38, @triniwiz/nativescript-masonkit 1.0.0-beta.105
- **NativeScript React + Mason**: @nativescript/core 9.1.3-next.2, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38, @triniwiz/nativescript-masonkit 1.0.0-beta.105
- **NativeScript Svelte + Mason**: @nativescript/core 9.1.3-next.2, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38, @triniwiz/nativescript-masonkit 1.0.0-beta.105
- **NativeScript Solid + Mason**: @nativescript/core 9.1.3-next.2, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38, @triniwiz/nativescript-masonkit 1.0.0-beta.105
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

## Memory after run (MB, highest round)

| app | Java heap | native heap | graphics | total PSS |
|---|---:|---:|---:|---:|
| NativeScript Core | 48 | 165 | 19 | 352 |
| NativeScript Core + Mason | 10 | 137 | 19 | 308 |
| NativeScript Angular + Mason | 145 | 278 | 19 | 650 |
| NativeScript Vue + Mason | 90 | 217 | 19 | 486 |
| NativeScript React + Mason | 92 | 202 | 19 | 517 |
| NativeScript Svelte + Mason | 85 | 219 | 19 | 496 |
| NativeScript Solid + Mason | 92 | 235 | 19 | 522 |
| React Native | 54 | 283 | 19 | 410 |
| Lynx | 39 | 242 | 19 | 671 |

## Nested chain (`nested-chain`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 29.4 · 33.6 (10) | 35.6 · 42.9 (10) | 64.5 · 68.0 (10) | 37.3 · 45.2 (10) | 37.4 · 39.7 (10) | 41.3 · 45.6 (10) | 38.8 · 43.5 (10) | 28.9 · 33.2 (10) | 21.0 · 25.0 (10) |
| M | 46.8 · 59.7 (10) | 70.7 · 89.2 (10) | 137 · 144 (10) | 73.3 · 91.1 (10) | 72.0 · 85.6 (10) | 85.8 · 96.7 (10) | 80.5 · 91.2 (10) | 33.2 · 35.1 (10) | 25.5 · 30.3 (10) |
| L | 136 · 168 (10) | 73.3 · 80.0 (10) | 217 · 233 (10) | 119 · 123 (10) | 118 · 121 (10) | 134 · 142 (10) | 135 · 139 (10) | 57.0 · 58.5 (10) | 37.5 · 79.9 (10) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 25.1 · 29.0 (10) | 28.1 · 31.8 (10) | – | – | – | – | – | – | – |
| M | 40.5 · 51.1 (10) | 58.3 · 75.0 (10) | – | – | – | – | – | – | – |
| L | 121 · 149 (10) | 58.1 · 64.5 (10) | – | – | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 1.2 · 1.6 (10) | 1.7 · 2.4 (10) | – | – | – | – | – | – | – |
| M | 1.7 · 2.0 (10) | 2.2 · 2.5 (10) | – | – | – | – | – | – | – |
| L | 2.7 · 2.8 (10) | 3.2 · 3.7 (10) | – | – | – | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 26.8 · 30.9 (10) | 31.8 · 36.3 (10) | 60.4 · 64.0 (10) | 33.5 · 41.2 (10) | 33.3 · 35.0 (10) | 37.5 · 41.3 (10) | 34.9 · 39.2 (10) | 22.4 · 24.1 (10) | 13.5 · 16.1 (10) |
| M | 42.8 · 53.9 (10) | 65.0 · 81.8 (10) | 129 · 136 (10) | 65.9 · 84.2 (10) | 64.3 · 78.4 (10) | 78.6 · 89.8 (10) | 72.5 · 84.1 (10) | 28.0 · 29.9 (10) | 20.5 · 23.5 (10) |
| L | 126 · 154 (10) | 65.1 · 71.7 (10) | 206 · 221 (10) | 107 · 111 (10) | 107 · 109 (10) | 123 · 131 (10) | 124 · 127 (10) | 47.7 · 50.0 (10) | 31.0 · 77.4 (10) |

## Tree fan-out (`tree-fanout`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 219 · 273 (10) | 146 · 158 (10) | 514 · 555 (10) | 255 · 277 (10) | 242 · 262 (10) | 333 · 357 (10) | 242 · 265 (10) | 92.6 · 101 (10) | 66.0 · 92.1 (10) |
| M | 571 · 631 (10) | 409 · 458 (10) | 1387 · 1685 (10) | 733 · 774 (10) | 716 · 750 (10) | 914 · 1001 (10) | 739 · 770 (10) | 259 · 272 (10) | 175 · 399 (10) |
| L | 1679 · 1728 (10) | 1097 · 1184 (10) | 3711 · 3843 (10) | 1969 · 2015 (10) | 1926 · 1976 (10) | 2399 · 2524 (10) | 2007 · 2078 (10) | 792 · 1062 (10) | 609 · 832 (10) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 200 · 247 (10) | 125 · 137 (10) | – | – | – | – | – | – | – |
| M | 504 · 555 (10) | 339 · 385 (10) | – | – | – | – | – | – | – |
| L | 1467 · 1513 (10) | 952 · 1027 (10) | – | – | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 7.2 · 10.6 (10) | 7.7 · 8.0 (10) | – | – | – | – | – | – | – |
| M | 15.6 · 16.8 (10) | 19.0 · 21.8 (10) | – | – | – | – | – | – | – |
| L | 36.7 · 40.0 (10) | 39.6 · 42.4 (10) | – | – | – | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 212 · 259 (10) | 136 · 148 (10) | 498 · 537 (10) | 239 · 262 (10) | 225 · 247 (10) | 315 · 341 (10) | 226 · 250 (10) | 77.7 · 80.2 (10) | 60.0 · 85.2 (10) |
| M | 541 · 591 (10) | 379 · 425 (10) | 1342 · 1641 (10) | 686 · 719 (10) | 673 · 705 (10) | 864 · 949 (10) | 696 · 727 (10) | 116 · 201 (10) | 166 · 393 (10) |
| L | 1557 · 1604 (10) | 1045 · 1116 (10) | 3609 · 3688 (10) | 1865 · 1910 (10) | 1811 · 1845 (10) | 2312 · 2407 (10) | 1893 · 1965 (10) | 298 · 305 (10) | 604 · 827 (10) |

## Flex-wrap tiles (`flex-wrap-tiles`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 704 · 714 (10) | 465 · 490 (10) | 900 · 933 (10) | 704 · 734 (10) | 898 · 963 (10) | 869 · 922 (10) | 903 · 963 (10) | 440 · 449 (10) | 142 · 265 (10) |
| M | 2815 · 3157 (10) | 1792 · 1845 (10) | 3435 · 3528 (10) | 2740 · 3630 (10) | 3531 · 3606 (10) | 3254 · 3631 (10) | 3587 · 3798 (10) | 2228 · 2313 (10) | 934 · 1230 (10) |
| L | 7286 · 7370 (10) | 4657 · 5290 (10) | 8673 · 8990 (10) | 6928 · 7084 (10) | 8934 · 9067 (10) | 8121 · 8374 (10) | 8071 · 8270 (10) | 7272 · 7410 (10) | 2401 · 2515 (10) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 620 · 634 (10) | 345 · 364 (10) | – | – | – | – | – | – | – |
| M | 2463 · 2788 (10) | 1347 · 1360 (10) | – | – | – | – | – | – | – |
| L | 6405 · 6456 (10) | 3405 · 4049 (10) | – | – | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 8.2 · 10.7 (10) | 9.0 · 9.4 (10) | – | – | – | – | – | – | – |
| M | 27.8 · 28.7 (10) | 38.2 · 39.2 (10) | – | – | – | – | – | – | – |
| L | 75.3 · 75.9 (10) | 114 · 120 (10) | – | – | – | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 674 · 686 (10) | 431 · 456 (10) | 841 · 880 (10) | 645 · 675 (10) | 840 · 907 (10) | 818 · 860 (10) | 839 · 904 (10) | 369 · 388 (10) | 137 · 260 (10) |
| M | 2673 · 3004 (10) | 1671 · 1687 (10) | 3223 · 3264 (10) | 2530 · 3234 (10) | 3282 · 3337 (10) | 3048 · 3456 (10) | 3370 · 3573 (10) | 741 · 772 (10) | 923 · 1226 (10) |
| L | 6907 · 7009 (10) | 4287 · 4926 (10) | 8127 · 8429 (10) | 6374 · 6540 (10) | 8353 · 8437 (10) | 7542 · 7816 (10) | 7520 · 7619 (10) | 1905 · 1963 (10) | 2398 · 2507 (10) |

## Grid dashboard (`grid-dashboard`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 237 · 245 (10) | 154 · 165 (10) | 307 · 320 (10) | 222 · 232 (10) | 269 · 281 (10) | 262 · 285 (10) | 263 · 279 (10) | 130 · 133 (10) | 58.0 · 144 (10) |
| M | 795 · 811 (10) | 539 · 567 (10) | 1057 · 1094 (10) | 759 · 804 (10) | 946 · 992 (10) | 892 · 930 (10) | 912 · 964 (10) | 424 · 441 (10) | 293 · 385 (10) |
| L | 2118 · 2174 (10) | 1570 · 1626 (10) | 2837 · 2901 (10) | 2062 · 2092 (10) | 2632 · 2665 (10) | 2426 · 2454 (10) | 2429 · 2465 (10) | 1283 · 1327 (10) | 843 · 1229 (10) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 211 · 220 (10) | 117 · 125 (10) | – | – | – | – | – | – | – |
| M | 710 · 734 (10) | 400 · 436 (10) | – | – | – | – | – | – | – |
| L | 1899 · 1946 (10) | 1186 · 1220 (10) | – | – | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 4.3 · 4.7 (10) | 3.8 · 3.9 (10) | – | – | – | – | – | – | – |
| M | 16.2 · 16.6 (10) | 11.8 · 12.4 (10) | – | – | – | – | – | – | – |
| L | 31.2 · 32.3 (10) | 32.3 · 33.9 (10) | – | – | – | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 224 · 233 (10) | 143 · 151 (10) | 291 · 306 (10) | 206 · 219 (10) | 253 · 264 (10) | 247 · 268 (10) | 247 · 263 (10) | 113 · 115 (10) | 51.0 · 140 (10) |
| M | 756 · 779 (10) | 497 · 533 (10) | 1006 · 1043 (10) | 703 · 756 (10) | 893 · 950 (10) | 844 · 889 (10) | 859 · 924 (10) | 154 · 351 (10) | 286 · 383 (10) |
| L | 2022 · 2069 (10) | 1474 · 1514 (10) | 2701 · 2796 (10) | 1957 · 1968 (10) | 2496 · 2529 (10) | 2318 · 2339 (10) | 2308 · 2323 (10) | 361 · 368 (10) | 839 · 1222 (10) |

## Text flow (`text-flow`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 78.0 · 80.2 (10) | 61.2 · 61.9 (10) | 113 · 114 (10) | 81.5 · 108 (10) | 98.7 · 102 (10) | 97.8 · 103 (10) | 93.0 · 95.8 (10) | 69.8 · 72.1 (10) | 41.0 · 42.0 (10) |
| M | 283 · 320 (10) | 230 · 247 (10) | 398 · 425 (10) | 280 · 296 (10) | 342 · 351 (10) | 347 · 368 (10) | 359 · 421 (10) | 248 · 261 (10) | 100 · 116 (10) |
| L | 787 · 805 (10) | 693 · 756 (10) | 1185 · 1290 (10) | 861 · 925 (10) | 1034 · 1054 (10) | 1103 · 1140 (10) | 998 · 1063 (10) | 686 · 709 (10) | 410 · 758 (10) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 48.5 · 50.4 (10) | 27.6 · 28.1 (10) | – | – | – | – | – | – | – |
| M | 167 · 200 (10) | 97.3 · 117 (10) | – | – | – | – | – | – | – |
| L | 463 · 477 (10) | 286 · 310 (10) | – | – | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 1.3 · 1.9 (10) | 1.4 · 1.5 (10) | – | – | – | – | – | – | – |
| M | 3.2 · 3.5 (10) | 3.7 · 3.9 (10) | – | – | – | – | – | – | – |
| L | 8.1 · 8.1 (10) | 10.2 · 10.8 (10) | – | – | – | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 65.5 · 67.5 (10) | 47.8 · 48.8 (10) | 95.0 · 95.7 (10) | 64.6 · 86.5 (10) | 81.5 · 84.5 (10) | 81.9 · 85.8 (10) | 76.8 · 79.5 (10) | 53.9 · 55.9 (10) | 32.0 · 34.1 (10) |
| M | 234 · 268 (10) | 178 · 198 (10) | 334 · 344 (10) | 221 · 237 (10) | 281 · 285 (10) | 286 · 305 (10) | 298 · 331 (10) | 186 · 195 (10) | 95.0 · 110 (10) |
| L | 651 · 662 (10) | 536 · 560 (10) | 1009 · 1044 (10) | 682 · 699 (10) | 826 · 868 (10) | 916 · 947 (10) | 813 · 872 (10) | 493 · 505 (10) | 406 · 747 (10) |

## Styled cards (`styled-cards`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 228 · 237 (10) | 221 · 226 (10) | 355 · 379 (10) | 248 · 260 (10) | 302 · 306 (10) | 317 · 324 (10) | 311 · 322 (10) | 156 · 166 (10) | 58.0 · 69.7 (10) |
| M | 881 · 897 (10) | 910 · 1027 (10) | 1323 · 1374 (10) | 977 · 1006 (10) | 1182 · 1207 (10) | 1219 · 1259 (10) | 1197 · 1251 (10) | 544 · 555 (10) | 183 · 638 (10) |
| L | 2811 · 2859 (10) | 3218 · 3311 (10) | 4546 · 4691 (10) | 3341 · 3393 (10) | 3993 · 4066 (10) | 3953 · 3993 (10) | 3969 · 4019 (10) | 1905 · 1932 (10) | 1157 · 1312 (10) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 199 · 211 (10) | 167 · 172 (10) | – | – | – | – | – | – | – |
| M | 771 · 783 (10) | 665 · 740 (10) | – | – | – | – | – | – | – |
| L | 2414 · 2444 (10) | 2292 · 2443 (10) | – | – | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 3.7 · 4.0 (10) | 4.8 · 5.1 (10) | – | – | – | – | – | – | – |
| M | 11.6 · 12.0 (10) | 19.1 · 21.4 (10) | – | – | – | – | – | – | – |
| L | 35.6 · 37.3 (10) | 69.7 · 72.7 (10) | – | – | – | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 213 · 225 (10) | 199 · 205 (10) | 330 · 353 (10) | 224 · 236 (10) | 277 · 280 (10) | 292 · 303 (10) | 284 · 294 (10) | 136 · 143 (10) | 52.0 · 66.1 (10) |
| M | 835 · 847 (10) | 828 · 890 (10) | 1226 · 1293 (10) | 862 · 918 (10) | 1088 · 1112 (10) | 1104 · 1155 (10) | 1107 · 1168 (10) | 140 · 177 (10) | 180 · 630 (10) |
| L | 2604 · 2634 (10) | 2825 · 2931 (10) | 4150 · 4293 (10) | 2935 · 2960 (10) | 3688 · 3770 (10) | 3529 · 3606 (10) | 3622 · 3714 (10) | 467 · 495 (10) | 1149 · 1302 (10) |

## Relayout: root resize (`relayout-resize`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 185 · 197 (10) | 188 · 193 (10) | 429 · 442 (10) | 209 · 218 (10) | 205 · 214 (10) | 260 · 273 (10) | 196 · 241 (10) | 84.0 · 91.3 (10) | 67.0 · 67.4 (10) |
| M | 504 · 524 (10) | 558 · 602 (10) | 1228 · 1249 (10) | 628 · 655 (10) | 625 · 673 (10) | 828 · 859 (10) | 580 · 630 (10) | 188 · 197 (10) | 142 · 503 (10) |
| L | 1614 · 1655 (10) | 1640 · 1662 (10) | 3647 · 3698 (10) | 1922 · 1947 (10) | 2081 · 3258 (10) | 2368 · 2605 (10) | 1817 · 1855 (10) | 571 · 1022 (10) | 559 · 920 (10) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 165 · 175 (10) | 165 · 169 (10) | – | – | – | – | – | – | – |
| M | 448 · 455 (10) | 471 · 515 (10) | – | – | – | – | – | – | – |
| L | 1419 · 1459 (10) | 1400 · 1445 (10) | – | – | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 4.8 · 5.0 (10) | 7.3 · 7.8 (10) | – | – | – | – | – | – | – |
| M | 12.1 · 12.3 (10) | 19.5 · 20.9 (10) | – | – | – | – | – | – | – |
| L | 34.9 · 37.3 (10) | 64.1 · 65.1 (10) | – | – | – | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 175 · 185 (10) | 179 · 183 (10) | 418 · 431 (10) | 200 · 208 (10) | 196 · 205 (10) | 251 · 264 (10) | 188 · 221 (10) | 71.1 · 72.8 (10) | 60.0 · 61.2 (10) |
| M | 482 · 489 (10) | 521 · 566 (10) | 1191 · 1213 (10) | 599 · 621 (10) | 592 · 647 (10) | 794 · 835 (10) | 550 · 597 (10) | 100 · 103 (10) | 139 · 496 (10) |
| L | 1505 · 1546 (10) | 1555 · 1573 (10) | 3537 · 3601 (10) | 1841 · 1865 (10) | 1972 · 3145 (10) | 2283 · 2521 (10) | 1722 · 1775 (10) | 302 · 404 (10) | 554 · 915 (10) |

**shrink**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 19.0 · 23.3 (10) | 16.3 · 22.0 (10) | 20.9 · 21.9 (10) | 16.2 · 19.5 (10) | 20.7 · 23.2 (10) | 17.3 · 20.7 (10) | 20.6 · 22.5 (10) | 27.1 · 32.1 (10) | 27.0 · 36.6 (10) |
| M | 47.1 · 52.0 (10) | 35.2 · 42.0 (10) | 43.2 · 47.2 (10) | 36.3 · 39.9 (10) | 42.2 · 44.9 (10) | 38.8 · 41.8 (10) | 33.9 · 43.3 (10) | 60.6 · 108 (10) | 58.0 · 66.2 (10) |
| L | 99.7 · 110 (10) | 93.0 · 99.3 (10) | 107 · 139 (10) | 98.6 · 101 (10) | 125 · 174 (10) | 95.7 · 106 (10) | 96.7 · 102 (10) | 345 · 506 (10) | 171 · 227 (10) |

**shrink.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 5.1 · 10.8 (10) | 9.0 · 12.9 (10) | 13.1 · 14.7 (10) | 9.8 · 14.1 (10) | 10.9 · 14.8 (10) | 9.8 · 12.6 (10) | 12.3 · 14.0 (10) | 9.9 · 10.4 (10) | 23.5 · 25.3 (10) |
| M | 10.0 · 11.1 (10) | 17.7 · 20.2 (10) | 20.5 · 23.3 (10) | 15.3 · 19.2 (10) | 20.6 · 22.3 (10) | 18.0 · 21.0 (10) | 14.2 · 19.8 (10) | 18.6 · 23.4 (10) | 53.5 · 57.1 (10) |
| L | 37.6 · 50.6 (10) | 36.9 · 39.2 (10) | 46.2 · 52.2 (10) | 38.6 · 40.5 (10) | 48.0 · 69.7 (10) | 36.2 · 39.0 (10) | 36.6 · 38.7 (10) | 56.8 · 74.7 (10) | 165 · 219 (10) |

**grow**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 12.8 · 18.2 (10) | 10.5 · 17.7 (10) | 13.0 · 19.4 (10) | 8.8 · 15.7 (10) | 16.0 · 19.4 (10) | 8.9 · 15.8 (10) | 11.1 · 13.6 (10) | 15.7 · 25.0 (10) | 32.5 · 35.7 (10) |
| M | 30.0 · 33.0 (10) | 22.4 · 33.0 (10) | 31.7 · 36.6 (10) | 23.5 · 35.5 (10) | 30.9 · 31.8 (10) | 24.0 · 30.8 (10) | 23.5 · 31.4 (10) | 63.2 · 91.2 (10) | 60.5 · 70.4 (10) |
| L | 73.2 · 76.9 (10) | 64.8 · 77.6 (10) | 72.9 · 76.3 (10) | 66.0 · 96.8 (10) | 79.2 · 118 (10) | 64.8 · 111 (10) | 67.8 · 98.0 (10) | 81.4 · 500 (10) | 176 · 235 (10) |

**grow.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 4.0 · 9.5 (10) | 5.2 · 12.6 (10) | 6.8 · 14.6 (10) | 4.1 · 11.5 (10) | 10.1 · 13.6 (10) | 4.0 · 11.0 (10) | 6.4 · 8.8 (10) | 8.5 · 11.8 (10) | 23.0 · 28.7 (10) |
| M | 7.2 · 9.6 (10) | 10.2 · 20.7 (10) | 16.2 · 21.3 (10) | 11.1 · 19.7 (10) | 17.8 · 18.7 (10) | 11.2 · 17.0 (10) | 11.6 · 18.8 (10) | 21.0 · 31.2 (10) | 55.5 · 58.3 (10) |
| L | 13.7 · 17.7 (10) | 30.9 · 32.7 (10) | 39.7 · 42.4 (10) | 30.4 · 34.1 (10) | 42.3 · 55.0 (10) | 31.2 · 35.4 (10) | 33.8 · 47.8 (10) | 60.5 · 113 (10) | 169 · 227 (10) |

## Relayout: restyle every node (`relayout-style`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 189 · 238 (10) | 178 · 185 (10) | 410 · 430 (10) | 207 · 219 (10) | 201 · 229 (10) | 258 · 267 (10) | 193 · 241 (10) | 80.8 · 84.6 (10) | 66.5 · 67.1 (10) |
| M | 510 · 517 (10) | 525 · 539 (10) | 1194 · 1236 (10) | 612 · 622 (10) | 632 · 692 (10) | 756 · 824 (10) | 578 · 629 (10) | 234 · 242 (10) | 142 · 210 (10) |
| L | 1625 · 1642 (10) | 1605 · 1655 (10) | 3665 · 3765 (10) | 1892 · 1924 (10) | 1888 · 1906 (10) | 2306 · 2364 (10) | 1736 · 1795 (10) | 999 · 1008 (10) | 432 · 911 (10) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 167 · 218 (10) | 153 · 161 (10) | – | – | – | – | – | – | – |
| M | 445 · 456 (10) | 445 · 458 (10) | – | – | – | – | – | – | – |
| L | 1430 · 1445 (10) | 1405 · 1453 (10) | – | – | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 4.8 · 5.2 (10) | 6.3 · 6.5 (10) | – | – | – | – | – | – | – |
| M | 11.5 · 12.2 (10) | 16.8 · 18.4 (10) | – | – | – | – | – | – | – |
| L | 33.8 · 34.9 (10) | 63.4 · 65.1 (10) | – | – | – | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 177 · 229 (10) | 167 · 176 (10) | 400 · 422 (10) | 197 · 205 (10) | 192 · 219 (10) | 251 · 259 (10) | 184 · 230 (10) | 64.2 · 71.7 (10) | 59.0 · 60.2 (10) |
| M | 479 · 491 (10) | 490 · 505 (10) | 1158 · 1201 (10) | 584 · 597 (10) | 598 · 660 (10) | 732 · 800 (10) | 552 · 610 (10) | 96.4 · 183 (10) | 138 · 201 (10) |
| L | 1515 · 1530 (10) | 1532 · 1587 (10) | 3572 · 3646 (10) | 1825 · 1863 (10) | 1809 · 1840 (10) | 2242 · 2297 (10) | 1656 · 1731 (10) | 295 · 296 (10) | 426 · 904 (10) |

**restyle**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 34.5 · 36.6 (10) | 28.6 · 31.4 (10) | 26.6 · 31.7 (10) | 31.6 · 35.7 (10) | 31.8 · 35.2 (10) | 29.1 · 31.4 (10) | 29.5 · 32.1 (10) | 43.4 · 45.9 (10) | 35.0 · 35.3 (10) |
| M | 89.2 · 90.6 (10) | 70.1 · 77.4 (10) | 76.2 · 82.9 (10) | 70.0 · 78.4 (10) | 73.8 · 79.9 (10) | 67.0 · 73.7 (10) | 70.6 · 76.8 (10) | 73.7 · 146 (10) | 67.0 · 74.1 (10) |
| L | 234 · 258 (10) | 197 · 212 (10) | 215 · 247 (10) | 200 · 252 (10) | 223 · 267 (10) | 194 · 216 (10) | 196 · 206 (10) | 636 · 656 (10) | 204 · 236 (10) |

**restyle.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 20.8 · 23.7 (10) | 21.4 · 24.0 (10) | 21.0 · 25.4 (10) | 24.4 · 27.9 (10) | 23.6 · 27.1 (10) | 22.2 · 25.1 (10) | 23.3 · 24.5 (10) | 27.1 · 27.6 (10) | 26.0 · 27.4 (10) |
| M | 54.7 · 57.0 (10) | 51.5 · 63.6 (10) | 55.9 · 61.3 (10) | 51.7 · 55.0 (10) | 54.6 · 59.7 (10) | 51.7 · 54.2 (10) | 53.1 · 59.5 (10) | 63.6 · 71.4 (10) | 61.5 · 69.0 (10) |
| L | 205 · 224 (10) | 143 · 175 (10) | 161 · 191 (10) | 151 · 175 (10) | 176 · 192 (10) | 149 · 180 (10) | 152 · 170 (10) | 183 · 190 (10) | 197 · 229 (10) |

**restore**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 27.7 · 39.1 (10) | 22.1 · 30.9 (10) | 29.5 · 30.3 (10) | 25.8 · 29.6 (10) | 29.4 · 31.7 (10) | 27.7 · 30.5 (10) | 28.6 · 31.3 (10) | 37.9 · 45.4 (10) | 34.0 · 36.4 (10) |
| M | 72.3 · 74.4 (10) | 58.7 · 60.7 (10) | 71.3 · 72.2 (10) | 61.4 · 63.6 (10) | 69.1 · 71.6 (10) | 60.2 · 64.3 (10) | 62.5 · 64.7 (10) | 77.1 · 93.5 (10) | 73.5 · 78.4 (10) |
| L | 210 · 220 (10) | 167 · 169 (10) | 187 · 197 (10) | 174 · 176 (10) | 190 · 198 (10) | 169 · 175 (10) | 173 · 175 (10) | 223 · 607 (10) | 227 · 253 (10) |

**restore.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 20.0 · 24.1 (10) | 17.4 · 26.2 (10) | 25.0 · 25.9 (10) | 21.2 · 25.2 (10) | 24.5 · 26.8 (10) | 22.9 · 25.7 (10) | 23.5 · 26.0 (10) | 25.5 · 31.5 (10) | 25.0 · 27.5 (10) |
| M | 52.0 · 53.9 (10) | 47.0 · 48.7 (10) | 59.4 · 59.9 (10) | 49.9 · 51.9 (10) | 57.2 · 58.8 (10) | 48.7 · 52.8 (10) | 50.7 · 53.1 (10) | 65.1 · 72.2 (10) | 64.0 · 71.8 (10) |
| L | 159 · 162 (10) | 138 · 139 (10) | 157 · 166 (10) | 145 · 147 (10) | 160 · 167 (10) | 140 · 144 (10) | 143 · 145 (10) | 194 · 211 (10) | 225 · 245 (10) |

## Insert / remove at head (`insert-remove`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 671 · 708 (10) | 654 · 671 (10) | 826 · 883 (10) | 664 · 674 (10) | 827 · 863 (10) | 810 · 874 (10) | 797 · 820 (10) | 390 · 438 (10) | 159 · 167 (10) |
| M | 2750 · 2805 (10) | 2500 · 2535 (10) | 3262 · 3334 (10) | 2567 · 2660 (10) | 3370 · 3391 (10) | 3141 · 3186 (10) | 3155 · 3169 (10) | 2139 · 2181 (10) | 642 · 1233 (10) |
| L | 7365 · 7714 (10) | 6340 · 6614 (10) | 8458 · 8683 (10) | 6625 · 6667 (10) | 8625 · 8903 (10) | 7846 · 7941 (10) | 7883 · 8178 (10) | 7305 · 7415 (10) | 2329 · 2413 (10) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 590 · 629 (10) | 488 · 516 (10) | – | – | – | – | – | – | – |
| M | 2412 · 2455 (10) | 1848 · 1883 (10) | – | – | – | – | – | – | – |
| L | 6471 · 6806 (10) | 4653 · 4942 (10) | – | – | – | – | – | – | – |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 11.2 · 12.2 (10) | 13.5 · 14.5 (10) | – | – | – | – | – | – | – |
| M | 29.1 · 30.7 (10) | 51.1 · 52.3 (10) | – | – | – | – | – | – | – |
| L | 77.8 · 78.4 (10) | 164 · 168 (10) | – | – | – | – | – | – | – |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 640 · 679 (10) | 602 · 629 (10) | 770 · 834 (10) | 615 · 633 (10) | 773 · 817 (10) | 760 · 821 (10) | 742 · 769 (10) | 119 · 358 (10) | 156 · 162 (10) |
| M | 2612 · 2662 (10) | 2292 · 2321 (10) | 3097 · 3112 (10) | 2380 · 2467 (10) | 3162 · 3183 (10) | 2936 · 2973 (10) | 2951 · 2958 (10) | 750 · 778 (10) | 636 · 1225 (10) |
| L | 6993 · 7360 (10) | 5813 · 6114 (10) | 7924 · 8162 (10) | 6103 · 6140 (10) | 8080 · 8305 (10) | 7298 · 7369 (10) | 7367 · 7729 (10) | 1908 · 1980 (10) | 2322 · 2405 (10) |

**insert**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 359 · 424 (10) | 329 · 350 (10) | 346 · 398 (10) | 351 · 361 (10) | 422 · 442 (10) | 352 · 389 (10) | 396 · 410 (10) | 330 · 342 (10) | 92.0 · 143 (10) |
| M | 351 · 357 (10) | 338 · 362 (10) | 375 · 460 (10) | 367 · 447 (10) | 572 · 746 (10) | 355 · 378 (10) | 525 · 534 (10) | 621 · 1267 (10) | 183 · 226 (10) |
| L | 474 · 507 (10) | 415 · 511 (10) | 509 · 716 (10) | 440 · 442 (10) | 903 · 975 (10) | 438 · 526 (10) | 812 · 904 (10) | 4718 · 4857 (10) | 400 · 454 (10) |

**insert.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 342 · 403 (10) | 306 · 324 (10) | 322 · 376 (10) | 329 · 340 (10) | 383 · 408 (10) | 328 · 369 (10) | 353 · 362 (10) | 93.8 · 241 (10) | 87.5 · 140 (10) |
| M | 316 · 321 (10) | 306 · 324 (10) | 338 · 423 (10) | 334 · 410 (10) | 538 · 713 (10) | 319 · 340 (10) | 410 · 414 (10) | 257 · 266 (10) | 178 · 220 (10) |
| L | 407 · 442 (10) | 358 · 455 (10) | 452 · 657 (10) | 383 · 385 (10) | 856 · 929 (10) | 380 · 470 (10) | 537 · 654 (10) | 510 · 521 (10) | 393 · 447 (10) |

**remove**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 23.0 · 23.7 (10) | 18.9 · 20.1 (10) | 25.8 · 27.5 (10) | 23.8 · 24.3 (10) | 27.3 · 28.5 (10) | 19.9 · 21.9 (10) | 25.6 · 30.6 (10) | 157 · 181 (10) | 48.0 · 53.6 (10) |
| M | 36.4 · 38.8 (10) | 37.6 · 40.7 (10) | 48.5 · 51.6 (10) | 50.8 · 53.2 (10) | 53.1 · 62.7 (10) | 50.5 · 54.3 (10) | 48.7 · 49.9 (10) | 446 · 888 (10) | 184 · 192 (10) |
| L | 67.1 · 68.9 (10) | 86.8 · 103 (10) | 90.3 · 126 (10) | 95.9 · 108 (10) | 109 · 119 (10) | 107 · 137 (10) | 96.0 · 109 (10) | 3987 · 4110 (10) | 733 · 770 (10) |

**remove.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Angular + Mason | NativeScript Vue + Mason | NativeScript React + Mason | NativeScript Svelte + Mason | NativeScript Solid + Mason | React Native | Lynx |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| S | 17.2 · 17.8 (10) | 14.2 · 15.2 (10) | 21.6 · 22.5 (10) | 19.1 · 20.0 (10) | 23.1 · 24.1 (10) | 16.1 · 17.2 (10) | 21.6 · 26.1 (10) | 53.8 · 55.8 (10) | 42.0 · 48.5 (10) |
| M | 20.7 · 21.4 (10) | 27.1 · 28.8 (10) | 35.9 · 37.8 (10) | 39.0 · 41.6 (10) | 41.1 · 45.9 (10) | 39.2 · 42.2 (10) | 37.8 · 38.9 (10) | 168 · 179 (10) | 177 · 183 (10) |
| L | 28.0 · 29.9 (10) | 59.2 · 64.4 (10) | 63.6 · 67.2 (10) | 72.0 · 75.3 (10) | 85.2 · 93.2 (10) | 82.5 · 96.4 (10) | 70.0 · 76.6 (10) | 425 · 439 (10) | 727 · 759 (10) |
