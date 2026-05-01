import { useState } from 'react'
import { useAuth } from '../store/auth.js'
import { useProfile } from '../store/profile.js'
import { useRouter } from '../store/router.js'
import { AVATARS, RARITY_RING } from '../data/avatars.js'
import Avatar from '../components/Avatar.jsx'
import BottomNav from '../components/BottomNav.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import IconButton from '../components/ui/IconButton.jsx'
import Icon from '../components/Icon.jsx'
import Button from '../components/ui/Button.jsx'
import Panel from '../components/ui/Panel.jsx'
import Pill from '../components/ui/Pill.jsx'
import CoinBadge from '../components/ui/CoinBadge.jsx'

const RARITY_TEXT = {
  common:    'text-ink-300',
  rare:      'text-blue-300',
  epic:      'text-fuchsia-300',
  legendary: 'text-gold-300',
}

export default function Profile() {
  const user = useAuth(s => s.user)
  const profile = useProfile()
  const navigate = useRouter(s => s.navigate)
  const [tab, setTab] = useState('stats')

  if (!user) { navigate('/sign-in'); return null }

  const winRate = profile.stats.matchesPlayed
    ? Math.round((profile.stats.matchesWon / profile.stats.matchesPlayed) * 100)
    : 0
  const xpNext = profile.level * 250
  const xpPct = Math.min(100, Math.round((profile.xp / xpNext) * 100))

  return (
    <div className="min-h-screen bg-stage pb-28 relative">
      <PageHeader title="Perfil" back="/home"
        right={<IconButton icon="settings" size="sm" onClick={() => navigate('/settings')} />} />

      {/* Hero */}
      <div className="max-w-2xl mx-auto px-5 mt-5 relative z-10 animate-fade-up">
        <Panel className="relative overflow-hidden p-5">
          <div className="absolute inset-0 opacity-40 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 0% 0%, rgba(200,249,100,0.25), transparent 60%)' }}/>
          <div className="relative flex items-center gap-4">
            <div className="relative">
              <Avatar id={profile.avatarId} size={92}/>
              <span className="absolute -bottom-1 -right-1 px-2 h-7 rounded-full bg-gold-gradient grid place-items-center font-display font-extrabold text-ink-900 text-xs ring-2 ring-ink-900 tabular-nums">
                Nv {profile.level}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display font-extrabold text-2xl truncate">{user.username}</h2>
              <p className="text-2xs text-ink-400 mt-0.5">{user.email}</p>
              <div className="mt-3 h-2 bg-ink-700 rounded-full overflow-hidden">
                <div className="h-full bg-brand-gradient" style={{ width: `${xpPct}%` }} />
              </div>
              <p className="text-2xs text-ink-400 mt-1 tabular-nums">{profile.xp} / {xpNext} XP</p>
            </div>
            <CoinBadge amount={profile.coins} size="md" onClick={() => navigate('/shop')}/>
          </div>
        </Panel>
      </div>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-5 mt-5 relative z-10">
        <div className="panel-raised flex p-1 gap-1">
          {[
            ['stats',   'Estadísticas'],
            ['avatars', 'Avatares'],
          ].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`flex-1 py-2 rounded-lg text-sm font-display font-bold tracking-tight transition ${
                tab === k ? 'bg-lime-glow text-ink-900' : 'text-ink-300 hover:text-ink-100'
              }`}>{l}</button>
          ))}
        </div>
      </div>

      {tab === 'stats' && (
        <div className="max-w-2xl mx-auto px-5 mt-4 grid grid-cols-2 gap-3 relative z-10">
          <Stat label="Partidas"       value={profile.stats.matchesPlayed} icon="cards" />
          <Stat label="Victorias"      value={profile.stats.matchesWon}    icon="trophy" tone="gold" />
          <Stat label="Win rate"       value={`${winRate}%`}               icon="bolt"   tone="brand" />
          <Stat label="Manos ganadas"  value={profile.stats.handsWon}      icon="check" />
          <Stat label="Mayor victoria" value={`${profile.stats.biggestWinPts} pts`} icon="flame" />
          <Stat label="Trucos ganados" value={profile.stats.truckosWon}    icon="swords" />
        </div>
      )}

      {tab === 'avatars' && (
        <div className="max-w-2xl mx-auto px-5 mt-4 relative z-10">
          <div className="grid grid-cols-3 gap-3">
            {AVATARS.map(a => {
              const owned = profile.unlockedAvatars.includes(a.id)
              const active = profile.avatarId === a.id
              return (
                <Panel key={a.id} className={`p-3 text-center ${active ? 'ring-2 ring-lime-glow' : ''}`}>
                  <div className="grid place-items-center pt-1">
                    <Avatar id={a.id} size={68}/>
                  </div>
                  <p className="font-display font-bold text-sm mt-2.5 leading-none">{a.name}</p>
                  <p className={`text-2xs uppercase tracking-widest mt-1 ${RARITY_TEXT[a.rarity]}`}>{a.rarity}</p>
                  {owned ? (
                    <Button variant={active ? 'primary' : 'dark'} size="sm" fullWidth
                      disabled={active}
                      onClick={() => profile.setAvatar(a.id)}
                      className="mt-2.5">
                      {active ? 'En uso' : 'Usar'}
                    </Button>
                  ) : (
                    <Button variant="gold" size="sm" fullWidth
                      disabled={profile.coins < a.price}
                      onClick={() => {
                        if (profile.spendCoins(a.price)) {
                          profile.unlockAvatar(a.id)
                          profile.setAvatar(a.id)
                        }
                      }}
                      className="mt-2.5"
                      iconLeft="coin">
                      {a.price.toLocaleString('es-AR')}
                    </Button>
                  )}
                </Panel>
              )
            })}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}

function Stat({ label, value, icon, tone }) {
  const ringCls = {
    brand: 'border-lime-glow/30 shadow-glow-brand',
    gold:  'border-gold-300/30 shadow-glow-gold',
  }[tone] || 'border-white/[0.04]'
  const iconCls = {
    brand: 'text-lime-glow',
    gold:  'text-gold-300',
  }[tone] || 'text-ink-200'
  return (
    <div className={`stat-tile relative overflow-hidden border ${ringCls}`}>
      <div className="flex items-start justify-between">
        <Icon name={icon} size={20} className={iconCls}/>
        <span className="section-eyebrow">{label}</span>
      </div>
      <p className="stat-num mt-1">{value}</p>
    </div>
  )
}
