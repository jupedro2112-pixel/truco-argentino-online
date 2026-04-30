import { useEffect, useMemo, useRef, useState } from 'react'
import { useMatch, currentActor } from '../store/match.js'
import { useRouter } from '../store/router.js'
import { useProfile } from '../store/profile.js'
import { play as playSound, setSoundEnabled } from '../lib/sounds.js'
import Card from '../components/Card.jsx'
import TimerRing from '../components/TimerRing.jsx'
import EventOverlay from '../components/EventOverlay.jsx'
import { legalActions } from '../game/engine.js'

const HUMAN_TIMEOUT = 20
const BOT_TIMEOUT   = 5

export default function GameTable() {
  const state = useMatch(s => s.state)
  const config = useMatch(s => s.config)
  const play = useMatch(s => s.play)
  const callAction = useMatch(s => s.call)
  const respond = useMatch(s => s.respond)
  const reset = useMatch(s => s.reset)
  const navigate = useRouter(s => s.navigate)

  const me = 0
  const legal = useMemo(() => state ? legalActions(state, me) : { play: [], calls: [], responses: [] }, [state])
  const profile = useProfile()

  useEffect(() => {
    setSoundEnabled(profile.settings.sound)
  }, [profile.settings.sound])

  useEffect(() => {
    if (!state) navigate('/play-now')
  }, [state, navigate])

  // Record match outcome once when matchOver flips.
  const recordedRef = useRef(false)
  const [reward, setReward] = useState(null)
  useEffect(() => {
    if (!state || !state.matchOver || recordedRef.current) return
    recordedRef.current = true
    const won = state.winnerTeamIdx === state.players[me].teamIdx
    const r = profile.recordMatchEnd({
      won,
      mode: config?.mode || '1v1',
      finalPoints: state.teams[state.players[me].teamIdx].score,
      opponentPoints: state.teams[1 - state.players[me].teamIdx].score,
      handsWon: 0,
      handsLost: 0,
    })
    setReward({ won, ...r })
    playSound(won ? 'matchWin' : 'matchLose')
  }, [state?.matchOver])

  // ---- Hooks must run unconditionally; safe-guard inside them. ------------

  const actor = state ? currentActor(state) : null
  const isHumanActor = actor !== null && state && !state.players[actor]?.isBot
  const maxSecs = isHumanActor ? HUMAN_TIMEOUT : BOT_TIMEOUT

  // Timer per "actor + handIdx + round" key — reset whenever any of these change.
  const timerKey = state ? `${actor}-${state.handIdx}-${state.round}-${state.trucoState.level}-${state.envidoState.calls.length}` : 'idle'
  const [secondsLeft, setSecondsLeft] = useState(maxSecs)

  useEffect(() => {
    setSecondsLeft(maxSecs)
    if (!state || actor === null || state.matchOver || state.handResolved) return
    const tick = setInterval(() => {
      setSecondsLeft(s => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(tick)
  }, [timerKey, maxSecs, state?.matchOver, state?.handResolved])

  // Auto-play for human when time runs out.
  useEffect(() => {
    if (!state || actor !== me || secondsLeft > 0) return
    if (state.envidoState.awaitingResponseFrom === me) {
      respond('no-quiero')
      return
    }
    if (state.trucoState.awaitingResponseFrom === me) {
      respond('no-quiero')
      return
    }
    if (state.turnIdx === me && legal.play.length > 0) {
      play(legal.play[0])
    }
  }, [secondsLeft, actor, state?.handIdx, state?.round])

  // ---- Event overlays (round won, hand won, call) -------------------------
  const [overlay, setOverlay] = useState(null)
  const prevRoundLen = useRef(0)
  const prevHandIdx  = useRef(0)
  const prevCallSig  = useRef('')

  useEffect(() => {
    if (!state) return
    // Round-won
    const rl = state.roundWinners.length
    if (rl > prevRoundLen.current) {
      const w = state.roundWinners[rl - 1]
      if (w !== null) {
        const myTeam = state.players[me].teamIdx
        const title = w === -1 ? 'Parda' : (w === myTeam ? '¡Ganamos la ronda!' : 'Ronda para ellos')
        setOverlay({ kind: 'round', title, subtitle: `Ronda ${rl} de 3`, team: w === -1 ? null : w })
        if (w === myTeam) playSound('roundWin')
        else if (w !== -1) playSound('roundLose')
        const t = setTimeout(() => setOverlay(null), 1300)
        prevRoundLen.current = rl
        return () => clearTimeout(t)
      }
      prevRoundLen.current = rl
    }
  }, [state?.roundWinners.length])

  useEffect(() => {
    if (!state) return
    if (state.handIdx > prevHandIdx.current && prevHandIdx.current !== 0) {
      // Show last team that scored
      const lastScore = state.log.slice().reverse().find(l => l.type === 'score')
      if (lastScore) {
        const team = lastScore.text.startsWith('Nosotros') ? 0 : 1
        setOverlay({ kind: 'hand', title: lastScore.text.split(' (')[0], subtitle: '¡Mano ganada!', team })
        const t = setTimeout(() => setOverlay(null), 1700)
        prevHandIdx.current = state.handIdx
        return () => clearTimeout(t)
      }
    }
    prevHandIdx.current = state.handIdx
  }, [state?.handIdx])

  useEffect(() => {
    if (!state) return
    const ts = state.trucoState
    const es = state.envidoState
    const sig = `${ts.level}-${ts.lastCalledByTeam}-${es.calls.length}-${es.lastCalledByTeam}`
    if (sig === prevCallSig.current) return
    prevCallSig.current = sig
    // The newest call is the last "call" log entry.
    const lastCall = state.log.slice().reverse().find(l => l.type === 'call')
    if (!lastCall) return
    const text = lastCall.text
    // Skip QUIERO/NO QUIERO/MAZO from this dramatic banner — those have their own feedback.
    const t = text.toUpperCase()
    const dramatic = ['TRUCO', 'RETRUCO', 'VALE 4', 'VALE4', 'ENVIDO', 'REAL ENVIDO', 'FALTA ENVIDO']
      .some(k => t.includes(k))
    if (!dramatic) return
    // Determine the team that called from log text — fallback to last caller team.
    const team = ts.lastCalledByTeam ?? es.lastCalledByTeam ?? null
    const callTitle = extractCall(t)
    setOverlay({ kind: 'call', title: callTitle, subtitle: text.split(':')[0], team })
    if (callTitle.includes('TRUCO') || callTitle.includes('VALE') || callTitle.includes('RETRUCO')) {
      playSound('truco')
    } else if (callTitle.includes('ENVIDO')) {
      playSound('envido')
    }
    const tHandle = setTimeout(() => setOverlay(null), 1100)
    return () => clearTimeout(tHandle)
  }, [
    state?.trucoState?.level,
    state?.trucoState?.lastCalledByTeam,
    state?.envidoState?.calls?.length,
    state?.envidoState?.lastCalledByTeam,
  ])

  // ---- Score pulse --------------------------------------------------------
  const [pulseTeams, setPulseTeams] = useState({})
  const prevScores = useRef([0, 0])
  useEffect(() => {
    if (!state) return
    const ns = state.teams.map(t => t.score)
    if (ns[0] > prevScores.current[0]) flashPulse(0)
    if (ns[1] > prevScores.current[1]) flashPulse(1)
    prevScores.current = ns
    function flashPulse(team) {
      setPulseTeams(p => ({ ...p, [team]: Date.now() }))
      setTimeout(() => setPulseTeams(p => {
        const c = { ...p }; delete c[team]; return c
      }), 750)
    }
  }, [state?.teams[0]?.score, state?.teams[1]?.score])

  if (!state) return null

  // ---- Now we can render --------------------------------------------------
  const myHand = state.hands[me] || []
  const seats = layoutPositions(state.players.length)
  const playSpots = playPositions(state.players.length)

  const trucoAwait = state.trucoState.awaitingResponseFrom
  const envidoAwait = state.envidoState.awaitingResponseFrom
  const awaitingResponseFromMe =
    (trucoAwait !== null && state.players[trucoAwait].teamIdx === state.players[me].teamIdx)
    || (envidoAwait !== null && state.players[envidoAwait].teamIdx === state.players[me].teamIdx)
  const myTurn = state.turnIdx === me && !awaitingResponseFromMe

  return (
    <div className="min-h-screen bg-felt relative overflow-hidden flex flex-col select-none">
      {/* HUD top */}
      <header className="px-4 pt-3 pb-2 flex items-center gap-3 z-20 relative">
        <button onClick={() => { reset(); navigate('/home') }}
          className="w-10 h-10 rounded-xl glass grid place-items-center text-lg">‹</button>
        <Scoreboard state={state} pointsTo={config?.pointsTo || 30} pulseTeams={pulseTeams} />
        <div className="flex-1" />
        <RoundIndicator state={state} />
      </header>

      <div className="px-4 z-20 relative">
        <TurnPill state={state} myTurn={myTurn} awaitingResponseFromMe={awaitingResponseFromMe} />
      </div>

      {/* Table */}
      <div className="flex-1 relative">
        <div className="absolute inset-x-4 top-12 bottom-32 rounded-[40%] border border-white/5"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.04), transparent 70%)',
            boxShadow: 'inset 0 0 100px rgba(0,0,0,0.7)',
          }}
        />

        {state.players.map((p, i) => {
          if (i === me) return null
          return (
            <OpponentSeat key={p.id}
              player={p} state={state} idx={i} pos={seats[i]}
              isActor={actor === i}
              secondsLeft={actor === i ? secondsLeft : null}
              maxSecs={actor === i ? maxSecs : null}
            />
          )
        })}

        {state.players.map((p, i) => (
          <PlayStack key={`stack-${p.id}`} state={state} idx={i} spot={playSpots[i]} />
        ))}

        <ManoChip state={state} positions={seats} me={me} />

        {/* My-side timer (when it's my action) */}
        {actor === me && (
          <div className="absolute z-10 left-1/2 -translate-x-1/2 bottom-[180px]">
            <TimerRing secondsLeft={secondsLeft} total={maxSecs} size={48} label="Tu turno"/>
          </div>
        )}

        {state.matchOver && <MatchOverOverlay state={state} reset={reset} navigate={navigate} reward={reward} me={me} />}

        <EventOverlay {...(overlay || {})} />
      </div>

      {/* Bottom HUD: actions + my hand */}
      <div className="z-20 px-4 pb-5 pt-3 bg-gradient-to-t from-black/90 to-transparent relative">
        <ActionBar state={state} legal={legal} call={callAction} respond={respond}
          awaitingResponseFromMe={awaitingResponseFromMe} />

        <div className="flex justify-center items-end gap-2 mt-4 min-h-[124px]">
          {myHand.map((c, i) => {
            const playable = legal.play.includes(c.id)
            const angle = (i - (myHand.length - 1) / 2) * 7
            const lift = Math.abs(angle) / 2
            return (
              <div key={c.id} className="anim-flash-in"
                style={{
                  transform: `rotate(${angle}deg) translateY(${lift}px)`,
                  filter: playable ? 'drop-shadow(0 0 10px rgba(200,249,100,0.5))' : undefined,
                  animationDelay: `${i * 60}ms`,
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

function extractCall(text) {
  const t = text.toUpperCase()
  if (t.includes('VALE 4') || t.includes('VALE4')) return '¡VALE 4!'
  if (t.includes('RETRUCO')) return '¡RETRUCO!'
  if (t.includes('TRUCO')) return '¡TRUCO!'
  if (t.includes('FALTA ENVIDO')) return 'FALTA ENVIDO'
  if (t.includes('REAL ENVIDO')) return 'REAL ENVIDO'
  if (t.includes('ENVIDO')) return '¡ENVIDO!'
  return text
}

/* -------------------------------------------------------------------------- */
/* Sub-components                                                             */
/* -------------------------------------------------------------------------- */

function Scoreboard({ state, pointsTo, pulseTeams }) {
  return (
    <div className="glass rounded-2xl px-3 py-1.5 flex items-center gap-3 text-sm">
      {state.teams.map((t, i) => (
        <div key={t.idx} className="flex items-center gap-2">
          {i === 1 && <div className="w-px h-5 bg-white/15" />}
          <div className={`w-2 h-2 rounded-full ${t.idx === 0 ? 'bg-lime-glow' : 'bg-accent-pink'}`} />
          <span className="text-white/60 text-[10px] uppercase tracking-wider">{t.name}</span>
          <span
            key={pulseTeams[t.idx] || 'static'}
            className={`font-display font-extrabold text-xl leading-none tabular-nums ${pulseTeams[t.idx] ? 'anim-score-pulse' : ''}`}>
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

function OpponentSeat({ player, state, idx, pos, isActor, secondsLeft, maxSecs }) {
  const hand = state.hands[idx] || []
  const teamColor = player.teamIdx === 0 ? 'bg-lime-glow' : 'bg-accent-pink'
  const teamGlow = player.teamIdx === 0 ? 'shadow-[0_0_22px_rgba(200,249,100,0.45)]' : 'shadow-[0_0_22px_rgba(255,61,138,0.45)]'

  return (
    <div className="absolute z-10" style={pos.style}>
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex gap-0.5 mb-0.5">
          {hand.map((_, i) => (
            <div key={i} style={{ transform: `rotate(${(i - (hand.length - 1) / 2) * 8}deg) translateY(${Math.abs((i - (hand.length - 1) / 2) * 4)}px)` }}>
              <Card faceDown size="xs" />
            </div>
          ))}
        </div>
        <div className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full transition ${
          isActor ? `bg-lime-glow text-bg ${teamGlow}` : 'glass text-white/85'
        }`}>
          <div className={`w-7 h-7 rounded-full ${teamColor} grid place-items-center text-bg text-xs font-extrabold`}>
            {(player.name[0] || '?').toUpperCase()}
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xs font-semibold">{player.name}</span>
            <span className="text-[9px] opacity-70 uppercase tracking-wider">{player.teamIdx === 0 ? 'Nosotros' : 'Ellos'}</span>
          </div>
          {isActor && secondsLeft !== null && (
            <div className="ml-1">
              <TimerRing secondsLeft={secondsLeft} total={maxSecs} size={28} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PlayStack({ state, idx, spot }) {
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
            className="absolute anim-card-fly-in"
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
  if (idx === me) return null
  const seat = positions[idx]
  if (!seat) return null
  return (
    <div className="absolute z-10 pointer-events-none" style={seat.style}>
      <div className="flex items-center gap-1 mt-2 ml-12 bg-yellow-300/95 text-bg text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow">
        Mano
      </div>
    </div>
  )
}

function MatchOverOverlay({ state, reset, navigate, reward, me }) {
  const won = reward?.won ?? (state.winnerTeamIdx === state.players[me].teamIdx)
  return (
    <div className="absolute inset-0 grid place-items-center bg-black/85 z-30 backdrop-blur">
      <div className="text-center max-w-sm mx-auto px-6 anim-flash-in">
        <div className="text-7xl mb-3 animate-bounce">{won ? '🏆' : '😔'}</div>
        <h2 className="font-display text-4xl font-extrabold">
          {won ? '¡Victoria!' : 'Derrota'}
        </h2>
        <p className="text-white/60 text-sm mt-1">
          Final: {state.teams[0].score} – {state.teams[1].score}
        </p>
        {reward && (
          <div className="mt-4 glass rounded-2xl p-4 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-sm">Monedas</span>
              <span className="font-display font-extrabold text-yellow-300">+💰 {reward.reward}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-sm">XP</span>
              <span className="font-display font-extrabold text-lime-glow">+{reward.xpGain}</span>
            </div>
            {reward.leveledUp && (
              <div className="flex items-center justify-between border-t border-white/10 pt-2">
                <span className="text-white/70 text-sm">¡Subiste de nivel!</span>
                <span className="font-display font-extrabold text-lime-glow">Nv {reward.level}</span>
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col gap-2 mt-6">
          <button className="btn-primary shine-overlay relative overflow-hidden" onClick={() => { reset(); navigate('/play-now') }}>
            Jugar de nuevo
          </button>
          <button className="btn-ghost" onClick={() => { reset(); navigate('/home') }}>
            Volver al inicio
          </button>
        </div>
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
      { style: { top: '50%', right: '2%', transform: 'translateY(-50%)' } },
      { style: { top: '4%', left: '50%', transform: 'translateX(-50%)' } },
      { style: { top: '50%', left: '2%', transform: 'translateY(-50%)' } },
    ]
  }
  return [
    null,
    { style: { top: '60%', right: '2%', transform: 'translateY(-50%)' } },
    { style: { top: '12%', right: '12%' } },
    { style: { top: '4%', left: '50%', transform: 'translateX(-50%)' } },
    { style: { top: '12%', left: '12%' } },
    { style: { top: '60%', left: '2%', transform: 'translateY(-50%)' } },
  ]
}

function playPositions(n) {
  if (n === 2) {
    return [
      { style: { bottom: '24%', left: '50%', transform: 'translateX(-50%)' }, dx: 6,  dy: -22, rotate: 4 },
      { style: { top: '20%', left: '50%', transform: 'translateX(-50%)' },     dx: -6, dy:  22, rotate: -4 },
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
