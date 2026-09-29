<!-- One component for the three Ul templates; `type` is fixed per template, so a
     recycled cell never changes structure. Each cell has a bare full-width Mason
     root (.li-cell), as in ns-core-mason. -->
<template>
  <View class="li-cell">
    <View v-if="type !== 'c'" class="li-row">
      <View :class="`${type === 'b' ? 'thumb' : 'avatar'} bg-${state.item.color}`" />
      <View class="li-text">
        <Text class="li-title" :textContent="state.item.title" />
        <Text class="li-sub" :textContent="state.item.subtitle" />
        <View v-if="type === 'b'" class="badges">
          <Text v-for="(b, i) in state.item.badges" :key="i" :class="`badge bgl-${state.item.color}`" :textContent="b" />
        </View>
      </View>
      <Text class="li-meta" :textContent="state.item.meta" />
    </View>
    <View v-else class="li-card">
      <View class="li-card-head">
        <View :class="`avatar bg-${state.item.color}`" />
        <View class="li-text">
          <Text class="li-title" :textContent="state.item.title" />
          <Text class="li-sub" :textContent="state.item.subtitle" />
        </View>
        <Text class="li-meta" :textContent="state.item.meta" />
      </View>
      <Text class="li-body" :textContent="state.item.body" />
      <View class="badges">
        <Text v-for="(b, i) in state.item.badges" :key="i" :class="`badge bgl-${state.item.color}`" :textContent="b" />
      </View>
    </View>
  </View>
</template>

<script setup lang="ts">
import type { ListItem } from '../shared/generate';
defineProps<{ type: ListItem['type']; state: { item: ListItem } }>();
</script>
