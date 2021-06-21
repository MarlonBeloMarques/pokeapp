interface Ability {
  abilitiy: { name: string; url: string };
}

interface Type {
  type: { name: string; url: string };
}

interface Pokemon {
  abilities: Array<Ability>;
  base_experience: number;
  name: string;
  types: Array<Type>;
  weight: number;
  id: number;
}

export default Pokemon;
