import React, { createContext, useContext, useState, useCallback } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeConfig {
  mode: ThemeMode;
  accent: string;
  density: string;
  fontSize: string;
}

interface ThemeContextType extends ThemeConfig {
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: string) => void;
  setDensity: (density: string) => void;
  setFontSize: (fontSize: string) => void;
  resetAll: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/* ─── Accent palettes ────────────────────────────── */

const accents: Record<string, Record<string, string>> = {
  blue: {
    '--color-primary-50': '#EFF6FF', '--color-primary-100': '#DBEAFE', '--color-primary-200': '#BFDBFE',
    '--color-primary-300': '#93C5FD', '--color-primary-400': '#60A5FA', '--color-primary-500': '#3B82F6',
    '--color-primary-600': '#2563EB', '--color-primary-700': '#1D4ED8', '--color-primary-800': '#1E40AF',
    '--color-primary-900': '#1E3A8A', '--color-primary-950': '#172554',
  },
  indigo: {
    '--color-primary-50': '#EEF2FF', '--color-primary-100': '#E0E7FF', '--color-primary-200': '#C7D2FE',
    '--color-primary-300': '#A5B4FC', '--color-primary-400': '#818CF8', '--color-primary-500': '#6366F1',
    '--color-primary-600': '#4F46E5', '--color-primary-700': '#4338CA', '--color-primary-800': '#3730A3',
    '--color-primary-900': '#312E81', '--color-primary-950': '#1E1B4B',
  },
  green: {
    '--color-primary-50': '#F0FDF4', '--color-primary-100': '#DCFCE7', '--color-primary-200': '#BBF7D0',
    '--color-primary-300': '#86EFAC', '--color-primary-400': '#4ADE80', '--color-primary-500': '#22C55E',
    '--color-primary-600': '#16A34A', '--color-primary-700': '#15803D', '--color-primary-800': '#166534',
    '--color-primary-900': '#14532D', '--color-primary-950': '#052E16',
  },
  purple: {
    '--color-primary-50': '#FAF5FF', '--color-primary-100': '#F3E8FF', '--color-primary-200': '#E9D5FF',
    '--color-primary-300': '#D8B4FE', '--color-primary-400': '#C084FC', '--color-primary-500': '#A855F7',
    '--color-primary-600': '#9333EA', '--color-primary-700': '#7E22CE', '--color-primary-800': '#6B21A8',
    '--color-primary-900': '#581C87', '--color-primary-950': '#3B0764',
  },
  orange: {
    '--color-primary-50': '#FFF7ED', '--color-primary-100': '#FFEDD5', '--color-primary-200': '#FED7AA',
    '--color-primary-300': '#FDBA74', '--color-primary-400': '#FB923C', '--color-primary-500': '#F97316',
    '--color-primary-600': '#EA580C', '--color-primary-700': '#C2410C', '--color-primary-800': '#9A3412',
    '--color-primary-900': '#7C2D12', '--color-primary-950': '#431407',
  },
};

/* ─── Light / Dark variable sets ─────────────────── */

