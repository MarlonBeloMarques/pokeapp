import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Alert, Platform } from 'react-native';
import auth from '@react-native-firebase/auth';

const signInGoogle = async (completeWithNavigation: () => void): Promise<void> => {
  try {
    await GoogleSignin.hasPlayServices();
    const { idToken } = await GoogleSignin.signIn();

    if (Platform.OS === 'ios') {
      const credential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(credential);
      completeWithNavigation();
    } else if (Platform.OS === 'android') {
      completeWithNavigation();
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  } catch ({ code }: typeof statusCodes | Error | unknown) {
    if (code === statusCodes.SIGN_IN_CANCELLED) {
      Alert.alert('O signIn com Google foi cancelado');
    } else if (code === statusCodes.IN_PROGRESS) {
      Alert.alert('O signIn com Google está em processo');
    } else if (code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      Alert.alert('Ocorreu um erro ao realizar o signIn com Google');
    } else {
      Alert.alert('Ocorreu um erro ao realizar o signIn com Google');
    }
  }
};

export default signInGoogle;
