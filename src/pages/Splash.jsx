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
    <div className="min-h-screen grid place-items-center bg-stage relative">
      <div className="text-center relative z-10">
        <div className="animate-pulse">
          <Logo size="xl" />
        </div>
        <div className="mt-6 flex justify-center gap-1">
          {[0,1,2].map(i => (
            <span key={i} className="w-2 h-2 rounded-full bg-lime-glow animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
