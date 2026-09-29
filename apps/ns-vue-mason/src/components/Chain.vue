<template>
  <View>
    <ChainLevel :data="data" :level="0" />
    <Sentinel />
  </View>
</template>

<script setup lang="ts">
import type { ChainData } from '../shared/generate';
import ChainLevel from './ChainLevel.vue';
import Sentinel from './Sentinel.vue';
defineProps<{ data: ChainData }>();
</script>
