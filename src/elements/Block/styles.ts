import { StyleSheet } from 'react-native';
import { theme } from '../../constants';

export const backgroundColors = StyleSheet.create({
  primary: { backgroundColor: theme.colors.primary },
  secondary: { backgroundColor: theme.colors.secondary },
  white: { backgroundColor: theme.colors.white },
  black: { backgroundColor: theme.colors.black },
  gray: { backgroundColor: theme.colors.gray },
  apple: { backgroundColor: theme.colors.apple },
  guest: { backgroundColor: theme.colors.guest },
  google: { backgroundColor: theme.colors.google },
});

export const styles = StyleSheet.create({
  block: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    alignItems: 'center',
  },
  middle: {
    justifyContent: 'center',
  },
  left: {
    justifyContent: 'flex-start',
  },
  right: {
    justifyContent: 'flex-end',
  },
  top: {
    justifyContent: 'flex-start',
  },
  bottom: {
    justifyContent: 'flex-end',
  },
  shadow: {
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  border: {
    borderBottomWidth: 1,
    borderColor: theme.colors.white,
  },
  fullBorder: {
    borderWidth: 1,
    borderColor: theme.colors.white,
  },
});
