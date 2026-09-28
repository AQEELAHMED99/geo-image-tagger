/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#090e1a',
          surface: '#0d1527',
          card: '#111d36',
          cardHover: '#152445',
          border: '#1c2d52',
          borderLight: '#263b6b',
          muted: '#8899b5',
          text: '#f1f5f9',
        },
        brand: {
          blue: '#0284c7',
          sky: '#38bdf8',
          vibrant: '#2563eb',
          cyan: '#06b6d4',
          emerald: '#10b981',
          gold: '#f59e0b',
          purple: '#6366f1',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(56, 189, 248, 0.45)',
        'glow-blue': '0 0 25px -2px rgba(37, 99, 235, 0.5)',
        'dropzone': '0 10px 30px -5px rgba(2, 132, 199, 0.4)',
      }
    },
  },
  plugins: [],
}
