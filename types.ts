
export interface SynonymItem {
  id: number | string;
  hitza: string;
  sinonimoak: string[];
  isClass?: boolean; // Nueva propiedad para identificar palabras de clase añadidas por el usuario
}

export interface GameState {
  currentWord: SynonymItem | null;
  options: Option[];
  score: number;
  totalAttempts: number;
  checked: boolean;
  selectedIds: string[];
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export type ViewMode = 'quiz' | 'browse' | 'stats' | 'add' | 'class';
