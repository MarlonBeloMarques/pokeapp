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
  button: {
    height: theme.sizes.base * 3.5,
    justifyContent: 'center',
    marginVertical: theme.sizes.padding / 3,
    marginTop: theme.sizes.base / 2,
  },
  shadow: {
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 3,
  },
});
