/* eslint-disable @typescript-eslint/unbound-method */
import * as React from 'react';
import { render } from '@testing-library/react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import LoginContainer from '../../../src/screens/Login';
import Login from '../../../src/screens/Login/Login';

jest.mock('@react-native-firebase/auth', () => {
  const authInstance = {
    signInWithCredential: jest.fn((_) =>
      // eslint-disable-next-line prettier/prettier
      Promise.resolve({ user: { id: 'fakeUserId', email: 'fakeUser@example.com' } }),
    ),
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

jest.mock('@react-native-community/async-storage', () => {});

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

  test('must call the hasPlayServices and signIn from GoogleSignIn when calling signInGoogle function', async () => {
    const { UNSAFE_getByType } = render(
      <LoginContainer pokemons={[]} navigation={{} as StackNavigationProp<any, any>} />,
    );

    const view = UNSAFE_getByType(Login);

    await view.props.signInGoogle();

    expect(GoogleSignin.hasPlayServices).toHaveBeenCalledTimes(1);
    expect(GoogleSignin.signIn).toHaveBeenCalledTimes(1);
  });

  test('must navigate to Home correctly when calling signInGoogle function with Platform like android', async () => {
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      get: jest.fn(() => 'android'),
    });

    const navigation = {
      navigate: jest.fn(),
    } as unknown as StackNavigationProp<any, any>;

    const { UNSAFE_getByType } = render(<LoginContainer pokemons={[]} navigation={navigation} />);

    const view = UNSAFE_getByType(Login);

    await view.props.signInGoogle();

    expect(GoogleSignin.hasPlayServices).toHaveBeenCalledTimes(1);
    expect(GoogleSignin.signIn).toHaveBeenCalledTimes(1);

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Home', { isGuest: false });
  });

  test('must navigate to Home correctly when calling signInGoogle function with Platform like iOS', async () => {
    const navigation = {
      navigate: jest.fn(),
    } as unknown as StackNavigationProp<any, any>;

    const { UNSAFE_getByType } = render(<LoginContainer pokemons={[]} navigation={navigation} />);

    const view = UNSAFE_getByType(Login);

    await view.props.signInGoogle();

    expect(GoogleSignin.hasPlayServices).toHaveBeenCalledTimes(1);
    expect(GoogleSignin.signIn).toHaveBeenCalledTimes(1);

    expect(auth.GoogleAuthProvider.credential).toHaveBeenCalledTimes(1);
    expect(auth.GoogleAuthProvider.credential).toHaveBeenCalledWith('any_id_token');

    expect(auth().signInWithCredential).toHaveBeenCalledTimes(1);
    expect(auth().signInWithCredential).toHaveBeenCalledWith({ token: 'any_id_token' });

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Home', { isGuest: false });
  });
});
