import React, { useState, useEffect } from 'react';
import { getRoutines, getExercises, addRoutine, updateRoutine } from '../storage';
import { Routine } from '../types';

interface Props {
  routineId?: string; // If provided, we're editing; otherwise creating
  onBack: () => void;
  onSave: () => void;
}

const RoutineEditor: React.FC<Props> = ({ routineId, onBack, onSave }) => {
  const [name, setName] = useState('');
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const exercises = getExercises();

  useEffect(() => {
    if (routineId) {
      const routines = getRoutines();
      const routine = routines.find(r => r.id === routineId);
      if (routine) {
        setName(routine.name);
        setSelectedExerciseIds([...routine.exerciseIds]);
      }
    }
  }, [routineId]);

  const filteredExercises = exercises.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedExerciseIds.includes(e.id)
  );

  const selectedExercises = selectedExerciseIds
    .map(id => exercises.find(e => e.id === id))
    .filter(Boolean);

  const handleToggleExercise = (exerciseId: string) => {
    if (selectedExerciseIds.includes(exerciseId)) {
      setSelectedExerciseIds(selectedExerciseIds.filter(id => id !== exerciseId));
    } else {
      setSelectedExerciseIds([...selectedExerciseIds, exerciseId]);
    }
  };

  const handleMoveExercise = (index: number, direction: 'up' | 'down') => {
    const newIds = [...selectedExerciseIds];
    if (direction === 'up' && index > 0) {
      [newIds[index - 1], newIds[index]] = [newIds[index], newIds[index - 1]];
    } else if (direction === 'down' && index < newIds.length - 1) {
      [newIds[index], newIds[index + 1]] = [newIds[index + 1], newIds[index]];
    }
    setSelectedExerciseIds(newIds);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a routine name');
      return;
    }

    const routine: Routine = {
      id: routineId || crypto.randomUUID(),
      name: name.trim(),
      exerciseIds: selectedExerciseIds
    };

    if (routineId) {
      updateRoutine(routine);
    } else {
      addRoutine(routine);
    }

    onSave();
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>
          {routineId ? 'Edit Routine' : 'New Routine'}
        </h2>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <label className="muted" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>
          Routine Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Heavy Glutes, Upper Body"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: '#2c2c2e',
            color: 'white',
            fontSize: '1rem'
          }}
        />
      </div>

      {selectedExercises.length > 0 && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px' }}>
            Selected Exercises ({selectedExercises.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {selectedExercises.map((exercise, i) => (
              <div
                key={exercise?.id || i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px',
                  background: '#2c2c2e',
                  borderRadius: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: 'var(--accent-soft)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '0.75rem',
                    color: 'var(--accent)'
                  }}>
                    {i + 1}
                  </div>
                  <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                    {exercise?.name || 'Exercise'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => handleMoveExercise(i, 'up')}
                    disabled={i === 0}
                    className="secondary"
                    style={{ width: 'auto', padding: '4px 8px', fontSize: '0.7rem', opacity: i === 0 ? 0.5 : 1 }}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMoveExercise(i, 'down')}
                    disabled={i === selectedExercises.length - 1}
                    className="secondary"
                    style={{ width: 'auto', padding: '4px 8px', fontSize: '0.7rem', opacity: i === selectedExercises.length - 1 ? 0.5 : 1 }}
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => handleToggleExercise(exercise!.id)}
                    className="secondary"
                    style={{ width: 'auto', padding: '4px 8px', fontSize: '0.7rem' }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px' }}>
          Add Exercises
        </h3>
        <input
          type="text"
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: '#2c2c2e',
            color: 'white',
            marginBottom: '12px'
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
          {filteredExercises.length === 0 ? (
            <div className="muted" style={{ textAlign: 'center', padding: '20px', fontSize: '0.85rem' }}>
              {searchTerm ? 'No exercises found' : 'All exercises added'}
            </div>
          ) : (
            filteredExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="card"
                style={{
                  padding: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0'
                }}
                onClick={() => handleToggleExercise(exercise.id)}
                onMouseEnter={(e) => e.currentTarget.style.background = '#2c2c2e'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--card-bg)'}
              >
                <span style={{ fontWeight: '500' }}>{exercise.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleExercise(exercise.id);
                  }}
                  className="secondary"
                  style={{ width: 'auto', padding: '4px 12px', fontSize: '0.8rem' }}
                >
                  Add
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={onBack} className="secondary" style={{ flex: 1 }}>
          Cancel
        </button>
        <button onClick={handleSave} style={{ flex: 1 }}>
          Save Routine
        </button>
      </div>
    </div>
  );
};

export default RoutineEditor;

