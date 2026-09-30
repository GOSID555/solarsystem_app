import { useEffect, useState, lazy, Suspense } from 'react'
import Home from './components/Home'
import Hub from './learn/Hub'
import Lesson from './learn/Lesson'
import { startIfEnabled } from './audio/ambient'

// โหมด 3D โหลดแยก เพราะ three.js ใหญ่ ไม่ต้องรอตอนเปิดหน้าบทเรียน
const Explorer = lazy(() => import('./explorer/Explorer'))

// router แบบง่ายด้วย hash เพื่อให้ปุ่มย้อนกลับของเบราว์เซอร์ใช้ได้
// ''            → หน้าปก
// #menu         → เมนูหลัก
// #explore/mars → สำรวจ 3D (เลือกดาวได้)
// #lesson/<id>  → บทเรียน
function useRoute() {
  const [hash, setHash] = useState(window.location.hash.slice(1))
  useEffect(() => {
    const on = () => setHash(window.location.hash.slice(1))
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const go = (to) => {
    window.location.hash = to
  }
  const [name, arg] = hash.split('/')
  return { name: name || 'home', arg, go }
}

export default function App() {
  const { name, arg, go } = useRoute()

  // เบราว์เซอร์ไม่ให้เล่นเสียงเองอัตโนมัติ จึงเริ่มเสียงบรรยากาศเมื่อผู้ใช้แตะหน้าจอครั้งแรก
  useEffect(() => {
    const first = (e) => {
      // ถ้าแตะที่ปุ่มเสียงเอง ให้ปุ่มจัดการ ไม่งั้นจะเปิดแล้วปิดทันที
      if (!e.target?.closest?.('.sound-btn')) startIfEnabled()
      window.removeEventListener('pointerdown', first)
      window.removeEventListener('keydown', first)
    }
    window.addEventListener('pointerdown', first)
    window.addEventListener('keydown', first)
    return () => {
      window.removeEventListener('pointerdown', first)
      window.removeEventListener('keydown', first)
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [name, arg])

  if (name === 'explore') {
    return (
      <Suspense fallback={<div className="page-fallback" />}>
        <Explorer key={arg ?? 'all'} initial={arg ?? null} onExit={() => go('menu')} />
      </Suspense>
    )
  }
  if (name === 'lesson') return <Lesson id={arg} go={go} />
  if (name === 'menu') return <Hub go={go} />
  return <Home onStart={() => go('menu')} />
}
