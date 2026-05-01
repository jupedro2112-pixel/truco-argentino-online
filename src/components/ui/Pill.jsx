import Icon from '../Icon.jsx'

export default function Pill({ tone = 'mute', icon, children, className = '' }) {
  const cls = {
    brand: 'pill-brand',
    gold:  'pill-gold',
    rose:  'pill-rose',
    mute:  'pill-mute',
  }[tone]
  return (
    <span className={`${cls} ${className}`}>
      {icon && <Icon name={icon} size={12} />}
      {children}
    </span>
  )
}
