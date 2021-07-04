import React, { useState, useEffect, useRef } from 'react';
import { AndroidImageColors, IOSImageColors } from 'react-native-image-colors/lib/typescript/types';
import RadialGradient from 'react-native-radial-gradient';
import { darken } from 'polished';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/stack';
import { POKEAPI_IMAGE_URL, POKEAPI_URL } from '@env';
import { Block, Button, Photo, Text } from '../../elements';
import { theme } from '../../constants';
import styles from './styles';

import pokemonService from '../../services/pokemon-service';
import { Pokemons, Result } from '../../services/pokemons';
import PokemonDetail from '../../services/pokemon';
import PokemonAbility from '../../services/pokemon-ability';

const { width, height } = Dimensions.get('screen');

interface PokemonProps extends Result {
  image_url: string;
  detail: PokemonDetail;
  abilities: Array<PokemonAbility>;
}

const Home: React.FC = () => {
  const headerHeight = useHeaderHeight();
  const paddingTop = headerHeight + theme.sizes.base;
  const [previousColor, setPreviousColor] = useState<IOSImageColors | AndroidImageColors>();
  const [currentColor, setCurrentColor] = useState<IOSImageColors | AndroidImageColors>();
  const [currentPokemon, setCurrentPokemon] = useState<PokemonProps>();
  const [urlImage, setUrlImage] = useState('');
  const [pokemonsListLength, setPokemonListLength] = useState(10);

  const [pokemonsList, setPokemonsList] = useState<Array<PokemonProps>>([]);

  const flatListRef = useRef<FlatList<any>>(null);

  useEffect(() => {
    getPokemons();
  }, []);

  const getPokemons = async (): Promise<void> => {
    try {
      const pokemons: Pokemons = await pokemonService
        .getAll(POKEAPI_URL, 1, pokemonsListLength)
        .then();

      for (let cont = 0; cont < pokemons.results.length; cont + 1) {
        const pokemonDetail: PokemonDetail = await pokemonService
          .get(POKEAPI_URL, parseInt(getId(pokemons.results[cont]), 10))
          .then();

        const pokemonAbilitiesList = await getPokemonAbilities(pokemonDetail);

        getFirstPokemon(pokemons, pokemonDetail, pokemonAbilitiesList, cont);

        setPokemonsList((pokemon) => [
          ...pokemon,
          {
            name: pokemons.results[cont].name,
            url: pokemons.results[cont].url,
            detail: pokemonDetail,
            image_url: getImageUrl(parseInt(getId(pokemons.results[cont]), 10)),
            abilities: pokemonAbilitiesList,
          },
        ]);

        cont += 1;
      }
    } catch (error) {}
  };

  const getPokemonAbilities = async (
    pokemonDetail: PokemonDetail,
  ): Promise<Array<PokemonAbility>> => {
    const pokemonAbilitiesList: Array<PokemonAbility> = [];

    for (let contAbilities = 0; contAbilities < pokemonDetail.abilities.length; contAbilities + 1) {
      const pokemonAbility: PokemonAbility = await pokemonService
        .getAbility(
          POKEAPI_URL,
          parseInt(getAbilityId(pokemonDetail.abilities[contAbilities].ability.url), 10),
        )
        .then();

      pokemonAbilitiesList.push(pokemonAbility);

      contAbilities += 1;
    }

    return pokemonAbilitiesList;
  };

  const getFirstPokemon = (
    pokemons: Pokemons,
    pokemonDetail: PokemonDetail,
    pokemonAbilitiesList: Array<PokemonAbility>,
    cont: number,
  ) => {
    if (cont === 0) {
      setCurrentPokemon({
        name: pokemons.results[cont].name,
        url: pokemons.results[cont].url,
        detail: pokemonDetail,
        image_url: getImageUrl(parseInt(getId(pokemons.results[cont]), 10)),
        abilities: pokemonAbilitiesList,
      });
    }
  };

  const getId = (result: Result): string => result.url.split('/')[6];
  const getAbilityId = (abilityUrl: string): string => abilityUrl.split('/')[6];
  const getImageUrl = (pokemonId: number): string => `${POKEAPI_IMAGE_URL}/${pokemonId}.png`;

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

  const checkScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const totalLength = event.nativeEvent.contentSize.width;
    const traveledLength = event.nativeEvent.contentOffset.x;

    const pokemonIndex = Math.floor((traveledLength * pokemonsListLength) / totalLength);

    setCurrentPokemon(pokemonsList[pokemonIndex]);
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
      <Block flex={false} row margin={[0, 0, theme.sizes.padding, 0]}>
        {currentPokemon?.detail.abilities.map((ability) => (
          <Block flex={false}>
            <Button shadow style={styles.buttonDetail}>
              <Text>{ability.ability.name}</Text>
            </Button>
          </Block>
        ))}
      </Block>
      <ScrollView showsVerticalScrollIndicator={false}>
        {currentPokemon?.abilities.map((ability) => (
          <Text medium style={{ paddingTop: theme.sizes.caption }}>
            {ability.effect_entries[1].effect}
          </Text>
        ))}
      </ScrollView>
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
              {currentPokemon?.name}
            </Text>
          </Block>
        </Block>
        <FlatList
          ref={flatListRef}
          horizontal
          pagingEnabled
          scrollEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          snapToAlignment="center"
          data={pokemonsList}
          keyExtractor={(item: PokemonProps) => `${item.detail.id}`}
          renderItem={({ item, index }) => (
            <Block key={index} width={width} middle center>
              <Photo
                source={item.image_url}
                resizeMode="contain"
                style={{ minWidth: width / 1.4, flex: 1 }}
              />
            </Block>
          )}
          onScroll={checkScroll}
        />
        {pokemonDetails()}
      </Block>
    </RadialGradient>
  );
};

export default Home;
