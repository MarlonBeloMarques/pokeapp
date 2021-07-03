import { POKEAPI_URL } from '@env';
import axios from 'axios';

const api = (url = POKEAPI_URL) => axios.create({
  baseURL: url,
});

export default api;
