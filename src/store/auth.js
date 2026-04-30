import { create } from 'zustand'

const KEY = 'truco.auth.user'

const stored = (() => {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null') } catch { return null }
})()

export const useAuth = create((set) => ({
  user: stored,
  signIn: (email) => {
    const username = email?.split('@')[0] || 'jugador'
    const user = { email, username, verified: false, createdAt: Date.now() }
    localStorage.setItem(KEY, JSON.stringify(user))
    set({ user })
  },
  signOut: () => {
    localStorage.removeItem(KEY)
    set({ user: null })
  },
}))
