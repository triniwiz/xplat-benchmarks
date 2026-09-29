import { fnv1a, hashData } from './hash';
import { createRng, type Rng } from './prng';
import { getScenario, type FixtureId, type Params, type ScenarioId, type Size } from './scenarios';
import { paragraph, sentence, title, words } from './text';
import { palette } from './tokens';

export interface ChainData {
  depth: number;
  label: string;
}

export interface TreeNode {
  id: number;
  depth: number;
  dir: 'row' | 'column';
  color: number;
  children: TreeNode[];
}

export interface TreeData {
  root: TreeNode;
  nodeCount: number;
  leafCount: number;
}

export interface Tile {
  id: number;
  title: string;
  subtitle: string;
  color: number;
}

export interface TilesData {
  tiles: Tile[];
  insert: Tile[];
}

export interface StatCard {
  id: number;
  label: string;
  value: string;
  delta: string;
  up: boolean;
  bars: number[];
}

export interface DashboardData {
  title: string;
  pills: string[];
  nav: { id: number; label: string; active: boolean }[];
  stats: StatCard[];
  columns: [string, string, string, string];
  rows: { id: number; name: string; cells: [string, string, string]; color: number }[];
}

export interface Paragraph {
  id: number;
  size: 0 | 1 | 2 | 3;
  bold: boolean;
  spacing: 0 | 0.5;
  clamp: boolean;
  text: string;
}

export interface TextFlowData {
  paragraphs: Paragraph[];
}

export interface Card {
  id: number;
  variant: 0 | 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  chips: [string, string, string];
  color: number;
  color2: number;
}

export interface CardsData {
  cards: Card[];
}

export interface ListItem {
  id: number;
  type: 'a' | 'b' | 'c';
  title: string;
  subtitle: string;
  body: string;
  badges: string[];
  meta: string;
  color: number;
}

export interface ListData {
  items: ListItem[];
}

export interface FixtureMap {
  'nested-chain': ChainData;
  'tree-fanout': TreeData;
  'flex-wrap-tiles': TilesData;
  'grid-dashboard': DashboardData;
  'text-flow': TextFlowData;
  'styled-cards': CardsData;
  'list-scroll': ListData;
  'scroll-plain': CardsData;
}

const P = palette.length;

function chain(_rng: Rng, p: Params): ChainData {
  return { depth: p.depth, label: `depth ${p.depth}` };
}

function tree(_rng: Rng, p: Params): TreeData {
  let id = 0;
  let leaves = 0;
  const build = (depth: number): TreeNode => {
    const node: TreeNode = {
      id: id++,
      depth,
      dir: depth % 2 === 0 ? 'row' : 'column',
      color: depth % P,
      children: [],
    };
    if (depth < p.depth) {
      for (let i = 0; i < p.branching; i++) node.children.push(build(depth + 1));
    } else {
      node.color = node.id % P;
      leaves++;
    }
    return node;
  };
  const root = build(0);
  return { root, nodeCount: id, leafCount: leaves };
}

function tile(rng: Rng, id: number): Tile {
  return { id, title: title(rng, 1, 2), subtitle: words(rng, 2), color: id % P };
}

function tiles(rng: Rng, p: Params): TilesData {
  const out: Tile[] = [];
  for (let i = 0; i < p.count; i++) out.push(tile(rng, i));
  const insert: Tile[] = [];
  for (let i = 0; i < p.insert; i++) insert.push(tile(rng, p.count + i));
  return { tiles: out, insert };
}

