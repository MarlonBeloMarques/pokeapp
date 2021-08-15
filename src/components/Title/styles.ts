import { StyleSheet } from 'react-native';
import { theme } from '../../constants';

export default StyleSheet.create({
  titleIOS: {
    color: theme.colors.primary,
    shadowColor: theme.colors.secondary,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0.1,
    elevation: 3,
  },
  titleAndroidPrimary: {
    color: theme.colors.primary,
    position: 'absolute',
    zIndex: 10,
  },
  titleAndroidSecondary: {
    color: theme.colors.secondary,
    left: -3,
  },
});
