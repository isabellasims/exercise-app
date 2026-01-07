import React, { useState, useEffect, useMemo } from 'react';
import { getWorkouts, getExercises, deleteWorkout, getWorkoutHistoryForExercise } from '../storage';
import { Workout } from '../types';
import { formatLocalDate } from '../utils/dateFormat';
// ALL HISTORY VIEW. SHOWS ALL COMPLETED SESSIONS.
interface Props {
  onBack: () => void;
  onViewWorkout: (workoutId: string) => void;
}

const History: React.FC<Props> = ({ onBack, onViewWorkout }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
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

  // Filter workouts based on selected filters
  const filteredWorkouts = useMemo(() => {
    let filtered = workouts;

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(w => w.date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(w => w.date <= endDate);
    }

    return filtered;
  }, [workouts, startDate, endDate]);

  // Get exercise history if an exercise is selected
  const exerciseHistory = useMemo(() => {
    if (!selectedExerciseId) return null;
    return getWorkoutHistoryForExercise(selectedExerciseId)
      .filter(session => {
        if (startDate && session.date < startDate) return false;
        if (endDate && session.date > endDate) return false;
        return true;
      });
  }, [selectedExerciseId, startDate, endDate]);

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

      {/* Filters */}
      <div className="card" style={{ marginBottom: '20px', padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
              Filter by Exercise
            </label>
            <select
              value={selectedExerciseId}
              onChange={(e) => setSelectedExerciseId(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '0.9rem'
              }}
            >
              <option value="">All Exercises</option>
              {exercises.map(ex => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>
          {(selectedExerciseId || startDate || endDate) && (
            <button
              onClick={() => {
                setSelectedExerciseId('');
                setStartDate('');
                setEndDate('');
              }}
              className="secondary"
              style={{ width: 'auto', alignSelf: 'flex-start', padding: '6px 12px', fontSize: '0.85rem' }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Exercise-specific history view */}
      {selectedExerciseId && exerciseHistory && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>
            {exercises.find(e => e.id === selectedExerciseId)?.name || 'Exercise'} History
          </h3>
          {exerciseHistory.length === 0 ? (
            <div className="card" style={{ padding: '40px 20px', textAlign: 'center', borderStyle: 'dashed' }}>
              <div className="muted">No history for this exercise in the selected date range.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {exerciseHistory.map((session, idx) => (
                <div key={idx} className="card" style={{ padding: '16px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontWeight: '600', fontSize: '1rem', color: 'var(--accent)' }}>
                      {formatLocalDate(session.date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {session.sets.map((set, setIdx) => (
                      <div key={setIdx} style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                            Set {setIdx + 1}:                           {set.reps} <span style={{ fontWeight: '400', color: 'var(--text-secondary)' }}>reps @</span> {set.isPerHand ? (
                            <>{set.weight * 2}lbs <span style={{ fontWeight: '400', color: 'var(--text-secondary)' }}>({set.weight}lbs x2)</span></>
                          ) : (
                            `${set.weight}lbs`
                          )}
                        </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Full workout sessions view (when no exercise is selected) */}
      {!selectedExerciseId && (
        <>
          {filteredWorkouts.length === 0 ? (
            <div className="card" style={{ padding: '40px 20px', textAlign: 'center', borderStyle: 'dashed' }}>
              <div className="muted">No workout history {startDate || endDate ? 'in the selected date range' : 'yet'}.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredWorkouts.map((workout) => (
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
        </>
      )}
    </div>
  );
};

export default History;

