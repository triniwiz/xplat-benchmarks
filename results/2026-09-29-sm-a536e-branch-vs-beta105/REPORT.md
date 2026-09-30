# Results: 2026-09-29-sm-a536e-branch-vs-beta105

- Device: samsung SM-A536E (device), android 16
- Rounds: 2, warmup 2, iterations 8 per round
- Cells: median ms · p90 ms (n). Lower is better.
- `<series>` = until painted (layout + next frame); `<series>.layout` = until the tree was laid out.

## Versions

- **NativeScript Core**: @nativescript/core 9.1.3-next.2, @nativescript/ios 9.1.0, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38
- **NativeScript Core + Mason**: @nativescript/core 9.1.3-next.2, @nativescript/ios 9.1.0, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38, @triniwiz/nativescript-masonkit 1.0.0-beta.105
- **NativeScript Core + Mason (local build)**: @nativescript/core 9.1.3-next.2, @nativescript/ios 9.1.0, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38, @triniwiz/nativescript-masonkit 1.0.0-beta.105

## Known deviations

- **NativeScript Core**: styled-cards v5: core does not clip children to border-radius (overflow: hidden unsupported).
- **NativeScript Core + Mason**: Mason-native frame: Mason root, status Text, Mason Scroll host and Mason Ul; the window root is a core GridLayout only to apply Android insets.
- **NativeScript Core + Mason**: list-scroll: each Ul cell has an extra full-width Mason root (cells size to max-content and ignore root margins).
- **NativeScript Core + Mason**: list-scroll (iOS): the first screen of the Mason Ul fills only ~7 cells and leaves the rest blank (masonkit 1.0.0-beta.104).
- **NativeScript Core + Mason**: text-flow: no line clamp in Mason, so the 2-line clamp paragraphs render in full.
- **NativeScript Core + Mason**: styled-cards v4: stylesheet `transform` (rotate/scale) is not applied inside a Mason-native tree (it was when the host was a core ScrollView; masonkit 1.0.0-beta.105, Android).
- **NativeScript Core + Mason (local build)**: Mason-native frame: Mason root, status Text, Mason Scroll host and Mason Ul; the window root is a core GridLayout only to apply Android insets.
- **NativeScript Core + Mason (local build)**: list-scroll: each Ul cell has an extra full-width Mason root (cells size to max-content and ignore root margins).
- **NativeScript Core + Mason (local build)**: list-scroll (iOS): the first screen of the Mason Ul fills only ~7 cells and leaves the rest blank (masonkit 1.0.0-beta.104).
- **NativeScript Core + Mason (local build)**: text-flow: no line clamp in Mason, so the 2-line clamp paragraphs render in full.
- **NativeScript Core + Mason (local build)**: styled-cards v4: stylesheet `transform` (rotate/scale) is not applied inside a Mason-native tree (it was when the host was a core ScrollView; masonkit 1.0.0-beta.105, Android).

## Memory after run (MB, highest round)

| app | Java heap | native heap | graphics | total PSS |
|---|---:|---:|---:|---:|
| NativeScript Core | 25 | 88 | 20 | 212 |
| NativeScript Core + Mason | 7 | 108 | 20 | 228 |
| NativeScript Core + Mason (local build) | 7 | 108 | 20 | 228 |

## Nested chain (`nested-chain`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 27.5 · 28.7 (16) | 35.9 · 39.5 (16) | 33.8 · 38.6 (16) |
| M | 39.6 · 43.7 (16) | 52.9 · 83.9 (16) | 47.3 · 56.9 (16) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 23.2 · 24.6 (16) | 27.4 · 30.2 (16) | 25.2 · 29.7 (16) |
| M | 33.8 · 37.7 (16) | 42.0 · 64.3 (16) | 35.8 · 45.5 (16) |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 1.5 · 1.7 (16) | 1.6 · 2.3 (16) | 1.6 · 1.8 (16) |
| M | 1.7 · 2.1 (16) | 2.7 · 4.4 (16) | 2.1 · 2.8 (16) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 24.8 · 26.3 (16) | 31.8 · 34.3 (16) | 29.2 · 34.1 (16) |
| M | 35.9 · 40.0 (16) | 47.3 · 76.1 (16) | 41.8 · 51.6 (16) |

## Tree fan-out (`tree-fanout`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 224 · 235 (16) | 248 · 299 (16) | 221 · 255 (16) |
| M | 558 · 577 (16) | 648 · 689 (16) | 547 · 620 (16) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 199 · 216 (16) | 210 · 260 (16) | 186 · 218 (16) |
| M | 490 · 512 (16) | 544 · 588 (16) | 441 · 501 (16) |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 7.3 · 8.3 (16) | 10.9 · 12.1 (16) | 6.3 · 7.5 (16) |
| M | 15.7 · 16.7 (16) | 30.3 · 33.9 (16) | 18.6 · 20.5 (16) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 210 · 228 (16) | 228 · 279 (16) | 203 · 237 (16) |
| M | 528 · 549 (16) | 604 · 643 (16) | 496 · 557 (16) |

