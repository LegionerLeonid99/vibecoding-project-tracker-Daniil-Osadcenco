/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#22D3EE',
          accent: '#60A5FA',
        },
        surface: {
          page: '#0B0F19',
          card: '#111827',
          border: '#374151',
        },
        content: {
          primary: '#F9FAFB',
          muted: '#9CA3AF',
        },
        type: {
          feature: '#34D399',
          bug: '#FB7185',
        },
        due: {
          safe: '#38BDF8',
          warning: '#FBBF24',
          overdue: '#F87171',
          neutral: '#94A3B8',
        },
        // Fallback convenience aliases
        feature: '#34D399',
        bug: '#FB7185',
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
