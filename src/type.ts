export interface Character {
  name: string;
  slug: string;
}

export interface Quote {
  sentence: string;
  character: Character;
}

export interface CharacterQuote extends Character {
  quotes: string[];
}
