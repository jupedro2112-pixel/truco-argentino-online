// Original SVG art for the four Spanish suits.
// Detailed, traditional-style illustrations rendered as inline SVG
// so they scale cleanly and can be tinted via the SUIT_TINT palette.

export function OroSuit({ size = 64 }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <defs>
        <radialGradient id="oroBody" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fff7c8" />
          <stop offset="40%" stopColor="#f1c440" />
          <stop offset="100%" stopColor="#7a5806" />
        </radialGradient>
        <radialGradient id="oroShine" cx="35%" cy="32%" r="20%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* outer rim */}
      <circle cx="32" cy="32" r="27" fill="#5b4204" />
      <circle cx="32" cy="32" r="25" fill="url(#oroBody)" stroke="#3a2c02" strokeWidth="0.8"/>
      {/* dotted edge */}
      <circle cx="32" cy="32" r="22" fill="none" stroke="#3a2c02" strokeWidth="0.6"
        strokeDasharray="1.2 1.2" opacity="0.55"/>
      {/* central medallion */}
      <circle cx="32" cy="32" r="14" fill="none" stroke="#3a2c02" strokeWidth="0.6" opacity="0.6"/>
      {/* fleur-de-lis style center */}
      <g fill="#3a2c02" opacity="0.85">
        <path d="M32 18 Q34 24 32 30 Q30 24 32 18 Z"/>
        <path d="M32 46 Q34 40 32 34 Q30 40 32 46 Z"/>
        <path d="M18 32 Q24 30 30 32 Q24 34 18 32 Z"/>
        <path d="M46 32 Q40 30 34 32 Q40 34 46 32 Z"/>
        <path d="M22 22 Q28 26 30 30 Q26 28 22 22 Z"/>
        <path d="M42 22 Q36 26 34 30 Q38 28 42 22 Z"/>
        <path d="M22 42 Q28 38 30 34 Q26 36 22 42 Z"/>
        <path d="M42 42 Q36 38 34 34 Q38 36 42 42 Z"/>
      </g>
      <circle cx="32" cy="32" r="3" fill="#fff5b8" stroke="#3a2c02" strokeWidth="0.7"/>
      <circle cx="32" cy="32" r="32" fill="url(#oroShine)" />
    </svg>
  )
}

export function CopaSuit({ size = 64 }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <defs>
        <linearGradient id="copaBowl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff7384" />
          <stop offset="50%" stopColor="#c2253a" />
          <stop offset="100%" stopColor="#5e0911" />
        </linearGradient>
        <linearGradient id="copaGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe48a" />
          <stop offset="100%" stopColor="#a37708" />
        </linearGradient>
      </defs>
      {/* lid jewel */}
      <circle cx="32" cy="5" r="2.4" fill="url(#copaGold)" stroke="#3a2c02" strokeWidth="0.7"/>
      <line x1="32" y1="7" x2="32" y2="10" stroke="#3a2c02" strokeWidth="0.7"/>
      {/* lid arc */}
      <path d="M22 10 Q32 4 42 10 L40 13 Q32 9 24 13 Z" fill="url(#copaGold)" stroke="#3a2c02" strokeWidth="0.8"/>
      {/* rim */}
      <ellipse cx="32" cy="14" rx="18" ry="3" fill="url(#copaGold)" stroke="#3a2c02" strokeWidth="0.7"/>
      {/* bowl */}
      <path d="M14 14 Q32 24 50 14 L46 32 Q32 42 18 32 Z" fill="url(#copaBowl)" stroke="#3a0610" strokeWidth="1"/>
      {/* gold band on bowl */}
      <path d="M16 19 Q32 28 48 19 L47 22 Q32 30 17 22 Z" fill="url(#copaGold)" stroke="#3a2c02" strokeWidth="0.4"/>
      {/* highlight */}
      <path d="M20 18 Q24 26 22 32" stroke="#ffffff" strokeWidth="1.2" opacity="0.35" fill="none"/>
      {/* stem */}
      <path d="M28 36 L28 46 L36 46 L36 36 Z" fill="url(#copaGold)" stroke="#3a2c02" strokeWidth="0.7"/>
      <ellipse cx="32" cy="36" rx="4.5" ry="1.2" fill="#a37708"/>
      <ellipse cx="32" cy="46" rx="6" ry="1.5" fill="#a37708"/>
      {/* base */}
      <ellipse cx="32" cy="54" rx="14" ry="3.5" fill="url(#copaGold)" stroke="#3a2c02" strokeWidth="0.8"/>
      <ellipse cx="32" cy="56.8" rx="12" ry="1.6" fill="#7a5806" opacity="0.6"/>
    </svg>
  )
}

