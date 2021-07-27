import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NavigationProp } from '@react-navigation/native';

export const signOut = async (navigation: NavigationProp<any, any>) => {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    navigation.goBack();
  } catch (error) {
    console.error(error);
    navigation.goBack();
  }
};
