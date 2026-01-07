import React, { useRef, useState, useEffect } from 'react';
import { loadData, saveData } from '../storage';
import { applyTheme } from '../utils/themes';
import { ThemeMode } from '../types';

interface Props {
  onBack: () => void;
}

const Settings: React.FC<Props> = ({ onBack }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const data = loadData();
  const [theme, setTheme] = useState<ThemeMode>(data.settings?.theme ?? 'default');
  const [showTextImport, setShowTextImport] = useState(false);
  const [importText, setImportText] = useState('');

  // Apply theme when it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    const updatedData = loadData();
    updatedData.settings = { ...updatedData.settings, theme: newTheme };
    saveData(updatedData);
  };

  const handleExport = () => {
    const data = loadData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fitapp_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        // Validate that it has the required structure (exercises and workouts are required, routines and settings are optional)
        if (data.exercises && data.workouts) {
          // Ensure routines and settings exist for backwards compatibility
          if (!data.routines) data.routines = [];
          if (!data.settings) {
            data.settings = {
              preferredUnit: 'lb',
              theme: 'default'
            };
          }
          saveData(data);
          alert('Data imported successfully!');
          window.location.reload();
        } else {
          alert('Invalid backup file.');
        }
      } catch (err) {
        alert('Error parsing backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleImportText = () => {
    if (!importText.trim()) {
      alert('Please paste JSON data first.');
      return;
    }

    try {
      const data = JSON.parse(importText);
      // Validate that it has the required structure (exercises and workouts are required, routines and settings are optional)
      if (data.exercises && data.workouts) {
        // Ensure routines and settings exist for backwards compatibility
        if (!data.routines) data.routines = [];
        if (!data.settings) {
          data.settings = {
            preferredUnit: 'lb',
            theme: 'default'
          };
        }
        saveData(data);
        alert('Data imported successfully!');
        setImportText('');
        setShowTextImport(false);
        window.location.reload();
      } else {
        alert('Invalid backup data. Expected exercises and workouts.');
      }
    } catch (err) {
      alert('Error parsing JSON. Please check the format.');
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      const defaultData = {
        exercises: [
          {
            id: '1',
            name: 'Hip Thrusts',
            cues: ['Brace core', 'Tuck hips', 'Lock out at top']
          },
          {
            id: '2',
            name: 'RDLs',
            cues: ['Hinge at hips', 'Keep back flat', 'Feel stretch in hamstrings']
          }
        ],
        workouts: [],
        routines: [],
        settings: {
          preferredUnit: 'lb' as const,
          theme: 'default' as const
        }
      };
      saveData(defaultData);
      alert('All data cleared.');
      window.location.reload();
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Settings</h2>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Data Management</h3>
        <p className="muted" style={{ marginBottom: '20px' }}>
          Back up your workouts or import data from another device.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={handleExport} className="secondary">Export Backup (JSON)</button>
          
          <button onClick={() => fileInputRef.current?.click()} className="secondary">
            Import from File
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImport} 
            style={{ display: 'none' }} 
            accept=".json"
          />
          
          <button 
            onClick={() => setShowTextImport(!showTextImport)} 
            className="secondary"
          >
            {showTextImport ? 'Hide Text Import' : 'Import from Text'}
          </button>

          {showTextImport && (
            <div style={{ marginTop: '8px' }}>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste JSON data here..."
                style={{
                  width: '100%',
                  minHeight: '200px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: '#2c2c2e',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontFamily: 'monospace',
                  resize: 'vertical',
                  marginBottom: '8px'
                }}
              />
              <button onClick={handleImportText} style={{ width: '100%' }}>
                Import JSON
              </button>
            </div>
          )}
          
          <button 
            onClick={handleClearData} 
            className="secondary"
            style={{ 
              background: 'rgba(255, 69, 58, 0.15)', 
              color: '#ff453a',
              border: '1px solid rgba(255, 69, 58, 0.3)'
            }}
          >
            Clear All Data
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', fontWeight: '700' }}>Theme</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {(['default', 'sparkle', 'minimal', 'elegant', 'light', 'sunset', 'ocean', 'forest'] as ThemeMode[]).map((themeOption) => (
            <button
              key={themeOption}
              onClick={() => handleThemeChange(themeOption)}
              className={theme === themeOption ? '' : 'secondary'}
              style={{
                padding: '12px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: '600',
                textTransform: 'capitalize',
                border: theme === themeOption ? '2px solid var(--accent)' : '1px solid var(--border)',
                background: theme === themeOption ? 'var(--accent)' : 'var(--card-bg)',
                color: theme === themeOption ? 'white' : 'var(--text-primary)',
                boxShadow: theme === themeOption ? 'var(--button-shadow)' : 'none'
              }}
            >
              {themeOption}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px', opacity: 0.6 }}>
        <h3 style={{ marginBottom: '8px', fontSize: '1rem' }}>Units</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button disabled style={{ width: 'auto', flex: 1 }}>Pounds (lb)</button>
          <button className="secondary" disabled style={{ width: 'auto', flex: 1 }}>Kilograms (kg)</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

