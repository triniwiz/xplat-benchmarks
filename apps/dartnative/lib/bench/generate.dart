import 'hash.dart';
import 'prng.dart';
import 'scenarios.dart';
import 'text.dart';

const _p = 8;

class ChainData {
  ChainData(this.depth, this.label);
  final int depth;
  final String label;
  Map<String, Object?> toJson() => {'depth': depth, 'label': label};
}

class TreeNode {
  TreeNode(this.id, this.depth, this.dir, this.color);
  final int id;
  final int depth;
  final String dir;
  int color;
  final List<TreeNode> children = [];
  Map<String, Object?> toJson() => {'id': id, 'depth': depth, 'dir': dir, 'color': color, 'children': children};
}

class TreeData {
  TreeData(this.root, this.nodeCount, this.leafCount);
  final TreeNode root;
  final int nodeCount;
  final int leafCount;
  Map<String, Object?> toJson() => {'root': root, 'nodeCount': nodeCount, 'leafCount': leafCount};
}

class Tile {
  Tile(this.id, this.title, this.subtitle, this.color);
  final int id;
  final String title;
  final String subtitle;
  final int color;
  Map<String, Object?> toJson() => {'id': id, 'title': title, 'subtitle': subtitle, 'color': color};
}

class TilesData {
  TilesData(this.tiles, this.insert);
  final List<Tile> tiles;
  final List<Tile> insert;
  Map<String, Object?> toJson() => {'tiles': tiles, 'insert': insert};
}

class StatCard {
  StatCard(this.id, this.label, this.value, this.delta, this.up, this.bars);
  final int id;
  final String label;
  final String value;
  final String delta;
  final bool up;
  final List<int> bars;
  Map<String, Object?> toJson() => {'id': id, 'label': label, 'value': value, 'delta': delta, 'up': up, 'bars': bars};
}

class NavItem {
  NavItem(this.id, this.label, this.active);
  final int id;
  final String label;
  final bool active;
  Map<String, Object?> toJson() => {'id': id, 'label': label, 'active': active};
}

class DashRow {
  DashRow(this.id, this.name, this.cells, this.color);
  final int id;
  final String name;
  final List<String> cells;
  final int color;
  Map<String, Object?> toJson() => {'id': id, 'name': name, 'cells': cells, 'color': color};
}

class DashboardData {
  DashboardData(this.title, this.pills, this.nav, this.stats, this.columns, this.rows);
  final String title;
  final List<String> pills;
  final List<NavItem> nav;
  final List<StatCard> stats;
  final List<String> columns;
  final List<DashRow> rows;
  Map<String, Object?> toJson() =>
      {'title': title, 'pills': pills, 'nav': nav, 'stats': stats, 'columns': columns, 'rows': rows};
}

class Paragraph {
  Paragraph(this.id, this.size, this.bold, this.spacing, this.clamp, this.text);
  final int id;
  final int size;
  final bool bold;
  final num spacing;
  final bool clamp;
  final String text;
  Map<String, Object?> toJson() =>
      {'id': id, 'size': size, 'bold': bold, 'spacing': spacing, 'clamp': clamp, 'text': text};
}

class TextFlowData {
  TextFlowData(this.paragraphs);
  final List<Paragraph> paragraphs;
  Map<String, Object?> toJson() => {'paragraphs': paragraphs};
}

class CardItem {
  CardItem(this.id, this.variant, this.title, this.body, this.chips, this.color, this.color2);
  final int id;
  final int variant;
  final String title;
  final String body;
  final List<String> chips;
  final int color;
  final int color2;
  Map<String, Object?> toJson() =>
      {'id': id, 'variant': variant, 'title': title, 'body': body, 'chips': chips, 'color': color, 'color2': color2};
}

class CardsData {
  CardsData(this.cards);
  final List<CardItem> cards;
  Map<String, Object?> toJson() => {'cards': cards};
}

class ListItem {
  ListItem(this.id, this.type, this.title, this.subtitle, this.body, this.badges, this.meta, this.color);
  final int id;
  final String type;
  final String title;
  final String subtitle;
  final String body;
  final List<String> badges;
  final String meta;
  final int color;
  Map<String, Object?> toJson() => {
        'id': id,
        'type': type,
        'title': title,
        'subtitle': subtitle,
        'body': body,
        'badges': badges,
        'meta': meta,
        'color': color,
      };
}

class ListData {
  ListData(this.items);
  final List<ListItem> items;
  Map<String, Object?> toJson() => {'items': items};
}

ChainData _chain(Rng rng, Map<String, int> p) => ChainData(p['depth']!, 'depth ${p['depth']}');

TreeData _tree(Rng rng, Map<String, int> p) {
  var id = 0;
  var leaves = 0;
  TreeNode build(int depth) {
    final node = TreeNode(id++, depth, depth % 2 == 0 ? 'row' : 'column', depth % _p);
    if (depth < p['depth']!) {
      for (var i = 0; i < p['branching']!; i++) {
        node.children.add(build(depth + 1));
      }
    } else {
      node.color = node.id % _p;
      leaves++;
    }
    return node;
  }

  final root = build(0);
  return TreeData(root, id, leaves);
}

