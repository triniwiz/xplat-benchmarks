<template>
  <View>
    <View class="tiles">
      <View v-for="t in tiles" :key="t.id" :class="`tile bgl-${t.color}`">
        <Text class="tile-title" :textContent="t.title" />
        <Text class="tile-sub" :textContent="t.subtitle" />
      </View>
    </View>
    <Sentinel />
  </View>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'nativescript-vue';
import type { TilesData } from '../shared/generate';
import { controller } from '../store';
import Sentinel from './Sentinel.vue';

const props = defineProps<{ data: TilesData }>();
const inserted = ref(false);
const tiles = computed(() => (inserted.value ? [...props.data.insert, ...props.data.tiles] : props.data.tiles));
controller.setMutator((name) => (inserted.value = name === 'insert'));
onUnmounted(() => controller.setMutator(null));
</script>
