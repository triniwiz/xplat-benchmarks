import type { ComponentProps } from 'react';
import { Text as RNText } from 'react-native';

/**
 * Text laid out like the other apps and the browser reference:
 * - no system font scaling (they size text in plain dp; a device font scale
 *   such as 1.15 would otherwise enlarge only React Native's text);
 * - greedy line breaking on Android (RN defaults to 'highQuality', which
 *   balances paragraphs and wraps words earlier than browsers or NativeScript).
 */
export function Text(props: ComponentProps<typeof RNText>) {
  return <RNText allowFontScaling={false} textBreakStrategy="simple" {...props} />;
}
