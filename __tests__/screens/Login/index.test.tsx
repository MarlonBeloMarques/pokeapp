/* eslint-disable @typescript-eslint/unbound-method */
import * as React from 'react';
import { render } from '@testing-library/react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Platform } from 'react-native';
import auth from '@react-native-firebase/auth';
import appleAuth from '@invertase/react-native-apple-authentication';
import LoginContainer from '../../../src/screens/Login';
import Login from '../../../src/screens/Login/Login';

jest.mock('@react-native-firebase/auth', () => {
  const authInstance = {
    signInWithCredential: jest.fn(() => Promise.resolve({})),
  };

  const GoogleAuthProvider = {
    credential: jest.fn((idToken) => ({ token: idToken })),
  };

  const AppleAuthProvider = {
    credential: jest.fn((idToken) => ({
      token: idToken,
      providerId: 'any_provider_id',
      secret: 'any_secret',
    })),
  };

  const authMock = jest.fn(() => authInstance) as unknown as jest.MockedFunction<
    () => typeof authInstance
  > & {
    GoogleAuthProvider: typeof GoogleAuthProvider;
    AppleAuthProvider: typeof AppleAuthProvider;
  };

  authMock.GoogleAuthProvider = GoogleAuthProvider;
  authMock.AppleAuthProvider = AppleAuthProvider;

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
    performRequest: jest.fn().mockReturnValue({
      identityToken: 'any_identity_token',
      nonce: 'any_nonce',
    }),
    onCredentialRevoked: jest.fn(),
    Error: {
      CANCELED: 'canceled',
    },
    Operation: {
      LOGIN: 'login',
    },
    Scope: {
      EMAIL: 'email',
      FULL_NAME: 'full_name',
    },
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
    const {
      sut: { UNSAFE_getByType },
    } = makeSut();

    const view = UNSAFE_getByType(Login);

    expect(view.props.signInWithAppleEnabled).toEqual(true);
  });

  test('should the signInWithAppleEnabled return false if Platform is different to iOS', () => {
    setPlatformToAndroid();
    const {
      sut: { UNSAFE_getByType },
    } = makeSut();

    const view = UNSAFE_getByType(Login);

    expect(view.props.signInWithAppleEnabled).toEqual(false);
  });

  test('must navigate to Home correctly when calling signInGoogle function with Platform like android', async () => {
    setPlatformToAndroid();

    const {
      sut: { UNSAFE_getByType },
      navigation,
    } = makeSut();

    const view = UNSAFE_getByType(Login);

    await view.props.signInGoogle();

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Home', { isGuest: false });
  });

  test('must navigate to Home correctly when calling signInGoogle function with Platform like iOS', async () => {
    const {
      sut: { UNSAFE_getByType },
      navigation,
    } = makeSut();

    const view = UNSAFE_getByType(Login);

    await view.props.signInGoogle();
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Home', { isGuest: false });
  });

  test('should call the signInWithCredential correctly when calling the signInApple function', async () => {
    const {
      sut: { UNSAFE_getByType },
    } = makeSut();

    const view = UNSAFE_getByType(Login);

    await view.props.signInApple();

    expect(appleAuth.performRequest).toHaveBeenCalledTimes(1);

    expect(auth().signInWithCredential).toHaveBeenCalledTimes(1);
    expect(auth().signInWithCredential).toHaveBeenCalledWith({
      providerId: 'any_provider_id',
      token: 'any_identity_token',
      secret: 'any_secret',
    });
  });
});

const makeSut = () => {
  // eslint-disable-next-line @typescript-eslint/require-await
  const signInGoogleService = async (complete: () => void): Promise<void> => {
    complete();
  };
  const navigation = {
    navigate: jest.fn(),
  } as unknown as StackNavigationProp<any, any>;
  const sut = render(
    <LoginContainer
      pokemons={[]}
      navigation={navigation}
      signInGoogleService={signInGoogleService}
    />,
  );

  return { sut, navigation };
};

const setPlatformToAndroid = () => {
  Object.defineProperty(Platform, 'OS', {
    configurable: true,
    get: jest.fn(() => 'android'),
  });
};
