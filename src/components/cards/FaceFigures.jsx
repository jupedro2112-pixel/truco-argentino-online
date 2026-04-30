// Original detailed face-card art: Sota (10), Caballo (11), Rey (12).
// Stylized human figures filling most of the card area, in traditional
// Spanish-deck fashion. All paths are my own original work.

import { SUIT_COMPONENT, SUIT_TINT } from './Suits.jsx'

export function FaceFigure({ number, suit }) {
  const tint = SUIT_TINT[suit]
  if (number === 10) return <Sota tint={tint} suit={suit} />
  if (number === 11) return <Caballo tint={tint} suit={suit} />
  if (number === 12) return <Rey tint={tint} suit={suit} />
  return null
}

function Sota({ tint, suit }) {
  const Suit = SUIT_COMPONENT[suit]
  const id = tint.accent.replace('#', '')
  return (
    <svg viewBox="0 0 80 110" width="100%" height="100%" aria-hidden preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={`sotaTunic-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tint.accent}/>
          <stop offset="100%" stopColor={tint.fg}/>
        </linearGradient>
        <linearGradient id={`sotaSkin-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde0bf"/>
          <stop offset="100%" stopColor="#d4a47a"/>
        </linearGradient>
      </defs>
      {/* feathered cap */}
      <path d="M22 24 Q40 8 58 24 L54 30 Q40 22 26 30 Z"
        fill={`url(#sotaTunic-${id})`} stroke={tint.fg} strokeWidth="0.8"/>
      <path d="M58 22 Q66 14 74 8 Q70 16 62 26 Z" fill={tint.fg} opacity="0.85"/>
      <path d="M62 18 Q68 14 72 11" stroke="#fff" strokeWidth="0.5" opacity="0.6" fill="none"/>
      {/* hat band & jewel */}
      <path d="M24 28 L56 28 L54 32 L26 32 Z" fill="#fff5b8" stroke={tint.fg} strokeWidth="0.5"/>
      <circle cx="40" cy="30" r="1.6" fill="#c2253a" stroke={tint.fg} strokeWidth="0.4"/>
      {/* head */}
      <ellipse cx="40" cy="40" rx="9" ry="10" fill={`url(#sotaSkin-${id})`} stroke={tint.fg} strokeWidth="0.7"/>
      {/* hair sideburns */}
      <path d="M31 40 Q28 44 32 50 Q35 46 33 42 Z" fill="#3a2c02"/>
      <path d="M49 40 Q52 44 48 50 Q45 46 47 42 Z" fill="#3a2c02"/>
      {/* eyes */}
      <ellipse cx="36.5" cy="40" rx="0.9" ry="1.1" fill="#0d2147"/>
      <ellipse cx="43.5" cy="40" rx="0.9" ry="1.1" fill="#0d2147"/>
      {/* nose & mouth */}
      <path d="M40 42 Q39 44 40 45" stroke={tint.fg} strokeWidth="0.5" fill="none"/>
      <path d="M37 47 Q40 49 43 47" stroke="#7a0a18" strokeWidth="0.7" fill="none"/>
      {/* neck */}
      <path d="M36 50 L36 56 L44 56 L44 50 Z" fill={`url(#sotaSkin-${id})`} stroke={tint.fg} strokeWidth="0.5"/>
      {/* collar */}
      <path d="M28 56 L40 60 L52 56 L50 64 L40 67 L30 64 Z" fill="#fff5b8" stroke={tint.fg} strokeWidth="0.6"/>
      {/* tunic body */}
      <path d="M22 64 Q40 56 58 64 L60 96 L20 96 Z" fill={`url(#sotaTunic-${id})`} stroke={tint.fg} strokeWidth="0.8"/>
      {/* tunic central panel */}
      <path d="M36 60 L44 60 L44 96 L36 96 Z" fill={tint.bg} stroke={tint.fg} strokeWidth="0.5" opacity="0.85"/>
      {/* belt */}
      <rect x="22" y="78" width="36" height="4" fill={tint.fg} stroke="#000" strokeWidth="0.3"/>
      <rect x="38" y="77" width="4" height="6" fill="#fff5b8" stroke={tint.fg} strokeWidth="0.3"/>
      {/* shoulder buttons */}
      <circle cx="29" cy="68" r="0.9" fill="#fff5b8" stroke={tint.fg} strokeWidth="0.3"/>
      <circle cx="51" cy="68" r="0.9" fill="#fff5b8" stroke={tint.fg} strokeWidth="0.3"/>
      <circle cx="29" cy="74" r="0.9" fill="#fff5b8" stroke={tint.fg} strokeWidth="0.3"/>
      <circle cx="51" cy="74" r="0.9" fill="#fff5b8" stroke={tint.fg} strokeWidth="0.3"/>
      {/* held suit on the side */}
      <g transform="translate(2 60) scale(0.42)">
        <Suit size={64}/>
      </g>
      {/* arm holding the suit */}
      <path d="M22 64 Q14 70 14 82 L20 86 Q24 76 26 70 Z"
        fill={`url(#sotaTunic-${id})`} stroke={tint.fg} strokeWidth="0.6"/>
      {/* opposite arm (akimbo) */}
      <path d="M58 64 Q66 70 64 82 L60 86 Q56 76 54 70 Z"
        fill={`url(#sotaTunic-${id})`} stroke={tint.fg} strokeWidth="0.6"/>
    </svg>
  )
}

function Caballo({ tint, suit }) {
  const Suit = SUIT_COMPONENT[suit]
  const id = tint.accent.replace('#', '')
  return (
    <svg viewBox="0 0 80 110" width="100%" height="100%" aria-hidden preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={`horseBody-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#a36b3a"/>
          <stop offset="50%" stopColor="#5a3a18"/>
          <stop offset="100%" stopColor="#291808"/>
        </linearGradient>
        <linearGradient id={`riderTunic-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tint.accent}/>
          <stop offset="100%" stopColor={tint.fg}/>
        </linearGradient>
      </defs>
      {/* horse body */}
      <path d="M8 90 L10 70 Q10 55 22 50 Q24 42 40 38 L60 42 Q70 44 70 56 L62 60 L66 76 L60 90 L52 90 L52 70 L36 70 L36 90 Z"
        fill={`url(#horseBody-${id})`} stroke="#1f1108" strokeWidth="0.9"/>
      {/* mane along neck */}
      <path d="M40 38 Q44 32 50 30 Q48 36 50 42 L42 44 Z" fill="#1f1108" opacity="0.85"/>
      {/* tail */}
      <path d="M8 70 Q2 78 6 90 Q12 84 12 78 Z" fill="#1f1108" stroke="#0a0500" strokeWidth="0.4"/>
      {/* head */}
      <path d="M55 38 Q70 38 72 48 Q72 52 64 54 L60 50 Z"
        fill={`url(#horseBody-${id})`} stroke="#1f1108" strokeWidth="0.8"/>
      {/* ear */}
      <path d="M58 36 L62 30 L64 38 Z" fill="#1f1108"/>
      {/* eye */}
      <ellipse cx="65" cy="44" rx="1.2" ry="1.4" fill="#fff"/>
      <ellipse cx="65" cy="44.4" rx="0.6" ry="0.8" fill="#0d2147"/>
      {/* nostril & mouth */}
      <ellipse cx="69" cy="50" rx="0.8" ry="0.6" fill="#0d2147"/>
      <path d="M65 53 Q70 53 71 51" stroke="#0d2147" strokeWidth="0.4" fill="none"/>
      {/* harness */}
      <path d="M58 40 Q65 42 70 44 M62 50 L72 50" stroke="#fff5b8" strokeWidth="0.7" fill="none"/>
      <circle cx="62" cy="46" r="0.9" fill="#fff5b8" stroke="#3a2c02" strokeWidth="0.3"/>
      {/* hooves */}
      <rect x="36" y="88" width="6" height="4" fill="#0a0500"/>
      <rect x="52" y="88" width="6" height="4" fill="#0a0500"/>
      <rect x="6" y="88" width="6" height="4" fill="#0a0500"/>
      <rect x="60" y="88" width="6" height="4" fill="#0a0500"/>

      {/* ===== Rider ===== */}
      {/* saddle blanket */}
      <path d="M22 50 Q40 44 60 48 L58 56 Q40 52 22 56 Z"
        fill={`url(#riderTunic-${id})`} stroke={tint.fg} strokeWidth="0.6"/>
      <path d="M22 50 L24 56 M58 48 L58 54" stroke="#fff5b8" strokeWidth="0.4" fill="none"/>
      {/* rider torso */}
      <path d="M30 30 Q40 22 50 30 L48 50 L32 50 Z"
        fill={`url(#riderTunic-${id})`} stroke={tint.fg} strokeWidth="0.7"/>
      {/* rider head */}
      <ellipse cx="40" cy="22" rx="6.5" ry="7" fill="#fde0bf" stroke={tint.fg} strokeWidth="0.6"/>
      {/* hat / cap */}
      <path d="M32 17 Q40 8 48 17 L46 21 Q40 18 34 21 Z"
        fill={tint.fg} stroke="#000" strokeWidth="0.4"/>
      <circle cx="40" cy="17" r="1.3" fill="#fff5b8" stroke={tint.fg} strokeWidth="0.3"/>
      {/* eyes */}
      <circle cx="38" cy="22" r="0.7" fill="#0d2147"/>
      <circle cx="42" cy="22" r="0.7" fill="#0d2147"/>
      <path d="M38 25 Q40 27 42 25" stroke={tint.fg} strokeWidth="0.4" fill="none"/>
      {/* arm holding suit */}
      <path d="M30 30 Q22 38 18 50 L22 54 Q28 42 32 36 Z"
        fill={`url(#riderTunic-${id})`} stroke={tint.fg} strokeWidth="0.5"/>
      {/* held suit emblem */}
      <g transform="translate(2 40) scale(0.32)">
        <Suit size={64}/>
      </g>
      {/* leg / boot */}
      <path d="M48 50 Q56 56 56 70 L48 70 Z" fill="#1f1108" stroke="#000" strokeWidth="0.4"/>
    </svg>
  )
}

function Rey({ tint, suit }) {
  const Suit = SUIT_COMPONENT[suit]
  const id = tint.accent.replace('#', '')
  return (
    <svg viewBox="0 0 80 110" width="100%" height="100%" aria-hidden preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={`reyRobe-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tint.accent}/>
          <stop offset="100%" stopColor={tint.fg}/>
        </linearGradient>
        <linearGradient id={`reyCrown-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff5b8"/>
          <stop offset="50%" stopColor="#f3c44b"/>
          <stop offset="100%" stopColor="#7a5806"/>
        </linearGradient>
      </defs>
      {/* crown base ring */}
      <rect x="20" y="20" width="40" height="6" fill={`url(#reyCrown-${id})`} stroke="#3a2c02" strokeWidth="0.7"/>
      {/* crown spires */}
      <path d="M20 20 L26 6 L32 18 L40 4 L48 18 L54 6 L60 20 L56 24 L24 24 Z"
        fill={`url(#reyCrown-${id})`} stroke="#3a2c02" strokeWidth="0.7"/>
      {/* crown jewels */}
      <circle cx="26" cy="6" r="1.5"  fill={tint.accent} stroke="#3a2c02" strokeWidth="0.4"/>
      <circle cx="40" cy="4" r="1.8"  fill="#c2253a" stroke="#3a2c02" strokeWidth="0.4"/>
      <circle cx="54" cy="6" r="1.5"  fill={tint.accent} stroke="#3a2c02" strokeWidth="0.4"/>
      <circle cx="32" cy="22" r="1.0" fill="#1f7d4e"/>
      <circle cx="48" cy="22" r="1.0" fill="#1f7d4e"/>
      {/* face */}
      <ellipse cx="40" cy="34" rx="9" ry="10" fill="#fde0bf" stroke={tint.fg} strokeWidth="0.7"/>
      <ellipse cx="36.5" cy="34" rx="0.9" ry="1.1" fill="#0d2147"/>
      <ellipse cx="43.5" cy="34" rx="0.9" ry="1.1" fill="#0d2147"/>
      {/* eyebrows */}
      <path d="M34 30 Q36 28 39 30" stroke="#3a2c02" strokeWidth="0.6" fill="none"/>
      <path d="M41 30 Q44 28 46 30" stroke="#3a2c02" strokeWidth="0.6" fill="none"/>
      {/* moustache */}
      <path d="M34 40 Q40 44 46 40 Q44 42 40 41 Q36 42 34 40 Z" fill="#cccccc"/>
      {/* beard */}
      <path d="M30 42 Q40 60 50 42 L50 52 Q40 64 30 52 Z"
        fill="#dddddd" stroke={tint.fg} strokeWidth="0.5"/>
      <path d="M34 46 Q40 60 46 46" stroke="#888" strokeWidth="0.4" fill="none"/>
      <path d="M37 50 Q40 58 43 50" stroke="#888" strokeWidth="0.4" fill="none"/>
      {/* neck */}
      <path d="M36 50 L36 58 L44 58 L44 50 Z" fill="#fde0bf" stroke={tint.fg} strokeWidth="0.5"/>
      {/* shoulders / robe */}
      <path d="M16 70 Q40 56 64 70 L66 100 L14 100 Z"
        fill={`url(#reyRobe-${id})`} stroke={tint.fg} strokeWidth="0.8"/>
      {/* fur trim (top edge) */}
      <path d="M16 70 Q40 56 64 70 L62 76 Q40 62 18 76 Z"
        fill="#ffffff" stroke={tint.fg} strokeWidth="0.4"/>
      {/* ermine spots */}
      {[
        [22, 72], [28, 70], [34, 68], [40, 67],
        [46, 68], [52, 70], [58, 72], [25, 75],
        [37, 73], [49, 73], [55, 75],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <ellipse cx={cx} cy={cy} rx="0.9" ry="0.6" fill={tint.fg}/>
          <line x1={cx - 1} y1={cy + 0.5} x2={cx} y2={cy + 1.5} stroke={tint.fg} strokeWidth="0.4"/>
          <line x1={cx + 1} y1={cy + 0.5} x2={cx} y2={cy + 1.5} stroke={tint.fg} strokeWidth="0.4"/>
        </g>
      ))}
      {/* central robe panel */}
      <path d="M36 78 L44 78 L46 100 L34 100 Z"
        fill={tint.bg} stroke={tint.fg} strokeWidth="0.5" opacity="0.9"/>
      {/* royal medallion */}
      <circle cx="40" cy="84" r="3" fill="#fff5b8" stroke={tint.fg} strokeWidth="0.5"/>
      <text x="40" y="86" textAnchor="middle" fill={tint.fg}
        style={{ fontSize: 4, fontWeight: 800, fontFamily: 'system-ui' }}>R</text>
      {/* held suit on the side */}
      <g transform="translate(54 64) scale(0.34)">
        <Suit size={64}/>
      </g>
      {/* scepter on left */}
      <line x1="14" y1="64" x2="20" y2="100" stroke="#3a2c02" strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="14" cy="62" r="2.4" fill={`url(#reyCrown-${id})`} stroke="#3a2c02" strokeWidth="0.5"/>
      <circle cx="14" cy="62" r="0.9" fill="#c2253a"/>
    </svg>
  )
}
