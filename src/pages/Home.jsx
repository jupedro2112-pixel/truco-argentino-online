import { useAuth } from '../store/auth.js'
import { useRouter } from '../store/router.js'
import BottomNav from '../components/BottomNav.jsx'

export default function Home() {
  const user = useAuth(s => s.user)
  const navigate = useRouter(s => s.navigate)

  if (!user) {
    navigate('/sign-in')
    return null
  }

  return (
    <div className="min-h-screen bg-bg pb-24">
      <div className="max-w-2xl mx-auto px-6 pt-10">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-lime-glow to-lime-mute grid place-items-center text-bg text-3xl font-extrabold ring-4 ring-bg-soft">
            {(user.username[0] || 'J').toUpperCase()}
          </div>
        </div>

        <div className="mt-4 rounded-2xl overflow-hidden border border-bg-line">
          <div className="bg-lime-glow text-bg px-6 py-4 text-center">
            <h2 className="font-bold text-xl">{user.username}</h2>
          </div>
          <div className="bg-bg-soft px-6 py-5">
            {!user.verified ? (
              <>
                <div className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-md bg-lime-glow/20 grid place-items-center text-lime-glow">!</div>
                  <div>
                    <h3 className="font-semibold">Cuenta incompleta</h3>
                    <p className="text-sm text-white/70 mt-0.5">
                      Verificá tu identidad para <b>habilitar partidas competitivas</b>, retirar premios y más.
                    </p>
                  </div>
                </div>
                <button className="btn-primary w-full mt-4">✓ Verificar cuenta</button>
                <p className="text-xs text-white/50 mt-3 text-center">
                  Completá tus datos personales para desbloquear todas las funciones.
                </p>
              </>
            ) : (
              <p className="text-white/70 text-sm text-center">Cuenta verificada ✓</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <ActionCard
            title="Sala privada"
            subtitle="Conectá con tus amigos."
            onClick={() => navigate('/create-room?private=1')}
          />
          <ActionCard
            title="Jugar ahora"
            subtitle="Con jugadores en línea."
            onClick={() => navigate('/play-now')}
          />
        </div>

        <button
          onClick={() => navigate('/ranking')}
          className="block w-full mt-4 rounded-2xl overflow-hidden border border-bg-line bg-[#0d3a26] text-left">
          <div className="px-6 py-5 flex items-center justify-between">
            <div>
              <h3 className="text-white font-extrabold text-2xl">EL RANKING</h3>
              <p className="text-white/60 text-sm mt-1">Top semanal · premios</p>
            </div>
            <div className="text-3xl">🏆</div>
          </div>
        </button>
      </div>
      <BottomNav />
    </div>
  )
}

function ActionCard({ title, subtitle, onClick }) {
  return (
    <button onClick={onClick}
      className="bg-white text-black rounded-2xl p-4 text-left hover:scale-[1.01] transition">
      <div className="flex items-start justify-between">
        <h3 className="font-extrabold text-lg leading-tight">{title}</h3>
        <span className="w-8 h-8 rounded-full bg-accent-pink text-white grid place-items-center">→</span>
      </div>
      <p className="text-xs text-black/60 mt-3">{subtitle}</p>
    </button>
  )
}
