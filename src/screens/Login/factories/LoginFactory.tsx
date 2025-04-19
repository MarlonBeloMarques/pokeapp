import * as React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import Login from '../index';
import signInGoogle from '../services/signInGoogle';
import signInApple from '../services/signInApple';

interface Props {
  pokemons: Array<{ id: number; image: string }>;
  navigation: StackNavigationProp<any, any>;
}

const LoginFactory: React.FC<Props> = (props) => (
  <Login {...props} signInGoogleService={signInGoogle} signInAppleService={signInApple} />
);

export default LoginFactory;
