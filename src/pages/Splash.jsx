import { useEffect } from 'react'
import Logo from '../components/Logo.jsx'
import { useRouter } from '../store/router.js'
import { useAuth } from '../store/auth.js'

export default function Splash() {
  const navigate = useRouter(s => s.navigate)
  const user = useAuth(s => s.user)
  useEffect(() => {
    const t = setTimeout(() => navigate(user ? '/home' : '/sign-in'), 1300)
    return () => clearTimeout(t)
  }, [navigate, user])

  return (
    <div className="min-h-screen grid place-items-center bg-stage relative overflow-hidden">
      {/* Concentric rings */}
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <div className="absolute w-[300px] h-[300px] rounded-full border border-lime-glow/20 animate-pulse" />
        <div className="absolute w-[480px] h-[480px] rounded-full border border-lime-glow/10 animate-pulse" style={{ animationDelay: '0.4s' }}/>
        <div className="absolute w-[680px] h-[680px] rounded-full border border-lime-glow/5 animate-pulse" style={{ animationDelay: '0.8s' }}/>
      </div>
      <div className="text-center relative z-10 animate-fade-up">
        <div className="anim-flash-in">
          <Logo size="xl" />
        </div>
        <p className="mt-3 text-[11px] uppercase tracking-[0.4em] text-ink-300">Truco argentino premium</p>
        <div className="mt-8 flex justify-center gap-1.5">
          {[0,1,2].map(i => (
            <span key={i} className="w-2 h-2 rounded-full bg-lime-glow animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
