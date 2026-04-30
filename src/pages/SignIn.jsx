import { useState } from 'react'
import Logo from '../components/Logo.jsx'
import { useRouter } from '../store/router.js'
import { useAuth } from '../store/auth.js'

export default function SignIn() {
  const navigate = useRouter(s => s.navigate)
  const signIn = useAuth(s => s.signIn)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [err, setErr] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) {
      setErr('Completá email y contraseña')
      return
    }
    signIn(email)
    navigate('/home')
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg px-6 py-10">
      <div className="flex-1 max-w-md w-full mx-auto flex flex-col">
        <div className="flex flex-col items-center pt-6">
          <Logo size="lg" />
          <p className="mt-4 text-white/70 text-sm flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-glow inline-block animate-pulse" />
            <span><span className="font-semibold text-white">2.148</span> jugadores en línea</span>
          </p>
        </div>

        <div className="my-8 grid grid-cols-3 gap-3 px-4">
          {[0,1,2].map(i => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-bg-soft border border-bg-line grid place-items-center">
              <div className="text-3xl">{['🤠','😎','🧢'][i]}</div>
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <label className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">✉</span>
            <input
              className="input pl-9"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          <label className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">🔒</span>
            <input
              className="input pl-9 pr-10"
              type={showPwd ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button type="button" onClick={() => setShowPwd(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
              {showPwd ? '🙈' : '👁'}
            </button>
          </label>
          <button type="button"
            className="self-center text-xs text-white/60 hover:text-lime-glow underline">
            ¿Olvidaste tu contraseña?
          </button>
          {err && <p className="text-sm text-accent-pink text-center">{err}</p>}
          <button type="submit" className="btn-primary w-full">Iniciar sesión</button>
          <button type="button" className="btn-ghost w-full" onClick={() => signIn('invitado@google.com') || navigate('/home')}>
            Continuar con Google
          </button>

          <div className="my-2 flex items-center gap-3 text-xs text-white/40">
            <div className="flex-1 h-px bg-bg-line" />
            ¿Sos nuevo?
            <div className="flex-1 h-px bg-bg-line" />
          </div>

          <button
            type="button"
            onClick={() => navigate('/register')}
            className="btn-outline-lime w-full flex flex-col gap-0">
            <span className="font-semibold">Crear cuenta nueva</span>
            <span className="text-[11px] font-normal opacity-80">(Gratis y rápido)</span>
          </button>
        </form>
      </div>
    </div>
  )
}
