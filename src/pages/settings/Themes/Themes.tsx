import React from 'react';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';
import { useTheme } from '../../../context/ThemeContext';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface Accent {
  name: string;
  class: string;
  vars: Record<string, string>;
}

const accents: Accent[] = [
  {
    name: 'blue',
    class: 'bg-blue-500',
    vars: {
      '--color-primary-50': '#EFF6FF', '--color-primary-100': '#DBEAFE', '--color-primary-200': '#BFDBFE',
      '--color-primary-300': '#93C5FD', '--color-primary-400': '#60A5FA', '--color-primary-500': '#3B82F6',
      '--color-primary-600': '#2563EB', '--color-primary-700': '#1D4ED8', '--color-primary-800': '#1E40AF',
      '--color-primary-900': '#1E3A8A', '--color-primary-950': '#172554',
    },
  },
  {
    name: 'indigo',
    class: 'bg-indigo-500',
    vars: {
      '--color-primary-50': '#EEF2FF', '--color-primary-100': '#E0E7FF', '--color-primary-200': '#C7D2FE',
      '--color-primary-300': '#A5B4FC', '--color-primary-400': '#818CF8', '--color-primary-500': '#6366F1',
      '--color-primary-600': '#4F46E5', '--color-primary-700': '#4338CA', '--color-primary-800': '#3730A3',
      '--color-primary-900': '#312E81', '--color-primary-950': '#1E1B4B',
    },
  },
  {
    name: 'green',
    class: 'bg-green-500',
    vars: {
      '--color-primary-50': '#F0FDF4', '--color-primary-100': '#DCFCE7', '--color-primary-200': '#BBF7D0',
      '--color-primary-300': '#86EFAC', '--color-primary-400': '#4ADE80', '--color-primary-500': '#22C55E',
      '--color-primary-600': '#16A34A', '--color-primary-700': '#15803D', '--color-primary-800': '#166534',
      '--color-primary-900': '#14532D', '--color-primary-950': '#052E16',
    },
  },
  {
    name: 'purple',
    class: 'bg-purple-500',
    vars: {
      '--color-primary-50': '#FAF5FF', '--color-primary-100': '#F3E8FF', '--color-primary-200': '#E9D5FF',
      '--color-primary-300': '#D8B4FE', '--color-primary-400': '#C084FC', '--color-primary-500': '#A855F7',
      '--color-primary-600': '#9333EA', '--color-primary-700': '#7E22CE', '--color-primary-800': '#6B21A8',
      '--color-primary-900': '#581C87', '--color-primary-950': '#3B0764',
    },
  },
  {
    name: 'orange',
    class: 'bg-orange-500',
    vars: {
      '--color-primary-50': '#FFF7ED', '--color-primary-100': '#FFEDD5', '--color-primary-200': '#FED7AA',
      '--color-primary-300': '#FDBA74', '--color-primary-400': '#FB923C', '--color-primary-500': '#F97316',
      '--color-primary-600': '#EA580C', '--color-primary-700': '#C2410C', '--color-primary-800': '#9A3412',
      '--color-primary-900': '#7C2D12', '--color-primary-950': '#431407',
    },
  },
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

function saveLocal(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* noop */ }
}

function applyThemeVars(accentName: string) {
  const a = accents.find(x => x.name === accentName) || accents[0];
  for (const [key, value] of Object.entries(a.vars)) {
    document.documentElement.style.setProperty(key, value);
  }
}

function applyDensity(d: string) {
  document.documentElement.style.setProperty('--density-spacing', densityMap[d] ?? '1');
}

function applyFontSize(f: string) {
  document.documentElement.style.setProperty('--font-size-base', fontSizeMap[f] ?? '15px');
}

export const Themes: React.FC = () => {
  const { mode, setMode } = useTheme();
  const [accent, setAccent] = React.useState(() => loadLocal('nexus-accent', 'blue'));
  const [density, setDensity] = React.useState(() => loadLocal('nexus-density', 'comfortable'));
  const [fontSize, setFontSize] = React.useState(() => loadLocal('nexus-font-size', 'normal'));

  React.useEffect(() => {
    applyThemeVars(loadLocal('nexus-accent', 'blue'));
    applyDensity(loadLocal('nexus-density', 'comfortable'));
    applyFontSize(loadLocal('nexus-font-size', 'normal'));
  }, []);

  const handleAccent = (name: string) => {
    setAccent(name);
    saveLocal('nexus-accent', name);
    applyThemeVars(name);
  };

  const handleDensity = (d: string) => {
    setDensity(d);
    saveLocal('nexus-density', d);
    applyDensity(d);
  };

  const handleFontSize = (f: string) => {
    setFontSize(f);
    saveLocal('nexus-font-size', f);
    applyFontSize(f);
  };

  const resetAll = () => {
    handleAccent('blue');
    handleDensity('comfortable');
    handleFontSize('normal');
    setMode('light');
  };

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
            {accents.map(c => (
              <button
                key={c.name}
                onClick={() => handleAccent(c.name)}
                className={`w-8 h-8 rounded-full ${c.class} ${accent === c.name ? 'ring-2 ring-offset-2 ring-primary-500' : ''}`}
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
                onClick={() => handleDensity(opt.id)}
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
                onClick={() => handleFontSize(opt.id)}
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
          <Button variant="ghost" onClick={resetAll}>Reset to Defaults</Button>
        </div>
      </CardBody>
    </Card>
  );
};
