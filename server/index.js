// Truco Argentino — multiplayer Socket.IO server.
// Deployed independently as a Render Web Service. The static front-end
// connects via VITE_SOCKET_URL (set on the front-end deploy env).

import http from 'node:http'
import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import { nanoid } from 'nanoid'
import { Rooms } from './rooms.js'

const PORT = process.env.PORT || 4000
const ALLOW_ORIGIN = process.env.CORS_ORIGIN || '*'

const app = express()
app.use(cors({ origin: ALLOW_ORIGIN }))
app.get('/', (_req, res) => res.json({ ok: true, service: 'truco-online', rooms: Rooms.size() }))
app.get('/health', (_req, res) => res.send('ok'))

const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: ALLOW_ORIGIN, methods: ['GET', 'POST'] },
})

io.on('connection', (socket) => {
  let joinedRoom = null
  let me = null

  const sync = (room) => {
    // Send each player a "view" of the state hiding everyone else's hands.
    for (const p of room.players) {
      const view = room.viewFor(p.idx)
      io.to(p.socketId).emit('state', view)
    }
    io.to(room.code).emit('lobby', room.lobby())
  }

  socket.on('create', ({ name, mode = '1v1', pointsTo = 30, withFlor = false }, ack) => {
    const code = nanoid(5).toUpperCase()
    const room = Rooms.create(code, { mode, pointsTo, withFlor })
    me = { idx: 0, name: name || 'Jugador', socketId: socket.id, isBot: false, ready: true }
    room.addPlayer(me)
    socket.join(code)
    joinedRoom = code
    ack?.({ ok: true, code })
    sync(room)
  })

  socket.on('join', ({ code, name }, ack) => {
    const room = Rooms.get(code)
    if (!room) return ack?.({ ok: false, error: 'Sala no encontrada' })
    if (room.isFull()) return ack?.({ ok: false, error: 'Sala llena' })
    if (room.started) return ack?.({ ok: false, error: 'Partida ya empezó' })
    me = { idx: room.players.length, name: name || `Jugador ${room.players.length + 1}`,
           socketId: socket.id, isBot: false, ready: false }
    room.addPlayer(me)
    socket.join(code)
    joinedRoom = code
    ack?.({ ok: true, code })
    sync(room)
  })

  socket.on('toggle-ready', () => {
    const room = Rooms.get(joinedRoom); if (!room || !me) return
    me.ready = !me.ready
    sync(room)
    if (room.isFull() && room.players.every(p => p.ready)) {
      room.start()
      sync(room)
    }
  })

  socket.on('add-bot', () => {
    const room = Rooms.get(joinedRoom); if (!room || !me) return
    if (me.idx !== 0) return // only host can add bots
    if (room.isFull()) return
    room.addBot()
    sync(room)
  })

  socket.on('start', () => {
    const room = Rooms.get(joinedRoom); if (!room || !me) return
    if (me.idx !== 0) return
    if (!room.isFull()) return
    room.start()
    sync(room)
  })

  socket.on('action', (action) => {
    const room = Rooms.get(joinedRoom); if (!room || !me) return
    const ok = room.applyAction(me.idx, action)
    if (ok) sync(room)
  })

  socket.on('disconnect', () => {
    const room = Rooms.get(joinedRoom); if (!room || !me) return
    room.removePlayer(me.idx)
    if (room.players.filter(p => !p.isBot).length === 0) {
      Rooms.destroy(joinedRoom)
      return
    }
    sync(room)
  })
})

server.listen(PORT, () => {
  console.log(`Truco server listening on :${PORT}`)
})
