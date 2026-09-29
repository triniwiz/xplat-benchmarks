import { render } from '@nativescript-community/react';
import { document } from 'dominative';
import { useLayoutEffect, useRef } from 'react';
import type { ListData, ListItem as Item } from '../shared/generate';
import { controller, createStore, useStore } from '../store';

// Content of one Ul cell; `type` is fixed per template.
function ListItem({ type, item }: { type: Item['type']; item: Item }) {
  const badges = (
    <view className="badges">
      {item.badges.map((b, i) => (
        <text key={i} className={`badge bgl-${item.color}`} textContent={b} />
      ))}
    </view>
  );
  const text = (withBadges: boolean) => (
    <view className="li-text">
      <text className="li-title" textContent={item.title} />
      <text className="li-sub" textContent={item.subtitle} />
      {withBadges ? badges : null}
    </view>
  );
  if (type !== 'c') {
    return (
      <view className="li-row">
        <view className={`${type === 'b' ? 'thumb' : 'avatar'} bg-${item.color}`} />
        {text(type === 'b')}
        <text className="li-meta" textContent={item.meta} />
      </view>
    );
  }
  return (
    <view className="li-card">
      <view className="li-card-head">
        <view className={`avatar bg-${item.color}`} />
        {text(false)}
        <text className="li-meta" textContent={item.meta} />
      </view>
      <text className="li-body" textContent={item.body} />
      {badges}
    </view>
  );
}

function Cell({ type, store }: { type: Item['type']; store: ReturnType<typeof createStore<Item>> }) {
  return <ListItem type={type} item={useStore(store)} />;
}

/**
 * Mason's virtualized ul (masonkit ships no React list component). Each keyed
 * template's createView renders a Cell root into a detached .li-cell view (the
 * bare full-width Mason root every Ul cell gets, as in ns-core-mason);
 * itemLoading rebinds the new or recycled cell through its store.
 */
export function MasonList({ data }: { data: ListData }) {
  const ref = useRef<any>(null);
  useLayoutEffect(() => {
    const list = ref.current;
    list.itemTemplates = (['a', 'b', 'c'] as const).map((type) => ({
      key: type,
      createView: () => {
        const cell: any = document.createElement('view');
        cell.className = 'li-cell';
        const store = createStore<Item>(data.items.find((i) => i.type === type)!);
        render(<Cell type={type} store={store} />, cell);
        cell.__store = store;
        return cell;
      },
    }));
    list.itemTemplateSelector = (item: Item) => item.type;
    list.on('itemLoading', (args: any) => args.view.__store.set(data.items[args.index]));
    list.items = data.items;
  }, [data]);
  return <ul ref={ref} className="list body" onLayoutChanged={() => controller.sentinelLayout()} />;
}
