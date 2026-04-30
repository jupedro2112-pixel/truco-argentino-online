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
  return (
    <svg viewBox="0 0 80 100" width="100%" height="100%" aria-hidden>
      <defs>
        <linearGradient id={`fg-${tint.accent}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor={tint.bg} />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="68" height="88" rx="6" fill={`url(#fg-${tint.accent})`} stroke={tint.accent} strokeWidth="1"/>
      {children}
    </svg>
  )
}

function Sota({ tint, suit }) {
  const Suit = SUIT_COMPONENT[suit]
  return (
    <Frame tint={tint}>
      {/* head */}
      <circle cx="40" cy="32" r="9" fill="#f3d9b5" stroke={tint.fg} strokeWidth="1"/>
      {/* hair / hat */}
      <path d="M30 28 Q40 18 50 28 L48 32 Q40 26 32 32 Z" fill={tint.accent} stroke={tint.fg} strokeWidth="0.8"/>
      {/* eyes */}
      <circle cx="37" cy="32" r="0.9" fill={tint.fg}/>
      <circle cx="43" cy="32" r="0.9" fill={tint.fg}/>
      {/* body */}
      <path d="M28 60 Q40 44 52 60 L52 78 L28 78 Z" fill={tint.accent} stroke={tint.fg} strokeWidth="1"/>
      {/* held suit */}
      <g transform="translate(12 56) scale(0.42)">
        <Suit size={64}/>
      </g>
      {/* lapel */}
      <path d="M40 44 L36 60 L40 64 L44 60 Z" fill={tint.bg} stroke={tint.fg} strokeWidth="0.6"/>
    </Frame>
  )
}

function Caballo({ tint, suit }) {
  const Suit = SUIT_COMPONENT[suit]
  return (
    <Frame tint={tint}>
      {/* horse silhouette */}
      <g fill={tint.accent} stroke={tint.fg} strokeWidth="1">
        <path d="M22 70 L24 50 Q24 38 36 32 Q40 22 50 24 L54 30 Q58 32 56 38 L50 42 L52 56 L48 70 L42 70 L42 58 L36 58 L36 70 Z"/>
      </g>
      {/* mane */}
      <path d="M52 24 Q58 22 60 26 L56 32 Z" fill={tint.fg} opacity="0.8"/>
      {/* eye */}
      <circle cx="50" cy="30" r="0.9" fill="#fff"/>
      {/* held suit, smaller */}
      <g transform="translate(50 60) scale(0.32)">
        <Suit size={64}/>
      </g>
    </Frame>
  )
}

function Rey({ tint, suit }) {
  const Suit = SUIT_COMPONENT[suit]
  return (
    <Frame tint={tint}>
      {/* crown */}
      <path d="M24 24 L30 14 L36 22 L40 12 L44 22 L50 14 L56 24 L52 30 L28 30 Z"
        fill="#e2c14a" stroke="#5b4204" strokeWidth="1"/>
      <circle cx="30" cy="14" r="1.5" fill={tint.accent} stroke="#5b4204" strokeWidth="0.5"/>
      <circle cx="40" cy="12" r="1.7" fill={tint.accent} stroke="#5b4204" strokeWidth="0.5"/>
      <circle cx="50" cy="14" r="1.5" fill={tint.accent} stroke="#5b4204" strokeWidth="0.5"/>
      {/* face */}
      <circle cx="40" cy="40" r="9" fill="#f3d9b5" stroke={tint.fg} strokeWidth="1"/>
      {/* beard */}
      <path d="M32 42 Q40 56 48 42 L48 48 Q40 56 32 48 Z" fill="#bebebe" stroke={tint.fg} strokeWidth="0.5"/>
      {/* eyes */}
      <circle cx="37" cy="40" r="0.9" fill={tint.fg}/>
      <circle cx="43" cy="40" r="0.9" fill={tint.fg}/>
      {/* robe */}
      <path d="M22 78 Q40 50 58 78 L58 90 L22 90 Z" fill={tint.accent} stroke={tint.fg} strokeWidth="1"/>
      {/* collar */}
      <path d="M32 56 L40 60 L48 56 L46 64 L40 68 L34 64 Z" fill={tint.bg} stroke={tint.fg} strokeWidth="0.6"/>
      {/* held suit */}
      <g transform="translate(58 56) scale(0.28)">
        <Suit size={64}/>
      </g>
    </Frame>
  )
}
