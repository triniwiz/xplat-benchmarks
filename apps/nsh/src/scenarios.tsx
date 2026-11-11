import { computed, Text, View, type JSX } from 'nsh';
import { sentinelLayout } from './bench';
import type { Card, CardsData, ChainData, DashboardData, TextFlowData, TilesData, TreeData, TreeNode as Node } from './shared/generate';
import { palette } from './shared/tokens';
import { frameWidth, inserted, restyled } from './store';
import { bc, bg, bgl, fs, s } from './styles';

function Sentinel() {
  return <View style={s.sentinel} onLayout={sentinelLayout} />;
}

function ChainLevel(props: { data: ChainData; level: number }): JSX.Element {
  if (props.level >= props.data.depth) return <Text style={s.chainLabel}>{props.data.label}</Text>;
  const c = props.level % palette.length;
  return (
    <View style={[s.chain, bgl[c], bc[c]]}>
      <ChainLevel data={props.data} level={props.level + 1} />
    </View>
  );
}

export function Chain(props: { data: ChainData }) {
  return (
    <View>
      <ChainLevel data={props.data} level={0} />
      <Sentinel />
    </View>
  );
}

function TreeNode(props: { node: Node; inRow: boolean }): JSX.Element {
  const n = props.node;
  const inRow = props.inRow && s.inRow;
  if (!n.children.length) return <View style={[s.leaf, bg[n.color], inRow]} />;
  const row = n.dir === 'row';
  return (
    <View style={[s.tn, row && s.row, bgl[n.color], bc[n.color], inRow, restyled() && s.tnRestyled]}>
      {n.children.map((c) => (
        <TreeNode node={c} inRow={row} />
      ))}
    </View>
  );
}

export function Tree(props: { data: TreeData }) {
  return (
    <View>
      <View style={{ width: frameWidth() }}>
        <TreeNode node={props.data.root} inRow={false} />
        <Sentinel />
      </View>
    </View>
  );
}

export function Tiles(props: { data: TilesData }) {
  const tiles = computed(() => (inserted() ? [...props.data.insert, ...props.data.tiles] : props.data.tiles));
  return (
    <View>
      <View style={s.tiles}>
        <Each of={tiles()}>
          {(t) => (
            <View style={[s.tile, bgl[t().color]]}>
              <Text style={s.tileTitle}>{t().title}</Text>
              <Text style={s.tileSub}>{t().subtitle}</Text>
            </View>
          )}
        </Each>
      </View>
      <Sentinel />
    </View>
  );
}

export function Dashboard(props: { data: DashboardData }) {
  const d = props.data;
  return (
    <View>
      <View style={s.dash}>
        <View style={s.dashHeader}>
          <Text style={s.dashTitle}>{d.title}</Text>
          {d.pills.map((p) => (
            <Text style={s.pill}>{p}</Text>
          ))}
        </View>
        <View style={s.dashNav}>
          {d.nav.map((n) => (
            <Text style={[s.navItem, n.active && s.navActive]}>{n.label}</Text>
          ))}
        </View>
        <View style={s.dashStats}>
          {d.stats.map((st) => (
            <View style={s.stat}>
              <Text style={s.statLabel}>{st.label}</Text>
              <Text style={s.statValue}>{st.value}</Text>
              <Text style={[s.statDelta, st.up ? s.up : s.down]}>{st.delta}</Text>
              <View style={s.bars}>
                {st.bars.map((h) => (
                  <View style={[s.bar, { height: h }]} />
                ))}
              </View>
            </View>
          ))}
        </View>
        <View style={s.dashTable}>
          <View style={s.trow}>
            {d.columns.map((c) => (
              <Text style={[s.cell, s.bold]}>{c}</Text>
            ))}
          </View>
          {d.rows.map((r) => (
            <View style={s.trow}>
              <View style={s.cellName}>
                <View style={[s.dot, bg[r.color]]} />
                <Text style={s.cell}>{r.name}</Text>
              </View>
              {r.cells.map((c) => (
                <Text style={s.cell}>{c}</Text>
              ))}
            </View>
          ))}
        </View>
      </View>
      <Sentinel />
    </View>
  );
}

export function TextFlow(props: { data: TextFlowData }) {
  return (
    <View>
      <View style={s.textFlow}>
        {props.data.paragraphs.map((p) => (
          <Text style={[s.para, fs[p.size], p.bold && s.bold, p.spacing ? s.ls : null, p.clamp && s.clamp]}>{p.text}</Text>
        ))}
      </View>
      <Sentinel />
    </View>
  );
}

const VARIANTS = [
  (c: Card) => [s.card, s.v0],
  (c: Card) => [s.card, s.v1, bc[c.color]],
  (c: Card) => [s.card, s.v2, { backgroundImage: `linear-gradient(135deg, ${palette[c.color]}, ${palette[c.color2]})` }],
  (c: Card) => [s.card, s.v3, { borderTopColor: palette[c.color] }],
  (c: Card) => [s.card, s.v4],
  (c: Card) => [s.card, s.v5],
];

function CardView(props: { card: Card }) {
  const c = props.card;
  const white = c.variant === 2 && s.white;
  return (
    <View style={VARIANTS[c.variant](c)}>
      {c.variant === 5 ? <View style={[s.band, bg[c.color]]} /> : null}
      <View style={s.cardInner}>
        <Text style={[s.cardTitle, white]}>{c.title}</Text>
        <Text style={[s.cardBody, white]}>{c.body}</Text>
        <View style={s.chips}>
          {c.chips.map((x) => (
            <Text style={[s.chip, bgl[c.color]]}>{x}</Text>
          ))}
        </View>
      </View>
    </View>
  );
}

export function Cards(props: { data: CardsData }) {
  return (
    <View>
      <View style={s.cards}>
        {props.data.cards.map((c) => (
          <CardView card={c} />
        ))}
      </View>
      <Sentinel />
    </View>
  );
}
