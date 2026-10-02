import { Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';
import type { CardsData, ChainData, DashboardData, TextFlowData, TilesData, TreeData, TreeNode } from '../shared/generate';
import { sentinelLayout, setMutator } from './bench.ts';


function useMutator(fn: (name: string) => void) {
  setMutator(fn);
  inject(DestroyRef).onDestroy(() => setMutator(null));
}

@Component({
  selector: 'bench-chain-level',
  imports: [View, Text],
  styleUrls: ['./bench.css', '../shared/palette.css'],
  styles: `:host { display: contents; }`,
  template: `
    @if (level() < data().depth) {
      <view class="chain bgl-{{ level() % 8 }} bc-{{ level() % 8 }}">
        <bench-chain-level [data]="data()" [level]="level() + 1" />
      </view>
    } @else {
      <text class="chain-label" [allowFontScaling]="false">{{ data().label }}</text>
    }
  `,
})
export class ChainLevel {
  readonly data = input.required<ChainData>();
  readonly level = input(0);
}

@Component({
  selector: 'bench-chain',
  imports: [View, ChainLevel],
  styleUrls: ['./bench.css', '../shared/palette.css'],
  template: `
    <view>
      <bench-chain-level [data]="data()" [level]="0" />
      <view class="sentinel" (layout)="layout()"></view>
    </view>
  `,
})
export class Chain {
  readonly data = input.required<ChainData>();
  layout() {
    sentinelLayout();
  }
}

export const restyled = signal(false);

@Component({
  selector: 'bench-tree-node',
  imports: [View],
  styleUrls: ['./bench.css', '../shared/palette.css'],
  styles: `:host { display: contents; }`,
  template: `
    @if (node().children.length) {
      <view class="tn bgl-{{ node().color }} bc-{{ node().color }}" [class.row]="node().dir === 'row'" [class.tn-restyled]="restyled()" [class.in-row]="inRow()">
        @for (c of node().children; track c.id) {
          <bench-tree-node [node]="c" [inRow]="node().dir === 'row'" />
        }
      </view>
    } @else {
      <view class="leaf bg-{{ node().color }}" [class.in-row]="inRow()"></view>
    }
  `,
})
export class TreeNodeView {
  readonly node = input.required<TreeNode>();
  readonly inRow = input(false);
  readonly restyled = restyled;
}

@Component({
  selector: 'bench-tree',
  imports: [View, TreeNodeView],
  styleUrls: ['./bench.css', '../shared/palette.css'],
  template: `
    <view>
      <view [style]="{ width: width() }">
        <bench-tree-node [node]="data().root" [inRow]="false" />
        <view class="sentinel" (layout)="layout()"></view>
      </view>
    </view>
  `,
})
export class Tree {
  readonly data = input.required<TreeData>();
  readonly width = signal('100%');
  constructor() {
    restyled.set(false);
    useMutator((name) => {
      if (name === 'shrink') this.width.set('80%');
      else if (name === 'grow') this.width.set('100%');
      else if (name === 'restyle') restyled.set(true);
      else if (name === 'restore') restyled.set(false);
    });
  }
  layout() {
    sentinelLayout();
  }
}

@Component({
  selector: 'bench-tiles',
  imports: [View, Text],
  styleUrls: ['./bench.css', '../shared/palette.css'],
  template: `
    <view>
      <view class="tiles">
        @for (t of tiles(); track t.id) {
          <view class="tile bgl-{{ t.color }}">
            <text class="tile-title" [allowFontScaling]="false">{{ t.title }}</text>
            <text class="tile-sub" [allowFontScaling]="false">{{ t.subtitle }}</text>
          </view>
        }
      </view>
      <view class="sentinel" (layout)="layout()"></view>
    </view>
  `,
})
export class Tiles {
  readonly data = input.required<TilesData>();
  readonly inserted = signal(false);
  readonly tiles = computed(() => (this.inserted() ? [...this.data().insert, ...this.data().tiles] : this.data().tiles));
  constructor() {
    useMutator((name) => this.inserted.set(name === 'insert'));
  }
  layout() {
    sentinelLayout();
  }
}

@Component({
  selector: 'bench-dashboard',
  imports: [View, Text],
  styleUrls: ['./bench.css', '../shared/palette.css'],
  template: `
    <view>
      <view class="dash-header">
        <text class="dash-title" [allowFontScaling]="false">{{ data().title }}</text>
        @for (p of data().pills; track p) {
          <text class="pill" [allowFontScaling]="false">{{ p }}</text>
        }
      </view>
      <view class="dash-body">
        <view class="dash-nav">
          @for (n of data().nav; track n.id) {
            <text class="nav-item" [class.nav-active]="n.active" [allowFontScaling]="false">{{ n.label }}</text>
          }
        </view>
        <view class="dash-main">
          <view class="dash-stats">
            @for (pair of pairs(); track pair[0].id) {
              <view class="stat-row">
                @for (st of pair; track st.id) {
                  <view class="stat">
                    <text class="stat-label" [allowFontScaling]="false">{{ st.label }}</text>
                    <text class="stat-value" [allowFontScaling]="false">{{ st.value }}</text>
                    <text class="stat-delta" [class.up]="st.up" [class.down]="!st.up" [allowFontScaling]="false">{{ st.delta }}</text>
                    <view class="bars">
                      @for (h of st.bars; track $index) {
                        <view class="bar" [style]="{ height: h }"></view>
                      }
                    </view>
                  </view>
                }
              </view>
            }
          </view>
          <view class="dash-table">
            <view class="trow">
              @for (c of data().columns; track c; let i = $index) {
                <view [class.cell-name]="i === 0" [class.cell-col]="i !== 0">
                  <text class="cell bold" [allowFontScaling]="false">{{ c }}</text>
                </view>
              }
            </view>
            @for (r of data().rows; track r.id) {
              <view class="trow">
                <view class="cell-name">
                  <view class="dot bg-{{ r.color }}"></view>
                  <text class="cell" [allowFontScaling]="false">{{ r.name }}</text>
                </view>
                @for (c of r.cells; track $index) {
                  <view class="cell-col">
                    <text class="cell" [allowFontScaling]="false">{{ c }}</text>
                  </view>
                }
              </view>
            }
          </view>
        </view>
      </view>
      <view class="sentinel" (layout)="layout()"></view>
    </view>
  `,
})
export class Dashboard {
  readonly data = input.required<DashboardData>();
  readonly pairs = computed(() => {
    const stats = this.data().stats;
    const out: DashboardData['stats'][] = [];
    for (let i = 0; i < stats.length; i += 2) out.push(stats.slice(i, i + 2));
    return out;
  });
  layout() {
    sentinelLayout();
  }
}

@Component({
  selector: 'bench-text-flow',
  imports: [View, Text],
  styleUrls: ['./bench.css', '../shared/palette.css'],
  template: `
    <view>
      <view class="text-flow">
        @for (p of data().paragraphs; track p.id) {
          <text class="para fs-{{ p.size }}" [class.bold]="p.bold" [class.ls]="!!p.spacing" [numberOfLines]="p.clamp ? 2 : undefined" [allowFontScaling]="false">{{ p.text }}</text>
        }
      </view>
      <view class="sentinel" (layout)="layout()"></view>
    </view>
  `,
})
export class TextFlow {
  readonly data = input.required<TextFlowData>();
  layout() {
    sentinelLayout();
  }
}

@Component({
  selector: 'bench-cards',
  imports: [View, Text],
  styleUrls: ['./bench.css', '../shared/palette.css'],
  template: `
    <view>
      <view class="cards">
        @for (c of data().cards; track c.id) {
          <view class="card v{{ c.variant }} {{ extra(c) }}">
            @if (c.variant === 5) {
              <view class="band bg-{{ c.color }}"></view>
            }
            <view class="card-inner">
              <text class="card-title" [class.white]="c.variant === 2" [allowFontScaling]="false">{{ c.title }}</text>
              <text class="card-body" [class.white]="c.variant === 2" [allowFontScaling]="false">{{ c.body }}</text>
              <view class="chips">
                @for (x of c.chips; track $index) {
                  <text class="chip bgl-{{ c.color }}" [allowFontScaling]="false">{{ x }}</text>
                }
              </view>
            </view>
          </view>
        }
      </view>
      <view class="sentinel" (layout)="layout()"></view>
    </view>
  `,
})
export class Cards {
  readonly data = input.required<CardsData>();
  extra(c: CardsData['cards'][number]): string {
    if (c.variant === 1) return `bc-${c.color}`;
    if (c.variant === 2) return `grad-${c.color}-${c.color2}`;
    if (c.variant === 3) return `btc-${c.color}`;
    return '';
  }
  layout() {
    sentinelLayout();
  }
}
