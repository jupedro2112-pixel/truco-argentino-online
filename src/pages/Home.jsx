import { useAuth } from '../store/auth.js'
import { useProfile } from '../store/profile.js'
import { useRouter } from '../store/router.js'
import BottomNav from '../components/BottomNav.jsx'
import Logo from '../components/Logo.jsx'
import Avatar from '../components/Avatar.jsx'

export default function Home() {
  const user = useAuth(s => s.user)
  const profile = useProfile()
  const navigate = useRouter(s => s.navigate)

  if (!user) {
    navigate('/sign-in')
    return null
  }

  const xpNext = profile.level * 250
  const xpPct = Math.min(100, Math.round((profile.xp / xpNext) * 100))

  return (
    <div className="min-h-screen bg-stage pb-24 relative">
      <div className="max-w-2xl mx-auto px-5 pt-6 relative z-10">
        {/* Top bar */}
        <header className="flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/shop')}
              className="glass rounded-full px-3 py-1.5 text-yellow-300 font-display font-extrabold flex items-center gap-1 text-sm">
              💰 {profile.coins.toLocaleString('es-AR')}
            </button>
            <button onClick={() => navigate('/settings')}
              className="glass w-9 h-9 rounded-full grid place-items-center text-white/70" aria-label="Ajustes">⚙</button>
          </div>
        </header>

        {/* Profile hero */}
        <button
          onClick={() => navigate('/profile')}
          className="mt-6 w-full rounded-3xl overflow-hidden border border-bg-line relative text-left">
          <div className="absolute inset-0 opacity-60"
            style={{
              background:
                'radial-gradient(circle at 0% 0%, rgba(200,249,100,0.3), transparent 60%), radial-gradient(circle at 100% 100%, rgba(255,61,138,0.18), transparent 60%)',
            }}
          />
          <div className="relative px-5 pt-5 pb-4 flex items-center gap-4">
            <Avatar id={profile.avatarId} size={80}/>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wider text-white/50">Hola</p>
              <h2 className="font-display font-extrabold text-2xl truncate">{user.username}</h2>
              <div className="mt-2 h-2 bg-bg-line rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-lime-glow to-lime-mute" style={{ width: `${xpPct}%` }} />
              </div>
              <p className="text-[10px] text-white/40 mt-0.5">Nv {profile.level} · {profile.xp}/{xpNext} XP</p>
            </div>
          </div>
        </button>

        {/* Main play actions */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <ActionCard
            color="lime"
            emoji="🃏"
            title="Jugar ahora"
            subtitle="Partida instantánea"
            onClick={() => navigate('/play-now')}
          />
          <ActionCard
            color="pink"
            emoji="🌐"
            title="Online"
            subtitle="Crear o unirte"
            onClick={() => navigate('/lobby')}
          />
        </div>

        {/* Quick modes row */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { id: '1v1', label: '1v1', icon: '⚔' },
            { id: '2v2', label: '2v2', icon: '🤝' },
            { id: '3v3', label: '3v3', icon: '👥' },
          ].map(m => (
            <button key={m.id}
              onClick={() => navigate(`/create-room?mode=${m.id}`)}
              className="glass rounded-2xl py-3 px-2 text-center hover:border-lime-glow/40 hover:bg-bg-soft transition">
              <div className="text-xl">{m.icon}</div>
              <div className="text-sm font-bold mt-0.5">{m.label}</div>
            </button>
          ))}
        </div>

        {/* Ranking banner */}
        <button
          onClick={() => navigate('/ranking')}
          className="block w-full mt-4 rounded-3xl overflow-hidden border border-emerald-700/40 text-left relative shine-overlay"
          style={{
            background: 'linear-gradient(135deg, #0d3a26 0%, #134d2f 50%, #0d3a26 100%)',
          }}
        >
          <div className="px-5 py-5 flex items-center justify-between relative z-10">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-lime-glow/80 font-bold">Ranking semanal</p>
              <h3 className="text-white font-display font-extrabold text-3xl mt-0.5">Top 100</h3>
              <p className="text-white/60 text-xs mt-1">Premio acumulado · $1.000.000</p>
            </div>
            <div className="text-5xl">🏆</div>
          </div>
        </button>

        {/* Secondary tiles */}
        <div className="mt-3 grid grid-cols-3 gap-3">
          <Tile icon="🛒" label="Tienda" onClick={() => navigate('/shop')} />
          <Tile icon="🃏" label="Mazo" onClick={() => navigate('/deck')} />
          <Tile icon="🎁" label="Recompensas" onClick={() => {}} />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

function ActionCard({ color, emoji, title, subtitle, onClick }) {
  const palette = {
    lime: 'from-lime-glow to-lime-mute text-bg',
    pink: 'from-accent-pink to-rose-700 text-white',
  }[color]
  return (
    <button
      onClick={onClick}
      className={`relative bg-gradient-to-br ${palette} rounded-3xl p-4 text-left overflow-hidden hover:scale-[1.02] transition shadow-lg`}
    >
      <div className="absolute -right-3 -bottom-3 text-6xl opacity-30 select-none">{emoji}</div>
      <h3 className="font-display font-extrabold text-xl leading-tight">{title}</h3>
      <p className="text-xs opacity-80 mt-1">{subtitle}</p>
      <span className="absolute top-3 right-3 w-7 h-7 rounded-full bg-bg/30 grid place-items-center backdrop-blur">→</span>
    </button>
  )
}

function Tile({ icon, label, onClick }) {
  return (
    <button onClick={onClick} className="glass rounded-2xl px-3 py-3 flex flex-col items-center gap-1 hover:border-lime-glow/30 transition">
      <span className="text-2xl">{icon}</span>
      <span className="font-semibold text-sm">{label}</span>
    </button>
  )
}
