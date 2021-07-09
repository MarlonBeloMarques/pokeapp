export default class TypeSchema {
  static schema = {
    name: 'Type',
    primaryKey: 'id',
    properties: {
      id: { type: 'int', indexed: true },
      type: 'TypeDetail',
    },
  };
}
