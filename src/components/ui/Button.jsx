import Icon from '../Icon.jsx'

// Variants:
// primary | gold | ghost | danger | dark
// Sizes: sm | md | lg
export default function Button({
  variant = 'primary',
  size = 'md',
  iconLeft, iconRight,
  children, className = '',
  loading = false, disabled = false,
  fullWidth = false,
  ...props
}) {
  const base = 'btn-base'
  const variantCls = {
    primary: 'btn-primary',
    gold:    'btn-gold',
    ghost:   'btn-ghost',
    danger:  'btn-danger',
    dark:    'btn-base bg-ink-700 border border-white/5 text-ink-100 hover:bg-ink-600',
  }[variant] || 'btn-primary'

  const sizeCls = {
    sm: 'px-3 py-2 text-xs gap-1.5 rounded-lg',
    md: 'px-5 py-3 text-sm gap-2 rounded-xl',
    lg: 'px-6 py-3.5 text-base gap-2.5 rounded-xl',
  }[size]

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${base} ${variantCls} ${sizeCls} ${fullWidth ? 'w-full' : ''} ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
    >
      {loading ? <Spinner /> : (iconLeft && <Icon name={iconLeft} size={size === 'lg' ? 20 : 16} />)}
      {children && <span>{children}</span>}
      {!loading && iconRight && <Icon name={iconRight} size={size === 'lg' ? 20 : 16} />}
    </button>
  )
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="animate-spin">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25"/>
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
    </svg>
  )
}
