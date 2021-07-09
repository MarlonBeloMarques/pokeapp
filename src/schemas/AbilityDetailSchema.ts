export default class AbilityDetailSchema {
  static schema = {
    name: 'AbilityDetail',
    primaryKey: 'name',
    properties: {
      name: { type: 'string', indexed: true },
      url: 'string',
    },
  };
}
