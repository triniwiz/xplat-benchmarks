<stackLayout class="home">
  <label class="home-title" text="xplat-benchmarks · NativeScript Svelte + Mason" />
  {#each SCENARIOS as s (s.id)}
    <gridLayout class="home-row" columns="*,auto,auto,auto">
      <label class="home-label" text={s.title} />
      {#each SIZES as size, i (size)}
        <label class="home-btn" col={i + 1} text={size} on:tap={() => controller.show(s.id, size)} />
      {/each}
    </gridLayout>
  {/each}
</stackLayout>

<script lang="ts">
  import { SCENARIOS, SIZES } from '../shared/scenarios';
  import { controller } from '../store';
</script>
