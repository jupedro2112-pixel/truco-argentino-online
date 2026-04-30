import BottomNav from '../components/BottomNav.jsx'
import { useRouter } from '../store/router.js'

const ROWS = [
  { name: 'pipiripi',   pts: 4227500, prize: 100000 },
  { name: 'nnnn',       pts: 3531600, prize: 80000 },
  { name: 'porqueria',  pts: 2464500, prize: 70000 },
  { name: 'roco',       pts: 2283250, prize: 60000 },
  { name: 'Pelufo',     pts: 2140000, prize: 50000 },
  { name: 'Mrtruco',    pts: 2052500, prize: 40000 },
  { name: 'tumbamora',  pts: 1658250, prize: 30000 },
  { name: 'lucia72',    pts: 1609300, prize: 25000 },
  { name: 'El Firringa',pts: 1477250, prize: 20000 },
  { name: 'nehhan',     pts: 1442250, prize: 15000 },
  { name: 'thiaguilo17',pts: 1427750, prize: null },
  { name: 'Diegote00',  pts: 1400500, prize: null },
  { name: 'Ouuushi',    pts: 1383250, prize: null },
  { name: 'Danielaguero',pts:1281050, prize: null },
  { name: 'edu100',     pts: 1268000, prize: null },
]

function fmt(n) { return n.toLocaleString('es-AR') }

export default function Ranking() {
  const navigate = useRouter(s => s.navigate)
  return (
    <div className="min-h-screen bg-bg pb-24">
      <header className="max-w-2xl mx-auto px-6 pt-6 flex items-center">
        <button onClick={() => navigate('/home')} className="text-white/70 hover:text-white text-2xl">‹</button>
        <h1 className="flex-1 text-center font-semibold">Ranking semanal</h1>
        <div className="w-6" />
      </header>

      <div className="max-w-2xl mx-auto px-6 mt-6 grid grid-cols-2 gap-3">
        <div className="card-surface p-4 text-sm">
          <div className="font-semibold">🏆 Premios</div>
          <ul className="mt-2 space-y-0.5 text-white/80">
            <li>1° ${fmt(500000)}</li>
            <li>2° ${fmt(300000)}</li>
            <li>3° ${fmt(200000)}</li>
          </ul>
        </div>
        <div className="card-surface p-4 text-sm">
          <div className="font-semibold">⏳ Quedan</div>
          <div className="mt-2 grid grid-cols-4 gap-1 text-center">
            {[['03','D'],['05','H'],['29','M'],['36','S']].map(([n,u]) => (
              <div key={u}>
                <div className="font-bold text-lg">{n}</div>
                <div className="text-[10px] text-white/50">{u}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 mt-6">
        <table className="w-full text-sm">
          <thead className="text-white/50 text-xs">
            <tr><th className="py-2 w-10">Pos.</th><th className="text-left">Usuario</th><th>Pts.</th><th>Premio</th></tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.name} className="border-t border-bg-line">
                <td className="py-2 text-white/60 text-center">{String(i + 6).padStart(2, '0')}</td>
                <td className="py-2">
                  <span className="inline-flex items-center gap-2 bg-lime-glow/15 border border-lime-glow/30 rounded-full px-2.5 py-1">
                    <span className="w-5 h-5 rounded-full bg-bg-line" />
                    <span className="font-medium">{r.name}</span>
                  </span>
                </td>
                <td className="py-2 text-center text-white/80">{fmt(r.pts)}</td>
                <td className="py-2 text-center text-white/70">{r.prize ? `$${fmt(r.prize)}` : '-'}</td>
              </tr>
            ))}
            <tr><td colSpan={4} className="pt-4 text-xs text-white/50">Tu puesto</td></tr>
            <tr className="border-t border-bg-line">
              <td className="py-2 text-white/60 text-center">2130</td>
              <td className="py-2">
                <span className="inline-flex items-center gap-2 bg-lime-glow/15 border border-lime-glow/30 rounded-full px-2.5 py-1">
                  <span className="w-5 h-5 rounded-full bg-bg-line" />
                  <span className="font-medium">Yo</span>
                </span>
              </td>
              <td className="py-2 text-center">0</td>
              <td className="py-2 text-center">-</td>
            </tr>
          </tbody>
        </table>
      </div>
      <BottomNav />
    </div>
  )
}
