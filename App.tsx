/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { Block } from './src/elements';
import Routes from './src/routes';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  });
  return (
    <Block>
      <Routes />
    </Block>
  );
};

export default App;