Tile _tile(Rng rng, int id) => Tile(id, title(rng, 1, 2), words(rng, 2), id % _p);

TilesData _tiles(Rng rng, Map<String, int> p) {
  final count = p['count']!;
  final tiles = [for (var i = 0; i < count; i++) _tile(rng, i)];
  final insert = [for (var i = 0; i < p['insert']!; i++) _tile(rng, count + i)];
  return TilesData(tiles, insert);
}

DashboardData _dashboard(Rng rng, Map<String, int> p) {
  final nav = [for (var i = 0; i < p['nav']!; i++) NavItem(i, title(rng, 1, 2), i == 0)];
  final stats = <StatCard>[];
  for (var i = 0; i < p['stats']!; i++) {
    final up = rng.chance(0.6);
    final bars = [for (var b = 0; b < 7; b++) rng.integer(4, 40)];
    final label = title(rng, 1, 3);
    final value = '${rng.integer(1, 999)}.${rng.integer(0, 9)}k';
    final delta = '${up ? '+' : '-'}${rng.integer(1, 40)}%';
    stats.add(StatCard(i, label, value, delta, up, bars));
  }
  final rows = <DashRow>[];
  for (var i = 0; i < p['rows']!; i++) {
    final name = title(rng, 2, 3);
    final cells = ['${rng.integer(1, 9999)}', '${rng.integer(0, 100)}%', rng.pick(const ['Active', 'Paused', 'Draft', 'Done'])];
    rows.add(DashRow(i, name, cells, i % _p));
  }
  return DashboardData('Layout dashboard', const ['Today', 'Week', 'Month'], nav, stats,
      const ['Name', 'Count', 'Share', 'Status'], rows);
}

TextFlowData _textFlow(Rng rng, Map<String, int> p) {
  final paragraphs = <Paragraph>[];
  for (var i = 0; i < p['paragraphs']!; i++) {
    final size = rng.integer(0, 3);
    final bold = rng.chance(0.25);
    final num spacing = rng.chance(0.3) ? 0.5 : 0;
    paragraphs.add(Paragraph(i, size, bold, spacing, i % 5 == 4, paragraph(rng, 20, 80)));
  }
  return TextFlowData(paragraphs);
}

CardItem _card(Rng rng, int id) {
  final t = title(rng, 2, 4);
  final body = sentence(rng, 10, 24);
  final chips = [title(rng, 1, 1), title(rng, 1, 1), title(rng, 1, 1)];
  final color = rng.integer(0, _p - 1);
  final color2 = rng.integer(0, _p - 1);
  return CardItem(id, id % 6, t, body, chips, color, color2);
}

CardsData _cards(Rng rng, Map<String, int> p) => CardsData([for (var i = 0; i < p['cards']!; i++) _card(rng, i)]);

ListData _list(Rng rng, Map<String, int> p) {
  final items = <ListItem>[];
  for (var i = 0; i < p['items']!; i++) {
    final r = rng.next();
    final type = r < 0.5 ? 'a' : r < 0.8 ? 'b' : 'c';
    final badges = <String>[];
    if (type != 'a') {
      for (var b = rng.integer(1, 3); b > 0; b--) {
        badges.add(title(rng, 1, 1));
      }
    }
    final t = title(rng, 2, 5);
    final subtitle = words(rng, rng.integer(3, 8));
    final body = type == 'c' ? paragraph(rng, 15, 40) : '';
    final meta = '${rng.integer(1, 59)}m';
    items.add(ListItem(i, type, t, subtitle, body, badges, meta, i % _p));
  }
  return ListData(items);
}

const Map<String, Object Function(Rng, Map<String, int>)> _generators = {
  'nested-chain': _chain,
  'tree-fanout': _tree,
  'flex-wrap-tiles': _tiles,
  'grid-dashboard': _dashboard,
  'text-flow': _textFlow,
  'styled-cards': _cards,
  'list-scroll': _list,
  'scroll-plain': _cards,
};

Object generateFixture(String fixture, String size, Map<String, int> params) =>
    _generators[fixture]!(Rng(fnv1a('$fixture:$size')), params);

class ScenarioFixture {
  ScenarioFixture(this.scenario, this.size, this.fixture, this.params, this.data, this.hash);
  final String scenario;
  final String size;
  final String fixture;
  final Map<String, int> params;
  final Object data;
  final String hash;
}

ScenarioFixture fixtureFor(String scenario, String size) {
  final def = getScenario(scenario);
  final params = def.sizes[size]!;
  final data = generateFixture(def.fixture, size, params);
  return ScenarioFixture(scenario, size, def.fixture, params, data, hashData(data));
}
