import { useProfile } from '../store/profile.js'
import { useAuth } from '../store/auth.js'
import { useRouter } from '../store/router.js'
import { setSoundEnabled, play } from '../lib/sounds.js'
import BottomNav from '../components/BottomNav.jsx'

export default function Settings() {
  const profile = useProfile()
  const auth = useAuth()
  const navigate = useRouter(s => s.navigate)

  const toggle = (key) => {
    profile.toggleSetting(key)
    if (key === 'sound') {
      setSoundEnabled(!profile.settings.sound)
      if (!profile.settings.sound) play('click')
    }
  }

  return (
    <div className="min-h-screen bg-stage pb-24 relative">
      <header className="max-w-2xl mx-auto px-5 pt-6 flex items-center relative z-10">
        <button onClick={() => navigate('/profile')} className="glass w-10 h-10 rounded-full grid place-items-center text-white/80">‹</button>
        <h1 className="flex-1 text-center font-display font-extrabold text-2xl">Ajustes</h1>
        <div className="w-10" />
      </header>

      <div className="max-w-2xl mx-auto px-5 mt-6 space-y-3 relative z-10">
        <Section title="Audio">
          <Toggle label="Sonidos del juego" checked={profile.settings.sound} onChange={() => toggle('sound')} />
          <Toggle label="Música de fondo (próximamente)" checked={profile.settings.music} disabled onChange={() => {}} />
        </Section>

        <Section title="Vibración">
          <Toggle label="Háptica al tocar" checked={profile.settings.haptics} onChange={() => toggle('haptics')} />
        </Section>

        <Section title="Cuenta">
          <div className="flex items-center justify-between bg-bg-soft rounded-xl px-4 py-3">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-xs text-white/50">{auth.user?.email}</p>
            </div>
          </div>
          <button onClick={() => { auth.signOut(); navigate('/sign-in') }}
            className="w-full py-3 rounded-xl bg-accent-pink/20 text-accent-pink border border-accent-pink/30 font-bold">
            Cerrar sesión
          </button>
        </Section>

        <Section title="Datos">
          <button onClick={() => {
            if (confirm('¿Borrar progreso? Se perderán monedas, estadísticas y avatares desbloqueados.')) {
              profile.reset()
            }
          }}
            className="w-full py-3 rounded-xl bg-white/5 text-white/70 hover:text-white border border-white/10 text-sm">
            Resetear progreso local
          </button>
        </Section>
      </div>

      <BottomNav />
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-xs uppercase tracking-widest text-white/50 mb-2">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function Toggle({ label, checked, onChange, disabled }) {
  return (
    <button onClick={onChange} disabled={disabled}
      className={`w-full flex items-center justify-between bg-bg-soft border border-bg-line rounded-xl px-4 py-3 transition ${disabled ? 'opacity-50' : 'hover:border-lime-glow/30'}`}>
      <span className="text-sm font-medium">{label}</span>
      <span className={`relative w-10 h-6 rounded-full transition ${checked ? 'bg-lime-glow' : 'bg-bg-line'}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${checked ? 'left-[18px]' : 'left-0.5'}`} />
      </span>
    </button>
  )
}
