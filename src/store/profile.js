import { create } from 'zustand'

const KEY = 'truco.profile.v1'

const DEFAULT_STATE = {
  coins: 1000,
  level: 1,
  xp: 0,
  stats: {
    matchesPlayed: 0,
    matchesWon:    0,
    matchesLost:   0,
    handsWon:      0,
    handsLost:     0,
    biggestWinPts: 0,
    truckosWon:    0,  // truco/retruco/vale4 calls won
    envidosWon:    0,
  },
  avatarId: 'gaucho',
  cardBackId: 'default',
  unlockedAvatars: ['gaucho', 'dama', 'compadre', 'milico'],
  unlockedBacks: ['default'],
  settings: {
    sound: true,
    music: false,
    haptics: true,
  },
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw)
    return { ...DEFAULT_STATE, ...parsed,
      stats: { ...DEFAULT_STATE.stats, ...(parsed.stats || {}) },
      settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) },
    }
  } catch { return DEFAULT_STATE }
}
function save(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {}
}

function xpForLevel(level) { return level * 250 }

export const useProfile = create((set, get) => {
  const initial = load()
  return {
    ...initial,

    addCoins: (amount, reason = '') => {
      const next = { ...get(), coins: get().coins + amount }
      save(next); set({ coins: next.coins })
    },

    spendCoins: (amount) => {
      if (get().coins < amount) return false
      const next = { ...get(), coins: get().coins - amount }
      save(next); set({ coins: next.coins })
      return true
    },

    setAvatar: (id) => {
      if (!get().unlockedAvatars.includes(id)) return
      const next = { ...get(), avatarId: id }
      save(next); set({ avatarId: id })
    },

    setCardBack: (id) => {
      if (!get().unlockedBacks.includes(id)) return
      const next = { ...get(), cardBackId: id }
      save(next); set({ cardBackId: id })
    },

    unlockAvatar: (id) => {
      if (get().unlockedAvatars.includes(id)) return
      const list = [...get().unlockedAvatars, id]
      const next = { ...get(), unlockedAvatars: list }
      save(next); set({ unlockedAvatars: list })
    },

    unlockBack: (id) => {
      if (get().unlockedBacks.includes(id)) return
      const list = [...get().unlockedBacks, id]
      const next = { ...get(), unlockedBacks: list }
      save(next); set({ unlockedBacks: list })
    },

    toggleSetting: (key) => {
      const cur = get().settings
      const settings = { ...cur, [key]: !cur[key] }
      const next = { ...get(), settings }
      save(next); set({ settings })
    },

    recordMatchEnd: ({ won, mode, finalPoints, opponentPoints, handsWon, handsLost }) => {
      const s = get().stats
      const stats = {
        ...s,
        matchesPlayed: s.matchesPlayed + 1,
        matchesWon:    s.matchesWon + (won ? 1 : 0),
        matchesLost:   s.matchesLost + (won ? 0 : 1),
        handsWon:      s.handsWon + (handsWon || 0),
        handsLost:     s.handsLost + (handsLost || 0),
        biggestWinPts: Math.max(s.biggestWinPts, won ? finalPoints : 0),
      }
      const reward = won
        ? Math.round(50 + finalPoints * 6 + (mode === '3v3' ? 60 : mode === '2v2' ? 30 : 0))
        : Math.round(10 + finalPoints * 1.5)
      const xpGain = won ? 80 : 30
      let xp = get().xp + xpGain
      let level = get().level
      while (xp >= xpForLevel(level)) { xp -= xpForLevel(level); level++ }
      const next = { ...get(), stats, coins: get().coins + reward, xp, level }
      save(next); set({ stats, coins: next.coins, xp, level })
      return { reward, xpGain, level, leveledUp: level > get().level }
    },

    reset: () => { save(DEFAULT_STATE); set(DEFAULT_STATE) },
  }
})

export const xpForCurrentLevel = xpForLevel
