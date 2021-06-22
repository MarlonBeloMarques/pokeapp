import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import RadialGradient from 'react-native-radial-gradient';
import { Dimensions } from 'react-native';
import ImageColors from 'react-native-image-colors';
import { AndroidImageColors, IOSImageColors } from 'react-native-image-colors/lib/typescript/types';
import { theme } from '../../constants';
import { Block, Button, Photo, Text } from '../../elements';

const wdith = Dimensions.get('screen').width;

const Login: React.FC = () => {
  const [color, setColor] = useState<IOSImageColors | AndroidImageColors>();

  useEffect(() => {
    const getImageColors = async (): Promise<void> => {
      const colors = await ImageColors.getColors(getPokemonImage(), {
        cache: true,
      });

      if (colors.platform === 'ios') {
        setColor(colors);
      } else {
        setColor(colors);
      }
    };

    getImageColors();
  }, []);

  const getPokemonImage = (pokemonId = 1) =>
    `https://pokeres.bastionbot.org/images/pokemon/${pokemonId}.png`;

  const getBackgroundColors = (
    colorImage: IOSImageColors | AndroidImageColors | undefined,
  ): Array<string | undefined> => {
    if (colorImage !== undefined) {
      if (colorImage.platform === 'ios') {
        return [colorImage.background, colorImage.detail];
      }

      return [colorImage.average, colorImage.vibrant];
    }

    return ['#FFE274', '#FFCB05'];
  };

  return (
    <RadialGradient
      style={{ flex: 1 }}
      colors={getBackgroundColors(color)}
      stops={[0.1, 0.8, 0.3, 0.75]}
      center={[wdith, 250]}
      radius={600}
    >
      <Block padding={theme.sizes.padding}>
        <Block flex={false} padding={[theme.sizes.padding * 2, 0]}>
          <Text h1 stylized>
            PokeApp
          </Text>
        </Block>
        <Block middle center>
          <Photo source={getPokemonImage()} width={180} height={180} />
        </Block>
        <Button color="apple">
          <Block row center space="evenly">
            <Icon name="apple1" color={theme.colors.white} size={22} />
            <Text center bold>
              Sign in with Apple
            </Text>
          </Block>
        </Button>
        <Button color="google">
          <Block row center space="evenly">
            <Icon name="google" color={theme.colors.gray} size={22} />
            <Text center gray bold>
              Sign in with Google
            </Text>
          </Block>
        </Button>
        <Button color="facebook">
          <Block row center space="evenly">
            <Icon name="facebook-square" color={theme.colors.white} size={22} />
            <Text center bold>
              Sign in with Facebook
            </Text>
          </Block>
        </Button>
      </Block>
    </RadialGradient>
  );
};

export default Login;
