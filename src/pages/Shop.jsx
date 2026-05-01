import { useProfile } from '../store/profile.js'
import { useRouter } from '../store/router.js'
import { AVATARS } from '../data/avatars.js'
import Avatar from '../components/Avatar.jsx'
import BottomNav from '../components/BottomNav.jsx'
import { play } from '../lib/sounds.js'
import PageHeader from '../components/ui/PageHeader.jsx'
import Icon from '../components/Icon.jsx'
import Button from '../components/ui/Button.jsx'
import Panel from '../components/ui/Panel.jsx'
import CoinBadge from '../components/ui/CoinBadge.jsx'

const COIN_PACKS = [
  { id: 'pack-s', label: 'Mazo chico',   amount: 1000,   tag: 'Demo gratis' },
  { id: 'pack-m', label: 'Mazo mediano', amount: 5000,   tag: 'Demo gratis', popular: true },
  { id: 'pack-l', label: 'Mazo grande',  amount: 20000,  tag: 'Demo gratis' },
]

const RARITY_CHIP = {
  common:    'bg-ink-700 text-ink-300 border border-white/10',
  rare:      'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  epic:      'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30',
  legendary: 'bg-gold-300/20 text-gold-300 border border-gold-300/40 glow-gold',
}

export default function Shop() {
  const profile = useProfile()
  const navigate = useRouter(s => s.navigate)

  return (
    <div className="min-h-screen bg-stage pb-28 relative">
      <PageHeader title="Tienda" back="/home"
        right={<CoinBadge amount={profile.coins} size="sm" />} />

      <div className="max-w-2xl mx-auto px-5 mt-5 relative z-10 space-y-6 animate-fade-up">
        <section>
          <h2 className="section-eyebrow flex items-center gap-2 mb-3">
            <Icon name="coin" size={12}/>
            Monedas
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {COIN_PACKS.map(p => (
              <button key={p.id}
                onClick={() => { profile.addCoins(p.amount); play('coin') }}
                className={`relative overflow-hidden rounded-2xl border p-4 text-center transition ${
                  p.popular
                    ? 'border-gold-300/50 bg-gradient-to-br from-gold-300/15 to-transparent shadow-glow-gold'
                    : 'border-white/10 bg-ink-800 hover:border-white/20'
                }`}>
                {p.popular && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-gold-gradient text-ink-900 text-2xs font-extrabold uppercase tracking-wider">
                    Popular
                  </span>
                )}
                <div className="w-12 h-12 mx-auto rounded-full bg-gold-gradient grid place-items-center text-ink-900 shadow-glow-gold">
                  <Icon name="coin" size={22} stroke={2.4}/>
                </div>
                <p className="font-display font-extrabold text-xl mt-3 tabular-nums">+{p.amount.toLocaleString('es-AR')}</p>
                <p className="text-2xs text-ink-400 mt-0.5">{p.label}</p>
                <p className="mt-2 text-xs font-bold text-lime-glow">{p.tag}</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-eyebrow flex items-center gap-2 mb-3">
            <Icon name="user" size={12}/>
            Avatares
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {AVATARS.filter(a => a.price > 0).map(a => {
              const owned = profile.unlockedAvatars.includes(a.id)
              return (
                <Panel key={a.id} className="p-3 text-center">
                  <div className="grid place-items-center pt-1">
                    <Avatar id={a.id} size={68}/>
                  </div>
                  <p className="font-display font-bold text-sm mt-2.5">{a.name}</p>
                  <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-2xs uppercase tracking-widest font-bold ${RARITY_CHIP[a.rarity]}`}>
                    {a.rarity}
                  </span>
                  {owned ? (
                    <p className="mt-2.5 text-xs text-lime-glow font-bold flex items-center justify-center gap-1">
                      <Icon name="check" size={12}/> Tuyo
                    </p>
                  ) : (
                    <Button variant="gold" size="sm" fullWidth
                      disabled={profile.coins < a.price}
                      onClick={() => {
                        if (profile.spendCoins(a.price)) {
                          profile.unlockAvatar(a.id); play('coin')
                        }
                      }}
                      className="mt-2.5"
                      iconLeft="coin">
                      {a.price.toLocaleString('es-AR')}
                    </Button>
                  )}
                </Panel>
              )
            })}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  )
}
