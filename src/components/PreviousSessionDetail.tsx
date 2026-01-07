import React, { useState, useEffect } from 'react';
import { getWorkouts, getExercises, deleteWorkout } from '../storage';
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
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>
                {exerciseName}
              </h3>
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
                    <span style={{ fontWeight: '700', fontSize: '1rem' }}>
                      {set.reps} <span style={{ fontWeight: '400', color: 'var(--text-secondary)' }}>reps @</span> {set.isPerHand ? `${set.weight * 2}lbs ` : `${set.weight}lbs`}
                      {set.isPerHand && <span style={{ fontWeight: '400', color: 'var(--text-secondary)' }}>({set.weight}lbs x2)</span>}
                    </span>
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

