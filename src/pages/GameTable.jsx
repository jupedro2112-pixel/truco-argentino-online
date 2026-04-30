import { useEffect, useMemo } from 'react'
import { useMatch } from '../store/match.js'
import { useRouter } from '../store/router.js'
import Card from '../components/Card.jsx'
import { legalActions } from '../game/engine.js'

export default function GameTable() {
  const state = useMatch(s => s.state)
  const config = useMatch(s => s.config)
  const play = useMatch(s => s.play)
  const call = useMatch(s => s.call)
  const respond = useMatch(s => s.respond)
  const reset = useMatch(s => s.reset)
  const navigate = useRouter(s => s.navigate)

  const me = 0
  const legal = useMemo(() => state ? legalActions(state, me) : { play: [], calls: [], responses: [] }, [state])

  useEffect(() => {
    if (!state) navigate('/play-now')
  }, [state, navigate])

  if (!state) return null

  const myHand = state.hands[me] || []
  const seats = layoutSeats(state.players.length)

  const awaitingResponseFromMe =
    (state.trucoState.awaitingResponseFrom !== null
      && state.players[state.trucoState.awaitingResponseFrom].teamIdx === state.players[me].teamIdx)
    || (state.envidoState.awaitingResponseFrom !== null
      && state.players[state.envidoState.awaitingResponseFrom].teamIdx === state.players[me].teamIdx)

  const myTurn = state.turnIdx === me && !awaitingResponseFromMe

  return (
    <div className="min-h-screen bg-felt relative overflow-hidden flex flex-col">
      {/* top bar */}
      <header className="px-4 pt-3 pb-2 flex items-center gap-3 z-10 relative">
        <button onClick={() => { reset(); navigate('/home') }}
          className="w-10 h-10 rounded-full bg-bg/60 backdrop-blur border border-white/10 grid place-items-center text-lg">‹</button>
        <div className="flex-1 flex justify-center">
          <Scoreboard state={state} pointsTo={config?.pointsTo || 30} />
        </div>
        <button className="w-10 h-10 rounded-full bg-bg/60 backdrop-blur border border-white/10 grid place-items-center" aria-label="Chat">💬</button>
      </header>

      {/* turn indicator */}
      <div className="px-4 z-10 relative">
        <div className="mx-auto max-w-fit text-xs px-3 py-1 rounded-full glass">
          {state.handResolved ? 'Repartiendo…' :
           awaitingResponseFromMe ? 'Te están cantando — respondé' :
           myTurn ? 'Tu turno' : `Turno de ${state.players[state.turnIdx]?.name}`}
        </div>
      </div>

      {/* table */}
      <div className="flex-1 relative">
        {/* table oval */}
        <div className="absolute inset-x-6 top-16 bottom-24 rounded-[50%] border border-white/10"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.04), transparent 60%)',
            boxShadow: 'inset 0 0 80px rgba(0,0,0,0.6)',
          }}
        />

        {state.players.map((p, i) => {
          if (i === me) return null
          const pos = seats[i]
          return <OpponentSeat key={p.id} player={p} state={state} idx={i} pos={pos} />
        })}

        {/* center: played cards */}
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <PlayedCards state={state} />
        </div>

        {state.matchOver && (
          <div className="absolute inset-0 grid place-items-center bg-black/80 z-20 backdrop-blur">
            <div className="text-center">
              <div className="text-6xl mb-3 animate-bounce">🏆</div>
              <h2 className="font-display text-3xl font-extrabold">{state.teams[state.winnerTeamIdx].name} ganan</h2>
              <p className="text-white/60 mt-1">{state.teams[state.winnerTeamIdx].score} a {state.teams[1 - state.winnerTeamIdx].score}</p>
              <div className="flex flex-col gap-2 mt-6 w-60 mx-auto">
                <button className="btn-primary" onClick={() => { reset(); navigate('/play-now') }}>Jugar de nuevo</button>
                <button className="btn-ghost" onClick={() => { reset(); navigate('/home') }}>Volver al inicio</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* my hand + actions */}
      <div className="z-10 px-4 pb-6 pt-3 bg-gradient-to-t from-black/85 to-transparent relative">
        <ActionBar state={state} legal={legal} call={call} respond={respond}
          awaitingResponseFromMe={awaitingResponseFromMe} />

        <div className="flex justify-center items-end gap-2 mt-4 min-h-[120px]">
          {myHand.map((c, i) => {
            const playable = legal.play.includes(c.id)
            const angle = (i - (myHand.length - 1) / 2) * 6
            return (
              <div key={c.id} style={{ transform: `rotate(${angle}deg) translateY(${Math.abs(angle)/3}px)` }}>
                <Card card={c} size="md"
                  onClick={playable ? () => play(c.id) : undefined}
                />
              </div>
            )
          })}
          {myHand.length === 0 && (
            <div className="text-white/40 text-sm py-10">Sin cartas en mano…</div>
          )}
        </div>

        <Log state={state} />
      </div>
    </div>
  )
}

function Scoreboard({ state, pointsTo }) {
  return (
    <div className="glass rounded-2xl px-3 py-1.5 flex items-center gap-3 text-sm">
      {state.teams.map((t, i) => (
        <div key={t.idx} className="flex items-center gap-2">
          {i === 1 && <div className="w-px h-4 bg-white/15" />}
          <div className={`w-2.5 h-2.5 rounded-full ${t.idx === 0 ? 'bg-lime-glow' : 'bg-accent-pink'}`} />
          <span className="text-white/80 text-xs">{t.name}</span>
          <span className="font-display font-extrabold text-lg leading-none">{t.score}<span className="text-white/40 text-xs">/{pointsTo}</span></span>
        </div>
      ))}
    </div>
  )
}

