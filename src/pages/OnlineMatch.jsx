import { useEffect, useMemo } from 'react'
import { useOnline } from '../store/online.js'
import { useRouter } from '../store/router.js'
import { useProfile } from '../store/profile.js'
import { play as playSound, setSoundEnabled } from '../lib/sounds.js'
import Card from '../components/Card.jsx'
import { legalActions } from '../game/engine.js'

export default function OnlineMatch() {
  const online = useOnline()
  const navigate = useRouter(s => s.navigate)
  const profile = useProfile()
  useEffect(() => { setSoundEnabled(profile.settings.sound) }, [profile.settings.sound])

  useEffect(() => {
    if (!online.lobby) navigate('/lobby')
  }, [online.lobby])

  const state = online.state
  const me = state?._viewerIdx ?? 0
  const legal = useMemo(() => state ? legalActions(state, me) : { play: [], calls: [], responses: [] }, [state])

  if (!state) {
    return (
      <div className="min-h-screen bg-felt grid place-items-center text-white/60">
        Esperando estado del servidor…
      </div>
    )
  }

  const handMine = state.hands[me] || []
  const trucoAwait = state.trucoState.awaitingResponseFrom
  const envidoAwait = state.envidoState.awaitingResponseFrom
  const awaitingResponseFromMe =
    (trucoAwait !== null && state.players[trucoAwait].teamIdx === state.players[me].teamIdx)
    || (envidoAwait !== null && state.players[envidoAwait].teamIdx === state.players[me].teamIdx)

  const send = (a) => online.action(a)

  return (
    <div className="min-h-screen bg-felt relative overflow-hidden flex flex-col">
      <header className="px-4 pt-3 pb-2 flex items-center gap-3 z-20 relative">
        <button onClick={() => { online.reset(); navigate('/home') }}
          className="w-10 h-10 rounded-xl glass grid place-items-center text-lg">‹</button>
        <div className="glass rounded-2xl px-3 py-1.5 flex items-center gap-3 text-sm">
          {state.teams.map((t, i) => (
            <span key={t.idx} className="flex items-center gap-2">
              {i === 1 && <span className="w-px h-5 bg-white/15" />}
              <span className={`w-2 h-2 rounded-full ${t.idx === 0 ? 'bg-lime-glow' : 'bg-accent-pink'}`} />
              <span className="text-white/60 text-[10px] uppercase tracking-wider">{t.name}</span>
              <span className="font-display font-extrabold text-xl leading-none tabular-nums">
                {String(t.score).padStart(2, '0')}
              </span>
            </span>
          ))}
        </div>
      </header>

      {/* Players row */}
      <div className="px-4 mt-2 flex flex-wrap justify-center gap-2 z-10 relative">
        {state.players.map((p, i) => i !== me && (
          <div key={p.id || i} className={`glass rounded-full px-3 py-1.5 flex items-center gap-2 ${state.turnIdx === i ? 'border-lime-glow/60 shadow-glow' : ''}`}>
            <span className={`w-2 h-2 rounded-full ${p.teamIdx === 0 ? 'bg-lime-glow' : 'bg-accent-pink'}`}/>
            <span className="text-xs font-bold">{p.name}</span>
            <div className="flex gap-0.5">
              {state.hands[i].map((_, k) => <div key={k} className="w-3 h-4 rounded-sm bg-bg-line" />)}
            </div>
          </div>
        ))}
      </div>

      {/* Table area */}
      <div className="flex-1 grid place-items-center relative">
        <div className="grid grid-cols-1 gap-2">
          {state.plays.map((row, ri) => (
            <div key={ri} className="flex justify-center gap-2">
              {row.map((c, pi) => (
                <div key={pi} className="w-[58px] h-[88px] grid place-items-center">
                  {c
                    ? <Card card={c} size="sm" />
                    : <div className="w-[50px] h-[78px] rounded-md border border-white/10 border-dashed opacity-20" />}
                </div>
              ))}
            </div>
          ))}
        </div>

        {state.matchOver && (
          <div className="absolute inset-0 grid place-items-center bg-black/85 backdrop-blur z-30">
            <div className="text-center">
              <div className="text-7xl mb-2">🏆</div>
              <h2 className="font-display text-3xl font-extrabold">{state.teams[state.winnerTeamIdx].name} ganan</h2>
              <button className="btn-primary mt-6" onClick={() => { online.reset(); navigate('/home') }}>Salir</button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom HUD */}
      <div className="z-10 px-4 pb-5 pt-3 bg-gradient-to-t from-black/85 to-transparent">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {awaitingResponseFromMe ? (
            <>
              <button onClick={() => { playSound('quiero'); send({ type: 'quiero' }) }}
                className="px-6 py-2.5 rounded-full bg-lime-glow text-bg text-sm font-extrabold uppercase tracking-wider shadow-glow">
                ¡Quiero!
              </button>
              <button onClick={() => { playSound('noQuiero'); send({ type: 'no-quiero' }) }}
                className="px-6 py-2.5 rounded-full glass text-white/90 text-sm font-bold uppercase tracking-wider">
                No quiero
              </button>
            </>
          ) : (
            <>
              {legal.calls.includes('truco') && <CallBtn onClick={() => send({ type: 'truco' })}>Truco</CallBtn>}
              {legal.calls.includes('retruco') && <CallBtn onClick={() => send({ type: 'retruco' })}>Retruco</CallBtn>}
              {legal.calls.includes('vale4') && <CallBtn onClick={() => send({ type: 'vale4' })}>Vale 4</CallBtn>}
              {legal.calls.includes('envido') && <CallBtn onClick={() => send({ type: 'envido' })}>Envido</CallBtn>}
              {legal.calls.includes('mazo') && <CallBtn onClick={() => send({ type: 'mazo' })}>Mazo</CallBtn>}
            </>
          )}
        </div>

        <div className="flex justify-center items-end gap-2 mt-4 min-h-[124px]">
          {handMine.map((c, i) => {
            const playable = legal.play.includes(c?.id)
            const angle = (i - (handMine.length - 1) / 2) * 7
            return (
              <div key={c?.id || i} style={{ transform: `rotate(${angle}deg)` }}>
                <Card card={c} size="md"
                  onClick={playable && c ? () => { playSound('cardPlay'); send({ type: 'play', cardId: c.id }) } : undefined}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function CallBtn({ children, onClick }) {
  return (
    <button onClick={onClick} className="rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wider glass text-white/90 hover:border-lime-glow/40 transition">
      {children}
    </button>
  )
}
