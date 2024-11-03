/* eslint-disable @typescript-eslint/unbound-method */
import * as React from 'react';
import { render } from '@testing-library/react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Alert, Platform } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
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

  test('must call the hasPlayServices and signIn from GoogleSignIn when calling signInGoogle function', async () => {
    const {
      sut: { UNSAFE_getByType },
    } = makeSut();

    const view = UNSAFE_getByType(Login);

    await view.props.signInGoogle();

    expect(GoogleSignin.hasPlayServices).toHaveBeenCalledTimes(1);
    expect(GoogleSignin.signIn).toHaveBeenCalledTimes(1);
  });

  test('must navigate to Home correctly when calling signInGoogle function with Platform like android', async () => {
    setPlatformToAndroid();

    const {
      sut: { UNSAFE_getByType },
      navigation,
    } = makeSut();

    const view = UNSAFE_getByType(Login);

    await view.props.signInGoogle();

    expect(GoogleSignin.hasPlayServices).toHaveBeenCalledTimes(1);
    expect(GoogleSignin.signIn).toHaveBeenCalledTimes(1);

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

    expect(GoogleSignin.hasPlayServices).toHaveBeenCalledTimes(1);
    expect(GoogleSignin.signIn).toHaveBeenCalledTimes(1);

    expect(auth.GoogleAuthProvider.credential).toHaveBeenCalledTimes(1);
    expect(auth.GoogleAuthProvider.credential).toHaveBeenCalledWith('any_id_token');

    expect(auth().signInWithCredential).toHaveBeenCalledTimes(1);
    expect(auth().signInWithCredential).toHaveBeenCalledWith({ token: 'any_id_token' });

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Home', { isGuest: false });
  });

  test.each([
    {
      code: 'sign_in_cancelled',
      message: 'O signIn com Google foi cancelado',
    },
    {
      code: 'unexpected_error',
      message: 'Ocorreu um erro ao realizar o signIn com Google',
    },
    {
      code: statusCodes.IN_PROGRESS,
      message: 'O signIn com Google está em processo',
    },
    {
      code: 'play_services_not_available',
      message: 'Ocorreu um erro ao realizar o signIn com Google',
    },
  ])(
    'should call alert from Alert when hasPlayServices from GoogleSignIn return exception',
    async (statusCodeError) => {
      hasPlayServicesMock(statusCodeError.code);
      const alertSpy = jest.spyOn(Alert, 'alert');

      const {
        sut: { UNSAFE_getByType },
      } = makeSut();

      const view = UNSAFE_getByType(Login);

      await view.props.signInGoogle();

      expect(alertSpy).toHaveBeenCalledTimes(1);
      expect(alertSpy).toHaveBeenCalledWith(statusCodeError.message);
    },
  );
});

const makeSut = () => {
  const navigation = {
    navigate: jest.fn(),
  } as unknown as StackNavigationProp<any, any>;
  const sut = render(<LoginContainer pokemons={[]} navigation={navigation} />);

  return { sut, navigation };
};

const hasPlayServicesMock = (code: string) => {
  (GoogleSignin.hasPlayServices as jest.Mock).mockImplementationOnce(() => {
    throw new GoogleSignInError('google sign in error', 'Ocorreu um erro', '', code);
  });
};

const setPlatformToAndroid = () => {
  Object.defineProperty(Platform, 'OS', {
    configurable: true,
    get: jest.fn(() => 'android'),
  });
};

class GoogleSignInError extends Error {
  code? = '';

  constructor(name: string, message: string, stack?: string, code?: string) {
    super();
    this.name = name;
    this.message = message;
    this.stack = stack;
    this.code = code;
  }
}
