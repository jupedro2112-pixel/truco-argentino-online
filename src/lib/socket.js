// Lazy Socket.IO client wrapper. The URL comes from VITE_SOCKET_URL.
// If the env var is not set, online mode is disabled and the UI guides
// the user toward offline play vs bots.

import { io } from 'socket.io-client'

let _socket = null

export function getSocketUrl() {
  return import.meta.env.VITE_SOCKET_URL || ''
}

export function isOnlineEnabled() {
  return Boolean(getSocketUrl())
}

export function getSocket() {
  if (_socket) return _socket
  const url = getSocketUrl()
  if (!url) return null
  _socket = io(url, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
  })
  return _socket
}

export function disconnectSocket() {
  if (_socket) {
    _socket.disconnect()
    _socket = null
  }
}
