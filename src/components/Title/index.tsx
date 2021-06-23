import React from 'react';
import styles from './styles';
import { Text } from '../../elements';
import { theme } from '../../constants';

const Title: React.FC = () => (
  <Text style={styles.title} stylized>
    PokeApp
  </Text>
);

export default Title;
