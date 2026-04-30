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
  const seats = useMemo(() => layoutPositions(state.players.length), [state.players.length])
  const playSpots = useMemo(() => playPositions(state.players.length), [state.players.length])

  const trucoAwait = state.trucoState.awaitingResponseFrom
  const envidoAwait = state.envidoState.awaitingResponseFrom
  const awaitingResponseFromMe =
    (trucoAwait !== null && state.players[trucoAwait].teamIdx === state.players[me].teamIdx)
    || (envidoAwait !== null && state.players[envidoAwait].teamIdx === state.players[me].teamIdx)

  const myTurn = state.turnIdx === me && !awaitingResponseFromMe

  const lastCall = useMemo(() => {
    if (trucoAwait !== null) return state.log.slice().reverse().find(l => l.type === 'call')
    if (envidoAwait !== null) return state.log.slice().reverse().find(l => l.type === 'call')
    return null
  }, [state.log, trucoAwait, envidoAwait])

  return (
    <div className="min-h-screen bg-felt relative overflow-hidden flex flex-col">
      {/* HUD top */}
      <header className="px-4 pt-3 pb-2 flex items-center gap-3 z-20 relative">
        <button onClick={() => { reset(); navigate('/home') }}
          className="w-10 h-10 rounded-xl glass grid place-items-center text-lg">‹</button>
        <Scoreboard state={state} pointsTo={config?.pointsTo || 30} />
        <div className="flex-1" />
        <RoundIndicator state={state} />
        <button className="w-10 h-10 rounded-xl glass grid place-items-center" aria-label="Chat">💬</button>
      </header>

      <div className="px-4 z-20 relative">
        <TurnPill state={state} myTurn={myTurn} awaitingResponseFromMe={awaitingResponseFromMe} />
      </div>

      {/* Table area */}
      <div className="flex-1 relative">
        {/* table felt outline */}
        <div className="absolute inset-x-4 top-12 bottom-32 rounded-[40%] border border-white/5"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.04), transparent 70%)',
            boxShadow: 'inset 0 0 100px rgba(0,0,0,0.7), 0 0 60px rgba(200,249,100,0.04)',
          }}
        />

        {/* Seats (opponents) */}
        {state.players.map((p, i) => {
          if (i === me) return null
          return (
            <OpponentSeat key={p.id}
              player={p} state={state} idx={i} pos={seats[i]}
            />
          )
        })}

        {/* Per-player play stacks */}
        {state.players.map((p, i) => (
          <PlayStack key={`stack-${p.id}`} state={state} idx={i} spot={playSpots[i]} />
        ))}

        {/* Mano marker (dealer chip) */}
        <ManoChip state={state} positions={seats} me={me} />

        {/* Match-over overlay */}
        {state.matchOver && (
          <div className="absolute inset-0 grid place-items-center bg-black/85 z-30 backdrop-blur">
            <div className="text-center max-w-sm mx-auto px-6">
              <div className="text-7xl mb-4 animate-bounce">🏆</div>
              <h2 className="font-display text-4xl font-extrabold">{state.teams[state.winnerTeamIdx].name}</h2>
              <p className="font-display text-lime-glow text-xl mt-1">¡Ganaron la partida!</p>
              <p className="text-white/50 text-sm mt-2">
                Final: {state.teams[0].score} – {state.teams[1].score}
              </p>
              <div className="flex flex-col gap-2 mt-8">
                <button className="btn-primary shine-overlay relative overflow-hidden" onClick={() => { reset(); navigate('/play-now') }}>
                  Jugar de nuevo
                </button>
                <button className="btn-ghost" onClick={() => { reset(); navigate('/home') }}>
                  Volver al inicio
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Call announcement banner */}
        {(trucoAwait !== null || envidoAwait !== null) && lastCall && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <div className="mx-auto w-fit glass rounded-2xl px-6 py-3 text-center border border-lime-glow/40 shadow-glow">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">Canto</p>
              <p className="font-display font-extrabold text-2xl text-lime-glow">{lastCall.text}</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom HUD */}
      <div className="z-20 px-4 pb-5 pt-3 bg-gradient-to-t from-black/90 to-transparent relative">
        <ActionBar state={state} legal={legal} call={call} respond={respond}
          awaitingResponseFromMe={awaitingResponseFromMe} />

        <div className="flex justify-center items-end gap-2 mt-4 min-h-[122px]">
          {myHand.map((c, i) => {
            const playable = legal.play.includes(c.id)
            const angle = (i - (myHand.length - 1) / 2) * 7
            const lift = Math.abs(angle) / 2
            return (
              <div key={c.id}
                style={{
                  transform: `rotate(${angle}deg) translateY(${lift}px)`,
                  filter: playable ? 'drop-shadow(0 0 8px rgba(200,249,100,0.4))' : undefined,
                }}>
                <Card card={c} size="md"
                  onClick={playable ? () => play(c.id) : undefined}
                />
              </div>
            )
          })}
          {myHand.length === 0 && (
            <div className="text-white/40 text-sm py-12">Sin cartas en mano…</div>
          )}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Sub-components                                                             */
/* -------------------------------------------------------------------------- */

function Scoreboard({ state, pointsTo }) {
  return (
    <div className="glass rounded-2xl px-3 py-1.5 flex items-center gap-3 text-sm">
      {state.teams.map((t, i) => (
        <div key={t.idx} className="flex items-center gap-2">
          {i === 1 && <div className="w-px h-5 bg-white/15" />}
          <div className={`w-2 h-2 rounded-full ${t.idx === 0 ? 'bg-lime-glow' : 'bg-accent-pink'}`} />
          <span className="text-white/60 text-[10px] uppercase tracking-wider">{t.name}</span>
          <span className="font-display font-extrabold text-xl leading-none tabular-nums">
            {String(t.score).padStart(2, '0')}
            <span className="text-white/30 text-[10px] ml-0.5">/{pointsTo}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

function RoundIndicator({ state }) {
  return (
    <div className="glass rounded-2xl px-3 py-1.5 flex items-center gap-2">
      <span className="text-[9px] uppercase tracking-widest text-white/50">Ronda</span>
      <div className="flex gap-1">
        {[0, 1, 2].map(r => {
          const w = state.roundWinners[r]
          const active = state.round === r && !state.handResolved
          let cls = 'bg-white/10 border-white/15'
          if (w === 0) cls = 'bg-lime-glow border-lime-glow'
          else if (w === 1) cls = 'bg-accent-pink border-accent-pink'
          else if (w === -1) cls = 'bg-white/40 border-white/40'
          else if (active) cls = 'bg-white/15 border-lime-glow ring-2 ring-lime-glow/40'
          return <span key={r} className={`block w-2.5 h-2.5 rounded-full border ${cls}`} />
        })}
      </div>
    </div>
  )
}

function TurnPill({ state, myTurn, awaitingResponseFromMe }) {
  let label = `Turno de ${state.players[state.turnIdx]?.name}`
  let tone = 'glass text-white/80'
  if (state.handResolved) { label = 'Repartiendo nueva mano…'; tone = 'glass text-white/60' }
  else if (awaitingResponseFromMe) { label = '¡Te están cantando! Respondé'; tone = 'bg-lime-glow text-bg shadow-glow' }
  else if (myTurn) { label = 'Tu turno'; tone = 'bg-lime-glow/15 text-lime-glow border border-lime-glow/40' }
  return (
    <div className="flex justify-center">
      <span className={`text-[11px] px-4 py-1.5 rounded-full font-bold uppercase tracking-wider transition ${tone}`}>
        {label}
      </span>
    </div>
  )
}

function OpponentSeat({ player, state, idx, pos }) {
  const hand = state.hands[idx] || []
  const isTurn = state.turnIdx === idx && !state.handResolved
  const teamColor = player.teamIdx === 0 ? 'bg-lime-glow' : 'bg-accent-pink'
  const teamGlow = player.teamIdx === 0 ? 'shadow-[0_0_20px_rgba(200,249,100,0.3)]' : 'shadow-[0_0_20px_rgba(255,61,138,0.3)]'

  return (
    <div className="absolute z-10" style={pos.style}>
      <div className="flex flex-col items-center gap-1.5">
        {/* Card fan */}
        <div className="flex gap-0.5 mb-0.5" style={{ transform: pos.handRotate || 'none' }}>
          {hand.map((_, i) => (
            <div key={i} style={{ transform: `rotate(${(i - (hand.length - 1) / 2) * 8}deg) translateY(${Math.abs((i - (hand.length - 1) / 2) * 4)}px)` }}>
              <Card faceDown size="xs" />
            </div>
          ))}
        </div>
        {/* Name pill */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition ${
          isTurn ? `bg-lime-glow text-bg ${teamGlow}` : 'glass text-white/85'
        }`}>
          <div className={`w-7 h-7 rounded-full ${teamColor} grid place-items-center text-bg text-xs font-extrabold`}>
            {(player.name[0] || '?').toUpperCase()}
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xs font-semibold">{player.name}</span>
            <span className="text-[9px] opacity-70 uppercase tracking-wider">{player.teamIdx === 0 ? 'Nosotros' : 'Ellos'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlayStack({ state, idx, spot }) {
  // Collect this player's played cards across the 3 rounds, in order.
  const played = state.plays
    .map((row, ri) => ({ card: row[idx], ri }))
    .filter(x => x.card)

  if (played.length === 0) return null

  return (
    <div className="absolute z-10 pointer-events-none" style={spot.style}>
      <div className="relative">
        {played.map((p, i) => (
          <div
            key={p.card.id}
            className="absolute animate-[fadeIn_0.4s_ease-out]"
            style={{
              transform: `translate(${spot.dx * i}px, ${spot.dy * i}px) rotate(${spot.rotate * (i - 1) * 0.5}deg)`,
              zIndex: i,
            }}
          >
            <Card card={p.card} size="sm" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ManoChip({ state, positions, me }) {
  const idx = state.manoIdx
  const seat = idx === me
    ? { style: { bottom: '110px', left: '50%', transform: 'translateX(-90px)' } }
    : positions[idx]
  if (!seat) return null
  return (
    <div className="absolute z-10 pointer-events-none" style={seat.style}>
      <div className="flex items-center gap-1 mt-2 ml-12 bg-yellow-300/95 text-bg text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow">
        Mano
      </div>
    </div>
  )
}

function ActionBar({ state, legal, call, respond, awaitingResponseFromMe }) {
  const trucoCall = legal.calls.find(c => c === 'truco' || c === 'retruco' || c === 'vale4')
  const envidoCalls = legal.calls.filter(c => c === 'envido' || c === 'real-envido' || c === 'falta-envido')

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {awaitingResponseFromMe && (
        <>
          <button onClick={() => respond('quiero')}
            className="px-6 py-2.5 rounded-full bg-lime-glow text-bg text-sm font-extrabold uppercase tracking-wider shadow-glow shine-overlay relative overflow-hidden hover:brightness-110 transition">
            ¡Quiero!
          </button>
          <button onClick={() => respond('no-quiero')}
            className="px-6 py-2.5 rounded-full glass text-white/90 text-sm font-bold uppercase tracking-wider hover:border-lime-glow/40 transition">
            No quiero
          </button>
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
      className={`rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition ${cls}`}>
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
    'real-envido': 'Real Env.',
    'falta-envido': 'Falta Env.',
  }[c] || c
}

/* -------------------------------------------------------------------------- */
/* Layouts                                                                     */
/* -------------------------------------------------------------------------- */

// Where each opponent sits around the felt.
function layoutPositions(n) {
  if (n === 2) {
    return [
      null,
      { style: { top: '4%', left: '50%', transform: 'translateX(-50%)' } },
    ]
  }
  if (n === 4) {
    return [
      null,
      { style: { top: '50%', right: '2%', transform: 'translateY(-50%)' }, handRotate: 'rotate(90deg)' },
      { style: { top: '4%', left: '50%', transform: 'translateX(-50%)' } },
      { style: { top: '50%', left: '2%', transform: 'translateY(-50%)' }, handRotate: 'rotate(-90deg)' },
    ]
  }
  // 6 players (3v3)
  return [
    null,
    { style: { top: '60%', right: '2%', transform: 'translateY(-50%)' }, handRotate: 'rotate(90deg)' },
    { style: { top: '12%', right: '12%' } },
    { style: { top: '4%', left: '50%', transform: 'translateX(-50%)' } },
    { style: { top: '12%', left: '12%' } },
    { style: { top: '60%', left: '2%', transform: 'translateY(-50%)' }, handRotate: 'rotate(-90deg)' },
  ]
}

// Where each player's played cards stack on the felt — between their seat and center.
// dx/dy define the per-round offset; rotate is degrees.
function playPositions(n) {
  // Card sm size: 56x86. Offset between rounds inside same stack: ~30 px toward center.
  if (n === 2) {
    return [
      // Me (bottom): stack grows UP toward center
      { style: { bottom: '24%', left: '50%', transform: 'translateX(-50%)' }, dx: 6,  dy: -22, rotate: 4 },
      // Opp (top): stack grows DOWN toward center
      { style: { top: '20%', left: '50%', transform: 'translateX(-50%)' }, dx: -6, dy:  22, rotate: -4 },
    ]
  }
  if (n === 4) {
    return [
      { style: { bottom: '24%', left: '50%', transform: 'translateX(-50%)' }, dx: 0, dy: -22, rotate: 4 },
      { style: { top: '50%', right: '20%', transform: 'translateY(-50%)' },   dx: -22, dy: 0, rotate: -4 },
      { style: { top: '22%',  left: '50%', transform: 'translateX(-50%)' },  dx: 0, dy: 22,  rotate: -4 },
      { style: { top: '50%', left: '20%', transform: 'translateY(-50%)' },   dx: 22,  dy: 0, rotate: 4 },
    ]
  }
  return [
    { style: { bottom: '24%', left: '50%', transform: 'translateX(-50%)' }, dx: 0,   dy: -22, rotate: 3 },
    { style: { top: '60%', right: '20%', transform: 'translateY(-50%)' },   dx: -20, dy: -8,  rotate: -3 },
    { style: { top: '28%', right: '24%' },                                  dx: -14, dy: 14,  rotate: -3 },
    { style: { top: '22%', left: '50%', transform: 'translateX(-50%)' },    dx: 0,   dy: 22,  rotate: -3 },
    { style: { top: '28%', left: '24%' },                                   dx: 14,  dy: 14,  rotate: 3 },
    { style: { top: '60%', left: '20%', transform: 'translateY(-50%)' },    dx: 20,  dy: -8,  rotate: 3 },
  ]
}
