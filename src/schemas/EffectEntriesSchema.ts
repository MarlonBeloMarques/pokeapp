export default class EffectEntriesSchema {
  static schema = {
    name: 'EffectEntries',
    primaryKey: 'id',
    properties: {
      id: { type: 'int', indexed: true },
      effect: 'string',
      short_effect: 'string',
      language: 'Language',
    },
  };
}
