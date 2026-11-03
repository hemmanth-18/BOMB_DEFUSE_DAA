/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tactical: {
          950: '#070a10',
          900: '#0c1017',
          850: '#111722',
          800: '#161f2e',
          700: '#222f46',
          600: '#334464',
        },
        neon: {
          green: '#10b981',
          cyan: '#06b6d4',
          yellow: '#f59e0b',
          orange: '#f97316',
          red: '#ef4444',
          blue: '#3b82f6',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        display: ['"Orbitron"', '"Rajdhani"', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 14px rgba(16, 185, 129, 0.9))' },
        }
      }
    },
  },
  plugins: [],
};
