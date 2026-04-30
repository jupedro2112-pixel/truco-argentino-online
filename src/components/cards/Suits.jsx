// Detailed traditional-style SVG art for the four Spanish suits.
// All artwork below is original. The suit *concepts* (coin, cup, sword, club)
// are public-domain motifs going back centuries; the specific paths,
// proportions, gradients and decoration here are my own.

export function OroSuit({ size = 64 }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <defs>
        <radialGradient id="oroBody" cx="40%" cy="35%" r="65%">
          <stop offset="0%"  stopColor="#fff8c2" />
          <stop offset="35%" stopColor="#f3c44b" />
          <stop offset="80%" stopColor="#a37708" />
          <stop offset="100%" stopColor="#5b4204" />
        </radialGradient>
        <radialGradient id="oroShine" cx="35%" cy="30%" r="22%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="oroFace" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#fff5b8"/>
          <stop offset="100%" stopColor="#a37708"/>
        </radialGradient>
      </defs>
      {/* outer rim */}
      <circle cx="32" cy="32" r="29" fill="#3a2c02"/>
      <circle cx="32" cy="32" r="27" fill="url(#oroBody)" stroke="#3a2c02" strokeWidth="0.6"/>
      {/* dotted edge ring */}
      <circle cx="32" cy="32" r="24.5" fill="none" stroke="#3a2c02" strokeWidth="0.5"
        strokeDasharray="0.8 1.4" opacity="0.7"/>
      {/* ornamental ring */}
      <circle cx="32" cy="32" r="22" fill="none" stroke="#5b4204" strokeWidth="0.6" opacity="0.6"/>
      {/* central medallion */}
      <circle cx="32" cy="32" r="14" fill="url(#oroFace)" stroke="#3a2c02" strokeWidth="0.7"/>
      {/* sun rays */}
      <g fill="#3a2c02" opacity="0.85">
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180
          const x1 = 32 + Math.cos(angle) * 16
          const y1 = 32 + Math.sin(angle) * 16
          const x2 = 32 + Math.cos(angle) * 21
          const y2 = 32 + Math.sin(angle) * 21
          const long = i % 3 === 0
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#3a2c02" strokeWidth={long ? 1.2 : 0.7} />
          )
        })}
      </g>
      {/* face on coin */}
      <g fill="#3a2c02">
        <circle cx="28" cy="30" r="0.9"/>
        <circle cx="36" cy="30" r="0.9"/>
        <path d="M27 35 Q32 39 37 35" stroke="#3a2c02" strokeWidth="0.7" fill="none"/>
        <path d="M28 28 Q30 26 32 28 Q34 26 36 28" stroke="#3a2c02" strokeWidth="0.6" fill="none"/>
      </g>
      {/* shine */}
      <ellipse cx="22" cy="22" rx="10" ry="7" fill="url(#oroShine)"/>
    </svg>
  )
}

