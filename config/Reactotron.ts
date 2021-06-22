import AsyncStorage from '@react-native-community/async-storage';
import Reactotron from 'reactotron-react-native';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Console {
    tron: any;
  }
}

if (process.env.NODE_ENV === 'development') {
  const tron = Reactotron.configure().setAsyncStorageHandler!(AsyncStorage).connect();

  tron.clear!();

  console.tron = tron;
}
