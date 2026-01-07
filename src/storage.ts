import { StoredData, Workout, Exercise, LiftSet, Routine } from './types';

const STORAGE_KEY = 'fitapp_data_v1';

const DEFAULT_DATA: StoredData = {
  exercises: [
    {
      id: '1',
      name: 'Hip Thrusts',
      cues: ['Brace core', 'Tuck hips', 'Lock out at top']
    },
    {
      id: '2',
      name: 'RDLs',
      cues: ['Hinge at hips', 'Keep back flat', 'Feel stretch in hamstrings']
    }
  ],
  workouts: [],
  routines: [],
  settings: {
    preferredUnit: 'lb',
    theme: 'default'
  }
};

export const loadData = (): StoredData => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_DATA;
  try {
    const parsed = JSON.parse(raw);
    // Ensure routines array exists for backwards compatibility
    if (!parsed.routines) {
      parsed.routines = [];
    }
    return parsed;
  } catch {
    return DEFAULT_DATA;
  }
};

export const saveData = (data: StoredData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getExercises = () => loadData().exercises;

export const getWorkouts = () => loadData().workouts;

export const addWorkout = (workout: Workout) => {
  const data = loadData();
  data.workouts.unshift(workout);
  saveData(data);
};

export const deleteWorkout = (workoutId: string) => {
  const data = loadData();
  data.workouts = data.workouts.filter(w => w.id !== workoutId);
  saveData(data);
};

export const updateExercise = (exercise: Exercise) => {
  const data = loadData();
  const index = data.exercises.findIndex(e => e.id === exercise.id);
  if (index >= 0) {
    data.exercises[index] = exercise;
  } else {
    data.exercises.push(exercise);
  }
  saveData(data);
};

export const getWorkoutHistoryForExercise = (exerciseId: string) => {
  const workouts = getWorkouts();
  return workouts
    .map(w => ({
      date: w.date,
      sets: w.exercises.find(ex => ex.exerciseId === exerciseId)?.sets || []
    }))
    .filter(w => w.sets.length > 0)
    .sort((a, b) => {
      // Sort by date string (YYYY-MM-DD) - most recent first
      // Simple string comparison works for YYYY-MM-DD format
      return b.date.localeCompare(a.date);
    });
};

export const getRoutines = () => loadData().routines || [];

export const addRoutine = (routine: Routine) => {
  const data = loadData();
  if (!data.routines) data.routines = [];
  data.routines.push(routine);
  saveData(data);
};

export const updateRoutine = (routine: Routine) => {
  const data = loadData();
  if (!data.routines) data.routines = [];
  const index = data.routines.findIndex(r => r.id === routine.id);
  if (index >= 0) {
    data.routines[index] = routine;
  } else {
    data.routines.push(routine);
  }
  saveData(data);
};

export const deleteRoutine = (routineId: string) => {
  const data = loadData();
  if (!data.routines) return;
  data.routines = data.routines.filter(r => r.id !== routineId);
  saveData(data);
};

export const deleteExercise = (exerciseId: string) => {
  const data = loadData();
  data.exercises = data.exercises.filter(e => e.id !== exerciseId);
  // Also remove this exercise from any routines that reference it
  if (data.routines) {
    data.routines = data.routines.map(routine => ({
      ...routine,
      exerciseIds: routine.exerciseIds.filter(id => id !== exerciseId)
    }));
  }
  saveData(data);
};

