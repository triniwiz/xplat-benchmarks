<view class="host">
  <view class="text-flow">
    {#each data.paragraphs as p (p.id)}
      {#if p.spacing}
        <text class={`para fs-${p.size}${p.bold ? ' bold' : ''}`} letterSpacing={spacing} textContent={p.text} />
      {:else}
        <text class={`para fs-${p.size}${p.bold ? ' bold' : ''}`} textContent={p.text} />
      {/if}
    {/each}
  </view>
  <Sentinel />
</view>

<script lang="ts">
  import { Screen } from '@nativescript/core';
  import type { TextFlowData } from '../shared/generate';
  import Sentinel from './Sentinel.svelte';
  export let data: TextFlowData;
  const spacing = 0.5 * Screen.mainScreen.scale;
</script>
