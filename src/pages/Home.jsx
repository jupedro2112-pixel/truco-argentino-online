import { useAuth } from '../store/auth.js'
import { useRouter } from '../store/router.js'
import BottomNav from '../components/BottomNav.jsx'
import Logo from '../components/Logo.jsx'

export default function Home() {
  const user = useAuth(s => s.user)
  const navigate = useRouter(s => s.navigate)

  if (!user) {
    navigate('/sign-in')
    return null
  }

  return (
    <div className="min-h-screen bg-stage pb-24 relative">
      <div className="max-w-2xl mx-auto px-5 pt-6 relative z-10">
        {/* Top bar */}
        <header className="flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-2">
            <button className="glass w-9 h-9 rounded-full grid place-items-center text-white/70" aria-label="Notificaciones">🔔</button>
            <button className="glass w-9 h-9 rounded-full grid place-items-center text-white/70" aria-label="Ajustes">⚙</button>
          </div>
        </header>

        {/* Profile hero */}
        <div className="mt-6 rounded-3xl overflow-hidden border border-bg-line relative">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background:
                'radial-gradient(circle at 0% 0%, rgba(200,249,100,0.3), transparent 60%), radial-gradient(circle at 100% 100%, rgba(255,61,138,0.18), transparent 60%)',
            }}
          />
          <div className="relative px-5 pt-6 pb-5 flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-lime-glow to-lime-mute grid place-items-center text-bg text-3xl font-extrabold ring-4 ring-bg-soft shadow-glow">
                {(user.username[0] || 'J').toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-lime-glow border-2 border-bg" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wider text-white/50">Hola</p>
              <h2 className="font-display font-extrabold text-2xl truncate">{user.username}</h2>
              <div className="mt-1 flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-white/70">🏅 <b className="text-white">0</b> pts</span>
                <span className="flex items-center gap-1 text-white/70">🎯 <b className="text-white">Nivel 1</b></span>
                <span className="flex items-center gap-1 text-white/70">💰 <b className="text-lime-glow">$0</b></span>
              </div>
            </div>
          </div>

          {!user.verified && (
            <div className="relative mx-3 mb-3 rounded-2xl bg-bg-soft border border-bg-line p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-lime-glow/15 grid place-items-center text-lime-glow font-bold">!</div>
                <div className="flex-1">
                  <h3 className="font-semibold">Cuenta incompleta</h3>
                  <p className="text-sm text-white/65 mt-0.5">
                    Verificá tu identidad para habilitar partidas competitivas y retirar premios.
                  </p>
                </div>
              </div>
              <button className="btn-primary w-full mt-3">✓ Verificar cuenta</button>
            </div>
          )}
        </div>

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
            emoji="👥"
            title="Sala privada"
            subtitle="Con tus amigos"
            onClick={() => navigate('/create-room?private=1')}
          />
        </div>

        {/* Quick modes row */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { id: '1v1', label: '1v1', icon: '⚔' },
            { id: '2v2', label: '2v2', icon: '🤝' },
            { id: '3v3', label: '3v3', icon: '👨‍👩‍👧' },
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
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Tile icon="🛒" label="Tienda" onClick={() => {}} />
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
    <button onClick={onClick} className="glass rounded-2xl px-4 py-3 flex items-center gap-3 hover:border-lime-glow/30 transition">
      <span className="text-2xl">{icon}</span>
      <span className="font-semibold">{label}</span>
    </button>
  )
}
