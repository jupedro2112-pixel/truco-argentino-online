import Card from '../components/Card.jsx'
import { SUITS, NUMBERS, SUIT_LABEL } from '../game/deck.js'
import { useRouter } from '../store/router.js'
import PageHeader from '../components/ui/PageHeader.jsx'

const SUIT_ACCENT = {
  oro:    'text-gold-300',
  copa:   'text-rose-400',
  espada: 'text-blue-300',
  basto:  'text-emerald-300',
}

export default function Deck() {
  return (
    <div className="min-h-screen bg-stage pb-12 relative">
      <PageHeader title="Mazo" back="/home"/>
      <p className="text-center text-ink-300 text-sm mt-2 px-4">Las 40 cartas del mazo español, palo por palo.</p>

      <div className="max-w-5xl mx-auto px-5 mt-6 space-y-7 relative z-10 animate-fade-up">
        {SUITS.map(suit => (
          <section key={suit}>
            <h2 className={`font-display font-extrabold text-xl mb-3 ${SUIT_ACCENT[suit]}`}>{SUIT_LABEL[suit]}</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {NUMBERS.map(n => (
                <Card key={`${suit}-${n}`} card={{ suit, number: n, id: `${suit}-${n}` }} size="md" />
              ))}
            </div>
          </section>
        ))}
        <section>
          <h2 className="font-display font-extrabold text-xl mb-3 text-ink-200">Dorso</h2>
          <div className="flex justify-center">
            <Card faceDown size="md" />
          </div>
        </section>
      </div>
    </div>
  )
}
