// Truco card hierarchy (higher number = stronger card).
// 1 de espada > 1 de basto > 7 de espada > 7 de oro > resto.

const RANK_TABLE = {
  // Top "matadores"
  'espada-1': 14,
  'basto-1':  13,
  'espada-7': 12,
  'oro-7':    11,
  // Threes, twos
  'oro-3': 10, 'copa-3': 10, 'espada-3': 10, 'basto-3': 10,
  'oro-2': 9,  'copa-2': 9,  'espada-2': 9,  'basto-2': 9,
  // "Anchos falsos" (1 de oro/copa)
  'oro-1': 8,  'copa-1': 8,
  // Reys, caballos, sotas
  'oro-12': 7, 'copa-12': 7, 'espada-12': 7, 'basto-12': 7,
  'oro-11': 6, 'copa-11': 6, 'espada-11': 6, 'basto-11': 6,
  'oro-10': 5, 'copa-10': 5, 'espada-10': 5, 'basto-10': 5,
  // Sevens of copa/basto (lower than 7 falso)
  'copa-7': 4,  'basto-7': 4,
  // 6, 5, 4 (no special hierarchy, by number)
  'oro-6': 3, 'copa-6': 3, 'espada-6': 3, 'basto-6': 3,
  'oro-5': 2, 'copa-5': 2, 'espada-5': 2, 'basto-5': 2,
  'oro-4': 1, 'copa-4': 1, 'espada-4': 1, 'basto-4': 1,
}

export function cardRank(card) {
  return RANK_TABLE[`${card.suit}-${card.number}`] ?? 0
}

// Returns -1, 0, or 1 (a < b, tie, a > b)
export function compareCards(a, b) {
  const ra = cardRank(a)
  const rb = cardRank(b)
  if (ra < rb) return -1
  if (ra > rb) return 1
  return 0
}
