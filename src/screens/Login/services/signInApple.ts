import appleAuth from '@invertase/react-native-apple-authentication';
import { Alert, Platform } from 'react-native';
import auth from '@react-native-firebase/auth';

const signInApple = async (completeWithNavigation: () => void) => {
  try {
    if (Platform.OS === 'ios') {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const { identityToken, nonce } = appleAuthRequestResponse;

      if (identityToken) {
        const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

        await auth().signInWithCredential(appleCredential);
        completeWithNavigation();
      } else {
        console.warn('Apple Sign-In failed - no identify token returned');
      }
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  } catch ({ code }: typeof appleAuth.Error | Error | unknown) {
    if (code === appleAuth.Error.CANCELED) {
      Alert.alert('O signIn com Apple foi cancelado');
    } else {
      Alert.alert('Ocorreu um erro ao realizar o signIn com Apple');
    }
  }
};

export default signInApple;
