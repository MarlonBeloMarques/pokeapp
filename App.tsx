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
import crashlytics from '@react-native-firebase/crashlytics';
import codePush, { CodePushOptions } from 'react-native-code-push';
import ToastMessage from 'react-native-flash-message';
import CodePushVerification from './CodePush';
import { Block } from './src/elements';
import Routes from './src/routes';

const codePushOptions: CodePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    crashlytics().log('App mounted.');
  }, []);

  return (
    <Block>
      <CodePushVerification />
      <ToastMessage position="top" />
      <Routes />
    </Block>
  );
};

export default codePush(codePushOptions)(App);
