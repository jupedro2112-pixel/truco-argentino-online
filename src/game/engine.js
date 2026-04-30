// Truco Argentino game engine.
// Handles a single match between 2 teams (1v1, 2v2 or 3v3) up to 15 or 30 points.
//
// Public surface:
//   createMatch({ players, mode, pointsTo, withFlor })
//   playCard(state, playerIdx, cardId)
//   call(state, playerIdx, callType)        // 'truco', 'retruco', 'vale4', 'envido', 'real-envido', 'falta-envido', 'flor'
//   respond(state, playerIdx, response)     // 'quiero', 'no-quiero'
//   goToDeck(state, playerIdx)              // "me voy al mazo"
//
// Each function returns a NEW state object (immutable update style).
//
// State shape (simplified):
// {
//   mode: '1v1' | '2v2' | '3v3',
//   pointsTo: 15 | 30,
//   withFlor: boolean,
//   players: [{ id, name, teamIdx, isBot }],
//   teams: [{ idx, name, score }],
//   handIdx: number,
//   manoIdx: number,                // player who is "mano" this hand
//   turnIdx: number,                 // whose turn to act
//   hands: [[card, ...], ...],      // hidden hands per player
//   plays: [[card?, card?, card?], ...], // 3 rows × N players (round-by-round table)
//   round: 0 | 1 | 2,
//   roundWinners: [teamIdx | -1],   // -1 = parda (tie)
//   trucoState: { level: 0|1|2|3, lastCalledByTeam, awaitingResponseFrom, currentValue, pendingValue },
//   envidoState: { resolved, awaiting, calls: [...], awaitingResponseFrom, currentValue, pendingValue },
//   florState: { resolved, awaiting, calls: [...] },
//   log: [{ type, text }...],
//   handResolved: boolean,
//   matchOver: boolean,
//   winnerTeamIdx: number | null,
// }

import { buildDeck, shuffle, dealHands } from './deck.js'
import { compareCards } from './ranking.js'
import { envidoOfHand, florOfHand } from './envido.js'

const TEAM_COLORS = ['Nosotros', 'Ellos']

export function createMatch({ players, mode = '1v1', pointsTo = 30, withFlor = false }) {
  const teamCount = 2
  // players length determined by mode
  const playerCount = mode === '1v1' ? 2 : mode === '2v2' ? 4 : 6
  const ps = (players || []).slice(0, playerCount)
  while (ps.length < playerCount) {
    ps.push({ id: `bot-${ps.length}`, name: `Bot ${ps.length}`, isBot: true })
  }
  // Assign teams alternating around the table (standard truco seating)
  ps.forEach((p, i) => { p.teamIdx = i % 2; p.seatIdx = i })

  const teams = Array.from({ length: teamCount }, (_, i) => ({
    idx: i, name: TEAM_COLORS[i], score: 0,
  }))

  const state = {
    mode,
    pointsTo,
    withFlor,
    players: ps,
    teams,
    handIdx: 0,
    manoIdx: 0,
    turnIdx: 0,
    hands: [],
    plays: [],
    round: 0,
    roundWinners: [],
    trucoState: emptyTrucoState(),
    envidoState: emptyEnvidoState(),
    florState: emptyFlorState(),
    log: [],
    handResolved: false,
    matchOver: false,
    winnerTeamIdx: null,
  }
  return startNewHand(state)
}

function emptyTrucoState() {
  return {
    level: 0,                  // 0 none, 1 truco, 2 retruco, 3 vale4
    currentValue: 1,           // pts at stake (1 by default; 2 if quiero al truco; etc.)
    pendingValue: 0,           // pts proposed if accepted next
    lastCalledByTeam: null,
    awaitingResponseFrom: null,
  }
}
function emptyEnvidoState() {
  return {
    resolved: false,           // already resolved (or refused) for this hand
    calls: [],                 // chain of calls e.g. ['envido','envido','real-envido']
    currentValue: 0,           // pts won if accepted now
    notQueridoValue: 0,        // pts won if refused now
    awaitingResponseFrom: null,
    lastCalledByTeam: null,
  }
}
function emptyFlorState() {
  return {
    resolved: false,
    declaredBy: [],            // playerIdxs that have flor + declared
    calls: [],
  }
}

