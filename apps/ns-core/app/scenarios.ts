import {
  FlexboxLayout,
  GridLayout,
  ItemSpec,
  GridUnitType,
  Label,
  ListView,
  StackLayout,
  type ItemEventData,
  type View,
} from '@nativescript/core';
import { h } from './ns-common/h';
import type { Built } from './ns-common/shell';
import type {
  Card,
  CardsData,
  ChainData,
  DashboardData,
  ListData,
  ListItem,
  ScenarioFixture,
  TextFlowData,
  Tile,
  TilesData,
  TreeData,
  TreeNode,
} from './shared/generate';
import { fontSizes, palette } from './shared/tokens';

// NativeScript core builders: idiomatic core layouts (StackLayout,
// GridLayout for equal columns / grids, FlexboxLayout for wrapping), classes
// from app.css. Structure follows scenarios/spec.md.

const text = (className: string, value: string) => h(Label, { className, text: value, textWrap: true });
const sentinel = () => h(StackLayout, { className: 'sentinel' });

function starColumns(grid: GridLayout, weights: readonly number[]) {
  for (const w of weights) grid.addColumn(new ItemSpec(w, GridUnitType.STAR));
}

function wrap(content: View): Built {
  const s = sentinel();
  return { root: h(StackLayout, null, [content, s]), sentinel: s, placement: 'scroll' };
}

// ---- nested-chain ----------------------------------------------------------

function chain(d: ChainData): Built {
  let inner: View = text('chain-label', d.label);
  for (let level = d.depth - 1; level >= 0; level--) {
    const c = level % palette.length;
    inner = h(StackLayout, { className: `chain bgl-${c} bc-${c}` }, [inner]);
  }
  return wrap(inner);
}

// ---- tree-fanout -----------------------------------------------------------

function treeNode(n: TreeNode): View {
  if (!n.children.length) return h(StackLayout, { className: `leaf bg-${n.color}` });
  const cls = `tn bgl-${n.color} bc-${n.color}`;
  if (n.dir === 'column') return h(StackLayout, { className: cls }, n.children.map(treeNode));
  const grid = h(GridLayout, { className: cls });
  starColumns(grid, n.children.map(() => 1));
  n.children.forEach((c, i) => {
    const v = treeNode(c);
    GridLayout.setColumn(v, i);
    grid.addChild(v);
  });
  return grid;
}

function tree(d: TreeData): Built {
  const s = sentinel();
  const frame = h(StackLayout, { className: 'tree-frame', width: '100%', horizontalAlignment: 'left' }, [treeNode(d.root), s]);
  return {
    root: frame,
    sentinel: s,
    placement: 'scroll',
    mutate(name) {
      switch (name) {
        case 'shrink':
          frame.width = '80%';
          break;
        case 'grow':
          frame.width = '100%';
          break;
        case 'restyle':
          frame.className = 'tree-frame restyled';
          break;
        case 'restore':
          frame.className = 'tree-frame';
          break;
      }
    },
  };
}

// ---- flex-wrap-tiles / insert-remove ---------------------------------------

const tile = (t: Tile) => h(StackLayout, { className: `tile bgl-${t.color}` }, [text('tile-title', t.title), text('tile-sub', t.subtitle)]);

function tiles(d: TilesData): Built {
  const container = h(FlexboxLayout, { className: 'tiles' }, d.tiles.map(tile));
  const built = wrap(container);
  let inserted: View[] = [];
  built.mutate = (name) => {
    if (name === 'insert') {
      inserted = d.insert.map(tile);
      inserted.forEach((v, i) => container.insertChild(v, i));
    } else if (name === 'remove') {
      for (const v of inserted) container.removeChild(v);
      inserted = [];
    }
  };
  return built;
}

// ---- grid-dashboard --------------------------------------------------------

function place<T extends View>(v: T, row: number, col: number, rowSpan = 1, colSpan = 1): T {
  GridLayout.setRow(v, row);
  GridLayout.setColumn(v, col);
  if (rowSpan > 1) GridLayout.setRowSpan(v, rowSpan);
  if (colSpan > 1) GridLayout.setColumnSpan(v, colSpan);
  return v;
}

function dashboard(d: DashboardData): Built {
  const grid = h(GridLayout, { columns: '96,*,*', rows: '56,auto,auto' });

  const header = h(GridLayout, { className: 'dash-header', columns: `*${',auto'.repeat(d.pills.length)}` });
  header.addChild(text('dash-title', d.title));
  d.pills.forEach((p, i) => header.addChild(place(text('pill', p), 0, i + 1)));
  grid.addChild(place(header, 0, 0, 1, 3));

  const nav = h(
    StackLayout,
    { className: 'dash-nav' },
    d.nav.map((n) => text(n.active ? 'nav-item active' : 'nav-item', n.label)),
  );
  grid.addChild(place(nav, 1, 0, 2, 1));

  const stats = h(GridLayout, { className: 'dash-stats', columns: '*,*', rows: Array(Math.ceil(d.stats.length / 2)).fill('auto').join(',') });
  d.stats.forEach((s, i) => {
    const bars = h(GridLayout, { className: 'bars' });
    starColumns(bars, s.bars.map(() => 1));
    s.bars.forEach((height, b) => bars.addChild(place(h(StackLayout, { className: 'bar', height }), 0, b)));
    const card = h(StackLayout, { className: 'stat' }, [
      text('stat-label', s.label),
      text('stat-value', s.value),
      text(`stat-delta ${s.up ? 'up' : 'down'}`, s.delta),
      bars,
    ]);
    stats.addChild(place(card, Math.floor(i / 2), i % 2));
  });
  grid.addChild(place(stats, 1, 1, 1, 2));

  const row = (className: string, cells: View[]) => {
    const r = h(GridLayout, { className, columns: '2*,*,*,*' });
    cells.forEach((c, i) => r.addChild(place(c, 0, i)));
    return r;
  };
  const table = h(StackLayout, { className: 'dash-table' }, [
    row('trow thead', d.columns.map((c) => text('cell', c))),
    ...d.rows.map((r) =>
      row('trow', [
        h(StackLayout, { className: 'cell-name' }, [h(StackLayout, { className: `dot bg-${r.color}` }), text('cell', r.name)]),
        ...r.cells.map((c) => text('cell', c)),
      ]),
    ),
  ]);
  grid.addChild(place(table, 2, 1, 1, 2));

  return wrap(grid);
}

