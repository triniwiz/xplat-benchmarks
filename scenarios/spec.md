# Scenario spec

Every app renders each scenario so that it looks the same as the browser reference (`npm run fixtures`, then open `scenarios/reference/index.html`). The data comes from `fixtureFor(scenario, size)` in [src/generate.ts](src/generate.ts). Colors, spacing and font sizes come from [src/tokens.ts](src/tokens.ts). The canonical CSS is [reference/styles.css](reference/styles.css), which is generated from [scripts/css.ts](scripts/css.ts). The element structure below mirrors [scripts/html.ts](scripts/html.ts), element for element.

## General rules

- **Units.**
  - All lengths are dp/pt/CSS px.
  - In NativeScript core styles, write them unitless, because `px` means *device* pixels there.
  - In Mason, `px` means CSS px.
- **Colors.** `palette[i]` and `paletteLight[i]` refer to the arrays in tokens. The reference utility classes map to them like this:

  | Class | Property | Value |
  |---|---|---|
  | `bg-i` | background | `palette[i]` |
  | `bgl-i` | background | `paletteLight[i]` |
  | `bc-i` | border color | `palette[i]` |
- **Font.** Use the system font only. Line height is always an absolute value, `round(fontSize × 1.4)`, which gives 12→17, 14→20, 16→22 and 20→28. Frameworks whose `lineHeight` means *extra* spacing must convert it (NativeScript core on iOS adds its line height as extra spacing).
- **Flex defaults.**
  - The reference makes every element a flex column with `min-width: 0`, the same as React Native's default.
  - Lynx defaults to `display: linear`, so Lynx elements must set `display: flex` explicitly.
  - Mason defaults to flex.
- **No gap.** Spacing is done with margins, because NativeScript core layouts don't support `gap`. The grid-dashboard scenario is the exception: its grid tracks are the point of the test.
- **Host and structure.**
  - The bench host is a full-screen vertical scroll view with background `colors.bg`. Scenarios render into it.
  - Everything is mounted eagerly: nothing is virtualized except list-scroll.
- **Sentinel.**
  - Each app appends a sentinel as the last child of the scenario root: a view 1 dp tall with `colors.bg` background.
  - Its layout callback (followed by the next frame) marks the tree as "painted".
  - The sentinel is not in the reference.

## nested-chain: depth 32 / 64 / 128

- The tree is a chain of `depth` nested boxes. Each level `L` (0 at the outside):
  - `padding: 1 0 1 1` (top, right, bottom, left).
  - `border-left: 1 solid palette[L % 8]`.
  - `background: paletteLight[L % 8]`.
- The innermost box holds one text, `"depth N"`, at font size 12 with padding 4.
- Horizontal cost is 2 dp per level, so the full L chain fits a 360 dp screen.

| Stack | Box |
|---|---|
| NS core | `StackLayout` |
| Mason | `View` / `div` |
| RN | `View` |
| Lynx | `view` |

## tree-fanout: branching 3, depth 5 / 6 / 7 (364 / 1093 / 3280 nodes)

The data is a complete ternary tree (`TreeNode`). Each node's `dir` alternates by depth: even depths are `row`, odd depths are `column`.

- **Inner node:**
  - `padding: 1`, `border: 1 solid palette[color]`, `background: paletteLight[color]`.
  - Children are laid out in `dir`.
- **Leaf:**
  - `height: 12`, `background: palette[color]`.
- **Child of a row parent:**
  - `flex: 1 1 0`, so the children share the width equally.
  - Children of a column parent stretch across it.

| Stack | Row node | Column node |
|---|---|---|
| NS core | `GridLayout` with `columns="*,*,*"`, child `col=i` | `StackLayout` |
| Mason | `View` with `flex-direction: row`, children `flex: 1 1 0` | `View` column |
| RN / Lynx | `flexDirection: 'row'`, children `flex: 1` | column |

The two relayout scenarios reuse this tree:

**relayout-resize**
- The tree sits inside a `tree-frame` whose width is 100%.
- `shrink` sets the frame's width to 80%. `grow` restores it to 100%.
- Each mutation is timed until the next paint. Every node reflows.

**relayout-style**
- `restyle` changes every inner node to `padding: 3` and border color `colors.accent`. `restore` reverts it.
- Each stack uses its idiomatic mechanism:

| Stack | How the restyle is applied |
|---|---|
| NS core, Mason (CSS) | Toggle a class on the root. The descendant selector `.restyled .tn` does the rest. |
| Angular | A signal bound to the root's class. |
| RN | A state or context value that switches the style arrays. |
| Lynx | A root class, or per-node classes driven by state. |

## flex-wrap-tiles: 250 / 1000 / 2500 tiles

- **Container:** `flex-direction: row; flex-wrap: wrap; padding: 4`.
- **Tile:**
  - `width: 88; margin: 4; padding: 8; border-radius: 8; background: paletteLight[color]`.
  - Title: 14 bold, `colors.text`.
  - Subtitle: 12, `colors.muted`.

| Stack | Container |
|---|---|
| NS core | `FlexboxLayout` with `flexWrap="wrap"` |
| Mason | `View` |
| RN | `View` with `flexWrap: 'wrap'` |
| Lynx | `view` with `display: flex; flex-wrap: wrap` |

**insert-remove** reuses this scenario:
- `insert` adds the 100 `data.insert` tiles at the head of the container.
- `remove` takes them out again.

## grid-dashboard: nav 8/12/16, stats 8/16/32, rows 20/100/300

The outer grid:

```
grid-template-columns: 96 1fr 1fr;
grid-template-rows: 56 auto auto;
grid-template-areas: "header header header" "nav stats stats" "nav table table";
```

