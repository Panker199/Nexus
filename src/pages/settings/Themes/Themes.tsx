import React, { useState } from 'react';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';
import { useTheme } from '../../../context/ThemeContext';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

const themeColors = [
  { name: 'blue', class: 'bg-blue-500' },
  { name: 'indigo', class: 'bg-indigo-500' },
  { name: 'green', class: 'bg-green-500' },
  { name: 'purple', class: 'bg-purple-500' },
  { name: 'orange', class: 'bg-orange-500' },
];

const densityMap: Record<string, string> = {
  compact: '0.85',
  comfortable: '1',
  spacious: '1.15',
};

const fontSizeMap: Record<string, string> = {
  small: '13px',
  normal: '15px',
  large: '17px',
};

function loadLocal(key: string, fallback: string): string {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}

export const Themes: React.FC = () => {
  const { mode, setMode } = useTheme();
  const [theme, setTheme] = useState(() => loadLocal('nexus-accent', 'blue'));
  const [density, setDensity] = useState(() => loadLocal('nexus-density', 'comfortable'));
  const [fontSize, setFontSize] = useState(() => loadLocal('nexus-font-size', 'normal'));

  const apply = () => {
    localStorage.setItem('nexus-accent', theme);
    localStorage.setItem('nexus-density', density);
    localStorage.setItem('nexus-font-size', fontSize);
    document.documentElement.style.setProperty('--density-spacing', densityMap[density]);
    document.documentElement.style.setProperty('--font-size-base', fontSizeMap[fontSize]);
  };

  React.useEffect(() => {
    const d = loadLocal('nexus-density', 'comfortable');
    const f = loadLocal('nexus-font-size', 'normal');
    document.documentElement.style.setProperty('--density-spacing', densityMap[d]);
    document.documentElement.style.setProperty('--font-size-base', fontSizeMap[f]);
  }, []);

  return (
    <Card>
      <CardHeader><div className="flex items-center gap-2"><GoogleIcon icon="palette" size={20} className="text-primary-600" /><h2 className="text-lg font-semibold text-gray-900">Appearance</h2></div></CardHeader>
      <CardBody className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2"><GoogleIcon icon="light_mode" size={16} className="inline mr-1.5 text-primary-600 align-text-bottom" />Theme Mode</label>
          <div className="flex gap-3">
            <button
              onClick={() => setMode('light')}
              className={`flex items-center gap-2 px-4 py-3 rounded border text-sm ${
                mode === 'light' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <GoogleIcon icon="light_mode" size={18} />Light
            </button>
            <button
              onClick={() => setMode('dark')}
              className={`flex items-center gap-2 px-4 py-3 rounded border text-sm ${
                mode === 'dark' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <GoogleIcon icon="dark_mode" size={18} />Dark
            </button>
            <button className="flex items-center gap-2 px-4 py-3 rounded border border-gray-200 text-gray-400 text-sm cursor-not-allowed" disabled>
              <GoogleIcon icon="monitor" size={18} />System
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2"><GoogleIcon icon="brush" size={16} className="inline mr-1.5 text-primary-600 align-text-bottom" />Accent Color</label>
          <div className="flex gap-3">
            {themeColors.map(c => (
              <button
                key={c.name}
                onClick={() => setTheme(c.name)}
                className={`w-8 h-8 rounded-full ${c.class} ${theme === c.name ? 'ring-2 ring-offset-2 ring-primary-500' : ''}`}
              />
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2"><GoogleIcon icon="density_medium" size={16} className="inline mr-1.5 text-primary-600 align-text-bottom" />Density</label>
          <div className="flex gap-2">
            {[
              { id: 'compact', label: 'Compact' },
              { id: 'comfortable', label: 'Comfortable' },
              { id: 'spacious', label: 'Spacious' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setDensity(opt.id)}
                className={`px-4 py-2 text-sm rounded border ${
                  density === opt.id ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2"><GoogleIcon icon="text_fields" size={16} className="inline mr-1.5 text-primary-600 align-text-bottom" />Font Size</label>
          <div className="flex gap-2">
            {[
              { id: 'small', label: 'Small' },
              { id: 'normal', label: 'Normal' },
              { id: 'large', label: 'Large' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setFontSize(opt.id)}
                className={`px-4 py-2 text-sm rounded border ${
                  fontSize === opt.id ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={apply}>Apply</Button>
        </div>
      </CardBody>
    </Card>
  );
};
