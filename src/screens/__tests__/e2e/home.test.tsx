import * as React from 'react';
import renderer from 'react-test-renderer';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Home from '../../Home';

type ParamList = {
  Home: {
    isGuest: HomeProps;
  };
};
interface Props {
  route: RouteProp<ParamList, 'Home'>;
  navigation: NavigationProp<any, any>;
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
});