function OpponentSeat({ player, state, idx, pos }) {
  const hand = state.hands[idx] || []
  const isTurn = state.turnIdx === idx && !state.handResolved
  const isMano = state.manoIdx === idx
  const teamColor = player.teamIdx === 0 ? 'bg-lime-glow' : 'bg-accent-pink'
  return (
    <div className="absolute" style={pos}>
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex gap-0.5 transform">
          {hand.map((_, i) => (
            <div key={i} style={{ transform: `rotate(${(i - 1) * 8}deg)` }}>
              <Card faceDown size="sm" />
            </div>
          ))}
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition ${
          isTurn ? 'bg-lime-glow text-bg shadow-glow' : 'glass text-white/85'
        }`}>
          <div className={`w-6 h-6 rounded-full ${teamColor} grid place-items-center text-bg text-xs font-extrabold`}>
            {(player.name[0] || '?').toUpperCase()}
          </div>
          <span className="text-xs font-semibold">{player.name}</span>
          {isMano && <span className="text-[9px] uppercase tracking-wider opacity-70">Mano</span>}
        </div>
      </div>
    </div>
  )
}

function PlayedCards({ state }) {
  return (
    <div className="flex flex-col gap-1.5 items-center">
      {state.plays.map((row, ri) => {
        const any = row.some(c => c)
        if (!any && ri > state.round) return null
        return (
          <div key={ri} className="flex gap-1.5 justify-center">
            {row.map((c, pi) => (
              <div key={pi} className="w-[58px] h-[88px] grid place-items-center">
                {c
                  ? <div className="animate-[fadeIn_0.3s_ease-out]"><Card card={c} size="sm" /></div>
                  : <div className="w-[50px] h-[78px] rounded-md border border-white/10 border-dashed opacity-20" />}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

function ActionBar({ state, legal, call, respond, awaitingResponseFromMe }) {
  const ts = state.trucoState
  const trucoCall = legal.calls.find(c => c === 'truco' || c === 'retruco' || c === 'vale4')
  const envidoCalls = legal.calls.filter(c => c === 'envido' || c === 'real-envido' || c === 'falta-envido')

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {awaitingResponseFromMe && (
        <>
          <button onClick={() => respond('quiero')}
            className="btn-primary !py-2.5 !px-6 text-sm shine-overlay relative overflow-hidden">¡QUIERO!</button>
          <button onClick={() => respond('no-quiero')}
            className="btn-ghost !py-2.5 !px-6 text-sm">No quiero</button>
        </>
      )}
      {!awaitingResponseFromMe && trucoCall && (
        <CallButton onClick={() => call(trucoCall)} variant="lime">{labelOf(trucoCall)}</CallButton>
      )}
      {!awaitingResponseFromMe && envidoCalls.map(c => (
        <CallButton key={c} onClick={() => call(c)} variant="ghost">{labelOf(c)}</CallButton>
      ))}
      {!awaitingResponseFromMe && legal.calls.includes('mazo') && (
        <CallButton onClick={() => call('mazo')} variant="muted">Mazo</CallButton>
      )}
      {ts.awaitingResponseFrom !== null && !awaitingResponseFromMe && (
        <span className="text-xs text-white/50">Esperando respuesta…</span>
      )}
    </div>
  )
}

function CallButton({ children, onClick, variant }) {
  const cls = {
    lime:  'bg-lime-glow text-bg shadow-glow hover:brightness-110',
    ghost: 'glass text-white/90 hover:border-lime-glow/40',
    muted: 'bg-white/5 text-white/60 hover:text-white border border-white/10',
  }[variant]
  return (
    <button onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wide transition ${cls}`}>
      {children}
    </button>
  )
}

function labelOf(c) {
  return {
    'truco': 'Truco',
    'retruco': 'Retruco',
    'vale4': 'Vale 4',
    'envido': 'Envido',
    'real-envido': 'Real env.',
    'falta-envido': 'Falta env.',
  }[c] || c
}

function Log({ state }) {
  const last = state.log.slice(-2)
  if (last.length === 0) return null
  return (
    <div className="mt-3 text-center text-xs text-white/45 space-y-0.5">
      {last.map((l, i) => <div key={i}>· {l.text}</div>)}
    </div>
  )
}

function layoutSeats(n) {
  if (n === 2) {
    return [
      null,
      { top: '8%', left: '50%', transform: 'translateX(-50%)' },
    ]
  }
  if (n === 4) {
    return [
      null,
      { top: '50%', right: '4%', transform: 'translateY(-50%)' },
      { top: '8%', left: '50%', transform: 'translateX(-50%)' },
      { top: '50%', left: '4%', transform: 'translateY(-50%)' },
    ]
  }
  return [
    null,
    { top: '60%', right: '4%', transform: 'translateY(-50%)' },
    { top: '14%', right: '14%' },
    { top: '8%', left: '50%', transform: 'translateX(-50%)' },
    { top: '14%', left: '14%' },
    { top: '60%', left: '4%', transform: 'translateY(-50%)' },
  ]
}
