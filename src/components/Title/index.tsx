import * as React from 'react';
import styles from './styles';
import { Text } from '../../elements';
import { theme } from '../../constants';

interface Props {
  size?: number | undefined;
}

const Title: React.FC<Props> = ({ size }) => (
  <Text style={[styles.title, { fontSize: size }]} stylized>
    PokeApp
  </Text>
);

Title.defaultProps = {
  size: theme.sizes.h1 * 1.4,
};

export default Title;
