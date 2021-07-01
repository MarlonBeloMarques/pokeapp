export interface Result {
  name: string;
  url: string;
}

export interface Pokemons {
  count: number;
  next: string;
  previous: string;
  results: Array<Result>;
}
