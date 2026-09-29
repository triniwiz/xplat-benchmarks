import type { ListData, ListItem } from './shared/generate';
import { sentinelLayout } from './bench';

function Badges({ item }: { item: ListItem }) {
  return (
    <view className="badges">
      {item.badges.map((b, i) => (
        <text key={i} className={`badge bgl-${item.color}`}>
          {b}
        </text>
      ))}
    </view>
  );
}

function TextCol({ item, badges }: { item: ListItem; badges: boolean }) {
  return (
    <view className="li-text">
      <text className="li-title">{item.title}</text>
      <text className="li-sub">{item.subtitle}</text>
      {badges ? <Badges item={item} /> : null}
    </view>
  );
}

function Item({ item }: { item: ListItem }) {
  if (item.type !== 'c') {
    return (
      <view className="li-row">
        <view className={`${item.type === 'b' ? 'thumb' : 'avatar'} bg-${item.color}`} />
        <TextCol item={item} badges={item.type === 'b'} />
        <text className="li-meta">{item.meta}</text>
      </view>
    );
  }
  return (
    <view className="li-card">
      <view className="li-card-head">
        <view className={`avatar bg-${item.color}`} />
        <TextCol item={item} badges={false} />
        <text className="li-meta">{item.meta}</text>
      </view>
      <text className="li-body">{item.body}</text>
      <Badges item={item} />
    </view>
  );
}

export function List({ data }: { data: ListData }) {
  return (
    <list className="list body" scroll-orientation="vertical" list-type="single" span-count={1} bindlayoutchange={sentinelLayout}>
      {data.items.map((item) => (
        <list-item key={item.id} item-key={String(item.id)} reuse-identifier={item.type} className="li-cell">
          <Item item={item} />
        </list-item>
      ))}
    </list>
  );
}
