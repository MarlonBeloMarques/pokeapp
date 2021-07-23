export default class PokemonSchema {
  static schema = {
    name: 'Pokemon',
    primaryKey: 'name',
    properties: {
      name: { type: 'string', indexed: true },
      url: 'string',
      image_url: 'string',
      image: 'string',
      detail: 'PokemonDetail',
      abilities: { type: 'list', objectType: 'PokemonAbility' },
      page: {
        type: 'linkingObjects',
        objectType: 'PokemonsPage',
        property: 'pokemons',
      },
    },
  };
}
