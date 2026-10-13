const sizes = ['S', 'M', 'L'];

class ScenarioDef {
  const ScenarioDef(this.id, this.kind, this.title, this.fixture, this.sizes, [this.mutations = const []]);

  final String id;
  final String kind;
  final String title;
  final String fixture;
  final Map<String, Map<String, int>> sizes;
  final List<String> mutations;
}

const _treeSizes = {
  'S': {'branching': 3, 'depth': 5},
  'M': {'branching': 3, 'depth': 6},
  'L': {'branching': 3, 'depth': 7},
};

const _tileSizes = {
  'S': {'count': 250, 'insert': 100},
  'M': {'count': 1000, 'insert': 100},
  'L': {'count': 2500, 'insert': 100},
};

const scenarios = [
  ScenarioDef('nested-chain', 'mount', 'Nested chain', 'nested-chain', {
    'S': {'depth': 32},
    'M': {'depth': 64},
    'L': {'depth': 128},
  }),
  ScenarioDef('tree-fanout', 'mount', 'Tree fan-out', 'tree-fanout', _treeSizes),
  ScenarioDef('flex-wrap-tiles', 'mount', 'Flex-wrap tiles', 'flex-wrap-tiles', _tileSizes),
  ScenarioDef('grid-dashboard', 'mount', 'Grid dashboard', 'grid-dashboard', {
    'S': {'nav': 8, 'stats': 8, 'rows': 20},
    'M': {'nav': 12, 'stats': 16, 'rows': 100},
    'L': {'nav': 16, 'stats': 32, 'rows': 300},
  }),
  ScenarioDef('text-flow', 'mount', 'Text flow', 'text-flow', {
    'S': {'paragraphs': 50},
    'M': {'paragraphs': 200},
    'L': {'paragraphs': 600},
  }),
  ScenarioDef('styled-cards', 'mount', 'Styled cards', 'styled-cards', {
    'S': {'cards': 30},
    'M': {'cards': 120},
    'L': {'cards': 400},
  }),
  ScenarioDef('relayout-resize', 'relayout', 'Relayout: root resize', 'tree-fanout', _treeSizes, ['shrink', 'grow']),
  ScenarioDef('relayout-style', 'relayout', 'Relayout: restyle every node', 'tree-fanout', _treeSizes, ['restyle', 'restore']),
  ScenarioDef('insert-remove', 'relayout', 'Insert / remove at head', 'flex-wrap-tiles', _tileSizes, ['insert', 'remove']),
  ScenarioDef('list-scroll', 'scroll', 'Virtualized list', 'list-scroll', {
    'S': {'items': 500},
    'M': {'items': 2000},
    'L': {'items': 5000},
  }),
  ScenarioDef('scroll-plain', 'scroll', 'Plain scroll view', 'scroll-plain', {
    'S': {'cards': 100},
    'M': {'cards': 300},
    'L': {'cards': 600},
  }),
];

ScenarioDef getScenario(String id) =>
    scenarios.firstWhere((s) => s.id == id, orElse: () => throw ArgumentError('Unknown scenario: $id'));

bool isScenarioId(String id) => scenarios.any((s) => s.id == id);
