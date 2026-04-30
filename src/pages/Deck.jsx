import Card from '../components/Card.jsx'
import { SUITS, NUMBERS, SUIT_LABEL } from '../game/deck.js'
import { useRouter } from '../store/router.js'

export default function Deck() {
  const navigate = useRouter(s => s.navigate)
  return (
    <div className="min-h-screen bg-stage pb-12 relative">
      <header className="max-w-5xl mx-auto px-5 pt-6 flex items-center relative z-10">
        <button onClick={() => navigate('/home')} className="glass w-10 h-10 rounded-full grid place-items-center text-white/80">‹</button>
        <h1 className="flex-1 text-center font-display font-extrabold text-2xl">Mazo</h1>
        <div className="w-10" />
      </header>

      <p className="text-center text-white/50 text-sm mt-2 px-4">
        Vista previa de las 40 cartas del mazo español.
      </p>

      <div className="max-w-5xl mx-auto px-5 mt-6 space-y-8 relative z-10">
        {SUITS.map(suit => (
          <section key={suit}>
            <h2 className="font-display font-bold text-xl mb-3 text-white/80">{SUIT_LABEL[suit]}</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {NUMBERS.map(n => (
                <Card key={`${suit}-${n}`} card={{ suit, number: n, id: `${suit}-${n}` }} size="md" />
              ))}
            </div>
          </section>
        ))}
        <section>
          <h2 className="font-display font-bold text-xl mb-3 text-white/80">Dorso</h2>
          <div className="flex justify-center">
            <Card faceDown size="md" />
          </div>
        </section>
      </div>
    </div>
  )
}
