import { useEffect, useState } from '@lynx-js/react';
import type { Card, CardsData, ChainData, DashboardData, TextFlowData, TilesData, TreeData, TreeNode as Node } from './shared/generate';
import { palette } from './shared/tokens';
import { sentinelLayout, setMutator } from './bench';

function Sentinel() {
  return <view className="sentinel" bindlayoutchange={sentinelLayout} />;
}

function useMutator(fn: (name: string) => void) {
  useEffect(() => {
    setMutator(fn);
    return () => setMutator(null);
  }, []);
}

function ChainLevel({ data, level }: { data: ChainData; level: number }) {
  if (level >= data.depth) return <text className="chain-label">{data.label}</text>;
  const c = level % palette.length;
  return (
    <view className={`chain bgl-${c} bc-${c}`}>
      <ChainLevel data={data} level={level + 1} />
    </view>
  );
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
      <view className={restyled ? 'tree-frame restyled' : 'tree-frame'} style={{ width }}>
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
            <text className="tile-title">{t.title}</text>
            <text className="tile-sub">{t.subtitle}</text>
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
          <text className="dash-title">{data.title}</text>
          {data.pills.map((p) => (
            <text key={p} className="pill">
              {p}
            </text>
          ))}
        </view>
        <view className="dash-nav">
          {data.nav.map((n) => (
            <text key={n.id} className={n.active ? 'nav-item active' : 'nav-item'}>
              {n.label}
            </text>
          ))}
        </view>
        <view className="dash-stats">
          {data.stats.map((s) => (
            <view key={s.id} className="stat">
              <text className="stat-label">{s.label}</text>
              <text className="stat-value">{s.value}</text>
              <text className={`stat-delta ${s.up ? 'up' : 'down'}`}>{s.delta}</text>
              <view className="bars">
                {s.bars.map((h, i) => (
                  <view key={i} className="bar" style={{ height: `${h}px` }} />
                ))}
              </view>
            </view>
          ))}
        </view>
        <view className="dash-table">
          <view className="trow thead">
            {data.columns.map((c) => (
              <text key={c} className="cell">
                {c}
              </text>
            ))}
          </view>
          {data.rows.map((r) => (
            <view key={r.id} className="trow">
              <view className="cell-name">
                <view className={`dot bg-${r.color}`} />
                <text className="cell">{r.name}</text>
              </view>
              {r.cells.map((c, i) => (
                <text key={i} className="cell">
                  {c}
                </text>
              ))}
            </view>
          ))}
        </view>
      </view>
      <Sentinel />
    </view>
  );
}

export function TextFlow({ data }: { data: TextFlowData }) {
  return (
    <view className="host">
      <view className="text-flow">
        {data.paragraphs.map((p) => (
          <text
            key={p.id}
            className={`para fs-${p.size}${p.bold ? ' bold' : ''}${p.spacing ? ' ls' : ''}${p.clamp ? ' clamp' : ''}`}
            text-maxline={p.clamp ? '2' : undefined}
          >
            {p.text}
          </text>
        ))}
      </view>
      <Sentinel />
    </view>
  );
}

function CardView({ c }: { c: Card }) {
  const cls = c.variant === 1 ? `card v1 bc-${c.color}` : `card v${c.variant}`;
  const style =
    c.variant === 2
      ? { backgroundImage: `linear-gradient(135deg, ${palette[c.color]}, ${palette[c.color2]})` }
      : c.variant === 3
        ? { borderTopColor: palette[c.color] }
        : undefined;
  return (
    <view className={cls} style={style}>
      {c.variant === 5 ? <view className={`band bg-${c.color}`} /> : null}
      <view className="card-inner">
        <text className="card-title">{c.title}</text>
        <text className="card-body">{c.body}</text>
        <view className="chips">
          {c.chips.map((x, i) => (
            <text key={i} className={`chip bgl-${c.color}`}>
              {x}
            </text>
          ))}
        </view>
      </view>
    </view>
  );
}

export function Cards({ data }: { data: CardsData }) {
  return (
    <view className="host">
      <view className="cards">
        {data.cards.map((c) => (
          <CardView key={c.id} c={c} />
        ))}
      </view>
      <Sentinel />
    </view>
  );
}
