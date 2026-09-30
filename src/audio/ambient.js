// เสียงบรรยากาศอวกาศ สังเคราะห์สดด้วย Web Audio API (ไม่ต้องใช้ไฟล์เสียง)
// ประกอบด้วย: เสียงโดรนทุ้ม + คอร์ดแพดที่เปลี่ยนช้าๆ + เสียงกระดิ่งระยิบระยับ + ลมอวกาศเบาๆ
// เบราว์เซอร์อนุญาตให้เริ่มเล่นเสียงได้หลังผู้ใช้แตะหน้าจอเท่านั้น

const STORAGE_KEY = 'solar-sound'
const VOLUME = 0.32

// คอร์ดโทนลึกลับแบบ A minor (Hz)
const CHORDS = [
  [110, 164.81, 196, 246.94],   // Am7 (A E G B)
  [87.31, 130.81, 164.81, 196], // Fmaj7 (F C E G)
  [98, 146.83, 174.61, 220],    // G sus (G D F A)
  [82.41, 123.47, 164.81, 196], // Em7 (E B E G)
]
const SPARKLE = [880, 987.77, 1046.5, 1318.5, 1567.98, 1760, 1975.5, 2093]

let ctx = null
let master = null
let reverb = null
let parts = []
let timers = []
let playing = false
const listeners = new Set()

function readPref() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off'
  } catch {
    return true
  }
}
let enabled = readPref()

function emit() {
  listeners.forEach((fn) => fn())
}

function impulse(seconds = 4, decay = 2.4) {
  const rate = ctx.sampleRate
  const len = rate * seconds
  const buf = ctx.createBuffer(2, len, rate)
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay)
  }
  return buf
}

function setup() {
  ctx = new (window.AudioContext || window.webkitAudioContext)()
  master = ctx.createGain()
  master.gain.value = 0
  const comp = ctx.createDynamicsCompressor()
  master.connect(comp).connect(ctx.destination)

  reverb = ctx.createConvolver()
  reverb.buffer = impulse()
  const wet = ctx.createGain()
  wet.gain.value = 0.55
  reverb.connect(wet).connect(master)
}

// ---------- ชั้นเสียง ----------
function drone() {
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 420
  filter.Q.value = 3
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.frequency.value = 0.045
  lfoGain.gain.value = 260
  lfo.connect(lfoGain).connect(filter.frequency)
  lfo.start()

  const g = ctx.createGain()
  g.gain.value = 0.16
  filter.connect(g)
  g.connect(master)
  g.connect(reverb)

  const oscs = [[55, 'sine', 0], [55, 'sawtooth', 7], [82.41, 'triangle', -5], [110, 'sine', 3]].map(([f, type, cents]) => {
    const o = ctx.createOscillator()
    o.type = type
    o.frequency.value = f
    o.detune.value = cents
    const og = ctx.createGain()
    og.gain.value = type === 'sawtooth' ? 0.12 : 0.5
    o.connect(og).connect(filter)
    o.start()
    return o
  })
  return { stop: () => [...oscs, lfo].forEach((o) => o.stop()) }
}

function wind() {
  const len = ctx.sampleRate * 3
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buf
  src.loop = true
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 500
  bp.Q.value = 0.8
  const lfo = ctx.createOscillator()
  const lg = ctx.createGain()
  lfo.frequency.value = 0.06
  lg.gain.value = 350
  lfo.connect(lg).connect(bp.frequency)
  const g = ctx.createGain()
  g.gain.value = 0.025
  src.connect(bp).connect(g).connect(reverb)
  src.start()
  lfo.start()
  return { stop: () => { src.stop(); lfo.stop() } }
}

function playChord(freqs) {
  const now = ctx.currentTime
  const dur = 14
  freqs.forEach((f, i) => {
    const o = ctx.createOscillator()
    o.type = i % 2 ? 'triangle' : 'sine'
    o.frequency.value = f * 2
    const vib = ctx.createOscillator()
    const vg = ctx.createGain()
    vib.frequency.value = 0.2 + Math.random() * 0.2
    vg.gain.value = 1.5
    vib.connect(vg).connect(o.detune)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0, now)
    g.gain.linearRampToValueAtTime(0.03, now + 5)
    g.gain.linearRampToValueAtTime(0.03, now + dur - 5)
    g.gain.linearRampToValueAtTime(0, now + dur)
    const pan = ctx.createStereoPanner()
    pan.pan.value = (i / (freqs.length - 1)) * 1.2 - 0.6
    o.connect(g).connect(pan)
    pan.connect(reverb)
    pan.connect(master)
    o.start(now)
    vib.start(now)
    o.stop(now + dur + 0.1)
    vib.stop(now + dur + 0.1)
  })
}

function sparkle() {
  const now = ctx.currentTime
  const f = SPARKLE[Math.floor(Math.random() * SPARKLE.length)]
  const o = ctx.createOscillator()
  o.type = 'sine'
  o.frequency.value = f
  const o2 = ctx.createOscillator()
  o2.type = 'sine'
  o2.frequency.value = f * 2.01
  const g = ctx.createGain()
  g.gain.setValueAtTime(0, now)
  g.gain.linearRampToValueAtTime(0.02, now + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, now + 3.5)
  const g2 = ctx.createGain()
  g2.gain.value = 0.25
  const pan = ctx.createStereoPanner()
  pan.pan.value = Math.random() * 1.6 - 0.8
  o.connect(g)
  o2.connect(g2).connect(g)
  g.connect(pan).connect(reverb)
  o.start(now)
  o2.start(now)
  o.stop(now + 3.6)
  o2.stop(now + 3.6)
}

function schedule() {
  let chord = 0
  const nextChord = () => {
    if (!playing) return
    playChord(CHORDS[chord % CHORDS.length])
    chord++
    timers.push(setTimeout(nextChord, 11000))
  }
  const nextSparkle = () => {
    if (!playing) return
    sparkle()
    timers.push(setTimeout(nextSparkle, 1800 + Math.random() * 4200))
  }
  nextChord()
  timers.push(setTimeout(nextSparkle, 2500))
}

// ---------- API ----------
export async function start() {
  if (playing) return
  if (!ctx) setup()
  if (ctx.state === 'suspended') await ctx.resume()
  playing = true
  parts = [drone(), wind()]
  schedule()
  const now = ctx.currentTime
  master.gain.cancelScheduledValues(now)
  master.gain.setValueAtTime(master.gain.value, now)
  master.gain.linearRampToValueAtTime(VOLUME, now + 3)
  emit()
}

export function stop() {
  if (!playing) return
  playing = false
  timers.forEach(clearTimeout)
  timers = []
  const now = ctx.currentTime
  master.gain.cancelScheduledValues(now)
  master.gain.setValueAtTime(master.gain.value, now)
  master.gain.linearRampToValueAtTime(0, now + 1.2)
  const old = parts
  parts = []
  setTimeout(() => old.forEach((p) => p.stop()), 1300)
  emit()
}

export function setEnabled(on) {
  enabled = on
  try {
    localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off')
  } catch {
    // ไม่มี localStorage ก็แค่จำค่าไม่ได้
  }
  if (on) start()
  else stop()
  emit()
}

// เรียกตอนผู้ใช้แตะหน้าจอ: ถ้าเปิดเสียงไว้ ให้เริ่มเล่น
export function startIfEnabled() {
  if (enabled) start()
}

export function getState() {
  return { enabled, playing }
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
