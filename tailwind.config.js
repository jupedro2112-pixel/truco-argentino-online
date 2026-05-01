/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Layered surface scale — used for elevation
        ink: {
          950: '#06080a',   // deepest bg
          900: '#0a0e10',   // page bg
          850: '#0f1418',   // section bg
          800: '#141a1f',   // card bg
          700: '#1c242b',   // raised card
          600: '#252e36',   // hover
          500: '#374049',   // border strong
          400: '#5b6772',   // muted text
          300: '#8d96a0',   // secondary text
          200: '#c2c8cf',   // body text
          100: '#e9ecef',   // primary text
        },
        // Brand: emerald + lime accent (truco felt)
        brand: {
          50:  '#e9faf0',
          100: '#bef5d6',
          200: '#7feab1',
          300: '#3ad885',
          400: '#1bbe6d',
          500: '#0d9c5b',
          600: '#0a8049',
          700: '#0a6238',
          800: '#0a4d2d',
          900: '#0a3621',
        },
        // Premium gold accent
        gold: {
          50:  '#fff8e1',
          100: '#fde9a8',
          200: '#fbd76e',
          300: '#f3c44b',
          400: '#e2a91d',
          500: '#bd8a08',
          600: '#8a6306',
          700: '#5b4204',
        },
        // Punch / alert pink
        rose: {
          400: '#ff6b9d',
          500: '#ff3d8a',
          600: '#e01e6e',
          700: '#a8104e',
        },
        // Lime for success/highlight
        lime: {
          glow: '#c8f964',
          mute: '#9bcc4f',
        },
        // Card suit colors
        suit: {
          oro:    '#f3c44b',
          copa:   '#e63946',
          espada: '#3a86ff',
          basto:  '#1f7d4e',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #c8f964 0%, #1bbe6d 50%, #0a4d2d 100%)',
        'gold-gradient': 'linear-gradient(135deg, #fde9a8 0%, #f3c44b 50%, #8a6306 100%)',
        'pink-gradient': 'linear-gradient(135deg, #ff6b9d 0%, #ff3d8a 50%, #a8104e 100%)',
        'felt': 'radial-gradient(ellipse at 50% 30%, #1f6f44 0%, #0e3a25 45%, #051a10 100%)',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['10px', '14px'],
      },
      letterSpacing: {
        widest: '0.25em',
      },
      boxShadow: {
        'panel':   '0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px -8px rgba(0,0,0,0.6)',
        'raised':  '0 1px 0 rgba(255,255,255,0.06) inset, 0 12px 32px -10px rgba(0,0,0,0.7)',
        'inset-1': 'inset 0 1px 0 rgba(255,255,255,0.06)',
        'glow-brand': '0 0 28px rgba(200, 249, 100, 0.35)',
        'glow-gold':  '0 0 24px rgba(243, 196, 75, 0.35)',
        'glow-rose':  '0 0 24px rgba(255, 61, 138, 0.35)',
        'btn-primary': '0 1px 0 rgba(255,255,255,0.4) inset, 0 -2px 0 rgba(0,0,0,0.18) inset, 0 8px 18px -6px rgba(200, 249, 100, 0.55)',
        'btn-gold':    '0 1px 0 rgba(255,255,255,0.5) inset, 0 -2px 0 rgba(0,0,0,0.22) inset, 0 8px 18px -6px rgba(243, 196, 75, 0.55)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s cubic-bezier(.2,.8,.2,1) both',
      },
    },
  },
  plugins: [],
}