function startNewHand(state) {
  const playerCount = state.players.length
  const deck = shuffle(buildDeck())
  const { hands } = dealHands(deck, playerCount, 3)
  const plays = Array.from({ length: 3 }, () => Array(playerCount).fill(null))

  return {
    ...state,
    hands,
    plays,
    round: 0,
    roundWinners: [],
    trucoState: emptyTrucoState(),
    envidoState: emptyEnvidoState(),
    florState: emptyFlorState(),
    handResolved: false,
    turnIdx: state.manoIdx,
  }
}

// ---- Helpers ---------------------------------------------------------------

function teamOf(state, playerIdx) {
  return state.players[playerIdx].teamIdx
}

function nextPlayer(state, idx) {
  return (idx + 1) % state.players.length
}

function log(state, text, type = 'info') {
  return { ...state, log: [...state.log, { type, text }] }
}

function awardPoints(state, teamIdx, pts, reason) {
  const teams = state.teams.map(t =>
    t.idx === teamIdx ? { ...t, score: t.score + pts } : t
  )
  let s = { ...state, teams }
  s = log(s, `${TEAM_COLORS[teamIdx]} +${pts} (${reason})`, 'score')
  if (teams[teamIdx].score >= state.pointsTo) {
    s = { ...s, matchOver: true, winnerTeamIdx: teamIdx }
    s = log(s, `${TEAM_COLORS[teamIdx]} gana la partida 🏆`, 'match')
  }
  return s
}

// Returns the team that won the round, or -1 for parda. Null if round not finished.
function roundResult(state, roundIdx) {
  const row = state.plays[roundIdx]
  if (row.some(c => c === null)) return null
  // Highest card wins; on tie, parda
  let bestRank = -1
  let winners = [] // playerIdxs
  for (let i = 0; i < row.length; i++) {
    const card = row[i]
    const rank = card ? rankOf(card) : -1
    if (rank > bestRank) { bestRank = rank; winners = [i] }
    else if (rank === bestRank) winners.push(i)
  }
  if (winners.length === 1) return state.players[winners[0]].teamIdx
  // Multiple top players: if all same team, that team; else parda
  const t = state.players[winners[0]].teamIdx
  if (winners.every(i => state.players[i].teamIdx === t)) return t
  return -1
}

function rankOf(card) {
  // Re-implement compareCards as numeric rank for sorting purposes
  // (We re-use compareCards by comparing to a known-low card.)
  // Quick rank: use compareCards against a baseline card and sort.
  return require_rank(card)
}

// Tiny inline ranking, mirroring ranking.js (kept here to avoid CJS/ESM mix)
function require_rank(card) {
  const t = {
    'espada-1': 14, 'basto-1': 13, 'espada-7': 12, 'oro-7': 11,
    'oro-3': 10, 'copa-3': 10, 'espada-3': 10, 'basto-3': 10,
    'oro-2': 9,  'copa-2': 9,  'espada-2': 9,  'basto-2': 9,
    'oro-1': 8,  'copa-1': 8,
    'oro-12': 7, 'copa-12': 7, 'espada-12': 7, 'basto-12': 7,
    'oro-11': 6, 'copa-11': 6, 'espada-11': 6, 'basto-11': 6,
    'oro-10': 5, 'copa-10': 5, 'espada-10': 5, 'basto-10': 5,
    'copa-7': 4,  'basto-7': 4,
    'oro-6': 3, 'copa-6': 3, 'espada-6': 3, 'basto-6': 3,
    'oro-5': 2, 'copa-5': 2, 'espada-5': 2, 'basto-5': 2,
    'oro-4': 1, 'copa-4': 1, 'espada-4': 1, 'basto-4': 1,
  }
  return t[`${card.suit}-${card.number}`] ?? 0
}

// Determine team winning the hand based on rounds played so far.
// Returns teamIdx or null if hand still open.
function handWinner(state) {
  const wins = [0, 0]
  let pardas = 0
  for (const w of state.roundWinners) {
    if (w === -1) pardas++
    else wins[w]++
  }
  // Standard truco rules:
  // - First team to 2 round wins -> wins hand
  // - On parda en primera: who wins second; if also parda, third; if all parda, mano team wins
  // - On parda en segunda after winning first: that team wins
  // - On parda en tercera: who won first wins; if first also parda, mano wins
  if (wins[0] >= 2) return 0
  if (wins[1] >= 2) return 1
  if (state.roundWinners.length === 3) {
    // Resolve with pardas
    const r = state.roundWinners
    // If any non-parda winner exists, prefer team that won first non-parda
    for (const w of r) if (w !== -1) return w
    // All parda -> mano team wins
    return state.players[state.manoIdx].teamIdx
  }
  // Special: parda en primera -> needs second/third
  if (state.roundWinners.length === 2) {
    const [r0, r1] = state.roundWinners
    if (r0 === -1 && r1 !== -1) return r1
    if (r0 !== -1 && r1 === -1) return r0
  }
  return null
}

