import { useRouter } from '../store/router.js'
import { useAuth } from '../store/auth.js'
import { useProfile } from '../store/profile.js'
import Icon from './Icon.jsx'
import Avatar from './Avatar.jsx'

const items = [
  { path: '/home',     label: 'Inicio',  icon: 'home' },
  { path: '/play-now', label: 'Jugar',   icon: 'play' },
  { path: '/shop',     label: 'Tienda',  icon: 'shop' },
  { path: '/ranking',  label: 'Ranking', icon: 'trophy' },
]

export default function BottomNav() {
  const path = useRouter(s => s.path)
  const navigate = useRouter(s => s.navigate)
  const user = useAuth(s => s.user)
  const avatarId = useProfile(s => s.avatarId)
  if (!user) return null

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 pt-2 pb-3 px-3"
      style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(6,8,10,0.85) 30%, rgba(6,8,10,0.95) 100%)' }}>
      <div className="max-w-md mx-auto panel-glass !rounded-2xl px-2 py-2 flex items-center justify-between">
        {items.map(({ path: p, label, icon }) => {
          const active = path.startsWith(p)
          return (
            <button
              key={p}
              onClick={() => navigate(p)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition ${
                active ? 'bg-lime-glow/12 text-lime-glow' : 'text-ink-300 hover:text-ink-100'
              }`}
            >
              <Icon name={icon} size={22}/>
              <span className="text-[10px] font-bold tracking-wide">{label}</span>
            </button>
          )
        })}
        <button
          onClick={() => navigate('/profile')}
          className={`flex-1 flex flex-col items-center gap-0.5 py-1 rounded-xl ${path.startsWith('/profile') ? 'bg-lime-glow/12 text-lime-glow' : 'text-ink-300'}`}
        >
          <Avatar id={avatarId} size={26} ring={false} />
          <span className="text-[10px] font-bold tracking-wide">Perfil</span>
        </button>
      </div>
    </nav>
  )
}
