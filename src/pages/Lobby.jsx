import { useEffect, useState } from 'react'
import { useRouter } from '../store/router.js'
import { useOnline } from '../store/online.js'
import { useAuth } from '../store/auth.js'
import { isOnlineEnabled } from '../lib/socket.js'
import BottomNav from '../components/BottomNav.jsx'
import Avatar from '../components/Avatar.jsx'
import { useProfile } from '../store/profile.js'

export default function Lobby() {
  const navigate = useRouter(s => s.navigate)
  const user = useAuth(s => s.user)
  const profile = useProfile()
  const online = useOnline()
  const enabled = isOnlineEnabled()

  const [mode, setMode] = useState('1v1')
  const [pointsTo, setPointsTo] = useState(30)
  const [joinCode, setJoinCode] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (enabled) online.connect()
  }, [enabled])

  useEffect(() => {
    if (online.lobby?.started) {
      navigate('/online-match')
    }
  }, [online.lobby?.started])

  const create = async () => {
    setBusy(true)
    try {
      const code = await online.create({ name: user?.username || 'Jugador', mode, pointsTo, withFlor: false })
      navigate('/lobby?code=' + code)
    } catch (e) { alert(String(e)) }
    finally { setBusy(false) }
  }

  const join = async () => {
    if (!joinCode) return
    setBusy(true)
    try {
      const code = await online.join(joinCode.trim().toUpperCase(), user?.username || 'Jugador')
      navigate('/lobby?code=' + code)
    } catch (e) { alert(String(e)) }
    finally { setBusy(false) }
  }

  const lobby = online.lobby
  const inLobby = !!lobby

  return (
    <div className="min-h-screen bg-stage pb-24 relative">
      <header className="max-w-2xl mx-auto px-5 pt-6 flex items-center relative z-10">
        <button onClick={() => navigate('/home')} className="glass w-10 h-10 rounded-full grid place-items-center text-white/80">‹</button>
        <h1 className="flex-1 text-center font-display font-extrabold text-2xl">Online</h1>
        <div className={`w-2 h-2 rounded-full ${online.connected ? 'bg-lime-glow' : 'bg-accent-pink'}`} title={online.connected ? 'Conectado' : 'Desconectado'} />
      </header>

      {!enabled && (
        <div className="max-w-2xl mx-auto px-5 mt-6 relative z-10">
          <div className="glass rounded-2xl p-4 text-sm">
            <p className="font-bold text-yellow-200">⚠ Servidor online no configurado</p>
            <p className="text-white/60 mt-1">
              Falta deployar el server (carpeta <code className="text-lime-glow">/server</code>) en Render
              y setear <code className="text-lime-glow">VITE_SOCKET_URL</code> en el front-end.
              Ver <code>server/README.md</code> para los pasos.
            </p>
            <p className="text-white/60 mt-2">
              Mientras tanto podés jugar contra bots desde "Jugar ahora".
            </p>
          </div>
        </div>
      )}

      {enabled && !inLobby && (
        <div className="max-w-2xl mx-auto px-5 mt-6 space-y-5 relative z-10">
          <Section title="Crear sala">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50 mb-2">Modo</p>
              <div className="grid grid-cols-3 gap-2">
                {['1v1','2v2','3v3'].map(m => (
                  <Choice key={m} active={mode===m} onClick={() => setMode(m)} label={m} />
                ))}
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs uppercase tracking-wider text-white/50 mb-2">Puntos</p>
              <div className="grid grid-cols-2 gap-2">
                {[15, 30].map(p => (
                  <Choice key={p} active={pointsTo===p} onClick={() => setPointsTo(p)} label={`A ${p}`} />
                ))}
              </div>
            </div>
            <button onClick={create} disabled={busy} className="btn-primary w-full mt-4">
              Crear sala
            </button>
          </Section>

          <Section title="Unirse a sala">
            <input
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              placeholder="CÓDIGO"
              maxLength={5}
              className="input text-center text-2xl font-display font-extrabold tracking-[0.4em]"
            />
            <button onClick={join} disabled={busy || !joinCode} className="btn-ghost w-full mt-2">
              Entrar
            </button>
          </Section>
        </div>
      )}

      {enabled && inLobby && (
        <div className="max-w-2xl mx-auto px-5 mt-6 relative z-10">
          <div className="glass rounded-3xl p-5 text-center">
            <p className="text-xs uppercase tracking-widest text-white/50">Código</p>
            <p className="font-display font-extrabold text-4xl text-lime-glow tracking-[0.3em] mt-1">{lobby.code}</p>
            <p className="text-xs text-white/50 mt-2">Compartilo con tus amigos</p>
            <p className="text-[10px] text-white/40 mt-1">{lobby.config.mode} · A {lobby.config.pointsTo}</p>
          </div>

          <div className="mt-4 space-y-2">
            {Array.from({ length: lobby.capacity }).map((_, i) => {
              const p = lobby.players[i]
              return (
                <div key={i} className={`glass rounded-xl px-4 py-3 flex items-center gap-3 ${p?.ready ? 'border-lime-glow/40' : ''}`}>
                  {p ? (
                    <>
                      <Avatar id={p.isBot ? 'gaucho' : profile.avatarId} size={36} ring={false} />
                      <div className="flex-1">
                        <p className="font-bold text-sm">{p.name}</p>
                        <p className="text-[10px] text-white/50">{i % 2 === 0 ? 'Nosotros' : 'Ellos'} · {p.isBot ? 'Bot' : (p.disconnected ? 'Desconectado' : 'Online')}</p>
                      </div>
                      {p.ready ? <span className="text-lime-glow text-xs font-bold">LISTO</span> : <span className="text-white/40 text-xs">esperando</span>}
                    </>
                  ) : (
                    <span className="text-white/40 text-sm">Esperando jugador…</span>
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex gap-2 mt-5">
            <button onClick={() => online.toggleReady()} className="btn-primary flex-1">
              Estoy listo
            </button>
            {lobby.players[0]?.socketId && lobby.players.length < lobby.capacity && (
              <button onClick={() => online.addBot()} className="btn-ghost">
                + Bot
              </button>
            )}
          </div>
          <button onClick={() => { online.reset(); navigate('/home') }}
            className="text-white/40 text-xs underline mt-4 mx-auto block">
            Salir
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="glass rounded-3xl p-5">
      <h2 className="text-xs uppercase tracking-widest text-white/50 mb-3">{title}</h2>
      {children}
    </div>
  )
}

function Choice({ active, onClick, label }) {
  return (
    <button onClick={onClick}
      className={`rounded-xl py-3 font-semibold border transition ${
        active
          ? 'bg-lime-glow text-bg border-lime-glow shadow-glow'
          : 'bg-bg-soft text-white/80 border-bg-line hover:border-lime-glow/40'
      }`}>{label}</button>
  )
}
