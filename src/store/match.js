import { create } from 'zustand'
import {
  createMatch, playCard, callTruco, respondTruco,
  callEnvido, respondEnvido, goToDeck,
} from '../game/engine.js'
import { botAct } from '../game/ai.js'

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
  },

  play: (cardId) => {
    const s = get().state
    if (!s) return
    set({ state: playCard(s, 0, cardId) })
    get()._tickBots()
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
    get()._tickBots()
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
    get()._tickBots()
  },

  reset: () => set({ state: null, config: null }),

  _tickBots: () => {
    // Drive bots until it's a human's action again or hand resolved.
    let s = get().state
    let safety = 50
    const advance = () => {
      while (safety-- > 0) {
        if (!s || s.matchOver) break
        const ts = s.trucoState
        const es = s.envidoState
        // If awaiting a human response, stop.
        if (ts.awaitingResponseFrom !== null) {
          if (!s.players[ts.awaitingResponseFrom].isBot) break
          s = botAct(s, ts.awaitingResponseFrom)
          continue
        }
        if (es.awaitingResponseFrom !== null) {
          if (!s.players[es.awaitingResponseFrom].isBot) break
          s = botAct(s, es.awaitingResponseFrom)
          continue
        }
        // Otherwise act for whoever's turn it is, if bot.
        const p = s.players[s.turnIdx]
        if (!p) break
        if (!p.isBot) break
        s = botAct(s, s.turnIdx)
      }
      set({ state: s })
    }
    // Animate slightly
    setTimeout(advance, 600)
  },
}))
