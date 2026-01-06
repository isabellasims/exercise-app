import { Exercise, LiftSet } from '../types';

export interface Recommendation {
  sets: { weight: number; reps: number }[];
  message: string;
}

export const getRecommendation = (
  exercise: Exercise,
  history: { date: string; sets: LiftSet[] }[]
): Recommendation => {
  if (history.length === 0) {
    return {
      sets: [
        { weight: 0, reps: 10 },
        { weight: 0, reps: 10 },
        { weight: 0, reps: 10 }
      ],
      message: "Set your starting weight and reps for today."
    };
  }

  const lastSession = history[0];
  const lastSets = lastSession.sets;
  
  // Logic: Add 1 rep to the first set that can be improved, 
  // or add 1 rep to the 'weakest' set to smooth out the volume.
  // The user's specific request: "12, 10, 10 -> 12, 11, 10" (increment from the left)
  
  const recommendedSets = lastSets.map(s => ({ weight: s.weight, reps: s.reps }));
  
  // Find the first set to increment (simple linear progression)
  // We'll increment the first set that doesn't exceed a reasonable "ceiling" 
  // or just the first set that hasn't been incremented relative to others.
  let incrementedIndex = -1;
  for (let i = 0; i < recommendedSets.length; i++) {
    // If this set has fewer reps than the one before it, increment it first
    if (i > 0 && recommendedSets[i].reps < recommendedSets[i-1].reps) {
      recommendedSets[i].reps += 1;
      incrementedIndex = i;
      break;
    }
  }

  // If all sets were equal, increment the first one
  if (incrementedIndex === -1) {
    recommendedSets[0].reps += 1;
    incrementedIndex = 0;
  }

  return {
    sets: recommendedSets,
    message: `Last time: ${lastSets.map(s => s.reps).join(', ')}. Today's goal: ${recommendedSets.map(s => s.reps).join(', ')}.`
  };
};
