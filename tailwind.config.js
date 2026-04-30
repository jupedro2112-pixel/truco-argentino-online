/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0a0d0a',
          soft: '#11150f',
          card: '#1a1f17',
          line: '#262d22',
        },
        lime: {
          glow: '#c8f964',
          mute: '#9bcc4f',
        },
        accent: {
          pink: '#ff3d8a',
          gold: '#f3c44b',
        },
        suit: {
          oro: '#f3c44b',
          copa: '#e63946',
          espada: '#3a86ff',
          basto: '#2a9d8f',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(200, 249, 100, 0.25)',
      },
    },
  },
  plugins: [],
}
