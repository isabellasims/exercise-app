import React, { useState, useEffect } from 'react';
import { getRoutines, getExercises } from '../storage';
import { Routine } from '../types';
// VIEW OF ALL ROUTINES

interface Props {
  onBack: () => void;
  onViewRoutine: (routineId: string) => void;
  onCreateRoutine: () => void;
}

const Routines: React.FC<Props> = ({ onBack, onViewRoutine, onCreateRoutine }) => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const exercises = getExercises();

  useEffect(() => {
    setRoutines(getRoutines());
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Routines</h2>
        <button onClick={onCreateRoutine} style={{ width: 'auto', padding: '10px 18px', fontSize: '0.9rem' }}>
          + New
        </button>
      </div>

      {routines.length === 0 ? (
        <div className="card" style={{ padding: '40px 20px', textAlign: 'center', borderStyle: 'dashed' }}>
          <div className="muted" style={{ marginBottom: '16px' }}>No routines yet.</div>
          <button onClick={onCreateRoutine} style={{ width: 'auto' }}>
            Create Your First Routine
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {routines.map((routine) => {
            const routineExercises = routine.exerciseIds
              .map(id => exercises.find(e => e.id === id))
              .filter(Boolean);
            
            return (
              <div
                key={routine.id}
                className="card"
                style={{
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onClick={() => onViewRoutine(routine.id)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>
                    {routine.name}
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {routineExercises.length > 0 ? (
                    routineExercises.map((exercise, i) => (
                      <div key={i} className="muted" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {i + 1}. {exercise?.name || 'Exercise'}
                      </div>
                    ))
                  ) : (
                    <div className="muted" style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>
                      No exercises added yet
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Routines;


