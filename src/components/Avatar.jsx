// Avatar renderer. Each id maps to a distinct stylized SVG portrait.
import { AVATAR_BY_ID, RARITY_RING, RARITY_GLOW } from '../data/avatars.js'

export default function Avatar({ id = 'gaucho', size = 56, ring = true, className = '' }) {
  const meta = AVATAR_BY_ID[id] || AVATAR_BY_ID.gaucho
  const Glyph = AVATAR_GLYPH[id] || AVATAR_GLYPH.gaucho
  return (
    <div
      className={`relative rounded-full overflow-hidden grid place-items-center ${ring ? `ring-4 ${RARITY_RING[meta.rarity]} ${RARITY_GLOW[meta.rarity]}` : ''} ${className}`}
      style={{ width: size, height: size, background: GLYPH_BG[id] || '#1f3a2a' }}
    >
      <Glyph size={size} />
    </div>
  )
}

const GLYPH_BG = {
  gaucho:   'linear-gradient(135deg, #b88654, #6e3a0e)',
  dama:     'linear-gradient(135deg, #d4759a, #6e2240)',
  compadre: 'linear-gradient(135deg, #4f5a72, #1a1f2c)',
  milico:   'linear-gradient(135deg, #6f8a4a, #2c3a1c)',
  tanguero: 'linear-gradient(135deg, #1a1a1a, #3d2a2a)',
  china:    'linear-gradient(135deg, #c2253a, #5e0911)',
  pibe:     'linear-gradient(135deg, #1f5fc4, #0d2147)',
  jefa:     'linear-gradient(135deg, #c2853a, #5e1a0a)',
  mago:     'linear-gradient(135deg, #7d3aa3, #2a0f44)',
  rey:      'linear-gradient(135deg, #f3c44b, #7a5806)',
}

/* -------------------------------------------------------------------------- */
/* Avatar glyphs — original SVG portraits, stylized faces.                     */
/* -------------------------------------------------------------------------- */

const AVATAR_GLYPH = {
  gaucho:   GauchoGlyph,
  dama:     DamaGlyph,
  compadre: CompadreGlyph,
  milico:   MilicoGlyph,
  tanguero: TangueroGlyph,
  china:    ChinaGlyph,
  pibe:     PibeGlyph,
  jefa:     JefaGlyph,
  mago:     MagoGlyph,
  rey:      ReyGlyph,
}

function FaceBase({ skin = '#fde0bf', eyes = '#0d2147', children, accessories }) {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden>
      {/* head */}
      <ellipse cx="32" cy="34" rx="14" ry="16" fill={skin}/>
      {/* eyes */}
      <ellipse cx="27" cy="34" rx="1.4" ry="1.8" fill={eyes}/>
      <ellipse cx="37" cy="34" rx="1.4" ry="1.8" fill={eyes}/>
      {/* mouth */}
      <path d="M27 42 Q32 45 37 42" stroke={eyes} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {children}
      {accessories}
    </svg>
  )
}

function GauchoGlyph() {
  return (
    <FaceBase skin="#d8a679" eyes="#3a2c02">
      {/* hat */}
      <ellipse cx="32" cy="22" rx="22" ry="3" fill="#1f1108"/>
      <path d="M22 22 Q32 8 42 22 Z" fill="#3a2210"/>
      {/* moustache */}
      <path d="M27 41 Q32 44 37 41 Q34 43 32 43 Q30 43 27 41 Z" fill="#3a2210"/>
      {/* scarf */}
      <path d="M14 52 Q32 60 50 52 L50 64 L14 64 Z" fill="#c2253a"/>
      <path d="M28 52 L36 52 L36 56 L28 56 Z" fill="#fff" opacity="0.3"/>
    </FaceBase>
  )
}

function DamaGlyph() {
  return (
    <FaceBase skin="#fce0c0" eyes="#5e0911">
      {/* hair */}
      <path d="M16 30 Q16 14 32 14 Q48 14 48 30 L48 38 Q44 32 32 32 Q20 32 16 38 Z"
        fill="#3a1414"/>
      {/* ear tuft */}
      <ellipse cx="48" cy="34" rx="2" ry="3" fill="#3a1414"/>
      {/* lipstick */}
      <path d="M28 42 Q32 45 36 42" stroke="#c2253a" strokeWidth="1.6" fill="none"/>
      {/* earring */}
      <circle cx="46" cy="38" r="1.2" fill="#f3c44b"/>
      {/* shoulders */}
      <path d="M14 56 Q32 50 50 56 L50 64 L14 64 Z" fill="#7a1740"/>
    </FaceBase>
  )
}

