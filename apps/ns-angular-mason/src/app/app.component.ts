import { ChangeDetectionStrategy, Component, NO_ERRORS_SCHEMA, computed, inject } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { MasonUlComponent } from './mason-ul.component';
import type { ListData, ListItem } from '../shared/generate';
import { SCENARIOS, SIZES } from '../shared/scenarios';
import { BenchService } from './bench.service';
import { CardsComponent, ChainComponent, DashboardComponent, TextFlowComponent, TilesComponent, TreeComponent } from './scenarios';

@Component({
  selector: 'ns-app',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
  imports: [NativeScriptCommonModule, MasonUlComponent, ChainComponent, TreeComponent, TilesComponent, DashboardComponent, TextFlowComponent, CardsComponent],
  template: `
    <GridLayout class="root" androidOverflowEdge="none">
     <View class="frame">
      <Text class="status" [textContent]="bench.status()"></Text>
      @if (list(); as l) {
        <Ul class="list body" [itemTemplateSelector]="itemType" [items]="l.items" (layoutChanged)="bench.sentinelLayout()">
          <ng-template nsTemplateKey="a" let-item="item">
            <View class="li-cell">
              <View class="li-row">
                <View class="avatar bg-{{ item.color }}"></View>
                <View class="li-text">
                  <Text class="li-title" [textContent]="item.title"></Text>
                  <Text class="li-sub" [textContent]="item.subtitle"></Text>
                </View>
                <Text class="li-meta" [textContent]="item.meta"></Text>
              </View>
            </View>
          </ng-template>
          <ng-template nsTemplateKey="b" let-item="item">
            <View class="li-cell">
              <View class="li-row">
                <View class="thumb bg-{{ item.color }}"></View>
                <View class="li-text">
                  <Text class="li-title" [textContent]="item.title"></Text>
                  <Text class="li-sub" [textContent]="item.subtitle"></Text>
                  <View class="badges">
                    @for (b of item.badges; track $index) {
                      <Text class="badge bgl-{{ item.color }}" [textContent]="b"></Text>
                    }
                  </View>
                </View>
                <Text class="li-meta" [textContent]="item.meta"></Text>
              </View>
            </View>
          </ng-template>
          <ng-template nsTemplateKey="c" let-item="item">
            <View class="li-cell">
              <View class="li-card">
                <View class="li-card-head">
                  <View class="avatar bg-{{ item.color }}"></View>
                  <View class="li-text">
                    <Text class="li-title" [textContent]="item.title"></Text>
                    <Text class="li-sub" [textContent]="item.subtitle"></Text>
                  </View>
                  <Text class="li-meta" [textContent]="item.meta"></Text>
                </View>
                <Text class="li-body" [textContent]="item.body"></Text>
                <View class="badges">
                  @for (b of item.badges; track $index) {
                    <Text class="badge bgl-{{ item.color }}" [textContent]="b"></Text>
                  }
                </View>
              </View>
            </View>
          </ng-template>
        </Ul>
      } @else {
        <Scroll class="body">
          @if (bench.current(); as f) {
            @switch (f.fixture) {
              @case ('nested-chain') { <bench-chain class="host" [data]="$any(f.data)" /> }
              @case ('tree-fanout') { <bench-tree class="host" [data]="$any(f.data)" /> }
              @case ('flex-wrap-tiles') { <bench-tiles class="host" [data]="$any(f.data)" /> }
              @case ('grid-dashboard') { <bench-dashboard class="host" [data]="$any(f.data)" /> }
              @case ('text-flow') { <bench-text-flow class="host" [data]="$any(f.data)" /> }
              @case ('styled-cards') { <bench-cards class="host" [data]="$any(f.data)" /> }
              @case ('scroll-plain') { <bench-cards class="host" [data]="$any(f.data)" /> }
            }
          } @else if (home()) {
            <View class="home">
              <Text class="home-title" textContent="xplat-benchmarks · NativeScript Angular + Mason"></Text>
              @for (s of scenarios; track s.id) {
                <View class="home-row">
                  <Text class="home-label" [textContent]="s.title"></Text>
                  @for (size of sizes; track size) {
                    <Text class="home-btn" [textContent]="size" (tap)="bench.show(s.id, size)"></Text>
                  }
                </View>
              }
            </View>
          }
        </Scroll>
      }
     </View>
    </GridLayout>
  `,
})
export class AppComponent {
  readonly bench = inject(BenchService);
  readonly scenarios = SCENARIOS;
  readonly sizes = SIZES;
  readonly home = computed(() => !this.bench.started());
  readonly list = computed(() => {
    const f = this.bench.current();
    return f?.fixture === 'list-scroll' ? (f.data as ListData) : null;
  });
  readonly itemType = (item: ListItem) => item.type;
}
