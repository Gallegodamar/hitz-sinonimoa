
import { SynonymItem, Option } from './types';

export const getRandomItem = <T,>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const shuffleArray = <T,>(arr: T[]): T[] => {
  return [...arr].sort(() => Math.random() - 0.5);
};

export const generateRound = (data: SynonymItem[], currentWord?: SynonymItem): { word: SynonymItem, options: Option[] } => {
  const target = currentWord || getRandomItem(data);
  const correctOnes = target.sinonimoak;
  
  // Collect distractors
  const distractors: string[] = [];
  while (distractors.length < Math.max(4, 8 - correctOnes.length)) {
    const randomItem = getRandomItem(data);
    // Don't pick the target word or its synonyms as distractors
    if (randomItem.hitza !== target.hitza && !correctOnes.includes(randomItem.hitza)) {
      const randomOption = Math.random() > 0.5 ? randomItem.hitza : getRandomItem(randomItem.sinonimoak);
      if (!distractors.includes(randomOption) && !correctOnes.includes(randomOption)) {
        distractors.push(randomOption);
      }
    }
    // Safety break for small datasets
    if (distractors.length >= 7) break; 
  }

  const allOptions: Option[] = [
    ...correctOnes.map(text => ({ id: Math.random().toString(36).substr(2, 9), text, isCorrect: true })),
    ...distractors.map(text => ({ id: Math.random().toString(36).substr(2, 9), text, isCorrect: false }))
  ];

  return {
    word: target,
    options: shuffleArray(allOptions).slice(0, 8)
  };
};
