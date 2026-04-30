import { useProfile } from '../store/profile.js'
import { useRouter } from '../store/router.js'
import { AVATARS, RARITY_RING } from '../data/avatars.js'
import Avatar from '../components/Avatar.jsx'
import BottomNav from '../components/BottomNav.jsx'
import { play } from '../lib/sounds.js'

const COIN_PACKS = [
  { id: 'pack-s', label: 'Mazo chico', amount: 1000,   note: 'Demo gratis',     free: true  },
  { id: 'pack-m', label: 'Mazo mediano', amount: 5000, note: 'Demo gratis',     free: true  },
  { id: 'pack-l', label: 'Mazo grande', amount: 20000, note: 'Demo gratis',     free: true  },
]

export default function Shop() {
  const profile = useProfile()
  const navigate = useRouter(s => s.navigate)

  return (
    <div className="min-h-screen bg-stage pb-24 relative">
      <header className="max-w-2xl mx-auto px-5 pt-6 flex items-center relative z-10">
        <button onClick={() => navigate('/home')} className="glass w-10 h-10 rounded-full grid place-items-center text-white/80">‹</button>
        <h1 className="flex-1 text-center font-display font-extrabold text-2xl">Tienda</h1>
        <div className="glass rounded-full px-3 py-1 text-yellow-300 font-display font-extrabold flex items-center gap-1 text-sm">
          💰 {profile.coins.toLocaleString('es-AR')}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-5 mt-5 relative z-10">
        <h2 className="text-xs uppercase tracking-widest text-white/50 mb-2">Monedas</h2>
        <div className="grid grid-cols-3 gap-3">
          {COIN_PACKS.map(p => (
            <button key={p.id} onClick={() => { profile.addCoins(p.amount); play('coin') }}
              className="glass rounded-2xl p-4 text-center hover:border-yellow-300/40 transition">
              <div className="text-3xl">💰</div>
              <p className="font-extrabold text-lg mt-1">+{p.amount.toLocaleString('es-AR')}</p>
              <p className="text-[10px] text-white/50 mt-0.5">{p.label}</p>
              <p className="mt-2 text-xs font-bold text-lime-glow">{p.note}</p>
            </button>
          ))}
        </div>

        <h2 className="text-xs uppercase tracking-widest text-white/50 mb-2 mt-6">Avatares</h2>
        <div className="grid grid-cols-3 gap-3">
          {AVATARS.filter(a => a.price > 0).map(a => {
            const owned = profile.unlockedAvatars.includes(a.id)
            const canBuy = !owned && profile.coins >= a.price
            return (
              <div key={a.id} className="glass rounded-2xl p-3 text-center">
                <div className="grid place-items-center">
                  <Avatar id={a.id} size={64}/>
                </div>
                <p className="font-bold text-sm mt-2">{a.name}</p>
                <p className={`text-[10px] uppercase tracking-wider mt-0.5 ${RARITY_TEXT[a.rarity]}`}>{a.rarity}</p>
                {owned ? (
                  <p className="mt-2 text-xs text-lime-glow font-bold">✓ Tuyo</p>
                ) : (
                  <button onClick={() => {
                    if (profile.spendCoins(a.price)) {
                      profile.unlockAvatar(a.id)
                      play('coin')
                    }
                  }}
                    disabled={!canBuy}
                    className="mt-2 w-full py-1 rounded-lg text-xs font-bold bg-yellow-300/20 text-yellow-200 disabled:opacity-40">
                    💰 {a.price.toLocaleString('es-AR')}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

const RARITY_TEXT = {
  common:    'text-white/40',
  rare:      'text-blue-300',
  epic:      'text-fuchsia-300',
  legendary: 'text-yellow-300',
}
