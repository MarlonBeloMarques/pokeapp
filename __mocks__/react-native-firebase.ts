jest.mock('@react-native-firebase/crashlytics', () => ({}));

jest.mock('@react-native-firebase/auth', () => () => ({
  onAuthStateChanged: jest.fn(),
}));

jest.mock('@react-native-firebase/app', () => () => ({
  onNotification: jest.fn(),
  onNotificationDisplayed: jest.fn(),
}));

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
