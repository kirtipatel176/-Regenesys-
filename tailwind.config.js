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
          navy: '#1a237e',
          'navy-light': '#283593',
          'navy-dark': '#121858',
          off: '#f8f7f4',
          light: '#eef0f5',
          text: '#1c1c2e',
          muted: '#5a6070',
          border: '#dde2ec',
        }
      },
      fontFamily: {
        head: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        premium: '0 4px 24px rgba(0,0,0,0.08)',
        'premium-lg': '0 12px 48px rgba(0,0,0,0.14)',
      },
      animation: {
        'scroll-x': 'scroll-x 18s linear infinite',
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