// ---- text-flow -------------------------------------------------------------

function textFlow(d: TextFlowData): Built {
  const paras = d.paragraphs.map((p) => {
    const label = text(`para fs-${p.size}${p.bold ? ' bold' : ''}`, p.text);
    // core letterSpacing is in em.
    if (p.spacing) label.letterSpacing = p.spacing / fontSizes[p.size];
    if (p.clamp) label.maxLines = 2;
    return label;
  });
  return wrap(h(StackLayout, { className: 'text-flow' }, paras));
}

// ---- styled-cards / scroll-plain -------------------------------------------

function card(c: Card): View {
  const inner = h(StackLayout, { className: 'card-inner' }, [
    text('card-title', c.title),
    text('card-body', c.body),
    h(
      StackLayout,
      { className: 'chips' },
      c.chips.map((x) => text(`chip bgl-${c.color}`, x)),
    ),
  ]);
  const outer = h(StackLayout, { className: c.variant === 1 ? `card v1 bc-${c.color}` : `card v${c.variant}` });
  if (c.variant === 2) outer.style.backgroundImage = `linear-gradient(135deg, ${palette[c.color]}, ${palette[c.color2]})` as any;
  if (c.variant === 3) outer.style.borderTopColor = palette[c.color] as any;
  if (c.variant === 5) outer.addChild(h(StackLayout, { className: `band bg-${c.color}` }));
  outer.addChild(inner);
  return outer;
}

function cards(d: CardsData): Built {
  return wrap(h(StackLayout, { className: 'cards' }, d.cards.map(card)));
}

// ---- list-scroll -----------------------------------------------------------

interface ItemRefs {
  mark: StackLayout;
  title: Label;
  sub: Label;
  meta: Label;
  body?: Label;
  badges?: StackLayout;
}

function textColumn(refs: Partial<ItemRefs>, withBadges: boolean): StackLayout {
  refs.title = text('li-title', '');
  refs.sub = text('li-sub', '');
  const col = h(StackLayout, { className: 'li-text' }, [refs.title, refs.sub]);
  if (withBadges) col.addChild((refs.badges = h(StackLayout, { className: 'badges' })));
  return col;
}

function headRow(refs: Partial<ItemRefs>, className: string, markClass: string, withBadges: boolean): GridLayout {
  const row = h(GridLayout, { className, columns: 'auto,*,auto' });
  refs.mark = h(StackLayout, { className: markClass });
  refs.meta = text('li-meta', '');
  row.addChild(place(refs.mark, 0, 0));
  row.addChild(place(textColumn(refs, withBadges), 0, 1));
  row.addChild(place(refs.meta, 0, 2));
  return row;
}

function createItem(type: ListItem['type']): View {
  const refs: Partial<ItemRefs> = {};
  let view: View;
  if (type === 'a') view = headRow(refs, 'li-row', 'avatar', false);
  else if (type === 'b') view = headRow(refs, 'li-row', 'thumb', true);
  else {
    const head = headRow(refs, '', 'avatar', false);
    refs.body = text('li-body', '');
    refs.badges = h(StackLayout, { className: 'badges' });
    view = h(StackLayout, { className: 'li-card' }, [head, refs.body, refs.badges]);
  }
  (view as any).__refs = refs;
  return view;
}

function bindItem(view: View, item: ListItem) {
  const r = (view as any).__refs as ItemRefs;
  const shape = item.type === 'b' ? 'thumb' : 'avatar';
  r.mark.className = `${shape} bg-${item.color}`;
  r.title.text = item.title;
  r.sub.text = item.subtitle;
  r.meta.text = item.meta;
  if (r.body) r.body.text = item.body;
  if (r.badges) {
    r.badges.removeChildren();
    for (const b of item.badges) r.badges.addChild(text(`badge bgl-${item.color}`, b));
  }
}

function list(d: ListData): Built {
  const lv = new ListView();
  lv.itemTemplates = (['a', 'b', 'c'] as const).map((key) => ({ key, createView: () => createItem(key) }));
  lv.itemTemplateSelector = (item: ListItem) => item.type;
  lv.on(ListView.itemLoadingEvent, (args: ItemEventData) => bindItem(args.view, d.items[args.index]));
  lv.items = d.items;
  lv.className = 'root';
  return { root: lv, sentinel: lv, placement: 'fill' };
}

// ---- dispatch --------------------------------------------------------------

export function build(f: ScenarioFixture): Built {
  switch (f.fixture) {
    case 'nested-chain':
      return chain(f.data as ChainData);
    case 'tree-fanout':
      return tree(f.data as TreeData);
    case 'flex-wrap-tiles':
      return tiles(f.data as TilesData);
    case 'grid-dashboard':
      return dashboard(f.data as DashboardData);
    case 'text-flow':
      return textFlow(f.data as TextFlowData);
    case 'styled-cards':
    case 'scroll-plain':
      return cards(f.data as CardsData);
    case 'list-scroll':
      return list(f.data as ListData);
  }
}
