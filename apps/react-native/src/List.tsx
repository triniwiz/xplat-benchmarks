import { FlashList } from '@shopify/flash-list';
import { View } from 'react-native';
import { Text } from './Text';
import type { ListData, ListItem } from './shared/generate';
import { sentinelLayout } from './bench';
import { bg, bgl, s } from './styles';

function Badges({ item }: { item: ListItem }) {
  return (
    <View style={s.badges}>
      {item.badges.map((b, i) => (
        <Text key={i} style={[s.badge, bgl[item.color]]}>
          {b}
        </Text>
      ))}
    </View>
  );
}

function TextCol({ item, badges }: { item: ListItem; badges: boolean }) {
  return (
    <View style={s.liText}>
      <Text style={s.liTitle}>{item.title}</Text>
      <Text style={s.liSub}>{item.subtitle}</Text>
      {badges ? <Badges item={item} /> : null}
    </View>
  );
}

function Item({ item }: { item: ListItem }) {
  if (item.type !== 'c') {
    return (
      <View style={s.liRow}>
        <View style={[item.type === 'b' ? s.thumb : s.avatar, bg[item.color]]} />
        <TextCol item={item} badges={item.type === 'b'} />
        <Text style={s.liMeta}>{item.meta}</Text>
      </View>
    );
  }
  return (
    <View style={s.liCard}>
      <View style={s.liCardHead}>
        <View style={[s.avatar, bg[item.color]]} />
        <TextCol item={item} badges={false} />
        <Text style={s.liMeta}>{item.meta}</Text>
      </View>
      <Text style={s.liBody}>{item.body}</Text>
      <Badges item={item} />
    </View>
  );
}

export function List({ data }: { data: ListData }) {
  return (
    <View style={s.list} onLayout={sentinelLayout}>
      <FlashList
        data={data.items}
        keyExtractor={(item) => String(item.id)}
        getItemType={(item) => item.type}
        renderItem={({ item }) => <Item item={item} />}
      />
    </View>
  );
}
