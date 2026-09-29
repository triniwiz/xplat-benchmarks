<template>
  <View>
    <View class="dash">
      <View class="dash-header">
        <Text class="dash-title" :textContent="data.title" />
        <Text v-for="p in data.pills" :key="p" class="pill" :textContent="p" />
      </View>
      <View class="dash-nav">
        <Text v-for="n in data.nav" :key="n.id" :class="n.active ? 'nav-item active' : 'nav-item'" :textContent="n.label" />
      </View>
      <View class="dash-stats">
        <View v-for="s in data.stats" :key="s.id" class="stat">
          <Text class="stat-label" :textContent="s.label" />
          <Text class="stat-value" :textContent="s.value" />
          <Text :class="`stat-delta ${s.up ? 'up' : 'down'}`" :textContent="s.delta" />
          <View class="bars">
            <View v-for="(h, i) in s.bars" :key="i" class="bar" :height="h" />
          </View>
        </View>
      </View>
      <View class="dash-table">
        <View class="trow thead">
          <Text v-for="c in data.columns" :key="c" class="cell" :textContent="c" />
        </View>
        <View v-for="r in data.rows" :key="r.id" class="trow">
          <View class="cell-name">
            <View :class="`dot bg-${r.color}`" />
            <Text class="cell" :textContent="r.name" />
          </View>
          <Text v-for="(c, i) in r.cells" :key="i" class="cell" :textContent="c" />
        </View>
      </View>
    </View>
    <Sentinel />
  </View>
</template>

<script setup lang="ts">
import type { DashboardData } from '../shared/generate';
import Sentinel from './Sentinel.vue';
defineProps<{ data: DashboardData }>();
</script>
