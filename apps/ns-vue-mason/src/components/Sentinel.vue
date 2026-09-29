<template>
  <View class="sentinel" @layoutChanged="controller.sentinelLayout()" />
</template>

<script setup lang="ts">
import { controller } from '../store';
</script>
