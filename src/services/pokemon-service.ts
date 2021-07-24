import { POKEAPI_URL } from '@env';
import axios from 'axios';
import api from './api';
import Pokemon from './pokemon';
import PokemonAbility from './pokemon-ability';
import { Pokemons } from './pokemons';

interface ExceptionError {
  status: number | undefined;
  error: any | undefined;
}

const getAll = async (
  url = POKEAPI_URL,
  offset = 0,
  limit = 10,
): Promise<Pokemons | ExceptionError | undefined> => {
  try {
    const { data } = await api(url).get<Pokemons>(`/pokemon?offset=${offset}&limit=${limit}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        status: error.response?.status,
        error: error.response?.data,
      };
    }
    return undefined;
  }
};

const get = async (
  url = POKEAPI_URL,
  id: number,
): Promise<Pokemon | ExceptionError | undefined> => {
  try {
    const { data } = await api(url).get<Pokemon>(`/pokemon/${id}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        status: error.response?.status,
        error: error.response?.data,
      };
    }
    return undefined;
  }
};

const getAbility = async (
  url = POKEAPI_URL,
  idAbility: number,
): Promise<PokemonAbility | ExceptionError | undefined> => {
  try {
    const { data } = await api(url).get<PokemonAbility>(`/ability/${idAbility}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        status: error.response?.status,
        error: error.response?.data,
      };
    }
    return undefined;
  }
};

const pokemonService = {
  getAll,
  get,
  getAbility,
};

export default pokemonService;
