export default class PokemonsPageSchema {
  static schema = {
    name: 'PokemonsPage',
    primaryKey: 'id',
    properties: {
      id: { type: 'int', indexed: true },
      count: 'int',
      next: 'string',
      previous: 'string',
      pokemons: { type: 'list', objectType: 'Pokemon' },
    },
  };
}
