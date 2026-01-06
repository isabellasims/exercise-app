import React, { useState, useEffect } from 'react';
import { getWorkouts, getExercises } from '../storage';
import { formatLocalDate } from '../utils/dateFormat';
interface Props {
  onStartWorkout: () => void;
  onViewHistory: () => void;
  onViewRoutines: () => void;
  onViewWorkout: (workoutId: string) => void;
}

const Home: React.FC<Props> = ({ onStartWorkout, onViewHistory, onViewRoutines, onViewWorkout }) => {
  const [workouts, setWorkouts] = useState(getWorkouts());
  const exercises = getExercises();
  
  // Reload workouts whenever component mounts or when key changes
  useEffect(() => {
    setWorkouts(getWorkouts());
  }, []);

  // Sort workouts by date (most recent first) and get top 3
  const recentWorkouts = [...workouts]
    .sort((a, b) => b.date.localeCompare(a.date)) // Simple string comparison works for YYYY-MM-DD format
    .slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div 
        className="card" 
        style={{ 
          background: `linear-gradient(135deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 80%, black) 100%)`, 
          borderColor: 'transparent', 
          padding: '28px 22px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
        }}
      >
        <h2 style={{ color: 'white', fontSize: '1.4rem', marginBottom: '8px', fontWeight: '700' }}>Ready for your session?</h2>
        <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '22px', fontSize: '0.95rem', lineHeight: '1.5', fontWeight: '400' }}>
          Your next progressive overload goal is waiting.
        </p>
        <button 
          onClick={onStartWorkout} 
          style={{ 
            background: 'white', 
            color: 'var(--accent)', 
            width: 'auto', 
            padding: '13px 26px',
            fontSize: '1rem',
            fontWeight: '700',
            boxShadow: '0 3px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.9)'
          }}
        >
          Start Workout
        </button>
      </div>

      <div 
        className="card" 
        style={{ 
          textAlign: 'center', 
          padding: '20px 10px', 
          margin: 0,
          cursor: 'pointer',
          transition: 'transform 0.2s'
        }}
        onClick={onViewRoutines}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🗓️</div>
        <div style={{ fontWeight: '600' }}>Routines</div>
      </div>

      {recentWorkouts.length > 0 ? (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Recent Sessions</h3>
            <span
              className="muted"
              style={{ fontSize: '0.85rem', cursor: 'pointer' }}
              onClick={onViewHistory}
            >
              See all
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentWorkouts.map((workout) => (
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
                      color: 'var(--accent)',
                      cursor: 'pointer'
                    }}
                  >
                    {formatLocalDate(workout.date, { weekday: 'short', month: 'short', day: 'numeric' })}
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
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="card" style={{ padding: '40px 20px', textAlign: 'center', borderStyle: 'dashed' }}>
          <div className="muted">Your workout history will appear here.</div>
        </div>
      )}
    </div>
  );
};

export default Home;
