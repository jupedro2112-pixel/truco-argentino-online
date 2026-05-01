import { useProfile } from '../store/profile.js'
import { useAuth } from '../store/auth.js'
import { useRouter } from '../store/router.js'
import { setSoundEnabled, play } from '../lib/sounds.js'
import BottomNav from '../components/BottomNav.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import Icon from '../components/Icon.jsx'
import Button from '../components/ui/Button.jsx'
import Panel from '../components/ui/Panel.jsx'

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
    <div className="min-h-screen bg-stage pb-28 relative">
      <PageHeader title="Ajustes" back="/profile" />

      <div className="max-w-2xl mx-auto px-5 mt-5 space-y-4 relative z-10 animate-fade-up">

        <Section title="Audio" icon="speaker">
          <Toggle label="Sonidos del juego"
            description="Cantos, cartas, victorias"
            checked={profile.settings.sound}
            onChange={() => toggle('sound')} />
          <Toggle label="Música de fondo"
            description="Próximamente"
            checked={profile.settings.music}
            disabled
            onChange={() => {}} />
        </Section>

        <Section title="Otros" icon="bolt">
          <Toggle label="Vibración"
            description="Háptica al tocar"
            checked={profile.settings.haptics}
            onChange={() => toggle('haptics')} />
        </Section>

        <Section title="Cuenta" icon="user">
          <Panel className="px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-2xs text-ink-400 mt-0.5">{auth.user?.email}</p>
            </div>
          </Panel>
          <Button variant="danger" fullWidth iconLeft="logout"
            onClick={() => { auth.signOut(); navigate('/sign-in') }}>
            Cerrar sesión
          </Button>
        </Section>

        <Section title="Datos" icon="settings">
          <Button variant="ghost" fullWidth
            onClick={() => {
              if (confirm('¿Borrar progreso? Se perderán monedas, estadísticas y avatares desbloqueados.')) {
                profile.reset()
              }
            }}>
            Resetear progreso local
          </Button>
        </Section>
      </div>

      <BottomNav />
    </div>
  )
}

function Section({ title, icon, children }) {
  return (
    <div>
      <h2 className="section-eyebrow flex items-center gap-2 mb-2.5">
        <Icon name={icon} size={12}/>
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function Toggle({ label, description, checked, onChange, disabled }) {
  return (
    <button onClick={onChange} disabled={disabled}
      className={`panel w-full flex items-center justify-between px-4 py-3 transition ${disabled ? 'opacity-50' : 'hover:border-white/15'}`}>
      <div className="text-left">
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-2xs text-ink-400 mt-0.5">{description}</p>}
      </div>
      <span className={`relative w-11 h-6 rounded-full transition ${checked ? 'bg-lime-glow' : 'bg-ink-700 border border-white/10'}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </span>
    </button>
  )
}
