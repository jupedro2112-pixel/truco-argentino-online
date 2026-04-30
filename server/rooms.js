// Room manager. Each Room wraps a single match and exposes the same
// mutations the front-end engine accepts.

import {
  createMatch, playCard, callTruco, respondTruco,
  callEnvido, respondEnvido, goToDeck,
} from '../src/game/engine.js'
import { botAct } from '../src/game/ai.js'

const TICK_BOT_MIN_MS = 2000
const TICK_BOT_MAX_MS = 5000

class Room {
  constructor(code, config) {
    this.code = code
    this.config = config
    this.players = []        // { idx, name, socketId, isBot, ready }
    this.started = false
    this.state = null
    this.botTickHandle = null
  }

  capacity() {
    return this.config.mode === '1v1' ? 2 : this.config.mode === '2v2' ? 4 : 6
  }

  isFull() { return this.players.length >= this.capacity() }

  addPlayer(p) {
    this.players.push(p)
    return p
  }

  addBot() {
    const idx = this.players.length
    const bot = { idx, name: `Bot ${idx}`, socketId: null, isBot: true, ready: true }
    this.players.push(bot)
    return bot
  }

  removePlayer(idx) {
    const p = this.players[idx]
    if (!p) return
    p.disconnected = true
    // For now we mark as "abandoned" but do not auto-replace; could add bot fill later.
  }

  start() {
    if (this.started) return
    this.started = true
    this.state = createMatch({
      players: this.players.map(p => ({ id: p.socketId || `bot-${p.idx}`, name: p.name, isBot: p.isBot })),
      mode: this.config.mode,
      pointsTo: this.config.pointsTo,
      withFlor: this.config.withFlor,
    })
    this._scheduleBotIfNeeded()
  }

  applyAction(playerIdx, action) {
    if (!this.started || !this.state) return false
    const s = this.state
    if (!s) return false
    let next = s
    switch (action.type) {
      case 'play':
        next = playCard(s, playerIdx, action.cardId); break
      case 'truco':
      case 'retruco':
      case 'vale4':
        next = callTruco(s, playerIdx, action.type); break
      case 'envido':
      case 'real-envido':
      case 'falta-envido':
        next = callEnvido(s, playerIdx, action.type); break
      case 'mazo':
        next = goToDeck(s, playerIdx); break
      case 'quiero':
      case 'no-quiero':
        if (s.envidoState.awaitingResponseFrom !== null) next = respondEnvido(s, playerIdx, action.type)
        else if (s.trucoState.awaitingResponseFrom !== null) next = respondTruco(s, playerIdx, action.type)
        break
      default:
        return false
    }
    if (next === s) return false
    this.state = next
    this._scheduleBotIfNeeded()
    return true
  }

  _currentActor() {
    const s = this.state
    if (!s || s.matchOver || s.handResolved) return null
    if (s.trucoState.awaitingResponseFrom !== null) return s.trucoState.awaitingResponseFrom
    if (s.envidoState.awaitingResponseFrom !== null) return s.envidoState.awaitingResponseFrom
    return s.turnIdx
  }

  _scheduleBotIfNeeded() {
    if (this.botTickHandle) clearTimeout(this.botTickHandle)
    const actor = this._currentActor()
    if (actor === null) return
    if (!this.state.players[actor]?.isBot) return
    const delay = TICK_BOT_MIN_MS + Math.random() * (TICK_BOT_MAX_MS - TICK_BOT_MIN_MS)
    this.botTickHandle = setTimeout(() => {
      const a = this._currentActor()
      if (a !== actor) return
      this.state = botAct(this.state, actor)
      this._broadcast()
      this._scheduleBotIfNeeded()
    }, delay)
  }

  _broadcast() {
    // Hook the server can override to notify connected clients.
    // We let server/index.js call viewFor() after each action instead.
  }

  viewFor(playerIdx) {
    if (!this.state) return null
    const s = this.state
    return {
      ...s,
      hands: s.hands.map((hand, i) => i === playerIdx ? hand : hand.map(() => null)),
      _viewerIdx: playerIdx,
    }
  }

  lobby() {
    return {
      code: this.code,
      config: this.config,
      capacity: this.capacity(),
      started: this.started,
      players: this.players.map(p => ({
        idx: p.idx, name: p.name, isBot: p.isBot, ready: p.ready, disconnected: !!p.disconnected,
      })),
    }
  }
}

const _rooms = new Map()

export const Rooms = {
  create(code, config) {
    const r = new Room(code, config)
    _rooms.set(code, r)
    return r
  },
  get(code) { return _rooms.get(code) },
  destroy(code) {
    const r = _rooms.get(code)
    if (r?.botTickHandle) clearTimeout(r.botTickHandle)
    _rooms.delete(code)
  },
  size() { return _rooms.size },
}