export function CopaSuit({ size = 64 }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <defs>
        <linearGradient id="copaBowl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#ff8090"/>
          <stop offset="35%" stopColor="#d63347"/>
          <stop offset="70%" stopColor="#8a1525"/>
          <stop offset="100%" stopColor="#4a060d"/>
        </linearGradient>
        <linearGradient id="copaGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#fff5b8"/>
          <stop offset="50%" stopColor="#f3c44b"/>
          <stop offset="100%" stopColor="#7a5806"/>
        </linearGradient>
        <linearGradient id="copaShine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* lid pinnacle */}
      <circle cx="32" cy="3.5" r="2.2" fill="url(#copaGold)" stroke="#3a2c02" strokeWidth="0.6"/>
      <line x1="32" y1="5.5" x2="32" y2="9" stroke="#3a2c02" strokeWidth="0.7"/>
      {/* lid arc */}
      <path d="M22 9 Q32 3 42 9 L40 12 Q32 8 24 12 Z"
        fill="url(#copaGold)" stroke="#3a2c02" strokeWidth="0.7"/>
      {/* upper rim */}
      <ellipse cx="32" cy="13" rx="19" ry="3" fill="url(#copaGold)" stroke="#3a2c02" strokeWidth="0.7"/>
      {/* bowl */}
      <path d="M13 13 Q32 24 51 13 L46 33 Q32 42 18 33 Z"
        fill="url(#copaBowl)" stroke="#3a0610" strokeWidth="1"/>
      {/* gold bands */}
      <path d="M15 18 Q32 28 49 18 L48 21 Q32 30 16 21 Z"
        fill="url(#copaGold)" stroke="#3a2c02" strokeWidth="0.4"/>
      <path d="M17 26 Q32 34 47 26 L46.5 28 Q32 35 17.5 28 Z"
        fill="url(#copaGold)" stroke="#3a2c02" strokeWidth="0.3" opacity="0.8"/>
      {/* small gems on bowl */}
      <circle cx="22" cy="23" r="0.8" fill="#3fbf72" stroke="#3a2c02" strokeWidth="0.2"/>
      <circle cx="32" cy="25" r="0.9" fill="#3fbf72" stroke="#3a2c02" strokeWidth="0.2"/>
      <circle cx="42" cy="23" r="0.8" fill="#3fbf72" stroke="#3a2c02" strokeWidth="0.2"/>
      {/* highlight */}
      <path d="M19 17 Q22 24 22 32" stroke="url(#copaShine)" strokeWidth="2" fill="none"/>
      {/* stem */}
      <path d="M28 36 L28 44 L36 44 L36 36 Z" fill="url(#copaGold)" stroke="#3a2c02" strokeWidth="0.6"/>
      {/* knot on stem */}
      <ellipse cx="32" cy="40" rx="5" ry="2" fill="url(#copaGold)" stroke="#3a2c02" strokeWidth="0.5"/>
      <ellipse cx="32" cy="40" rx="3" ry="1" fill="#7a5806" opacity="0.6"/>
      {/* base */}
      <path d="M16 50 Q32 47 48 50 L46 56 L18 56 Z"
        fill="url(#copaGold)" stroke="#3a2c02" strokeWidth="0.7"/>
      <ellipse cx="32" cy="58" rx="16" ry="2" fill="#5b4204"/>
    </svg>
  )
}

export function EspadaSuit({ size = 64 }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <defs>
        <linearGradient id="bladeMain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#f3f7ff"/>
          <stop offset="35%" stopColor="#a8c4ec"/>
          <stop offset="100%" stopColor="#3d5a86"/>
        </linearGradient>
        <linearGradient id="bladeEdge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#1f5fc4"/>
          <stop offset="50%"  stopColor="#5b95f5"/>
          <stop offset="100%" stopColor="#1f5fc4"/>
        </linearGradient>
        <linearGradient id="hilt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#fff5b8"/>
          <stop offset="50%" stopColor="#f3c44b"/>
          <stop offset="100%" stopColor="#7a5806"/>
        </linearGradient>
      </defs>
      {/* tip */}
      <path d="M32 3 L28 10 L36 10 Z" fill="url(#bladeMain)" stroke="#0d2147" strokeWidth="0.5"/>
      {/* blade outline */}
      <path d="M28 10 L28 40 L36 40 L36 10 Z" fill="url(#bladeEdge)" stroke="#0d2147" strokeWidth="0.6"/>
      {/* fuller (groove) */}
      <path d="M30 11 L30 39 L34 39 L34 11 Z" fill="url(#bladeMain)"/>
      <line x1="32" y1="11" x2="32" y2="39" stroke="#0d2147" strokeWidth="0.5" opacity="0.4"/>
      {/* highlight strip */}
      <line x1="30.5" y1="13" x2="30.5" y2="38" stroke="#ffffff" strokeWidth="0.5" opacity="0.7"/>
      {/* crossguard */}
      <rect x="10" y="38" width="44" height="5" rx="1.5" fill="url(#hilt)" stroke="#3a2c02" strokeWidth="0.6"/>
      {/* langets (small flares above guard) */}
      <path d="M30 35 L34 35 L33 38 L31 38 Z" fill="url(#hilt)" stroke="#3a2c02" strokeWidth="0.4"/>
      {/* guard end caps */}
      <circle cx="10" cy="40.5" r="3.4" fill="url(#hilt)" stroke="#3a2c02" strokeWidth="0.6"/>
      <circle cx="54" cy="40.5" r="3.4" fill="url(#hilt)" stroke="#3a2c02" strokeWidth="0.6"/>
      {/* central jewel on guard */}
      <circle cx="32" cy="40.5" r="2.4" fill="#c2253a" stroke="#3a2c02" strokeWidth="0.5"/>
      <circle cx="31" cy="39.7" r="0.7" fill="#fff" opacity="0.7"/>
      {/* grip with wrap */}
      <path d="M28 43 L28 56 L36 56 L36 43 Z" fill="#5a3a18" stroke="#291808" strokeWidth="0.5"/>
      {Array.from({ length: 5 }).map((_, i) => (
        <line key={i} x1="28" y1={45 + i * 2.4} x2="36" y2={46 + i * 2.4}
          stroke="#291808" strokeWidth="0.4"/>
      ))}
      {/* pommel */}
      <circle cx="32" cy="58.5" r="3.6" fill="url(#hilt)" stroke="#3a2c02" strokeWidth="0.6"/>
      <circle cx="32" cy="58.5" r="1.4" fill="#c2253a"/>
    </svg>
  )
}