## Flex-wrap tiles (`flex-wrap-tiles`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 737 · 772 (16) | 739 · 787 (16) | 585 · 629 (16) |
| M | 2821 · 2899 (16) | 2756 · 2880 (16) | 2209 · 2268 (16) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 648 · 680 (16) | 536 · 585 (16) | 390 · 438 (16) |
| M | 2472 · 2540 (16) | 2032 · 2167 (16) | 1475 · 1545 (16) |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 10.1 · 13.3 (16) | 14.4 · 15.6 (16) | 8.0 · 10.9 (16) |
| M | 28.3 · 32.7 (16) | 60.9 · 65.4 (16) | 27.8 · 28.7 (16) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 700 · 734 (16) | 678 · 736 (16) | 531 · 578 (16) |
| M | 2677 · 2754 (16) | 2542 · 2666 (16) | 1968 · 2094 (16) |

## Grid dashboard (`grid-dashboard`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 240 · 263 (16) | 232 · 261 (16) | 191 · 200 (16) |
| M | 804 · 817 (16) | 793 · 823 (16) | 644 · 673 (16) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 217 · 240 (16) | 175 · 198 (16) | 133 · 140 (16) |
| M | 727 · 741 (16) | 585 · 619 (16) | 443 · 483 (16) |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 6.2 · 6.6 (16) | 5.5 · 5.7 (16) | 2.8 · 3.2 (16) |
| M | 17.0 · 17.8 (16) | 16.7 · 17.6 (16) | 8.1 · 8.8 (16) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 231 · 254 (16) | 215 · 239 (16) | 173 · 181 (16) |
| M | 775 · 790 (16) | 734 · 764 (16) | 593 · 629 (16) |

## Text flow (`text-flow`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 79.2 · 89.4 (16) | 82.4 · 85.5 (16) | 74.2 · 79.3 (16) |
| M | 280 · 288 (16) | 291 · 311 (16) | 257 · 273 (16) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 50.4 · 58.0 (16) | 38.6 · 40.8 (16) | 29.4 · 30.8 (16) |
| M | 166 · 173 (16) | 127 · 146 (16) | 92.2 · 99.0 (16) |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 1.7 · 1.8 (16) | 1.6 · 1.7 (16) | 1.1 · 1.2 (16) |
| M | 4.2 · 4.4 (16) | 4.6 · 4.9 (16) | 2.4 · 2.9 (16) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 66.8 · 76.8 (16) | 66.3 · 68.4 (16) | 58.0 · 60.7 (16) |
| M | 232 · 239 (16) | 229 · 250 (16) | 193 · 208 (16) |

## Styled cards (`styled-cards`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 236 · 250 (16) | 262 · 279 (16) | 220 · 281 (16) |
| M | 916 · 930 (16) | 998 · 1044 (16) | 814 · 878 (16) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 208 · 221 (16) | 198 · 208 (16) | 153 · 208 (16) |
| M | 794 · 806 (16) | 728 · 783 (16) | 557 · 628 (16) |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 4.9 · 5.2 (16) | 5.9 · 6.0 (16) | 3.5 · 3.9 (16) |
| M | 13.5 · 15.1 (16) | 21.7 · 23.5 (16) | 11.0 · 12.3 (16) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 223 · 237 (16) | 238 · 250 (16) | 193 · 255 (16) |
| M | 858 · 871 (16) | 889 · 942 (16) | 718 · 792 (16) |

## Relayout: root resize (`relayout-resize`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 194 · 205 (16) | 189 · 197 (16) | 168 · 179 (16) |
| M | 512 · 535 (16) | 577 · 614 (16) | 483 · 512 (16) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 174 · 187 (16) | 163 · 170 (16) | 144 · 153 (16) |
| M | 447 · 467 (16) | 487 · 534 (16) | 401 · 427 (16) |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 5.9 · 6.1 (16) | 7.2 · 8.1 (16) | 3.7 · 4.5 (16) |
| M | 12.7 · 14.6 (16) | 22.8 · 25.4 (16) | 12.1 · 15.9 (16) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 184 · 197 (16) | 178 · 186 (16) | 158 · 168 (16) |
| M | 481 · 503 (16) | 543 · 588 (16) | 450 · 481 (16) |

