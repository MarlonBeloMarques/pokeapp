import nock from 'nock';

import pokemonService from '../../pokemon-service';
import pokemonsExpectedData from '../fixtures/pokemons';
import pokemonExpectedData from '../fixtures/pokemon';

describe('pokemon service', () => {
  describe('.getAll', () => {
    it('returns paged data from endpoint pokemon api', async () => {
      // given
      nock('http://mock-api.com.br')
        .get(`/pokemons?offset=${0}&limit=${20}`)
        .reply(200, pokemonsExpectedData);
      // when
      const data = await pokemonService.getAll();
      // then
      expect(data).toEqual(pokemonsExpectedData);
    });

    it('returns an error when endpoint pokemon api does not exist', async () => {
      // given
      const expectedError = { message: 'Not Found' };
      const expectedHttpStatus = 404;
      nock('http://mock-api.com.br')
        .get(`/pokemons?offset=${0}&limit=${20}`)
        .reply(expectedHttpStatus, expectedError);
      // when
      const data = await pokemonService.getAll();

      // then
      expect(data).toEqual({
        status: expectedHttpStatus,
        error: expectedError,
      });
    });
  });

  describe('.get', () => {
    it('returns pokemon data via api', async () => {
      // given
      nock('http://mock-api.com.br').get(`/pokemons/${1}`).reply(200, pokemonExpectedData);
      // when
      const data = await pokemonService.get(1);
      // then
      expect(data).toEqual(pokemonExpectedData);
    });

    it('returns an error when the pokemon endpoint by id does not exist', async () => {
      // given
      const expectedError = { message: 'Not Found' };
      const expectedHttpStatus = 404;
      nock('http://mock-api.com.br').get(`/pokemons/${1}`).reply(expectedHttpStatus, expectedError);
      // when
      const data = await pokemonService.get(1);
      // then
      expect(data).toEqual({
        status: expectedHttpStatus,
        error: expectedError,
      });
    });
  });
});
