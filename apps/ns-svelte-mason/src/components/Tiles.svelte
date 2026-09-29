<view class="host">
  <view class="tiles">
    {#each tiles as t (t.id)}
      <view class={`tile bgl-${t.color}`}>
        <text class="tile-title" textContent={t.title} />
        <text class="tile-sub" textContent={t.subtitle} />
      </view>
    {/each}
  </view>
  <Sentinel />
</view>

<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { TilesData } from '../shared/generate';
  import { controller } from '../store';
  import Sentinel from './Sentinel.svelte';

  export let data: TilesData;
  let inserted = false;
  $: tiles = inserted ? [...data.insert, ...data.tiles] : data.tiles;
  controller.setMutator((name) => (inserted = name === 'insert'));
  onDestroy(() => controller.setMutator(null));
</script>