function CompadreGlyph() {
  return (
    <FaceBase skin="#d4a47a" eyes="#0d2147">
      {/* slick hair */}
      <path d="M18 24 Q32 14 46 24 L44 30 Q32 22 20 30 Z" fill="#0d0d0d"/>
      {/* sideburn */}
      <path d="M18 32 L20 38 L23 36 L22 32 Z" fill="#0d0d0d"/>
      {/* moustache */}
      <path d="M27 41 L37 41 L36 43 L28 43 Z" fill="#0d0d0d"/>
      {/* shirt collar */}
      <path d="M14 58 L26 50 L32 56 L38 50 L50 58 L50 64 L14 64 Z" fill="#1f1f24"/>
      {/* tie */}
      <path d="M30 54 L34 54 L33 64 L31 64 Z" fill="#c2253a"/>
    </FaceBase>
  )
}

function MilicoGlyph() {
  return (
    <FaceBase skin="#d8b483" eyes="#1c2a14">
      {/* military cap */}
      <rect x="16" y="20" width="32" height="6" fill="#3a4a1c"/>
      <rect x="14" y="22" width="36" height="4" fill="#5a6a2c"/>
      <rect x="28" y="22" width="8" height="4" fill="#fff5b8"/>
      <rect x="30" y="23" width="4" height="2" fill="#3a4a1c"/>
      {/* serious mouth */}
      <line x1="28" y1="42" x2="36" y2="42" stroke="#1c2a14" strokeWidth="1.4"/>
      {/* uniform */}
      <path d="M14 56 Q32 50 50 56 L50 64 L14 64 Z" fill="#5a6a2c"/>
      <circle cx="22" cy="58" r="1.2" fill="#f3c44b"/>
      <circle cx="42" cy="58" r="1.2" fill="#f3c44b"/>
    </FaceBase>
  )
}

function TangueroGlyph() {
  return (
    <FaceBase skin="#d4a47a" eyes="#0d0d0d">
      {/* fedora */}
      <ellipse cx="32" cy="24" rx="22" ry="3" fill="#0d0d0d"/>
      <path d="M22 24 Q32 10 42 24 Z" fill="#1a1a1a"/>
      <rect x="22" y="22" width="20" height="2" fill="#3a2210"/>
      {/* slick beard */}
      <path d="M26 44 Q32 50 38 44 L38 48 Q32 52 26 48 Z" fill="#0d0d0d"/>
      {/* mouth */}
      <path d="M28 42 Q32 44 36 42" stroke="#3a1414" strokeWidth="1" fill="none"/>
      {/* shirt + bow tie */}
      <path d="M14 58 Q32 52 50 58 L50 64 L14 64 Z" fill="#0d0d0d"/>
      <path d="M30 56 L26 53 L26 59 L30 56 L34 56 L38 53 L38 59 L34 56 Z" fill="#c2253a"/>
    </FaceBase>
  )
}

function ChinaGlyph() {
  return (
    <FaceBase skin="#f0c8a0" eyes="#3a1414">
      {/* hair with bun */}
      <path d="M16 32 Q16 16 32 16 Q48 16 48 32 L48 38 Q44 32 32 32 Q20 32 16 38 Z"
        fill="#0d0d0d"/>
      <circle cx="32" cy="14" r="4" fill="#0d0d0d"/>
      <circle cx="32" cy="14" r="1.8" fill="#c2253a"/>
      {/* lipstick */}
      <path d="M28 42 Q32 45 36 42" stroke="#c2253a" strokeWidth="1.6" fill="none"/>
      {/* shawl */}
      <path d="M12 56 Q32 48 52 56 L52 64 L12 64 Z" fill="#c2253a"/>
      <path d="M22 58 L42 58" stroke="#fff5b8" strokeWidth="1" opacity="0.7"/>
    </FaceBase>
  )
}

