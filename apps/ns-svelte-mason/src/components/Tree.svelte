<view class="host">
  <view class={restyled ? 'tree-frame restyled' : 'tree-frame'} {width}>
    <TreeNode node={data.root} inRow={false} />
    <Sentinel />
  </view>
</view>

<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { TreeData } from '../shared/generate';
  import { controller } from '../store';
  import TreeNode from './TreeNode.svelte';
  import Sentinel from './Sentinel.svelte';

  export let data: TreeData;
  let restyled = false;
  let width = '100%';
  controller.setMutator((name) => {
    if (name === 'shrink') width = '80%';
    else if (name === 'grow') width = '100%';
    else if (name === 'restyle') restyled = true;
    else if (name === 'restore') restyled = false;
  });
  onDestroy(() => controller.setMutator(null));
</script>
