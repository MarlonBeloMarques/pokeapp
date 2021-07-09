export default class LanguageSchema {
  static schema = {
    name: 'Language',
    primaryKey: 'name',
    properties: {
      name: { type: 'string', indexed: true },
      url: 'string',
    },
  };
}
