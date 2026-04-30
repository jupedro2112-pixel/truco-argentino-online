// Very basic bot — picks a random legal card, plays it. Responds "quiero" half the time.
import { legalActions, playCard, respondTruco, respondEnvido } from './engine.js'

export function botAct(state, playerIdx) {
  const legal = legalActions(state, playerIdx)
  if (legal.responses.length > 0) {
    // 70% quiero on envido, 60% on truco
    const r = Math.random()
    const choice = r < 0.65 ? 'quiero' : 'no-quiero'
    if (state.envidoState.awaitingResponseFrom === playerIdx
        || legal.responses.length > 0 && state.envidoState.awaitingResponseFrom !== null) {
      return respondEnvido(state, playerIdx, choice)
    }
    return respondTruco(state, playerIdx, choice)
  }
  if (legal.play.length > 0) {
    const cardId = legal.play[Math.floor(Math.random() * legal.play.length)]
    return playCard(state, playerIdx, cardId)
  }
  return state
}
