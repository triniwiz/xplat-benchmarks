import { Screen } from '@nativescript/core';
import { Text, Ul, View } from '@triniwiz/nativescript-masonkit';
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
import { palette } from './shared/tokens';

type CoreView = any;

const text = (className: string, value: string): Text => h(Text, { className, textContent: value });
const box = (className: string, children?: CoreView[]): View => h(View, { className }, children);
const sentinel = () => box('sentinel');

function wrap(content: CoreView): Built {
  const s = sentinel();
  return { root: box('host', [content, s]) as CoreView, sentinel: s as CoreView, placement: 'scroll' };
}

function chain(d: ChainData): Built {
  let inner: CoreView = text('chain-label', d.label);
  for (let level = d.depth - 1; level >= 0; level--) {
    const c = level % palette.length;
    inner = box(`chain bgl-${c} bc-${c}`, [inner]);
  }
  return wrap(inner);
}

function treeNode(n: TreeNode, parentDir: TreeNode['dir'] | null): CoreView {
  const inRow = parentDir === 'row' ? ' in-row' : '';
  if (!n.children.length) return box(`leaf bg-${n.color}${inRow}`);
  const dir = n.dir === 'row' ? 'row' : 'col';
  return box(
    `tn ${dir} bgl-${n.color} bc-${n.color}${inRow}`,
    n.children.map((c) => treeNode(c, n.dir)),
  );
}

function tree(d: TreeData): Built {
  const s = sentinel();
  const frame = box('tree-frame', [treeNode(d.root, null), s]);
  return {
    root: box('host', [frame]) as CoreView,
    sentinel: s as CoreView,
    placement: 'scroll',
    mutate(name) {
      switch (name) {
        case 'shrink':
          frame.width = '80%' as any;
          break;
        case 'grow':
          frame.width = '100%' as any;
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

const tile = (t: Tile) => box(`tile bgl-${t.color}`, [text('tile-title', t.title), text('tile-sub', t.subtitle)]);

function tiles(d: TilesData): Built {
  const container = box('tiles', d.tiles.map(tile));
  const built = wrap(container);
  let inserted: CoreView[] = [];
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

function dashboard(d: DashboardData): Built {
  const header = box('dash-header', [text('dash-title', d.title), ...d.pills.map((p) => text('pill', p))]);
  const nav = box(
    'dash-nav',
    d.nav.map((n) => text(n.active ? 'nav-item active' : 'nav-item', n.label)),
  );
  const stats = box(
    'dash-stats',
    d.stats.map((s) => {
      const bars = box(
        'bars',
        s.bars.map((height) => h(View, { className: 'bar', height })),
      );
      return box('stat', [
        text('stat-label', s.label),
        text('stat-value', s.value),
        text(`stat-delta ${s.up ? 'up' : 'down'}`, s.delta),
        bars,
      ]);
    }),
  );
  const table = box('dash-table', [
    box('trow thead', d.columns.map((c) => text('cell', c))),
    ...d.rows.map((r) =>
      box('trow', [
        box('cell-name', [box(`dot bg-${r.color}`), text('cell', r.name)]),
        ...r.cells.map((c) => text('cell', c)),
      ]),
    ),
  ]);
  return wrap(box('dash', [header, nav, stats, table]));
}

function textFlow(d: TextFlowData): Built {
  const spacing = 0.5 * Screen.mainScreen.scale;
  const paras = d.paragraphs.map((p) => {
    const t = text(`para fs-${p.size}${p.bold ? ' bold' : ''}`, p.text);
    if (p.spacing) (t as any).letterSpacing = spacing;
    return t;
  });
  return wrap(box('text-flow', paras));
}

function card(c: Card): CoreView {
  const inner = box('card-inner', [
    text('card-title', c.title),
    text('card-body', c.body),
    box(
      'chips',
      c.chips.map((x) => text(`chip bgl-${c.color}`, x)),
    ),
  ]);
  const outer = box(c.variant === 1 ? `card v1 bc-${c.color}` : `card v${c.variant}`);
  if (c.variant === 2) (outer.style as any).backgroundImage = `linear-gradient(135deg, ${palette[c.color]}, ${palette[c.color2]})`;
  if (c.variant === 3) (outer.style as any).borderTopColor = palette[c.color];
  if (c.variant === 5) outer.addChild(box(`band bg-${c.color}`));
  outer.addChild(inner);
  return outer;
}

function cards(d: CardsData): Built {
  return wrap(box('cards', d.cards.map(card)));
}

interface ItemRefs {
  mark: View;
  title: Text;
  sub: Text;
  meta: Text;
  body?: Text;
  badges?: View;
}

function headRow(refs: Partial<ItemRefs>, className: string, markClass: string, withBadges: boolean): View {
  refs.mark = box(markClass);
  refs.title = text('li-title', '');
  refs.sub = text('li-sub', '');
  refs.meta = text('li-meta', '');
  const col = box('li-text', [refs.title, refs.sub]);
  if (withBadges) col.addChild((refs.badges = box('badges')));
  return box(className, [refs.mark, col, refs.meta]);
}

function createItem(type: ListItem['type']): CoreView {
  const refs: Partial<ItemRefs> = {};
  let view: View;
  if (type === 'a') view = headRow(refs, 'li-row', 'avatar', false);
  else if (type === 'b') view = headRow(refs, 'li-row', 'thumb', true);
  else {
    const head = headRow(refs, 'li-card-head', 'avatar', false);
    refs.body = text('li-body', '');
    refs.badges = box('badges');
    view = box('li-card', [head, refs.body, refs.badges]);
  }
  const cell = box('li-cell', [view]);
  (cell as any).__refs = refs;
  return cell;
}

function bindItem(view: CoreView, item: ListItem) {
  const r = (view as any).__refs as ItemRefs;
  const shape = item.type === 'b' ? 'thumb' : 'avatar';
  r.mark.className = `${shape} bg-${item.color}`;
  r.title.textContent = item.title;
  r.sub.textContent = item.subtitle;
  r.meta.textContent = item.meta;
  if (r.body) r.body.textContent = item.body;
  if (r.badges) {
    r.badges.removeChildren();
    for (const b of item.badges) r.badges.addChild(text(`badge bgl-${item.color}`, b));
  }
}

function list(d: ListData): Built {
  const ul: any = new Ul();
  ul.itemTemplates = (['a', 'b', 'c'] as const).map((key) => ({ key, createView: () => createItem(key) })) as any;
  ul.itemTemplateSelector = (item: ListItem) => item.type;
  ul.on('itemLoading', (args: any) => bindItem(args.view, d.items[args.index]));
  ul.items = d.items;
  ul.className = 'list body';
  return { root: ul as CoreView, sentinel: ul as CoreView, placement: 'fill' };
}

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
