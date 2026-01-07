export interface Exercise {
  id: string;
  name: string;
  cues: string[];
  category?: string;
  defaultPerHand?: boolean; // Remember if user prefers x2 (per-hand) for this exercise
  notes?: string; // Notes for this exercise (not per-set, but per-exercise)
}

export interface LiftSet {
  id: string;
  weight: number;
  reps: number;
  isPerHand: boolean;
  timestamp: number;
  notes?: string; // Notes for this specific set
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: LiftSet[];
}

export interface Workout {
  id: string;
  date: string; // ISO string
  exercises: WorkoutExercise[];
  notes?: string;
}

export interface Routine {
  id: string;
  name: string;
  exerciseIds: string[]; // Array of exercise IDs in order
  notes?: string;
}

export type ThemeMode = 'default' | 'sparkle' | 'minimal' | 'elegant' | 'light' | 'sunset' | 'ocean' | 'forest';

export interface StoredData {
  exercises: Exercise[];
  workouts: Workout[];
  routines: Routine[];
  settings: {
    preferredUnit: 'lb' | 'kg';
    theme: ThemeMode;
  };
}
