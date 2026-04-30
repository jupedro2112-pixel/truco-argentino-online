import BottomNav from '../components/BottomNav.jsx'
import { useRouter } from '../store/router.js'

const TOP3 = [
  { name: 'pipiripi',  pts: 4227500, prize: 500000 },
  { name: 'nnnn',      pts: 3531600, prize: 300000 },
  { name: 'porqueria', pts: 2464500, prize: 200000 },
]

const REST = [
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
]

const fmt = (n) => n.toLocaleString('es-AR')

export default function Ranking() {
  const navigate = useRouter(s => s.navigate)
  return (
    <div className="min-h-screen bg-stage pb-24 relative">
      <header className="max-w-2xl mx-auto px-5 pt-6 flex items-center relative z-10">
        <button onClick={() => navigate('/home')} className="glass w-10 h-10 rounded-full grid place-items-center text-white/80">‹</button>
        <h1 className="flex-1 text-center font-display font-extrabold text-2xl">Ranking semanal</h1>
        <div className="w-10" />
      </header>

      {/* Countdown banner */}
      <div className="max-w-2xl mx-auto px-5 mt-5 relative z-10">
        <div className="glass rounded-3xl p-4 flex items-center gap-4">
          <div className="text-3xl">⏳</div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-widest text-lime-glow/80 font-bold">Termina en</p>
            <div className="flex gap-2 mt-1">
              {[['03','D'],['05','H'],['29','M'],['36','S']].map(([n, u]) => (
                <div key={u} className="flex flex-col items-center bg-bg/60 rounded-lg px-2 py-1 min-w-[42px]">
                  <span className="font-display font-extrabold text-lg leading-none">{n}</span>
                  <span className="text-[9px] text-white/50 mt-0.5">{u}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Podium */}
      <div className="max-w-2xl mx-auto px-5 mt-6 relative z-10">
        <div className="grid grid-cols-3 gap-3 items-end">
          <Podium rank={2} entry={TOP3[1]} height="h-32" badge="🥈" />
          <Podium rank={1} entry={TOP3[0]} height="h-40" badge="🥇" />
          <Podium rank={3} entry={TOP3[2]} height="h-28" badge="🥉" />
        </div>
      </div>

      {/* Table */}
      <div className="max-w-2xl mx-auto px-5 mt-6 relative z-10">
        <div className="glass rounded-3xl overflow-hidden">
          <div className="px-5 py-3 border-b border-bg-line text-xs text-white/50 uppercase tracking-wider grid grid-cols-[40px_1fr_80px_100px] gap-2">
            <span>Pos.</span><span>Usuario</span><span className="text-right">Pts.</span><span className="text-right">Premio</span>
          </div>
          {REST.map((r, i) => (
            <div key={r.name}
              className="px-5 py-2.5 border-b border-bg-line last:border-b-0 grid grid-cols-[40px_1fr_80px_100px] gap-2 items-center text-sm hover:bg-bg-soft/50">
              <span className="text-white/60 text-xs">{String(i + 4).padStart(2, '0')}</span>
              <span className="flex items-center gap-2 min-w-0">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-lime-glow/40 to-lime-glow/10 shrink-0" />
                <span className="font-medium truncate">{r.name}</span>
              </span>
              <span className="text-right text-white/80">{fmt(r.pts)}</span>
              <span className="text-right text-white/70">{r.prize ? `$${fmt(r.prize)}` : '—'}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 glass rounded-3xl px-5 py-3 grid grid-cols-[40px_1fr_80px_100px] gap-2 items-center text-sm border-lime-glow/30">
          <span className="text-lime-glow font-bold text-xs">2130</span>
          <span className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-lime-glow shrink-0" />
            <span className="font-semibold">Yo</span>
          </span>
          <span className="text-right">0</span>
          <span className="text-right">—</span>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

function Podium({ rank, entry, height, badge }) {
  const colors = {
    1: 'from-yellow-400 to-amber-600',
    2: 'from-slate-300 to-slate-500',
    3: 'from-amber-700 to-amber-900',
  }[rank]
  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl mb-1">{badge}</div>
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-lime-glow/40 to-lime-glow/10 ring-4 ring-bg-soft" />
      <div className="font-bold text-sm mt-1 truncate max-w-[100%]">{entry.name}</div>
      <div className="text-[10px] text-white/50">{fmt(entry.pts)} pts</div>
      <div className={`mt-2 w-full ${height} rounded-t-2xl bg-gradient-to-b ${colors} grid place-items-center`}>
        <div className="text-bg font-display font-extrabold text-3xl">{rank}</div>
      </div>
      <div className="text-xs text-lime-glow font-bold mt-1">${fmt(entry.prize)}</div>
    </div>
  )
}
