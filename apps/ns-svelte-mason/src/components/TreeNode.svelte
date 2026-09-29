{#if node.children.length}
  <view class={`tn ${node.dir === 'row' ? 'row' : 'col'} bgl-${node.color} bc-${node.color}${inRow ? ' in-row' : ''}`}>
    {#each node.children as c (c.id)}
      <svelte:self node={c} inRow={node.dir === 'row'} />
    {/each}
  </view>
{:else}
  <view class={`leaf bg-${node.color}${inRow ? ' in-row' : ''}`} />
{/if}

<script lang="ts">
  import type { TreeNode } from '../shared/generate';
  export let node: TreeNode;
  export let inRow: boolean;
</script>
