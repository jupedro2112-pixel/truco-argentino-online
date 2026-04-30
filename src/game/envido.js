// Envido scoring for Truco Argentino.
// - For envido purposes, figuras (10, 11, 12) count as 0.
// - Numbers 1..7 count as their face value.
// - If 2+ cards share a suit: envido = 20 + sum of the two highest values of that suit.
// - If no two cards share a suit: envido = highest single card value.

const ENVIDO_VALUE = {
  1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7,
  10: 0, 11: 0, 12: 0,
}

export function envidoOfHand(hand) {
  // Group by suit
  const bySuit = {}
  for (const c of hand) {
    if (!bySuit[c.suit]) bySuit[c.suit] = []
    bySuit[c.suit].push(ENVIDO_VALUE[c.number])
  }

  let best = 0
  let pairFound = false
  for (const suit of Object.keys(bySuit)) {
    const vals = bySuit[suit].sort((a, b) => b - a)
    if (vals.length >= 2) {
      const score = 20 + vals[0] + vals[1]
      if (score > best) best = score
      pairFound = true
    }
  }
  if (!pairFound) {
    // No pair of same suit: highest single card value
    let highest = 0
    for (const c of hand) {
      const v = ENVIDO_VALUE[c.number]
      if (v > highest) highest = v
    }
    best = highest
  }
  return best
}

// Flor: 3 cards of same suit. Returns flor value (20 + sum of all 3 values) or null.
export function florOfHand(hand) {
  if (hand.length !== 3) return null
  const s = hand[0].suit
  if (!hand.every(c => c.suit === s)) return null
  return 20 + hand.reduce((acc, c) => acc + ENVIDO_VALUE[c.number], 0)
}
