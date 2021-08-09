jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios', // or 'ios'
  select: () => null,
}));

jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn().mockReturnValue({ width: 500, height: 500 }),
}));
