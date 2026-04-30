import { useRouter } from '../store/router.js'
import { useAuth } from '../store/auth.js'
import { useProfile } from '../store/profile.js'
import Avatar from './Avatar.jsx'

const items = [
  { path: '/home',     label: 'Inicio',  icon: HomeIcon },
  { path: '/play-now', label: 'Jugar',   icon: PlayIcon },
  { path: '/shop',     label: 'Tienda',  icon: ShopIcon },
  { path: '/ranking',  label: 'Ranking', icon: TrophyIcon },
]

export default function BottomNav() {
  const path = useRouter(s => s.path)
  const navigate = useRouter(s => s.navigate)
  const user = useAuth(s => s.user)
  const avatarId = useProfile(s => s.avatarId)
  if (!user) return null

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 bg-bg-soft/95 backdrop-blur border-t border-bg-line">
      <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-around">
        {items.map(({ path: p, label, icon: Icon }) => {
          const active = path.startsWith(p)
          return (
            <button
              key={p}
              onClick={() => navigate(p)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition ${
                active ? 'text-lime-glow' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          )
        })}
        <button
          onClick={() => navigate('/profile')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 ${path.startsWith('/profile') ? 'text-lime-glow' : 'text-white/60'}`}
        >
          <Avatar id={avatarId} size={26} ring={false} />
          <span className="text-[10px] font-medium">Perfil</span>
        </button>
      </div>
    </nav>
  )
}

function HomeIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M3 11l9-8 9 8v10a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2V11z" strokeLinejoin="round"/>
  </svg>
}
function PlayIcon(props) {
  return <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M7 5v14l12-7L7 5z"/>
  </svg>
}
function ShopIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M5 8h14l-1 11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 8z" strokeLinejoin="round"/>
    <path d="M9 8a3 3 0 0 1 6 0" strokeLinecap="round"/>
  </svg>
}
function TrophyIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M8 4h8v3a4 4 0 1 1-8 0V4zm-4 1h4v3a3 3 0 0 1-3-3V5zm12 0h4v0a3 3 0 0 1-3 3V5zM9 14h6l-1 4h-4l-1-4zM8 21h8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
}
