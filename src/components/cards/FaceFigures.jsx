// Decorative figures for face cards: Sota (10), Caballo (11), Rey (12).
// Original simple stylized art.

import { SUIT_COMPONENT, SUIT_TINT } from './Suits.jsx'

export function FaceFigure({ number, suit }) {
  const tint = SUIT_TINT[suit]
  if (number === 10) return <Sota tint={tint} suit={suit} />
  if (number === 11) return <Caballo tint={tint} suit={suit} />
  if (number === 12) return <Rey tint={tint} suit={suit} />
  return null
}

function Frame({ children, tint }) {
  const id = `fg-${tint.accent.replace('#', '')}`
  return (
    <svg viewBox="0 0 80 100" width="100%" height="100%" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor={tint.bg} />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="72" height="92" rx="6" fill={`url(#${id})`} stroke={tint.accent} strokeWidth="0.8"/>
      {/* corner ornaments */}
      <path d="M6 12 L6 6 L12 6" fill="none" stroke={tint.accent} strokeWidth="0.6"/>
      <path d="M74 12 L74 6 L68 6" fill="none" stroke={tint.accent} strokeWidth="0.6"/>
      <path d="M6 88 L6 94 L12 94" fill="none" stroke={tint.accent} strokeWidth="0.6"/>
      <path d="M74 88 L74 94 L68 94" fill="none" stroke={tint.accent} strokeWidth="0.6"/>
      {children}
    </svg>
  )
}

function Sota({ tint, suit }) {
  const Suit = SUIT_COMPONENT[suit]
  return (
    <Frame tint={tint}>
      {/* hat with feather */}
      <path d="M28 24 Q40 14 52 24 L50 30 Q40 24 30 30 Z" fill={tint.accent} stroke={tint.fg} strokeWidth="0.8"/>
      <path d="M52 22 Q58 16 62 14 Q56 18 54 24 Z" fill={tint.fg} opacity="0.7"/>
      <circle cx="40" cy="22" r="1.5" fill="#f3c44b" stroke={tint.fg} strokeWidth="0.4"/>
      {/* head */}
      <circle cx="40" cy="34" r="9" fill="#f3d9b5" stroke={tint.fg} strokeWidth="0.8"/>
      {/* hair tufts */}
      <path d="M31 36 Q28 38 30 42 Q33 41 32 38 Z" fill="#3a2c02" opacity="0.6"/>
      <path d="M49 36 Q52 38 50 42 Q47 41 48 38 Z" fill="#3a2c02" opacity="0.6"/>
      {/* eyes & mouth */}
      <circle cx="37" cy="34" r="0.9" fill={tint.fg}/>
      <circle cx="43" cy="34" r="0.9" fill={tint.fg}/>
      <path d="M37 38 Q40 40 43 38" stroke={tint.fg} strokeWidth="0.6" fill="none"/>
      {/* collar */}
      <path d="M30 46 L40 50 L50 46 L48 52 L40 54 L32 52 Z" fill={tint.bg} stroke={tint.fg} strokeWidth="0.6"/>
      {/* body / tunic */}
      <path d="M26 60 Q40 50 54 60 L54 80 L26 80 Z" fill={tint.accent} stroke={tint.fg} strokeWidth="0.8"/>
      {/* belt */}
      <rect x="26" y="68" width="28" height="3" fill={tint.fg} opacity="0.7"/>
      {/* held suit */}
      <g transform="translate(8 56) scale(0.36)">
        <Suit size={64}/>
      </g>
      {/* small ornament on chest */}
      <circle cx="40" cy="62" r="1.4" fill="#f3c44b" stroke={tint.fg} strokeWidth="0.4"/>
    </Frame>
  )
}

