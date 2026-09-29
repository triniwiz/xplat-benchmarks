<!-- Content of one Ul cell; MasonList mounts it into the cell's bare full-width
     Mason root (.li-cell). `type` is fixed per template. -->
{#if type !== 'c'}
  <view class="li-row">
    <view class={`${type === 'b' ? 'thumb' : 'avatar'} bg-${item.color}`} />
    <view class="li-text">
      <text class="li-title" textContent={item.title} />
      <text class="li-sub" textContent={item.subtitle} />
      {#if type === 'b'}
        <view class="badges">
          {#each item.badges as b}
            <text class={`badge bgl-${item.color}`} textContent={b} />
          {/each}
        </view>
      {/if}
    </view>
    <text class="li-meta" textContent={item.meta} />
  </view>
{:else}
  <view class="li-card">
    <view class="li-card-head">
      <view class={`avatar bg-${item.color}`} />
      <view class="li-text">
        <text class="li-title" textContent={item.title} />
        <text class="li-sub" textContent={item.subtitle} />
      </view>
      <text class="li-meta" textContent={item.meta} />
    </view>
    <text class="li-body" textContent={item.body} />
    <view class="badges">
      {#each item.badges as b}
        <text class={`badge bgl-${item.color}`} textContent={b} />
      {/each}
    </view>
  </view>
{/if}

<script lang="ts">
  import type { ListItem } from '../shared/generate';
  export let type: ListItem['type'];
  export let item: ListItem;
</script>
