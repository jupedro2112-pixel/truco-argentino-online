// Spanish 40-card deck used in Truco Argentino.
// Suits: oro (gold), copa (cups), espada (swords), basto (clubs).
// Numbers: 1, 2, 3, 4, 5, 6, 7, 10, 11, 12  (no 8/9 in the 40-card deck).

export const SUITS = ['oro', 'copa', 'espada', 'basto']
export const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12]

export const SUIT_LABEL = {
  oro: 'Oro',
  copa: 'Copa',
  espada: 'Espada',
  basto: 'Basto',
}

export const SUIT_GLYPH = {
  oro: '●',
  copa: '♥',
  espada: '⚔',
  basto: '♣',
}

export function buildDeck() {
  const deck = []
  for (const suit of SUITS) {
    for (const number of NUMBERS) {
      deck.push({ suit, number, id: `${suit}-${number}` })
    }
  }
  return deck
}

export function shuffle(deck, rng = Math.random) {
  const a = deck.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function dealHands(deck, numPlayers, cardsEach = 3) {
  const hands = Array.from({ length: numPlayers }, () => [])
  let idx = 0
  for (let c = 0; c < cardsEach; c++) {
    for (let p = 0; p < numPlayers; p++) {
      hands[p].push(deck[idx++])
    }
  }
  return { hands, remaining: deck.slice(idx) }
}
