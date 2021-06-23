import React from 'react';
import styles from './styles';
import { Text } from '../../elements';

const Title: React.FC = () => (
  <Text style={styles.title} h1 stylized>
    PokeApp
  </Text>
);

export default Title;
