<!-- Same frame as apps/ns-core-mason/app/chrome.ts: a core GridLayout window
     root that only applies the Android system-bar insets, holding a Mason root
     with the status Text and a Mason Scroll host, or Mason's Ul in its place. -->
<template>
  <GridLayout class="root" androidOverflowEdge="none">
    <View class="frame">
      <Text class="status" :textContent="status" />
      <MasonList v-if="current && current.fixture === 'list-scroll'" :data="current.data" />
      <Scroll v-else class="body">
        <component v-if="current" :is="components[current.fixture]" class="host" :data="current.data" />
        <Home v-else-if="!started" />
      </Scroll>
    </View>
  </GridLayout>
</template>

<script setup lang="ts">
import { current, status, started } from './store';
import Home from './components/Home.vue';
import MasonList from './components/MasonList.vue';
import Chain from './components/Chain.vue';
import Tree from './components/Tree.vue';
import Tiles from './components/Tiles.vue';
import Dashboard from './components/Dashboard.vue';
import TextFlow from './components/TextFlow.vue';
import Cards from './components/Cards.vue';

const components = {
  'nested-chain': Chain,
  'tree-fanout': Tree,
  'flex-wrap-tiles': Tiles,
  'grid-dashboard': Dashboard,
  'text-flow': TextFlow,
  'styled-cards': Cards,
  'scroll-plain': Cards,
};
</script>
