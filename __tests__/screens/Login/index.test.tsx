import * as React from 'react';
import { render } from '@testing-library/react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import LoginContainer from '../../../src/screens/Login';
import Login from '../../../src/screens/Login/Login';

jest.mock('@react-native-community/async-storage', () => {});

jest.mock('@react-native-google-signin/google-signin', () => ({
  statusCodes: {
    SIGN_IN_CANCELLED: 'sign_in_cancelled',
    // Adicione outras propriedades que seu código usa
  },
  GoogleSignin: {
    configure: () => {},
    hasPlayServices: jest.fn(),
    signIn: jest.fn(),
  },
}));

jest.mock('@invertase/react-native-apple-authentication', () => ({
  __esModule: true, // Garante que a exportação do módulo seja considerada como ESModule
  default: {
    performRequest: jest.fn(),
    onCredentialRevoked: jest.fn(),
    // Adicione outros métodos/propriedades de appleAuth conforme necessário
  },
  appleAuthAndroid: {
    signIn: jest.fn(),
    // Adicione outros métodos/propriedades de appleAuthAndroid conforme necessário
  },
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('Login: Presenter', () => {
  const originalPlatform = Platform.OS;

  beforeEach(() => {
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      get: jest.fn(() => originalPlatform),
    });
  });

  test('should the signInWithAppleEnabled return true if Platform is equal to iOS', () => {
    const { UNSAFE_getByType } = render(
      <LoginContainer pokemons={[]} navigation={{} as StackNavigationProp<any, any>} />,
    );

    const view = UNSAFE_getByType(Login);

    expect(view.props.signInWithAppleEnabled).toEqual(true);
  });

  test('should the signInWithAppleEnabled return false if Platform is different to iOS', () => {
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      get: jest.fn(() => 'android'),
    });
    const { UNSAFE_getByType } = render(
      <LoginContainer pokemons={[]} navigation={{} as StackNavigationProp<any, any>} />,
    );

    const view = UNSAFE_getByType(Login);

    expect(view.props.signInWithAppleEnabled).toEqual(false);
  });

  test('must call the hasPlayServices and signIn from GoggleSignIn when calling signInGoogle function', async () => {
    const { UNSAFE_getByType } = render(
      <LoginContainer pokemons={[]} navigation={{} as StackNavigationProp<any, any>} />,
    );

    const view = UNSAFE_getByType(Login);

    await view.props.signInGoogle();

    expect(GoogleSignin.hasPlayServices).toHaveBeenCalledTimes(1);
    expect(GoogleSignin.signIn).toHaveBeenCalledTimes(1);
  });
});
