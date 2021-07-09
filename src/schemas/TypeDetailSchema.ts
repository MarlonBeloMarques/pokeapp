export default class TypeDetailSchema {
  static schema = {
    name: 'TypeDetail',
    primaryKey: 'name',
    properties: {
      name: { type: 'string', indexed: true },
      url: 'string',
    },
  };
}
