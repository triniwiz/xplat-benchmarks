import { ChangeDetectionStrategy, Component, DestroyRef, NO_ERRORS_SCHEMA, computed, inject, input, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Screen } from '@nativescript/core';
import type { Card, CardsData, ChainData, DashboardData, TextFlowData, TilesData, TreeData } from '../shared/generate';
import { palette } from '../shared/tokens';
import { BenchService } from './bench.service';

// One OnPush component per scenario, element-for-element the structure of the
// Mason builders in apps/ns-core-mason/app/scenarios.ts, with the same CSS.
// The component host (a Mason box via installMasonKit componentHosts) carries
// class="host", so host > [content, sentinel] matches ns-core-mason.
// Trees recurse through ng-template rather than components, so no extra
// component-host nodes are added per tree node.

const SENTINEL = `<View class="sentinel" (layoutChanged)="bench.sentinelLayout()"></View>`;

function useMutator(fn: (name: string) => void) {
  const bench = inject(BenchService);
  bench.setMutator(fn);
  inject(DestroyRef).onDestroy(() => bench.setMutator(null));
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
  selector: 'bench-chain',
  imports: [NgTemplateOutlet],
  template: `
    <ng-template #level let-l>
      @if (l < data().depth) {
        <View class="chain bgl-{{ l % 8 }} bc-{{ l % 8 }}">
          <ng-container *ngTemplateOutlet="level; context: { $implicit: l + 1 }" />
        </View>
      } @else {
        <Text class="chain-label" [textContent]="data().label"></Text>
      }
    </ng-template>
    <ng-container *ngTemplateOutlet="level; context: { $implicit: 0 }" />
    ${SENTINEL}
  `,
})
export class ChainComponent {
  readonly bench = inject(BenchService);
  readonly data = input.required<ChainData>();
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
  selector: 'bench-tree',
  imports: [NgTemplateOutlet],
  template: `
    <ng-template #node let-n let-inRow="inRow">
      @if (n.children.length) {
        <View class="tn {{ n.dir === 'row' ? 'row' : 'col' }} bgl-{{ n.color }} bc-{{ n.color }}" [class.in-row]="inRow">
          @for (c of n.children; track c.id) {
            <ng-container *ngTemplateOutlet="node; context: { $implicit: c, inRow: n.dir === 'row' }" />
          }
        </View>
      } @else {
        <View class="leaf bg-{{ n.color }}" [class.in-row]="inRow"></View>
      }
    </ng-template>
    <View class="tree-frame" [class.restyled]="restyled()" [width]="width()">
      <ng-container *ngTemplateOutlet="node; context: { $implicit: data().root, inRow: false }" />
      ${SENTINEL}
    </View>
  `,
})
export class TreeComponent {
  readonly bench = inject(BenchService);
  readonly data = input.required<TreeData>();
  readonly restyled = signal(false);
  readonly width = signal('100%');

  constructor() {
    useMutator((name) => {
      if (name === 'shrink') this.width.set('80%');
      else if (name === 'grow') this.width.set('100%');
      else if (name === 'restyle') this.restyled.set(true);
      else if (name === 'restore') this.restyled.set(false);
    });
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
  selector: 'bench-tiles',
  template: `
    <View class="tiles">
      @for (t of tiles(); track t.id) {
        <View class="tile bgl-{{ t.color }}">
          <Text class="tile-title" [textContent]="t.title"></Text>
          <Text class="tile-sub" [textContent]="t.subtitle"></Text>
        </View>
      }
    </View>
    ${SENTINEL}
  `,
})
export class TilesComponent {
  readonly bench = inject(BenchService);
  readonly data = input.required<TilesData>();
  readonly inserted = signal(false);
  readonly tiles = computed(() => (this.inserted() ? [...this.data().insert, ...this.data().tiles] : this.data().tiles));

