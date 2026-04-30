# Truco — Server

Servidor multijugador con Socket.IO.

## Correr local

```bash
cd server
npm install
npm run dev
```

El server queda escuchando en `:4000`.

En el front-end, exportá `VITE_SOCKET_URL=http://localhost:4000` antes de `npm run dev` para que el cliente se conecte ahí.

## Deploy en Render

1. **New +** → **Web Service** → conectá el mismo repo.
2. **Root Directory**: `server`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. **Environment**: Node
6. **Plan**: Free está OK para probar (se duerme tras 15min de inactividad).
7. Variables de entorno:
   - `CORS_ORIGIN` = la URL del Static Site (ej: `https://truco-argentino-online.onrender.com`)
8. Una vez deployado, copiá la URL pública (ej: `https://truco-server.onrender.com`).

Después en el Static Site, agregá la variable:
- `VITE_SOCKET_URL` = la URL del Web Service

Y redeploy del Static Site para que el front-end apunte al server.

## API (events)

Cliente → server:
- `create({ name, mode, pointsTo, withFlor }, ack)` → crea sala
- `join({ code, name }, ack)` → entra
- `toggle-ready` → marca/desmarca listo
- `add-bot` → host agrega bot
- `start` → host inicia partida
- `action({ type, cardId })` → jugada/canto/respuesta

Server → cliente:
- `lobby({ code, config, players, started })` → estado de la sala
- `state(view)` → estado actual del juego (con la mano del jugador visible)
