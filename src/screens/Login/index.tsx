import * as React from 'react';
import { useEffect, useState } from 'react';
import { Animated, Platform } from 'react-native';
import ImageColors from 'react-native-image-colors';
import { AndroidImageColors, IOSImageColors } from 'react-native-image-colors/lib/typescript/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { darken } from 'polished';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { WEB_CLIENT_ID_GOOGLE_ANDROID, WEB_CLIENT_ID_GOOGLE_IOS } from '@env';
import '../../../config/Reactotron';
import Login from './Login';
import signInAppleService from './services/signInApple';

const minutes = 10000;
interface Props {
  pokemons: Array<{ id: number; image: string }>;
  navigation: StackNavigationProp<any, any>;
  signInGoogleService: (complete: () => void) => Promise<void>;
}

const LoginContainer: React.FC<Props> = ({ pokemons, navigation, signInGoogleService }) => {
  const [previousColor, setPreviousColor] = useState<IOSImageColors | AndroidImageColors>();
  const [currentColor, setCurrentColor] = useState<IOSImageColors | AndroidImageColors>();
  const [urlImage, setUrlImage] = useState('');
  const [loadingProgress] = useState(new Animated.Value(0));
  const [opacityProgress] = useState(new Animated.Value(0));
  const [loadingFinished, setLoadingFinished] = useState(false);

  const [loadingScreen, setLoadingScreen] = useState(true);

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'],
      webClientId: Platform.OS === 'ios' ? WEB_CLIENT_ID_GOOGLE_IOS : WEB_CLIENT_ID_GOOGLE_ANDROID,
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
    const colorsDefault = ['#FFE274', darken(0.3, '#FFE274')];

    if (colorImage !== undefined) {
      if (colorImage.platform === 'ios') {
        return [colorImage.background, darken(0.3, colorImage.background)];
      }

      return colorImage.dominant
        ? [colorImage.dominant, darken(0.3, colorImage.dominant)]
        : colorsDefault;
    }

    return colorsDefault;
  };

  const signInGoogle = async () => {
    const complete = () => {
      navigation.navigate('Home', { isGuest: false });
    };

    await signInGoogleService(complete);
  };

  const signInApple = async () => {
    const complete = () => {
      navigation.navigate('Home', { isGuest: false });
    };

    await signInAppleService(complete);
  };

  const signInWithAppleEnabled = () => {
    if (Platform.OS === 'ios') return true;

    return false;
  };

  return (
    <Login
      pokemons={pokemons}
      navigation={navigation}
      urlImage={urlImage}
      loadingScreen={loadingScreen}
      loadingFinished={loadingFinished}
      signInApple={signInApple}
      signInGoogle={signInGoogle}
      getBackgroundColors={getBackgroundColors}
      previousColor={previousColor}
      currentColor={currentColor}
      loadingProgress={loadingProgress}
      opacityProgress={opacityProgress}
      signInWithAppleEnabled={signInWithAppleEnabled()}
    />
  );
};

LoginContainer.defaultProps = {
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

export default LoginContainer;