  constructor() {
    useMutator((name) => this.inserted.set(name === 'insert'));
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
  selector: 'bench-dashboard',
  template: `
    <View class="dash">
      <View class="dash-header">
        <Text class="dash-title" [textContent]="data().title"></Text>
        @for (p of data().pills; track p) {
          <Text class="pill" [textContent]="p"></Text>
        }
      </View>
      <View class="dash-nav">
        @for (n of data().nav; track n.id) {
          <Text class="nav-item" [class.active]="n.active" [textContent]="n.label"></Text>
        }
      </View>
      <View class="dash-stats">
        @for (s of data().stats; track s.id) {
          <View class="stat">
            <Text class="stat-label" [textContent]="s.label"></Text>
            <Text class="stat-value" [textContent]="s.value"></Text>
            <Text class="stat-delta {{ s.up ? 'up' : 'down' }}" [textContent]="s.delta"></Text>
            <View class="bars">
              @for (h of s.bars; track $index) {
                <View class="bar" [height]="h"></View>
              }
            </View>
          </View>
        }
      </View>
      <View class="dash-table">
        <View class="trow thead">
          @for (c of data().columns; track c) {
            <Text class="cell" [textContent]="c"></Text>
          }
        </View>
        @for (r of data().rows; track r.id) {
          <View class="trow">
            <View class="cell-name">
              <View class="dot bg-{{ r.color }}"></View>
              <Text class="cell" [textContent]="r.name"></Text>
            </View>
            @for (c of r.cells; track $index) {
              <Text class="cell" [textContent]="c"></Text>
            }
          </View>
        }
      </View>
    </View>
    ${SENTINEL}
  `,
})
export class DashboardComponent {
  readonly bench = inject(BenchService);
  readonly data = input.required<DashboardData>();
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
  selector: 'bench-text-flow',
  template: `
    <View class="text-flow">
      @for (p of data().paragraphs; track p.id) {
        <!-- No line clamp in Mason: clamp paragraphs render in full, as in ns-core-mason. -->
        @if (p.spacing) {
          <Text class="para fs-{{ p.size }}" [class.bold]="p.bold" [letterSpacing]="spacing" [textContent]="p.text"></Text>
        } @else {
          <Text class="para fs-{{ p.size }}" [class.bold]="p.bold" [textContent]="p.text"></Text>
        }
      }
    </View>
    ${SENTINEL}
  `,
})
export class TextFlowComponent {
  readonly bench = inject(BenchService);
  readonly data = input.required<TextFlowData>();
  /** Mason reads letterSpacing in device pixels. */
  readonly spacing = 0.5 * Screen.mainScreen.scale;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
  selector: 'bench-cards',
  imports: [NgTemplateOutlet],
  template: `
    <ng-template #inner let-c>
      <View class="card-inner">
        <Text class="card-title" [textContent]="c.title"></Text>
        <Text class="card-body" [textContent]="c.body"></Text>
        <View class="chips">
          @for (x of c.chips; track $index) {
            <Text class="chip bgl-{{ c.color }}" [textContent]="x"></Text>
          }
        </View>
      </View>
    </ng-template>
    <View class="cards">
      @for (c of data().cards; track c.id) {
        <!-- Inline styles only where a variant uses them (binding null elsewhere unsets more than the property). -->
        @switch (c.variant) {
          @case (2) {
            <View class="card v2" [style.background-image]="gradient(c)">
              <ng-container *ngTemplateOutlet="inner; context: { $implicit: c }" />
            </View>
          }
          @case (3) {
            <View class="card v3" [style.border-top-color]="palette[c.color]">
              <ng-container *ngTemplateOutlet="inner; context: { $implicit: c }" />
            </View>
          }
          @default {
            <View class="{{ c.variant === 1 ? 'card v1 bc-' + c.color : 'card v' + c.variant }}">
              @if (c.variant === 5) {
                <View class="band bg-{{ c.color }}"></View>
              }
              <ng-container *ngTemplateOutlet="inner; context: { $implicit: c }" />
            </View>
          }
        }
      }
    </View>
    ${SENTINEL}
  `,
})
export class CardsComponent {
  readonly bench = inject(BenchService);
  readonly data = input.required<CardsData>();
  readonly palette = palette;
  gradient(c: Card) {
    return `linear-gradient(135deg, ${palette[c.color]}, ${palette[c.color2]})`;
  }
}
