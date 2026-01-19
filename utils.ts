
import { SynonymItem, Option } from './types';

export const getRandomItem = <T,>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const shuffleArray = <T,>(arr: T[]): T[] => {
  return [...arr].sort(() => Math.random() - 0.5);
};

export const generateRound = (
  pool: SynonymItem[], 
  currentWord?: SynonymItem, 
  distractorPool?: SynonymItem[]
): { word: SynonymItem, options: Option[] } => {
  const target = currentWord || getRandomItem(pool);
  const correctOnes = target.sinonimoak;
  
  // Usamos el distractorPool (el diccionario completo) si se proporciona, 
  // para asegurar que siempre haya suficientes palabras diferentes.
  const sourceForDistractors = distractorPool || pool;
  
  const distractors: string[] = [];
  let attempts = 0;
  const maxAttempts = 200; // Seguridad contra bucles infinitos

  while (distractors.length < Math.max(4, 8 - correctOnes.length) && attempts < maxAttempts) {
    attempts++;
    const randomItem = getRandomItem(sourceForDistractors);
    
    // No elegir la palabra objetivo ni sus sinónimos como distractores
    if (randomItem.hitza.toLowerCase() !== target.hitza.toLowerCase() && !correctOnes.includes(randomItem.hitza)) {
      const randomOption = Math.random() > 0.5 ? randomItem.hitza : getRandomItem(randomItem.sinonimoak);
      
      if (!distractors.includes(randomOption) && !correctOnes.includes(randomOption)) {
        distractors.push(randomOption);
      }
    }
  }

  const allOptions: Option[] = [
    ...correctOnes.map(text => ({ id: Math.random().toString(36).substr(2, 9), text, isCorrect: true })),
    ...distractors.map(text => ({ id: Math.random().toString(36).substr(2, 9), text, isCorrect: false }))
  ];

  return {
    word: target,
    // Barajamos y limitamos a 8 opciones máximo
    options: shuffleArray(allOptions).slice(0, 8)
  };
};
