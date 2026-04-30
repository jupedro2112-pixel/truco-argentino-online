import { useState } from 'react'
import Logo from '../components/Logo.jsx'
import CardFan from '../components/CardFan.jsx'
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
    <div className="min-h-screen bg-stage px-6 py-8 flex flex-col">
      <div className="flex-1 max-w-md w-full mx-auto flex flex-col relative z-10">
        <div className="flex flex-col items-center pt-2">
          <Logo size="lg" />
          <p className="mt-3 text-sm flex items-center gap-2 glass rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-glow inline-block animate-pulse" />
            <span className="text-white/80"><b className="text-white">2.148</b> jugadores en línea</span>
          </p>
        </div>

        <div className="mt-4 mb-2">
          <CardFan size="md" />
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-3 glass rounded-2xl p-5">
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
          <button type="submit" className="btn-primary relative overflow-hidden shine-overlay w-full">
            Iniciar sesión
          </button>
          <button type="button" className="btn-ghost w-full flex items-center justify-center gap-2"
            onClick={() => { signIn('invitado@google.com'); navigate('/home') }}>
            <GoogleIcon /> Continuar con Google
          </button>

          <div className="my-1 flex items-center gap-3 text-xs text-white/40">
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

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-11.3 8 12 12 0 1 1 7.8-21.1l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7A20 20 0 0 0 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.5 5A20 20 0 0 0 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C41.4 35.6 44 30.2 44 24c0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
  )
}