export function EspadaSuit({ size = 64 }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <defs>
        <linearGradient id="bladeMain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3f7ff" />
          <stop offset="50%" stopColor="#9bb6e0" />
          <stop offset="100%" stopColor="#3d5a86" />
        </linearGradient>
        <linearGradient id="bladeEdge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1f5fc4" />
          <stop offset="50%" stopColor="#4a8bf0" />
          <stop offset="100%" stopColor="#1f5fc4" />
        </linearGradient>
        <linearGradient id="hilt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3c44b" />
          <stop offset="100%" stopColor="#7a5806" />
        </linearGradient>
      </defs>
      {/* point */}
      <path d="M32 4 L28 12 L36 12 Z" fill="url(#bladeMain)" stroke="#0d2147" strokeWidth="0.7"/>
      {/* blade */}
      <path d="M28 12 L28 42 L36 42 L36 12 Z" fill="url(#bladeEdge)" stroke="#0d2147" strokeWidth="0.7"/>
      <path d="M30 12 L30 42 L34 42 L34 12 Z" fill="url(#bladeMain)"/>
      <line x1="32" y1="13" x2="32" y2="41" stroke="#0d2147" strokeWidth="0.5" opacity="0.4"/>
      {/* highlight */}
      <line x1="30.5" y1="14" x2="30.5" y2="40" stroke="#ffffff" strokeWidth="0.6" opacity="0.6"/>
      {/* crossguard */}
      <rect x="12" y="40" width="40" height="5" rx="2" fill="url(#hilt)" stroke="#3a2c02" strokeWidth="0.7"/>
      <circle cx="12" cy="42.5" r="3.2" fill="url(#hilt)" stroke="#3a2c02" strokeWidth="0.7"/>
      <circle cx="52" cy="42.5" r="3.2" fill="url(#hilt)" stroke="#3a2c02" strokeWidth="0.7"/>
      {/* cross/jewel on guard */}
      <circle cx="32" cy="42.5" r="2.2" fill="#c2253a" stroke="#3a2c02" strokeWidth="0.6"/>
      {/* grip */}
      <path d="M28 45 L28 56 L36 56 L36 45 Z" fill="#5a3a18" stroke="#291808" strokeWidth="0.6"/>
      <line x1="28" y1="48" x2="36" y2="48" stroke="#291808" strokeWidth="0.4"/>
      <line x1="28" y1="51" x2="36" y2="51" stroke="#291808" strokeWidth="0.4"/>
      <line x1="28" y1="54" x2="36" y2="54" stroke="#291808" strokeWidth="0.4"/>
      {/* pommel */}
      <circle cx="32" cy="58.5" r="3.6" fill="url(#hilt)" stroke="#3a2c02" strokeWidth="0.7"/>
      <circle cx="32" cy="58.5" r="1.4" fill="#c2253a"/>
    </svg>
  )
}

export function BastoSuit({ size = 64 }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <defs>
        <linearGradient id="woodGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3a2210" />
          <stop offset="40%" stopColor="#8a5520" />
          <stop offset="70%" stopColor="#5a3a18" />
          <stop offset="100%" stopColor="#2a1808" />
        </linearGradient>
        <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3fbf72" />
          <stop offset="100%" stopColor="#0f6238" />
        </linearGradient>
      </defs>
      {/* side leaves */}
      <path d="M22 14 Q12 8 8 0 Q14 4 18 8 Q22 11 22 14 Z" fill="url(#leafGrad)" stroke="#0d3a22" strokeWidth="0.7"/>
      <path d="M42 14 Q52 8 56 0 Q50 4 46 8 Q42 11 42 14 Z" fill="url(#leafGrad)" stroke="#0d3a22" strokeWidth="0.7"/>
      {/* head (knobby top) */}
      <ellipse cx="32" cy="14" rx="12" ry="9" fill="url(#woodGrad)" stroke="#1f1108" strokeWidth="0.9"/>
      {/* knot bumps */}
      <circle cx="26" cy="11" r="2.2" fill="#3a2210" opacity="0.85"/>
      <circle cx="38" cy="13" r="1.8" fill="#3a2210" opacity="0.85"/>
      <circle cx="32" cy="18" r="1.4" fill="#3a2210" opacity="0.85"/>
      <circle cx="35" cy="9" r="1.2" fill="#3a2210" opacity="0.7"/>
      <circle cx="24" cy="16" r="1.0" fill="#3a2210" opacity="0.7"/>
      {/* highlight on head */}
      <ellipse cx="28" cy="11" rx="4" ry="2" fill="#c08858" opacity="0.5"/>
      {/* shaft */}
      <path d="M27 22 L28 56 L36 56 L37 22 Z" fill="url(#woodGrad)" stroke="#1f1108" strokeWidth="0.9"/>
      {/* shaft grain */}
      <line x1="29" y1="24" x2="30" y2="55" stroke="#1f1108" strokeWidth="0.4" opacity="0.5"/>
      <line x1="34" y1="24" x2="35" y2="55" stroke="#c08858" strokeWidth="0.4" opacity="0.4"/>
      {/* small leaf at base */}
      <path d="M30 56 Q28 60 32 62 Q36 60 34 56 Z" fill="url(#leafGrad)" stroke="#0d3a22" strokeWidth="0.6"/>
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
  oro:    { fg: '#7a5806', accent: '#d4a015', bg: '#fff8e1' },
  copa:   { fg: '#7a0a18', accent: '#c2253a', bg: '#ffeded' },
  espada: { fg: '#0d2147', accent: '#1f5fc4', bg: '#e8efff' },
  basto:  { fg: '#0d3a22', accent: '#1f7d4e', bg: '#e6f4ec' },
}
