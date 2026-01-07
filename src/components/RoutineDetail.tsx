import React, { useState, useEffect } from 'react';
import { getRoutines, getExercises, updateRoutine, deleteRoutine } from '../storage';
import { Routine } from '../types';
// VIEW FOR A SPECIFIC ROUTINE. ALLOWS EDIT, DELETE, AND START WORKOUT.
// TODO - BACK BUTTON SHOULD ALWAYS NAVIGATE TO ROUTINES VIEW.
interface Props {
  routineId: string;
  onBack: () => void;
  onEdit: () => void;
  onStartWorkout: (exerciseId: string) => void;
}

const RoutineDetail: React.FC<Props> = ({ routineId, onBack, onEdit, onStartWorkout }) => {
  const [routine, setRoutine] = useState<Routine | null>(null);
  const exercises = getExercises();

  useEffect(() => {
    const routines = getRoutines();
    const found = routines.find(r => r.id === routineId);
    setRoutine(found || null);
  }, [routineId]);

  if (!routine) {
    return (
      <div>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Routine Not Found</h2>
        </div>
        <button onClick={onBack}>Back</button>
      </div>
    );
  }

  const routineExercises = routine.exerciseIds
    .map(id => exercises.find(e => e.id === id))
    .filter(Boolean);

  const handleStartWorkout = () => {
    if (routineExercises.length > 0) {
      onStartWorkout(routineExercises[0]!.id);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{routine.name}</h2>
        <button onClick={onEdit} className="secondary" style={{ width: 'auto', padding: '8px 16px', fontSize: '0.85rem' }}>
          Edit
        </button>
      </div>

      {routine.notes && (
        <div className="card" style={{ marginBottom: '20px', padding: '16px', background: 'var(--accent-soft)' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{routine.notes}</div>
        </div>
      )}

      {routineExercises.length > 0 ? (
        <>
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', color: 'var(--text-secondary)' }}>
              Exercises ({routineExercises.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {routineExercises.map((exercise, i) => (
                <div
                  key={exercise?.id || i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    background: '#2c2c2e',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: 'var(--accent-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                      color: 'var(--accent)'
                    }}>
                      {i + 1}
                    </div>
                    <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                      {exercise?.name || 'Exercise'}
                    </span>
                  </div>
                  <button
                    onClick={() => exercise && onStartWorkout(exercise.id)}
                    className="secondary"
                    style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem' }}
                  >
                    Log
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleStartWorkout} style={{ marginBottom: '12px' }}>
            Start Routine
          </button>
        </>
      ) : (
        <div className="card" style={{ padding: '40px 20px', textAlign: 'center', borderStyle: 'dashed', marginBottom: '20px' }}>
          <div className="muted" style={{ marginBottom: '16px' }}>No exercises in this routine.</div>
          <button onClick={onEdit} style={{ width: 'auto' }}>
            Add Exercises
          </button>
        </div>
      )}

      <button
        onClick={() => {
          if (window.confirm(`Are you sure you want to delete "${routine.name}"?`)) {
            deleteRoutine(routineId);
            onBack();
          }
        }}
        style={{ background: '#ff453a', color: 'white', width: '100%' }}
      >
        Delete Routine
      </button>
    </div>
  );
};

export default RoutineDetail;

