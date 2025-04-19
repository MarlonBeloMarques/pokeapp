/* eslint-disable @typescript-eslint/unbound-method */
import appleAuth from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import signInApple from '../../../../src/screens/Login/services/signInApple';

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

jest.mock('@invertase/react-native-apple-authentication', () => ({
  __esModule: true,
  default: {
    performRequest: jest.fn().mockReturnValue({
      identityToken: 'any_identity_token',
      nonce: 'any_nonce',
    }),
    onCredentialRevoked: jest.fn(),
    Error: {
      CANCELED: '1001',
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

describe('Login: SignInApple', () => {
  test('should call the signInWithCredential correctly when calling the signInApple function', async () => {
    await signInApple(() => {});

    expect(appleAuth.performRequest).toHaveBeenCalledTimes(1);

    expect(auth().signInWithCredential).toHaveBeenCalledTimes(1);
    expect(auth().signInWithCredential).toHaveBeenCalledWith({
      providerId: 'any_provider_id',
      token: 'any_identity_token',
      secret: 'any_secret',
    });
  });

  test('should not call the signInWithCredential when calling the signInApple when identityToken is undefined', async () => {
    const identityToken = undefined;
    performRequestMock(identityToken!);

    await signInApple(() => {});

    expect(appleAuth.performRequest).toHaveBeenCalledTimes(1);

    expect(auth().signInWithCredential).not.toHaveBeenCalled();
  });

  test.each([
    {
      code: '1001',
      message: 'O signIn com Apple foi cancelado',
    },
    {
      code: '1002',
      message: 'Ocorreu um erro ao realizar o signIn com Apple',
    },
  ])(
    'should not call the signInWithCredential when calling the signInApple when it throws an error',
    async (statusCodeError) => {
      performRequestMockThrowError(statusCodeError.code);
      const alertSpy = jest.spyOn(Alert, 'alert');

      await signInApple(() => {});

      expect(appleAuth.performRequest).toHaveBeenCalledTimes(1);

      expect(auth().signInWithCredential).not.toHaveBeenCalled();

      expect(alertSpy).toHaveBeenCalledTimes(1);
      expect(alertSpy).toHaveBeenCalledWith(statusCodeError.message);
    },
  );
});

const performRequestMock = (identityToken: string) => {
  (appleAuth.performRequest as jest.Mock).mockImplementationOnce(() => ({
    identityToken,
    nonce: '',
  }));
};

const performRequestMockThrowError = (code: string) => {
  (appleAuth.performRequest as jest.Mock).mockImplementationOnce(() => {
    throw new AppleSignInError(code);
  });
};

class AppleSignInError extends Error {
  code? = '';

  constructor(code?: string) {
    super();
    this.code = code;
  }
}
