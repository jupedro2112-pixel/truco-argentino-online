import { useState } from 'react'
import Logo from '../components/Logo.jsx'
import CardFan from '../components/CardFan.jsx'
import Icon from '../components/Icon.jsx'
import Button from '../components/ui/Button.jsx'
import Pill from '../components/ui/Pill.jsx'
import { useRouter } from '../store/router.js'
import { useAuth } from '../store/auth.js'

export default function SignIn() {
  const navigate = useRouter(s => s.navigate)
  const signIn = useAuth(s => s.signIn)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) {
      setErr('Completá email y contraseña')
      return
    }
    setBusy(true)
    setTimeout(() => {
      signIn(email)
      navigate('/home')
    }, 350)
  }

  return (
    <div className="min-h-screen bg-stage px-5 py-6 flex flex-col">
      <div className="flex-1 max-w-md w-full mx-auto flex flex-col relative z-10 animate-fade-up">

        <div className="flex flex-col items-center pt-2">
          <Logo size="lg" />
          <Pill tone="brand" icon="bolt" className="mt-3">
            <b className="text-ink-100">2.148</b>&nbsp;jugadores en línea
          </Pill>
        </div>

        <div className="my-4">
          <CardFan size="md" />
        </div>

        <form onSubmit={onSubmit} className="panel-glass p-5 flex flex-col gap-3">
          <div>
            <label className="section-eyebrow block mb-1.5">Email</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">
                <Icon name="mail" size={18}/>
              </span>
              <input
                className="input pl-11"
                type="email"
                placeholder="tucorreo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="section-eyebrow block mb-1.5 flex justify-between">
              <span>Contraseña</span>
              <button type="button" className="text-lime-glow hover:underline normal-case tracking-normal text-[10px] font-bold">
                ¿Olvidaste?
              </button>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">
                <Icon name="lock" size={18}/>
              </span>
              <input
                className="input pl-11 pr-11"
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-200">
                <Icon name={showPwd ? 'eyeoff' : 'eye'} size={18}/>
              </button>
            </div>
          </div>

          {err && <p className="text-sm text-rose-400 text-center">{err}</p>}

          <Button type="submit" variant="primary" fullWidth loading={busy} className="mt-1">
            Iniciar sesión
          </Button>
          <Button type="button" variant="ghost" fullWidth iconLeft="google"
            onClick={() => { signIn('invitado@google.com'); navigate('/home') }}>
            Continuar con Google
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-ink-300">¿Sos nuevo?</p>
          <button onClick={() => navigate('/register')}
            className="mt-1 font-display font-bold text-lime-glow hover:underline">
            Crear cuenta gratis →
          </button>
        </div>
      </div>
    </div>
  )
}
