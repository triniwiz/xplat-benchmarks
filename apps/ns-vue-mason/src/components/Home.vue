<template>
  <View class="home">
    <Text class="home-title" textContent="xplat-benchmarks · NativeScript Vue + Mason" />
    <View v-for="s in SCENARIOS" :key="s.id" class="home-row">
      <Text class="home-label" :textContent="s.title" />
      <Text v-for="size in SIZES" :key="size" class="home-btn" :textContent="size" @tap="controller.show(s.id, size)" />
    </View>
  </View>
</template>

<script setup lang="ts">
import { SCENARIOS, SIZES } from '../shared/scenarios';
import { controller } from '../store';
</script>
