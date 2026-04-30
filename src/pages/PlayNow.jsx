import BottomNav from '../components/BottomNav.jsx'
import { useRouter } from '../store/router.js'

const MODES = [
  { id: '1v1', label: '1 vs 1', desc: 'Mano a mano',    icon: '⚔',  accent: 'from-lime-glow/30 to-lime-glow/5' },
  { id: '2v2', label: '2 vs 2', desc: 'En pareja',      icon: '🤝', accent: 'from-accent-pink/25 to-accent-pink/5' },
  { id: '3v3', label: '3 vs 3', desc: 'Equipos de 3',   icon: '👨‍👩‍👧', accent: 'from-blue-400/25 to-blue-400/5' },
]

export default function PlayNow() {
  const navigate = useRouter(s => s.navigate)

  return (
    <div className="min-h-screen bg-stage pb-32 relative">
      <header className="max-w-2xl mx-auto px-5 pt-6 flex items-center relative z-10">
        <button onClick={() => navigate('/home')} className="glass w-10 h-10 rounded-full grid place-items-center text-white/80 hover:text-white">‹</button>
        <h1 className="flex-1 text-center font-display font-extrabold text-2xl">Jugar ahora</h1>
        <div className="w-10" />
      </header>

      <div className="max-w-2xl mx-auto px-5 pt-6 flex flex-col gap-3 relative z-10">
        {MODES.map(m => (
          <button
            key={m.id}
            onClick={() => navigate(`/create-room?mode=${m.id}`)}
            className={`glass relative overflow-hidden rounded-3xl p-5 flex items-center gap-4 text-left hover:border-lime-glow/40 transition`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${m.accent} opacity-80 pointer-events-none`} />
            <div className="relative z-10 w-14 h-14 rounded-2xl glass grid place-items-center text-3xl">{m.icon}</div>
            <div className="relative z-10 flex-1">
              <div className="font-display font-extrabold text-2xl leading-none">{m.label}</div>
              <div className="text-sm text-white/60 mt-1.5">{m.desc}</div>
            </div>
            <span className="relative z-10 w-9 h-9 rounded-full bg-lime-glow text-bg grid place-items-center font-bold">→</span>
          </button>
        ))}

        <div className="mt-6 glass rounded-3xl p-5">
          <h3 className="font-display font-bold text-lg">¿Cómo se juega?</h3>
          <ul className="mt-2 text-sm text-white/70 space-y-1.5">
            <li>· Cada jugador recibe 3 cartas del mazo español.</li>
            <li>· La mano se gana ganando 2 de 3 rondas.</li>
            <li>· Podés cantar Truco, Retruco, Vale 4, Envido o Mazo.</li>
            <li>· Partida a 15 (chico) o a 30 (mala) puntos.</li>
          </ul>
        </div>
      </div>

      <div className="fixed bottom-20 inset-x-0 px-5 z-20">
        <button
          onClick={() => navigate('/create-room?private=1')}
          className="btn-primary mx-auto block w-full max-w-md shine-overlay relative overflow-hidden">
          + Crear sala o torneo
        </button>
      </div>
      <BottomNav />
    </div>
  )
}
