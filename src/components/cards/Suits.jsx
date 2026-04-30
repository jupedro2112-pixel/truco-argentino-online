// Original SVG art for the four Spanish suits.
// Designed as inline components for crisp scaling and color theming.

export function OroSuit({ size = 64, color = '#d4a015' }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <defs>
        <radialGradient id="oroGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fff4c2" />
          <stop offset="55%" stopColor={color} />
          <stop offset="100%" stopColor="#7a5a08" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="26" fill="url(#oroGrad)" stroke="#5b4204" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="20" fill="none" stroke="#5b4204" strokeWidth="1" opacity="0.6" />
      {/* 8-point star */}
      <g fill="#5b4204" opacity="0.85">
        <path d="M32 14 L34 30 L32 32 L30 30 Z" />
        <path d="M32 50 L34 34 L32 32 L30 34 Z" />
        <path d="M14 32 L30 30 L32 32 L30 34 Z" />
        <path d="M50 32 L34 30 L32 32 L34 34 Z" />
        <path d="M19 19 L30 30 L32 32 L30 30 Z" transform="rotate(45 32 32) translate(0 0)" opacity="0.7"/>
      </g>
      {/* center bead */}
      <circle cx="32" cy="32" r="3" fill="#fff8d8" stroke="#5b4204" strokeWidth="0.7" />
    </svg>
  )
}

export function CopaSuit({ size = 64, color = '#c2253a' }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <defs>
        <linearGradient id="copaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff6373" />
          <stop offset="60%" stopColor={color} />
          <stop offset="100%" stopColor="#7a0a18" />
        </linearGradient>
      </defs>
      {/* lid */}
      <path d="M22 8 Q32 4 42 8 L40 12 Q32 9 24 12 Z" fill="#e2c14a" stroke="#5b4204" strokeWidth="1"/>
      <circle cx="32" cy="6" r="2.5" fill="#e2c14a" stroke="#5b4204" strokeWidth="0.8"/>
      {/* bowl */}
      <path d="M14 14 Q32 26 50 14 L46 30 Q32 40 18 30 Z" fill="url(#copaGrad)" stroke="#5b1218" strokeWidth="1.2"/>
      {/* stem */}
      <path d="M28 36 L36 36 L34 48 L30 48 Z" fill="#a3801a" stroke="#5b4204" strokeWidth="0.8"/>
      {/* base */}
      <ellipse cx="32" cy="52" rx="14" ry="3.5" fill="#e2c14a" stroke="#5b4204" strokeWidth="1"/>
      <ellipse cx="32" cy="50.5" rx="10" ry="2" fill="#7a5a08" opacity="0.6"/>
    </svg>
  )
}

export function EspadaSuit({ size = 64, color = '#1f5fc4' }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <defs>
        <linearGradient id="bladeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eaf2ff" />
          <stop offset="50%" stopColor="#a8c4ec" />
          <stop offset="100%" stopColor="#5d7da6" />
        </linearGradient>
      </defs>
      {/* point */}
      <path d="M32 4 L29 12 L35 12 Z" fill="url(#bladeGrad)" stroke="#1c2c44" strokeWidth="0.8"/>
      {/* blade */}
      <rect x="29" y="12" width="6" height="30" fill="url(#bladeGrad)" stroke="#1c2c44" strokeWidth="0.8"/>
      <line x1="32" y1="13" x2="32" y2="41" stroke="#1c2c44" strokeWidth="0.6" opacity="0.6"/>
      {/* guard */}
      <rect x="14" y="40" width="36" height="4" rx="1.5" fill={color} stroke="#0d2147" strokeWidth="1"/>
      <circle cx="14" cy="42" r="3" fill={color} stroke="#0d2147" strokeWidth="1"/>
      <circle cx="50" cy="42" r="3" fill={color} stroke="#0d2147" strokeWidth="1"/>
      {/* grip */}
      <rect x="29" y="44" width="6" height="11" fill="#5a3a18" stroke="#291808" strokeWidth="0.6"/>
      <line x1="29" y1="47" x2="35" y2="47" stroke="#291808" strokeWidth="0.5"/>
      <line x1="29" y1="50" x2="35" y2="50" stroke="#291808" strokeWidth="0.5"/>
      <line x1="29" y1="53" x2="35" y2="53" stroke="#291808" strokeWidth="0.5"/>
      {/* pommel */}
      <circle cx="32" cy="58" r="3.5" fill={color} stroke="#0d2147" strokeWidth="1"/>
    </svg>
  )
}

export function BastoSuit({ size = 64, color = '#1f7d4e' }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <defs>
        <linearGradient id="bastoGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3a2210" />
          <stop offset="50%" stopColor="#7a4a1c" />
          <stop offset="100%" stopColor="#3a2210" />
        </linearGradient>
      </defs>
      {/* head (knobby top) */}
      <ellipse cx="32" cy="14" rx="11" ry="9" fill="url(#bastoGrad)" stroke="#1f1108" strokeWidth="1"/>
      <ellipse cx="32" cy="14" rx="7" ry="5" fill={color} opacity="0.4"/>
      {/* knot bumps */}
      <circle cx="25" cy="11" r="2" fill="#3a2210" opacity="0.7"/>
      <circle cx="38" cy="13" r="1.6" fill="#3a2210" opacity="0.7"/>
      <circle cx="32" cy="18" r="1.4" fill="#3a2210" opacity="0.7"/>
      {/* shaft */}
      <path d="M27 22 L29 56 L35 56 L37 22 Z" fill="url(#bastoGrad)" stroke="#1f1108" strokeWidth="1"/>
      {/* leaves at top */}
      <path d="M22 14 Q14 10 12 4 Q20 8 22 14 Z" fill={color} stroke="#0d3a22" strokeWidth="1"/>
      <path d="M42 14 Q50 10 52 4 Q44 8 42 14 Z" fill={color} stroke="#0d3a22" strokeWidth="1"/>
    </svg>
  )
}

export const SUIT_COMPONENT = {
  oro: OroSuit,
  copa: CopaSuit,
  espada: EspadaSuit,
  basto: BastoSuit,
}

export const SUIT_TINT = {
  oro:    { fg: '#7a5a08', accent: '#d4a015', bg: '#fff8e1' },
  copa:   { fg: '#7a0a18', accent: '#c2253a', bg: '#ffeded' },
  espada: { fg: '#0d2147', accent: '#1f5fc4', bg: '#e8efff' },
  basto:  { fg: '#0d3a22', accent: '#1f7d4e', bg: '#e6f4ec' },
}
