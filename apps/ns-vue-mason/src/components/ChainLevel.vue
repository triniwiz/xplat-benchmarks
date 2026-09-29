<template>
  <View v-if="level < data.depth" :class="`chain bgl-${level % 8} bc-${level % 8}`">
    <ChainLevel :data="data" :level="level + 1" />
  </View>
  <Text v-else class="chain-label" :textContent="data.label" />
</template>

<script setup lang="ts">
import type { ChainData } from '../shared/generate';
defineProps<{ data: ChainData; level: number }>();
</script>