const lightVars: Record<string, string> = {
  '--color-white': '#FFFFFF',
  '--color-black': '#000000',
  '--color-gray-50': '#F9FAFB', '--color-gray-100': '#F3F4F6', '--color-gray-200': '#E5E7EB',
  '--color-gray-300': '#D1D5DB', '--color-gray-400': '#9CA3AF', '--color-gray-500': '#6B7280',
  '--color-gray-600': '#4B5563', '--color-gray-700': '#374151', '--color-gray-800': '#1F2937',
  '--color-gray-900': '#111827', '--color-gray-950': '#030712',
  '--color-secondary-50': '#F8FAFC', '--color-secondary-100': '#F1F5F9', '--color-secondary-200': '#E2E8F0',
  '--color-secondary-300': '#CBD5E1', '--color-secondary-400': '#94A3B8', '--color-secondary-500': '#64748B',
  '--color-secondary-600': '#475569', '--color-secondary-700': '#334155', '--color-secondary-800': '#1E293B',
  '--color-secondary-900': '#0F172A', '--color-secondary-950': '#020617',
  '--color-accent-50': '#FFFBEB', '--color-accent-100': '#FEF3C7', '--color-accent-200': '#FDE68A',
  '--color-accent-300': '#FCD34D', '--color-accent-400': '#FBBF24', '--color-accent-500': '#F59E0B',
  '--color-accent-600': '#D97706', '--color-accent-700': '#B45309', '--color-accent-800': '#92400E',
  '--color-accent-900': '#78350F', '--color-accent-950': '#451A03',
  '--color-success-50': '#F0FDF4', '--color-success-100': '#DCFCE7', '--color-success-200': '#BBF7D0',
  '--color-success-300': '#86EFAC', '--color-success-400': '#4ADE80', '--color-success-500': '#22C55E',
  '--color-success-600': '#16A34A', '--color-success-700': '#15803D', '--color-success-800': '#166534',
  '--color-success-900': '#14532D',
  '--color-warning-50': '#FFFBEB', '--color-warning-100': '#FEF3C7', '--color-warning-200': '#FDE68A',
  '--color-warning-300': '#FCD34D', '--color-warning-400': '#FACC15', '--color-warning-500': '#F59E0B',
  '--color-warning-600': '#D97706', '--color-warning-700': '#B45309', '--color-warning-800': '#92400E',
  '--color-warning-900': '#78350F',
  '--color-error-50': '#FEF2F2', '--color-error-100': '#FEE2E2', '--color-error-200': '#FECACA',
  '--color-error-300': '#FCA5A5', '--color-error-400': '#F87171', '--color-error-500': '#EF4444',
  '--color-error-600': '#DC2626', '--color-error-700': '#B91C1C', '--color-error-800': '#991B1B',
  '--color-error-900': '#7F1D1D',
};

const darkVars: Record<string, string> = {
  '--color-white': '#1F2937',
  '--color-black': '#F9FAFB',
  '--color-gray-50': '#030712', '--color-gray-100': '#111827', '--color-gray-200': '#1F2937',
  '--color-gray-300': '#374151', '--color-gray-400': '#4B5563', '--color-gray-500': '#6B7280',
  '--color-gray-600': '#9CA3AF', '--color-gray-700': '#D1D5DB', '--color-gray-800': '#E5E7EB',
  '--color-gray-900': '#F3F4F6', '--color-gray-950': '#F9FAFB',
  '--color-secondary-50': '#020617', '--color-secondary-100': '#0F172A', '--color-secondary-200': '#1E293B',
  '--color-secondary-300': '#334155', '--color-secondary-400': '#475569', '--color-secondary-500': '#64748B',
  '--color-secondary-600': '#94A3B8', '--color-secondary-700': '#CBD5E1', '--color-secondary-800': '#E2E8F0',
  '--color-secondary-900': '#F1F5F9', '--color-secondary-950': '#F8FAFC',
  '--color-accent-50': '#451A03', '--color-accent-100': '#78350F', '--color-accent-200': '#92400E',
  '--color-accent-300': '#B45309', '--color-accent-400': '#D97706', '--color-accent-500': '#F59E0B',
  '--color-accent-600': '#FBBF24', '--color-accent-700': '#FCD34D', '--color-accent-800': '#FDE68A',
  '--color-accent-900': '#FEF3C7', '--color-accent-950': '#FFFBEB',
  '--color-success-50': '#14532D', '--color-success-100': '#166534', '--color-success-200': '#15803D',
  '--color-success-300': '#16A34A', '--color-success-400': '#22C55E', '--color-success-500': '#4ADE80',
  '--color-success-600': '#86EFAC', '--color-success-700': '#BBF7D0', '--color-success-800': '#DCFCE7',
  '--color-success-900': '#F0FDF4',
  '--color-warning-50': '#78350F', '--color-warning-100': '#92400E', '--color-warning-200': '#B45309',
  '--color-warning-300': '#D97706', '--color-warning-400': '#F59E0B', '--color-warning-500': '#FBBF24',
  '--color-warning-600': '#FCD34D', '--color-warning-700': '#FDE68A', '--color-warning-800': '#FEF3C7',
  '--color-warning-900': '#FFFBEB',
  '--color-error-50': '#7F1D1D', '--color-error-100': '#991B1B', '--color-error-200': '#B91C1C',
  '--color-error-300': '#DC2626', '--color-error-400': '#EF4444', '--color-error-500': '#F87171',
  '--color-error-600': '#FCA5A5', '--color-error-700': '#FECACA', '--color-error-800': '#FEE2E2',
  '--color-error-900': '#FEF2F2',
};

