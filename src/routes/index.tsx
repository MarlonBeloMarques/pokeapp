import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Platform } from 'react-native';
import Login from '../screens/Login';
import Home from '../screens/Home';
import { theme } from '../constants';
import { Title } from '../components';
import { Block, Photo } from '../elements';

const profile = require('../assets/images/profile.png');

const Stack = createStackNavigator();

const Routes = () => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerBackTitleVisible: false,
        title: '',
        headerTintColor: theme.colors.white,
        headerLeftContainerStyle: {
          marginLeft: Platform.OS === 'ios' ? theme.sizes.base : 0,
        },
        headerRightContainerStyle: {
          marginRight: Platform.OS === 'ios' ? theme.sizes.base : 0,
        },
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerTitle: () => <Title size={theme.sizes.h1} />,
          headerRight: () => (
            <Block center middle>
              <Photo source={profile} avatar />
            </Block>
          ),
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default Routes;
