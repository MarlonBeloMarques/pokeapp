import * as React from 'react';
import { useState, useEffect, useLayoutEffect } from 'react';
import { AndroidImageColors, IOSImageColors } from 'react-native-image-colors/lib/typescript/types';
import { darken } from 'polished';
import {
  Animated,
  ImageURISource,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
} from 'react-native';
import { POKEAPI_IMAGE_URL, POKEAPI_URL } from '@env';
import ImageColors from 'react-native-image-colors';
import queryString from 'query-string';
import RNFetchBlob from 'rn-fetch-blob';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import { UpdateMode } from 'realm';
import { Block, Photo } from '../../elements';

import pokemonService from '../../services/pokemon-service';
import { Pokemons, Result } from '../../services/pokemons';
import PokemonDetail from '../../services/pokemon';
import PokemonAbility from '../../services/pokemon-ability';
import getRealm from '../../services/realm';
import getPokemonsFromLocalStorage from './realm';
import Home from './Home';
import {
  AbilitySchema,
  EffectEntriesSchema,
  PokemonSchema,
  PokemonsPageSchema,
  TypeSchema,
} from '../../schemas';
import { theme } from '../../constants';

const guestProfile: ImageURISource = require('../../assets/images/guest_profile.png');
const profile: ImageURISource = require('../../assets/images/profile.png');

const { fs } = RNFetchBlob;
export interface PokemonsPage {
  id: number;
  count: number;
  next: string;
  previous: string;
}

export interface PokemonProps extends Result {
  image_url: string;
  image: string;
  detail: PokemonDetail;
  abilities: Array<PokemonAbility>;
  page: PokemonsPage;
}

type ParamList = {
  Home: {
    isGuest: HomeProps;
  };
};
interface Props {
  route: RouteProp<ParamList, 'Home'>;
  navigation: NavigationProp<any, any>;
}

