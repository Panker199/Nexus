import React, { createContext, useContext, useState } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

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

function applyTheme(mode: ThemeMode) {
  const vars = mode === 'dark' ? darkVars : lightVars;
  const root = document.documentElement;
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem('nexus-theme');
    const initial: ThemeMode = (stored === 'dark' || stored === 'light') ? stored : 'light';
    applyTheme(initial);
    return initial;
  });

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    localStorage.setItem('nexus-theme', m);
    applyTheme(m);
  };

  const toggle = () => setMode(mode === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
