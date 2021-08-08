import * as React from 'react';
import renderer from 'react-test-renderer';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Animated, NativeScrollEvent, NativeSyntheticEvent, Text } from 'react-native';
import { ImageColorsResult } from 'react-native-image-colors/lib/typescript/types';
import HomeContainer from '../../Home';
import Home from '../../Home/Home';
import PokemonList, { PokemonProps } from '../../../components/PokemonList';
import PokemonListMock from '../fixtures/pokemons-list';

type ParamList = {
  Home: {
    isGuest: HomeProps;
  };
};
interface Props {
  route: RouteProp<ParamList, 'Home'>;
  navigation: NavigationProp<any, any>;
}

interface PropsList {
  pokemonsList: Array<PokemonProps>;
  checkScroll: ((event: NativeSyntheticEvent<NativeScrollEvent>) => void) | undefined;
  onEndReached: () => {};
}

describe('scroll list', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('renders correctly', () => {
    const RoutePropMock = useRoute<RouteProp<ParamList, 'Home'>>();
    const NavigationPropMock = useNavigation<NavigationProp<any, any>>();

    const mockedParams: Props = {
      route: RoutePropMock,
      navigation: NavigationPropMock,
    };

    const rendered = renderer
      .create(React.createElement(HomeContainer, { ...mockedParams }))
      .toJSON();
    expect(rendered).toBeTruthy();
  });

  it('getting the list of pokemons', () => {
    const mockedProps: PropsList = {
      pokemonsList: PokemonListMock,
      checkScroll: () => {},
      onEndReached: () => ({}),
    };

    const rendered = renderer.create(React.createElement(PokemonList, { ...mockedProps }));
    const { pokemonsList } = rendered.root.props;
    expect((pokemonsList as Array<PokemonProps>).length > 0).toBe(true);
  });

  it('is getting the initial pokémon information correctly', () => {
    const colorsMocked: ImageColorsResult = {
      background: '',
      primary: '',
      secondary: '',
      detail: '',
      quality: 'lowest',
      platform: 'ios',
    };

    const mockedParams = {
      currentPokemon: PokemonListMock[0],
      loadingScreen: false,
      loadingFinished: false,
      currentColor: colorsMocked,
      previousColor: colorsMocked,
      loadingProgress: new Animated.Value(0),
      opacityProgress: new Animated.Value(0),
      pokemonsList: PokemonListMock,
      checkScroll: () => {},
      getPokemons: () => ({}),
      getBackgroundColors: () => [],
    };
    const rendered = renderer.create(React.createElement(Home, { ...mockedParams }));
    const { root } = rendered;
    expect(root.props.loadingScreen).toBe(false);
    expect((root.findAllByType(Text)[0].props.children as string).length !== 0).toBe(true);
  });
});
