import * as React from 'react';
import { render } from '@testing-library/react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import LoginFactory from '../../../../src/screens/Login/factories/LoginFactory';

jest.mock('@react-native-firebase/auth', () => {
  const authInstance = {
    signInWithCredential: jest.fn(() => Promise.resolve({})),
  };

  const GoogleAuthProvider = {
    credential: jest.fn((idToken) => ({ token: idToken })),
  };

  const authMock = jest.fn(() => authInstance) as unknown as jest.MockedFunction<
    () => typeof authInstance
  > & {
    GoogleAuthProvider: typeof GoogleAuthProvider;
  };

  authMock.GoogleAuthProvider = GoogleAuthProvider;

  return authMock;
});

jest.mock('@react-native-google-signin/google-signin', () => ({
  statusCodes: {
    SIGN_IN_CANCELLED: 'sign_in_cancelled',
  },
  GoogleSignin: {
    configure: () => {},
    hasPlayServices: jest.fn(),
    signIn: jest.fn().mockReturnValue(Promise.resolve({ idToken: 'any_id_token' })),
  },
}));

jest.mock('@react-native-community/async-storage', () => {});

jest.mock('@invertase/react-native-apple-authentication', () => ({
  __esModule: true,
  default: {
    performRequest: jest.fn(),
    onCredentialRevoked: jest.fn(),
  },
  appleAuthAndroid: {
    signIn: jest.fn(),
  },
}));

describe('Login: Factory', () => {
  test('should to factory the Login correctly', () => {
    const navigation = {
      navigate: jest.fn(),
    } as unknown as StackNavigationProp<any, any>;

    render(<LoginFactory pokemons={[]} navigation={navigation} />);
  });
});
