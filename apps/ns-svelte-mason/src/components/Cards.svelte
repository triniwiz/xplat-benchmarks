<view class="host">
  <view class="cards">
    {#each data.cards as c (c.id)}
      <!-- Inline styles only on the variants that use them. -->
      {#if c.variant === 2}
        <view class="card v2" style={`background-image: ${gradient(c)}`}>
          <CardInner card={c} />
        </view>
      {:else if c.variant === 3}
        <view class="card v3" style={`border-top-color: ${palette[c.color]}`}>
          <CardInner card={c} />
        </view>
      {:else}
        <view class={c.variant === 1 ? `card v1 bc-${c.color}` : `card v${c.variant}`}>
          {#if c.variant === 5}
            <view class={`band bg-${c.color}`} />
          {/if}
          <CardInner card={c} />
        </view>
      {/if}
    {/each}
  </view>
  <Sentinel />
</view>

<script lang="ts">
  import type { Card, CardsData } from '../shared/generate';
  import { palette } from '../shared/tokens';
  import CardInner from './CardInner.svelte';
  import Sentinel from './Sentinel.svelte';
  export let data: CardsData;
  const gradient = (c: Card) => `linear-gradient(135deg, ${palette[c.color]}, ${palette[c.color2]})`;
</script>
