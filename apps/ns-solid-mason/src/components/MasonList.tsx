import { render } from '@nativescript-community/solid-js';
import { document } from 'dominative';
import { For, createSignal, onMount } from 'solid-js';
import type { ListData, ListItem as Item } from '../shared/generate';
import { controller } from '../store';

// Content of one Ul cell; `type` is fixed per template, `item` is reactive.
function ListItem(props: { type: Item['type']; item: () => Item }) {
  const it = props.item;
  const badges = () => (
    <view class="badges">
      <For each={it().badges}>{(b) => <text class={`badge bgl-${it().color}`} textContent={b} />}</For>
    </view>
  );
  const text = (withBadges: boolean) => (
    <view class="li-text">
      <text class="li-title" textContent={it().title} />
      <text class="li-sub" textContent={it().subtitle} />
      {withBadges ? badges() : null}
    </view>
  );
  if (props.type !== 'c') {
    return (
      <view class="li-row">
        <view class={`${props.type === 'b' ? 'thumb' : 'avatar'} bg-${it().color}`} />
        {text(props.type === 'b')}
        <text class="li-meta" textContent={it().meta} />
      </view>
    );
  }
  return (
    <view class="li-card">
      <view class="li-card-head">
        <view class={`avatar bg-${it().color}`} />
        {text(false)}
        <text class="li-meta" textContent={it().meta} />
      </view>
      <text class="li-body" textContent={it().body} />
      {badges()}
    </view>
  );
}

/**
 * Mason's virtualized ul (masonkit ships no Solid list component). Each keyed
 * template's createView renders a ListItem into a detached .li-cell view (the
 * bare full-width Mason root every Ul cell gets, as in ns-core-mason);
 * itemLoading rebinds the new or recycled cell through its signal.
 */
export function MasonList(props: { data: ListData }) {
  let list: any;
  onMount(() => {
    const items = props.data.items;
    list.itemTemplates = (['a', 'b', 'c'] as const).map((type) => ({
      key: type,
      createView: () => {
        const cell: any = document.createElement('view');
        cell.setAttribute('class', 'li-cell');
        const [item, setItem] = createSignal<Item>(items.find((i) => i.type === type)!);
        render(() => <ListItem type={type} item={item} />, cell);
        cell.__setItem = setItem;
        return cell;
      },
    }));
    list.itemTemplateSelector = (item: Item) => item.type;
    list.on('itemLoading', (args: any) => args.view.__setItem(items[args.index]));
    list.items = items;
  });
  return <ul ref={list} class="list body" on:layoutChanged={() => controller.sentinelLayout()} />;
}
