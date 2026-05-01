import IconButton from './IconButton.jsx'
import { useRouter } from '../../store/router.js'

export default function PageHeader({ title, back = '/home', right }) {
  const navigate = useRouter(s => s.navigate)
  return (
    <header className="max-w-2xl mx-auto px-5 pt-6 flex items-center gap-3 relative z-10">
      <IconButton icon="back" size="md" onClick={() => navigate(back)} />
      <h1 className="flex-1 text-center font-display font-extrabold text-2xl tracking-tight">{title}</h1>
      <div className="min-w-[44px] flex justify-end">{right}</div>
    </header>
  )
}
