import { useAuth } from '../store/auth.js'
import { useProfile } from '../store/profile.js'
import { useRouter } from '../store/router.js'
import BottomNav from '../components/BottomNav.jsx'
import Logo from '../components/Logo.jsx'
import Avatar from '../components/Avatar.jsx'
import Icon from '../components/Icon.jsx'
import IconButton from '../components/ui/IconButton.jsx'
import CoinBadge from '../components/ui/CoinBadge.jsx'
import Pill from '../components/ui/Pill.jsx'
import Panel from '../components/ui/Panel.jsx'

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
    <div className="min-h-screen bg-stage pb-28 relative">
      <div className="max-w-2xl mx-auto px-5 pt-6 relative z-10 animate-fade-up">
        {/* Top bar */}
        <header className="flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-2">
            <CoinBadge amount={profile.coins} onClick={() => navigate('/shop')} />
            <IconButton icon="bell" size="sm" />
            <IconButton icon="settings" size="sm" onClick={() => navigate('/settings')} />
          </div>
        </header>

        {/* Profile hero */}
        <button
          onClick={() => navigate('/profile')}
          className="mt-5 w-full text-left">
          <Panel className="relative overflow-hidden p-5 flex items-center gap-4">
            <div className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 0% 0%, rgba(200,249,100,0.35), transparent 50%), radial-gradient(circle at 100% 100%, rgba(243, 196, 75, 0.18), transparent 60%)',
              }}
            />
            <div className="relative">
              <Avatar id={profile.avatarId} size={84}/>
              <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gold-gradient grid place-items-center font-display font-extrabold text-ink-900 text-xs ring-2 ring-ink-900">
                {profile.level}
              </span>
            </div>
            <div className="relative flex-1 min-w-0">
              <p className="section-eyebrow">Bienvenido</p>
              <h2 className="font-display font-extrabold text-2xl truncate text-ink-100">{user.username}</h2>
              <div className="mt-2 h-1.5 bg-ink-700 rounded-full overflow-hidden">
                <div className="h-full bg-brand-gradient" style={{ width: `${xpPct}%` }} />
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-2xs text-ink-400 tabular-nums">{profile.xp}/{xpNext} XP</p>
                <Pill tone="brand" icon="bolt">Nv {profile.level}</Pill>
              </div>
            </div>
            <Icon name="arrow" size={20} className="text-ink-300 relative" />
          </Panel>
        </button>

        {/* Hero CTA */}
        <button onClick={() => navigate('/play-now')}
          className="mt-4 w-full text-left rounded-2xl overflow-hidden relative shine-overlay group"
          style={{
            background: 'linear-gradient(135deg, #1bbe6d 0%, #0a4d2d 100%)',
            boxShadow: '0 12px 36px -10px rgba(27, 190, 109, 0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}>
          <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-lime-glow/30 blur-2xl pointer-events-none"/>
          <div className="relative px-6 py-7 flex items-center justify-between">
            <div>
              <p className="text-2xs uppercase tracking-widest font-bold text-lime-glow/90">Empezar</p>
              <h3 className="font-display font-extrabold text-3xl text-ink-100 mt-1 leading-none">Jugar ahora</h3>
              <p className="text-ink-100/70 text-sm mt-1.5">Partida instantánea contra la IA</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-ink-900/30 backdrop-blur grid place-items-center text-ink-100 group-hover:translate-x-1 transition">
              <Icon name="arrow" size={22}/>
            </div>
          </div>
        </button>

        {/* Mode chips */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { id: '1v1', label: '1v1', icon: 'swords' },
            { id: '2v2', label: '2v2', icon: 'users' },
            { id: '3v3', label: '3v3', icon: 'trio' },
          ].map(m => (
            <button key={m.id}
              onClick={() => navigate(`/create-room?mode=${m.id}`)}
              className="panel-raised flex flex-col items-center gap-1 py-3 hover:border-lime-glow/40 transition">
              <Icon name={m.icon} size={22} className="text-lime-glow" />
              <div className="text-sm font-display font-bold tracking-tight">{m.label}</div>
            </button>
          ))}
        </div>

        {/* Online + Friends */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <FeatureCard
            tone="rose"
            label="Online"
            title="Multijugador"
            subtitle="Crear o unirte"
            icon="globe"
            onClick={() => navigate('/lobby')}
          />
          <FeatureCard
            tone="gold"
            label="Privado"
            title="Sala con código"
            subtitle="Con tus amigos"
            icon="users"
            onClick={() => navigate('/create-room?private=1')}
          />
        </div>

        {/* Ranking banner */}
        <button
          onClick={() => navigate('/ranking')}
          className="block w-full mt-3 rounded-2xl overflow-hidden text-left relative"
          style={{
            background: 'linear-gradient(135deg, #0a3621 0%, #0d4d2c 50%, #0a2818 100%)',
            border: '1px solid rgba(243, 196, 75, 0.18)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 12px 32px -10px rgba(0,0,0,0.6)',
          }}>
          <div className="absolute inset-0 opacity-50 pointer-events-none">
            <svg className="absolute right-0 top-0 h-full opacity-80" viewBox="0 0 200 200">
              <defs>
                <radialGradient id="goldGlow" cx="80%" cy="20%" r="60%">
                  <stop offset="0%" stopColor="#f3c44b" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#f3c44b" stopOpacity="0"/>
                </radialGradient>
              </defs>
              <rect width="200" height="200" fill="url(#goldGlow)"/>
            </svg>
          </div>
          <div className="px-5 py-5 flex items-center justify-between relative">
            <div>
              <p className="section-eyebrow text-gold-300/90">Ranking semanal</p>
              <h3 className="font-display font-extrabold text-2xl text-ink-100 mt-0.5">Top 100</h3>
              <p className="text-ink-300 text-xs mt-1 flex items-center gap-1.5">
                <Icon name="coin" size={14} className="text-gold-300"/>
                Premio · $1.000.000
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gold-gradient grid place-items-center text-ink-900 shadow-glow-gold">
              <Icon name="trophy" size={26} stroke={2.4}/>
            </div>
          </div>
        </button>

        {/* Quick links */}
        <div className="mt-3 grid grid-cols-3 gap-3">
          <QuickLink icon="shop"   label="Tienda"  onClick={() => navigate('/shop')} />
          <QuickLink icon="cards"  label="Mazo"    onClick={() => navigate('/deck')} />
          <QuickLink icon="sparkle" label="Recompensas" onClick={() => {}} />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

function FeatureCard({ tone, label, title, subtitle, icon, onClick }) {
  const palette = {
    rose: 'from-rose-500/30 via-rose-700/10 to-transparent border-rose-500/30 text-rose-400',
    gold: 'from-gold-300/25 via-gold-500/10 to-transparent border-gold-300/30 text-gold-300',
  }[tone]
  return (
    <button onClick={onClick}
      className={`relative rounded-2xl overflow-hidden p-4 text-left bg-gradient-to-br ${palette} border hover:border-lime-glow/40 transition`}>
      <div className="absolute -right-2 -bottom-2 opacity-25">
        <Icon name={icon} size={64}/>
      </div>
      <p className="section-eyebrow text-current">{label}</p>
      <h3 className="font-display font-extrabold text-lg leading-tight mt-1 text-ink-100">{title}</h3>
      <p className="text-xs text-ink-300 mt-1">{subtitle}</p>
    </button>
  )
}

function QuickLink({ icon, label, onClick }) {
  return (
    <button onClick={onClick} className="panel-raised flex flex-col items-center gap-1.5 py-3 hover:border-lime-glow/30 transition">
      <Icon name={icon} size={22} className="text-ink-200"/>
      <span className="text-xs font-bold text-ink-200">{label}</span>
    </button>
  )
}
