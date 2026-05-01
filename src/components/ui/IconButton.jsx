import Icon from '../Icon.jsx'

export default function IconButton({ icon, variant = 'ghost', size = 'md', className = '', ...props }) {
  const sizeCls = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-12 h-12',
  }[size]
  const variantCls = {
    ghost: 'panel-glass text-ink-200 hover:text-ink-100 hover:border-white/15',
    solid: 'bg-ink-700 border border-white/10 text-ink-100 hover:bg-ink-600',
    primary: 'btn-primary !rounded-xl',
  }[variant]
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 22 : 20
  return (
    <button {...props}
      className={`grid place-items-center rounded-xl transition active:scale-95 ${sizeCls} ${variantCls} ${className}`}>
      <Icon name={icon} size={iconSize} />
    </button>
  )
}