**shrink**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 20.9 · 23.8 (16) | 18.5 · 20.1 (16) | 18.4 · 21.7 (16) |
| M | 44.8 · 50.6 (16) | 34.9 · 39.0 (16) | 38.0 · 41.5 (16) |

**shrink.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 8.6 · 10.5 (16) | 10.9 · 12.5 (16) | 11.4 · 13.6 (16) |
| M | 9.6 · 13.0 (16) | 16.7 · 19.7 (16) | 17.3 · 19.9 (16) |

**grow**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 10.4 · 13.5 (16) | 9.3 · 13.6 (16) | 13.6 · 17.3 (16) |
| M | 30.7 · 33.6 (16) | 21.9 · 24.3 (16) | 21.5 · 29.3 (16) |

**grow.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 2.2 · 5.1 (16) | 4.5 · 8.2 (16) | 7.9 · 10.1 (16) |
| M | 7.8 · 11.3 (16) | 9.2 · 12.3 (16) | 9.0 · 16.6 (16) |

## Relayout: restyle every node (`relayout-style`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 194 · 200 (16) | 191 · 200 (16) | 175 · 251 (16) |
| M | 515 · 531 (16) | 555 · 592 (16) | 475 · 515 (16) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 170 · 179 (16) | 165 · 174 (16) | 151 · 224 (16) |
| M | 444 · 464 (16) | 472 · 510 (16) | 392 · 435 (16) |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 4.7 · 5.6 (16) | 7.6 · 8.7 (16) | 3.9 · 6.1 (16) |
| M | 12.1 · 12.7 (16) | 20.2 · 21.8 (16) | 10.4 · 12.9 (16) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 182 · 190 (16) | 180 · 190 (16) | 166 · 240 (16) |
| M | 479 · 499 (16) | 519 · 557 (16) | 439 · 480 (16) |

**restyle**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 32.0 · 35.6 (16) | 29.4 · 34.5 (16) | 30.8 · 33.5 (16) |
| M | 89.2 · 91.5 (16) | 69.8 · 80.1 (16) | 66.1 · 79.0 (16) |

**restyle.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 20.8 · 22.9 (16) | 23.3 · 26.8 (16) | 23.8 · 26.4 (16) |
| M | 55.0 · 66.4 (16) | 51.0 · 61.6 (16) | 50.3 · 58.9 (16) |

**restore**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 27.2 · 28.4 (16) | 23.9 · 30.0 (16) | 25.5 · 30.3 (16) |
| M | 72.5 · 75.8 (16) | 58.5 · 61.4 (16) | 58.1 · 64.0 (16) |

**restore.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 19.2 · 20.3 (16) | 19.1 · 25.4 (16) | 19.4 · 25.0 (16) |
| M | 51.6 · 54.6 (16) | 46.2 · 49.2 (16) | 46.4 · 52.0 (16) |

## Insert / remove at head (`insert-remove`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 679 · 703 (16) | 677 · 693 (16) | 541 · 545 (16) |
| M | 2716 · 2769 (16) | 2584 · 2642 (16) | 2025 · 2159 (16) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 599 · 618 (16) | 505 · 528 (16) | 353 · 379 (16) |
| M | 2379 · 2426 (16) | 1907 · 1951 (16) | 1362 · 1454 (16) |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 10.3 · 11.5 (16) | 13.6 · 14.3 (16) | 8.4 · 9.7 (16) |
| M | 26.6 · 29.3 (16) | 51.5 · 58.8 (16) | 25.4 · 28.3 (16) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 650 · 669 (16) | 623 · 646 (16) | 489 · 502 (16) |
| M | 2579 · 2626 (16) | 2375 · 2413 (16) | 1830 · 1948 (16) |

**insert**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 345 · 366 (16) | 352 · 379 (16) | 286 · 318 (16) |
| M | 368 · 398 (16) | 350 · 431 (16) | 299 · 352 (16) |

**insert.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 327 · 349 (16) | 324 · 356 (16) | 259 · 296 (16) |
| M | 331 · 362 (16) | 312 · 391 (16) | 261 · 315 (16) |

**remove**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 21.5 · 22.4 (16) | 20.0 · 31.7 (16) | 20.5 · 22.2 (16) |
| M | 36.8 · 37.8 (16) | 38.5 · 42.6 (16) | 40.1 · 42.9 (16) |

**remove.layout**

| size | NativeScript Core | NativeScript Core + Mason | NativeScript Core + Mason (local build) |
|---|---:|---:|---:|
| S | 15.6 · 16.3 (16) | 15.4 · 18.4 (16) | 16.1 · 17.2 (16) |
| M | 19.8 · 20.8 (16) | 27.2 · 30.7 (16) | 28.4 · 31.3 (16) |
