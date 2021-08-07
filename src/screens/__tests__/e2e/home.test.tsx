import * as React from 'react';
import renderer from 'react-test-renderer';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import Home from '../../Home';
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

    const rendered = renderer.create(React.createElement(Home, { ...mockedParams })).toJSON();
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
});
