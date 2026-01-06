import { ThemeMode } from '../types';

export const applyTheme = (theme: ThemeMode) => {
  // Reset all properties first
  document.body.style.background = '';
  document.body.style.backgroundAttachment = '';
  
  switch (theme) {
    case 'default':
      document.body.style.background = '#000000';
      document.documentElement.style.setProperty('--accent', '#0a84ff');
      document.documentElement.style.setProperty('--accent-soft', 'rgba(10, 132, 255, 0.15)');
      document.documentElement.style.setProperty('--bg-color', '#000000');
      document.documentElement.style.setProperty('--card-bg', '#1c1c1e');
      document.documentElement.style.setProperty('--card-shadow', '0 2px 8px rgba(0, 0, 0, 0.3)');
      document.documentElement.style.setProperty('--border', '#38383a');
      document.documentElement.style.setProperty('--text-primary', '#ffffff');
      document.documentElement.style.setProperty('--text-secondary', '#8e8e93');
      document.documentElement.style.setProperty('--button-shadow', '0 2px 8px rgba(10, 132, 255, 0.25)');
      document.documentElement.style.setProperty('--button-shadow-active', 'inset 0 1px 4px rgba(0, 0, 0, 0.3)');
      document.documentElement.style.setProperty('--font-family', '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif');
      break;

    case 'sparkle':
      document.body.style.background = `
        radial-gradient(ellipse 80% 50% at top left, rgba(140, 33, 85, 0.9) 0%, transparent 60%),
        radial-gradient(ellipse 80% 50% at bottom right, rgba(160, 42, 106, 0.7) 0%, transparent 60%),
        radial-gradient(ellipse 60% 40% at center, rgba(180, 50, 120, 0.3) 0%, transparent 70%),
        linear-gradient(180deg, #5a1538 0%, #8C2155 25%, #8C2155 75%, #a52d6f 100%)
      `;
      document.body.style.backgroundAttachment = 'fixed';
      document.documentElement.style.setProperty('--accent', '#d946ef');
      document.documentElement.style.setProperty('--accent-soft', 'rgba(217, 70, 239, 0.15)');
      document.documentElement.style.setProperty('--bg-color', 'transparent');
      document.documentElement.style.setProperty('--card-bg', 'rgba(140, 33, 85, 0.35)');
      document.documentElement.style.setProperty('--card-shadow', '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)');
      document.documentElement.style.setProperty('--border', 'rgba(255, 255, 255, 0.12)');
      document.documentElement.style.setProperty('--text-primary', '#ffffff');
      document.documentElement.style.setProperty('--text-secondary', '#e8b8d0');
      document.documentElement.style.setProperty('--button-shadow', '0 2px 8px rgba(217, 70, 239, 0.3)');
      document.documentElement.style.setProperty('--button-shadow-active', 'inset 0 1px 4px rgba(0, 0, 0, 0.3)');
      document.documentElement.style.setProperty('--font-family', '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif');
      break;

    case 'minimal':
      document.body.style.background = '#f5f5f7';
      document.documentElement.style.setProperty('--accent', '#007aff');
      document.documentElement.style.setProperty('--accent-soft', 'rgba(0, 122, 255, 0.1)');
      document.documentElement.style.setProperty('--bg-color', '#f5f5f7');
      document.documentElement.style.setProperty('--card-bg', '#ffffff');
      document.documentElement.style.setProperty('--card-shadow', '0 1px 3px rgba(0, 0, 0, 0.1)');
      document.documentElement.style.setProperty('--border', '#e5e5e7');
      document.documentElement.style.setProperty('--text-primary', '#1d1d1f');
      document.documentElement.style.setProperty('--text-secondary', '#86868b');
      document.documentElement.style.setProperty('--button-shadow', '0 1px 3px rgba(0, 0, 0, 0.1)');
      document.documentElement.style.setProperty('--button-shadow-active', 'inset 0 1px 2px rgba(0, 0, 0, 0.1)');
      document.documentElement.style.setProperty('--font-family', '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif');
      break;

    case 'elegant':
      document.body.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';
      document.body.style.backgroundAttachment = 'fixed';
      document.documentElement.style.setProperty('--accent', '#9d4edd');
      document.documentElement.style.setProperty('--accent-soft', 'rgba(157, 78, 221, 0.15)');
      document.documentElement.style.setProperty('--bg-color', 'transparent');
      document.documentElement.style.setProperty('--card-bg', 'rgba(26, 26, 46, 0.6)');
      document.documentElement.style.setProperty('--card-shadow', '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)');
      document.documentElement.style.setProperty('--border', 'rgba(255, 255, 255, 0.1)');
      document.documentElement.style.setProperty('--text-primary', '#ffffff');
      document.documentElement.style.setProperty('--text-secondary', '#a0a0b8');
      document.documentElement.style.setProperty('--button-shadow', '0 2px 8px rgba(157, 78, 221, 0.3)');
      document.documentElement.style.setProperty('--button-shadow-active', 'inset 0 1px 4px rgba(0, 0, 0, 0.3)');
      document.documentElement.style.setProperty('--font-family', '"SF Pro Display", -apple-system, sans-serif');
      break;

    case 'light':
      document.body.style.background = 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)';
      document.body.style.backgroundAttachment = 'fixed';
      document.documentElement.style.setProperty('--accent', '#6366f1');
      document.documentElement.style.setProperty('--accent-soft', 'rgba(99, 102, 241, 0.1)');
      document.documentElement.style.setProperty('--bg-color', 'transparent');
      document.documentElement.style.setProperty('--card-bg', '#ffffff');
      document.documentElement.style.setProperty('--card-shadow', '0 2px 8px rgba(0, 0, 0, 0.08)');
      document.documentElement.style.setProperty('--border', '#e5e7eb');
      document.documentElement.style.setProperty('--text-primary', '#111827');
      document.documentElement.style.setProperty('--text-secondary', '#6b7280');
      document.documentElement.style.setProperty('--button-shadow', '0 2px 4px rgba(99, 102, 241, 0.2)');
      document.documentElement.style.setProperty('--button-shadow-active', 'inset 0 1px 2px rgba(0, 0, 0, 0.1)');
      document.documentElement.style.setProperty('--font-family', 'Inter, -apple-system, sans-serif');
      break;

    case 'sunset':
      document.body.style.background = `
        radial-gradient(ellipse at top, rgba(255, 107, 107, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at bottom, rgba(255, 159, 64, 0.3) 0%, transparent 50%),
        linear-gradient(180deg, #ff6b6b 0%, #ff8e53 50%, #ffa726 100%)
      `;
      document.body.style.backgroundAttachment = 'fixed';
      document.documentElement.style.setProperty('--accent', '#ff6b6b');
      document.documentElement.style.setProperty('--accent-soft', 'rgba(255, 107, 107, 0.15)');
      document.documentElement.style.setProperty('--bg-color', 'transparent');
      document.documentElement.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.15)');
      document.documentElement.style.setProperty('--card-shadow', '0 4px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)');
      document.documentElement.style.setProperty('--border', 'rgba(255, 255, 255, 0.2)');
      document.documentElement.style.setProperty('--text-primary', '#ffffff');
      document.documentElement.style.setProperty('--text-secondary', '#ffe0cc');
      document.documentElement.style.setProperty('--button-shadow', '0 2px 8px rgba(255, 107, 107, 0.4)');
      document.documentElement.style.setProperty('--button-shadow-active', 'inset 0 1px 4px rgba(0, 0, 0, 0.2)');
      document.documentElement.style.setProperty('--font-family', '-apple-system, BlinkMacSystemFont, sans-serif');
      break;

    case 'ocean':
      document.body.style.background = `
        radial-gradient(ellipse at top left, rgba(14, 165, 233, 0.4) 0%, transparent 50%),
        radial-gradient(ellipse at bottom right, rgba(59, 130, 246, 0.4) 0%, transparent 50%),
        linear-gradient(180deg, #0ea5e9 0%, #3b82f6 50%, #6366f1 100%)
      `;
      document.body.style.backgroundAttachment = 'fixed';
      document.documentElement.style.setProperty('--accent', '#0284c7'); // Darker blue for better contrast
      document.documentElement.style.setProperty('--accent-soft', 'rgba(2, 132, 199, 0.15)');
      document.documentElement.style.setProperty('--bg-color', 'transparent');
      document.documentElement.style.setProperty('--card-bg', 'rgba(14, 165, 233, 0.2)');
      document.documentElement.style.setProperty('--card-shadow', '0 4px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)');
      document.documentElement.style.setProperty('--border', 'rgba(255, 255, 255, 0.15)');
      document.documentElement.style.setProperty('--text-primary', '#ffffff');
      document.documentElement.style.setProperty('--text-secondary', '#bae6fd');
      document.documentElement.style.setProperty('--button-shadow', '0 2px 8px rgba(2, 132, 199, 0.4)');
      document.documentElement.style.setProperty('--button-shadow-active', 'inset 0 1px 4px rgba(0, 0, 0, 0.3)');
      document.documentElement.style.setProperty('--font-family', '-apple-system, BlinkMacSystemFont, sans-serif');
      break;

    case 'forest':
      document.body.style.background = `
        radial-gradient(ellipse at top, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at bottom, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
        linear-gradient(180deg, #065f46 0%, #047857 50%, #059669 100%)
      `;
      document.body.style.backgroundAttachment = 'fixed';
      document.documentElement.style.setProperty('--accent', '#047857'); // Darker green for better contrast
      document.documentElement.style.setProperty('--accent-soft', 'rgba(4, 120, 87, 0.15)');
      document.documentElement.style.setProperty('--bg-color', 'transparent');
      document.documentElement.style.setProperty('--card-bg', 'rgba(6, 95, 70, 0.4)');
      document.documentElement.style.setProperty('--card-shadow', '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)');
      document.documentElement.style.setProperty('--border', 'rgba(255, 255, 255, 0.1)');
      document.documentElement.style.setProperty('--text-primary', '#ffffff');
      document.documentElement.style.setProperty('--text-secondary', '#a7f3d0');
      document.documentElement.style.setProperty('--button-shadow', '0 2px 8px rgba(4, 120, 87, 0.4)');
      document.documentElement.style.setProperty('--button-shadow-active', 'inset 0 1px 4px rgba(0, 0, 0, 0.3)');
      document.documentElement.style.setProperty('--font-family', '-apple-system, BlinkMacSystemFont, sans-serif');
      break;
  }
};

