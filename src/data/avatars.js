// Catalog of avatars. Each one is rendered by Avatar.jsx using `id`.
// Original art — simple stylized portraits.

export const AVATARS = [
  { id: 'gaucho',   name: 'Gaucho',   price: 0,    rarity: 'common'    },
  { id: 'dama',     name: 'Dama',     price: 0,    rarity: 'common'    },
  { id: 'compadre', name: 'Compadre', price: 0,    rarity: 'common'    },
  { id: 'milico',   name: 'Milico',   price: 0,    rarity: 'common'    },
  { id: 'tanguero', name: 'Tanguero', price: 500,  rarity: 'rare'      },
  { id: 'china',    name: 'China',    price: 500,  rarity: 'rare'      },
  { id: 'pibe',     name: 'Pibe',     price: 800,  rarity: 'rare'      },
  { id: 'jefa',     name: 'Jefa',     price: 1500, rarity: 'epic'      },
  { id: 'mago',     name: 'Mago',     price: 2500, rarity: 'epic'      },
  { id: 'rey',      name: 'Rey',      price: 5000, rarity: 'legendary' },
]

export const AVATAR_BY_ID = Object.fromEntries(AVATARS.map(a => [a.id, a]))

export const RARITY_RING = {
  common:    'ring-white/20',
  rare:      'ring-blue-400/60',
  epic:      'ring-fuchsia-400/70',
  legendary: 'ring-yellow-300',
}

export const RARITY_GLOW = {
  common:    '',
  rare:      'shadow-[0_0_18px_rgba(96,165,250,0.4)]',
  epic:      'shadow-[0_0_24px_rgba(232,121,249,0.45)]',
  legendary: 'shadow-[0_0_28px_rgba(253,224,71,0.55)]',
}
