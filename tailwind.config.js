/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE',
          300: '#93C5FD', 400: '#60A5FA', 500: '#3B82F6',
          600: '#2563EB', 700: '#1D4ED8', 800: '#1E40AF',
          900: '#1E3A8A', 950: '#172554',
        },
        secondary: {
          50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0',
          300: '#CBD5E1', 400: '#94A3B8', 500: '#64748B',
          600: '#475569', 700: '#334155', 800: '#1E293B',
          900: '#0F172A', 950: '#020617',
        },
        accent: {
          50: '#FFFBEB', 100: '#FEF3C7', 200: '#FDE68A',
          300: '#FCD34D', 400: '#FBBF24', 500: '#F59E0B',
          600: '#D97706', 700: '#B45309', 800: '#92400E',
          900: '#78350F', 950: '#451A03',
        },
        success: {
          50: '#F0FDF4', 100: '#DCFCE7', 200: '#BBF7D0',
          300: '#86EFAC', 400: '#4ADE80', 500: '#22C55E',
          600: '#16A34A', 700: '#15803D', 800: '#166534',
          900: '#14532D',
        },
        warning: {
          50: '#FFFBEB', 100: '#FEF3C7', 200: '#FDE68A',
          300: '#FCD34D', 400: '#FACC15', 500: '#F59E0B',
          600: '#D97706', 700: '#B45309', 800: '#92400E',
          900: '#78350F',
        },
        error: {
          50: '#FEF2F2', 100: '#FEE2E2', 200: '#FECACA',
          300: '#FCA5A5', 400: '#F87171', 500: '#EF4444',
          600: '#DC2626', 700: '#B91C1C', 800: '#991B1B',
          900: '#7F1D1D',
        },
        gray: {
          50: '#F9FAFB', 100: '#F3F4F6', 200: '#E5E7EB',
          300: '#D1D5DB', 400: '#9CA3AF', 500: '#6B7280',
          600: '#4B5563', 700: '#374151', 800: '#1F2937',
          900: '#111827', 950: '#030712',
        },
      },

      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      boxShadow: {
        card: '0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        dropdown: '0 4px 12px rgba(0, 0, 0, 0.12)',
        modal: '0 8px 24px rgba(0, 0, 0, 0.16)',
      },

      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
