/**
 * Themed wrappers for Text and View that auto-switch
 * between light/dark theme colors from the design token system.
 */
import { Text as DefaultText, View as DefaultView } from 'react-native';
import { useColorScheme } from './useColorScheme';
import Colors from '@/constants/Colors';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps  = ThemeProps & DefaultText['props'];
export type ViewProps  = ThemeProps & DefaultView['props'];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorKey: 'text' | 'bg' | 'surface' | 'border'
) {
  const scheme = useColorScheme() ?? 'light';
  const fromProps = props[scheme as 'light' | 'dark'];
  if (fromProps) return fromProps;
  return scheme === 'dark' ? Colors.dark[colorKey] : Colors.light[colorKey];
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...rest } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  return <DefaultText style={[{ color }, style]} {...rest} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...rest } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'bg');
  return <DefaultView style={[{ backgroundColor }, style]} {...rest} />;
}
