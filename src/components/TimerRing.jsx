// Circular countdown ring. Shows seconds left over a colored arc.
// Color shifts green -> yellow -> red as time depletes.

export default function TimerRing({ secondsLeft, total, size = 36, label }) {
  const progress = Math.max(0, Math.min(1, secondsLeft / total))
  const r = 14
  const circumference = 2 * Math.PI * r
  const dash = progress * circumference
  const color =
    progress > 0.5 ? '#c8f964' :
    progress > 0.25 ? '#f3c44b' :
    '#ff3d8a'

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <circle cx="16" cy="16" r={r} fill="none"
          stroke="rgba(255,255,255,0.12)" strokeWidth="3"/>
        <circle cx="16" cy="16" r={r} fill="none"
          stroke={color} strokeWidth="3" strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          transform="rotate(-90 16 16)"
          style={{ transition: 'stroke-dasharray 0.9s linear, stroke 0.4s ease' }}
        />
      </svg>
      <span className="absolute font-display font-extrabold text-[11px] tabular-nums"
        style={{ color }}>{Math.ceil(secondsLeft)}</span>
      {label && <span className="absolute -bottom-4 text-[8px] uppercase tracking-widest text-white/40">{label}</span>}
    </div>
  )
}
