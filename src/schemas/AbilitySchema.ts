export default class AbilitySchema {
  static schema = {
    name: 'Ability',
    primaryKey: 'id',
    properties: {
      id: { type: 'int', indexed: true },
      ability: 'AbilityDetail',
    },
  };
}
