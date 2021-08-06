import nock from 'nock';

import pokemonService from '../../pokemon-service';
import pokemonsExpectedData from '../fixtures/pokemons';
import pokemonExpectedData from '../fixtures/pokemon';
import pokemonAbilityExpectedData from '../fixtures/pokemon-ability';

describe('pokemon service', () => {
  describe('.getAll', () => {
    it('returns paged data from endpoint pokemon api', async () => {
      // given
      nock('http://mock-api.com.br')
        .get(`/pokemon?offset=${0}&limit=${20}`)
        .reply(200, pokemonsExpectedData);
      // when
      const data = await pokemonService.getAll('http://mock-api.com.br', 0, 20);
      // then
      expect(data).toEqual(pokemonsExpectedData);
    });

    it('returns an error when endpoint pokemon api does not exist', async () => {
      // given
      const expectedError = { message: 'Not Found' };
      const expectedHttpStatus = 404;
      nock('http://mock-api.com.br')
        .get(`/pokemon?offset=${0}&limit=${20}`)
        .reply(expectedHttpStatus, expectedError);
      // when
      const data = await pokemonService.getAll('http://mock-api.com.br', 0, 20);

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
      nock('http://mock-api.com.br').get(`/pokemon/${1}`).reply(200, pokemonExpectedData);
      // when
      const data = await pokemonService.get('http://mock-api.com.br', 1);
      // then
      expect(data).toEqual(pokemonExpectedData);
    });

    it('returns an error when the pokemon endpoint by id does not exist', async () => {
      // given
      const expectedError = { message: 'Not Found' };
      const expectedHttpStatus = 404;
      nock('http://mock-api.com.br').get(`/pokemon/${1}`).reply(expectedHttpStatus, expectedError);
      // when
      const data = await pokemonService.get('http://mock-api.com.br', 1);
      // then
      expect(data).toEqual({
        status: expectedHttpStatus,
        error: expectedError,
      });
    });
  });

  describe('.getAbility', () => {
    it('returns pokemon ability data via api', async () => {
      // given
      nock('http://mock-api.com.br').get(`/ability/${65}`).reply(200, pokemonAbilityExpectedData);
      // when
      const data = await pokemonService.getAbility('http://mock-api.com.br', 65);
      // then
      expect(data).toEqual(pokemonAbilityExpectedData);
    });

    it('returns an error when the pokemon ability endpoint by id does not exist', async () => {
      // given
      const expectedError = { message: 'Not Found' };
      const expectedHttpStatus = 404;
      nock('http://mock-api.com.br').get(`/ability/${65}`).reply(expectedHttpStatus, expectedError);
      // when
      const data = await pokemonService.getAbility('http://mock-api.com.br', 65);
      // then
      expect(data).toEqual({
        status: expectedHttpStatus,
        error: expectedError,
      });
    });
  });
});
