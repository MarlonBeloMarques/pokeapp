import { StyleSheet } from 'react-native';
import { theme } from '../../constants';

export const colors = StyleSheet.create({
  primary: { color: theme.colors.primary },
  secondary: { color: theme.colors.secondary },
  white: { color: theme.colors.white },
  black: { color: theme.colors.black },
  gray: { color: theme.colors.gray },
  apple: { color: theme.colors.apple },
  guest: { color: theme.colors.guest },
  google: { color: theme.colors.google },
});

export const styles = StyleSheet.create({
  // default style
  text: {
    fontSize: theme.sizes.font,
    color: theme.colors.white,
  },
  // variations
  stylized: {
    fontFamily: 'Pokemon Solid',
  },
  regular: {
    fontWeight: 'normal',
  },
  bold: {
    fontWeight: 'bold',
  },
  semibold: {
    fontWeight: '500',
  },
  medium: {
    fontWeight: '500',
  },
  light: {
    fontWeight: '200',
  },
  // position
  center: { textAlign: 'center' },
  right: { textAlign: 'right' },
  // fonts
  h1: theme.fonts.h1,
  h2: theme.fonts.h2,
  h3: theme.fonts.h3,
  title: theme.fonts.title,
  body: theme.fonts.body,
  caption: theme.fonts.caption,
});
