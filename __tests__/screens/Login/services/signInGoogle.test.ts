/* eslint-disable @typescript-eslint/unbound-method */
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import signInGoogle from '../../../../src/screens/Login/services/signInGoogle';

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

afterEach(() => {
  jest.clearAllMocks();
});

describe('Login: SignInGoogle', () => {
  test('must call the hasPlayServices and signIn from GoogleSignIn when calling signInGoogle function', async () => {
    await signInGoogle(() => {});

    expect(GoogleSignin.hasPlayServices).toHaveBeenCalledTimes(1);
    expect(GoogleSignin.signIn).toHaveBeenCalledTimes(1);
  });

  test('must call the credential and signInWithCredential from auth when calling signInGoogle function', async () => {
    await signInGoogle(() => {});

    expect(GoogleSignin.hasPlayServices).toHaveBeenCalledTimes(1);
    expect(GoogleSignin.signIn).toHaveBeenCalledTimes(1);

    expect(auth.GoogleAuthProvider.credential).toHaveBeenCalledTimes(1);
    expect(auth.GoogleAuthProvider.credential).toHaveBeenCalledWith('any_id_token');

    expect(auth().signInWithCredential).toHaveBeenCalledTimes(1);
    expect(auth().signInWithCredential).toHaveBeenCalledWith({ token: 'any_id_token' });
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

      await signInGoogle(() => {});

      await signInGoogle(() => {});

      expect(alertSpy).toHaveBeenCalledTimes(1);
      expect(alertSpy).toHaveBeenCalledWith(statusCodeError.message);
    },
  );
});

const hasPlayServicesMock = (code: string) => {
  (GoogleSignin.hasPlayServices as jest.Mock).mockImplementationOnce(() => {
    throw new GoogleSignInError('google sign in error', 'Ocorreu um erro', '', code);
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
