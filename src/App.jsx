import { useEffect } from 'react'
import { useRouter } from './store/router.js'
import { useAuth } from './store/auth.js'
import Splash from './pages/Splash.jsx'
import SignIn from './pages/SignIn.jsx'
import Register from './pages/Register.jsx'
import Home from './pages/Home.jsx'
import PlayNow from './pages/PlayNow.jsx'
import CreateRoom from './pages/CreateRoom.jsx'
import Ranking from './pages/Ranking.jsx'
import GameTable from './pages/GameTable.jsx'
import Deck from './pages/Deck.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'
import Shop from './pages/Shop.jsx'
import Lobby from './pages/Lobby.jsx'
import OnlineMatch from './pages/OnlineMatch.jsx'

const ROUTES = [
  { match: /^\/$/,             c: Splash },
  { match: /^\/sign-in/,       c: SignIn },
  { match: /^\/register/,      c: Register },
  { match: /^\/home/,          c: Home },
  { match: /^\/play-now/,      c: PlayNow },
  { match: /^\/create-room/,   c: CreateRoom },
  { match: /^\/ranking/,       c: Ranking },
  { match: /^\/match/,         c: GameTable },
  { match: /^\/deck/,          c: Deck },
  { match: /^\/profile/,       c: Profile },
  { match: /^\/settings/,      c: Settings },
  { match: /^\/shop/,          c: Shop },
  { match: /^\/lobby/,         c: Lobby },
  { match: /^\/online-match/,  c: OnlineMatch },
]

export default function App() {
  const path = useRouter(s => s.path)
  const navigate = useRouter(s => s.navigate)
  const user = useAuth(s => s.user)

  useEffect(() => {
    if (!window.location.hash) navigate('/')
  }, [navigate])

  const cleanPath = path.split('?')[0]
  const publicPath = ['/', '/sign-in', '/register'].some(p => cleanPath === p || cleanPath.startsWith(p + '/'))
  if (!user && !publicPath) {
    if (cleanPath !== '/sign-in') {
      setTimeout(() => navigate('/sign-in'), 0)
    }
    return null
  }

  const route = ROUTES.find(r => r.match.test(cleanPath))
  const Comp = route ? route.c : Splash
  return <Comp />
}
