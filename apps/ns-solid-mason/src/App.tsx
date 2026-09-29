import { Match, Show, Switch } from 'solid-js';
import { current, started, status } from './store';
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

function Scenario(props: { fixture: string; data: any }) {
  return COMPONENTS[props.fixture]({ data: props.data });
}

export function App() {
  return (
    <gridlayout class="root" androidOverflowEdge="none">
      <view class="frame">
        <text class="status" textContent={status()} />
        <Switch>
          <Match when={current()?.fixture === 'list-scroll' && current()} keyed>
            {(f) => <MasonList data={f.data as ListData} />}
          </Match>
          <Match when={true}>
            <scroll class="body">
              <Show when={current()} keyed fallback={started() ? null : <Home />}>
                {(f) => <Scenario fixture={f.fixture} data={f.data} />}
              </Show>
            </scroll>
          </Match>
        </Switch>
      </view>
    </gridlayout>
  );
}
