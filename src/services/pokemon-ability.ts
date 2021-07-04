interface Language {
  name: string;
  url: string;
}

interface EffectEntries {
  effect: string;
  language: Language;
  short_effect: string;
}

interface PokemonAbility {
  effect_entries: Array<EffectEntries>;
  id: number;
  name: string;
}

export default PokemonAbility;
