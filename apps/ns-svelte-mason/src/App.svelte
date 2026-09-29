<!-- Same frame as apps/ns-core-mason/app/chrome.ts: a core GridLayout window
     root that only applies the Android system-bar insets, holding a Mason root
     with the status text and a Mason scroll host, or Mason's ul in its place. -->
<gridLayout class="root" androidOverflowEdge="none">
  <view class="frame">
    <text class="status" textContent={$status} />
    {#if $current && $current.fixture === 'list-scroll'}
      <MasonList data={$current.data} />
    {:else}
      <scroll class="body">
        {#if $current}
          <svelte:component this={components[$current.fixture]} data={$current.data} />
        {:else if !$started}
          <Home />
        {/if}
      </scroll>
    {/if}
  </view>
</gridLayout>

<script lang="ts">
  import { current, status, started } from './store';
  import Home from './components/Home.svelte';
  import MasonList from './components/MasonList.svelte';
  import Chain from './components/Chain.svelte';
  import Tree from './components/Tree.svelte';
  import Tiles from './components/Tiles.svelte';
  import Dashboard from './components/Dashboard.svelte';
  import TextFlow from './components/TextFlow.svelte';
  import Cards from './components/Cards.svelte';

  const components: Record<string, any> = {
    'nested-chain': Chain,
    'tree-fanout': Tree,
    'flex-wrap-tiles': Tiles,
    'grid-dashboard': Dashboard,
    'text-flow': TextFlow,
    'styled-cards': Cards,
    'scroll-plain': Cards,
  };
</script>
