<template>
  <View class="card-inner">
    <Text class="card-title" :textContent="card.title" />
    <Text class="card-body" :textContent="card.body" />
    <View class="chips">
      <Text v-for="(x, i) in card.chips" :key="i" :class="`chip bgl-${card.color}`" :textContent="x" />
    </View>
  </View>
</template>

<script setup lang="ts">
import type { Card } from '../shared/generate';
defineProps<{ card: Card }>();
</script>
