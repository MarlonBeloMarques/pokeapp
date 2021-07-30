import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import RadialGradient from 'react-native-radial-gradient';
import { Animated, Dimensions } from 'react-native';
import ImageColors from 'react-native-image-colors';
import { AndroidImageColors, IOSImageColors } from 'react-native-image-colors/lib/typescript/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { darken } from 'polished';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import appleAuth from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import { WEB_CLIENT_ID_GOOGLE } from '@env';
import { theme } from '../../constants';
import { Block, Button, Photo, Text } from '../../elements';
import { Title, LoadingScreen } from '../../components';
import '../../../config/Reactotron';

const { width, height } = Dimensions.get('screen');
const minutes = 10000;

interface Props {
  pokemons: Array<{ id: number; image: string }>;
  navigation: StackNavigationProp<any, any>;
}

const Login: React.FC<Props> = ({ pokemons, navigation }) => {
  const [previousColor, setPreviousColor] = useState<IOSImageColors | AndroidImageColors>();
  const [currentColor, setCurrentColor] = useState<IOSImageColors | AndroidImageColors>();
  const [urlImage, setUrlImage] = useState('');
  const [loadingProgress] = useState(new Animated.Value(0));
  const [opacityProgress] = useState(new Animated.Value(0));
  const [loadingFinished, setLoadingFinished] = useState(false);

  const [loadingScreen, setLoadingScreen] = useState(true);

  const [loggedIn, setloggedIn] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'],
      webClientId: WEB_CLIENT_ID_GOOGLE,
      offlineAccess: true,
    });
  }, []);

  useEffect(() => {
    const showImages = async (): Promise<void> => {
      getImageColors(pokemons[0].id, setCurrentColor);
      setUrlImage(pokemons[0].image);

      setTimeout(() => {
        setLoadingScreen(false);
      }, 1000);

      for (let cont = 1; cont <= 3; cont += 1) {
        runsAnimations();
        await timeout();

        getImageColors(pokemons[cont === 0 ? 3 : cont - 1].id, setPreviousColor);
        getImageColors(pokemons[cont].id, setCurrentColor);
        setUrlImage(pokemons[cont].image);

        if (cont === 3) {
          cont = -1;
        }

        setLoadingFinished(false);
        loadingProgress.setValue(0);
        opacityProgress.setValue(0);
      }
    };

    showImages();
  }, []);

  const runsAnimations = (): void => {
    Animated.timing(loadingProgress, {
      toValue: 1,
      duration: 600,
      useNativeDriver: false,
    }).start(() => {
      setLoadingFinished(true);
      Animated.timing(opacityProgress, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }).start();
    });
  };

  const timeout = () => new Promise((resolve) => setTimeout(resolve, minutes));

  const getImageColors = async (
    pokemonId: number,
    colorChange: React.Dispatch<React.SetStateAction<any>>,
  ): Promise<void> => {
    const colors = await ImageColors.getColors(
      pokemons.filter((pokemon) => pokemon.id === pokemonId)[0].image,
      {
        cache: true,
      },
    );

    if (colors.platform === 'ios') {
      colorChange(colors);
    } else {
      colorChange(colors);
    }
  };

  const getBackgroundColors = (
    colorImage: IOSImageColors | AndroidImageColors | undefined,
  ): Array<string | undefined> => {
    if (colorImage !== undefined) {
      if (colorImage.platform === 'ios') {
        return [colorImage.background, darken(0.3, colorImage.background)];
      }

      return [colorImage.average, darken(0.3, colorImage.average)];
    }

    return ['#FFE274', darken(0.3, '#FFE274')];
  };

  const signInGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      setloggedIn(true);

      const credential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(credential);
      navigation.navigate('Home', { isGuest: false });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Cancel');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signin in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('PLAY_SERVICES_NOT_AVAILABLE');
      } else {
      }
    }
  };

  const signInApple = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // get current authentication state for user
      // /!\ This method must be tested on a real device. On the iOS simulator
      // it always throws an error.
      const { identityToken, nonce } = appleAuthRequestResponse;

      // use credentialState response to ensure the user is authenticated
      if (identityToken) {
        // 3). create a Firebase `AppleAuthProvider` credential
        const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

        // 4). use the created `AppleAuthProvider` credential to start a Firebase auth request,
        //     in this example `signInWithCredential` is used,
        // but you could also call `linkWithCredential`
        //     to link the account to an existing user
        const userCredential = await auth().signInWithCredential(appleCredential);

        // user is now signed in, any Firebase `onAuthStateChanged` listeners you have will trigger
        console.warn(`Firebase authenticated via Apple, UID: ${userCredential.user.uid}`);
      } else {
        // handle this - retry?
      }
    } catch (error) {
      if (error.code === appleAuth.Error.CANCELED) {
        console.warn('User canceled Apple Sign in.');
      } else {
        console.error(error);
      }
    }
  };

  const socialButtons = (): React.ReactElement => (
    <Block
      z={10}
      absolute
      height={height / 2.6}
      width={width}
      padding={theme.sizes.padding}
      style={{ justifyContent: 'flex-end', bottom: 0 }}
    >
      <Button color="guest" onPress={() => navigation.navigate('Home', { isGuest: true })}>
        <Block row center space="evenly">
          <Icon name="user" color={theme.colors.white} size={22} />
          <Text center bold>
            Sign in as a guest
          </Text>
        </Block>
      </Button>
      <Button color="apple" onPress={() => signInApple()}>
        <Block row center space="evenly">
          <Icon name="apple1" color={theme.colors.white} size={22} />
          <Text center bold>
            Sign in with Apple
          </Text>
        </Block>
      </Button>
      <Button color="google" onPress={() => signInGoogle()}>
        <Block row center space="evenly">
          <Icon name="google" color={theme.colors.gray} size={22} />
          <Text center gray bold>
            Sign in with Google
          </Text>
        </Block>
      </Button>
    </Block>
  );
  if (loadingScreen) {
    return <LoadingScreen visible={loadingScreen} />;
  }

  return (
    <RadialGradient
      style={{ flex: 1 }}
      colors={getBackgroundColors(previousColor)}
      stops={[0.1, 0.8, 0.3, 0.75]}
      center={[width, 250]}
      radius={600}
    >
      <Block middle center>
        <Block
          z={10}
          absolute
          width={width}
          height={height / 4}
          padding={theme.sizes.padding}
          style={{ top: 0 }}
        >
          <Block flex={false} padding={[theme.sizes.padding * 2, 0]}>
            <Title />
          </Block>
        </Block>
        <Block z={10} absolute middle center>
          <Photo
            source={urlImage}
            resizeMode="contain"
            style={{ maxWidth: width / 1.4, flex: 1 }}
          />
        </Block>
        <Block
          animated
          flex={false}
          style={{
            backgroundColor: getBackgroundColors(currentColor)[1],
            borderRadius: loadingProgress.interpolate({
              inputRange: [0, 0.4, 0.8, 1],
              outputRange: [100, 200, 300, 0],
            }),
            width: loadingProgress.interpolate({
              inputRange: [0, 0.8, 1],
              outputRange: [0, height, width],
            }),
            height: loadingProgress.interpolate({
              inputRange: [0, 0.8, 1],
              outputRange: [0, height, height],
            }),
          }}
        >
          {loadingFinished && (
            <>
              <Block
                z={2}
                animated
                absolute
                style={{
                  backgroundColor: getBackgroundColors(currentColor)[1],
                  opacity: opacityProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0],
                  }),
                }}
              />
              <RadialGradient
                style={{ flex: 1, zIndex: 1 }}
                colors={getBackgroundColors(currentColor)}
                stops={[0.1, 0.8, 0.3, 0.75]}
                center={[width, 250]}
                radius={600}
              />
            </>
          )}
        </Block>
        {socialButtons()}
      </Block>
    </RadialGradient>
  );
};

Login.defaultProps = {
  pokemons: [
    {
      id: 1,
      image: require('../../assets/images/pokemon_1.png'),
    },
    {
      id: 2,
      image: require('../../assets/images/pokemon_2.png'),
    },
    {
      id: 3,
      image: require('../../assets/images/pokemon_3.png'),
    },
    {
      id: 4,
      image: require('../../assets/images/pokemon_4.png'),
    },
  ],
};

export default Login;