/* ─── Density / Font-size maps ───────────────────── */

const densityMap: Record<string, string> = { compact: '0.85', comfortable: '1', spacious: '1.15' };
const fontSizeMap: Record<string, string> = { small: '13px', normal: '15px', large: '17px' };

/* ─── Apply helpers ──────────────────────────────── */

function getEffectiveMode(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return mode;
}

function setVars(vars: Record<string, string>) {
  const root = document.documentElement;
  for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);
}

function applyConfig(config: ThemeConfig) {
  setVars(getEffectiveMode(config.mode) === 'dark' ? darkVars : lightVars);
  setVars(accents[config.accent] ?? accents.blue);
  const el = document.documentElement;
  el.style.setProperty('--density-spacing', densityMap[config.density] ?? '1');
  el.style.setProperty('--font-size-base', fontSizeMap[config.fontSize] ?? '15px');
}

function loadThemeConfig(): ThemeConfig {
  const get = (k: string, fb: string) => { try { return localStorage.getItem(k) ?? fb; } catch { return fb; } };
  const stored = get('nexus-theme', 'light');
  const mode: ThemeMode = stored === 'dark' || stored === 'system' ? stored : 'light';
  return {
    mode,
    accent: get('nexus-accent', 'blue'),
    density: get('nexus-density', 'comfortable'),
    fontSize: get('nexus-font-size', 'normal'),
  };
}

function saveConfig(config: ThemeConfig) {
  try {
    localStorage.setItem('nexus-theme', config.mode);
    localStorage.setItem('nexus-accent', config.accent);
    localStorage.setItem('nexus-density', config.density);
    localStorage.setItem('nexus-font-size', config.fontSize);
  } catch { /* noop */ }
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfigState] = useState<ThemeConfig>(() => {
    const c = loadThemeConfig();
    applyConfig(c);
    return c;
  });

  const configRef = React.useRef(config);
  configRef.current = config;

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (configRef.current.mode === 'system') {
        applyConfig(configRef.current);
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [config.mode]);

  const setMode = useCallback((mode: ThemeMode) => {
    setConfigState(prev => {
      const next = { ...prev, mode };
      applyConfig(next);
      saveConfig(next);
      return next;
    });
  }, []);

  const setAccent = useCallback((accent: string) => {
    setConfigState(prev => {
      const next = { ...prev, accent };
      applyConfig(next);
      saveConfig(next);
      return next;
    });
  }, []);

  const setDensity = useCallback((density: string) => {
    setConfigState(prev => {
      const next = { ...prev, density };
      applyConfig(next);
      saveConfig(next);
      return next;
    });
  }, []);

  const setFontSize = useCallback((fontSize: string) => {
    setConfigState(prev => {
      const next = { ...prev, fontSize };
      applyConfig(next);
      saveConfig(next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    const defaults: ThemeConfig = { mode: 'light', accent: 'blue', density: 'comfortable', fontSize: 'normal' };
    setConfigState(defaults);
    applyConfig(defaults);
    saveConfig(defaults);
  }, []);

  return (
    <ThemeContext.Provider value={{ ...config, setMode, setAccent, setDensity, setFontSize, resetAll }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