const HomeContainer: React.FC<Props> = ({ route, navigation }) => {
  const { isGuest } = route.params;

  const [userProfile, setUserProfile] = useState('');
  const [previousColor, setPreviousColor] = useState<IOSImageColors | AndroidImageColors>();
  const [currentColor, setCurrentColor] = useState<IOSImageColors | AndroidImageColors>();
  const [previousPokemon, setPreviousPokemon] = useState<PokemonProps>();
  const [currentPokemon, setCurrentPokemon] = useState<PokemonProps>();
  const [offset, setOffset] = useState(1);

  const [pokemonsList, setPokemonsList] = useState<Array<PokemonProps>>([]);
  const [loadingFinished, setLoadingFinished] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(true);

  const [loadingProgress] = useState(new Animated.Value(0));
  const [opacityProgress] = useState(new Animated.Value(0));

  const [pageCount, setPageCount] = useState(0);

  const getProfileImage = (): string | ImageURISource => {
    if (isGuest) {
      return guestProfile;
    }
    if ((typeof userProfile === 'string' && userProfile.length === 0) || userProfile == null) {
      return profile;
    }
    return userProfile;
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Block
          center
          middle
          style={{ paddingRight: Platform.OS === 'android' ? theme.sizes.base : 0 }}
        >
          <Photo source={getProfileImage()} avatar />
        </Block>
      ),
    });
  }, [userProfile]);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const onAuthStateChanged = (user: any) => {
    if (!isGuest && user) {
      const { photoURL } = user;
      if (photoURL) {
        setUserProfile(photoURL);
      }
    }
  };

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
  const getPokemons = async () => {
    let pokemons: Array<PokemonProps> = [];
    if ((await getPokemonsFromLocalStorage(pageCount)).length !== 0) {
      pokemons = await getPokemonsFromLocalStorage(pageCount);
    } else {
      pokemons = await getPokemonsFromPokeApi();

      saveDataToLocalStorage(PokemonsPageSchema, {
        ...pokemons[0].page,
        pokemons,
      });
      savePokemonsToLocalStorage(pokemons);
    }

    setTimeout(() => {
      loadPokemons(pokemons, pokemons[0].page.next);
      setPageCount(pageCount + 1);
    }, 3000);
  };

  const getPokemonsFromPokeApi = async (): Promise<Array<PokemonProps>> => {
    const newPokemonsList: Array<PokemonProps> = [];

    try {
      const pokemons: Pokemons = await pokemonService.getAll(POKEAPI_URL, offset, 10).then();
      for (let cont = 0; cont < pokemons.results.length; cont + 1) {
        const pokemonDetail: PokemonDetail = await pokemonService
          .get(POKEAPI_URL, parseInt(getId(pokemons.results[cont]), 10))
          .then();

        const pokemonAbilitiesList = await getPokemonAbilities(pokemonDetail);

        await setPokemonTypesId(pokemonDetail);

        const imageUrl = getImageUrl(parseInt(getId(pokemons.results[cont]), 10));

        const imageBase64 = `data:image/png;base64,${await getImageConvertedToBase64(imageUrl)}`;

        newPokemonsList.push({
          name: pokemons.results[cont].name,
          url: pokemons.results[cont].url,
          detail: pokemonDetail,
          image_url: imageUrl,
          image: imageBase64,
          abilities: pokemonAbilitiesList,
          page: getPokemonsPage(pokemons),
        });

        cont += 1;
      }
    } catch (error) {
      console.log(error);
      crashlytics().recordError(error);
    }

    return newPokemonsList;
  };

  const getImageConvertedToBase64 = async (imageUrl: string): Promise<string> => {
    let imagePath: string;
    let imageBase64 = '';

    await RNFetchBlob.config({
      fileCache: true,
    })
      .fetch('GET', imageUrl)
      .then((resp) => {
        imagePath = resp.path();
        return resp.readFile('base64');
      })
      .then((base64Data) => {
        imageBase64 = base64Data;
        return fs.unlink(imagePath);
      });

    return imageBase64;
  };

  const loadPokemons = (newPokemonsList: Array<PokemonProps>, urlNextPokemons?: string): void => {
    getPokemonInitialValues(newPokemonsList);

    setPokemonsList((pokemon) => [...pokemon, ...newPokemonsList]);
    updateOffsetValue(urlNextPokemons);

    loadingTimeout();
  };

  const getPokemonsPage = (pokemonsPage: Pokemons): PokemonsPage => ({
    id: parseInt(getOffsetValue(pokemonsPage.next), 10),
    count: pokemonsPage.count,
    next: pokemonsPage.next,
    previous: pokemonsPage.previous,
  });

  const savePokemonsToLocalStorage = (pokemons: Array<PokemonProps>): void => {
    pokemons.forEach((pokemonData) => {
      saveDataToLocalStorage(PokemonSchema, pokemonData);
    });
  };

  const saveDataToLocalStorage = async (
    schema:
      | typeof PokemonSchema
      | typeof PokemonsPageSchema
      | typeof TypeSchema
      | typeof AbilitySchema
      | typeof EffectEntriesSchema,
    data: any,
  ): Promise<void> => {
    const realm = await getRealm();

    realm.write(() => {
      realm.create(schema.schema.name, data, UpdateMode.Modified);
    });
  };

  const loadingTimeout = (): void => {
    if (offset === 1) {
      setTimeout(() => {
        setLoadingScreen(false);
      }, 1000);
    }
  };

  const getOffsetValue = (next: string): string => {
    const nextUrl = queryString.parseUrl(next);
    return nextUrl.query.offset?.toString() ? nextUrl.query.offset?.toString() : '10';
  };

  const updateOffsetValue = (next = 'https://pokeapi.co/api/v2/pokemon?offset=11&limit=10') => {
    const offsetValue = getOffsetValue(next);
    setOffset(parseInt(offsetValue || offset.toString(), 10));
  };

  const setPokemonTypesId = async (pokemonDetail: PokemonDetail): Promise<void> => {
    for (let contTypes = 0; contTypes < pokemonDetail.types.length; contTypes + 1) {
      pokemonDetail.types[contTypes].id = await getIdToSaveToLocalStorage(
        pokemonDetail.types[contTypes],
        TypeSchema,
        'id',
      );
      saveDataToLocalStorage(TypeSchema, pokemonDetail.types[contTypes]);

      contTypes += 1;
    }
  };

  const getIdToSaveToLocalStorage = async <T, K extends keyof T>(
    object: T,
    schema:
      | typeof PokemonSchema
      | typeof PokemonsPageSchema
      | typeof TypeSchema
      | typeof AbilitySchema
      | typeof EffectEntriesSchema,
    primaryKey: K,
  ): Promise<number> => {
    const realm = await getRealm();

    const results: Realm.Results<T> = realm.objects(schema.schema.name);
    const lastObject = results.sorted(primaryKey.toString(), true)[0];

    const highestId = lastObject == null ? 0 : lastObject[primaryKey];
    if (highestId as T[K]) {
      return (highestId as number) + 1;
    }

    return 1;
  };

  const getPokemonAbilities = async (
    pokemonDetail: PokemonDetail,
  ): Promise<Array<PokemonAbility>> => {
    const pokemonAbilitiesList: Array<PokemonAbility> = [];

    for (let contAbilities = 0; contAbilities < pokemonDetail.abilities.length; contAbilities + 1) {
      const abilityId = getAbilityId(pokemonDetail.abilities[contAbilities].ability.url);

      pokemonDetail.abilities[contAbilities].id = await getIdToSaveToLocalStorage(
        pokemonDetail.abilities[contAbilities],
        AbilitySchema,
        'id',
      );
      saveDataToLocalStorage(AbilitySchema, pokemonDetail.abilities[contAbilities]);

      const pokemonAbility: PokemonAbility = await pokemonService
        .getAbility(POKEAPI_URL, parseInt(abilityId, 10))
        .then();

      for (
        let contEffectEntries = 0;
        contEffectEntries < pokemonAbility.effect_entries.length;
        contEffectEntries + 1
      ) {
        pokemonAbility.effect_entries[contEffectEntries].id = await getIdToSaveToLocalStorage(
          pokemonAbility.effect_entries[contEffectEntries],
          EffectEntriesSchema,
          'id',
        );
        saveDataToLocalStorage(
          EffectEntriesSchema,
          pokemonAbility.effect_entries[contEffectEntries],
        );

        contEffectEntries += 1;
      }

      pokemonAbilitiesList.push(pokemonAbility);

      contAbilities += 1;
    }

    return pokemonAbilitiesList;
  };

  const getPokemonInitialValues = (pokemons: Array<PokemonProps>) => {
    if (offset === 1) {
      setPreviousPokemon(pokemons[0]);
      setCurrentPokemon(pokemons[0]);
    }
  };

  const getId = (result: Result): string => result.url.split('/')[6];
  const getAbilityId = (abilityUrl: string): string => abilityUrl.split('/')[6];
  const getImageUrl = (pokemonId: number): string => `${POKEAPI_IMAGE_URL}/${pokemonId}.png`;

  const getImageColors = async (
    pokemon: PokemonProps,
    colorChange: React.Dispatch<React.SetStateAction<any>>,
  ): Promise<void> => {
    const colors = await ImageColors.getColors(pokemon.image || pokemon.image_url, {
      cache: true,
      key: pokemon.name,
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
    const colorsDefault = ['#82BF96', darken(0.3, '#82BF96')];

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

  const checkScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const totalLength = event.nativeEvent.contentSize.width;
    const traveledLength = event.nativeEvent.contentOffset.x;
    const addLengthTraveled = 50;

    const pokemonIndex = Math.floor(
      ((traveledLength + addLengthTraveled) * pokemonsList.length) / totalLength,
    );

    const findPokemonIndex = pokemonsList.findIndex(
      (pokemon) => pokemon.name === currentPokemon?.name,
    );

    if (pokemonIndex !== findPokemonIndex) {
      setPreviousPokemon(pokemonsList[findPokemonIndex]);
      setCurrentPokemon(pokemonsList[pokemonIndex]);
    }
  };

  return (
    <Home
      getPokemons={getPokemons}
      checkScroll={checkScroll}
      pokemonsList={pokemonsList}
      loadingProgress={loadingProgress}
      opacityProgress={opacityProgress}
      loadingScreen={loadingScreen}
      loadingFinished={loadingFinished}
      currentPokemon={currentPokemon}
      previousColor={previousColor}
      currentColor={currentColor}
      getBackgroundColors={getBackgroundColors}
    />
  );
};

export default HomeContainer;
