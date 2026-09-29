{#if level < data.depth}
  <view class={`chain bgl-${level % 8} bc-${level % 8}`}>
    <svelte:self {data} level={level + 1} />
  </view>
{:else}
  <text class="chain-label" textContent={data.label} />
{/if}

<script lang="ts">
  import type { ChainData } from '../shared/generate';
  export let data: ChainData;
  export let level: number;
</script>
