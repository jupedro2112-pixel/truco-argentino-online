import { create } from 'zustand'
import {
  createMatch, playCard, callTruco, respondTruco,
  callEnvido, respondEnvido, goToDeck,
} from '../game/engine.js'
import { botAct } from '../game/ai.js'

// Returns the playerIdx whose action the game is waiting on, or null.
export function currentActor(state) {
  if (!state || state.matchOver || state.handResolved) return null
  if (state.trucoState.awaitingResponseFrom !== null) return state.trucoState.awaitingResponseFrom
  if (state.envidoState.awaitingResponseFrom !== null) return state.envidoState.awaitingResponseFrom
  return state.turnIdx
}

export const useMatch = create((set, get) => ({
  state: null,
  config: null,

  start: ({ mode, pointsTo, withFlor, you }) => {
    const playerCount = mode === '1v1' ? 2 : mode === '2v2' ? 4 : 6
    const players = []
    for (let i = 0; i < playerCount; i++) {
      if (i === 0) players.push({ id: 'me', name: you?.username || 'Vos', isBot: false })
      else players.push({ id: `bot-${i}`, name: `Bot ${i}`, isBot: true })
    }
    const state = createMatch({ players, mode, pointsTo, withFlor })
    set({ state, config: { mode, pointsTo, withFlor } })
    setTimeout(() => get()._scheduleBotIfNeeded(), 800)
  },

  play: (cardId) => {
    const s = get().state
    if (!s) return
    set({ state: playCard(s, 0, cardId) })
    get()._scheduleBotIfNeeded()
  },

  call: (type) => {
    const s = get().state
    if (!s) return
    if (type === 'mazo') {
      set({ state: goToDeck(s, 0) })
    } else if (type === 'truco' || type === 'retruco' || type === 'vale4') {
      set({ state: callTruco(s, 0, type) })
    } else if (type === 'envido' || type === 'real-envido' || type === 'falta-envido') {
      set({ state: callEnvido(s, 0, type) })
    }
    get()._scheduleBotIfNeeded()
  },

  respond: (response) => {
    const s = get().state
    if (!s) return
    let next = s
    if (s.envidoState.awaitingResponseFrom !== null) {
      next = respondEnvido(s, 0, response)
    } else if (s.trucoState.awaitingResponseFrom !== null) {
      next = respondTruco(s, 0, response)
    }
    set({ state: next })
    get()._scheduleBotIfNeeded()
  },

  reset: () => set({ state: null, config: null }),

  _scheduleBotIfNeeded: () => {
    const s = get().state
    if (!s || s.matchOver) return
    const actor = currentActor(s)
    if (actor === null) return
    const player = s.players[actor]
    if (!player?.isBot) return

    // Bots act in 2.0–5.0 seconds so the timer ring is visible.
    const delay = 2000 + Math.random() * 3000

    setTimeout(() => {
      const now = get().state
      if (!now || now.matchOver) return
      // Only act if the same actor is still up — user might have done something.
      if (currentActor(now) !== actor) return
      const next = botAct(now, actor)
      set({ state: next })
      get()._scheduleBotIfNeeded()
    }, delay)
  },
}))