function dashboard(rng: Rng, p: Params): DashboardData {
  const nav = [];
  for (let i = 0; i < p.nav; i++) nav.push({ id: i, label: title(rng, 1, 2), active: i === 0 });
  const stats: StatCard[] = [];
  for (let i = 0; i < p.stats; i++) {
    const up = rng.chance(0.6);
    const bars = [];
    for (let b = 0; b < 7; b++) bars.push(rng.int(4, 40));
    stats.push({
      id: i,
      label: title(rng, 1, 3),
      value: `${rng.int(1, 999)}.${rng.int(0, 9)}k`,
      delta: `${up ? '+' : '-'}${rng.int(1, 40)}%`,
      up,
      bars,
    });
  }
  const rows: DashboardData['rows'] = [];
  for (let i = 0; i < p.rows; i++) {
    rows.push({
      id: i,
      name: title(rng, 2, 3),
      cells: [`${rng.int(1, 9999)}`, `${rng.int(0, 100)}%`, rng.pick(['Active', 'Paused', 'Draft', 'Done'])],
      color: i % P,
    });
  }
  return {
    title: 'Layout dashboard',
    pills: ['Today', 'Week', 'Month'],
    nav,
    stats,
    columns: ['Name', 'Count', 'Share', 'Status'],
    rows,
  };
}

function textFlow(rng: Rng, p: Params): TextFlowData {
  const paragraphs: Paragraph[] = [];
  for (let i = 0; i < p.paragraphs; i++) {
    paragraphs.push({
      id: i,
      size: rng.int(0, 3) as Paragraph['size'],
      bold: rng.chance(0.25),
      spacing: rng.chance(0.3) ? 0.5 : 0,
      clamp: i % 5 === 4,
      text: paragraph(rng, 20, 80),
    });
  }
  return { paragraphs };
}

function card(rng: Rng, id: number): Card {
  return {
    id,
    variant: (id % 6) as Card['variant'],
    title: title(rng, 2, 4),
    body: sentence(rng, 10, 24),
    chips: [title(rng, 1, 1), title(rng, 1, 1), title(rng, 1, 1)],
    color: rng.int(0, P - 1),
    color2: rng.int(0, P - 1),
  };
}

function cards(rng: Rng, p: Params): CardsData {
  const out: Card[] = [];
  for (let i = 0; i < p.cards; i++) out.push(card(rng, i));
  return { cards: out };
}

function list(rng: Rng, p: Params): ListData {
  const items: ListItem[] = [];
  for (let i = 0; i < p.items; i++) {
    const r = rng.next();
    const type: ListItem['type'] = r < 0.5 ? 'a' : r < 0.8 ? 'b' : 'c';
    const badges: string[] = [];
    if (type !== 'a') for (let b = rng.int(1, 3); b > 0; b--) badges.push(title(rng, 1, 1));
    items.push({
      id: i,
      type,
      title: title(rng, 2, 5),
      subtitle: words(rng, rng.int(3, 8)),
      body: type === 'c' ? paragraph(rng, 15, 40) : '',
      badges,
      meta: `${rng.int(1, 59)}m`,
      color: i % P,
    });
  }
  return { items };
}

const GENERATORS: { [K in FixtureId]: (rng: Rng, p: Params) => FixtureMap[K] } = {
  'nested-chain': chain,
  'tree-fanout': tree,
  'flex-wrap-tiles': tiles,
  'grid-dashboard': dashboard,
  'text-flow': textFlow,
  'styled-cards': cards,
  'list-scroll': list,
  'scroll-plain': cards,
};

export function generateFixture<K extends FixtureId>(fixture: K, size: Size, params: Params): FixtureMap[K] {
  const rng = createRng(fnv1a(`${fixture}:${size}`));
  return GENERATORS[fixture](rng, params);
}

export interface ScenarioFixture {
  scenario: ScenarioId;
  size: Size;
  fixture: FixtureId;
  params: Params;
  data: FixtureMap[FixtureId];
  hash: string;
}

export function fixtureFor(scenario: ScenarioId, size: Size): ScenarioFixture {
  const def = getScenario(scenario);
  const params = def.sizes[size];
  const data = generateFixture(def.fixture, size, params);
  return { scenario, size, fixture: def.fixture, params, data, hash: hashData(data) };
}
