interface Ability {
  id: number;
  ability: { name: string; url: string };
}

interface Type {
  id: number;
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
