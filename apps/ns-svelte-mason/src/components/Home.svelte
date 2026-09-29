<view class="home">
  <text class="home-title" textContent="xplat-benchmarks · NativeScript Svelte + Mason" />
  {#each SCENARIOS as s (s.id)}
    <view class="home-row">
      <text class="home-label" textContent={s.title} />
      {#each SIZES as size (size)}
        <text class="home-btn" textContent={size} on:tap={() => controller.show(s.id, size)} />
      {/each}
    </view>
  {/each}
</view>

<script lang="ts">
  import { SCENARIOS, SIZES } from '../shared/scenarios';
  import { controller } from '../store';
</script>
