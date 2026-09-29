import { createContext, memo, useContext, useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from './Text';
import type { Card, CardsData, ChainData, DashboardData, TextFlowData, TilesData, TreeData, TreeNode as Node } from './shared/generate';
import { palette } from './shared/tokens';
import { sentinelLayout, setMutator } from './bench';
import { bc, bg, bgl, fs, s } from './styles';

// Element-for-element the structure of scenarios/scripts/html.ts, idiomatic
// React Native (function components, StyleSheet). Grid is flex-emulated.

function Sentinel() {
  return <View style={s.sentinel} onLayout={sentinelLayout} />;
}

function useMutator(fn: (name: string) => void) {
  useLayoutEffect(() => {
    setMutator(fn);
    return () => setMutator(null);
  }, []);
}

// ---- nested-chain

function ChainLevel({ data, level }: { data: ChainData; level: number }) {
  if (level >= data.depth) return <Text style={s.chainLabel}>{data.label}</Text>;
  const c = level % palette.length;
  return (
    <View style={[s.chain, bgl[c], bc[c]]}>
      <ChainLevel data={data} level={level + 1} />
    </View>
  );
}

export function Chain({ data }: { data: ChainData }) {
  return (
    <View>
      <ChainLevel data={data} level={0} />
      <Sentinel />
    </View>
  );
}

// ---- tree-fanout (+ relayout-resize, relayout-style)

const Restyled = createContext(false);

const TreeNode = memo(function TreeNode({ node, inRow }: { node: Node; inRow: boolean }) {
  const restyled = useContext(Restyled);
  if (!node.children.length) return <View style={[s.leaf, bg[node.color], inRow && s.inRow]} />;
  return (
    <View style={[s.tn, node.dir === 'row' && s.row, bgl[node.color], bc[node.color], restyled && s.tnRestyled, inRow && s.inRow]}>
      {node.children.map((c) => (
        <TreeNode key={c.id} node={c} inRow={node.dir === 'row'} />
      ))}
    </View>
  );
});

export function Tree({ data }: { data: TreeData }) {
  const [restyled, setRestyled] = useState(false);
  const [width, setWidth] = useState<'100%' | '80%'>('100%');
  useMutator((name) => {
    if (name === 'shrink') setWidth('80%');
    else if (name === 'grow') setWidth('100%');
    else if (name === 'restyle') setRestyled(true);
    else if (name === 'restore') setRestyled(false);
  });
  return (
    <View>
      <Restyled.Provider value={restyled}>
        <View style={{ width }}>
          <TreeNode node={data.root} inRow={false} />
          <Sentinel />
        </View>
      </Restyled.Provider>
    </View>
  );
}

// ---- flex-wrap-tiles (+ insert-remove)

export function Tiles({ data }: { data: TilesData }) {
  const [inserted, setInserted] = useState(false);
  useMutator((name) => setInserted(name === 'insert'));
  const tiles = inserted ? [...data.insert, ...data.tiles] : data.tiles;
  return (
    <View>
      <View style={s.tiles}>
        {tiles.map((t) => (
          <View key={t.id} style={[s.tile, bgl[t.color]]}>
            <Text style={s.tileTitle}>{t.title}</Text>
            <Text style={s.tileSub}>{t.subtitle}</Text>
          </View>
        ))}
      </View>
      <Sentinel />
    </View>
  );
}

// ---- grid-dashboard (flex-emulated: header row, then nav | [stats, table])

export function Dashboard({ data }: { data: DashboardData }) {
  const pairs: DashboardData['stats'][] = [];
  for (let i = 0; i < data.stats.length; i += 2) pairs.push(data.stats.slice(i, i + 2));
  return (
    <View>
      <View style={s.dashHeader}>
        <Text style={s.dashTitle}>{data.title}</Text>
        {data.pills.map((p) => (
          <Text key={p} style={s.pill}>
            {p}
          </Text>
        ))}
      </View>
      <View style={s.dashBody}>
        <View style={s.dashNav}>
          {data.nav.map((n) => (
            <Text key={n.id} style={[s.navItem, n.active && s.navActive]}>
              {n.label}
            </Text>
          ))}
        </View>
        <View style={s.dashMain}>
          <View style={s.dashStats}>
            {pairs.map((pair) => (
              <View key={pair[0].id} style={s.statRow}>
                {pair.map((st) => (
                  <View key={st.id} style={s.stat}>
                    <Text style={s.statLabel}>{st.label}</Text>
                    <Text style={s.statValue}>{st.value}</Text>
                    <Text style={[s.statDelta, st.up ? s.up : s.down]}>{st.delta}</Text>
                    <View style={s.bars}>
                      {st.bars.map((h, i) => (
                        <View key={i} style={[s.bar, { height: h }]} />
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
          <View style={s.dashTable}>
            <View style={s.trow}>
              {data.columns.map((c, i) => (
                <View key={c} style={i === 0 ? s.cellName : s.cellCol}>
                  <Text style={[s.cell, s.bold]}>{c}</Text>
                </View>
              ))}
            </View>
            {data.rows.map((r) => (
              <View key={r.id} style={s.trow}>
                <View style={s.cellName}>
                  <View style={[s.dot, bg[r.color]]} />
                  <Text style={s.cell}>{r.name}</Text>
                </View>
                {r.cells.map((c, i) => (
                  <View key={i} style={s.cellCol}>
                    <Text style={s.cell}>{c}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
      <Sentinel />
    </View>
  );
}

// ---- text-flow

export function TextFlow({ data }: { data: TextFlowData }) {
  return (
    <View>
      <View style={s.textFlow}>
        {data.paragraphs.map((p) => (
          <Text key={p.id} style={[s.para, fs[p.size], p.bold && s.bold, p.spacing ? s.ls : null]} numberOfLines={p.clamp ? 2 : undefined}>
            {p.text}
          </Text>
        ))}
      </View>
      <Sentinel />
    </View>
  );
}

// ---- styled-cards / scroll-plain

const VARIANT = [s.v0, s.v1, s.v2, s.v3, s.v4, s.v5];

function CardView({ c }: { c: Card }) {
  const white = c.variant === 2 && s.white;
  const extra =
    c.variant === 1
      ? bc[c.color]
      : c.variant === 2
        ? { backgroundImage: `linear-gradient(135deg, ${palette[c.color]}, ${palette[c.color2]})` }
        : c.variant === 3
          ? { borderTopColor: palette[c.color] }
          : null;
  return (
    <View style={[s.card, VARIANT[c.variant], extra]}>
      {c.variant === 5 ? <View style={[s.band, bg[c.color]]} /> : null}
      <View style={s.cardInner}>
        <Text style={[s.cardTitle, white]}>{c.title}</Text>
        <Text style={[s.cardBody, white]}>{c.body}</Text>
        <View style={s.chips}>
          {c.chips.map((x, i) => (
            <Text key={i} style={[s.chip, bgl[c.color]]}>
              {x}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

export function Cards({ data }: { data: CardsData }) {
  return (
    <View>
      <View style={s.cards}>
        {data.cards.map((c) => (
          <CardView key={c.id} c={c} />
        ))}
      </View>
      <Sentinel />
    </View>
  );
}
