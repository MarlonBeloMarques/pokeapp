import * as React from 'react';
import { Platform } from 'react-native';
import styles from './styles';
import { Block, Text } from '../../elements';
import { theme } from '../../constants';

interface Props {
  size?: number | undefined;
}

const Title: React.FC<Props> = ({ size }) => {
  if (Platform.OS === 'ios') {
    return (
      <Text style={[styles.titleIOS, { fontSize: size }]} stylized>
        PokeApp
      </Text>
    );
  }
  return (
    <Block>
      <Text style={[styles.titleAndroidPrimary, { fontSize: size }]} stylized>
        PokeApp
      </Text>
      <Text style={[styles.titleAndroidSecondary, { fontSize: size && size + 1.5 }]} stylized>
        PokeApp
      </Text>
    </Block>
  );
};

Title.defaultProps = {
  size: theme.sizes.h1 * 1.4,
};

export default Title;
