// Design tokens shared by every app and the browser reference. All lengths are
// density-independent units (CSS px on the web, dp on Android, pt on iOS).
// NativeScript core treats `px` as *device* pixels, so NS core styles must use
// unitless values; Mason treats `px` as CSS px.

export const colors = {
  bg: '#F5F6FA',
  surface: '#FFFFFF',
  border: '#D0D4E0',
  text: '#1F2330',
  muted: '#6B7185',
  accent: '#3B5BDB',
  positive: '#2F9E44',
  negative: '#E03131',
} as const;

export const palette = [
  '#E03131', '#F08C00', '#2F9E44', '#1098AD',
  '#1C7ED6', '#7048E8', '#C2255C', '#5C940D',
] as const;

export const paletteLight = [
  '#FFE3E3', '#FFF3BF', '#D3F9D8', '#C5F6FA',
  '#D0EBFF', '#E5DBFF', '#FFDEEB', '#E9FAC8',
] as const;

export const space = { xs: 2, sm: 4, md: 8, lg: 12, xl: 16 } as const;

export const radius = { sm: 4, md: 8, lg: 12, pill: 999 } as const;

/** Paragraph font sizes indexed by `Paragraph.size`. */
export const fontSizes = [12, 14, 16, 20] as const;

export const font = { xs: 10, sm: 12, md: 14, lg: 16, xl: 20 } as const;
