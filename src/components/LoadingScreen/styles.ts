import { StyleSheet } from 'react-native';
import { theme } from '../../constants';

export default StyleSheet.create({
  wrapperLoading: {
    borderColor: theme.colors.primary,
    borderBottomWidth: 3,
  },
  titleBottom: {
    bottom: 0,
    alignSelf: 'center',
    paddingBottom: theme.sizes.padding * 2,
  },
});
