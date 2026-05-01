import Icon from '../Icon.jsx'

export default function CoinBadge({ amount, onClick, size = 'md' }) {
  const sizeCls = size === 'sm'
    ? 'px-2.5 py-1 text-xs'
    : 'px-3 py-1.5 text-sm'
  return (
    <button onClick={onClick}
      className={`panel-glass rounded-full flex items-center gap-1.5 font-display font-extrabold tabular-nums text-gold-300 ${sizeCls}`}>
      <span className="w-5 h-5 rounded-full bg-gold-gradient grid place-items-center text-ink-900">
        <Icon name="coin" size={12} stroke={2.4} />
      </span>
      {(amount || 0).toLocaleString('es-AR')}
    </button>
  )
}
