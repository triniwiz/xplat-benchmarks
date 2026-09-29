<template>
  <View v-if="node.children.length" :class="`tn ${node.dir === 'row' ? 'row' : 'col'} bgl-${node.color} bc-${node.color}${inRow ? ' in-row' : ''}`">
    <TreeNode v-for="c in node.children" :key="c.id" :node="c" :inRow="node.dir === 'row'" />
  </View>
  <View v-else :class="`leaf bg-${node.color}${inRow ? ' in-row' : ''}`" />
</template>

<script setup lang="ts">
import type { TreeNode as Node } from '../shared/generate';
defineProps<{ node: Node; inRow: boolean }>();
</script>
