# Results: 2026-09-29-sm-a536e-core-vs-branch

- Device: samsung SM-A536E (device), android 16
- Rounds: 1, warmup 2, iterations 8 per round
- Cells: median ms · p90 ms (n). Lower is better.
- `<series>` = until painted (layout + next frame); `<series>.layout` = until the tree was laid out.

## Versions

- **NativeScript Core**: @nativescript/core 9.1.3-next.2, @nativescript/ios 9.1.0, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38
- **NativeScript Core + Mason (local build)**: @nativescript/core 9.1.3-next.2, @nativescript/ios 9.1.0, @nativescript/android 9.1.1, @nativescript/webpack 5.0.38, @triniwiz/nativescript-masonkit 1.0.0-beta.104

## Known deviations

- **NativeScript Core**: styled-cards v5: core does not clip children to border-radius (overflow: hidden unsupported).
- **NativeScript Core + Mason (local build)**: Mason-native frame: Mason root, status Text, Mason Scroll host and Mason Ul; the window root is a core GridLayout only to apply Android insets.
- **NativeScript Core + Mason (local build)**: list-scroll: Mason Ul with keyed templates needs apps/ns-common/patches (masonkit 1.0.0-beta.104 ignores itemTemplates; Android onCreate treats the view type as a data index).
- **NativeScript Core + Mason (local build)**: list-scroll: each Ul cell has an extra full-width Mason root (cells size to max-content and ignore root margins).
- **NativeScript Core + Mason (local build)**: list-scroll (iOS): the first screen of the Mason Ul fills only ~7 cells and leaves the rest blank (masonkit 1.0.0-beta.104).
- **NativeScript Core + Mason (local build)**: text-flow: no line clamp in Mason, so the 2-line clamp paragraphs render in full.
- **NativeScript Core + Mason (local build)**: styled-cards v4: stylesheet `transform` (rotate/scale) is not applied inside a Mason-native tree (it was when the host was a core ScrollView; masonkit 1.0.0-beta.104, Android).

## Memory after run (MB, highest round)

| app | Java heap | native heap | graphics | total PSS |
|---|---:|---:|---:|---:|
| NativeScript Core | 48 | 165 | 19 | 350 |
| NativeScript Core + Mason (local build) | 10 | 187 | 19 | 372 |

## Nested chain (`nested-chain`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 27.4 · 28.7 (8) | 35.1 · 36.4 (8) |
| M | 39.7 · 42.7 (8) | 52.8 · 60.3 (8) |
| L | 98.0 · 102 (8) | 78.2 · 80.9 (8) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | – | 26.2 · 26.5 (8) |
| M | – | 40.5 · 47.3 (8) |
| L | – | 59.8 · 61.7 (8) |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | – | 2.0 · 2.3 (8) |
| M | – | 2.6 · 3.9 (8) |
| L | – | 3.2 · 5.1 (8) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 24.9 · 26.2 (8) | 29.8 · 30.9 (8) |
| M | 36.0 · 39.0 (8) | 45.7 · 53.7 (8) |
| L | 88.2 · 92.1 (8) | 66.9 · 69.3 (8) |

## Tree fan-out (`tree-fanout`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 215 · 226 (8) | 149 · 164 (8) |
| M | 551 · 572 (8) | 428 · 464 (8) |
| L | 1689 · 1733 (8) | 1188 · 1242 (8) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | – | 121 · 136 (8) |
| M | – | 349 · 379 (8) |
| L | – | 980 · 1010 (8) |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | – | 7.9 · 9.3 (8) |
| M | – | 19.4 · 22.5 (8) |
| L | – | 41.8 · 45.5 (8) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 206 · 219 (8) | 133 · 148 (8) |
| M | 513 · 537 (8) | 390 · 419 (8) |
| L | 1565 · 1616 (8) | 1068 · 1108 (8) |

