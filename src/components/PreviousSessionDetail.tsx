import React, { useState, useEffect } from 'react';
import { getWorkouts, getExercises, deleteWorkout, loadData, saveData } from '../storage';
import { Workout } from '../types';
import { formatLocalDate } from '../utils/dateFormat';
// VIEW FOR A PREVIOUS SESSION.
interface Props {
  workoutId: string;
  onBack: () => void;
}

const WorkoutDetail: React.FC<Props> = ({ workoutId, onBack }) => {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const exercises = getExercises();

  useEffect(() => {
    const workouts = getWorkouts();
    const found = workouts.find(w => w.id === workoutId);
    setWorkout(found || null);
  }, [workoutId]);

  const handleDelete = () => {
    if (!workout) return;
    const dateStr = formatLocalDate(workout.date, { weekday: 'short', month: 'short', day: 'numeric' });
    if (window.confirm(`Are you sure you want to delete the session from ${dateStr}? This cannot be undone.`)) {
      deleteWorkout(workoutId);
      onBack(); // Navigate back after deletion
    }
  };

  const handleDeleteSet = (exerciseIndex: number, setId: string) => {
    if (!workout) return;
    
    const updatedWorkout = { ...workout };
    const exercise = updatedWorkout.exercises[exerciseIndex];
    const updatedSets = exercise.sets.filter(s => s.id !== setId);
    
    if (updatedSets.length === 0) {
      // Remove exercise if no sets left
      updatedWorkout.exercises.splice(exerciseIndex, 1);
      
      // If no exercises left, delete the entire workout
      if (updatedWorkout.exercises.length === 0) {
        if (window.confirm('This is the last set. Delete the entire session?')) {
          deleteWorkout(workoutId);
          onBack();
        }
        return;
      }
    } else {
      exercise.sets = updatedSets;
    }
    
    // Update workout in storage
    const data = loadData();
    const workoutIndex = data.workouts.findIndex(w => w.id === workoutId);
    if (workoutIndex >= 0) {
      data.workouts[workoutIndex] = updatedWorkout;
      saveData(data);
      setWorkout(updatedWorkout); // Update local state
    }
  };

  if (!workout) {
    return (
      <div>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Workout Not Found</h2>
        </div>
        <button onClick={onBack}>Back</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>
          {formatLocalDate(workout.date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </h2>
        <button
          onClick={handleDelete}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '6px 8px',
            width: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ff453a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          title="Delete session"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>

      {workout.notes && (
        <div className="card" style={{ marginBottom: '20px', padding: '16px', background: 'var(--accent-soft)' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{workout.notes}</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {workout.exercises.map((ex, i) => {
          const exercise = exercises.find(e => e.id === ex.exerciseId);
          const exerciseName = exercise?.name || 'Exercise';
          
          return (
            <div key={i} className="card" style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: exercise?.notes ? '8px' : '0' }}>
                  {exerciseName}
                </h3>
                {exercise?.notes && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '8px' }}>
                    {exercise.notes}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {ex.sets.map((set, setIdx) => (
                  <div
                    key={set.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      background: '#2c2c2e',
                      borderRadius: '8px'
                    }}
                  >
                    <span style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      Set {setIdx + 1}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                        <span style={{ fontWeight: '700', fontSize: '1rem' }}>
                        {set.reps} <span style={{ fontWeight: '400', color: 'var(--text-secondary)' }}>reps @</span> {set.isPerHand ? (
                          <>{set.weight * 2}lbs <span style={{ fontWeight: '400', color: 'var(--text-secondary)' }}>({set.weight}lbs x2)</span></>
                        ) : (
                          `${set.weight}lbs`
                        )}
                      </span>
                      </div>
                      <button
                        onClick={() => handleDeleteSet(i, set.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          padding: '6px',
                          width: 'auto',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#ff453a';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                        title="Delete set"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkoutDetail;

