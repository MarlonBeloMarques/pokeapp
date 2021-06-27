import React, { useState } from 'react';
import { AndroidImageColors, IOSImageColors } from 'react-native-image-colors/lib/typescript/types';
import RadialGradient from 'react-native-radial-gradient';
import { darken } from 'polished';
import { Dimensions } from 'react-native';
import { useHeaderHeight } from '@react-navigation/stack';
import { Block, Button, Photo, Text } from '../../elements';
import { theme } from '../../constants';
import styles from './styles';

const { width, height } = Dimensions.get('screen');

const Home: React.FC = () => {
  const headerHeight = useHeaderHeight();
  const paddingTop = headerHeight + theme.sizes.base;
  const [previousColor, setPreviousColor] = useState<IOSImageColors | AndroidImageColors>();
  const [currentColor, setCurrentColor] = useState<IOSImageColors | AndroidImageColors>();
  const [urlImage, setUrlImage] = useState('');

  const getBackgroundColors = (
    colorImage: IOSImageColors | AndroidImageColors | undefined,
  ): Array<string | undefined> => {
    if (colorImage !== undefined) {
      if (colorImage.platform === 'ios') {
        return [colorImage.background, darken(0.3, colorImage.background)];
      }

      return [colorImage.average, darken(0.3, colorImage.average)];
    }

    return ['#82BF96', darken(0.3, '#82BF96')];
  };

  const pokemonDetails = (): React.ReactElement => (
    <Block
      z={10}
      absolute
      height={height / 3}
      width={width}
      padding={theme.sizes.padding}
      style={{ justifyContent: 'flex-end', bottom: 0 }}
    >
      <Block flex={false} row>
        <Button shadow style={styles.buttonDetail}>
          <Text>speed</Text>
        </Button>
        <Button shadow style={styles.buttonDetail}>
          <Text>attack</Text>
        </Button>
      </Block>
      <Block middle>
        <Text medium>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic quae est libero magnam
          veritatis voluptatibus officia, saepe quibusdam! Eos necessitatibus provident quibusdam,
          officiis explicabo doloremque aliquam. Earum doloremque illum doloribus?
        </Text>
      </Block>
    </Block>
  );

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
          <Block flex={false} padding={[paddingTop, 0, 0, 0]}>
            <Text bold h1>
              Bulbasaur
            </Text>
          </Block>
        </Block>
        <Block z={10} absolute middle center>
          <Photo
            source={require('../../assets/images/pokemon_1.png')}
            resizeMode="contain"
            style={{ maxWidth: width / 1.4, flex: 1 }}
          />
        </Block>
        {pokemonDetails()}
      </Block>
    </RadialGradient>
  );
};

export default Home;