// ---- Public API ------------------------------------------------------------

export function playCard(state, playerIdx, cardId) {
  if (state.matchOver || state.handResolved) return state
  if (state.turnIdx !== playerIdx) return state
  if (state.trucoState.awaitingResponseFrom !== null) return state
  if (state.envidoState.awaitingResponseFrom !== null) return state

  const hand = state.hands[playerIdx]
  const cardIdx = hand.findIndex(c => c.id === cardId)
  if (cardIdx === -1) return state
  const card = hand[cardIdx]
  const newHand = hand.slice(0, cardIdx).concat(hand.slice(cardIdx + 1))
  const hands = state.hands.map((h, i) => i === playerIdx ? newHand : h)

  const plays = state.plays.map(r => r.slice())
  plays[state.round][playerIdx] = card

  // Once any card is played, envido can no longer be called by anyone.
  let envidoState = state.envidoState
  if (!envidoState.resolved && envidoState.calls.length === 0) {
    envidoState = { ...envidoState, resolved: true }
  }

  let s = { ...state, hands, plays, envidoState }
  s = log(s, `${state.players[playerIdx].name} jugó ${card.number} de ${card.suit}`)

  // Advance turn / round
  const row = plays[state.round]
  const allPlayed = row.every(c => c !== null)
  if (allPlayed) {
    const winnerTeam = roundResult(s, s.round)
    const roundWinners = [...s.roundWinners, winnerTeam]
    s = { ...s, roundWinners }
    s = log(s,
      winnerTeam === -1
        ? `Parda en ronda ${s.round + 1}`
        : `${TEAM_COLORS[winnerTeam]} ganó la ronda ${s.round + 1}`,
      'round'
    )
    const hw = handWinner(s)
    if (hw !== null) {
      s = resolveHand(s, hw)
    } else {
      // Next round; first to play is winner of round (or mano on parda)
      const nextStarter = winnerTeam === -1
        ? s.manoIdx
        : firstOfTeamFromMano(s, winnerTeam)
      s = { ...s, round: s.round + 1, turnIdx: nextStarter }
    }
  } else {
    s = { ...s, turnIdx: nextPlayer(s, playerIdx) }
  }
  return s
}

function firstOfTeamFromMano(state, teamIdx) {
  let i = state.manoIdx
  for (let n = 0; n < state.players.length; n++) {
    if (state.players[i].teamIdx === teamIdx) return i
    i = nextPlayer(state, i)
  }
  return state.manoIdx
}

function resolveHand(state, winningTeam) {
  // Truco points awarded
  const trucoPts = state.trucoState.currentValue || 1
  let s = awardPoints(state, winningTeam, trucoPts, trucoLabel(state.trucoState.level))
  s = { ...s, handResolved: true }
  if (s.matchOver) return s
  // Rotate mano
  const nextMano = nextPlayer(s, s.manoIdx)
  s = { ...s, handIdx: s.handIdx + 1, manoIdx: nextMano }
  return startNewHand(s)
}

function trucoLabel(level) {
  return ['mano', 'truco', 'retruco', 'vale 4'][level] || 'mano'
}

// ---- Truco calls -----------------------------------------------------------

export function callTruco(state, playerIdx, type) {
  if (state.matchOver || state.handResolved) return state
  if (state.envidoState.awaitingResponseFrom !== null) return state
  const ts = state.trucoState
  // Can only escalate one step at a time, and only the team that holds the response can re-raise on quiero.
  const expected = ['truco', 'retruco', 'vale4'][ts.level]
  if (type !== expected) return state
  if (ts.awaitingResponseFrom !== null) return state
  const callerTeam = teamOf(state, playerIdx)
  if (ts.lastCalledByTeam === callerTeam) return state // can't raise on yourself

  const newLevel = ts.level + 1
  const pendingValue = [2, 3, 4][ts.level] // truco=2, retruco=3, vale4=4
  const respondent = firstOpponent(state, callerTeam)
  const trucoState = {
    ...ts,
    level: newLevel,
    pendingValue,
    lastCalledByTeam: callerTeam,
    awaitingResponseFrom: respondent,
  }
  let s = { ...state, trucoState }
  s = log(s, `${state.players[playerIdx].name} canta ${type.toUpperCase()}`, 'call')
  return s
}

