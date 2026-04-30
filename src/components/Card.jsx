import { useState } from 'react'
import { SUIT_COMPONENT, SUIT_TINT } from './cards/Suits.jsx'
import { FaceFigure } from './cards/FaceFigures.jsx'
import { USE_IMAGE_DECK, CARD_IMAGE_EXT, CARD_BACK_IMAGE } from '../cardConfig.js'

const NUMBER_LABEL = { 10: 'S', 11: 'C', 12: 'R' }

const SIZES = {
  xs: { w: 40, h: 62,  fontN: 9,  suitCorner: 11, suitMid: 28, radius: 6 },
  sm: { w: 56, h: 86,  fontN: 12, suitCorner: 15, suitMid: 40, radius: 8 },
  md: { w: 80, h: 122, fontN: 17, suitCorner: 21, suitMid: 58, radius: 10 },
  lg: { w: 100,h: 154, fontN: 21, suitCorner: 26, suitMid: 74, radius: 12 },
}

export default function Card({
  card, faceDown = false, onClick, selected = false, size = 'md', useImage,
}) {
  const dim = SIZES[size] || SIZES.md
  const tryImage = useImage ?? USE_IMAGE_DECK

  if (faceDown || !card) {
    return <CardBack dim={dim} tryImage={tryImage} />
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative shrink-0 transition transform ${onClick ? 'hover:-translate-y-2 hover:shadow-2xl cursor-pointer' : 'cursor-default'} ${selected ? '-translate-y-3' : ''}`}
      style={{
        width: dim.w, height: dim.h,
        borderRadius: dim.radius,
      }}
    >
      <CardFace card={card} dim={dim} selected={selected} tryImage={tryImage} />
    </button>
  )
}

function CardFace({ card, dim, selected, tryImage }) {
  const tint = SUIT_TINT[card.suit]
  const SuitIcon = SUIT_COMPONENT[card.suit]
  const isFace = card.number >= 10
  const labelN = NUMBER_LABEL[card.number] || card.number
  const [imgFailed, setImgFailed] = useState(false)

  const imgSrc = tryImage && !imgFailed
    ? `/cards/${card.suit}-${card.number}.${CARD_IMAGE_EXT}`
    : null

  if (imgSrc) {
    return (
      <img
        src={imgSrc}
        alt={`${card.number} de ${card.suit}`}
        onError={() => setImgFailed(true)}
        className="w-full h-full object-contain"
        style={{
          borderRadius: dim.radius,
          background: '#fff',
          border: `2px solid ${tint.accent}`,
          boxShadow: selected
            ? `0 0 0 3px #c8f964, 0 14px 28px rgba(0,0,0,0.55)`
            : '0 8px 18px rgba(0,0,0,0.55)',
        }}
      />
    )
  }

  return (
    <span
      className="block w-full h-full relative overflow-hidden"
      style={{
        borderRadius: dim.radius,
        background: `linear-gradient(180deg, #fff 0%, ${tint.bg} 100%)`,
        border: `2px solid ${tint.accent}`,
        boxShadow: selected
          ? `0 0 0 3px #c8f964, 0 14px 28px rgba(0,0,0,0.55)`
          : '0 8px 18px rgba(0,0,0,0.55)',
      }}
    >
      {/* inner frame */}
      <span
        className="absolute pointer-events-none"
        style={{ inset: 4, borderRadius: dim.radius - 4, border: `1px solid ${tint.fg}33` }}
      />
      {/* corners */}
      <span
        className="absolute font-extrabold leading-none"
        style={{
          top: 4, left: 6, fontSize: dim.fontN, color: tint.fg,
          fontFamily: 'Bricolage Grotesque, system-ui, sans-serif',
        }}
      >
        {labelN}
      </span>
      <span style={{ position: 'absolute', top: dim.fontN + 6, left: 4 }}>
        <SuitIcon size={dim.suitCorner} />
      </span>
      <span
        className="absolute font-extrabold leading-none"
        style={{
          bottom: 4, right: 6, fontSize: dim.fontN, color: tint.fg,
          transform: 'rotate(180deg)',
          fontFamily: 'Bricolage Grotesque, system-ui, sans-serif',
        }}
      >
        {labelN}
      </span>
      <span style={{ position: 'absolute', bottom: dim.fontN + 6, right: 4, transform: 'rotate(180deg)' }}>
        <SuitIcon size={dim.suitCorner} />
      </span>
      {/* center artwork */}
      <span className="absolute inset-0 grid place-items-center">
        {isFace ? (
          <span style={{ width: '78%', height: '78%' }}>
            <FaceFigure number={card.number} suit={card.suit} />
          </span>
        ) : (
          <PipLayout number={card.number} suit={card.suit} dim={dim} />
        )}
      </span>
      {/* subtle gloss */}
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(110deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 30%, rgba(0,0,0,0.06) 100%)',
          borderRadius: dim.radius,
        }}
      />
    </span>
  )
}

