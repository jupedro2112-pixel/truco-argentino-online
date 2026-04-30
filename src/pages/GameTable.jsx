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

  return (
    <div className="min-h-screen bg-felt relative overflow-hidden flex flex-col">
      {/* top bar */}
      <header className="px-4 pt-3 pb-2 flex items-center gap-3 z-10">
        <button onClick={() => { reset(); navigate('/home') }}
          className="w-9 h-9 rounded-full bg-bg/60 backdrop-blur border border-white/10 grid place-items-center">‹</button>
        <div className="flex-1 flex justify-center">
          <Scoreboard state={state} pointsTo={config?.pointsTo || 30} />
        </div>
        <div className="w-9" />
      </header>

      {/* table */}
      <div className="flex-1 relative">
        {state.players.map((p, i) => {
          if (i === me) return null
          const pos = seats[i]
          return <OpponentSeat key={p.id} player={p} state={state} idx={i} pos={pos} />
        })}

        {/* center: played cards */}
        <div className="absolute inset-0 grid place-items-center">
          <PlayedCards state={state} />
        </div>

        {state.matchOver && (
          <div className="absolute inset-0 grid place-items-center bg-black/70 z-20">
            <div className="text-center">
              <div className="text-5xl mb-2">🏆</div>
              <h2 className="text-2xl font-bold">{state.teams[state.winnerTeamIdx].name} ganan</h2>
              <button className="btn-primary mt-4" onClick={() => { reset(); navigate('/home') }}>
                Volver al inicio
              </button>
            </div>
          </div>
        )}
      </div>

      {/* my hand + actions */}
      <div className="z-10 px-4 pb-6 pt-3 bg-gradient-to-t from-black/70 to-transparent">
        <ActionBar state={state} legal={legal} call={call} respond={respond}
          awaitingResponseFromMe={awaitingResponseFromMe} />

        <div className="flex justify-center gap-3 mt-3">
          {myHand.map(c => (
            <Card key={c.id} card={c}
              onClick={legal.play.includes(c.id) ? () => play(c.id) : undefined}
            />
          ))}
          {myHand.length === 0 && (
            <div className="text-white/50 text-sm py-8">Sin cartas en mano…</div>
          )}
        </div>

        <Log state={state} />
      </div>
    </div>
  )
}

function Scoreboard({ state, pointsTo }) {
  return (
    <div className="bg-bg/70 backdrop-blur border border-white/10 rounded-xl px-4 py-1.5 flex items-center gap-4 text-sm">
      {state.teams.map(t => (
        <div key={t.idx} className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${t.idx === 0 ? 'bg-lime-glow' : 'bg-accent-pink'}`} />
          <span className="text-white/80">{t.name}</span>
          <span className="font-bold">{t.score}<span className="text-white/40">/{pointsTo}</span></span>
        </div>
      ))}
    </div>
  )
}

function OpponentSeat({ player, state, idx, pos }) {
  const hand = state.hands[idx] || []
  const isTurn = state.turnIdx === idx
  return (
    <div className="absolute" style={pos}>
      <div className={`flex flex-col items-center gap-2 ${isTurn ? 'animate-pulse' : ''}`}>
        <div className="flex gap-1">
          {hand.map((_, i) => <Card key={i} faceDown small />)}
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
          isTurn ? 'bg-lime-glow text-bg border-lime-glow' : 'bg-bg/70 text-white/80 border-white/10'
        }`}>
          {player.name} {player.teamIdx === 0 ? '· N' : '· E'}
        </div>
      </div>
    </div>
  )
}

function PlayedCards({ state }) {
  const n = state.players.length
  // Show round-by-round, latest at center
  return (
    <div className="flex flex-col gap-2 items-center">
      {state.plays.map((row, ri) => {
        const any = row.some(c => c)
        if (!any && ri > state.round) return null
        return (
          <div key={ri} className="flex gap-2 justify-center">
            {row.map((c, pi) => (
              <div key={pi} className="w-[56px] h-[88px] grid place-items-center">
                {c ? <Card card={c} small /> : <div className="w-[50px] h-[78px] rounded-md border border-white/10 border-dashed opacity-30" />}
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
  const es = state.envidoState

  // Call buttons we want to expose to user, ordered
  const trucoCall = legal.calls.find(c => c === 'truco' || c === 'retruco' || c === 'vale4')
  const envidoCalls = legal.calls.filter(c => c === 'envido' || c === 'real-envido' || c === 'falta-envido')

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {awaitingResponseFromMe && (
        <>
          <button onClick={() => respond('quiero')}
            className="btn-primary !py-2 !px-4 text-sm">Quiero</button>
          <button onClick={() => respond('no-quiero')}
            className="btn-ghost !py-2 !px-4 text-sm">No quiero</button>
        </>
      )}
      {!awaitingResponseFromMe && trucoCall && (
        <button onClick={() => call(trucoCall)}
          className="btn-outline-lime !py-2 !px-4 text-sm">{labelOf(trucoCall)}</button>
      )}
      {!awaitingResponseFromMe && envidoCalls.map(c => (
        <button key={c} onClick={() => call(c)}
          className="btn-ghost !py-2 !px-4 text-sm">{labelOf(c)}</button>
      ))}
      {!awaitingResponseFromMe && legal.calls.includes('mazo') && (
        <button onClick={() => call('mazo')}
          className="btn-ghost !py-2 !px-4 text-sm">Mazo</button>
      )}
      {ts.awaitingResponseFrom !== null && !awaitingResponseFromMe && (
        <span className="text-xs text-white/60">Esperando respuesta…</span>
      )}
    </div>
  )
}

function labelOf(c) {
  return {
    'truco': 'Truco',
    'retruco': 'Retruco',
    'vale4': 'Vale 4',
    'envido': 'Envido',
    'real-envido': 'Real envido',
    'falta-envido': 'Falta envido',
  }[c] || c
}

function Log({ state }) {
  const last = state.log.slice(-3)
  if (last.length === 0) return null
  return (
    <div className="mt-3 text-center text-xs text-white/60 space-y-0.5">
      {last.map((l, i) => <div key={i}>· {l.text}</div>)}
    </div>
  )
}

// Position seats around a virtual oval based on player count.
function layoutSeats(n) {
  // Coordinates as % of container.
  if (n === 2) {
    return [
      null, // me at bottom (rendered separately)
      { top: '6%', left: '50%', transform: 'translateX(-50%)' },
    ]
  }
  if (n === 4) {
    return [
      null,
      { top: '50%', right: '4%', transform: 'translateY(-50%)' },
      { top: '6%', left: '50%', transform: 'translateX(-50%)' },
      { top: '50%', left: '4%', transform: 'translateY(-50%)' },
    ]
  }
  // 6 players
  return [
    null,
    { top: '60%', right: '4%', transform: 'translateY(-50%)' },
    { top: '15%', right: '15%' },
    { top: '6%', left: '50%', transform: 'translateX(-50%)' },
    { top: '15%', left: '15%' },
    { top: '60%', left: '4%', transform: 'translateY(-50%)' },
  ]
}
