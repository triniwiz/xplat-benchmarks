import 'dart:math' as math;

import 'package:dartnative/dartnative.dart';

import 'bench.dart';
import 'bench/generate.dart';
import 'tokens.dart';

Widget scenarioFor(ScenarioFixture f) => switch (f.fixture) {
      'nested-chain' => ChainScenario(data: f.data as ChainData),
      'tree-fanout' => TreeScenario(data: f.data as TreeData),
      'flex-wrap-tiles' => TilesScenario(data: f.data as TilesData),
      'grid-dashboard' => DashboardScenario(data: f.data as DashboardData),
      'text-flow' => TextFlowScenario(data: f.data as TextFlowData),
      _ => CardsScenario(data: f.data as CardsData),
    };

class Sentinel extends StatelessWidget {
  const Sentinel({super.key});

  @override
  Widget build(BuildContext context) => Container(key: bench.sentinelKey, height: 1, color: bg);
}

class ScenarioRoot extends StatelessWidget {
  const ScenarioRoot({super.key, required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) {
    bench.rootBuilt();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: [child, const Sentinel()],
    );
  }
}

class ChainLevel extends StatelessWidget {
  const ChainLevel({super.key, required this.data, required this.level});
  final ChainData data;
  final int level;

  @override
  Widget build(BuildContext context) {
    if (level >= data.depth) {
      return Padding(padding: const EdgeInsets.all(4), child: Text(data.label, style: ts(12, textColor)));
    }
    final c = level % palette.length;
    return Container(
      color: palette[c],
      padding: const EdgeInsets.only(left: 1),
      child: Container(
        color: paletteLight[c],
        padding: const EdgeInsets.fromLTRB(1, 1, 0, 1),
        child: ChainLevel(data: data, level: level + 1),
      ),
    );
  }
}

class ChainScenario extends StatelessWidget {
  const ChainScenario({super.key, required this.data});
  final ChainData data;

  @override
  Widget build(BuildContext context) => ScenarioRoot(child: ChainLevel(data: data, level: 0));
}

class TreeNodeView extends StatelessWidget {
  const TreeNodeView({super.key, required this.node, required this.restyled});
  final TreeNode node;
  final bool restyled;

  @override
  Widget build(BuildContext context) {
    if (node.children.isEmpty) return Container(height: 12, color: palette[node.color]);
    final row = node.dir == 'row';
    final children = [
      for (final c in node.children)
        row ? Expanded(child: TreeNodeView(node: c, restyled: restyled)) : TreeNodeView(node: c, restyled: restyled),
    ];
    return Container(
      padding: EdgeInsets.all(restyled ? 3 : 1),
      decoration: BoxDecoration(
        color: paletteLight[node.color],
        border: Border.all(color: restyled ? accent : palette[node.color]),
      ),
      child: row
          ? Row(crossAxisAlignment: CrossAxisAlignment.start, children: children)
          : Column(crossAxisAlignment: CrossAxisAlignment.stretch, mainAxisSize: MainAxisSize.min, children: children),
    );
  }
}

class TreeScenario extends StatefulWidget {
  const TreeScenario({super.key, required this.data});
  final TreeData data;

  @override
  State<TreeScenario> createState() => _TreeScenarioState();
}

class _TreeScenarioState extends State<TreeScenario> {
  bool _restyled = false;
  bool _shrunk = false;
  Widget? _tree;

  @override
  void initState() {
    super.initState();
    bench.mutator = (name) => setState(() {
          switch (name) {
            case 'shrink':
              _shrunk = true;
            case 'grow':
              _shrunk = false;
            case 'restyle':
              _restyled = true;
              _tree = null;
            case 'restore':
              _restyled = false;
              _tree = null;
          }
        });
  }

  @override
  void dispose() {
    bench.mutator = null;
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final tree = _tree ??= TreeNodeView(node: widget.data.root, restyled: _restyled);
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(flex: _shrunk ? 4 : 1, child: ScenarioRoot(child: tree)),
        if (_shrunk) const Spacer(),
      ],
    );
  }
}

class TileView extends StatelessWidget {
  const TileView({super.key, required this.tile});
  final Tile tile;

