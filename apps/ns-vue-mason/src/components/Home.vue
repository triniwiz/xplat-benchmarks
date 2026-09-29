<template>
  <StackLayout class="home">
    <Label class="home-title" text="xplat-benchmarks · NativeScript Vue + Mason" />
    <GridLayout v-for="s in SCENARIOS" :key="s.id" class="home-row" columns="*,auto,auto,auto">
      <Label class="home-label" :text="s.title" />
      <Label v-for="(size, i) in SIZES" :key="size" class="home-btn" :col="i + 1" :text="size" @tap="controller.show(s.id, size)" />
    </GridLayout>
  </StackLayout>
</template>

<script setup lang="ts">
import { SCENARIOS, SIZES } from '../shared/scenarios';
import { controller } from '../store';
</script>
