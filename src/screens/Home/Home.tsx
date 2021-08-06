import * as React from 'react';
import RadialGradient from 'react-native-radial-gradient';
import {
  Animated,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native';
import { AndroidImageColors, IOSImageColors } from 'react-native-image-colors/lib/typescript/types';
import { useHeaderHeight } from '@react-navigation/stack';
import styles from './styles';
import { LoadingScreen } from '../../components';
import { Block, Button, Text } from '../../elements';
import PokemonList from '../../components/PokemonList';
import { theme } from '../../constants';
import { PokemonProps } from '.';
import PokemonAbility from '../../services/pokemon-ability';

const { width, height } = Dimensions.get('screen');

interface Props {
  getPokemons: () => {};
  checkScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void | undefined;
  pokemonsList: Array<PokemonProps>;
  loadingProgress: Animated.Value;
  opacityProgress: Animated.Value;
  loadingScreen: boolean | undefined;
  loadingFinished: boolean | undefined;
  currentPokemon: PokemonProps | undefined;
  previousColor: IOSImageColors | AndroidImageColors | undefined;
  currentColor: IOSImageColors | AndroidImageColors | undefined;
  getBackgroundColors: (
    colorImage: IOSImageColors | AndroidImageColors | undefined,
  ) => Array<string | undefined>;
}

const Home: React.FC<Props> = ({
  currentPokemon,
  getBackgroundColors,
  loadingScreen,
  currentColor,
  previousColor,
  loadingProgress,
  loadingFinished,
  opacityProgress,
  pokemonsList,
  checkScroll,
  getPokemons,
}) => {
  const headerHeight = useHeaderHeight();

  const paddingTop = headerHeight + theme.sizes.base;

  const getEffect = (ability: PokemonAbility): string => {
    let effect = '';

    ability.effect_entries.forEach((effectEntrie) => {
      if (effectEntrie.language.name === 'en') {
        effect = effectEntrie.effect;
      }
    });

    return effect;
  };

  const pokemonDetails = (): React.ReactElement => (
    <Block
      z={12}
      absolute
      height={height / 3}
      width={width}
      padding={theme.sizes.padding}
      style={{ justifyContent: 'flex-end', bottom: 0 }}
    >
      <Block flex={false} row margin={[0, 0, theme.sizes.padding, 0]}>
        {currentPokemon?.detail.abilities.map((ability) => (
          <Block key={ability.ability.url} flex={false}>
            <Button
              shadow
              style={[
                { backgroundColor: getBackgroundColors(currentColor)[0] },
                styles.buttonDetail,
              ]}
            >
              <Text>{ability.ability.name}</Text>
            </Button>
          </Block>
        ))}
      </Block>
      <ScrollView showsVerticalScrollIndicator={false}>
        {currentPokemon?.abilities.map((ability) => (
          <Block key={ability.id} flex={false}>
            <Text medium style={{ paddingTop: theme.sizes.caption }}>
              {getEffect(ability)}
            </Text>
          </Block>
        ))}
      </ScrollView>
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
          <Block flex={false} padding={[paddingTop, 0, 0, 0]}>
            <Text bold h1>
              {currentPokemon?.name}
            </Text>
          </Block>
        </Block>
        <Block
          flex={false}
          animated
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
        <PokemonList
          pokemonsList={pokemonsList}
          checkScroll={checkScroll}
          onEndReached={getPokemons}
        />
        {pokemonDetails()}
      </Block>
    </RadialGradient>
  );
};

export default Home;
