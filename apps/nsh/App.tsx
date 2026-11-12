import { computed, mount, safeArea, Scroll, Text, View, type JSX } from 'nsh';
import { startFromLaunchUrl } from './src/bench';
import { List } from './src/List';
import { Cards, Chain, Dashboard, TextFlow, Tiles, Tree } from './src/scenarios';
import type { ScenarioFixture } from './src/shared/generate';
import type { ScenarioId } from './src/shared/scenarios';
import { current, status } from './src/store';
import { s } from './src/styles';

const VIEWS: Record<ScenarioId, (props: { data: any }) => JSX.Element> = {
  'nested-chain': Chain,
  'tree-fanout': Tree,
  'relayout-resize': Tree,
  'relayout-style': Tree,
  'flex-wrap-tiles': Tiles,
  'insert-remove': Tiles,
  'grid-dashboard': Dashboard,
  'text-flow': TextFlow,
  'styled-cards': Cards,
  'scroll-plain': Cards,
  'list-scroll': List,
};

const inList = computed(() => (current()?.scenario === 'list-scroll' ? current() : null));
const inScroll = computed(() => (current()?.scenario === 'list-scroll' ? null : current()));

function Scenario(props: { f: () => ScenarioFixture }) {
  const Body = VIEWS[props.f().scenario];
  return <Body data={props.f().data} />;
}

function App() {
  return (
    <View style={[s.root, { paddingTop: safeArea().top, paddingBottom: safeArea().bottom }]}>
      <Text style={s.status}>{status()}</Text>
      <If
        when={inList()}
        else={
          <Scroll style={s.body}>
            <If when={inScroll()}>{(f) => <Scenario f={f} />}</If>
          </Scroll>
        }
      >
        {(f) => <Scenario f={f} />}
      </If>
    </View>
  );
}

mount(App);
startFromLaunchUrl();
