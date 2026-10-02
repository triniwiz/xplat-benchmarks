import { Component } from '@angular/core';
import { SafeAreaProvider, SafeAreaView, ScrollView, Text, View } from '@ng-native/components';
import { current, listenForLaunchUrls, started, status } from './bench.ts';
import { Cards, Chain, Dashboard, TextFlow, Tiles, Tree } from './scenarios.ts';

@Component({
  selector: 'app-root',
  imports: [SafeAreaProvider, SafeAreaView, ScrollView, Text, View, Chain, Tree, Tiles, Dashboard, TextFlow, Cards],
  styleUrls: ['./bench.css'],
  styles: `:host { flex: 1; }`,
  template: `
    <safe-area-provider>
      <safe-area-view class="root">
        <text class="status" [allowFontScaling]="false">{{ status() }}</text>
        <scroll-view class="body">
          @if (current(); as f) {
            @switch (f.fixture) {
              @case ('nested-chain') { <bench-chain [data]="$any(f.data)" /> }
              @case ('tree-fanout') { <bench-tree [data]="$any(f.data)" /> }
              @case ('flex-wrap-tiles') { <bench-tiles [data]="$any(f.data)" /> }
              @case ('grid-dashboard') { <bench-dashboard [data]="$any(f.data)" /> }
              @case ('text-flow') { <bench-text-flow [data]="$any(f.data)" /> }
              @case ('styled-cards') { <bench-cards [data]="$any(f.data)" /> }
              @case ('scroll-plain') { <bench-cards [data]="$any(f.data)" /> }
            }
          } @else if (!started()) {
            <view class="home"><text class="home-title" [allowFontScaling]="false">xplat-benchmarks · Angular Native</text></view>
          }
        </scroll-view>
      </safe-area-view>
    </safe-area-provider>
  `,
})
export class App {
  readonly current = current;
  readonly started = started;
  readonly status = status;
  constructor() {
    listenForLaunchUrls();
  }
}
