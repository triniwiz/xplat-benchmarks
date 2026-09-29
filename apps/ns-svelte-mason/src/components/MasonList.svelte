<ul bind:this={ul} class="list body" on:layoutChanged={() => controller.sentinelLayout()} />

<script lang="ts">
  import { onMount } from 'svelte';
  import { createElement } from 'svelte-native/dom';
  import type { ListData, ListItem as Item } from '../shared/generate';
  import { controller } from '../store';
  import ListItem from './ListItem.svelte';

  export let data: ListData;
  let ul: any;

  onMount(() => {
    const list = ul.nativeView;
    list.itemTemplates = (['a', 'b', 'c'] as const).map((type) => ({
      key: type,
      createView: () => {
        const cell: any = createElement('view');
        cell.setAttribute('class', 'li-cell');
        const item = data.items.find((i) => i.type === type)!;
        cell.nativeView.__cell = new ListItem({ target: cell, props: { type, item } });
        return cell.nativeView;
      },
    }));
    list.itemTemplateSelector = (item: Item) => item.type;
    list.on('itemLoading', (args: any) => args.view.__cell.$set({ item: data.items[args.index] }));
    list.items = data.items;
  });
</script>