function PibeGlyph() {
  return (
    <FaceBase skin="#e8c39d" eyes="#1f5fc4">
      {/* baseball cap */}
      <path d="M14 26 Q32 14 50 26 L50 30 L14 30 Z" fill="#1f5fc4"/>
      <path d="M14 28 Q32 22 50 28 L52 32 L12 32 Z" fill="#0d2147"/>
      {/* cheeky smile */}
      <path d="M27 42 Q32 46 37 42" stroke="#3a1414" strokeWidth="1.4" fill="none"/>
      {/* hoodie */}
      <path d="M10 56 Q32 48 54 56 L54 64 L10 64 Z" fill="#1f5fc4"/>
      <path d="M28 50 L36 50 L36 56 L28 56 Z" fill="#0d2147"/>
    </FaceBase>
  )
}

function JefaGlyph() {
  return (
    <FaceBase skin="#f0c8a0" eyes="#3a1414">
      {/* sleek hair */}
      <path d="M14 32 Q14 14 32 14 Q50 14 50 32 L46 36 Q44 30 32 30 Q20 30 18 36 Z"
        fill="#1f0d0d"/>
      {/* gold earrings */}
      <circle cx="46" cy="38" r="1.6" fill="#f3c44b"/>
      <circle cx="18" cy="38" r="1.6" fill="#f3c44b"/>
      {/* confident smirk */}
      <path d="M28 42 L36 42 L34 44 L30 44 Z" fill="#7a1740"/>
      {/* power blazer */}
      <path d="M10 58 L26 50 L32 56 L38 50 L54 58 L54 64 L10 64 Z" fill="#0d0d0d"/>
      <rect x="30" y="54" width="4" height="10" fill="#fff5b8"/>
      <circle cx="32" cy="60" r="1.2" fill="#f3c44b"/>
    </FaceBase>
  )
}

function MagoGlyph() {
  return (
    <FaceBase skin="#e6cfb0" eyes="#7d3aa3">
      {/* wizard hat */}
      <path d="M16 28 L32 4 L48 28 Z" fill="#2a0f44" stroke="#7d3aa3" strokeWidth="0.6"/>
      <ellipse cx="32" cy="28" rx="18" ry="2" fill="#7d3aa3"/>
      {/* stars on hat */}
      <text x="32" y="20" textAnchor="middle" fill="#f3c44b" style={{ fontSize: 6 }}>★</text>
      <text x="28" y="14" textAnchor="middle" fill="#fff5b8" style={{ fontSize: 4 }}>✦</text>
      {/* long beard */}
      <path d="M22 42 Q32 60 42 42 L40 56 Q32 62 24 56 Z" fill="#fff" opacity="0.95" stroke="#a78bb0" strokeWidth="0.4"/>
      {/* moustache */}
      <path d="M27 42 Q32 44 37 42 Q34 45 32 45 Q30 45 27 42 Z" fill="#fff" opacity="0.95"/>
      {/* robe */}
      <path d="M12 60 Q32 54 52 60 L52 64 L12 64 Z" fill="#7d3aa3"/>
    </FaceBase>
  )
}

function ReyGlyph() {
  return (
    <FaceBase skin="#f3d9b5" eyes="#0d2147">
      {/* crown */}
      <path d="M16 22 L22 10 L28 20 L32 8 L36 20 L42 10 L48 22 L46 26 L18 26 Z" fill="#f3c44b" stroke="#3a2c02" strokeWidth="0.5"/>
      <circle cx="22" cy="10" r="1.5" fill="#c2253a"/>
      <circle cx="32" cy="8" r="1.8"  fill="#1f7d4e"/>
      <circle cx="42" cy="10" r="1.5" fill="#1f5fc4"/>
      <rect x="18" y="24" width="28" height="2" fill="#7a5806"/>
      {/* royal mouth */}
      <path d="M28 42 Q32 45 36 42" stroke="#3a1414" strokeWidth="1.4" fill="none"/>
      {/* beard */}
      <path d="M24 44 Q32 56 40 44 L40 50 Q32 58 24 50 Z" fill="#dddddd"/>
      {/* ermine collar */}
      <path d="M10 56 Q32 48 54 56 L54 64 L10 64 Z" fill="#fff"/>
      <circle cx="20" cy="60" r="0.8" fill="#3a2c02"/>
      <circle cx="32" cy="62" r="0.8" fill="#3a2c02"/>
      <circle cx="44" cy="60" r="0.8" fill="#3a2c02"/>
    </FaceBase>
  )
}
