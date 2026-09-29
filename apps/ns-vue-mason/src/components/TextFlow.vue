<template>
  <View>
    <View class="text-flow">
      <template v-for="p in data.paragraphs" :key="p.id">
        <Text v-if="p.spacing" :class="`para fs-${p.size}${p.bold ? ' bold' : ''}`" :letterSpacing="spacing" :textContent="p.text" />
        <Text v-else :class="`para fs-${p.size}${p.bold ? ' bold' : ''}`" :textContent="p.text" />
      </template>
    </View>
    <Sentinel />
  </View>
</template>

<script setup lang="ts">
import { Screen } from '@nativescript/core';
import type { TextFlowData } from '../shared/generate';
import Sentinel from './Sentinel.vue';
defineProps<{ data: TextFlowData }>();
const spacing = 0.5 * Screen.mainScreen.scale;
</script>
