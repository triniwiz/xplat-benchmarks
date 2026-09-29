<view class="host">
  <view class="dash">
    <view class="dash-header">
      <text class="dash-title" textContent={data.title} />
      {#each data.pills as p (p)}
        <text class="pill" textContent={p} />
      {/each}
    </view>
    <view class="dash-nav">
      {#each data.nav as n (n.id)}
        <text class={n.active ? 'nav-item active' : 'nav-item'} textContent={n.label} />
      {/each}
    </view>
    <view class="dash-stats">
      {#each data.stats as s (s.id)}
        <view class="stat">
          <text class="stat-label" textContent={s.label} />
          <text class="stat-value" textContent={s.value} />
          <text class={`stat-delta ${s.up ? 'up' : 'down'}`} textContent={s.delta} />
          <view class="bars">
            {#each s.bars as h}
              <view class="bar" height={h} />
            {/each}
          </view>
        </view>
      {/each}
    </view>
    <view class="dash-table">
      <view class="trow thead">
        {#each data.columns as c (c)}
          <text class="cell" textContent={c} />
        {/each}
      </view>
      {#each data.rows as r (r.id)}
        <view class="trow">
          <view class="cell-name">
            <view class={`dot bg-${r.color}`} />
            <text class="cell" textContent={r.name} />
          </view>
          {#each r.cells as c}
            <text class="cell" textContent={c} />
          {/each}
        </view>
      {/each}
    </view>
  </view>
  <Sentinel />
</view>

<script lang="ts">
  import type { DashboardData } from '../shared/generate';
  import Sentinel from './Sentinel.svelte';
  export let data: DashboardData;
</script>
