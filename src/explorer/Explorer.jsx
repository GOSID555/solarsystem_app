import { useCallback, useEffect, useRef, useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'
import SoundToggle from '../audio/SoundToggle'
import { canvasDpr } from '../ui'
import SolarScene from '../components/SolarScene'
import DetailView from '../components/DetailView'
import { BODIES, J2000 } from '../data/planets'
import { detailLayout } from '../layout'
import { PlayIcon, PauseIcon, OrbitIcon, TagIcon, OverviewIcon, ResetIcon, ArrowLeft } from '../components/Icons'

const SPEEDS = [
  { label: '1 วัน', value: 1 },
  { label: '1 สัปดาห์', value: 7 },
  { label: '1 เดือน', value: 30 },
  { label: '6 เดือน', value: 182 },
  { label: '1 ปี', value: 365 },
]

// เวลาจำลองนับเป็น "วันนับจาก J2000" เพื่อให้ตำแหน่งดาวตรงกับท้องฟ้าจริง ณ วันนี้
const TODAY = (Date.now() - J2000) / 86400000
const dayFmt = new Intl.DateTimeFormat('th-TH', { day: 'numeric' })
const monthFmt = new Intl.DateTimeFormat('th-TH', { month: 'long' })
const yearFmt = new Intl.DateTimeFormat('th-TH', { year: 'numeric' })

// แถบโหลดภาพพื้นผิว (ถ้ายังไม่ได้ preload จากหน้าแรก)
function ExplorerLoader() {
  const { progress, active } = useProgress()
  return (
    <div className={`explorer-loader ${active ? '' : 'done'}`}>
      <div className="loader-bar"><span style={{ width: `${progress}%` }} /></div>
      <small>กำลังโหลดภาพพื้นผิวดาว {Math.round(progress)}%</small>
    </div>
  )
}

function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })
  useEffect(() => {
    const on = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return size
}

// โหมดสำรวจระบบสุริยะ 3 มิติ (เมนูแยก)
export default function Explorer({ initial = null, onExit }) {
  const [selected, setSelected] = useState(initial)
  const [arrived, setArrived] = useState(null)
  const [speedIdx, setSpeedIdx] = useState(2)
  const [paused, setPaused] = useState(false)
  const [showOrbits, setShowOrbits] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [simDays, setSimDays] = useState(TODAY)
  const timeRef = useRef(TODAY)
  const labelRefs = useRef({})
  const anchorRefs = useRef({})
  const { w, h } = useWindowSize()
  const onExitRef = useRef(onExit)
  onExitRef.current = onExit

  const onSelect = useCallback((id) => setSelected(id), [])
  const onArrive = useCallback((id) => setArrived(id), [])
  const onTick = useCallback((t) => setSimDays(t), [])

  const index = BODIES.findIndex((b) => b.id === selected)
  const step = (d) => setSelected(BODIES[(index + d + BODIES.length) % BODIES.length].id)

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT') return
      if (e.code === 'Space') { e.preventDefault(); setPaused((p) => !p) }
      if (e.key === 'Escape') setSelected((cur) => (cur ? null : (onExitRef.current(), null)))
      if (e.key === 'o') setShowOrbits((v) => !v)
      if (e.key === 'l') setShowLabels((v) => !v)
      const n = Number(e.key)
      if (e.key.length === 1 && n >= 0 && n <= 8) setSelected(BODIES[n].id)
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        setSelected((cur) => {
          const i = BODIES.findIndex((b) => b.id === cur)
          const d = e.key === 'ArrowRight' ? 1 : -1
          return BODIES[(i + d + BODIES.length) % BODIES.length].id
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const mode = !selected ? 'overview' : arrived === selected ? 'detail' : 'flying'
  const simDate = new Date(J2000 + simDays * 86400000)
  const elapsed = simDays - TODAY
  const current = BODIES[index]

  return (
    <div className={`app mode-${mode}`}>
      <Canvas camera={{ position: [0, 320, 520], fov: 45, near: 0.1, far: 2000 }} dpr={canvasDpr()}>
        <Suspense fallback={null}>
          <SolarScene
            started
            selected={selected}
            onSelect={onSelect}
            onArrive={onArrive}
            speed={SPEEDS[speedIdx].value}
            paused={paused}
            showOrbits={showOrbits && mode !== 'detail'}
            labelRefs={labelRefs}
            anchorRefs={anchorRefs}
            timeRef={timeRef}
            onTick={onTick}
          />
        </Suspense>
      </Canvas>

      <div className="detail-backdrop" />

      {showLabels && (
        <div className="labels overview-only">
          {BODIES.map((b) => (
            <button
              key={b.id}
              ref={(el) => {
                if (el) labelRefs.current[b.id] = el
                else delete labelRefs.current[b.id]
              }}
              className="label"
              style={{ '--c': b.color }}
              onClick={() => setSelected(b.id)}
            >
              <i />{b.name}
            </button>
          ))}
        </div>
      )}

      <header className="brand overview-only">
        <button className="menu-btn" onClick={onExit} aria-label="กลับเมนู"><ArrowLeft /></button>
        <span className="brand-mark" />
        <div>
          <h1>SOLAR<span>SYSTEM</span></h1>
          <p>สำรวจระบบสุริยะแบบ 3 มิติ</p>
        </div>
      </header>

      <div className="date panel overview-only">
        <span className="date-day">{dayFmt.format(simDate)}</span>
        <div>
          <span className="date-month">{monthFmt.format(simDate)}</span>
          <span className="date-year">{yearFmt.format(simDate)}</span>
        </div>
        <span className="date-delta">
          {Math.abs(elapsed) < 365 ? `+${Math.floor(elapsed)} วัน` : `+${(elapsed / 365.25).toFixed(1)} ปี`}
        </span>
      </div>

      <nav className="rail panel overview-only" aria-label="เลือกดาว">
        {BODIES.map((b, i) => (
          <button
            key={b.id}
            className="rail-item"
            style={{ '--c': b.color }}
            onClick={() => setSelected(b.id)}
            title={`${b.nameEn} (กด ${i})`}
          >
            <span className={`orb mini ${b.id === 'sun' ? 'glow' : ''}`} style={{ backgroundImage: `url(${b.texture})` }} />
            <span className="rail-text">
              <b>{b.name}</b>
              <small>{b.nameEn}</small>
            </span>
          </button>
        ))}
      </nav>

      <div className="timebar panel overview-only">
        <button className="play" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'เล่น' : 'หยุด'}>
          {paused ? <PlayIcon /> : <PauseIcon />}
        </button>
        <div className="speed">
          <span className="speed-caption">ความเร็ว ต่อ 1 วินาที</span>
          <div className="segmented">
            {SPEEDS.map((s, i) => (
              <button key={s.value} className={i === speedIdx ? 'on' : ''} onClick={() => setSpeedIdx(i)}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <span className="divider" />
        <div className="tools">
          <button className={`icon-btn ${showOrbits ? 'on' : ''}`} onClick={() => setShowOrbits((v) => !v)} title="วงโคจร (O)">
            <OrbitIcon />
          </button>
          <button className={`icon-btn ${showLabels ? 'on' : ''}`} onClick={() => setShowLabels((v) => !v)} title="ชื่อดาว (L)">
            <TagIcon />
          </button>
          <button className="icon-btn" onClick={() => setSelected(null)} title="มุมมองภาพรวม (Esc)">
            <OverviewIcon />
          </button>
          <button className="icon-btn" onClick={() => { timeRef.current = TODAY; setSimDays(TODAY) }} title="กลับไปวันนี้">
            <ResetIcon />
          </button>
          <SoundToggle className="compact" />
        </div>
      </div>

      <p className="hint overview-only">ลากเพื่อหมุน · สกรอลล์เพื่อซูม · คลิกดาวเพื่อดูรายละเอียด · Space หยุดเวลา</p>

      {mode === 'detail' && (
        <DetailView
          body={current}
          days={simDays}
          layout={detailLayout(w, h)}
          anchorRefs={anchorRefs}
          onBack={() => setSelected(null)}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
        />
      )}

      <ExplorerLoader />
    </div>
  )
}
