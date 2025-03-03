/* eslint-disable @typescript-eslint/unbound-method */
import * as React from 'react';
import { render } from '@testing-library/react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Platform } from 'react-native';
import LoginContainer from '../../../src/screens/Login';
import Login from '../../../src/screens/Login/Login';

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
    } = makeSut({});

    const view = UNSAFE_getByType(Login);

    expect(view.props.signInWithAppleEnabled).toEqual(true);
  });

  test('should the signInWithAppleEnabled return false if Platform is different to iOS', () => {
    setPlatformToAndroid();
    const {
      sut: { UNSAFE_getByType },
    } = makeSut({});

    const view = UNSAFE_getByType(Login);

    expect(view.props.signInWithAppleEnabled).toEqual(false);
  });

  test('must navigate to Home correctly when calling signInGoogle function with Platform like android', async () => {
    setPlatformToAndroid();
    // eslint-disable-next-line @typescript-eslint/require-await
    const signInGoogleService = async (complete: () => void): Promise<void> => {
      complete();
    };
    const {
      sut: { UNSAFE_getByType },
      navigation,
    } = makeSut({ signInGoogleService });

    const view = UNSAFE_getByType(Login);

    await view.props.signInGoogle();

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Home', { isGuest: false });
  });

  test('must navigate to Home correctly when calling signInGoogle function with Platform like iOS', async () => {
    // eslint-disable-next-line @typescript-eslint/require-await
    const signInGoogleService = async (complete: () => void): Promise<void> => {
      complete();
    };

    const {
      sut: { UNSAFE_getByType },
      navigation,
    } = makeSut({ signInGoogleService });

    const view = UNSAFE_getByType(Login);

    await view.props.signInGoogle();
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Home', { isGuest: false });
  });
});

type Props = {
  signInGoogleService?: (complete: () => void) => Promise<void>;
};

const makeSut = ({ signInGoogleService = async () => {} }: Props) => {
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