export function BastoSuit({ size = 64 }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <defs>
        <linearGradient id="woodGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"  stopColor="#3a2210"/>
          <stop offset="35%" stopColor="#9c6224"/>
          <stop offset="70%" stopColor="#5a3a18"/>
          <stop offset="100%" stopColor="#2a1808"/>
        </linearGradient>
        <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5fd687"/>
          <stop offset="60%" stopColor="#1f7d4e"/>
          <stop offset="100%" stopColor="#0d3a22"/>
        </linearGradient>
      </defs>
      {/* upper leaves */}
      <g>
        <path d="M22 12 Q12 6 6 0 Q12 2 16 6 Q20 9 22 12 Z"
          fill="url(#leafGrad)" stroke="#0d3a22" strokeWidth="0.5"/>
        <path d="M22 12 Q14 7 10 4 Q15 5 18 7" stroke="#0d3a22" strokeWidth="0.4" fill="none"/>
      </g>
      <g>
        <path d="M42 12 Q52 6 58 0 Q52 2 48 6 Q44 9 42 12 Z"
          fill="url(#leafGrad)" stroke="#0d3a22" strokeWidth="0.5"/>
        <path d="M42 12 Q50 7 54 4 Q49 5 46 7" stroke="#0d3a22" strokeWidth="0.4" fill="none"/>
      </g>
      {/* head */}
      <ellipse cx="32" cy="14" rx="13" ry="9.5" fill="url(#woodGrad)" stroke="#1f1108" strokeWidth="0.8"/>
      {/* knots */}
      <circle cx="26" cy="11" r="2.4" fill="#3a2210" opacity="0.85"/>
      <circle cx="38" cy="13" r="2"   fill="#3a2210" opacity="0.85"/>
      <circle cx="32" cy="18" r="1.5" fill="#3a2210" opacity="0.85"/>
      <circle cx="36" cy="9"  r="1.3" fill="#3a2210" opacity="0.7"/>
      <circle cx="24" cy="16" r="1.0" fill="#3a2210" opacity="0.7"/>
      {/* highlight */}
      <ellipse cx="28" cy="11" rx="5" ry="2.2" fill="#d6975a" opacity="0.55"/>
      <ellipse cx="38" cy="9.5" rx="2" ry="1" fill="#d6975a" opacity="0.4"/>
      {/* shaft */}
      <path d="M26 22 L28 56 L36 56 L38 22 Z" fill="url(#woodGrad)" stroke="#1f1108" strokeWidth="0.8"/>
      {/* shaft highlight */}
      <path d="M28 23 L28.8 55" stroke="#d6975a" strokeWidth="0.7" opacity="0.55"/>
      <path d="M34 23 L34.8 55" stroke="#1f1108" strokeWidth="0.4" opacity="0.5"/>
      {/* small knot on shaft */}
      <ellipse cx="32" cy="38" rx="3" ry="1.5" fill="#3a2210" opacity="0.7"/>
      {/* bottom leaf */}
      <path d="M30 56 Q26 60 32 62 Q38 60 34 56 Z"
        fill="url(#leafGrad)" stroke="#0d3a22" strokeWidth="0.5"/>
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
