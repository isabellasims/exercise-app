import React, { useState, useEffect } from 'react';
import { getExercises, updateExercise, deleteExercise } from '../storage';
import { Exercise } from '../types';
// VIEW FOR ALL EXERCISES IN APP. ALLOWS CREATION AND SELECTION OF EXERCISES.
interface Props {
  onSelect: (id: string) => void;
  onBack: () => void;
}

const ExerciseSelector: React.FC<Props> = ({ onSelect, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [exercises, setExercises] = useState(getExercises());

  useEffect(() => {
    setExercises(getExercises());
  }, [editingId, isAdding]);

  const filtered = exercises.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    if (!newName.trim()) return;
    const exercise: Exercise = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      cues: [],
    };
    updateExercise(exercise);
    setNewName('');
    setIsAdding(false);
    onSelect(exercise.id);
  };

  const handleStartEdit = (exercise: Exercise) => {
    setEditingId(exercise.id);
    setEditName(exercise.name);
  };

  const handleSaveEdit = () => {
    if (!editName.trim() || !editingId) return;
    const exercise = exercises.find(e => e.id === editingId);
    if (exercise) {
      updateExercise({ ...exercise, name: editName.trim() });
      setExercises(getExercises()); // Refresh exercises list
    }
    setEditingId(null);
    setEditName('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleDelete = (exerciseId: string, exerciseName: string) => {
    if (window.confirm(`Are you sure you want to delete "${exerciseName}"? This will also remove it from any routines.`)) {
      deleteExercise(exerciseId);
      setExercises(getExercises());
    }
  };

  if (isAdding) {
    return (
      <div className="card">
        <h2 style={{ marginBottom: 16 }}>New Exercise</h2>
        <label className="muted" style={{ display: 'block', marginBottom: 6 }}>
          Name
        </label>
        <input
          autoFocus
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="e.g. Bulgarian split squats"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: '#2c2c2e',
            color: 'white',
            marginBottom: 16,
          }}
        />
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="secondary" onClick={() => setIsAdding(false)} style={{ width: 'auto' }}>
            Cancel
          </button>
          <button onClick={handleCreate} disabled={!newName.trim()} style={{ width: 'auto' }}>
            Create
          </button>
        </div>
        <div style={{ marginTop: '16px' }}>
          <button className="secondary" onClick={() => setIsAdding(false)} style={{ width: '100%' }}>
            ← Back to Exercises
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Exercises</h2>
        <button onClick={() => setIsAdding(true)} style={{ width: 'auto', padding: '10px 18px', fontSize: '0.9rem' }}>
          + New
        </button>
      </div>

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
          background: 'var(--card-bg)',
          color: 'white',
          marginBottom: 16,
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 ? (
          <div className="muted" style={{ textAlign: 'center', padding: 32 }}>
            No exercises found. Create one!
          </div>
        ) : (
          filtered.map((exercise) => (
            <div
              key={exercise.id}
              className="card"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}
            >
              {editingId === exercise.id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    autoFocus
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      background: '#2c2c2e',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                  />
                  <button
                    onClick={handleSaveEdit}
                    style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
                    disabled={!editName.trim()}
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="secondary"
                    style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div
                    style={{ flex: 1, fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => onSelect(exercise.id)}
                  >
                    {exercise.name}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEdit(exercise);
                    }}
                    style={{
                      width: 'auto',
                      padding: '6px 12px',
                      fontSize: '0.75rem',
                      background: 'var(--accent-soft)',
                      color: 'var(--accent)',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(exercise.id, exercise.name);
                    }}
                    style={{
                      width: 'auto',
                      padding: '6px 8px',
                      fontSize: '1rem',
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
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
                    title="Delete exercise"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                  <div
                    style={{ color: 'var(--accent)', cursor: 'pointer' }}
                    onClick={() => onSelect(exercise.id)}
                  >
                    →
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExerciseSelector;

