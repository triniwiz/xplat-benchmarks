<template>
  <View>
    <View :class="restyled ? 'tree-frame restyled' : 'tree-frame'" :width="width">
      <TreeNode :node="data.root" :inRow="false" />
      <Sentinel />
    </View>
  </View>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'nativescript-vue';
import type { TreeData } from '../shared/generate';
import { controller } from '../store';
import TreeNode from './TreeNode.vue';
import Sentinel from './Sentinel.vue';

defineProps<{ data: TreeData }>();
const restyled = ref(false);
const width = ref('100%');
controller.setMutator((name) => {
  if (name === 'shrink') width.value = '80%';
  else if (name === 'grow') width.value = '100%';
  else if (name === 'restyle') restyled.value = true;
  else if (name === 'restore') restyled.value = false;
});
onUnmounted(() => controller.setMutator(null));
</script>
