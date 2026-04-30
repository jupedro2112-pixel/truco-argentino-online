import { useState } from 'react'
import { useAuth } from '../store/auth.js'
import { useProfile } from '../store/profile.js'
import { useRouter } from '../store/router.js'
import { AVATARS, RARITY_RING } from '../data/avatars.js'
import Avatar from '../components/Avatar.jsx'
import BottomNav from '../components/BottomNav.jsx'

export default function Profile() {
  const user = useAuth(s => s.user)
  const profile = useProfile()
  const navigate = useRouter(s => s.navigate)
  const [tab, setTab] = useState('stats')

  if (!user) { navigate('/sign-in'); return null }

  const winRate = profile.stats.matchesPlayed
    ? Math.round((profile.stats.matchesWon / profile.stats.matchesPlayed) * 100)
    : 0

  const xpNext = profile.level * 250
  const xpPct = Math.min(100, Math.round((profile.xp / xpNext) * 100))

  return (
    <div className="min-h-screen bg-stage pb-24 relative">
      <header className="max-w-2xl mx-auto px-5 pt-6 flex items-center relative z-10">
        <button onClick={() => navigate('/home')} className="glass w-10 h-10 rounded-full grid place-items-center text-white/80">‹</button>
        <h1 className="flex-1 text-center font-display font-extrabold text-2xl">Perfil</h1>
        <button onClick={() => navigate('/settings')} className="glass w-10 h-10 rounded-full grid place-items-center text-white/80">⚙</button>
      </header>

      {/* Hero */}
      <div className="max-w-2xl mx-auto px-5 mt-5 relative z-10">
        <div className="rounded-3xl glass p-5 flex items-center gap-4">
          <Avatar id={profile.avatarId} size={80}/>
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-extrabold text-2xl truncate">{user.username}</h2>
            <p className="text-xs text-white/50 mt-0.5">Nivel {profile.level}</p>
            <div className="mt-2 h-2 bg-bg-line rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-lime-glow to-lime-mute" style={{ width: `${xpPct}%` }} />
            </div>
            <p className="text-[10px] text-white/40 mt-0.5">{profile.xp} / {xpNext} XP</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end text-yellow-300 font-display font-extrabold text-2xl">
              💰 {profile.coins.toLocaleString('es-AR')}
            </div>
            <button onClick={() => navigate('/shop')}
              className="mt-1 text-[10px] uppercase tracking-wider text-lime-glow underline">
              Tienda →
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-5 mt-5 relative z-10">
        <div className="flex gap-2">
          {[
            ['stats',   'Estadísticas'],
            ['avatars', 'Avatares'],
          ].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition ${
                tab === k ? 'bg-lime-glow text-bg' : 'glass text-white/70'
              }`}>{l}</button>
          ))}
        </div>
      </div>

      {tab === 'stats' && (
        <div className="max-w-2xl mx-auto px-5 mt-4 grid grid-cols-2 gap-3 relative z-10">
          <Stat label="Partidas" value={profile.stats.matchesPlayed} icon="🎮" />
          <Stat label="Victorias" value={profile.stats.matchesWon} icon="🏆" />
          <Stat label="Win rate" value={`${winRate}%`} icon="📊" />
          <Stat label="Manos ganadas" value={profile.stats.handsWon} icon="✋" />
          <Stat label="Mayor victoria" value={`${profile.stats.biggestWinPts} pts`} icon="💥" />
          <Stat label="Trucos ganados" value={profile.stats.truckosWon} icon="🃏" />
        </div>
      )}

      {tab === 'avatars' && (
        <div className="max-w-2xl mx-auto px-5 mt-4 relative z-10">
          <div className="grid grid-cols-3 gap-3">
            {AVATARS.map(a => {
              const owned = profile.unlockedAvatars.includes(a.id)
              const active = profile.avatarId === a.id
              return (
                <div key={a.id} className={`glass rounded-2xl p-3 text-center ${active ? 'ring-2 ring-lime-glow' : ''}`}>
                  <div className="grid place-items-center">
                    <Avatar id={a.id} size={64}/>
                  </div>
                  <p className="font-bold text-sm mt-2">{a.name}</p>
                  <p className={`text-[10px] uppercase tracking-wider mt-0.5 ${RARITY_TEXT[a.rarity]}`}>{a.rarity}</p>
                  {owned ? (
                    <button onClick={() => profile.setAvatar(a.id)}
                      disabled={active}
                      className={`mt-2 w-full py-1 rounded-lg text-xs font-bold ${
                        active ? 'bg-lime-glow text-bg' : 'bg-white/10 hover:bg-white/15 text-white'
                      }`}>
                      {active ? 'Activo' : 'Usar'}
                    </button>
                  ) : (
                    <button onClick={() => {
                      if (profile.spendCoins(a.price)) {
                        profile.unlockAvatar(a.id)
                        profile.setAvatar(a.id)
                      }
                    }}
                      disabled={profile.coins < a.price}
                      className="mt-2 w-full py-1 rounded-lg text-xs font-bold bg-yellow-300/20 text-yellow-200 disabled:opacity-40">
                      💰 {a.price}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

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

function Stat({ label, value, icon }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className="text-[10px] uppercase tracking-wider text-white/40">{label}</span>
      </div>
      <p className="font-display font-extrabold text-2xl mt-2 tabular-nums">{value}</p>
    </div>
  )
}
