import { useEffect } from '@lynx-js/react';
import { current, show, startFromLaunchUrl, started, status, useStore } from './bench';
import { List } from './List';
import { Cards, Chain, Dashboard, TextFlow, Tiles, Tree } from './scenarios';
import type { ListData } from './shared/generate';
import { SCENARIOS, SIZES } from './shared/scenarios';

const COMPONENTS: Record<string, (p: { data: any }) => any> = {
  'nested-chain': Chain,
  'tree-fanout': Tree,
  'flex-wrap-tiles': Tiles,
  'grid-dashboard': Dashboard,
  'text-flow': TextFlow,
  'styled-cards': Cards,
  'scroll-plain': Cards,
};

// Own component and store, so status updates never re-render the scenario.
function Status() {
  return <text className="status">{useStore(status)}</text>;
}

function Home() {
  return (
    <view className="home">
      <text className="home-title">xplat-benchmarks · Lynx</text>
      {SCENARIOS.map((sc) => (
        <view key={sc.id} className="home-row">
          <text className="home-label">{sc.title}</text>
          {SIZES.map((size) => (
            <text key={size} className="home-btn" bindtap={() => show(sc.id, size)}>
              {size}
            </text>
          ))}
        </view>
      ))}
    </view>
  );
}

function Body() {
  const f = useStore(current);
  const isStarted = useStore(started);
  if (f && f.fixture === 'list-scroll') return <List data={f.data as ListData} />;
  const Scenario = f && COMPONENTS[f.fixture];
  return (
    <scroll-view className="body" scroll-orientation="vertical">
      {Scenario ? <Scenario data={f!.data} /> : !isStarted ? <Home /> : null}
    </scroll-view>
  );
}

// Frame: the host applies the system-bar insets; a fixed-height status line
// above the bench host (a scroll-view, or the <list> in its place).
export function App() {
  useEffect(startFromLaunchUrl, []);
  return (
    <view className="frame">
      <Status />
      <Body />
    </view>
  );
}