## Flex-wrap tiles (`flex-wrap-tiles`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 712 · 731 (8) | 559 · 580 (8) |
| M | 2813 · 2844 (8) | 2152 · 2242 (8) |
| L | 7302 · 7401 (8) | 5764 · 5895 (8) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | – | 434 · 463 (8) |
| M | – | 1665 · 1771 (8) |
| L | – | 4422 · 4571 (8) |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | – | 8.9 · 9.0 (8) |
| M | – | 37.4 · 40.2 (8) |
| L | – | 122 · 131 (8) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 679 · 703 (8) | 519 · 546 (8) |
| M | 2663 · 2703 (8) | 1981 · 2086 (8) |
| L | 6937 · 7003 (8) | 5347 · 5475 (8) |

## Grid dashboard (`grid-dashboard`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 239 · 266 (8) | 207 · 226 (8) |
| M | 786 · 792 (8) | 705 · 737 (8) |
| L | 2092 · 2134 (8) | 2066 · 2176 (8) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | – | 161 · 178 (8) |
| M | – | 548 · 580 (8) |
| L | – | 1591 · 1690 (8) |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | – | 4.2 · 5.1 (8) |
| M | – | 13.6 · 14.6 (8) |
| L | – | 39.9 · 44.5 (8) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 227 · 256 (8) | 190 · 213 (8) |
| M | 757 · 764 (8) | 658 · 688 (8) |
| L | 1991 · 2022 (8) | 1939 · 2057 (8) |

## Text flow (`text-flow`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 72.4 · 74.5 (8) | 89.1 · 92.9 (8) |
| M | 274 · 286 (8) | 334 · 357 (8) |
| L | 781 · 792 (8) | 1020 · 1056 (8) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | – | 38.6 · 40.9 (8) |
| M | – | 129 · 160 (8) |
| L | – | 353 · 401 (8) |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | – | 1.6 · 1.7 (8) |
| M | – | 4.3 · 4.5 (8) |
| L | – | 11.6 · 11.7 (8) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 60.5 · 62.9 (8) | 62.6 · 65.2 (8) |
| M | 223 · 233 (8) | 230 · 251 (8) |
| L | 644 · 653 (8) | 631 · 667 (8) |

## Styled cards (`styled-cards`, mount)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 230 · 240 (8) | 277 · 285 (8) |
| M | 895 · 902 (8) | 1097 · 1129 (8) |
| L | 2977 · 3561 (8) | 3715 · 3763 (8) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | – | 211 · 218 (8) |
| M | – | 850 · 888 (8) |
| L | – | 2738 · 2765 (8) |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | – | 5.2 · 5.4 (8) |
| M | – | 19.7 · 20.9 (8) |
| L | – | 70.5 · 72.1 (8) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 217 · 222 (8) | 245 · 253 (8) |
| M | 847 · 856 (8) | 987 · 1023 (8) |
| L | 2768 · 3255 (8) | 3213 · 3290 (8) |

## Relayout: root resize (`relayout-resize`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 186 · 201 (8) | 189 · 230 (8) |
| M | 495 · 526 (8) | 657 · 783 (8) |
| L | 1611 · 1644 (8) | 1690 · 1764 (8) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | – | 157 · 198 (8) |
| M | – | 545 · 658 (8) |
| L | – | 1395 · 1463 (8) |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | – | 5.9 · 6.4 (8) |
| M | – | 21.4 · 27.8 (8) |
| L | – | 65.0 · 67.8 (8) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 175 · 188 (8) | 171 · 214 (8) |
| M | 473 · 495 (8) | 595 · 713 (8) |
| L | 1499 · 1517 (8) | 1527 · 1600 (8) |

**shrink**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 20.8 · 25.5 (8) | 16.6 · 20.6 (8) |
| M | 45.4 · 50.1 (8) | 44.7 · 51.0 (8) |
| L | 91.5 · 96.1 (8) | 94.9 · 128 (8) |

**shrink.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 7.5 · 9.4 (8) | 8.5 · 12.3 (8) |
| M | 10.3 · 15.5 (8) | 16.0 · 24.9 (8) |
| L | 28.9 · 35.2 (8) | 36.3 · 40.8 (8) |

