import PokemonDetail from '../../services/pokemon';
import PokemonAbility from '../../services/pokemon-ability';
import getRealm from '../../services/realm';
import { PokemonProps, PokemonsPage } from '.';

interface Pokemon extends PokemonsPage {
  pokemons: Array<PokemonProps>;
}

const getPokemonsFromLocalStorage = async (pagePosition = 0): Promise<Array<PokemonProps>> => {
  const realm = await getRealm();

  console.log(realm.path);

  const pokemonsData: Array<PokemonProps> = [];

  try {
    const resultsRealm: Realm.Results<Pokemon> = realm.objects('PokemonsPage');

    const { pokemons } = resultsRealm[pagePosition];
    if (pokemons.map((pokemonElement) => pokemonElement.image_url).length !== 0) {
      pokemons.forEach((pokemonElement) => {
        pokemonsData.push({
          name: pokemonElement.name,
          image_url: pokemonElement.image_url,
          image: pokemonElement.image,
          url: pokemonElement.url,
          detail: getPokemonDetailFromLocalStorage(pokemonElement),
          abilities: getPokemonAbilitiesFromLocalStorage(pokemonElement),
          page: {
            id: resultsRealm[pagePosition].id,
            count: resultsRealm[pagePosition].count,
            next: resultsRealm[pagePosition].next,
            previous: resultsRealm[pagePosition].previous,
          },
        });
      });
    }
  } catch (error) {
    return [];
  }

  return pokemonsData;
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