function firstOpponent(state, teamIdx) {
  for (let i = 0; i < state.players.length; i++) {
    if (state.players[i].teamIdx !== teamIdx) return i
  }
  return 0
}

export function respondTruco(state, playerIdx, response) {
  const ts = state.trucoState
  if (ts.awaitingResponseFrom === null) return state
  // Any teammate of the awaiting respondent may answer
  if (teamOf(state, playerIdx) !== teamOf(state, ts.awaitingResponseFrom)) return state

  if (response === 'quiero') {
    const trucoState = {
      ...ts,
      currentValue: ts.pendingValue,
      pendingValue: 0,
      awaitingResponseFrom: null,
    }
    let s = { ...state, trucoState }
    s = log(s, `${state.players[playerIdx].name}: QUIERO`, 'call')
    return s
  } else if (response === 'no-quiero') {
    // Awarding team is the one that called. Points = the value before the new call.
    const winnerTeam = ts.lastCalledByTeam
    const pts = ts.currentValue || 1
    let s = { ...state, trucoState: { ...ts, awaitingResponseFrom: null } }
    s = log(s, `${state.players[playerIdx].name}: NO QUIERO`, 'call')
    s = awardPoints(s, winnerTeam, pts, trucoLabel(ts.level - 1) + ' no querido')
    s = { ...s, handResolved: true }
    if (!s.matchOver) {
      const nextMano = nextPlayer(s, s.manoIdx)
      s = { ...s, handIdx: s.handIdx + 1, manoIdx: nextMano }
      s = startNewHand(s)
    }
    return s
  }
  return state
}

// ---- Envido calls ----------------------------------------------------------

const ENVIDO_TYPES = ['envido', 'real-envido', 'falta-envido']

export function callEnvido(state, playerIdx, type) {
  if (state.matchOver || state.handResolved) return state
  if (!ENVIDO_TYPES.includes(type)) return state
  const es = state.envidoState
  if (es.resolved) return state
  // Envido only legal during round 0 and before the round-0 hand is fully played.
  if (state.round !== 0) return state
  // Cannot call envido on yourself (chain rule)
  const callerTeam = teamOf(state, playerIdx)
  if (es.lastCalledByTeam === callerTeam) return state

  const calls = [...es.calls, type]
  const { current, notQuerido } = computeEnvidoValues(calls, state.pointsTo, state.teams)
  const respondent = firstOpponent(state, callerTeam)
  const envidoState = {
    ...es,
    calls,
    currentValue: current,
    notQueridoValue: notQuerido,
    awaitingResponseFrom: respondent,
    lastCalledByTeam: callerTeam,
  }
  let s = { ...state, envidoState }
  s = log(s, `${state.players[playerIdx].name} canta ${labelFor(type)}`, 'call')
  return s
}

function labelFor(type) {
  return {
    'envido': 'ENVIDO',
    'real-envido': 'REAL ENVIDO',
    'falta-envido': 'FALTA ENVIDO',
  }[type] || type.toUpperCase()
}

function computeEnvidoValues(calls, pointsTo, teams) {
  // Values:
  // envido (querido)        +2
  // envido envido (querido) +4
  // envido + real-envido (querido)  +5
  // real-envido alone (querido)     +3
  // falta-envido (querido)  -> points needed for opposing team to reach pointsTo (winning the match)
  // No querido = previous accepted value, or 1 if none.
  let accepted = 0
  let lastNotQuerido = 1
  for (let i = 0; i < calls.length; i++) {
    const c = calls[i]
    const next = accepted + (c === 'envido' ? 2 : c === 'real-envido' ? 3 : 0)
    if (c === 'falta-envido') {
      const maxScore = Math.max(teams[0].score, teams[1].score)
      const faltaPts = Math.max(1, pointsTo - maxScore)
      lastNotQuerido = accepted > 0 ? accepted : 1
      accepted = faltaPts
    } else {
      lastNotQuerido = accepted > 0 ? accepted : 1
      accepted = next
    }
  }
  return { current: accepted, notQuerido: lastNotQuerido }
}