**grow**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 11.7 · 15.0 (8) | 8.8 · 16.3 (8) |
| M | 32.1 · 33.3 (8) | 30.0 · 33.5 (8) |
| L | 71.4 · 75.1 (8) | 64.1 · 92.6 (8) |

**grow.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 3.4 · 6.9 (8) | 3.8 · 8.3 (8) |
| M | 9.3 · 10.3 (8) | 15.9 · 17.8 (8) |
| L | 13.9 · 17.6 (8) | 29.4 · 48.0 (8) |

## Relayout: restyle every node (`relayout-style`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 184 · 194 (8) | 187 · 209 (8) |
| M | 506 · 515 (8) | 556 · 588 (8) |
| L | 1622 · 1711 (8) | 1682 · 1741 (8) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | – | 157 · 176 (8) |
| M | – | 454 · 488 (8) |
| L | – | 1388 · 1460 (8) |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | – | 5.9 · 6.3 (8) |
| M | – | 16.6 · 19.5 (8) |
| L | – | 63.7 · 65.7 (8) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 175 · 178 (8) | 171 · 191 (8) |
| M | 469 · 487 (8) | 499 · 534 (8) |
| L | 1510 · 1600 (8) | 1520 · 1587 (8) |

**restyle**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 33.4 · 35.4 (8) | 29.6 · 32.4 (8) |
| M | 90.2 · 93.9 (8) | 69.3 · 73.0 (8) |
| L | 225 · 234 (8) | 190 · 197 (8) |

**restyle.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 20.6 · 21.9 (8) | 22.7 · 25.4 (8) |
| M | 57.0 · 67.4 (8) | 50.2 · 53.5 (8) |
| L | 197 · 204 (8) | 143 · 154 (8) |

**restore**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 28.2 · 33.2 (8) | 22.6 · 30.1 (8) |
| M | 72.2 · 73.4 (8) | 58.5 · 63.9 (8) |
| L | 208 · 209 (8) | 167 · 174 (8) |

**restore.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 20.3 · 25.1 (8) | 17.8 · 25.7 (8) |
| M | 51.4 · 52.6 (8) | 45.9 · 52.0 (8) |
| L | 158 · 161 (8) | 136 · 141 (8) |

## Insert / remove at head (`insert-remove`, relayout)

**mount**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 674 · 696 (8) | 741 · 766 (8) |
| M | 2754 · 2794 (8) | 2871 · 2895 (8) |
| L | 7174 · 7397 (8) | 7279 · 7428 (8) |

**mount.attached**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | – | 589 · 612 (8) |
| M | – | 2241 · 2267 (8) |
| L | – | 5549 · 5732 (8) |

**mount.built**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | – | 13.3 · 14.4 (8) |
| M | – | 51.0 · 61.9 (8) |
| L | – | 160 · 167 (8) |

**mount.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 643 · 667 (8) | 694 · 722 (8) |
| M | 2616 · 2652 (8) | 2653 · 2681 (8) |
| L | 6825 · 7016 (8) | 6688 · 6830 (8) |

**insert**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 335 · 359 (8) | 352 · 387 (8) |
| M | 358 · 402 (8) | 365 · 447 (8) |
| L | 473 · 518 (8) | 524 · 657 (8) |

**insert.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 318 · 340 (8) | 330 · 360 (8) |
| M | 319 · 365 (8) | 326 · 408 (8) |
| L | 407 · 448 (8) | 467 · 596 (8) |

**remove**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 22.0 · 22.6 (8) | 18.7 · 19.5 (8) |
| M | 38.0 · 39.4 (8) | 39.0 · 45.7 (8) |
| L | 67.5 · 72.4 (8) | 83.8 · 107 (8) |

**remove.layout**

| size | NativeScript Core | NativeScript Core + Mason (local build) |
|---|---:|---:|
| S | 16.4 · 17.0 (8) | 14.5 · 15.1 (8) |
| M | 20.3 · 21.5 (8) | 27.1 · 31.3 (8) |
| L | 28.4 · 30.7 (8) | 58.2 · 61.4 (8) |
