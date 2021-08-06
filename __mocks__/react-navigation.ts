jest.mock('@react-navigation/native', () => ({
  useHeaderHeight: () => jest.fn().mockReturnValue(45),
  createNavigatorFactory: jest.fn(),
  useNavigation: () => ({ setOptions: () => {} }),
  useRoute: () => ({
    params: {
      isGuest: true,
    },
  }),
}));

jest.mock('@react-navigation/stack/lib/commonjs/utils/useHeaderHeight');
