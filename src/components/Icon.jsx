// Single icon component. Pass `name` and an optional `size` / `className`.
// All icons are 24x24 viewBox, stroke 1.8, currentColor.

const PATHS = {
  back:    <path d="M15 6l-6 6 6 6" />,
  close:   <><path d="M6 6l12 12"/><path d="M18 6l-6 6-6 6"/></>,
  home:    <path d="M3 11l9-8 9 8M5 9.5V20a1 1 0 0 0 1 1h4v-7h4v7h4a1 1 0 0 0 1-1V9.5"/>,
  play:    <path d="M7 5v14l12-7L7 5z" fill="currentColor" stroke="none"/>,
  cards:   <><rect x="4" y="6" width="11" height="14" rx="2"/><path d="M9 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2"/></>,
  shop:    <><path d="M5 8h14l-1 11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 8z"/><path d="M9 8a3 3 0 0 1 6 0"/></>,
  trophy:  <><path d="M8 4h8v3a4 4 0 1 1-8 0V4z"/><path d="M8 4H4v0a4 4 0 0 0 4 4M16 4h4v0a4 4 0 0 1-4 4"/><path d="M9 14h6l-1 4h-4l-1-4zM8 21h8"/></>,
  user:    <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  settings:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
  bell:    <><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
  coin:    <><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 9l3 3 3-3M15 15l-3-3-3 3"/></>,
  bolt:    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" fill="currentColor" stroke="none"/>,
  swords:  <><path d="M14.5 17.5L4 7V4h3l10.5 10.5"/><path d="M21 21l-7.5-7.5M21 4v3h-3M11.5 14.5L4 22"/></>,
  users:   <><circle cx="9" cy="8" r="3.2"/><path d="M3 21a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.6"/><path d="M14 21a5 5 0 0 1 7 0"/></>,
  trio:    <><circle cx="12" cy="7" r="2.6"/><circle cx="6" cy="11" r="2.4"/><circle cx="18" cy="11" r="2.4"/><path d="M2 21a4 4 0 0 1 8 0M14 21a4 4 0 0 1 8 0M8 21a4 4 0 0 1 8 0"/></>,
  arrow:   <path d="M5 12h14M13 6l6 6-6 6"/>,
  plus:    <><path d="M12 5v14"/><path d="M5 12h14"/></>,
  minus:   <path d="M5 12h14"/>,
  check:   <path d="M5 12.5l5 5L20 7"/>,
  eye:     <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></>,
  eyeoff:  <><path d="M3 3l18 18"/><path d="M10.6 10.6A2 2 0 0 0 12 14a2 2 0 0 0 2-2 2 2 0 0 0-.6-1.4M9 5.5A10 10 0 0 1 22 12a17 17 0 0 1-2.5 3.6M6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a10 10 0 0 0 4.4-1"/></>,
  mail:    <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></>,
  lock:    <><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>,
  google: 'google',
  music:   <><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>,
  speaker: <><path d="M11 5L7 9H4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h3l4 4z"/><path d="M16 9c1.6 1.4 1.6 4.6 0 6M19 6c3 2.5 3 9.5 0 12"/></>,
  shield:  <path d="M12 3l8 4v6c0 5-3.5 8-8 8s-8-3-8-8V7l8-4z"/>,
  star:    <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" fill="currentColor" stroke="none"/>,
  sparkle: <path d="M12 3l1.6 5L19 9.5 14 12l-1 6-2-6L5 12l5-2z" fill="currentColor" stroke="none"/>,
  flame:   <path d="M12 3c1 4 5 5 5 9a5 5 0 0 1-10 0c0-3 2-4 2-7 1 1 2 2 3-2z"/>,
  clock:   <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  globe:   <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18"/></>,
  lightning:<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" fill="currentColor" stroke="none"/>,
  copy:    <><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></>,
  logout:  <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></>,
  diamond: <path d="M12 2l9 9-9 11L3 11z"/>,
  crown:   <path d="M3 18l3-12 4 6 2-8 2 8 4-6 3 12z"/>,
}

export default function Icon({ name, size = 20, className = '', stroke = 1.8 }) {
  const inner = PATHS[name]
  if (!inner) return null
  if (inner === 'google') return <GoogleColor size={size} />
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}
      fill="none" stroke="currentColor" strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden>
      {inner}
    </svg>
  )
}

function GoogleColor({ size }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-11.3 8 12 12 0 1 1 7.8-21.1l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7A20 20 0 0 0 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.5 5A20 20 0 0 0 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C41.4 35.6 44 30.2 44 24c0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
  )
}
