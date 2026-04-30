// All sounds are synthesized at runtime via Web Audio API.
// No external audio files are bundled or fetched — every tone is generated
// from oscillators and gain envelopes here.

let ctx = null
function getCtx() {
  if (typeof window === 'undefined') return null
  if (ctx) return ctx
  const C = window.AudioContext || window.webkitAudioContext
  if (!C) return null
  ctx = new C()
  return ctx
}

function envelope(node, ac, attack, hold, release, peak = 0.25) {
  const t = ac.currentTime
  node.gain.setValueAtTime(0, t)
  node.gain.linearRampToValueAtTime(peak, t + attack)
  node.gain.setValueAtTime(peak, t + attack + hold)
  node.gain.linearRampToValueAtTime(0, t + attack + hold + release)
}

function tone({ freq = 440, type = 'sine', duration = 0.18, peak = 0.22, freqEnd, detune = 0 }) {
  const ac = getCtx(); if (!ac) return
  if (ac.state === 'suspended') ac.resume()
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, ac.currentTime)
  if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, ac.currentTime + duration)
  osc.detune.value = detune
  osc.connect(gain).connect(ac.destination)
  envelope(gain, ac, 0.005, Math.max(0, duration - 0.06), 0.05, peak)
  osc.start()
  osc.stop(ac.currentTime + duration + 0.1)
}

function chord(freqs, opts = {}) {
  freqs.forEach((f, i) => setTimeout(() => tone({ freq: f, ...opts }), i * 35))
}

function sequence(notes, opts = {}) {
  notes.forEach((n, i) => setTimeout(() => tone({ ...opts, freq: n.f, duration: n.d || 0.16 }), n.t))
}

export const Sounds = {
  cardPlay() {
    tone({ freq: 380, type: 'triangle', duration: 0.08, peak: 0.18, freqEnd: 240 })
  },
  cardSelect() {
    tone({ freq: 720, type: 'sine', duration: 0.06, peak: 0.12 })
  },
  click() {
    tone({ freq: 600, type: 'square', duration: 0.04, peak: 0.08 })
  },
  truco() {
    // Bold rising chord
    chord([330, 415, 523], { type: 'sawtooth', duration: 0.32, peak: 0.18 })
    setTimeout(() => tone({ freq: 660, type: 'square', duration: 0.16, peak: 0.14 }), 180)
  },
  envido() {
    chord([392, 523, 659], { type: 'triangle', duration: 0.28, peak: 0.18 })
  },
  quiero() {
    tone({ freq: 523, type: 'triangle', duration: 0.1, peak: 0.18 })
    setTimeout(() => tone({ freq: 659, type: 'triangle', duration: 0.14, peak: 0.18 }), 90)
  },
  noQuiero() {
    tone({ freq: 330, type: 'sawtooth', duration: 0.18, peak: 0.16, freqEnd: 196 })
  },
  roundWin() {
    sequence([
      { t: 0,   f: 523, d: 0.12 },
      { t: 110, f: 659, d: 0.12 },
      { t: 220, f: 784, d: 0.16 },
    ], { type: 'triangle', peak: 0.2 })
  },
  roundLose() {
    sequence([
      { t: 0,   f: 392, d: 0.18 },
      { t: 180, f: 294, d: 0.22 },
    ], { type: 'sawtooth', peak: 0.15 })
  },
  matchWin() {
    sequence([
      { t: 0,   f: 523, d: 0.14 },
      { t: 130, f: 659, d: 0.14 },
      { t: 260, f: 784, d: 0.14 },
      { t: 390, f: 1047, d: 0.28 },
    ], { type: 'triangle', peak: 0.22 })
    setTimeout(() => chord([523, 659, 784, 1047], { type: 'sine', duration: 0.55, peak: 0.16 }), 420)
  },
  matchLose() {
    sequence([
      { t: 0,   f: 392, d: 0.18 },
      { t: 180, f: 330, d: 0.18 },
      { t: 360, f: 262, d: 0.32 },
    ], { type: 'sawtooth', peak: 0.16 })
  },
  coin() {
    tone({ freq: 988, type: 'square', duration: 0.06, peak: 0.16 })
    setTimeout(() => tone({ freq: 1318, type: 'square', duration: 0.12, peak: 0.16 }), 60)
  },
  timerWarn() {
    tone({ freq: 880, type: 'sine', duration: 0.07, peak: 0.1 })
  },
}

let enabled = true
export function setSoundEnabled(v) { enabled = !!v }
export function play(name, ...args) {
  if (!enabled) return
  const fn = Sounds[name]
  if (typeof fn === 'function') {
    try { fn(...args) } catch {}
  }
}