- **header:**
  - A row with center alignment, `padding: 0 12`, surface background and a bottom border.
  - Contains a title (16 bold, `flex: 1 1 0`) followed by three pills.
  - Each pill: `margin-left: 4; padding: 4 8; radius: 999; background: colors.bg`, text 12.
- **nav:**
  - `padding: 8 0`, surface background, a right border.
  - Items: `padding: 8 12`, font 12, `colors.muted`.
  - The active item: `colors.accent`, bold, `paletteLight[4]` background.
- **stats:**
  - A nested grid, `repeat(2, 1fr)`, `padding: 4`.
  - Each card: `margin: 4; padding: 8; radius: 8`, surface background, 1 px border.
  - Card contents: a label (12, muted), a value (20 bold), a delta (12, `positive` if up, otherwise `negative`), and a bar row.
  - The bar row is 40 tall with `align-items: flex-end` and holds 7 bars. Each bar: `flex: 1 1 0`, `margin: 0 1`, radius 2, accent color, height from the data.
- **table:**
  - `padding: 4 8`.
  - Every row, including the header row, is a grid `2fr 1fr 1fr 1fr` with `align-items: center`, `padding: 6 0` and a bottom border.
  - The first cell holds a dot (8×8, radius 4, `margin-right: 6`, `palette[color]`) followed by the name.
  - Cells use font 12. Header cells are bold.

| Stack | Mapping | Report label |
|---|---|---|
| NS core | `GridLayout` for the outer grid (`columns="96,*,*" rows="56,auto,auto"`, with `row`/`col`/`rowSpan`/`colSpan`). The stats grid is `GridLayout` with `columns="*,*"` and one `auto` row per two cards. Table rows are `GridLayout` with `columns="2*,*,*,*"`. | |
| Mason | `display: grid` with `grid-template-areas`, as in the reference. | |
| Lynx | `display: grid` with line-based placement, because Lynx has no `grid-area`. | |
| RN | No grid. Nested flex rows emulate it: the outer frame is a column holding the header and a row of nav plus a column of stats and table. Stats are rows of two `flex: 1` cards. Table rows are flex rows with `flex` 2/1/1/1. | `flex-emulated` |

## text-flow: 50 / 200 / 600 paragraphs

- **Container:** `padding: 12`.
- **Paragraph:**
  - `margin-bottom: 8`, `colors.text`.
  - Font size `fontSizes[size]`, with the absolute line height from the general rules.
  - Bold when `bold` is set; `letter-spacing: 0.5` when `spacing` is set.
  - When `clamp` is set, the text is limited to 2 lines with a trailing ellipsis.
- NS core's `letterSpacing` is in **em**, so it is written as `0.5 / fontSize`.

| Stack | Two-line clamp with ellipsis |
|---|---|
| NS core | `maxLines: 2` |
| Mason | `-webkit-line-clamp` / `max-lines` (whichever Mason supports) |
| RN | `numberOfLines={2}` |
| Lynx | `text-maxline: 2` |

## styled-cards: 30 / 120 / 400 cards (scroll-plain uses the same card at 100 / 300 / 600)

- **Card:** `margin: 8`, surface background.
- **Inner container:** `padding: 12`.
- **Card contents:**
  - Title: 16 bold, `colors.text`.
  - Body: 14 on a 20 line height, muted, `margin-top: 4`.
  - Chip row: `margin-top: 8`, three chips.
  - Each chip: `padding: 2 8; margin-right: 4; radius: 999; paletteLight[color]`, text 12.
- **Variant** (`id % 6`):

| Variant | Styles |
|---|---|
| v0 | radius 12; `box-shadow: 0 2 6 rgba(0,0,0,.2)` |
| v1 | radius `16 0 16 0` (per corner); `border: 2 solid palette[color]` |
| v2 | radius 8; `linear-gradient(135deg, palette[color], palette[color2])`; title and body are white |
| v3 | per-side borders: top is 4 `palette[color]`, the other sides are 1 `colors.border` |
| v4 | `opacity: 0.85; transform: rotate(-1deg) scale(0.98)`; radius 8; 1 border |
| v5 | radius 12; `overflow: hidden`; a band (24 tall, `palette[color]`) above the inner container. The band must be clipped by the corner radius. |

## list-scroll: 500 / 2000 / 5000 items, virtualized

Each item renders by its type:

- **a (row):**
  - A row with center alignment, `padding: 12 16`, surface background and a bottom border.
  - Holds an avatar (32×32, radius 16, `palette[color]`, `margin-right: 12`), then the text column (`flex: 1 1 0`) with the title (14 bold) and the subtitle (12, muted), then the meta text (12, muted, `margin-left: 8`).
- **b (media row):**
  - Same as a, but a thumbnail (56×56, radius 8) replaces the avatar.
  - The text column also has a badge row: `margin-top: 4`. Each badge: `padding: 2 6`, radius 4, `paletteLight[color]`, text 10.
- **c (card):**
  - `margin: 8 12; padding: 12; radius: 12`, surface background, 1 border.
  - A head row with the avatar, the text column and the meta, followed by the body (14 on 20, `margin-top: 8`) and the badges.

| Stack | List |
|---|---|
| NS core | `ListView` with 3 templates |
| Mason (both variants) | Mason `Ul` with `itemTemplates` |
| RN | `@shopify/flash-list` v2 with `getItemType`. It recycles cells, as ListView, `Ul` and `<list>` do. Heights are content-driven, so there is no fixed item size. |
| Lynx | `<list>` with `item-key` and `estimated-main-axis-size-px` |

The in-app runner times the first mount only. Scroll smoothness is measured by the external drivers (see README).
