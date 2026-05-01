// Brand logotype. Display + accent dot.
export default function Logo({ size = 'md', tag = 'h1' }) {
  const Tag = tag
  const map = {
    xs: { text: 'text-base', dot: 6, gap: 'gap-1' },
    sm: { text: 'text-xl',  dot: 8, gap: 'gap-1' },
    md: { text: 'text-3xl', dot: 10, gap: 'gap-1.5' },
    lg: { text: 'text-5xl', dot: 14, gap: 'gap-2' },
    xl: { text: 'text-6xl md:text-7xl', dot: 20, gap: 'gap-2' },
  }
  const cfg = map[size] || map.md
  return (
    <Tag className={`font-display font-extrabold tracking-tight leading-none ${cfg.text} flex items-center ${cfg.gap}`}>
      <span className="text-ink-100">TRUCO</span>
      <span aria-hidden className="inline-block rounded-full bg-brand-gradient shadow-[0_0_10px_rgba(200,249,100,0.6)]"
        style={{ width: cfg.dot, height: cfg.dot }} />
      <span className="text-ink-100">AR</span>
    </Tag>
  )
}
