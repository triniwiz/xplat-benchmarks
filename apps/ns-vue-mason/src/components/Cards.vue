<template>
  <View>
    <View class="cards">
      <template v-for="c in data.cards" :key="c.id">
        <View v-if="c.variant === 2" class="card v2" :style="{ backgroundImage: gradient(c) }">
          <CardInner :card="c" />
        </View>
        <View v-else-if="c.variant === 3" class="card v3" :style="{ borderTopColor: palette[c.color] }">
          <CardInner :card="c" />
        </View>
        <View v-else :class="c.variant === 1 ? `card v1 bc-${c.color}` : `card v${c.variant}`">
          <View v-if="c.variant === 5" :class="`band bg-${c.color}`" />
          <CardInner :card="c" />
        </View>
      </template>
    </View>
    <Sentinel />
  </View>
</template>

<script setup lang="ts">
import type { Card, CardsData } from '../shared/generate';
import { palette } from '../shared/tokens';
import CardInner from './CardInner.vue';
import Sentinel from './Sentinel.vue';
defineProps<{ data: CardsData }>();
const gradient = (c: Card) => `linear-gradient(135deg, ${palette[c.color]}, ${palette[c.color2]})`;
</script>
