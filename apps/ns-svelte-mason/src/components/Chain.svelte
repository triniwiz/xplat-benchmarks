<view class="host">
  <ChainLevel {data} level={0} />
  <Sentinel />
</view>

<script lang="ts">
  import type { ChainData } from '../shared/generate';
  import ChainLevel from './ChainLevel.svelte';
  import Sentinel from './Sentinel.svelte';
  export let data: ChainData;
</script>