function Caballo({ tint, suit }) {
  const Suit = SUIT_COMPONENT[suit]
  return (
    <Frame tint={tint}>
      {/* horse body */}
      <path d="M14 78 L16 56 Q18 42 30 38 Q32 28 44 28 L52 32 Q58 34 56 42 L48 46 L52 60 L46 78 L40 78 L40 62 L34 62 L34 78 Z"
        fill={tint.accent} stroke={tint.fg} strokeWidth="0.9"/>
      {/* mane */}
      <path d="M50 28 Q58 24 62 28 L56 36 Q52 32 50 30 Z" fill={tint.fg} opacity="0.85"/>
      {/* harness */}
      <line x1="42" y1="32" x2="48" y2="36" stroke="#f3c44b" strokeWidth="0.8"/>
      <circle cx="46" cy="34" r="0.9" fill="#f3c44b" stroke={tint.fg} strokeWidth="0.3"/>
      {/* eye */}
      <circle cx="50" cy="36" r="1.0" fill="#ffffff"/>
      <circle cx="50" cy="36" r="0.5" fill={tint.fg}/>
      {/* nostril */}
      <circle cx="55" cy="40" r="0.6" fill={tint.fg}/>
      {/* ear */}
      <path d="M48 28 L52 24 L52 30 Z" fill={tint.fg}/>
      {/* hooves */}
      <rect x="14" y="76" width="6" height="3" fill={tint.fg}/>
      <rect x="40" y="76" width="6" height="3" fill={tint.fg}/>
      {/* held suit */}
      <g transform="translate(54 64) scale(0.28)">
        <Suit size={64}/>
      </g>
    </Frame>
  )
}

function Rey({ tint, suit }) {
  const Suit = SUIT_COMPONENT[suit]
  return (
    <Frame tint={tint}>
      <defs>
        <linearGradient id={`crownGrad-${tint.accent.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff5b8"/>
          <stop offset="100%" stopColor="#a37708"/>
        </linearGradient>
      </defs>
      {/* crown */}
      <path d="M22 26 L28 12 L34 22 L40 10 L46 22 L52 12 L58 26 L52 30 L28 30 Z"
        fill={`url(#crownGrad-${tint.accent.replace('#','')})`}
        stroke="#3a2c02" strokeWidth="0.8"/>
      <circle cx="28" cy="12" r="1.4" fill={tint.accent} stroke="#3a2c02" strokeWidth="0.4"/>
      <circle cx="40" cy="10" r="1.7" fill={tint.accent} stroke="#3a2c02" strokeWidth="0.4"/>
      <circle cx="52" cy="12" r="1.4" fill={tint.accent} stroke="#3a2c02" strokeWidth="0.4"/>
      <rect x="28" y="28" width="24" height="2.5" fill="#3a2c02" opacity="0.4"/>
      {/* face */}
      <circle cx="40" cy="40" r="9" fill="#f3d9b5" stroke={tint.fg} strokeWidth="0.8"/>
      <circle cx="37" cy="40" r="0.9" fill={tint.fg}/>
      <circle cx="43" cy="40" r="0.9" fill={tint.fg}/>
      <path d="M37 43 Q40 45 43 43" stroke={tint.fg} strokeWidth="0.5" fill="none"/>
      {/* beard */}
      <path d="M30 42 Q40 60 50 42 L50 50 Q40 60 30 50 Z"
        fill="#cccccc" stroke={tint.fg} strokeWidth="0.5"/>
      <path d="M34 44 Q40 56 46 44" stroke="#888888" strokeWidth="0.4" fill="none"/>
      {/* robe */}
      <path d="M20 80 Q40 50 60 80 L60 92 L20 92 Z" fill={tint.accent} stroke={tint.fg} strokeWidth="0.8"/>
      {/* fur trim */}
      <path d="M20 80 Q40 50 60 80 L58 84 Q40 56 22 84 Z" fill="#ffffff" opacity="0.85" stroke={tint.fg} strokeWidth="0.4"/>
      {/* dots on fur */}
      <circle cx="28" cy="78" r="0.6" fill={tint.fg}/>
      <circle cx="36" cy="72" r="0.6" fill={tint.fg}/>
      <circle cx="44" cy="72" r="0.6" fill={tint.fg}/>
      <circle cx="52" cy="78" r="0.6" fill={tint.fg}/>
      {/* collar / neck */}
      <path d="M34 50 L40 56 L46 50 L46 58 L40 62 L34 58 Z" fill={tint.bg} stroke={tint.fg} strokeWidth="0.5"/>
      {/* held suit (small, in front) */}
      <g transform="translate(56 56) scale(0.3)">
        <Suit size={64}/>
      </g>
    </Frame>
  )
}
