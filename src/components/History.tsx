import React, { useState, useEffect } from 'react';
import { getWorkouts, getExercises, deleteWorkout } from '../storage';
import { Workout } from '../types';
import { formatLocalDate } from '../utils/dateFormat';
// ALL HISTORY VIEW. SHOWS ALL COMPLETED SESSIONS.
// TODO - ADD FILTERS FOR DATE RANGE AND EXERCISE. IF A SPECIFICC EXERCISE IS SELECTED, ONLY SHOW HISTORY OF THAT EXERCISE. DO NOT SHOW FULL SESSION. CAN REUSE WORKOUT HISTORY VIEW FOR THIS.
interface Props {
  onBack: () => void;
  onViewWorkout: (workoutId: string) => void;
}

const History: React.FC<Props> = ({ onBack, onViewWorkout }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const exercises = getExercises();

  const refreshWorkouts = () => {
    const sorted = getWorkouts().sort((a, b) => {
      // Sort by date string (YYYY-MM-DD) - most recent first
      return b.date.localeCompare(a.date);
    });
    setWorkouts(sorted);
  };

  useEffect(() => {
    refreshWorkouts();
  }, []);

  const handleDelete = (workoutId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    const workout = workouts.find(w => w.id === workoutId);
    const dateStr = workout ? formatLocalDate(workout.date, { weekday: 'short', month: 'short', day: 'numeric' }) : 'this session';
    if (window.confirm(`Are you sure you want to delete the session from ${dateStr}? This cannot be undone.`)) {
      deleteWorkout(workoutId);
      refreshWorkouts();
    }
  };

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
                transition: 'transform 0.2s',
                position: 'relative'
              }}
              onClick={() => onViewWorkout(workout.id)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            > 
            {/* DELETE BUTTON */}
              <button
                onClick={(e) => handleDelete(workout.id, e)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
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
              <div style={{ marginBottom: '12px', paddingRight: '32px' }}>
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

