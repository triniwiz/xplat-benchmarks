<view class="card-inner">
  <text class="card-title" textContent={card.title} />
  <text class="card-body" textContent={card.body} />
  <view class="chips">
    {#each card.chips as x}
      <text class={`chip bgl-${card.color}`} textContent={x} />
    {/each}
  </view>
</view>

<script lang="ts">
  import type { Card } from '../shared/generate';
  export let card: Card;
</script>
