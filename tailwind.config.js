/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neon: {
          50: '#f1fcf1',
          100: '#dcfcdc',
          200: '#b8f8b8',
          300: '#7ef27e',
          400: '#39e639',
          500: '#1bd41b',
          600: '#0fb00f',
          700: '#108a10',
          800: '#126c12',
          900: '#125912',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontSize: '1.125rem',
            lineHeight: '1.75',
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            a: {
              color: theme('colors.neon.600'),
              '&:hover': {
                color: theme('colors.neon.800'),
              },
            },
            code: {
              color: theme('colors.neon.700'),
              backgroundColor: theme('colors.neon.50'),
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
            },
          },
        },
        invert: {
          css: {
            a: {
              color: theme('colors.neon.400'),
              '&:hover': {
                color: theme('colors.neon.300'),
              },
            },
            code: {
              color: theme('colors.neon.300'),
              backgroundColor: theme('colors.slate.800'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};