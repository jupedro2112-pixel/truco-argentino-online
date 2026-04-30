// Animated banner shown when something notable happens during a hand.

export default function EventOverlay({ kind, title, subtitle, team }) {
  if (!kind) return null
  const teamColor =
    team === 0 ? 'lime' :
    team === 1 ? 'pink' : 'gold'
  const ringClass =
    teamColor === 'lime' ? 'border-lime-glow/60 shadow-glow' :
    teamColor === 'pink' ? 'border-accent-pink/70 shadow-[0_0_28px_rgba(255,61,138,0.45)]' :
    'border-yellow-400/60 shadow-[0_0_28px_rgba(243,196,75,0.4)]'
  const accent =
    teamColor === 'lime' ? 'text-lime-glow' :
    teamColor === 'pink' ? 'text-accent-pink' :
    'text-yellow-300'

  return (
    <div className="absolute inset-0 z-30 grid place-items-center pointer-events-none">
      <div className={`anim-banner-pop glass border-2 ${ringClass} rounded-3xl px-10 py-6 text-center min-w-[260px]`}>
        {kind === 'call' && (
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/50">Canto</p>
        )}
        {kind === 'round' && (
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/50">Ronda</p>
        )}
        {kind === 'hand' && (
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/50">Mano</p>
        )}
        <h2 className={`font-display font-extrabold leading-none mt-1 ${accent} ${kind === 'call' ? 'text-5xl' : 'text-3xl'}`}>
          {title}
        </h2>
        {subtitle && <p className="text-white/70 text-sm mt-2">{subtitle}</p>}
      </div>
    </div>
  )
}
