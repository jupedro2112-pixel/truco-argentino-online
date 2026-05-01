import { useState } from 'react'
import Logo from '../components/Logo.jsx'
import Icon from '../components/Icon.jsx'
import Button from '../components/ui/Button.jsx'
import { useRouter } from '../store/router.js'
import { useAuth } from '../store/auth.js'

export default function Register() {
  const navigate = useRouter(s => s.navigate)
  const signIn = useAuth(s => s.signIn)
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [pwd2, setPwd2] = useState('')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    if (!email) return setErr('Email obligatorio')
    if (pwd.length < 6) return setErr('Mínimo 6 caracteres')
    if (pwd !== pwd2) return setErr('Las contraseñas no coinciden')
    setBusy(true)
    setTimeout(() => {
      signIn(email)
      navigate('/home')
    }, 350)
  }

  return (
    <div className="min-h-screen bg-stage px-5 py-8 flex flex-col">
      <div className="flex-1 max-w-md w-full mx-auto flex flex-col relative z-10 animate-fade-up">
        <div className="flex flex-col items-center pt-2">
          <Logo size="md" />
          <h2 className="mt-6 font-display font-extrabold text-3xl">Creá tu cuenta</h2>
          <p className="text-ink-300 text-sm mt-1">Completá tus datos para empezar</p>
        </div>

        <form onSubmit={onSubmit} className="mt-7 panel-glass p-5 flex flex-col gap-3">
          <div>
            <label className="section-eyebrow block mb-1.5">Email</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"><Icon name="mail" size={18}/></span>
              <input className="input pl-11" type="email" placeholder="tucorreo@ejemplo.com"
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="section-eyebrow block mb-1.5">Contraseña</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"><Icon name="lock" size={18}/></span>
              <input className="input pl-11 pr-11" type={show ? 'text' : 'password'} placeholder="••••••••"
                value={pwd} onChange={e => setPwd(e.target.value)} />
              <button type="button" onClick={() => setShow(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400">
                <Icon name={show ? 'eyeoff' : 'eye'} size={18}/>
              </button>
            </div>
          </div>

          <div>
            <label className="section-eyebrow block mb-1.5">Confirmar</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"><Icon name="lock" size={18}/></span>
              <input className="input pl-11" type={show ? 'text' : 'password'} placeholder="••••••••"
                value={pwd2} onChange={e => setPwd2(e.target.value)} />
            </div>
          </div>

          {err && <p className="text-sm text-rose-400 text-center">{err}</p>}

          <Button type="submit" variant="primary" fullWidth loading={busy} className="mt-1">
            Registrarse
          </Button>
          <Button type="button" variant="ghost" fullWidth iconLeft="google"
            onClick={() => { signIn('invitado@google.com'); navigate('/home') }}>
            Continuar con Google
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-ink-300">¿Ya tenés cuenta?</p>
          <button onClick={() => navigate('/sign-in')}
            className="mt-1 font-display font-bold text-lime-glow hover:underline">
            Iniciar sesión →
          </button>
        </div>
      </div>
    </div>
  )
}
