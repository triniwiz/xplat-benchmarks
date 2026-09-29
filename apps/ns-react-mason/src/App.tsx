import { controller, current, started, status, useStore } from './store';
import { Home } from './components/Home';
import { MasonList } from './components/MasonList';
import { Cards, Chain, Dashboard, TextFlow, Tiles, Tree } from './components/scenarios';
import type { ListData } from './shared/generate';

const COMPONENTS: Record<string, (p: { data: any }) => any> = {
  'nested-chain': Chain,
  'tree-fanout': Tree,
  'flex-wrap-tiles': Tiles,
  'grid-dashboard': Dashboard,
  'text-flow': TextFlow,
  'styled-cards': Cards,
  'scroll-plain': Cards,
};

export function App() {
  const f = useStore(current);
  const text = useStore(status);
  const isStarted = useStore(started);
  const Scenario = f && COMPONENTS[f.fixture];
  return (
    <gridlayout className="root" androidOverflowEdge="none">
      <view className="frame">
        <text className="status" textContent={text} />
        {f && f.fixture === 'list-scroll' ? (
          <MasonList data={f.data as ListData} />
        ) : (
          <scroll className="body">{Scenario ? <Scenario data={f!.data} /> : !isStarted ? <Home /> : null}</scroll>
        )}
      </view>
    </gridlayout>
  );
}

export { controller };
