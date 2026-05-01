import { useState, useMemo } from 'react'
import { useRouter } from '../store/router.js'
import { useAuth } from '../store/auth.js'
import { useMatch } from '../store/match.js'
import BottomNav from '../components/BottomNav.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/Icon.jsx'

export default function CreateRoom() {
  const navigate = useRouter(s => s.navigate)
  const path = useRouter(s => s.path)
  const user = useAuth(s => s.user)
  const start = useMatch(s => s.start)

  const initialMode = useMemo(() => {
    const q = new URLSearchParams(path.split('?')[1] || '')
    return q.get('mode') || '1v1'
  }, [path])

  const [mode, setMode] = useState(initialMode)
  const [pointsTo, setPointsTo] = useState(30)
  const [withFlor, setWithFlor] = useState(false)
  const [name, setName] = useState('Mi sala')

  const startMatch = () => {
    start({ mode, pointsTo, withFlor, you: user })
    navigate('/match')
  }

  return (
    <div className="min-h-screen bg-stage pb-28 relative">
      <PageHeader title="Crear sala" back="/play-now" />

      <div className="max-w-2xl mx-auto px-5 pt-5 space-y-5 relative z-10 animate-fade-up">
        <Section title="Nombre" icon="user">
          <input value={name} onChange={e => setName(e.target.value)} className="input" />
        </Section>

        <Section title="Modo" icon="swords">
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: '1v1', label: '1 vs 1', icon: 'swords' },
              { id: '2v2', label: '2 vs 2', icon: 'users' },
              { id: '3v3', label: '3 vs 3', icon: 'trio' },
            ].map(m => (
              <Choice key={m.id} active={mode===m.id} onClick={() => setMode(m.id)} icon={m.icon} label={m.label} />
            ))}
          </div>
        </Section>

        <Section title="Puntos" icon="trophy">
          <div className="grid grid-cols-2 gap-2">
            {[
              { p: 15, sub: 'Chico' },
              { p: 30, sub: 'Mala' },
            ].map(({ p, sub }) => (
              <Choice key={p} active={pointsTo===p} onClick={() => setPointsTo(p)} label={`A ${p}`} sub={sub} />
            ))}
          </div>
        </Section>

        <Section title="Reglas" icon="settings">
          <button onClick={() => setWithFlor(v => !v)}
            className="panel w-full flex items-center justify-between px-4 py-3 hover:border-white/15 transition">
            <div className="text-left">
              <p className="text-sm font-medium">Con Flor</p>
              <p className="text-2xs text-ink-400 mt-0.5">Permitir cantos cuando 3 cartas son del mismo palo</p>
            </div>
            <span className={`relative w-11 h-6 rounded-full transition ${withFlor ? 'bg-lime-glow' : 'bg-ink-700 border border-white/10'}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${withFlor ? 'left-[22px]' : 'left-0.5'}`} />
            </span>
          </button>
        </Section>

        <Button variant="primary" fullWidth size="lg" onClick={startMatch} iconRight="arrow">
          Empezar partida
        </Button>
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
      {children}
    </div>
  )
}

function Choice({ active, onClick, label, sub, icon }) {
  return (
    <button onClick={onClick}
      className={`rounded-xl py-3 font-display font-bold border transition flex flex-col items-center gap-1 ${
        active
          ? 'bg-lime-glow text-ink-900 border-lime-glow shadow-glow-brand'
          : 'bg-ink-800 text-ink-200 border-white/10 hover:border-white/20'
      }`}>
      {icon && <Icon name={icon} size={18}/>}
      <span>{label}</span>
      {sub && <span className={`text-2xs uppercase tracking-widest ${active ? 'text-ink-900/70' : 'text-ink-400'}`}>{sub}</span>}
    </button>
  )
}
