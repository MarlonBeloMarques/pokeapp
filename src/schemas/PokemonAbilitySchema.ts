export default class PokemonAbilitySchema {
  static schema = {
    name: 'PokemonAbility',
    primaryKey: 'id',
    properties: {
      id: { type: 'int', indexed: true },
      name: 'string',
      effect_entries: { type: 'list', objectType: 'EffectEntries' },
    },
  };
}