  @override
  Widget build(BuildContext context) => Container(
        width: 88,
        margin: const EdgeInsets.all(4),
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(color: paletteLight[tile.color], borderRadius: BorderRadius.circular(8)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(tile.title, style: ts(14, textColor, bold: true)),
            Text(tile.subtitle, style: ts(12, muted)),
          ],
        ),
      );
}

class TilesScenario extends StatefulWidget {
  const TilesScenario({super.key, required this.data});
  final TilesData data;

  @override
  State<TilesScenario> createState() => _TilesScenarioState();
}

class _TilesScenarioState extends State<TilesScenario> {
  bool _inserted = false;

  @override
  void initState() {
    super.initState();
    bench.mutator = (name) => setState(() => _inserted = name == 'insert');
  }

  @override
  void dispose() {
    bench.mutator = null;
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final data = widget.data;
    final tiles = _inserted ? [...data.insert, ...data.tiles] : data.tiles;
    return ScenarioRoot(
      child: Padding(
        padding: const EdgeInsets.all(4),
        child: Wrap(children: [for (final t in tiles) TileView(tile: t)]),
      ),
    );
  }
}

const _hairline = SizedBox(height: 1, child: ColoredBox(color: borderColor));

class StatCardView extends StatelessWidget {
  const StatCardView({super.key, required this.stat});
  final StatCard stat;

  @override
  Widget build(BuildContext context) => Container(
        margin: const EdgeInsets.all(4),
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: surface,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: borderColor),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(stat.label, style: ts(12, muted)),
            Text(stat.value, style: ts(20, textColor, bold: true)),
            Text(stat.delta, style: ts(12, stat.up ? positive : negative)),
            Container(
              height: 40,
              margin: const EdgeInsets.only(top: 4),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  for (final h in stat.bars)
                    Expanded(
                      child: Container(
                        height: h.toDouble(),
                        margin: const EdgeInsets.symmetric(horizontal: 1),
                        decoration: BoxDecoration(color: accent, borderRadius: BorderRadius.circular(2)),
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      );
}

class DashTableRow extends StatelessWidget {
  const DashTableRow({super.key, required this.cells, this.color, this.bold = false});
  final List<String> cells;
  final int? color;
  final bool bold;

  @override
  Widget build(BuildContext context) {
    final style = ts(12, textColor, bold: bold);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 6),
          child: Row(
            children: [
              Expanded(
                flex: 2,
                child: Row(
                  children: [
                    if (color != null)
                      Container(
                        width: 8,
                        height: 8,
                        margin: const EdgeInsets.only(right: 6),
                        decoration: BoxDecoration(color: palette[color!], borderRadius: BorderRadius.circular(4)),
                      ),
                    Flexible(child: Text(cells[0], style: style)),
                  ],
                ),
              ),
              for (final c in cells.skip(1)) Expanded(child: Text(c, style: style)),
            ],
          ),
        ),
        _hairline,
      ],
    );
  }
}

class DashboardScenario extends StatelessWidget {
  const DashboardScenario({super.key, required this.data});
  final DashboardData data;

  @override
  Widget build(BuildContext context) {
    final header = Container(
      height: 55,
      color: surface,
      padding: const EdgeInsets.symmetric(horizontal: 12),
      child: Row(
        children: [
          Expanded(child: Text(data.title, style: ts(16, textColor, bold: true))),
          for (final p in data.pills)
            Container(
              margin: const EdgeInsets.only(left: 4),
              padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
              decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(999)),
              child: Text(p, style: ts(12, textColor)),
            ),
        ],
      ),
    );
    final nav = Container(
      width: 95,
      color: surface,
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          for (final n in data.nav)
            Container(
              padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
              color: n.active ? paletteLight[4] : null,
              child: Text(n.label, style: ts(12, n.active ? accent : muted, bold: n.active)),
            ),
        ],
      ),
    );
    final stats = Padding(
      padding: const EdgeInsets.all(4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: [
          for (var i = 0; i < data.stats.length; i += 2)
            Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                for (final st in data.stats.sublist(i, math.min(i + 2, data.stats.length)))
                  Expanded(child: StatCardView(stat: st)),
              ],
            ),
        ],
      ),
    );
    final table = Padding(
      padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: [
          DashTableRow(cells: data.columns, bold: true),
          for (final r in data.rows) DashTableRow(cells: [r.name, ...r.cells], color: r.color),
        ],
      ),
    );
    return ScenarioRoot(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: [
          header,
          _hairline,
          Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              nav,
              const SizedBox(width: 1, child: ColoredBox(color: borderColor)),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  mainAxisSize: MainAxisSize.min,
                  children: [stats, table],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class TextFlowScenario extends StatelessWidget {
  const TextFlowScenario({super.key, required this.data});
  final TextFlowData data;

  @override
  Widget build(BuildContext context) {
    return ScenarioRoot(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisSize: MainAxisSize.min,
            children: [
              for (final p in data.paragraphs)
                Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Text(
                    p.text,
                    style: ts(fontSizes[p.size], textColor,
                        bold: p.bold, lh: lineHeight(fontSizes[p.size]), spacing: p.spacing == 0 ? null : 0.5),
                    maxLines: p.clamp ? 2 : null,
                    overflow: p.clamp ? TextOverflow.ellipsis : null,
                  ),
                ),
            ],
          ),
        ),
      );
  }
}

