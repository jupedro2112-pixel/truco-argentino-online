// Decorative fan of 3 cards used in landings/hero areas.
import Card from './Card.jsx'

const SAMPLES = [
  { suit: 'espada', number: 1, id: 'espada-1' },
  { suit: 'basto',  number: 1, id: 'basto-1' },
  { suit: 'oro',    number: 7, id: 'oro-7' },
]

export default function CardFan({ size = 'md', cards = SAMPLES }) {
  const angles = [-14, 0, 14]
  const offsets = [-26, 0, 26]
  return (
    <div className="relative w-full grid place-items-center" style={{ height: size === 'lg' ? 200 : 160 }}>
      {cards.map((c, i) => (
        <div
          key={c.id}
          className="absolute float-slow"
          style={{
            transform: `translateX(${offsets[i]}px) rotate(${angles[i]}deg)`,
            ['--rot']: `${angles[i]}deg`,
            zIndex: i === 1 ? 2 : 1,
            animationDelay: `${i * 0.3}s`,
          }}
        >
          <Card card={c} size={size} />
        </div>
      ))}
    </div>
  )
}
