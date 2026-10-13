import 'package:dartnative/dartnative.dart';

import 'bench.dart';
import 'bench/generate.dart';
import 'tokens.dart';

class Badges extends StatelessWidget {
  const Badges({super.key, required this.item});
  final ListItem item;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(top: 4),
        child: Row(
          children: [
            for (final b in item.badges)
              Container(
                margin: const EdgeInsets.only(right: 4),
                padding: const EdgeInsets.symmetric(vertical: 2, horizontal: 6),
                decoration: BoxDecoration(color: paletteLight[item.color], borderRadius: BorderRadius.circular(4)),
                child: Text(b, style: ts(10, textColor)),
              ),
          ],
        ),
      );
}

class TextCol extends StatelessWidget {
  const TextCol({super.key, required this.item, required this.badges});
  final ListItem item;
  final bool badges;

  @override
  Widget build(BuildContext context) => Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(item.title, style: ts(14, textColor, bold: true)),
          Text(item.subtitle, style: ts(12, muted)),
          if (badges) Badges(item: item),
        ],
      );
}

Widget _swatch(ListItem item, double size, double radius) => Container(
      width: size,
      height: size,
      margin: const EdgeInsets.only(right: 12),
      decoration: BoxDecoration(color: palette[item.color], borderRadius: BorderRadius.circular(radius)),
    );

Widget _meta(ListItem item) =>
    Padding(padding: const EdgeInsets.only(left: 8), child: Text(item.meta, style: ts(12, muted)));

class ItemView extends StatelessWidget {
  const ItemView({super.key, required this.item});
  final ListItem item;

  @override
  Widget build(BuildContext context) {
    if (item.type != 'c') {
      final b = item.type == 'b';
      return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            color: surface,
            padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
            child: Row(
              children: [b ? _swatch(item, 56, 8) : _swatch(item, 32, 16), Expanded(child: TextCol(item: item, badges: b)), _meta(item)],
            ),
          ),
          const SizedBox(height: 1, child: ColoredBox(color: borderColor)),
        ],
      );
    }
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(children: [_swatch(item, 32, 16), Expanded(child: TextCol(item: item, badges: false)), _meta(item)]),
          Padding(
            padding: const EdgeInsets.only(top: 8),
            child: Text(item.body, style: ts(14, textColor, lh: 20)),
          ),
          Badges(item: item),
        ],
      ),
    );
  }
}

class BenchList extends StatelessWidget {
  const BenchList({super.key, required this.data});
  final ListData data;

  @override
  Widget build(BuildContext context) {
    bench.rootBuilt();
    return FastList(
      key: bench.sentinelKey,
      itemCount: data.items.length,
      itemBuilder: (context, i) => ItemView(item: data.items[i]),
    );
  }
}
