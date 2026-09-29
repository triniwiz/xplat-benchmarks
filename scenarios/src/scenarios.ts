export type Size = 'S' | 'M' | 'L';
export const SIZES: readonly Size[] = ['S', 'M', 'L'];

export type FixtureId =
  | 'nested-chain'
  | 'tree-fanout'
  | 'flex-wrap-tiles'
  | 'grid-dashboard'
  | 'text-flow'
  | 'styled-cards'
  | 'list-scroll'
  | 'scroll-plain';

export type ScenarioId =
  | FixtureId
  | 'relayout-resize'
  | 'relayout-style'
  | 'insert-remove';

export type ScenarioKind = 'mount' | 'relayout' | 'scroll';

export type Params = Record<string, number>;

export interface ScenarioDef {
  id: ScenarioId;
  kind: ScenarioKind;
  title: string;
  fixture: FixtureId;
  sizes: Record<Size, Params>;
  mutations: readonly string[];
}

const def = (d: Omit<ScenarioDef, 'mutations'> & { mutations?: readonly string[] }): ScenarioDef => ({
  mutations: [],
  ...d,
});

const TREE_SIZES = {
  S: { branching: 3, depth: 5 },
  M: { branching: 3, depth: 6 },
  L: { branching: 3, depth: 7 },
};

const TILE_SIZES = {
  S: { count: 250, insert: 100 },
  M: { count: 1000, insert: 100 },
  L: { count: 2500, insert: 100 },
};

export const SCENARIOS: readonly ScenarioDef[] = [
  def({
    id: 'nested-chain',
    kind: 'mount',
    title: 'Nested chain',
    fixture: 'nested-chain',
    sizes: { S: { depth: 32 }, M: { depth: 64 }, L: { depth: 128 } },
  }),
  def({
    id: 'tree-fanout',
    kind: 'mount',
    title: 'Tree fan-out',
    fixture: 'tree-fanout',
    sizes: TREE_SIZES,
  }),
  def({
    id: 'flex-wrap-tiles',
    kind: 'mount',
    title: 'Flex-wrap tiles',
    fixture: 'flex-wrap-tiles',
    sizes: TILE_SIZES,
  }),
  def({
    id: 'grid-dashboard',
    kind: 'mount',
    title: 'Grid dashboard',
    fixture: 'grid-dashboard',
    sizes: {
      S: { nav: 8, stats: 8, rows: 20 },
      M: { nav: 12, stats: 16, rows: 100 },
      L: { nav: 16, stats: 32, rows: 300 },
    },
  }),
  def({
    id: 'text-flow',
    kind: 'mount',
    title: 'Text flow',
    fixture: 'text-flow',
    sizes: { S: { paragraphs: 50 }, M: { paragraphs: 200 }, L: { paragraphs: 600 } },
  }),
  def({
    id: 'styled-cards',
    kind: 'mount',
    title: 'Styled cards',
    fixture: 'styled-cards',
    sizes: { S: { cards: 30 }, M: { cards: 120 }, L: { cards: 400 } },
  }),
  def({
    id: 'relayout-resize',
    kind: 'relayout',
    title: 'Relayout: root resize',
    fixture: 'tree-fanout',
    sizes: TREE_SIZES,
    mutations: ['shrink', 'grow'],
  }),
  def({
    id: 'relayout-style',
    kind: 'relayout',
    title: 'Relayout: restyle every node',
    fixture: 'tree-fanout',
    sizes: TREE_SIZES,
    mutations: ['restyle', 'restore'],
  }),
  def({
    id: 'insert-remove',
    kind: 'relayout',
    title: 'Insert / remove at head',
    fixture: 'flex-wrap-tiles',
    sizes: TILE_SIZES,
    mutations: ['insert', 'remove'],
  }),
  def({
    id: 'list-scroll',
    kind: 'scroll',
    title: 'Virtualized list',
    fixture: 'list-scroll',
    sizes: { S: { items: 500 }, M: { items: 2000 }, L: { items: 5000 } },
  }),
  def({
    id: 'scroll-plain',
    kind: 'scroll',
    title: 'Plain scroll view',
    fixture: 'scroll-plain',
    sizes: { S: { cards: 100 }, M: { cards: 300 }, L: { cards: 600 } },
  }),
];

const BY_ID = new Map(SCENARIOS.map((s) => [s.id, s]));

export function getScenario(id: ScenarioId): ScenarioDef {
  const s = BY_ID.get(id);
  if (!s) throw new Error(`Unknown scenario: ${id}`);
  return s;
}

export function isScenarioId(id: string): id is ScenarioId {
  return BY_ID.has(id as ScenarioId);
}
