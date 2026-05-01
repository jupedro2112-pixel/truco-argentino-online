// Surface panel with consistent rounded corners + border + shadow.
// Variants:
//   default | raised | glass | gold
export default function Panel({
  variant = 'default',
  as: Tag = 'div',
  className = '',
  children,
  ...props
}) {
  const cls = {
    default: 'panel',
    raised:  'panel-raised',
    glass:   'panel-glass',
    gold:    'rounded-2xl border border-gold-300/30 bg-gradient-to-br from-gold-300/10 via-gold-500/5 to-transparent shadow-panel',
  }[variant] || 'panel'
  return <Tag className={`${cls} ${className}`} {...props}>{children}</Tag>
}
