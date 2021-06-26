import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import RadialGradient from 'react-native-radial-gradient';
import { Dimensions } from 'react-native';
import ImageColors from 'react-native-image-colors';
import { AndroidImageColors, IOSImageColors } from 'react-native-image-colors/lib/typescript/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../constants';
import { Block, Button, Photo, Text } from '../../elements';
import { Title } from '../../components';
import '../../../config/Reactotron';

const { width } = Dimensions.get('screen');
const minutes = 10000;

interface Props {
  pokemons: Array<{ id: number; image: string }>;
  navigation: StackNavigationProp<any, any>;
}

const Login: React.FC<Props> = ({ pokemons, navigation }) => {
  const [color, setColor] = useState<IOSImageColors | AndroidImageColors>();
  const [urlImage, setUrlImage] = useState('');

  useEffect(() => {
    const showImages = async (): Promise<void> => {
      getImageColors(pokemons[0].id);
      setUrlImage(pokemons[0].image);

      for (let cont = 0; cont <= 3; cont += 1) {
        await timeout();

        getImageColors(pokemons[cont].id);
        setUrlImage(pokemons[cont].image);

        if (cont === 3) {
          cont = -1;
        }
      }
    };

    showImages();
  }, []);

  const timeout = () => new Promise((resolve) => setTimeout(resolve, minutes));

  const getImageColors = async (pokemonId: number): Promise<void> => {
    const colors = await ImageColors.getColors(
      pokemons.filter((pokemon) => pokemon.id === pokemonId)[0].image,
      {
        cache: true,
      },
    );

    if (colors.platform === 'ios') {
      setColor(colors);
    } else {
      setColor(colors);
    }
  };

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
      center={[width, 250]}
      radius={600}
    >
      <Block padding={theme.sizes.padding}>
        <Block flex={false} padding={[theme.sizes.padding * 2, 0]}>
          <Title />
        </Block>
        <Block middle center>
          <Photo
            source={urlImage}
            resizeMode="contain"
            style={{ maxWidth: width / 1.2, flex: 1 }}
          />
        </Block>
        <Button color="apple" onPress={() => navigation.navigate('Home')}>
          <Block row center space="evenly">
            <Icon name="apple1" color={theme.colors.white} size={22} />
            <Text center bold>
              Sign in with Apple
            </Text>
          </Block>
        </Button>
        <Button color="google" onPress={() => navigation.navigate('Home')}>
          <Block row center space="evenly">
            <Icon name="google" color={theme.colors.gray} size={22} />
            <Text center gray bold>
              Sign in with Google
            </Text>
          </Block>
        </Button>
        <Button color="facebook" onPress={() => navigation.navigate('Home')}>
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
