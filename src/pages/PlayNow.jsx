import BottomNav from '../components/BottomNav.jsx'
import { useRouter } from '../store/router.js'

const MODES = [
  { id: '1v1', label: '1 vs 1', desc: 'Mano a mano', emoji: '🃏' },
  { id: '2v2', label: '2 vs 2', desc: 'En pareja',   emoji: '👥' },
  { id: '3v3', label: '3 vs 3', desc: 'Equipos de 3', emoji: '👨‍👩‍👧' },
]

export default function PlayNow() {
  const navigate = useRouter(s => s.navigate)

  return (
    <div className="min-h-screen bg-bg pb-24">
      <header className="max-w-2xl mx-auto px-6 pt-6 flex items-center">
        <button onClick={() => navigate('/home')} className="text-white/70 hover:text-white text-2xl">‹</button>
        <h1 className="flex-1 text-center font-semibold">Jugar ahora</h1>
        <div className="w-6" />
      </header>

      <div className="max-w-2xl mx-auto px-6 pt-6 flex flex-col gap-3">
        {MODES.map(m => (
          <button
            key={m.id}
            onClick={() => navigate(`/create-room?mode=${m.id}`)}
            className="rounded-2xl bg-gradient-to-r from-white/85 to-white/65 text-black p-5 flex items-center gap-4 text-left hover:from-white hover:to-white/85 transition"
          >
            <div className="text-4xl">{m.emoji}</div>
            <div className="flex-1">
              <div className="font-extrabold text-xl leading-none">{m.label}</div>
              <div className="text-sm text-black/60 mt-1">{m.desc}</div>
            </div>
            <span className="w-8 h-8 rounded-full bg-bg text-white grid place-items-center">→</span>
          </button>
        ))}
      </div>

      <div className="fixed bottom-20 inset-x-0 px-6">
        <button
          onClick={() => navigate('/create-room?private=1')}
          className="btn-primary mx-auto block w-full max-w-md">
          Crear una sala o torneo
        </button>
      </div>
      <BottomNav />
    </div>
  )
}