export function respondEnvido(state, playerIdx, response) {
  const es = state.envidoState
  if (es.awaitingResponseFrom === null) return state
  if (teamOf(state, playerIdx) !== teamOf(state, es.awaitingResponseFrom)) return state

  if (response === 'no-quiero') {
    const winnerTeam = es.lastCalledByTeam
    let s = { ...state, envidoState: { ...es, awaitingResponseFrom: null, resolved: true } }
    s = log(s, `${state.players[playerIdx].name}: NO QUIERO al envido`, 'call')
    s = awardPoints(s, winnerTeam, es.notQueridoValue, 'envido no querido')
    return s
  }
  if (response === 'quiero') {
    // Compute envido of every player; highest team wins
    const scores = state.players.map((p, i) => ({
      i, teamIdx: p.teamIdx, value: envidoOfHand(state.hands[i] /* still in hand */ .concat(playedCardsOf(state, i))),
    }))
    let best = -1
    let winnerTeam = null
    let winnerIdx = null
    // Order matters: mano team has priority on tie. Walk from mano forward.
    const order = []
    for (let n = 0; n < state.players.length; n++) order.push((state.manoIdx + n) % state.players.length)
    for (const i of order) {
      const v = scores[i].value
      if (v > best) { best = v; winnerTeam = scores[i].teamIdx; winnerIdx = i }
    }
    let s = { ...state, envidoState: { ...es, awaitingResponseFrom: null, resolved: true } }
    s = log(s, `${state.players[winnerIdx].name} canta ${best} y gana el envido`, 'call')
    s = awardPoints(s, winnerTeam, es.currentValue, 'envido querido')
    return s
  }
  return state
}

function playedCardsOf(state, playerIdx) {
  const out = []
  for (const row of state.plays) {
    if (row[playerIdx]) out.push(row[playerIdx])
  }
  return out
}

// ---- Mazo ------------------------------------------------------------------

export function goToDeck(state, playerIdx) {
  if (state.matchOver || state.handResolved) return state
  const losingTeam = teamOf(state, playerIdx)
  const winningTeam = 1 - losingTeam
  // Points: if truco was called, current value; else 1
  const trucoPts = state.trucoState.currentValue || 1
  // Envido pending? Award envido no-querido too
  let s = state
  if (s.envidoState.awaitingResponseFrom !== null) {
    s = awardPoints(s, s.envidoState.lastCalledByTeam, s.envidoState.notQueridoValue, 'envido no querido (mazo)')
    s = { ...s, envidoState: { ...s.envidoState, awaitingResponseFrom: null, resolved: true } }
  }
  s = awardPoints(s, winningTeam, trucoPts, 'mazo')
  s = log(s, `${state.players[playerIdx].name} se va al mazo`, 'call')
  s = { ...s, handResolved: true }
  if (!s.matchOver) {
    const nextMano = nextPlayer(s, s.manoIdx)
    s = { ...s, handIdx: s.handIdx + 1, manoIdx: nextMano }
    s = startNewHand(s)
  }
  return s
}

// ---- Convenience -----------------------------------------------------------

export function legalActions(state, playerIdx) {
  const out = { play: [], calls: [], responses: [] }
  if (state.matchOver || state.handResolved) return out
  const ts = state.trucoState
  const es = state.envidoState

  if (ts.awaitingResponseFrom !== null) {
    if (teamOf(state, playerIdx) === teamOf(state, ts.awaitingResponseFrom)) {
      out.responses.push('quiero', 'no-quiero')
      // Re-raise: only on truco/retruco
      const next = ['retruco', 'vale4'][ts.level - 1]
      if (next) out.calls.push(next)
    }
    return out
  }
  if (es.awaitingResponseFrom !== null) {
    if (teamOf(state, playerIdx) === teamOf(state, es.awaitingResponseFrom)) {
      out.responses.push('quiero', 'no-quiero')
      // Chain-call: simplified — allow next envido tier
      const last = es.calls[es.calls.length - 1]
      if (last === 'envido') out.calls.push('envido', 'real-envido', 'falta-envido')
      else if (last === 'real-envido') out.calls.push('falta-envido')
    }
    return out
  }
  if (state.turnIdx === playerIdx) {
    out.play = state.hands[playerIdx].map(c => c.id)
  }
  // Truco call (any team member, anytime, if we don't currently hold the call)
  const expected = ['truco', 'retruco', 'vale4'][ts.level]
  if (expected && ts.lastCalledByTeam !== teamOf(state, playerIdx)) {
    out.calls.push(expected)
  }
  // Envido — only round 0, before any envido happened
  if (state.round === 0 && !es.resolved && es.calls.length === 0) {
    out.calls.push('envido', 'real-envido', 'falta-envido')
  }
  // Mazo
  out.calls.push('mazo')
  return out
}
