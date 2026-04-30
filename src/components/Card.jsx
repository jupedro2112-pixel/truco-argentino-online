import { SUIT_COMPONENT, SUIT_TINT } from './cards/Suits.jsx'
import { FaceFigure } from './cards/FaceFigures.jsx'

const NUMBER_LABEL = { 10: 'S', 11: 'C', 12: 'R' }

export default function Card({
  card, faceDown = false, onClick, selected = false,
  size = 'md',          // 'sm' | 'md' | 'lg'
}) {
  const dim = {
    sm: { w: 50, h: 78,  fontN: 11, suitCorner: 13, suitMid: 36 },
    md: { w: 78, h: 118, fontN: 16, suitCorner: 20, suitMid: 56 },
    lg: { w: 96, h: 148, fontN: 20, suitCorner: 24, suitMid: 72 },
  }[size]

  if (faceDown || !card) {
    return (
      <div
        className="relative rounded-xl shrink-0"
        style={{
          width: dim.w, height: dim.h,
          background:
            'repeating-linear-gradient(45deg, #1f4d2b 0 8px, #15331c 8px 16px)',
          border: '2px solid #fff8e1',
          boxShadow: '0 0 0 1px #5b4204, 0 6px 14px rgba(0,0,0,0.45)',
        }}
      >
        <div className="absolute inset-1.5 rounded-md border border-yellow-200/40 grid place-items-center">
          <div className="text-yellow-200/80 text-xs font-extrabold tracking-widest rotate-[-10deg]">
            TRUCO
          </div>
        </div>
      </div>
    )
  }

  const tint = SUIT_TINT[card.suit]
  const SuitIcon = SUIT_COMPONENT[card.suit]
  const isFace = card.number >= 10
  const labelN = NUMBER_LABEL[card.number] || card.number

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-xl shrink-0 transition transform ${onClick ? 'hover:-translate-y-2 cursor-pointer' : 'cursor-default'} ${selected ? '-translate-y-3' : ''}`}
      style={{
        width: dim.w, height: dim.h,
        background: `linear-gradient(180deg, #fff 0%, ${tint.bg} 100%)`,
        border: `2px solid ${tint.accent}`,
        boxShadow: selected
          ? `0 0 0 3px #c8f964, 0 12px 24px rgba(0,0,0,0.5)`
          : '0 6px 14px rgba(0,0,0,0.45)',
      }}
    >
      {/* inner frame */}
      <span
        className="absolute inset-1 rounded-md pointer-events-none"
        style={{ border: `1px solid ${tint.fg}33` }}
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
    </button>
  )
}

function PipLayout({ number, suit, dim }) {
  const Suit = SUIT_COMPONENT[suit]
  const sz = dim.suitMid * 0.46
  const big = dim.suitMid * 0.7
  // Position pips like a French/Spanish deck pattern
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
