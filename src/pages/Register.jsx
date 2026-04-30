import { useState } from 'react'
import Logo from '../components/Logo.jsx'
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

  const onSubmit = (e) => {
    e.preventDefault()
    if (!email) return setErr('Email obligatorio')
    if (pwd.length < 6) return setErr('Contraseña: mínimo 6 caracteres')
    if (pwd !== pwd2) return setErr('Las contraseñas no coinciden')
    signIn(email)
    navigate('/home')
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg px-6 py-10">
      <div className="flex-1 max-w-md w-full mx-auto flex flex-col">
        <div className="flex flex-col items-center pt-2">
          <Logo size="md" />
          <h2 className="mt-6 text-2xl font-semibold">Creá tu cuenta</h2>
          <p className="text-white/60 text-sm mt-1">Completá tus datos para empezar a jugar</p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3">
          <label className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">✉</span>
            <input className="input pl-9" type="email" placeholder="Email"
              value={email} onChange={e => setEmail(e.target.value)} />
          </label>
          <label className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">🔒</span>
            <input className="input pl-9 pr-10" type={show ? 'text' : 'password'} placeholder="Contraseña"
              value={pwd} onChange={e => setPwd(e.target.value)} />
            <button type="button" onClick={() => setShow(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">{show ? '🙈' : '👁'}</button>
          </label>
          <label className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">🔒</span>
            <input className="input pl-9 pr-10" type={show ? 'text' : 'password'} placeholder="Confirmar contraseña"
              value={pwd2} onChange={e => setPwd2(e.target.value)} />
          </label>
          {err && <p className="text-sm text-accent-pink text-center">{err}</p>}

          <button type="submit" className="btn-primary w-full">Registrarse</button>
          <button type="button" className="btn-ghost w-full" onClick={() => { signIn('invitado@google.com'); navigate('/home') }}>
            Continuar con Google
          </button>

          <div className="my-2 flex items-center gap-3 text-xs text-white/40">
            <div className="flex-1 h-px bg-bg-line" />
            ¿Ya tenés cuenta?
            <div className="flex-1 h-px bg-bg-line" />
          </div>

          <button type="button" onClick={() => navigate('/sign-in')} className="btn-outline-lime w-full flex flex-col gap-0">
            <span className="font-semibold">Iniciar sesión</span>
            <span className="text-[11px] font-normal opacity-80">Ya tengo una cuenta</span>
          </button>
        </form>
      </div>
    </div>
  )
}
