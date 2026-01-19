
export interface SynonymItem {
  id: number | string;
  hitza: string;
  sinonimoak: string[];
  isClass?: boolean;
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

export type ViewMode = 'home' | 'quiz' | 'browse' | 'stats' | 'add' | 'class';

export type ClassSubMode = 'first' | 'second' | 'all';
