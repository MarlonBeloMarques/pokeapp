jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios', // or 'ios'
  select: () => null,
}));