class CardView extends StatelessWidget {
  const CardView({super.key, required this.card});
  final CardItem card;

  @override
  Widget build(BuildContext context) {
    final c = card;
    final onGradient = c.variant == 2;
    final inner = Padding(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(c.title, style: ts(16, onGradient ? white : textColor, bold: true)),
          Padding(
            padding: const EdgeInsets.only(top: 4),
            child: Text(c.body, style: ts(14, onGradient ? white : muted, lh: 20)),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 8),
            child: Row(
              children: [
                for (final x in c.chips)
                  Container(
                    margin: const EdgeInsets.only(right: 4),
                    padding: const EdgeInsets.symmetric(vertical: 2, horizontal: 8),
                    decoration: BoxDecoration(color: paletteLight[c.color], borderRadius: BorderRadius.circular(999)),
                    child: Text(x, style: ts(12, textColor)),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
    const margin = EdgeInsets.all(8);
    switch (c.variant) {
      case 0:
        return Container(
          margin: margin,
          decoration: BoxDecoration(
            color: surface,
            borderRadius: BorderRadius.circular(12),
            boxShadow: const [BoxShadow(color: Color(0x33000000), offset: Offset(0, 2), blurRadius: 6)],
          ),
          child: inner,
        );
      case 1:
        return Container(
          margin: margin,
          decoration: BoxDecoration(
            color: surface,
            borderRadius: const BorderRadius.only(topLeft: Radius.circular(16), bottomRight: Radius.circular(16)),
            border: Border.all(color: palette[c.color], width: 2),
          ),
          child: inner,
        );
      case 2:
        return Container(
          margin: margin,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(8),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [palette[c.color], palette[c.color2]],
            ),
          ),
          child: inner,
        );
      case 3:
        return Container(
          margin: margin,
          color: borderColor,
          padding: const EdgeInsets.fromLTRB(1, 0, 1, 1),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(height: 4, color: palette[c.color]),
              Container(color: surface, child: inner),
            ],
          ),
        );
      case 4:
        return Padding(
          padding: margin,
          child: Opacity(
            opacity: 0.85,
            child: Transform.rotate(
              angle: -math.pi / 180,
              child: Transform.scale(
                scale: 0.98,
                child: Container(
                  decoration: BoxDecoration(
                    color: surface,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: borderColor),
                  ),
                  child: inner,
                ),
              ),
            ),
          ),
        );
      default:
        return Padding(
          padding: margin,
          child: ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Container(
              color: surface,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                mainAxisSize: MainAxisSize.min,
                children: [Container(height: 24, color: palette[c.color]), inner],
              ),
            ),
          ),
        );
    }
  }
}

class CardsScenario extends StatelessWidget {
  const CardsScenario({super.key, required this.data});
  final CardsData data;

  @override
  Widget build(BuildContext context) => ScenarioRoot(
        child: Padding(
          padding: const EdgeInsets.all(4),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisSize: MainAxisSize.min,
            children: [for (final c in data.cards) CardView(card: c)],
          ),
        ),
      );
}
