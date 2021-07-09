import Realm from 'realm';
import PokemonSchema from '../schemas/PokemonSchema';
import AbilitySchema from '../schemas/AbilitySchema';
import AbilityDetailSchema from '../schemas/AbilityDetailSchema';
import EffectEntriesSchema from '../schemas/EffectEntriesSchema';
import LanguageSchema from '../schemas/LanguageSchema';
import PokemonAbilitySchema from '../schemas/PokemonAbilitySchema';
import PokemonDetailSchema from '../schemas/PokemonDetailSchema';
import TypeSchema from '../schemas/TypeSchema';
import TypeDetailSchema from '../schemas/TypeDetailSchema';

const getRealm = (): ProgressPromise =>
  Realm.open({
    schema: [
      PokemonSchema,
      AbilitySchema,
      AbilityDetailSchema,
      EffectEntriesSchema,
      LanguageSchema,
      PokemonAbilitySchema,
      PokemonDetailSchema,
      TypeSchema,
      TypeDetailSchema,
    ],
  });

export default getRealm;
