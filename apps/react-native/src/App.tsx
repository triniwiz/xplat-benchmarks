import { useEffect } from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { Text } from './Text';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { current, listenForLaunchUrls, show, started, status, useStore } from './bench';
import { List } from './List';
import { Cards, Chain, Dashboard, TextFlow, Tiles, Tree } from './scenarios';
import type { ListData } from './shared/generate';
import { SCENARIOS, SIZES } from './shared/scenarios';
import { s } from './styles';

const COMPONENTS: Record<string, (p: { data: any }) => any> = {
  'nested-chain': Chain,
  'tree-fanout': Tree,
  'flex-wrap-tiles': Tiles,
  'grid-dashboard': Dashboard,
  'text-flow': TextFlow,
  'styled-cards': Cards,
  'scroll-plain': Cards,
};

function Status() {
  return <Text style={s.status}>{useStore(status)}</Text>;
}

function Home() {
  return (
    <View style={s.home}>
      <Text style={s.homeTitle}>xplat-benchmarks · React Native</Text>
      {SCENARIOS.map((sc) => (
        <View key={sc.id} style={s.homeRow}>
          <Text style={s.homeLabel}>{sc.title}</Text>
          {SIZES.map((size) => (
            <Text key={size} style={s.homeBtn} onPress={() => show(sc.id, size)}>
              {size}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

function Body() {
  const f = useStore(current);
  const isStarted = useStore(started);
  if (f && f.fixture === 'list-scroll') return <List data={f.data as ListData} />;
  const Scenario = f && COMPONENTS[f.fixture];
  return <ScrollView style={s.body}>{Scenario ? <Scenario data={f!.data} /> : !isStarted ? <Home /> : null}</ScrollView>;
}

export function App({ launchUrl }: { launchUrl?: string }) {
  useEffect(() => listenForLaunchUrls(launchUrl), []);
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={s.root} edges={['top', 'bottom', 'left', 'right']}>
        <Status />
        <Body />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
