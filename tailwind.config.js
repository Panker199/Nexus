/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // === COLOR SYSTEM ===
      // Primary: Indigo — brand, CTAs, active states
      // Secondary: Emerald — growth, connections, positive actions
      // Accent: Orange — highlights, funding, warnings
      colors: {
        primary: {
          50: '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE',
          300: '#A5B4FC', 400: '#818CF8', 500: '#6366F1',
          600: '#4F46E5', 700: '#4338CA', 800: '#3730A3',
          900: '#312E81', 950: '#1E1B4B',
        },
        secondary: {
          50: '#F0FDF4', 100: '#DCFCE7', 200: '#BBF7D0',
          300: '#86EFAC', 400: '#4ADE80', 500: '#22C55E',
          600: '#16A34A', 700: '#15803D', 800: '#166534',
          900: '#14532D', 950: '#052E16',
        },
        accent: {
          50: '#FFF7ED', 100: '#FFEDD5', 200: '#FED7AA',
          300: '#FDBA74', 400: '#FB923C', 500: '#F97316',
          600: '#EA580C', 700: '#C2410C', 800: '#9A3412',
          900: '#7C2D12', 950: '#431407',
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

      // === TYPOGRAPHY ===
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],     // 10px
        xs:    ['0.75rem',  { lineHeight: '1rem' }],          // 12px
        sm:    ['0.8125rem', { lineHeight: '1.25rem' }],      // 13px
        base:  ['0.875rem',  { lineHeight: '1.5rem' }],       // 14px
        lg:    ['1rem',      { lineHeight: '1.5rem' }],        // 16px
        xl:    ['1.125rem',  { lineHeight: '1.75rem' }],      // 18px
        '2xl': ['1.25rem',   { lineHeight: '1.75rem' }],       // 20px
        '3xl': ['1.5rem',    { lineHeight: '2rem' }],          // 24px
        '4xl': ['1.875rem',  { lineHeight: '2.25rem' }],       // 30px
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },

      // === SPACING ===
      spacing: {
        '4.5': '1.125rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },

      // === BORDER RADIUS ===
      borderRadius: {
        '2xs': '0.25rem',    // 4px
        xs: '0.375rem',      // 6px
        sm: '0.5rem',        // 8px
        DEFAULT: '0.625rem', // 10px
        lg: '0.75rem',       // 12px
        xl: '1rem',          // 16px
        '2xl': '1.25rem',    // 20px
      },

      // === SHADOWS ===
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 4px 12px -4px rgba(0, 0, 0, 0.05)',
        'soft-xl': '0 20px 60px -15px rgba(0, 0, 0, 0.15), 0 8px 20px -6px rgba(0, 0, 0, 0.05)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.15)',
        'glow-lg': '0 0 40px rgba(99, 102, 241, 0.2)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
        'dropdown': '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)',
        'modal': '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.08)',
      },

      // === ANIMATIONS ===
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-in-up': 'fadeInUp 0.35s ease-out',
        'fade-in-down': 'fadeInDown 0.25s ease-out',
        'slide-in': 'slideIn 0.25s ease-out',
        'slide-in-right': 'slideInRight 0.25s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'bounce-in': 'bounceIn 0.35s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-8px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(8px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
