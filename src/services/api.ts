import axios from 'axios';

const api = axios.create({
  baseURL: 'http://mock-api.com.br',
});

export default api;
