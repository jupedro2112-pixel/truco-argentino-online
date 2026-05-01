import BottomNav from '../components/BottomNav.jsx'
import { useRouter } from '../store/router.js'
import PageHeader from '../components/ui/PageHeader.jsx'
import Icon from '../components/Icon.jsx'
import Button from '../components/ui/Button.jsx'

const MODES = [
  { id: '1v1', label: '1 vs 1', desc: 'Mano a mano. Velocidad pura.', icon: 'swords', accent: 'lime',
    color: 'from-brand-400/40 to-brand-700/5' },
  { id: '2v2', label: '2 vs 2', desc: 'En pareja. Coordinación.',     icon: 'users',  accent: 'rose',
    color: 'from-rose-500/30 to-rose-700/5' },
  { id: '3v3', label: '3 vs 3', desc: 'Equipos de 3. Estrategia.',    icon: 'trio',   accent: 'gold',
    color: 'from-gold-300/30 to-gold-500/5' },
]

export default function PlayNow() {
  const navigate = useRouter(s => s.navigate)

  return (
    <div className="min-h-screen bg-stage pb-32 relative">
      <PageHeader title="Jugar ahora" back="/home"/>

      <div className="max-w-2xl mx-auto px-5 pt-6 flex flex-col gap-3 relative z-10 animate-fade-up">
        {MODES.map(m => (
          <button
            key={m.id}
            onClick={() => navigate(`/create-room?mode=${m.id}`)}
            className={`relative overflow-hidden rounded-2xl p-5 flex items-center gap-4 text-left bg-gradient-to-br ${m.color} border border-white/10 hover:border-lime-glow/40 transition shadow-panel`}>
            <div className="w-16 h-16 rounded-2xl bg-ink-900/60 backdrop-blur grid place-items-center text-lime-glow">
              <Icon name={m.icon} size={30} stroke={2.2}/>
            </div>
            <div className="flex-1">
              <div className="font-display font-extrabold text-2xl leading-none text-ink-100">{m.label}</div>
              <div className="text-sm text-ink-300 mt-1.5">{m.desc}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-lime-glow text-ink-900 grid place-items-center font-bold shadow-glow-brand">
              <Icon name="arrow" size={18} stroke={2.4}/>
            </div>
          </button>
        ))}

        <div className="mt-6 panel p-5">
          <h3 className="font-display font-bold text-base flex items-center gap-2">
            <Icon name="cards" size={18} className="text-lime-glow"/>
            Reglas rápidas
          </h3>
          <ul className="mt-3 text-sm text-ink-300 space-y-1.5">
            <li>· Cada jugador recibe 3 cartas del mazo español de 40.</li>
            <li>· Una mano se gana ganando 2 de 3 rondas.</li>
            <li>· Podés cantar Truco, Retruco, Vale 4 o Envido.</li>
            <li>· Partidas a 15 (chico) o a 30 (mala) puntos.</li>
          </ul>
        </div>
      </div>

      <div className="fixed bottom-24 inset-x-0 px-5 z-20">
        <Button variant="gold" fullWidth iconLeft="plus"
          onClick={() => navigate('/create-room?private=1')}
          className="max-w-md mx-auto !flex">
          Crear sala o torneo
        </Button>
      </div>
      <BottomNav />
    </div>
  )
}
