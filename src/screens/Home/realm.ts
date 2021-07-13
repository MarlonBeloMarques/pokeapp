import { Result } from '../../services/pokemons';
import PokemonDetail from '../../services/pokemon';
import PokemonAbility from '../../services/pokemon-ability';
import getRealm from '../../services/realm';

interface PokemonProps extends Result {
  image_url: string;
  detail: PokemonDetail;
  abilities: Array<PokemonAbility>;
}

const getPokemonsFromLocalStorage = async (): Promise<Array<PokemonProps> | null> => {
  const realm = await getRealm();

  console.tron.log(realm.path);

  const pokemonsData: Array<PokemonProps> = [];

  const resultsRealm = realm.objects('Pokemon');

  if (resultsRealm.map((pokemonElement) => pokemonElement.image_url).length !== 0) {
    resultsRealm.forEach((pokemonElement) => {
      pokemonsData.push({
        name: pokemonElement.name,
        image_url: pokemonElement.image_url,
        url: pokemonElement.url,
        detail: getPokemonDetailFromLocalStorage(pokemonElement),
        abilities: getPokemonAbilitiesFromLocalStorage(pokemonElement),
      });
    });

    console.tron.log(pokemonsData);

    return pokemonsData;
  }

  return null;
};

const getPokemonAbilitiesFromLocalStorage = (
  pokemonElement: PokemonProps,
): Array<PokemonAbility> => {
  const pokemonAbilitiesData: Array<PokemonAbility> = [];
  pokemonElement.abilities.forEach((ability) => {
    const pokemonAbilityEffectEntriesData: Array<{
      id: number;
      effect: string;
      short_effect: string;
      language: { name: string; url: string };
    }> = [];

    ability.effect_entries.forEach((effectEntry) => {
      pokemonAbilityEffectEntriesData.push({
        id: effectEntry.id,
        effect: effectEntry.effect,
        short_effect: effectEntry.short_effect,
        language: { name: effectEntry.language.name, url: effectEntry.language.url },
      });
    });

    pokemonAbilitiesData.push({
      id: ability.id,
      name: ability.name,
      effect_entries: pokemonAbilityEffectEntriesData,
    });
  });

  return pokemonAbilitiesData;
};

const getPokemonDetailFromLocalStorage = (pokemonElement: PokemonProps): PokemonDetail => {
  const pokemonDetailTypeData: Array<{
    id: number;
    type: { name: string; url: string };
  }> = [];

  const pokemonDetailAbilityData: Array<{
    id: number;
    ability: { name: string; url: string };
  }> = [];

  pokemonElement.detail.abilities.forEach((ability) => {
    pokemonDetailAbilityData.push({
      id: ability.id,
      ability: { name: ability.ability.name, url: ability.ability.url },
    });
  });

  pokemonElement.detail.types.forEach((type) => {
    pokemonDetailTypeData.push({
      id: type.id,
      type: { name: type.type.name, url: type.type.url },
    });
  });

  const pokemonDetailData: PokemonDetail = {
    id: pokemonElement.detail.id,
    abilities: pokemonDetailAbilityData,
    base_experience: pokemonElement.detail.base_experience,
    name: pokemonElement.detail.name,
    types: pokemonDetailTypeData,
    weight: pokemonElement.detail.weight,
  };

  return pokemonDetailData;
};

export default getPokemonsFromLocalStorage;
