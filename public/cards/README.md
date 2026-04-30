# Custom Card Deck (optional)

The game ships with original SVG card art rendered in code. If you want to use
a different deck (for example a public-domain Spanish deck of your choice),
drop image files into this folder named:

```
{suit}-{number}.{ext}    e.g. oro-1.png, espada-7.svg, copa-12.svg
{suit}-back.{ext}        for the card back, e.g. oro-back.svg
```

Suits: `oro`, `copa`, `espada`, `basto`
Numbers: `1, 2, 3, 4, 5, 6, 7, 10, 11, 12`
Extensions accepted: `svg`, `png`, `webp`, `jpg`

Then enable the image deck by setting in `src/cardConfig.js`:

```js
export const USE_IMAGE_DECK = true
export const CARD_IMAGE_EXT = 'svg'   // or 'png', 'webp', etc.
```

If a specific card image fails to load, the renderer automatically falls back
to the built-in SVG so the game keeps working.

**Make sure you have rights** to whatever artwork you put here. There are
public-domain and Creative Commons Spanish decks available; respect their
license terms (attribution, share-alike, etc.).
