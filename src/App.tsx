import React, { useEffect, useRef, useState } from 'react';
import Home from './components/Home';
import WorkoutLogger from './components/WorkoutLogger';
import ExerciseSelector from './components/ExerciseSelector';
import Settings from './components/Settings';
import History from './components/History';
import WorkoutDetail from './components/WorkoutDetail';
import Routines from './components/Routines';
import RoutineDetail from './components/RoutineDetail';
import RoutineEditor from './components/RoutineEditor';
import { loadData } from './storage';
import { applyTheme } from './utils/themes';

type View =
  | 'home'
  | 'exercise-selector'
  | 'logger'
  | 'settings'
  | 'history'
  | 'workout-detail'
  | 'routines'
  | 'routine-detail'
  | 'routine-editor';

function App() {
  const [view, setView] = useState<View>('home');

  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);

  const [homeRefreshKey, setHomeRefreshKey] = useState(0);

  /**
   * One-step-back model:
   * - When you navigate to a new view (non-settings), you set `backTargetRef` to the current view.
   * - Settings behaves like a modal: it uses a separate return ref and does NOT mutate backTargetRef.
   */
  const backTargetRef = useRef<View>('home');
  const settingsReturnRef = useRef<View>('home');

  // Apply theme on app load
  useEffect(() => {
    const data = loadData();
    const theme = data.settings?.theme ?? 'default';
    applyTheme(theme);
  }, []);

  // Helper: navigate with one-step-back semantics (excluding settings)
  const go = (next: View) => {
    backTargetRef.current = view;
    setView(next);
  };

  // Helper: open settings without disturbing back target
  const openSettings = () => {
    settingsReturnRef.current = view;
    setView('settings');
  };

  // Helper: top-bar back
  const topBack = () => {
    if (view === 'settings') {
      setView(settingsReturnRef.current);
      return;
    }

    // Optional: if you want logger-back to also restore selector's back to home (same as your old logic)
    if (view === 'logger' && backTargetRef.current === 'exercise-selector') {
      console.log('IN LOGGER');
      // After returning to selector, pressing back should go home
      // (because selector itself was reached from home in your main flow)
      backTargetRef.current = 'home';
      setView('exercise-selector');
      return;
    }

    setView(backTargetRef.current);
  };

  const handleWorkoutFinished = () => {
    setHomeRefreshKey((prev) => prev + 1);
    // Finishing is a "reset" in most apps: send to home and make home the back target.
    backTargetRef.current = 'home';
    setView('home');
  };

  return (
    <div className="app-container">
      {/* Top bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          maxWidth: '500px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          background: 'var(--bg-color)',
          zIndex: 100,
        }}
      >
        {view !== 'home' ? (
          <button
            onClick={topBack}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-soft)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
          >
            ←
          </button>
        ) : (
          <div style={{ width: '40px' }} />
        )}

        <button
          onClick={openSettings}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '1.2rem',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-soft)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
        >
          ⚙️
        </button>
      </div>

      <main style={{ flex: 1, padding: '16px', paddingTop: '72px', paddingBottom: '20px' }}>
        {view === 'home' && (
          <Home
            key={homeRefreshKey}
            onStartWorkout={() => go('exercise-selector')}
            onViewHistory={() => go('history')}
            onViewRoutines={() => {
              setSelectedRoutineId(null);
              go('routines');
            }}
            onViewWorkout={(workoutId) => {
              setSelectedWorkoutId(workoutId);
              go('workout-detail'); // ✅ back target becomes 'home' automatically
              console.log('IN WORKOUT DETAIL');
            }}
          />
        )}

        {view === 'exercise-selector' && (
          <ExerciseSelector
            onSelect={(exerciseId) => {
              setSelectedExerciseId(exerciseId);
              go('logger'); // ✅ back target becomes 'exercise-selector'
            }}
            onBack={topBack}
          />
        )}

        {view === 'logger' && selectedExerciseId && (
          <WorkoutLogger
            exerciseId={selectedExerciseId}
            onFinish={handleWorkoutFinished}
            onBack={topBack}
          />
        )}

        {view === 'settings' && <Settings onBack={topBack} />}

        {view === 'history' && (
          <History
            onBack={topBack}
            onViewWorkout={(workoutId) => {
              setSelectedWorkoutId(workoutId);
              go('workout-detail'); // ✅ back target becomes 'history'
            }}
          />
        )}

        {view === 'workout-detail' && selectedWorkoutId && (
          <WorkoutDetail workoutId={selectedWorkoutId} onBack={topBack} />
        )}

        {view === 'routines' && (
          <Routines
            onBack={topBack}
            onViewRoutine={(routineId) => {
              setSelectedRoutineId(routineId);
              go('routine-detail'); // ✅ back target becomes 'routines'
            }}
            onCreateRoutine={() => {
              setSelectedRoutineId(null);
              go('routine-editor'); // ✅ back target becomes 'routines'
            }}
          />
        )}

        {view === 'routine-detail' && selectedRoutineId && (
          <RoutineDetail
            routineId={selectedRoutineId}
            onBack={topBack}
            onEdit={() => go('routine-editor')} // ✅ back target becomes 'routine-detail'
            onStartWorkout={(exerciseId) => {
              setSelectedExerciseId(exerciseId);
              go('logger'); // ✅ back target becomes 'routine-detail'
            }}
          />
        )}

        {view === 'routine-editor' && (
          <RoutineEditor
            routineId={selectedRoutineId || undefined}
            onBack={topBack}
            onSave={() => {
              // After save, go "back" to where you came from (routines or routine-detail)
              topBack();
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
