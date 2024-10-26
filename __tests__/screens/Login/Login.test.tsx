import * as React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationProp } from '@react-navigation/native';
import { Animated } from 'react-native';
import Login from '../../../src/screens/Login/Login';

describe('Login: View', () => {
  test('should not show the Sign in with Apple if signInWithAppleEnabled is false', () => {
    const { queryByTestId } = makeSut({ signInWithAppleEnabled: false });

    expect(queryByTestId('sign_in_with_apple_id')).not.toBeTruthy();
  });

  test('should show the Sign in with Apple if signInWithAppleEnabled is true', () => {
    const { getByTestId } = makeSut({});

    expect(getByTestId('sign_in_with_apple_id')).toBeTruthy();
  });
});

type SutProps = {
  signInWithAppleEnabled?: boolean;
};

const makeSut = ({ signInWithAppleEnabled = true }: SutProps) =>
  render(
    <Login
      pokemons={[]}
      navigation={{} as NavigationProp<any, any>}
      urlImage=""
      loadingScreen={false}
      loadingFinished={false}
      signInApple={async () => {}}
      signInGoogle={async () => {}}
      getBackgroundColors={() => []}
      previousColor={undefined}
      currentColor={undefined}
      loadingProgress={new Animated.Value(0)}
      opacityProgress={new Animated.Value(0)}
      signInWithAppleEnabled={signInWithAppleEnabled}
    />,
  );
