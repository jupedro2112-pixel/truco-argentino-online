import { SUIT_GLYPH } from '../game/deck.js'

const SUIT_COLOR = {
  oro: 'text-yellow-600',
  copa: 'text-red-600',
  espada: 'text-blue-700',
  basto: 'text-emerald-700',
}

export default function Card({ card, faceDown = false, onClick, selected = false, small = false }) {
  if (faceDown || !card) {
    return (
      <div
        className={`spanish-card back ${small ? 'scale-75' : ''}`}
        style={small ? { width: 50, height: 78 } : undefined}
      />
    )
  }
  const color = SUIT_COLOR[card.suit] || 'text-black'
  const glyph = SUIT_GLYPH[card.suit]
  return (
    <button
      type="button"
      onClick={onClick}
      className={`spanish-card transition transform ${onClick ? 'hover:-translate-y-2 cursor-pointer' : ''} ${selected ? '-translate-y-3 ring-2 ring-lime-glow' : ''} ${small ? 'scale-75' : ''}`}
      style={small ? { width: 50, height: 78 } : undefined}
    >
      <span className={`corner tl ${color}`}>{card.number}</span>
      <span className={`pip ${color}`}>{glyph}</span>
      <span className={`corner br ${color}`}>{card.number}</span>
    </button>
  )
}
