/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        regenesys: {
          red: '#c0392b',
          'red-dark': '#922b21',
          'red-light': '#e74c3c',
          gold: '#fdb913',
          'gold-light': '#ffd700',
          green: '#008444',
          'green-dark': '#006837',
          navy: '#1a1f3d',
          'navy-light': '#252b4a',
          'navy-dark': '#12162e',
          purple: '#6366f1',
          'purple-dark': '#4f46e5',
          'purple-light': '#818cf8',
          off: '#f8f9fc',
          light: '#eef0f5',
          text: '#1c1c2e',
          muted: '#5a6070',
          border: '#e5e7eb',
        }
      },
      fontFamily: {
        head: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'premium': '0 4px 24px rgba(0,0,0,0.06)',
        'premium-lg': '0 8px 40px rgba(0,0,0,0.10)',
        'premium-xl': '0 16px 60px rgba(0,0,0,0.12)',
        'premium-2xl': '0 24px 80px rgba(0,0,0,0.16)',
      },
      animation: {
        'scroll-x': 'scroll-x 30s linear infinite',
      },
      keyframes: {
        'scroll-x': {
          'from': { transform: 'translateX(0)' },
          'to': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
