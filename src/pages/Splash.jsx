import { useEffect } from 'react'
import Logo from '../components/Logo.jsx'
import { useRouter } from '../store/router.js'
import { useAuth } from '../store/auth.js'

export default function Splash() {
  const navigate = useRouter(s => s.navigate)
  const user = useAuth(s => s.user)
  useEffect(() => {
    const t = setTimeout(() => navigate(user ? '/home' : '/sign-in'), 1100)
    return () => clearTimeout(t)
  }, [navigate, user])
  return (
    <div className="min-h-screen grid place-items-center bg-bg">
      <div className="animate-pulse">
        <Logo size="xl" />
      </div>
    </div>
  )
}
