export default class PokemonDetailSchema {
  static schema = {
    name: 'PokemonDetail',
    primaryKey: 'id',
    properties: {
      id: { type: 'int', indexed: true },
      abilities: { type: 'list', objectType: 'Ability' },
      base_experience: 'int',
      name: 'string',
      types: { type: 'list', objectType: 'Type' },
      weight: 'int',
    },
  };
}
