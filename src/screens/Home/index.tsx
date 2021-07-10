import React, { useState, useEffect } from 'react';
import { AndroidImageColors, IOSImageColors } from 'react-native-image-colors/lib/typescript/types';
import RadialGradient from 'react-native-radial-gradient';
import { darken } from 'polished';
import {
  Animated,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/stack';
import { POKEAPI_IMAGE_URL, POKEAPI_URL } from '@env';
import ImageColors from 'react-native-image-colors';
import queryString from 'query-string';
import { Block, Button, Text } from '../../elements';
import { theme } from '../../constants';
import styles from './styles';
import { LoadingScreen } from '../../components';

import pokemonService from '../../services/pokemon-service';
import { Pokemons, Result } from '../../services/pokemons';
import PokemonDetail from '../../services/pokemon';
import PokemonAbility from '../../services/pokemon-ability';
import PokemonList from '../../components/PokemonList';
import getRealm from '../../services/realm';

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
  const [previousPokemon, setPreviousPokemon] = useState<PokemonProps>();
  const [currentPokemon, setCurrentPokemon] = useState<PokemonProps>();
  const [pokemonsListLength, setPokemonListLength] = useState(10);
  const [offset, setOffset] = useState(1);

  const [pokemonsList, setPokemonsList] = useState<Array<PokemonProps>>([]);
  const [loadingFinished, setLoadingFinished] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(true);

  const [loadingProgress] = useState(new Animated.Value(0));
  const [opacityProgress] = useState(new Animated.Value(0));

  useEffect(() => {
    if (currentPokemon !== undefined && Object.entries(currentPokemon).length !== 0) {
      if (previousPokemon !== undefined && Object.entries(previousPokemon).length !== 0) {
        loadingProgress.setValue(0);
        opacityProgress.setValue(0);
        setLoadingFinished(false);

        getImageColors(previousPokemon, setPreviousColor);
        getImageColors(currentPokemon, setCurrentColor);

        runsAnimations();
      }
    }
  }, [currentPokemon]);

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
        useNativeDriver: true,
      }).start();
    });
  };

  useEffect(() => {
    getPokemons();
  }, []);

  const getPokemons = async (): Promise<void> => {
    const newPokemonsList: Array<PokemonProps> = [];

    try {
      const pokemons: Pokemons = await pokemonService
        .getAll(POKEAPI_URL, offset, pokemonsListLength)
        .then();
      for (let cont = 0; cont < pokemons.results.length; cont + 1) {
        const pokemonDetail: PokemonDetail = await pokemonService
          .get(POKEAPI_URL, parseInt(getId(pokemons.results[cont]), 10))
          .then();

        const pokemonAbilitiesList = await getPokemonAbilities(pokemonDetail);

        setPokemonTypesId(pokemonDetail);
        getPokemonInitialValues(pokemons, pokemonDetail, pokemonAbilitiesList, cont);

        newPokemonsList.push({
          name: pokemons.results[cont].name,
          url: pokemons.results[cont].url,
          detail: pokemonDetail,
          image_url: getImageUrl(parseInt(getId(pokemons.results[cont]), 10)),
          abilities: pokemonAbilitiesList,
        });

        cont += 1;
      }

      setPokemonsList((pokemon) => [...pokemon, ...newPokemonsList]);
      updateOffsetValue(pokemons.next);
      updatePokemonListLength();

      savePokemonsToLocalStorage(newPokemonsList);

      loadingTimeout();
    } catch (error) {}
  };

  const savePokemonsToLocalStorage = (pokemons: Array<PokemonProps>): void => {
    pokemons.forEach((pokemonData) => {
      saveDataToLocalStorage('Pokemon', pokemonData);
    });
  };

  const saveDataToLocalStorage = async (schemaName: string, data: any): Promise<void> => {
    const realm = await getRealm();

    realm.write(() => {
      realm.create(schemaName, data, 'modified');
    });
  };

  const loadingTimeout = (): void => {
    if (offset === 1) {
      setTimeout(() => {
        setLoadingScreen(false);
      }, 1000);
    }
  };

  const updatePokemonListLength = (): void => {
    if (offset !== 1) {
      setPokemonListLength(pokemonsListLength + pokemonsListLength);
    }
  };

  const updateOffsetValue = (next: string) => {
    const nextUrl = queryString.parseUrl(next);
    const offsetValue = nextUrl.query.offset?.toString();

    setOffset(parseInt(offsetValue || offset.toString(), 10));
  };

  const setPokemonTypesId = (pokemonDetail: PokemonDetail): void => {
    for (let contTypes = 0; contTypes < pokemonDetail.types.length; contTypes + 1) {
      setIdToSaveToLocalStorage(pokemonDetail.types[contTypes], 'Type', 'id');

      saveDataToLocalStorage('Type', pokemonDetail.types[contTypes]);
      contTypes += 1;
    }
  };

  const setIdToSaveToLocalStorage = async <T, K extends keyof T>(
    object: T,
    schemaName: string,
    primaryKey: K,
  ): Promise<void> => {
    const realm = await getRealm();

    const lastObject = realm.objects(schemaName).sorted(primaryKey.toString(), true)[0];
    const highestId: number = lastObject == null ? 0 : lastObject[primaryKey];
    object[primaryKey] = highestId == null ? 1 : highestId + 1;
  };

  const getPokemonAbilities = async (
    pokemonDetail: PokemonDetail,
  ): Promise<Array<PokemonAbility>> => {
    const pokemonAbilitiesList: Array<PokemonAbility> = [];

    for (let contAbilities = 0; contAbilities < pokemonDetail.abilities.length; contAbilities + 1) {
      const abilityId = getAbilityId(pokemonDetail.abilities[contAbilities].ability.url);

      setIdToSaveToLocalStorage(pokemonDetail.abilities[contAbilities], 'Ability', 'id');
      saveDataToLocalStorage('Ability', pokemonDetail.abilities[contAbilities]);

      const pokemonAbility: PokemonAbility = await pokemonService
        .getAbility(POKEAPI_URL, parseInt(abilityId, 10))
        .then();

      pokemonAbilitiesList.push(pokemonAbility);

      contAbilities += 1;
    }

    return pokemonAbilitiesList;
  };

  const getPokemonInitialValues = (
    pokemons: Pokemons,
    pokemonDetail: PokemonDetail,
    pokemonAbilitiesList: Array<PokemonAbility>,
    cont: number,
  ) => {
    const pokemon: PokemonProps = {
      name: pokemons.results[cont].name,
      url: pokemons.results[cont].url,
      detail: pokemonDetail,
      image_url: getImageUrl(parseInt(getId(pokemons.results[cont]), 10)),
      abilities: pokemonAbilitiesList,
    };
    if (cont === 0 && offset === 1) {
      setPreviousPokemon(pokemon);
      setCurrentPokemon(pokemon);
    }
  };

  const getId = (result: Result): string => result.url.split('/')[6];
  const getAbilityId = (abilityUrl: string): string => abilityUrl.split('/')[6];
  const getImageUrl = (pokemonId: number): string => `${POKEAPI_IMAGE_URL}/${pokemonId}.png`;

  const getImageColors = async (
    pokemon: PokemonProps,
    colorChange: React.Dispatch<React.SetStateAction<any>>,
  ): Promise<void> => {
    const colors = await ImageColors.getColors(pokemon.image_url, {
      cache: true,
    });

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

    return ['#82BF96', darken(0.3, '#82BF96')];
  };

  const checkScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const totalLength = event.nativeEvent.contentSize.width;
    const traveledLength = event.nativeEvent.contentOffset.x;

    const pokemonIndex = Math.floor((traveledLength * pokemonsListLength) / totalLength);

    const findPokemonIndex = pokemonsList.findIndex(
      (pokemon) => pokemon.name === currentPokemon?.name,
    );

    if (pokemonIndex !== findPokemonIndex) {
      setPreviousPokemon(pokemonsList[findPokemonIndex]);
      setCurrentPokemon(pokemonsList[pokemonIndex]);
    }
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
              {ability.effect_entries[1].effect}
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
