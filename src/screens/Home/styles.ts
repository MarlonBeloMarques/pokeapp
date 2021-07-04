import { StyleSheet } from 'react-native';
import { theme } from '../../constants';

export default StyleSheet.create({
  buttonDetail: {
    borderRadius: theme.sizes.radius,
    paddingHorizontal: theme.sizes.base,
    paddingVertical: theme.sizes.caption / 2,
    marginRight: theme.sizes.caption,
  },
});
