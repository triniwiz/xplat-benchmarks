<template>
  <Ul ref="ul" class="list body" @layoutChanged="controller.sentinelLayout()" />
</template>

<script setup lang="ts">
import { createNativeView, onMounted, ref, shallowReactive } from 'nativescript-vue';
import type { ListData, ListItem as Item } from '../shared/generate';
import { controller } from '../store';
import ListItem from './ListItem.vue';

const props = defineProps<{ data: ListData }>();
const ul = ref<any>(null);

onMounted(() => {
  const list = ul.value.nativeView;
  list.itemTemplates = (['a', 'b', 'c'] as const).map((type) => ({
    key: type,
    createView: () => {
      const state = shallowReactive({ item: props.data.items.find((i) => i.type === type)! });
      const cell = createNativeView(ListItem, { type, state });
      cell.mount();
      (cell.nativeView as any).__state = state;
      return cell.nativeView;
    },
  }));
  list.itemTemplateSelector = (item: Item) => item.type;
  list.on('itemLoading', (args: any) => (args.view.__state.item = props.data.items[args.index]));
  list.items = props.data.items;
});
</script>
