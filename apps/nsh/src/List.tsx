import { List as NshList, Text, View } from 'nsh';
import { sentinelLayout } from './bench';
import type { ListData, ListItem } from './shared/generate';
import { bg, bgl, s } from './styles';

type Item = () => ListItem;

function Badges(props: { item: Item }) {
  return (
    <View style={s.badges}>
      <Each of={props.item().badges} key="index">
        {(b) => <Text style={[s.badge, bgl[props.item().color]]}>{b()}</Text>}
      </Each>
    </View>
  );
}

function TextCol(props: { item: Item; badges: boolean }) {
  return (
    <View style={s.liText}>
      <Text style={s.liTitle}>{props.item().title}</Text>
      <Text style={s.liSub}>{props.item().subtitle}</Text>
      <If when={props.badges}>
        <Badges item={props.item} />
      </If>
    </View>
  );
}

function Row(props: { item: Item }) {
  return (
    <View style={s.liRow}>
      <View style={[props.item().type === 'b' ? s.thumb : s.avatar, bg[props.item().color]]} />
      <TextCol item={props.item} badges={props.item().type === 'b'} />
      <Text style={s.liMeta}>{props.item().meta}</Text>
    </View>
  );
}

function CardItem(props: { item: Item }) {
  return (
    <View style={s.liCard}>
      <View style={s.liCardHead}>
        <View style={[s.avatar, bg[props.item().color]]} />
        <TextCol item={props.item} badges={false} />
        <Text style={s.liMeta}>{props.item().meta}</Text>
      </View>
      <Text style={s.liBody}>{props.item().body}</Text>
      <Badges item={props.item} />
    </View>
  );
}

export function List(props: { data: ListData }) {
  return (
    <NshList each={props.data.items} estimatedItemSize={80} style={s.list} onLayout={sentinelLayout}>
      {(item) => (
        <If when={item().type === 'c'} else={<Row item={item} />}>
          <CardItem item={item} />
        </If>
      )}
    </NshList>
  );
}
