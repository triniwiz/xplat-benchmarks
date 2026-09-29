import { Screen } from '@nativescript/core';
import { For, Show, createMemo, createSignal, onCleanup } from 'solid-js';
import type { Card, CardsData, ChainData, DashboardData, TextFlowData, TilesData, TreeData, TreeNode as Node } from '../shared/generate';
import { palette } from '../shared/tokens';
import { controller } from '../store';

function Sentinel() {
  return <view class="sentinel" on:layoutChanged={() => controller.sentinelLayout()} />;
}

function useMutator(fn: (name: string) => void) {
  controller.setMutator(fn);
  onCleanup(() => controller.setMutator(null));
}

function ChainLevel(props: { data: ChainData; level: number }) {
  return (
    <Show when={props.level < props.data.depth} fallback={<text class="chain-label" textContent={props.data.label} />}>
      <view class={`chain bgl-${props.level % 8} bc-${props.level % 8}`}>
        <ChainLevel data={props.data} level={props.level + 1} />
      </view>
    </Show>
  );
}

export function Chain(props: { data: ChainData }) {
  return (
    <view class="host">
      <ChainLevel data={props.data} level={0} />
      <Sentinel />
    </view>
  );
}

function TreeNode(props: { node: Node; inRow: boolean }) {
  const r = props.inRow ? ' in-row' : '';
  const n = props.node;
  if (!n.children.length) return <view class={`leaf bg-${n.color}${r}`} />;
  return (
    <view class={`tn ${n.dir === 'row' ? 'row' : 'col'} bgl-${n.color} bc-${n.color}${r}`}>
      <For each={n.children}>{(c) => <TreeNode node={c} inRow={n.dir === 'row'} />}</For>
    </view>
  );
}

export function Tree(props: { data: TreeData }) {
  const [restyled, setRestyled] = createSignal(false);
  const [width, setWidth] = createSignal('100%');
  useMutator((name) => {
    if (name === 'shrink') setWidth('80%');
    else if (name === 'grow') setWidth('100%');
    else if (name === 'restyle') setRestyled(true);
    else if (name === 'restore') setRestyled(false);
  });
  return (
    <view class="host">
      <view class={restyled() ? 'tree-frame restyled' : 'tree-frame'} width={width()}>
        <TreeNode node={props.data.root} inRow={false} />
        <Sentinel />
      </view>
    </view>
  );
}

export function Tiles(props: { data: TilesData }) {
  const [inserted, setInserted] = createSignal(false);
  useMutator((name) => setInserted(name === 'insert'));
  const tiles = createMemo(() => (inserted() ? [...props.data.insert, ...props.data.tiles] : props.data.tiles));
  return (
    <view class="host">
      <view class="tiles">
        <For each={tiles()}>
          {(t) => (
            <view class={`tile bgl-${t.color}`}>
              <text class="tile-title" textContent={t.title} />
              <text class="tile-sub" textContent={t.subtitle} />
            </view>
          )}
        </For>
      </view>
      <Sentinel />
    </view>
  );
}

export function Dashboard(props: { data: DashboardData }) {
  const d = props.data;
  return (
    <view class="host">
      <view class="dash">
        <view class="dash-header">
          <text class="dash-title" textContent={d.title} />
          <For each={d.pills}>{(p) => <text class="pill" textContent={p} />}</For>
        </view>
        <view class="dash-nav">
          <For each={d.nav}>{(n) => <text class={n.active ? 'nav-item active' : 'nav-item'} textContent={n.label} />}</For>
        </view>
        <view class="dash-stats">
          <For each={d.stats}>
            {(s) => (
              <view class="stat">
                <text class="stat-label" textContent={s.label} />
                <text class="stat-value" textContent={s.value} />
                <text class={`stat-delta ${s.up ? 'up' : 'down'}`} textContent={s.delta} />
                <view class="bars">
                  <For each={s.bars}>{(h) => <view class="bar" height={h} />}</For>
                </view>
              </view>
            )}
          </For>
        </view>
        <view class="dash-table">
          <view class="trow thead">
            <For each={d.columns}>{(c) => <text class="cell" textContent={c} />}</For>
          </view>
          <For each={d.rows}>
            {(r) => (
              <view class="trow">
                <view class="cell-name">
                  <view class={`dot bg-${r.color}`} />
                  <text class="cell" textContent={r.name} />
                </view>
                <For each={r.cells}>{(c) => <text class="cell" textContent={c} />}</For>
              </view>
            )}
          </For>
        </view>
      </view>
      <Sentinel />
    </view>
  );
}

const SPACING = 0.5 * Screen.mainScreen.scale;

export function TextFlow(props: { data: TextFlowData }) {
  return (
    <view class="host">
      <view class="text-flow">
        <For each={props.data.paragraphs}>
          {(p) =>
            p.spacing ? (
              <text class={`para fs-${p.size}${p.bold ? ' bold' : ''}`} letterSpacing={SPACING} textContent={p.text} />
            ) : (
              <text class={`para fs-${p.size}${p.bold ? ' bold' : ''}`} textContent={p.text} />
            )
          }
        </For>
      </view>
      <Sentinel />
    </view>
  );
}

function CardInner(props: { card: Card }) {
  const c = props.card;
  return (
    <view class="card-inner">
      <text class="card-title" textContent={c.title} />
      <text class="card-body" textContent={c.body} />
      <view class="chips">
        <For each={c.chips}>{(x) => <text class={`chip bgl-${c.color}`} textContent={x} />}</For>
      </view>
    </view>
  );
}

const gradient = (c: Card) => `linear-gradient(135deg, ${palette[c.color]}, ${palette[c.color2]})`;

export function Cards(props: { data: CardsData }) {
  return (
    <view class="host">
      <view class="cards">
        <For each={props.data.cards}>
          {(c) =>
            c.variant === 2 ? (
              <view class="card v2" style={{ backgroundImage: gradient(c) }}>
                <CardInner card={c} />
              </view>
            ) : c.variant === 3 ? (
              <view class="card v3" style={{ borderTopColor: palette[c.color] }}>
                <CardInner card={c} />
              </view>
            ) : (
              <view class={c.variant === 1 ? `card v1 bc-${c.color}` : `card v${c.variant}`}>
                {c.variant === 5 ? <view class={`band bg-${c.color}`} /> : null}
                <CardInner card={c} />
              </view>
            )
          }
        </For>
      </view>
      <Sentinel />
    </view>
  );
}
