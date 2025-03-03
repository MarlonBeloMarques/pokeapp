import * as React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import Login from '../index';

interface Props {
  pokemons: Array<{ id: number; image: string }>;
  navigation: StackNavigationProp<any, any>;
}

const LoginFactory: React.FC<Props> = (props: Props) => <Login {...props} />;

export default LoginFactory;
