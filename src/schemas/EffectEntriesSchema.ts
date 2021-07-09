export default class EffectEntriesSchema {
  static schema = {
    name: 'EffectEntries',
    primaryKey: 'effect',
    properties: {
      effect: { type: 'string', indexed: true },
      short_effect: 'string',
      language: 'Language',
    },
  };
}
