import React, { useState, useEffect, useMemo } from 'react';
import { getExercises, getWorkoutHistoryForExercise, addWorkout, updateExercise, getWorkouts, loadData, saveData } from '../storage';
import { getRecommendation } from '../utils/progression';
import { Exercise, LiftSet, Workout } from '../types';
import { formatLocalDate, getTodayDateString } from '../utils/dateFormat';
interface Props {
  exerciseId: string;
  onFinish: () => void;
  onBack: () => void;
}

const WorkoutLogger: React.FC<Props> = ({ exerciseId, onFinish, onBack }) => {
  // Memoize exercises and exercise lookup to prevent unnecessary recalculations
  const exercises = useMemo(() => getExercises(), []);
  const exercise = useMemo(() => exercises.find(e => e.id === exerciseId), [exercises, exerciseId]);
  
  // Memoize history so it doesn't change on every render
  const history = useMemo(() => getWorkoutHistoryForExercise(exerciseId), [exerciseId]);
  
  const [sets, setSets] = useState<LiftSet[]>([]);
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [currentReps, setCurrentReps] = useState<string>('');
  const [isPerHand, setIsPerHand] = useState(exercise?.defaultPerHand ?? false);
  const [showCues, setShowCues] = useState(true);
  const [isEditingCues, setIsEditingCues] = useState(false);
  const [newCue, setNewCue] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());

  // Memoize recommendation to avoid unnecessary re-renders/resets
  const recommendation = useMemo(() => 
    exercise ? getRecommendation(exercise, history) : null,
  [exercise, history]);

  // Sync per-hand preference when exercise loads
  useEffect(() => {
    if (exercise) {
      setIsPerHand(exercise.defaultPerHand ?? false);
    }
  }, [exercise]);

  // Reset everything when exerciseId changes
  useEffect(() => {
    setHasInitialized(false);
    setSets([]);
    setCurrentWeight('');
    setCurrentReps('');
    setShowAllHistory(true); // Default to showing all history when switching exercises
    setSelectedDate(getTodayDateString()); // Reset to today when switching exercises
  }, [exerciseId]);

  // Initialize inputs once when recommendation is available (only on first load for this exercise)
  useEffect(() => {
    if (!hasInitialized && recommendation && sets.length === 0) {
      setCurrentWeight(recommendation.sets[0].weight > 0 ? recommendation.sets[0].weight.toString() : '');
      setCurrentReps(recommendation.sets[0].reps.toString());
      setHasInitialized(true);
    }
  }, [hasInitialized, recommendation, sets.length]);

  if (!exercise) return <div>Exercise not found</div>;

  const handleAddSet = () => {
    if (!currentWeight || !currentReps) return;
    
    const weight = parseFloat(currentWeight);
    const reps = parseInt(currentReps);
    
    if (isNaN(weight) || isNaN(reps) || weight <= 0 || reps <= 0) {
      alert('Please enter valid weight and reps');
      return;
    }
    
    const newSet: LiftSet = {
      id: crypto.randomUUID(),
      weight,
      reps,
      isPerHand,
      timestamp: Date.now()
    };
    
    const updatedSets = [...sets, newSet];
    setSets(updatedSets);
    
      // Auto-save workout when a set is added
      if (updatedSets.length > 0) {
        const workoutDate = selectedDate;
        const workout: Workout = {
          id: crypto.randomUUID(),
          date: workoutDate,
          exercises: [{
            exerciseId,
            sets: updatedSets
          }]
        };
        
        // Check if workout for selected date already exists
        const existingWorkouts = getWorkouts();
        const existingDateIndex = existingWorkouts.findIndex(w => w.date === workoutDate && w.exercises.some(ex => ex.exerciseId === exerciseId));
      
      if (existingDateIndex >= 0) {
        // Update existing workout for selected date
        const existing = existingWorkouts[existingDateIndex];
        const exerciseIndex = existing.exercises.findIndex(ex => ex.exerciseId === exerciseId);
        if (exerciseIndex >= 0) {
          existing.exercises[exerciseIndex].sets = updatedSets;
        } else {
          existing.exercises.push({ exerciseId, sets: updatedSets });
        }
        const data = loadData();
        data.workouts[existingDateIndex] = existing;
        saveData(data);
      } else {
        // Add new workout
        addWorkout(workout);
      }
    }
    
    // Keep weight and reps for next set (don't clear)
  };

  const handleAddCue = () => {
    if (!newCue.trim()) return;
    const updated = { ...exercise, cues: [...exercise.cues, newCue.trim()] };
    updateExercise(updated);
    setNewCue('');
  };

  const handleDeleteCue = (index: number) => {
    const updatedCues = [...exercise.cues];
    updatedCues.splice(index, 1);
    updateExercise({ ...exercise, cues: updatedCues });
  };


  return (
    <div style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{exercise.name}</h2>
      </div>

      <div className="card" style={{ marginBottom: '20px', padding: '16px' }}>
        <label className="muted" style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>
          Session Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          max={getTodayDateString()} // Can't select future dates
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: '#2c2c2e',
            color: 'white',
            fontSize: '0.9rem'
          }}
        />
      </div>

      {recommendation && (
        <div className="card" style={{ 
          border: 'none', 
          background: 'linear-gradient(135deg, var(--accent-soft) 0%, rgba(10, 132, 255, 0.25) 100%)', 
          marginBottom: '24px',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(10, 132, 255, 0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
            <span style={{ fontWeight: '700', color: 'var(--accent)', fontSize: '0.75rem', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>💡</span> RECOMMENDED
            </span>
            <span className="muted" style={{ fontSize: '0.7rem' }}>Based on last session</span>
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '4px', lineHeight: '1.3' }}>
            {recommendation.sets.map(s => s.reps).join(', ')} <span style={{ fontWeight: '400', fontSize: '1rem', color: 'rgba(255,255,255,0.7)' }}>reps @</span> {exercise.defaultPerHand ? (
              <>
                {recommendation.sets[0].weight * 2}lbs <span style={{ fontWeight: '400', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>({recommendation.sets[0].weight}x2)</span>
              </>
            ) : (
              `${recommendation.sets[0].weight}lbs`
            )}
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: '20px', borderRadius: '16px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setShowCues(!showCues)}>
            <span style={{ fontWeight: '600', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📝</span> Cues
            </span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>{showCues ? '▲' : '▼'}</span>
          </div>
          <button 
            onClick={() => setIsEditingCues(!isEditingCues)} 
            style={{ width: 'auto', padding: '4px 8px', fontSize: '0.7rem', background: isEditingCues ? 'var(--accent)' : 'var(--accent-soft)', color: isEditingCues ? 'white' : 'var(--accent)' }}
          >
            {isEditingCues ? 'Done' : 'Edit'}
          </button>
        </div>
        
        {showCues && (
          <div style={{ marginTop: '12px' }}>
            {exercise.cues.length === 0 && !isEditingCues && (
              <div className="muted" style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>No cues added yet.</div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {exercise.cues.map((cue, i) => (
                <div key={i} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  background: isEditingCues ? '#2c2c2e' : 'transparent', 
                  padding: isEditingCues ? '8px 12px' : '2px 0', 
                  borderRadius: '6px',
                  fontSize: '0.9rem' 
                }}>
                  <span>• {cue}</span>
                  {isEditingCues && (
                    <span onClick={(e) => { e.stopPropagation(); handleDeleteCue(i); }} style={{ color: '#ff453a', cursor: 'pointer', padding: '4px' }}>✕</span>
                  )}
                </div>
              ))}
            </div>

            {isEditingCues && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <input 
                  type="text" 
                  value={newCue} 
                  onChange={e => setNewCue(e.target.value)}
                  placeholder="Add a new cue..."
                  style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: '#2c2c2e', color: 'white', fontSize: '0.85rem' }}
                />
                <button onClick={handleAddCue} style={{ width: 'auto', padding: '8px 12px' }} className="secondary">+</button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card" style={{ padding: '24px', borderRadius: '18px', background: 'linear-gradient(135deg, var(--card-bg) 0%, #252528 100%)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label className="muted" style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Weight (lbs)</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="number" 
                step="any"
                value={currentWeight}
                onChange={e => setCurrentWeight(e.target.value)}
                placeholder="0"
                style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)', background: '#2c2c2e', color: 'white', fontSize: '1.1rem', fontWeight: '600' }}
              />
              <div 
                onClick={() => {
                  const newValue = !isPerHand;
                  setIsPerHand(newValue);
                  // Save preference to exercise
                  if (exercise) {
                    updateExercise({ ...exercise, defaultPerHand: newValue });
                  }
                }}
                style={{ 
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  padding: '4px 8px', borderRadius: '6px', background: isPerHand ? 'var(--accent)' : '#3a3a3c',
                  fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', color: 'white'
                }}
              >
                x2
              </div>
            </div>
          </div>
          <div>
            <label className="muted" style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Reps</label>
            <input 
              type="number" 
              value={currentReps}
              onChange={e => setCurrentReps(e.target.value)}
              placeholder="0"
              style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)', background: '#2c2c2e', color: 'white', fontSize: '1.1rem', fontWeight: '600' }}
            />
          </div>
        </div>
        <button onClick={handleAddSet} style={{ 
          background: 'linear-gradient(135deg, var(--accent) 0%, #0056b3 100%)', 
          color: 'white', 
          borderRadius: '12px',
          padding: '16px',
          fontSize: '1.05rem',
          fontWeight: '700',
          boxShadow: '0 4px 12px rgba(10, 132, 255, 0.3)',
          transition: 'transform 0.1s'
        }}>Log Set {sets.length + 1}</button>
      </div>

      {sets.length > 0 && (
        <div style={{ marginTop: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>
              Today's Performance
            </h3>
            <span className="muted" style={{ fontSize: '0.8rem', background: 'var(--accent-soft)', padding: '4px 10px', borderRadius: '12px', fontWeight: '600' }}>{sets.length} sets</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[...sets].reverse().map((set, i) => (
              <div key={set.id} className="card" style={{ 
                padding: '16px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '0', 
                background: 'linear-gradient(135deg, var(--card-bg) 0%, #252528 100%)', 
                borderColor: 'var(--border)',
                borderRadius: '14px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '10px', 
                    background: 'var(--accent-soft)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    color: 'var(--accent)'
                  }}>
                    {sets.length - i}
                  </div>
                  <span style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Set {sets.length - i}</span>
                </div>
                <span style={{ fontWeight: '700', fontSize: '1rem' }}>
                  {set.reps} <span style={{ fontWeight: '400', color: 'var(--text-secondary)' }}>reps @</span> {set.isPerHand ? (
                    <>{set.weight * 2}lbs <span style={{ fontWeight: '400', color: 'var(--text-secondary)' }}>({set.weight}lbs x2)</span></>
                  ) : (
                    `${set.weight}lbs`
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>
              History
            </h3>
            {history.length > 1 && (
              <span
                className="muted"
                style={{ fontSize: '0.85rem', cursor: 'pointer' }}
                onClick={() => setShowAllHistory(!showAllHistory)}
              >
                {showAllHistory ? 'Show less' : 'See all'}
              </span>
            )}
          </div>
          {showAllHistory ? (
            // Detailed history view (similar to History component)
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {history.map((session, sIdx) => (
                <div key={sIdx} className="card" style={{ padding: '16px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontWeight: '600', fontSize: '1rem', color: 'var(--accent)' }}>
                      {formatLocalDate(session.date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {session.sets.map((set, i) => (
                      <div key={i} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '8px 12px',
                        background: '#2c2c2e',
                        borderRadius: '8px'
                      }}>
                        <span style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                          Set {i + 1}
                        </span>
                        <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                          {set.reps} <span style={{ fontWeight: '400', color: 'var(--text-secondary)' }}>reps @</span> {set.isPerHand ? (
                            <>{set.weight * 2}lbs <span style={{ fontWeight: '400', color: 'var(--text-secondary)' }}>({set.weight}lbs x2)</span></>
                          ) : (
                            `${set.weight}lbs`
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Compact horizontal scroll view
            <div className="card" style={{ background: 'transparent', border: 'none', padding: '0' }}>
              <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '12px', scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}>
                {[history[0]].map((session, sIdx) => (
                  <div key={sIdx} style={{ 
                    padding: '16px', 
                    background: 'linear-gradient(135deg, var(--card-bg) 0%, #252528 100%)', 
                    borderRadius: '16px', 
                    border: '1px solid var(--border)', 
                    minWidth: '160px', 
                    scrollSnapAlign: 'start',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}>
                    <div className="muted" style={{ fontSize: '0.75rem', marginBottom: '12px', fontWeight: '500' }}>
                      {formatLocalDate(session.date, { month: 'short', day: 'numeric' })}
                    </div>
                    {session.sets.map((set, i) => (
                      <div key={i} style={{ fontSize: '0.9rem', marginBottom: '8px', lineHeight: '1.4' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '600' }}>Set {i+1}</span>
                        </div>
                        <div style={{ fontWeight: '600', marginTop: '2px', color: 'var(--text-primary)' }}>
                          {set.reps} <span style={{ fontWeight: '400', color: 'var(--text-secondary)' }}>reps @</span> {set.isPerHand ? (
                            <>{set.weight * 2}lbs <span style={{ fontWeight: '400', color: 'var(--text-secondary)' }}>({set.weight}lbs x2)</span></>
                          ) : (
                            `${set.weight}lbs`
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkoutLogger;
