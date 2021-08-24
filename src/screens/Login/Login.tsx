import * as React from 'react';
import { Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import RadialGradient from 'react-native-radial-gradient';
import { NavigationProp } from '@react-navigation/native';
import { AndroidImageColors, IOSImageColors } from 'react-native-image-colors/lib/typescript/types';
import { theme } from '../../constants';
import { Block, Button, Photo, Text } from '../../elements';
import { Title, LoadingScreen } from '../../components';

const { width, height } = Dimensions.get('screen');

interface Props {
  pokemons: Array<{ id: number; image: string }>;
  navigation: NavigationProp<any, any>;
  urlImage: string;
  loadingScreen: boolean | undefined;
  loadingFinished: boolean | undefined;
  signInApple: () => Promise<void> | undefined;
  signInGoogle: () => Promise<void> | undefined;
  getBackgroundColors: (
    colorImage: IOSImageColors | AndroidImageColors | undefined,
  ) => Array<string | undefined>;
  previousColor: IOSImageColors | AndroidImageColors | undefined;
  currentColor: IOSImageColors | AndroidImageColors | undefined;
  loadingProgress: Animated.Value;
  opacityProgress: Animated.Value;
}

const Login: React.FC<Props> = ({
  navigation,
  signInApple,
  signInGoogle,
  getBackgroundColors,
  loadingScreen,
  previousColor,
  urlImage,
  loadingProgress,
  loadingFinished,
  opacityProgress,
  currentColor,
}) => {
  const socialButtons = (): React.ReactElement => (
    <Block
      z={10}
      middle
      absolute
      height={height / 2.6}
      width={width}
      padding={theme.sizes.padding}
      style={{ bottom: 0 }}
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
          height={height}
          padding={theme.sizes.padding}
          style={{ top: 0 }}
        >
          <Block flex={0.1} padding={[theme.sizes.padding * 2, 0, theme.sizes.base, 0]}>
            <Title />
          </Block>
          <Block flex={0.5} middle center>
            <Photo
              source={urlImage}
              resizeMode="contain"
              style={{ maxWidth: (width * height) / (width * 2.8) }}
            />
          </Block>
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

export default Login;
