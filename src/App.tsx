import React, { useEffect, useRef, useState } from 'react';
import Home from './components/Home';
import WorkoutLogger from './components/WorkoutLogger';
import ExerciseSelector from './components/ExerciseSelector';
import Settings from './components/Settings';
import History from './components/History';
import PreviousSessionDetail from './components/PreviousSessionDetail';
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
  | 'previous-session-detail'
  | 'routines'
  | 'routine-detail'
  | 'routine-editor';

function App() {
  const [view, setView] = useState<View>('home');

  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [selectedPreviousSessionId, setSelectedPreviousSessionId] = useState<string | null>(null);
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);

  const [homeRefreshKey, setHomeRefreshKey] = useState(0);

  // Explicit parent-child relationships for navigation
  // Each view knows its logical parent
  const viewParents: Record<View, View | null> = {
    'home': null, // Root view, no parent
    'exercise-selector': 'home',
    'logger': 'exercise-selector', // Can also come from routine-detail, handled below
    'history': 'home',
    'previous-session-detail': 'history', // Can also come from home, handled below
    'routines': 'home',
    'routine-detail': 'routines',
    'routine-editor': 'routines', // Can also come from routine-detail, handled below
    'settings': null, // Modal, uses separate return ref
  };

  // Track where we came from for views that can have multiple parents
  const loggerSourceRef = useRef<View>('exercise-selector');
  const previousSessionSourceRef = useRef<View>('history');
  const routineEditorSourceRef = useRef<View>('routines');
  const settingsReturnRef = useRef<View>('home');

  // Apply theme on app load
  useEffect(() => {
    const data = loadData();
    const theme = data.settings?.theme ?? 'default';
    applyTheme(theme);
  }, []);

  // Helper: navigate to a view, tracking source for multi-parent views
  const go = (next: View) => {
    // Track source for views that can come from multiple places
    if (next === 'logger') {
      loggerSourceRef.current = view;
    } else if (next === 'previous-session-detail') {
      previousSessionSourceRef.current = view;
    } else if (next === 'routine-editor') {
      routineEditorSourceRef.current = view;
    }
    setView(next);
  };

  // Helper: open settings without disturbing navigation
  const openSettings = () => {
    settingsReturnRef.current = view;
    setView('settings');
  };

  // Helper: get the parent view for the current view
  const getParentView = (currentView: View): View | null => {
    if (currentView === 'settings') {
      return settingsReturnRef.current;
    }
    
    // Handle views with multiple possible parents
    if (currentView === 'logger') {
      return loggerSourceRef.current;
    }
    if (currentView === 'previous-session-detail') {
      return previousSessionSourceRef.current;
    }
    if (currentView === 'routine-editor') {
      return routineEditorSourceRef.current;
    }
    
    // Default: use the parent mapping
    return viewParents[currentView];
  };

  // Helper: top-bar back - always goes to logical parent
  const topBack = () => {
    const parent = getParentView(view);
    if (parent) {
      setView(parent);
    } else {
      // Fallback to home if no parent (shouldn't happen)
      setView('home');
    }
  };

  const handleWorkoutFinished = () => {
    setHomeRefreshKey((prev) => prev + 1);
    // Finishing workout returns to home
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
              setSelectedPreviousSessionId(workoutId);
              go('previous-session-detail'); // ✅ back target becomes 'home' automatically
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
              setSelectedPreviousSessionId(workoutId);
              go('previous-session-detail'); // ✅ back target becomes 'history'
            }}
          />
        )}

        {view === 'previous-session-detail' && selectedPreviousSessionId && (
          <PreviousSessionDetail workoutId={selectedPreviousSessionId} onBack={topBack} />
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
