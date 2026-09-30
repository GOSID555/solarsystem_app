import { useEffect, useMemo, useState } from 'react'
import { ChevronRight } from './Icons'
import { BODIES } from '../data/planets'
import SoundToggle from '../audio/SoundToggle'

// ภาพทั้งหมดที่หน้า 3D ใช้ — โหลดล่วงหน้าไว้ใน cache ของเบราว์เซอร์ระหว่างอยู่หน้าปก
const TEXTURES = [
  ...new Set(
    BODIES.flatMap((b) => [b.texture, b.clouds, b.ring?.map, ...(b.satellites ?? []).map((s) => s.texture)]).filter(Boolean),
  ),
]

function usePreload(urls) {
  const [loaded, setLoaded] = useState(0)
  useEffect(() => {
    let alive = true
    urls.forEach((url) => {
      const img = new Image()
      img.onload = img.onerror = () => alive && setLoaded((n) => n + 1)
      img.src = url
    })
    return () => {
      alive = false
    }
  }, [urls])
  return (Math.min(loaded, urls.length) / urls.length) * 100
}

// หน้าปก: พื้นดำ ดาวระยิบระยับ ขอบฟ้าของดาวเคราะห์ และปุ่มเริ่ม
// โหลดภาพไปพร้อมกัน ปุ่มจะกดได้เมื่อโหลดเสร็จ
export default function Home({ onStart }) {
  const progress = usePreload(TEXTURES)
  const ready = progress === 100
  const [leaving, setLeaving] = useState(false)

  const stars = useMemo(
    () =>
      Array.from({ length: 140 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: Math.random() < 0.9 ? 1 : 2,
        d: Math.random() * 6,
        o: 0.3 + Math.random() * 0.7,
      })),
    [],
  )

  const start = () => {
    if (!ready || leaving) return
    setLeaving(true)
    setTimeout(onStart, 900)
  }

  useEffect(() => {
    const onKey = (e) => e.key === 'Enter' && start()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className={`home ${leaving ? 'leaving' : ''}`}>
      <div className="home-stars">
        {stars.map((s) => (
          <i
            key={s.id}
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, '--o': s.o, animationDelay: `${s.d}s` }}
          />
        ))}
      </div>

      <div className="home-planet" />

      <div className="home-content">
        <span className="home-eyebrow">An interactive journey · 3D</span>
        <h1 className="home-title">
          SOLAR
          <span>SYSTEM</span>
        </h1>
        <p className="home-sub">เรียนรู้เรื่องดาว ดวงจันทร์ และระบบสุริยะ<br />วิทยาศาสตร์ ป.5 – ป.6 แบบเห็นภาพ ลองเล่นได้จริง</p>

        <button className={`start-btn ${ready ? 'ready' : ''}`} onClick={start} disabled={!ready}>
          {ready ? (
            <>
              เริ่มสำรวจ <ChevronRight />
            </>
          ) : (
            <>
              <span className="start-progress" style={{ width: `${progress}%` }} />
              <span className="start-label">กำลังเตรียมยาน {Math.round(progress)}%</span>
            </>
          )}
        </button>
        <small className="home-hint">{ready ? 'หรือกด Enter' : ' '}</small>
      </div>

      <SoundToggle className="floating" />

      <footer className="home-footer">Planet textures: Solar System Scope (CC BY 4.0) · three.js · Photos: NASA & Wikimedia Commons</footer>
    </div>
  )
}
