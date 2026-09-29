import { Screen } from '@nativescript/core';
import { useLayoutEffect, useState } from 'react';
import type { Card, CardsData, ChainData, DashboardData, TextFlowData, TilesData, TreeData, TreeNode as Node } from '../shared/generate';
import { palette } from '../shared/tokens';
import { controller } from '../store';

// Element-for-element the structure of apps/ns-core-mason/app/scenarios.ts,
// same CSS. Function components render no host element, so recursion adds no nodes.

function Sentinel() {
  return <view className="sentinel" onLayoutChanged={() => controller.sentinelLayout()} />;
}

function useMutator(fn: (name: string) => void) {
  useLayoutEffect(() => {
    controller.setMutator(fn);
    return () => controller.setMutator(null);
  }, []);
}

function ChainLevel({ data, level }: { data: ChainData; level: number }) {
  if (level < data.depth) {
    return (
      <view className={`chain bgl-${level % 8} bc-${level % 8}`}>
        <ChainLevel data={data} level={level + 1} />
      </view>
    );
  }
  return <text className="chain-label" textContent={data.label} />;
}

export function Chain({ data }: { data: ChainData }) {
  return (
    <view className="host">
      <ChainLevel data={data} level={0} />
      <Sentinel />
    </view>
  );
}

function TreeNode({ node, inRow }: { node: Node; inRow: boolean }) {
  const r = inRow ? ' in-row' : '';
  if (!node.children.length) return <view className={`leaf bg-${node.color}${r}`} />;
  return (
    <view className={`tn ${node.dir === 'row' ? 'row' : 'col'} bgl-${node.color} bc-${node.color}${r}`}>
      {node.children.map((c) => (
        <TreeNode key={c.id} node={c} inRow={node.dir === 'row'} />
      ))}
    </view>
  );
}

export function Tree({ data }: { data: TreeData }) {
  const [restyled, setRestyled] = useState(false);
  const [width, setWidth] = useState('100%');
  useMutator((name) => {
    if (name === 'shrink') setWidth('80%');
    else if (name === 'grow') setWidth('100%');
    else if (name === 'restyle') setRestyled(true);
    else if (name === 'restore') setRestyled(false);
  });
  return (
    <view className="host">
      <view className={restyled ? 'tree-frame restyled' : 'tree-frame'} width={width}>
        <TreeNode node={data.root} inRow={false} />
        <Sentinel />
      </view>
    </view>
  );
}

export function Tiles({ data }: { data: TilesData }) {
  const [inserted, setInserted] = useState(false);
  useMutator((name) => setInserted(name === 'insert'));
  const tiles = inserted ? [...data.insert, ...data.tiles] : data.tiles;
  return (
    <view className="host">
      <view className="tiles">
        {tiles.map((t) => (
          <view key={t.id} className={`tile bgl-${t.color}`}>
            <text className="tile-title" textContent={t.title} />
            <text className="tile-sub" textContent={t.subtitle} />
          </view>
        ))}
      </view>
      <Sentinel />
    </view>
  );
}

export function Dashboard({ data }: { data: DashboardData }) {
  return (
    <view className="host">
      <view className="dash">
        <view className="dash-header">
          <text className="dash-title" textContent={data.title} />
          {data.pills.map((p) => (
            <text key={p} className="pill" textContent={p} />
          ))}
        </view>
        <view className="dash-nav">
          {data.nav.map((n) => (
            <text key={n.id} className={n.active ? 'nav-item active' : 'nav-item'} textContent={n.label} />
          ))}
        </view>
        <view className="dash-stats">
          {data.stats.map((s) => (
            <view key={s.id} className="stat">
              <text className="stat-label" textContent={s.label} />
              <text className="stat-value" textContent={s.value} />
              <text className={`stat-delta ${s.up ? 'up' : 'down'}`} textContent={s.delta} />
              <view className="bars">
                {s.bars.map((h, i) => (
                  <view key={i} className="bar" height={h} />
                ))}
              </view>
            </view>
          ))}
        </view>
        <view className="dash-table">
          <view className="trow thead">
            {data.columns.map((c) => (
              <text key={c} className="cell" textContent={c} />
            ))}
          </view>
          {data.rows.map((r) => (
            <view key={r.id} className="trow">
              <view className="cell-name">
                <view className={`dot bg-${r.color}`} />
                <text className="cell" textContent={r.name} />
              </view>
              {r.cells.map((c, i) => (
                <text key={i} className="cell" textContent={c} />
              ))}
            </view>
          ))}
        </view>
      </view>
      <Sentinel />
    </view>
  );
}

/** Mason reads letterSpacing in device pixels. */
const SPACING = 0.5 * Screen.mainScreen.scale;

// No line clamp in Mason: clamp paragraphs render in full, as in ns-core-mason.
export function TextFlow({ data }: { data: TextFlowData }) {
  return (
    <view className="host">
      <view className="text-flow">
        {data.paragraphs.map((p) =>
          p.spacing ? (
            <text key={p.id} className={`para fs-${p.size}${p.bold ? ' bold' : ''}`} letterSpacing={SPACING} textContent={p.text} />
          ) : (
            <text key={p.id} className={`para fs-${p.size}${p.bold ? ' bold' : ''}`} textContent={p.text} />
          ),
        )}
      </view>
      <Sentinel />
    </view>
  );
}

function CardInner({ card }: { card: Card }) {
  return (
    <view className="card-inner">
      <text className="card-title" textContent={card.title} />
      <text className="card-body" textContent={card.body} />
      <view className="chips">
        {card.chips.map((x, i) => (
          <text key={i} className={`chip bgl-${card.color}`} textContent={x} />
        ))}
      </view>
    </view>
  );
}

const gradient = (c: Card) => `linear-gradient(135deg, ${palette[c.color]}, ${palette[c.color2]})`;

export function Cards({ data }: { data: CardsData }) {
  return (
    <view className="host">
      <view className="cards">
        {data.cards.map((c) =>
          // Inline styles only on the variants that use them.
          c.variant === 2 ? (
            <view key={c.id} className="card v2" style={{ backgroundImage: gradient(c) }}>
              <CardInner card={c} />
            </view>
          ) : c.variant === 3 ? (
            <view key={c.id} className="card v3" style={{ borderTopColor: palette[c.color] }}>
              <CardInner card={c} />
            </view>
          ) : (
            <view key={c.id} className={c.variant === 1 ? `card v1 bc-${c.color}` : `card v${c.variant}`}>
              {c.variant === 5 ? <view className={`band bg-${c.color}`} /> : null}
              <CardInner card={c} />
            </view>
          ),
        )}
      </view>
      <Sentinel />
    </view>
  );
}
