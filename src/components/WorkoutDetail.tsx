import React from 'react';
import { getWorkouts, getExercises } from '../storage';
import { Workout } from '../types';
import { formatLocalDate } from '../utils/dateFormat';
// VIEW FOR A PREVIOUS SESSION.
interface Props {
  workoutId: string;
  onBack: () => void;
}

const WorkoutDetail: React.FC<Props> = ({ workoutId, onBack }) => {
  const workouts = getWorkouts();
  const exercises = getExercises();
  const workout = workouts.find(w => w.id === workoutId);

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
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>
          {formatLocalDate(workout.date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </h2>
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