function CardBack({ dim, tryImage }) {
  const [imgFailed, setImgFailed] = useState(false)
  if (tryImage && CARD_BACK_IMAGE && !imgFailed) {
    return (
      <img
        src={CARD_BACK_IMAGE}
        onError={() => setImgFailed(true)}
        alt="back"
        className="shrink-0 object-cover"
        style={{
          width: dim.w, height: dim.h,
          borderRadius: dim.radius,
          border: '2px solid #fff8e1',
          boxShadow: '0 0 0 1px #5b4204, 0 8px 18px rgba(0,0,0,0.55)',
        }}
      />
    )
  }
  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{
        width: dim.w, height: dim.h,
        borderRadius: dim.radius,
        background:
          'linear-gradient(135deg, #1f4d2b 0%, #15331c 50%, #0a2010 100%)',
        border: '2px solid #fff8e1',
        boxShadow: '0 0 0 1px #5b4204, 0 8px 18px rgba(0,0,0,0.55)',
      }}
    >
      {/* diamond pattern */}
      <svg viewBox="0 0 100 150" className="w-full h-full" preserveAspectRatio="none" aria-hidden>
        <defs>
          <pattern id="diamonds" width="20" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(0)">
            <path d="M10 0 L20 15 L10 30 L0 15 Z" fill="none" stroke="#c8f964" strokeOpacity="0.18" strokeWidth="0.6"/>
            <path d="M10 8 L14 15 L10 22 L6 15 Z" fill="#c8f964" fillOpacity="0.07"/>
          </pattern>
        </defs>
        <rect width="100" height="150" fill="url(#diamonds)"/>
      </svg>
      <div className="absolute inset-1.5 rounded-md border border-yellow-200/30 grid place-items-center">
        <div
          className="text-yellow-200/85 font-extrabold tracking-[0.25em] rotate-[-12deg]"
          style={{ fontSize: dim.w * 0.13, fontFamily: 'Bricolage Grotesque' }}
        >
          TRUCO
        </div>
      </div>
    </div>
  )
}

function PipLayout({ number, suit, dim }) {
  const Suit = SUIT_COMPONENT[suit]
  const sz = dim.suitMid * 0.46
  const big = dim.suitMid * 0.7
  const positions = PIPS[number] || []
  return (
    <span className="relative w-[72%] h-[72%] block">
      {positions.length === 0 ? (
        <span className="absolute inset-0 grid place-items-center">
          <Suit size={big} />
        </span>
      ) : (
        positions.map(([x, y], i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              left: `${x * 100}%`,
              top: `${y * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Suit size={sz} />
          </span>
        ))
      )}
    </span>
  )
}

const PIPS = {
  1: [[0.5, 0.5]],
  2: [[0.5, 0.25], [0.5, 0.75]],
  3: [[0.5, 0.18], [0.5, 0.5], [0.5, 0.82]],
  4: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]],
  5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]],
  6: [[0.25, 0.18], [0.75, 0.18], [0.25, 0.5], [0.75, 0.5], [0.25, 0.82], [0.75, 0.82]],
  7: [[0.25, 0.18], [0.75, 0.18], [0.5, 0.36], [0.25, 0.5], [0.75, 0.5], [0.25, 0.82], [0.75, 0.82]],
}
