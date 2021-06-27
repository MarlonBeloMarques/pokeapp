import React, { useState } from 'react';
import { AndroidImageColors, IOSImageColors } from 'react-native-image-colors/lib/typescript/types';
import RadialGradient from 'react-native-radial-gradient';
import { darken } from 'polished';
import { Dimensions } from 'react-native';
import { Block, Button, Text } from '../../elements';

const { width, height } = Dimensions.get('screen');

const Home: React.FC = () => {
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

  return (
    <RadialGradient
      style={{ flex: 1 }}
      colors={getBackgroundColors(previousColor)}
      stops={[0.1, 0.8, 0.3, 0.75]}
      center={[width, 250]}
      radius={600}
    />
  );
};

export default Home;
