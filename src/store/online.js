import { create } from 'zustand'
import { getSocket } from '../lib/socket.js'

export const useOnline = create((set, get) => ({
  socket: null,
  connected: false,
  lobby: null,           // { code, config, players, started }
  state: null,           // game view from server
  error: null,

  connect: () => {
    const s = getSocket()
    if (!s) { set({ error: 'Servidor online no configurado (falta VITE_SOCKET_URL)' }); return }
    if (get().socket) return
    s.on('connect',    () => set({ connected: true, error: null }))
    s.on('disconnect', () => set({ connected: false }))
    s.on('lobby', lobby => set({ lobby }))
    s.on('state', state => set({ state }))
    s.on('connect_error', e => set({ error: 'No se pudo conectar al servidor' }))
    set({ socket: s })
  },

  create: (opts) => new Promise((resolve, reject) => {
    const s = get().socket
    if (!s) return reject('No conectado')
    s.emit('create', opts, (resp) => {
      if (resp?.ok) resolve(resp.code)
      else reject(resp?.error || 'Error')
    })
  }),

  join: (code, name) => new Promise((resolve, reject) => {
    const s = get().socket
    if (!s) return reject('No conectado')
    s.emit('join', { code, name }, (resp) => {
      if (resp?.ok) resolve(resp.code)
      else reject(resp?.error || 'Error')
    })
  }),

  toggleReady: () => get().socket?.emit('toggle-ready'),
  addBot:      () => get().socket?.emit('add-bot'),
  start:       () => get().socket?.emit('start'),
  action:      (a) => get().socket?.emit('action', a),

  reset: () => set({ lobby: null, state: null, error: null }),
}))
