import type {
  Card,
  CardsData,
  ChainData,
  DashboardData,
  FixtureMap,
  ListData,
  ListItem,
  TextFlowData,
  TilesData,
  TreeData,
  TreeNode,
} from '../src/generate';
import type { FixtureId } from '../src/scenarios';
import { palette } from '../src/tokens';

// Browser reference renderer: the visual ground truth each app must match.
// Structure here is the structure spec.md describes (element for element).

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function chain(d: ChainData): string {
  let html = `<span class="chain-label">${esc(d.label)}</span>`;
  for (let level = d.depth - 1; level >= 0; level--) {
    const c = level % palette.length;
    html = `<div class="chain bgl-${c} bc-${c}">${html}</div>`;
  }
  return html;
}

function treeNode(n: TreeNode, parentDir: TreeNode['dir'] | null): string {
  const inRow = parentDir === 'row' ? ' in-row' : '';
  if (!n.children.length) return `<div class="leaf bg-${n.color}${inRow}"></div>`;
  const dir = n.dir === 'row' ? 'row' : 'col';
  const kids = n.children.map((c) => treeNode(c, n.dir)).join('');
  return `<div class="tn ${dir} bgl-${n.color} bc-${n.color}${inRow}">${kids}</div>`;
}

function tree(d: TreeData): string {
  return `<div class="tree-frame">${treeNode(d.root, null)}</div>`;
}

function tiles(d: TilesData): string {
  const t = d.tiles
    .map(
      (x) =>
        `<div class="tile bgl-${x.color}"><span class="tile-title">${esc(x.title)}</span><span class="tile-sub">${esc(x.subtitle)}</span></div>`,
    )
    .join('');
  return `<div class="tiles">${t}</div>`;
}

function dashboard(d: DashboardData): string {
  const pills = d.pills.map((p) => `<span class="pill">${esc(p)}</span>`).join('');
  const nav = d.nav
    .map((n) => `<span class="nav-item${n.active ? ' active' : ''}">${esc(n.label)}</span>`)
    .join('');
  const stats = d.stats
    .map((s) => {
      const bars = s.bars.map((h) => `<div class="bar" style="height:${h}px"></div>`).join('');
      return (
        `<div class="stat"><span class="stat-label">${esc(s.label)}</span>` +
        `<span class="stat-value">${esc(s.value)}</span>` +
        `<span class="stat-delta ${s.up ? 'up' : 'down'}">${esc(s.delta)}</span>` +
        `<div class="bars">${bars}</div></div>`
      );
    })
    .join('');
  const head = `<div class="trow thead">${d.columns.map((c) => `<span class="cell">${esc(c)}</span>`).join('')}</div>`;
  const rows = d.rows
    .map(
      (r) =>
        `<div class="trow"><div class="cell-name"><div class="dot bg-${r.color}"></div><span class="cell">${esc(r.name)}</span></div>` +
        r.cells.map((c) => `<span class="cell">${esc(c)}</span>`).join('') +
        `</div>`,
    )
    .join('');
  return (
    `<div class="dash">` +
    `<div class="dash-header"><span class="dash-title">${esc(d.title)}</span>${pills}</div>` +
    `<div class="dash-nav">${nav}</div>` +
    `<div class="dash-stats">${stats}</div>` +
    `<div class="dash-table">${head}${rows}</div>` +
    `</div>`
  );
}

function textFlow(d: TextFlowData): string {
  const ps = d.paragraphs
    .map((p) => {
      const cls = ['para', `fs-${p.size}`, p.bold && 'bold', p.spacing && 'ls', p.clamp && 'clamp'].filter(Boolean);
      return `<p class="${cls.join(' ')}">${esc(p.text)}</p>`;
    })
    .join('');
  return `<div class="text-flow">${ps}</div>`;
}

function card(c: Card): string {
  const cls = c.variant === 1 ? `card v1 bc-${c.color}` : `card v${c.variant}`;
  // v2 is a per-card gradient; v3 colours only the top border.
  const style =
    c.variant === 2
      ? ` style="background-image:linear-gradient(135deg, ${palette[c.color]}, ${palette[c.color2]})"`
      : c.variant === 3
        ? ` style="border-top-color:${palette[c.color]}"`
        : '';
  const band = c.variant === 5 ? `<div class="band bg-${c.color}"></div>` : '';
  const chips = c.chips.map((x) => `<span class="chip bgl-${c.color}">${esc(x)}</span>`).join('');
  return (
    `<div class="${cls}"${style}>${band}<div class="card-inner">` +
    `<span class="card-title">${esc(c.title)}</span>` +
    `<span class="card-body">${esc(c.body)}</span>` +
    `<div class="chips">${chips}</div>` +
    `</div></div>`
  );
}

function cards(d: CardsData): string {
  return `<div class="cards">${d.cards.map(card).join('')}</div>`;
}

function badges(item: ListItem): string {
  if (!item.badges.length) return '';
  return `<div class="badges">${item.badges.map((b) => `<span class="badge bgl-${item.color}">${esc(b)}</span>`).join('')}</div>`;
}

function listItem(item: ListItem): string {
  const text = `<div class="li-text"><span class="li-title">${esc(item.title)}</span><span class="li-sub">${esc(item.subtitle)}</span>`;
  const meta = `<span class="li-meta">${esc(item.meta)}</span>`;
  switch (item.type) {
    case 'a':
      return `<div class="li-row"><div class="avatar bg-${item.color}"></div>${text}</div>${meta}</div>`;
    case 'b':
      return `<div class="li-row"><div class="thumb bg-${item.color}"></div>${text}${badges(item)}</div>${meta}</div>`;
    case 'c':
      return (
        `<div class="li-card"><div class="li-card-head"><div class="avatar bg-${item.color}"></div>${text}</div>${meta}</div>` +
        `<span class="li-body">${esc(item.body)}</span>${badges(item)}</div>`
      );
  }
}

function list(d: ListData): string {
  return `<div class="list">${d.items.map(listItem).join('')}</div>`;
}

const RENDERERS: { [K in FixtureId]: (d: FixtureMap[K]) => string } = {
  'nested-chain': chain,
  'tree-fanout': tree,
  'flex-wrap-tiles': tiles,
  'grid-dashboard': dashboard,
  'text-flow': textFlow,
  'styled-cards': cards,
  'list-scroll': list,
  'scroll-plain': cards,
};

export function renderFixture<K extends FixtureId>(fixture: K, data: FixtureMap[K]): string {
  return RENDERERS[fixture](data);
}

/** Number of elements the reference tree contains (excluding the host). */
export function countElements(html: string): number {
  return (html.match(/<(div|span|p)[\s>]/g) ?? []).length;
}

export function page(title: string, body: string): string {
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><link rel="stylesheet" href="styles.css"></head>
<body><div class="host">${body}</div></body></html>
`;
}
