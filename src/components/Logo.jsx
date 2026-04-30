export default function Logo({ size = 'md', tag = 'h1' }) {
  const Tag = tag
  const cls = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
    xl: 'text-6xl',
  }[size]
  return (
    <Tag className={`font-display font-extrabold tracking-tight leading-none ${cls} flex items-center gap-1.5`}>
      <span className="text-white">TRUCO</span>
      <span aria-hidden className="inline-block rounded-full bg-lime-glow"
        style={{
          width: size === 'xl' ? 18 : size === 'lg' ? 14 : 10,
          height: size === 'xl' ? 18 : size === 'lg' ? 14 : 10,
        }}
      />
      <span className="text-white">AR</span>
    </Tag>
  )
}
