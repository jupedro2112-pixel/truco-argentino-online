import { useState, useMemo } from 'react'
import { useRouter } from '../store/router.js'
import { useAuth } from '../store/auth.js'
import { useMatch } from '../store/match.js'
import BottomNav from '../components/BottomNav.jsx'

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
    <div className="min-h-screen bg-bg pb-24">
      <header className="max-w-2xl mx-auto px-6 pt-6 flex items-center">
        <button onClick={() => navigate('/play-now')} className="text-white/70 hover:text-white text-2xl">‹</button>
        <h1 className="flex-1 text-center font-semibold">Crear sala</h1>
        <div className="w-6" />
      </header>

      <div className="max-w-2xl mx-auto px-6 pt-6 space-y-5">
        <Section title="Nombre">
          <input value={name} onChange={e => setName(e.target.value)} className="input" />
        </Section>

        <Section title="Modo">
          <div className="grid grid-cols-3 gap-2">
            {['1v1','2v2','3v3'].map(m => (
              <Choice key={m} active={mode===m} onClick={() => setMode(m)} label={m} />
            ))}
          </div>
        </Section>

        <Section title="Puntos">
          <div className="grid grid-cols-2 gap-2">
            {[15, 30].map(p => (
              <Choice key={p} active={pointsTo===p} onClick={() => setPointsTo(p)} label={`A ${p}`} />
            ))}
          </div>
        </Section>

        <Section title="Reglas">
          <label className="flex items-center justify-between bg-bg-soft border border-bg-line rounded-xl px-4 py-3">
            <div>
              <div className="font-medium">Con Flor</div>
              <div className="text-xs text-white/50">Permitir cantos de flor cuando 3 cartas son del mismo palo.</div>
            </div>
            <input type="checkbox" checked={withFlor} onChange={e => setWithFlor(e.target.checked)}
              className="w-5 h-5 accent-lime-glow" />
          </label>
        </Section>

        <button onClick={startMatch} className="btn-primary w-full">
          Empezar partida
        </button>
      </div>
      <BottomNav />
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-white/50 mb-2">{title}</div>
      {children}
    </div>
  )
}

function Choice({ active, onClick, label }) {
  return (
    <button onClick={onClick}
      className={`rounded-xl py-3 font-semibold border transition ${
        active
          ? 'bg-lime-glow text-bg border-lime-glow shadow-glow'
          : 'bg-bg-soft text-white/80 border-bg-line hover:border-lime-glow/40'
      }`}>{label}</button>
  )
}
