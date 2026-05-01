import { useEffect, useState } from 'react'
import { useRouter } from '../store/router.js'
import { useOnline } from '../store/online.js'
import { useAuth } from '../store/auth.js'
import { isOnlineEnabled } from '../lib/socket.js'
import BottomNav from '../components/BottomNav.jsx'
import Avatar from '../components/Avatar.jsx'
import { useProfile } from '../store/profile.js'
import PageHeader from '../components/ui/PageHeader.jsx'
import Icon from '../components/Icon.jsx'
import Button from '../components/ui/Button.jsx'
import Panel from '../components/ui/Panel.jsx'

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

  useEffect(() => { if (enabled) online.connect() }, [enabled])
  useEffect(() => { if (online.lobby?.started) navigate('/online-match') }, [online.lobby?.started])

  const create = async () => {
    setBusy(true)
    try {
      await online.create({ name: user?.username || 'Jugador', mode, pointsTo, withFlor: false })
    } catch (e) { alert(String(e)) }
    finally { setBusy(false) }
  }

  const join = async () => {
    if (!joinCode) return
    setBusy(true)
    try {
      await online.join(joinCode.trim().toUpperCase(), user?.username || 'Jugador')
    } catch (e) { alert(String(e)) }
    finally { setBusy(false) }
  }

  const lobby = online.lobby

  return (
    <div className="min-h-screen bg-stage pb-28 relative">
      <PageHeader title="Online" back="/home"
        right={
          <span className={`flex items-center gap-1.5 text-2xs font-bold uppercase tracking-widest ${online.connected ? 'text-lime-glow' : 'text-rose-400'}`}>
            <span className={`w-2 h-2 rounded-full ${online.connected ? 'bg-lime-glow' : 'bg-rose-400'}`}/>
            {online.connected ? 'Online' : 'Off'}
          </span>
        } />

      {!enabled && (
        <div className="max-w-2xl mx-auto px-5 mt-5 relative z-10 animate-fade-up">
          <Panel variant="gold" className="p-5">
            <div className="flex items-start gap-3">
              <Icon name="bolt" size={22} className="text-gold-300 shrink-0"/>
              <div>
                <p className="font-display font-bold text-base">Servidor online no configurado</p>
                <p className="text-sm text-ink-300 mt-1">
                  Falta deployar el servidor (carpeta <code className="text-lime-glow">/server</code>) y setear <code className="text-lime-glow">VITE_SOCKET_URL</code>.
                  Mirá <code className="text-lime-glow">server/README.md</code> para los pasos.
                </p>
                <p className="text-sm text-ink-300 mt-2">
                  Mientras, podés jugar contra bots desde "Jugar ahora".
                </p>
              </div>
            </div>
          </Panel>
        </div>
      )}

      {enabled && !lobby && (
        <div className="max-w-2xl mx-auto px-5 mt-5 space-y-5 relative z-10 animate-fade-up">
          <Panel className="p-5">
            <h2 className="section-eyebrow flex items-center gap-2 mb-3">
              <Icon name="plus" size={12}/> Crear sala
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-2xs uppercase tracking-widest text-ink-300 mb-2">Modo</p>
                <div className="grid grid-cols-3 gap-2">
                  {['1v1','2v2','3v3'].map(m => (
                    <Chip key={m} active={mode===m} onClick={() => setMode(m)} label={m} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-2xs uppercase tracking-widest text-ink-300 mb-2">Puntos</p>
                <div className="grid grid-cols-2 gap-2">
                  {[15, 30].map(p => (
                    <Chip key={p} active={pointsTo===p} onClick={() => setPointsTo(p)} label={`A ${p}`} />
                  ))}
                </div>
              </div>
              <Button variant="primary" fullWidth onClick={create} loading={busy}>Crear sala</Button>
            </div>
          </Panel>

          <Panel className="p-5">
            <h2 className="section-eyebrow flex items-center gap-2 mb-3">
              <Icon name="arrow" size={12}/> Unirse con código
            </h2>
            <input
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              placeholder="ABCDE"
              maxLength={5}
              className="input text-center text-3xl font-display font-extrabold tracking-[0.4em]"
            />
            <Button variant="ghost" fullWidth disabled={busy || !joinCode}
              onClick={join} className="mt-3">
              Entrar
            </Button>
          </Panel>
        </div>
      )}

      {enabled && lobby && (
        <div className="max-w-2xl mx-auto px-5 mt-5 relative z-10 animate-fade-up">
          <Panel className="p-5 text-center">
            <p className="section-eyebrow">Código de sala</p>
            <p className="font-display font-extrabold text-5xl text-lime-glow tracking-[0.3em] mt-2 select-all">{lobby.code}</p>
            <p className="text-2xs text-ink-300 mt-3">Compartilo con tus amigos</p>
            <p className="text-2xs text-ink-400 mt-1 tabular-nums">{lobby.config.mode} · A {lobby.config.pointsTo}</p>
          </Panel>

          <div className="mt-4 space-y-2">
            {Array.from({ length: lobby.capacity }).map((_, i) => {
              const p = lobby.players[i]
              return (
                <div key={i}
                  className={`panel px-4 py-3 flex items-center gap-3 ${p?.ready ? 'border-lime-glow/40' : ''}`}>
                  {p ? (
                    <>
                      <Avatar id={p.isBot ? 'gaucho' : profile.avatarId} size={40} ring={false} />
                      <div className="flex-1">
                        <p className="font-display font-bold text-sm">{p.name}</p>
                        <p className="text-2xs text-ink-400">
                          {i % 2 === 0 ? 'Nosotros' : 'Ellos'} · {p.isBot ? 'Bot' : (p.disconnected ? 'Desconectado' : 'Online')}
                        </p>
                      </div>
                      {p.ready
                        ? <span className="pill-brand">LISTO</span>
                        : <span className="pill-mute">Esperando</span>}
                    </>
                  ) : (
                    <>
                      <span className="w-10 h-10 rounded-full bg-ink-700 border-2 border-dashed border-white/10"/>
                      <span className="text-ink-400 text-sm">Esperando jugador…</span>
                    </>
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex gap-2 mt-5">
            <Button variant="primary" fullWidth onClick={() => online.toggleReady()}>
              Estoy listo
            </Button>
            {lobby.players.length < lobby.capacity && (
              <Button variant="ghost" iconLeft="plus" onClick={() => online.addBot()}>Bot</Button>
            )}
          </div>
          <button onClick={() => { online.reset(); navigate('/home') }}
            className="text-ink-400 text-2xs underline mt-4 mx-auto block">
            Salir de la sala
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  )
}

function Chip({ active, onClick, label }) {
  return (
    <button onClick={onClick}
      className={`rounded-xl py-2.5 font-display font-bold border transition ${
        active
          ? 'bg-lime-glow text-ink-900 border-lime-glow shadow-glow-brand'
          : 'bg-ink-800 text-ink-200 border-white/10 hover:border-white/20'
      }`}>{label}</button>
  )
}
