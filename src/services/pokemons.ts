interface Result {
  name: string;
  url: string;
}

interface Pokemons {
  count: number;
  next: string;
  previous: string;
  results: Array<Result>;
}

export default Pokemons;
