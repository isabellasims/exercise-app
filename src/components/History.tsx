import React, { useState } from 'react';
import { getWorkouts, getExercises } from '../storage';
import { Workout } from '../types';
import { formatLocalDate } from '../utils/dateFormat';
// ALL HISTORY VIEW. SHOWS ALL COMPLETED SESSIONS.
// TODO - ADD FILTERS FOR DATE RANGE AND EXERCISE.
interface Props {
  onBack: () => void;
  onViewWorkout: (workoutId: string) => void;
}

const History: React.FC<Props> = ({ onBack, onViewWorkout }) => {
  const workouts = getWorkouts().sort((a, b) => {
    // Sort by date string (YYYY-MM-DD) - most recent first
    // Simple string comparison works for YYYY-MM-DD format
    return b.date.localeCompare(a.date);
  });
  const exercises = getExercises();

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Workout History</h2>
      </div>

      {workouts.length === 0 ? (
        <div className="card" style={{ padding: '40px 20px', textAlign: 'center', borderStyle: 'dashed' }}>
          <div className="muted">No workout history yet.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="card"
              style={{
                padding: '20px',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onClick={() => onViewWorkout(workout.id)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ marginBottom: '12px' }}>
                <span
                  style={{
                    fontWeight: '600',
                    fontSize: '1.05rem',
                    color: 'var(--accent)'
                  }}
                >
                  {formatLocalDate(workout.date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {workout.exercises.map((ex, i) => {
                  const name = exercises.find(e => e.id === ex.exerciseId)?.name || 'Exercise';
                  return (
                    <div key={i} className="muted" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{name}</span> • {ex.sets.length} sets
                    </div>
                  );
                })}
              </div>
              {workout.notes && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                  <div className="muted" style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>{workout.notes}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;

