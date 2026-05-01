import BottomNav from '../components/BottomNav.jsx'
import { useRouter } from '../store/router.js'
import PageHeader from '../components/ui/PageHeader.jsx'
import Icon from '../components/Icon.jsx'
import Panel from '../components/ui/Panel.jsx'

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
    <div className="min-h-screen bg-stage pb-28 relative">
      <PageHeader title="Ranking semanal" back="/home" />

      <div className="max-w-2xl mx-auto px-5 mt-4 relative z-10 animate-fade-up">
        {/* Countdown */}
        <Panel variant="gold" className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gold-gradient grid place-items-center text-ink-900">
            <Icon name="clock" size={22} stroke={2.4}/>
          </div>
          <div className="flex-1">
            <p className="section-eyebrow">Termina en</p>
            <div className="flex gap-2 mt-1">
              {[['03','D'],['05','H'],['29','M'],['36','S']].map(([n, u]) => (
                <div key={u} className="flex flex-col items-center bg-ink-900/40 rounded-lg px-2.5 py-1 min-w-[44px]">
                  <span className="font-display font-extrabold text-lg leading-none tabular-nums">{n}</span>
                  <span className="text-2xs text-ink-400 mt-0.5">{u}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        {/* Podium */}
        <div className="mt-6 grid grid-cols-3 gap-3 items-end">
          <Podium rank={2} entry={TOP3[1]} height="h-32" />
          <Podium rank={1} entry={TOP3[0]} height="h-40" />
          <Podium rank={3} entry={TOP3[2]} height="h-28" />
        </div>

        {/* Table */}
        <div className="mt-6 panel overflow-hidden">
          <div className="px-5 py-2.5 border-b border-white/[0.05] section-eyebrow grid grid-cols-[40px_1fr_80px_100px] gap-2">
            <span>Pos.</span><span>Usuario</span><span className="text-right">Pts.</span><span className="text-right">Premio</span>
          </div>
          {REST.map((r, i) => (
            <div key={r.name}
              className="px-5 py-2.5 border-b border-white/[0.04] last:border-b-0 grid grid-cols-[40px_1fr_80px_100px] gap-2 items-center text-sm hover:bg-ink-700/30">
              <span className="text-ink-400 text-xs tabular-nums">#{String(i + 4).padStart(2, '0')}</span>
              <span className="flex items-center gap-2 min-w-0">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-lime-glow/40 to-lime-glow/10 shrink-0" />
                <span className="font-medium truncate">{r.name}</span>
              </span>
              <span className="text-right text-ink-200 tabular-nums">{fmt(r.pts)}</span>
              <span className="text-right text-ink-300 tabular-nums">{r.prize ? `$${fmt(r.prize)}` : '—'}</span>
            </div>
          ))}
        </div>

        {/* Self */}
        <Panel className="mt-3 px-5 py-3 grid grid-cols-[60px_1fr_80px_100px] gap-2 items-center text-sm border-lime-glow/30">
          <span className="text-lime-glow font-bold text-xs tabular-nums">#2130</span>
          <span className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-lime-glow shrink-0" />
            <span className="font-display font-bold">Vos</span>
          </span>
          <span className="text-right tabular-nums">0</span>
          <span className="text-right text-ink-300">—</span>
        </Panel>
      </div>

      <BottomNav />
    </div>
  )
}

function Podium({ rank, entry, height }) {
  const colors = {
    1: 'from-gold-200 to-gold-500',
    2: 'from-slate-300 to-slate-500',
    3: 'from-amber-700 to-amber-900',
  }[rank]
  const ringColor = {
    1: 'ring-gold-300/60 shadow-glow-gold',
    2: 'ring-slate-300/40',
    3: 'ring-amber-700/40',
  }[rank]
  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl mb-1">
        {rank === 1 ? '👑' : rank === 2 ? '🥈' : '🥉'}
      </div>
      <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-lime-glow/40 to-lime-glow/10 ring-4 ${ringColor}`} />
      <div className="font-display font-bold text-sm mt-2 truncate max-w-[100%]">{entry.name}</div>
      <div className="text-2xs text-ink-400 tabular-nums">{entry.pts.toLocaleString('es-AR')} pts</div>
      <div className={`mt-2 w-full ${height} rounded-t-2xl bg-gradient-to-b ${colors} grid place-items-center shadow-raised`}>
        <div className="text-ink-900 font-display font-extrabold text-3xl">{rank}</div>
      </div>
      <div className="text-xs text-gold-300 font-bold mt-1 tabular-nums">${entry.prize.toLocaleString('es-AR')}</div>
    </div>
  )
}
