import { StyleSheet } from 'react-native';
import { colors, fontSizes, palette, paletteLight } from './shared/tokens';

const lh = (size: number) => Math.round(size * 1.4);

export const bg = palette.map((c) => ({ backgroundColor: c }));
export const bgl = paletteLight.map((c) => ({ backgroundColor: c }));
export const bc = palette.map((c) => ({ borderColor: c }));
export const fs = fontSizes.map((s) => ({ fontSize: s, lineHeight: lh(s) }));

export const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  status: { height: 24, fontSize: 11, color: colors.muted, paddingVertical: 4, paddingHorizontal: 8, backgroundColor: colors.surface },
  body: { flex: 1 },
  sentinel: { height: 1, backgroundColor: colors.bg },

  home: { padding: 12 },
  homeTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  homeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  homeLabel: { flex: 1, fontSize: 13, color: colors.text },
  homeBtn: { fontSize: 12, paddingVertical: 4, paddingHorizontal: 10, marginLeft: 4, borderRadius: 4, backgroundColor: '#D0EBFF', color: colors.text, overflow: 'hidden' },

  chain: { paddingTop: 1, paddingBottom: 1, paddingLeft: 1, borderLeftWidth: 1 },
  chainLabel: { fontSize: 12, color: colors.text, padding: 4 },

  tn: { padding: 1, borderWidth: 1 },
  tnRestyled: { padding: 3, borderColor: colors.accent },
  row: { flexDirection: 'row' },
  inRow: { flex: 1 },
  leaf: { height: 12 },

  tiles: { flexDirection: 'row', flexWrap: 'wrap', padding: 4 },
  tile: { width: 88, margin: 4, padding: 8, borderRadius: 8 },
  tileTitle: { fontSize: 14, fontWeight: 'bold', color: colors.text },
  tileSub: { fontSize: 12, color: colors.muted },

  dashHeader: { height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, backgroundColor: colors.surface, borderBottomWidth: 1, borderColor: colors.border },
  dashTitle: { flex: 1, fontSize: 16, fontWeight: 'bold', color: colors.text },
  pill: { marginLeft: 4, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 999, backgroundColor: colors.bg, fontSize: 12, color: colors.text, overflow: 'hidden' },
  dashBody: { flexDirection: 'row' },
  dashNav: { width: 96, paddingVertical: 8, backgroundColor: colors.surface, borderRightWidth: 1, borderColor: colors.border },
  navItem: { paddingVertical: 8, paddingHorizontal: 12, fontSize: 12, color: colors.muted },
  navActive: { color: colors.accent, fontWeight: 'bold', backgroundColor: paletteLight[4] },
  dashMain: { flex: 1 },
  dashStats: { padding: 4 },
  statRow: { flexDirection: 'row' },
  stat: { flex: 1, margin: 4, padding: 8, borderRadius: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  statLabel: { fontSize: 12, color: colors.muted },
  statValue: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  statDelta: { fontSize: 12 },
  up: { color: colors.positive },
  down: { color: colors.negative },
  bars: { flexDirection: 'row', alignItems: 'flex-end', height: 40, marginTop: 4 },
  bar: { flex: 1, marginHorizontal: 1, borderRadius: 2, backgroundColor: colors.accent },
  dashTable: { paddingVertical: 4, paddingHorizontal: 8 },
  trow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderColor: colors.border },
  cellName: { flex: 2, flexDirection: 'row', alignItems: 'center' },
  cellCol: { flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  cell: { fontSize: 12, color: colors.text },
  bold: { fontWeight: 'bold' },

  textFlow: { padding: 12 },
  para: { marginBottom: 8, color: colors.text },
  ls: { letterSpacing: 0.5 },

  cards: { padding: 4 },
  card: { margin: 8, backgroundColor: colors.surface },
  cardInner: { padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  cardBody: { fontSize: 14, lineHeight: 20, color: colors.muted, marginTop: 4 },
  white: { color: '#FFFFFF' },
  chips: { flexDirection: 'row', marginTop: 8 },
  chip: { paddingVertical: 2, paddingHorizontal: 8, marginRight: 4, borderRadius: 999, fontSize: 12, color: colors.text, overflow: 'hidden' },
  v0: { borderRadius: 12, boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)' },
  v1: { borderTopLeftRadius: 16, borderBottomRightRadius: 16, borderWidth: 2 },
  v2: { borderRadius: 8 },
  v3: { borderTopWidth: 4, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: colors.border },
  v4: { opacity: 0.85, transform: [{ rotate: '-1deg' }, { scale: 0.98 }], borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  v5: { borderRadius: 12, overflow: 'hidden' },
  band: { height: 24 },

  list: { flex: 1, backgroundColor: colors.bg },
  liRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, backgroundColor: colors.surface, borderBottomWidth: 1, borderColor: colors.border },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 12 },
  thumb: { width: 56, height: 56, borderRadius: 8, marginRight: 12 },
  liText: { flex: 1 },
  liTitle: { fontSize: 14, fontWeight: 'bold', color: colors.text },
  liSub: { fontSize: 12, color: colors.muted },
  liMeta: { fontSize: 12, color: colors.muted, marginLeft: 8 },
  badges: { flexDirection: 'row', marginTop: 4 },
  badge: { paddingVertical: 2, paddingHorizontal: 6, marginRight: 4, borderRadius: 4, fontSize: 10, color: colors.text, overflow: 'hidden' },
  liCard: { marginVertical: 8, marginHorizontal: 12, padding: 12, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  liCardHead: { flexDirection: 'row', alignItems: 'center' },
  liBody: { fontSize: 14, lineHeight: 20, color: colors.text, marginTop: 8 },
});
