import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import {
  CONSTELLATIONS, ZODIAC, OTHERS, BRIGHT_STARS, ECLIPTIC,
  altAz, centroid, localSiderealDeg, thaiDate, bestMonth,
} from '../constellations'

const MONTHS = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
const MONTHS_SHORT = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
const FACINGS = [
  { az: 0, name: 'เหนือ', short: 'N' },
  { az: 90, name: 'ตะวันออก', short: 'E' },
  { az: 180, name: 'ใต้', short: 'S' },
  { az: 270, name: 'ตะวันตก', short: 'W' },
]
const DIR8 = ['เหนือ', 'ตะวันออกเฉียงเหนือ', 'ตะวันออก', 'ตะวันออกเฉียงใต้', 'ใต้', 'ตะวันตกเฉียงใต้', 'ตะวันตก', 'ตะวันตกเฉียงเหนือ']
const dirName = (az) => DIR8[Math.round(az / 45) % 8]
const angleGap = (a, b) => Math.abs(((a - b + 540) % 360) - 180)
const fmtTime = (m) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')} น.`
const shortName = (c) => c.name.replace('กลุ่มดาว', '')
const YEAR = new Date().getFullYear()

const R = 220

// ท้องฟ้า 3 มิติใช้ three.js ซึ่งไฟล์ใหญ่ จึงโหลดแยกเมื่อเปิดดูเท่านั้น
const SkyDome3D = lazy(() => import('./SkyDome3D'))

// แผนที่ดาวแบบวงกลม: กึ่งกลาง = จุดเหนือศีรษะ, ขอบวง = ขอบฟ้า
// ทิศเหนืออยู่บน ตะวันออกอยู่ "ซ้าย" เพราะเรายกแผนที่ขึ้นดูเหนือศีรษะ
function project(alt, az) {
  const r = (R * (90 - alt)) / 90
  const a = (az * Math.PI) / 180
  return [-r * Math.sin(a), -r * Math.cos(a)]
}

const MISSIONS = [
  { id: 'dipper', target: 'กลุ่มดาวจระเข้', title: 'หาดาวเหนือจากกลุ่มดาวจระเข้', month: 3, time: 21 * 60, fact: 'ดาวเหนืออยู่สูงจากขอบฟ้าประมาณ 14° เท่ากับละติจูดของกรุงเทพฯ และอยู่เกือบตรงทิศเหนือตลอดทั้งคืน' },
  { id: 'orion', target: 'กลุ่มดาวนายพราน', title: 'หากลุ่มดาวนายพราน', month: 1, time: 20 * 60, fact: 'ช่วงหัวค่ำเดือนกุมภาพันธ์ นายพรานอยู่สูงเกือบเหนือศีรษะทางทิศใต้ สังเกตดาวไถ 3 ดวงเรียงกันได้ง่าย' },
  { id: 'scorpius', target: 'กลุ่มดาวแมงป่อง', title: 'หากลุ่มดาวแมงป่อง', month: 6, time: 21 * 60, fact: 'ดาวแอนทาเรสสีแดงคือ “หัวใจแมงป่อง” หางของแมงป่องโค้งลงไปทางขอบฟ้าทิศใต้' },
]

function MiniFigure({ c }) {
  const { ra: ra0, dec: dec0 } = centroid(c)
  const cos0 = Math.cos((dec0 * Math.PI) / 180)
  const pts = Object.fromEntries(
    c.stars.map((st) => {
      let dra = st.ra - ra0
      if (dra > 12) dra -= 24
      if (dra < -12) dra += 24
      return [st.id, [-dra * 15 * cos0, -(st.dec - dec0), st.mag]]
    }),
  )
  const xs = Object.values(pts).map((p) => p[0])
  const ys = Object.values(pts).map((p) => p[1])
  const w = Math.max(...xs) - Math.min(...xs) || 1
  const h = Math.max(...ys) - Math.min(...ys) || 1
  const k = Math.min(100 / w, 64 / h)
  const tx = (x) => 60 + (x - (Math.max(...xs) + Math.min(...xs)) / 2) * k
  const ty = (y) => 40 + (y - (Math.max(...ys) + Math.min(...ys)) / 2) * k
  return (
    <svg viewBox="0 0 120 80" className="mini-fig">
      {c.lines.map(([a, b]) => (
        <line key={a + b} x1={tx(pts[a][0])} y1={ty(pts[a][1])} x2={tx(pts[b][0])} y2={ty(pts[b][1])} stroke={c.color} strokeOpacity=".6" />
      ))}
      {Object.entries(pts).map(([id, [x, y, m]]) => (
        <circle key={id} cx={tx(x)} cy={ty(y)} r={Math.max(1, 3.4 - m * 0.5)} fill="#fff" />
      ))}
    </svg>
  )
}

export default function Constellations() {
  const [month, setMonth] = useState(1)
  const [minutes, setMinutes] = useState(20 * 60)
  const [facing, setFacing] = useState(180)
  const [view, setView] = useState('3d')
  // ทิศที่กล้อง 3 มิติจะหันไป (เปลี่ยนเมื่อกดปุ่มทิศหรือเลือกกลุ่มดาว)
  const [look, setLook] = useState({ alt: 35, az: 180 })
  const [show, setShow] = useState({ lines: true, names: true, ecliptic: false, pointer: false })
  const [selected, setSelected] = useState('orion')
  const [mission, setMission] = useState(0)
  const [done, setDone] = useState([])
  const mapRef = useRef(null)

  const lst = localSiderealDeg(thaiDate(YEAR, month, 15, minutes))

  const sky = useMemo(() => {
    const cons = CONSTELLATIONS.map((c) => {
      const stars = Object.fromEntries(
        c.stars.map((st) => {
          const p = altAz(st.ra, st.dec, lst)
          return [st.id, { ...st, ...p, xy: project(p.alt, p.az) }]
        }),
      )
      const cen = centroid(c)
      const cp = altAz(cen.ra, cen.dec, lst)
      return { ...c, starsPos: stars, cen: { ...cp, xy: project(cp.alt, cp.az) } }
    })
    const bright = BRIGHT_STARS.map((st) => {
      const p = altAz(st.ra, st.dec, lst)
      return { ...st, ...p, xy: project(p.alt, p.az) }
    })
    const ecl = []
    let seg = []
    ECLIPTIC.forEach((pt) => {
      const p = altAz(pt.ra, pt.dec, lst)
      if (p.alt > 0) seg.push(project(p.alt, p.az))
      else if (seg.length) {
        ecl.push(seg)
        seg = []
      }
    })
    if (seg.length) ecl.push(seg)
    return { cons, bright, ecl }
  }, [lst])

  const sel = sky.cons.find((c) => c.id === selected)
  const selUp = sel && sel.cen.alt > 0
  const toggle = (k) => setShow((v) => ({ ...v, [k]: !v[k] }))
  const rot = facing - 180

  const nearestFacing = (az) => FACINGS.reduce((best, f) => (angleGap(f.az, az) < angleGap(best.az, az) ? f : best)).az

  const faceTo = (az) => {
    setFacing(az)
    setLook({ alt: 35, az })
  }

  const goBest = (c) => {
    const b = bestMonth(c, YEAR)
    setMonth(b.month)
    setMinutes(21 * 60)
    const cen = centroid(c)
    const p = altAz(cen.ra, cen.dec, localSiderealDeg(thaiDate(YEAR, b.month, 15, 21 * 60)))
    setFacing(nearestFacing(p.az))
    setLook({ alt: Math.min(p.alt, 70), az: p.az })
  }

  const pick = (id, scroll) => {
    setSelected(id)
    // ในโหมด 3 มิติ หันกล้องไปหากลุ่มดาวที่เลือก (ถ้าอยู่เหนือขอบฟ้า)
    const c = sky.cons.find((x) => x.id === id)
    if (c && c.cen.alt > 0) setLook({ alt: Math.min(c.cen.alt, 75), az: c.cen.az })
    if (scroll) mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  // ตรวจภารกิจจากสถานะปัจจุบันของแผนที่
  const m = MISSIONS[mission]
  const mCon = sky.cons.find((c) => c.id === m.id)
  const checks = [
    { label: `ตั้งวันที่เป็น 15 ${MONTHS[m.month]}`, ok: month === m.month },
    { label: `ตั้งเวลาเป็น ${fmtTime(m.time)}`, ok: Math.abs(minutes - m.time) <= 30 },
    { label: 'หันหน้าไปทางทิศที่กลุ่มดาวอยู่', ok: mCon.cen.alt > 0 && angleGap(facing, mCon.cen.az) <= 60 },
    { label: `แตะที่${m.target}บนแผนที่`, ok: selected === m.id },
  ]
  const missionOk = checks.every((c) => c.ok)
  useEffect(() => {
    if (missionOk) setDone((d) => (d.includes(mission) ? d : [...d, mission]))
  }, [missionOk, mission])

  const dipper = sky.cons.find((c) => c.id === 'dipper')
  const polaris = sky.bright[0]

  return (
    <>
      {/* ---------- วิธีใช้แผนที่ดาว ---------- */}
      <section className="stage">
        <div className="stage-head">
          <div>
            <h2>วิธีใช้แผนที่ดาว</h2>
            <p>แผนที่ดาวบอกว่าในวันและเวลาที่เราดู มีดาวและกลุ่มดาวอะไรอยู่ตรงไหนบนท้องฟ้า</p>
          </div>
        </div>
        <div className="howto">
          {[
            { n: 1, t: 'เตรียมตัว', d: 'รู้วันที่และเวลาที่จะดู และหาทิศเหนือให้ได้ (ใช้เข็มทิศ หรือจำตำแหน่งที่ดวงอาทิตย์ตก = ทิศตะวันตก)' },
            { n: 2, t: 'หมุนแผนที่ให้ตรงวันและเวลา', d: 'หมุนแผ่นแผนที่ให้ “วันที่” ตรงกับ “เวลา” ที่ขอบแผ่น ช่องวงกลมจะแสดงเฉพาะดาวที่อยู่เหนือขอบฟ้าตอนนั้น' },
            { n: 3, t: 'หันหน้า แล้วยกแผนที่ขึ้น', d: 'หันหน้าไปทิศที่ต้องการดู ยกแผนที่ขึ้นเหนือศีรษะ ให้อักษรทิศนั้นอยู่ด้านล่าง (ใกล้ขอบฟ้าที่เรามอง)' },
            { n: 4, t: 'เทียบดาวบนฟ้า', d: 'ขอบวงกลม = ขอบฟ้า กึ่งกลาง = จุดเหนือศีรษะ หาดาวที่สว่างที่สุดก่อน แล้วลากเส้นหากลุ่มดาว' },
          ].map((s) => (
            <div className="howto-step" key={s.n} style={{ '--i': s.n }}>
              <span className="howto-n">{s.n}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
        <div className="tip-box">
          <b>ทำไมทิศตะวันออกกับตะวันตกบนแผนที่ดาวถึงสลับกัน?</b>
          <p>แผนที่ทั่วไปใช้มองลงพื้น แต่แผนที่ดาวใช้ยกขึ้นมองฟ้า เมื่อหันหน้าไปทิศเหนือแล้วเงยหน้า ทิศตะวันออกจะอยู่ทางขวามือ แต่เมื่อดูแผนที่จากด้านล่าง ตะวันออกจึงอยู่ทางซ้ายของแผ่น · เคล็ดลับ: ใช้ไฟฉายแสงสีแดงส่องแผนที่ ตาจะยังปรับกับความมืดได้ดี</p>
        </div>
      </section>

      {/* ---------- แผนที่ดาวแบบโต้ตอบ ---------- */}
      <section className="stage" ref={mapRef}>
        <div className="stage-head">
          <div>
            <h2>{view === '3d' ? 'ท้องฟ้าจำลอง 3 มิติ' : 'แผนที่ดาว 2 มิติ'} · ท้องฟ้ากรุงเทพฯ</h2>
            <p>
              {view === '3d'
                ? 'คุณยืนอยู่ตรงกลาง ลากเพื่อหมุนมองรอบตัว เงยดูเหนือศีรษะ หรือกดปุ่มทิศเพื่อหันไปทางนั้น'
                : 'ตั้งวัน เวลา และทิศที่หันหน้า แผนที่จะหมุนให้ทิศนั้นอยู่ด้านล่างเหมือนตอนยกแผนที่ขึ้นดูจริง'}
            </p>
          </div>
          <div className="seg-tabs">
            <button className={view === '3d' ? 'on' : ''} onClick={() => setView('3d')}>ท้องฟ้า 3D</button>
            <button className={view === '2d' ? 'on' : ''} onClick={() => setView('2d')}>แผนที่ดาว 2D</button>
          </div>
        </div>

        <div className="planisphere">
          <div className="pl-map">
            {view === '3d' ? (
              <Suspense fallback={<div className="sky3d loading">กำลังเตรียมท้องฟ้า…</div>}>
                <SkyDome3D
                  lst={lst}
                  look={look}
                  selected={selected}
                  show={show}
                  onPick={(id) => pick(id)}
                  onViewAz={(az) => setFacing(nearestFacing(az))}
                />
              </Suspense>
            ) : (
            <svg viewBox="-270 -270 540 560" className="pl-svg">
              <defs>
                <radialGradient id="pl-sky">
                  <stop offset="0" stopColor="#12205a" />
                  <stop offset="1" stopColor="#060a24" />
                </radialGradient>
                <filter id="pl-glow"><feGaussianBlur stdDeviation="2.5" /></filter>
              </defs>
              <circle r={R + 36} fill="#0a0f2a" stroke="rgba(140,170,255,.25)" />
              <g className="pl-rot" style={{ transform: `rotate(${rot}deg)` }}>
                <circle r={R} fill="url(#pl-sky)" />
                {[30, 60].map((a) => <circle key={a} r={(R * (90 - a)) / 90} fill="none" stroke="#fff" strokeOpacity=".08" strokeDasharray="3 5" />)}
                <path d="M-6 0h12M0 -6v12" stroke="#fff" strokeOpacity=".35" />

                {Array.from({ length: 36 }, (_, i) => {
                  const a = (i * 10 * Math.PI) / 180
                  const l = i % 9 === 0 ? 12 : 6
                  return <line key={i} x1={-R * Math.sin(a)} y1={-R * Math.cos(a)} x2={-(R + l) * Math.sin(a)} y2={-(R + l) * Math.cos(a)} stroke="#8ec5ff" strokeOpacity=".4" />
                })}
                {FACINGS.map((f) => {
                  const a = (f.az * Math.PI) / 180
                  const x = -(R + 22) * Math.sin(a)
                  const y = -(R + 22) * Math.cos(a)
                  return (
                    <text key={f.az} x={x} y={y} transform={`rotate(${-rot} ${x} ${y})`} textAnchor="middle" dominantBaseline="middle"
                      className={`pl-dir ${f.az === facing ? 'on' : ''}`}>
                      {f.name}
                    </text>
                  )
                })}

                {show.ecliptic && sky.ecl.map((seg, i) => (
                  <polyline key={i} points={seg.map((p) => p.join(',')).join(' ')} fill="none" stroke="#ffd27a" strokeOpacity=".55" strokeDasharray="5 5" />
                ))}

                {sky.cons.map((c) => {
                  const on = c.id === selected
                  return (
                    <g key={c.id} className={`pl-con ${on ? 'on' : ''}`} style={{ '--c': c.color }} onClick={() => pick(c.id)}>
                      {show.lines && c.lines.map(([a, b]) => {
                        const A = c.starsPos[a]
                        const B = c.starsPos[b]
                        if (A.alt <= 0 || B.alt <= 0) return null
                        return <line key={a + b} x1={A.xy[0]} y1={A.xy[1]} x2={B.xy[0]} y2={B.xy[1]} className="pl-line" />
                      })}
                      {Object.values(c.starsPos).filter((st) => st.alt > 0).map((st) => (
                        <circle key={st.id} cx={st.xy[0]} cy={st.xy[1]} r={Math.max(1.1, 3.6 - st.mag * 0.62)} fill="#fff" />
                      ))}
                      {show.names && c.cen.alt > 0 && (
                        <text x={c.cen.xy[0]} y={c.cen.xy[1]} transform={`rotate(${-rot} ${c.cen.xy[0]} ${c.cen.xy[1]})`} textAnchor="middle" className="pl-name">
                          {shortName(c)}
                        </text>
                      )}
                    </g>
                  )
                })}

                {show.pointer && dipper.starsPos.merak.alt > 0 && polaris.alt > 0 && (
                  <line x1={dipper.starsPos.merak.xy[0]} y1={dipper.starsPos.merak.xy[1]} x2={polaris.xy[0]} y2={polaris.xy[1]} className="pl-pointer" />
                )}

                {sky.bright.filter((st) => st.alt > 0).map((st) => (
                  <g key={st.id}>
                    <circle cx={st.xy[0]} cy={st.xy[1]} r={Math.max(1.8, 3.8 - st.mag * 0.6) + 2} fill="#fff" opacity=".35" filter="url(#pl-glow)" />
                    <circle cx={st.xy[0]} cy={st.xy[1]} r={Math.max(1.8, 3.8 - st.mag * 0.6)} fill={st.id === 'polaris' ? '#ffe7a8' : '#fff'} />
                    {show.names && (
                      <text x={st.xy[0]} y={st.xy[1] + 14} transform={`rotate(${-rot} ${st.xy[0]} ${st.xy[1]})`} textAnchor="middle" className="pl-star-name">{st.name}</text>
                    )}
                  </g>
                ))}
              </g>

              {/* ขอบฟ้าด้านล่าง = ทิศที่หันหน้าไป */}
              <path d={`M-60 ${R + 44} L0 ${R + 30} L60 ${R + 44}`} fill="none" stroke="#ffd27a" strokeWidth="2" />
              <text y={R + 66} textAnchor="middle" className="pl-facing">ขอบฟ้าทิศ{FACINGS.find((f) => f.az === facing).name} (ด้านหน้าคุณ)</text>
            </svg>
            )}
          </div>

          <div className="pl-panel">
            <div className="pl-group">
              <span className="pl-label">วันที่</span>
              <div className="month-grid">
                {MONTHS_SHORT.map((mm, i) => (
                  <button key={mm} className={i === month ? 'on' : ''} onClick={() => setMonth(i)}>{mm}</button>
                ))}
              </div>
              <small className="pl-hint">วันที่ 15 {MONTHS[month]}</small>
            </div>
            <div className="pl-group">
              <span className="pl-label">เวลา <b>{fmtTime(minutes)}</b></span>
              <input
                type="range" min={18 * 60} max={30 * 60} step={15} value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                className="slider" style={{ '--p': `${((minutes - 18 * 60) / (12 * 60)) * 100}%`, '--c': '#8ec5ff' }}
              />
              <div className="slider-scale"><span>18:00</span><span>เที่ยงคืน</span><span>06:00</span></div>
            </div>
            <div className="pl-group">
              <span className="pl-label">หันหน้าไปทาง</span>
              <div className="compass">
                {FACINGS.map((f) => (
                  <button key={f.az} className={`c-${f.short} ${f.az === facing ? 'on' : ''}`} onClick={() => faceTo(f.az)}>{f.name}</button>
                ))}
                <span className="compass-core">🧭</span>
              </div>
            </div>
            <div className="chip-row wrap">
              <button className={`chip-btn ${show.lines ? 'on' : ''}`} onClick={() => toggle('lines')}>เส้นกลุ่มดาว</button>
              <button className={`chip-btn ${show.names ? 'on' : ''}`} onClick={() => toggle('names')}>ชื่อ</button>
              <button className={`chip-btn ${show.ecliptic ? 'on' : ''}`} style={{ '--c': '#ffd27a' }} onClick={() => toggle('ecliptic')}>เส้นสุริยวิถี</button>
              <button className={`chip-btn ${show.pointer ? 'on' : ''}`} style={{ '--c': '#ffd27a' }} onClick={() => toggle('pointer')}>เส้นชี้ดาวเหนือ</button>
            </div>

            {sel && (
              <div className="pl-selected" style={{ '--c': sel.color }}>
                <span className="panel-kicker">{sel.zodiac ?? sel.en}</span>
                <h3>{sel.name}</h3>
                {selUp ? (
                  <p>ตอนนี้อยู่ทางทิศ<b>{dirName(sel.cen.az)}</b><br />มุมทิศ <b>{Math.round(sel.cen.az)}°</b> · มุมเงย <b>{Math.round(sel.cen.alt)}°</b></p>
                ) : (
                  <p>ตอนนี้อยู่ <b>ใต้ขอบฟ้า</b> มองไม่เห็น</p>
                )}
                <button className="chip-btn on" onClick={() => goBest(sel)}>พาไปดูช่วงที่เห็นชัดที่สุด →</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------- ภารกิจฝึกใช้แผนที่ดาว ---------- */}
      <section className="stage">
        <div className="stage-head">
          <div>
            <h2>ภารกิจฝึกใช้แผนที่ดาว</h2>
            <p>ตั้งค่าแผนที่ด้านบนให้ถูกต้อง ระบบจะติ๊กถูกให้อัตโนมัติ</p>
          </div>
          <div className="seg-tabs">
            {MISSIONS.map((mm, i) => (
              <button key={mm.id} className={i === mission ? 'on' : ''} onClick={() => setMission(i)}>
                {done.includes(i) ? '✓ ' : ''}ภารกิจ {i + 1}
              </button>
            ))}
          </div>
        </div>
        <div className={`mission ${missionOk ? 'ok' : ''}`}>
          <h3>{m.title}</h3>
          <ul>
            {checks.map((c) => (
              <li key={c.label} className={c.ok ? 'ok' : ''}><span>{c.ok ? '✓' : ''}</span>{c.label}</li>
            ))}
          </ul>
          {missionOk && (
            <div className="mission-done">
              <b>สำเร็จ! 🎉</b>
              <p>{m.fact}</p>
              {mission < MISSIONS.length - 1 && <button className="cta" onClick={() => setMission(mission + 1)}>ภารกิจต่อไป →</button>}
            </div>
          )}
        </div>
      </section>

      {/* ---------- รู้จักกลุ่มดาว ---------- */}
      <section className="stage">
        <div className="stage-head">
          <div>
            <h2>12 กลุ่มดาวจักรราศี</h2>
            <p>กลุ่มดาวที่อยู่บนเส้นสุริยวิถี ซึ่งเป็นแนวที่ดวงอาทิตย์ ดวงจันทร์ และดาวเคราะห์ดูเหมือนเคลื่อนผ่าน แตะการ์ดเพื่อดูบนแผนที่</p>
          </div>
        </div>
        <div className="con-grid">
          {ZODIAC.map((c, i) => <ConCard key={c.id} c={c} i={i} on={c.id === selected} onPick={() => pick(c.id, true)} />)}
        </div>
        <div className="stage-head" style={{ marginTop: 26 }}>
          <div>
            <h2>กลุ่มดาวอื่นที่ควรรู้จัก</h2>
            <p>ใช้บอกทิศและเป็นจุดสังเกตบนท้องฟ้า</p>
          </div>
        </div>
        <div className="con-grid">
          {OTHERS.map((c, i) => <ConCard key={c.id} c={c} i={i} on={c.id === selected} onPick={() => pick(c.id, true)} />)}
        </div>
      </section>
    </>
  )
}

function ConCard({ c, i, on, onPick }) {
  const best = bestMonth(c, YEAR)
  const brightest = [...c.stars].sort((a, b) => a.mag - b.mag)[0]
  return (
    <button className={`con-card ${on ? 'on' : ''}`} style={{ '--c': c.color, '--i': i }} onClick={onPick}>
      <MiniFigure c={c} />
      <span className="con-zodiac">{c.zodiac ?? c.en}</span>
      <b>{c.name}</b>
      <small>{c.note ?? (brightest.name ? `ดาวสว่าง: ${brightest.name}` : c.en)}</small>
      <small className="con-best">เห็นชัด: หัวค่ำ{best.alt > 0 ? MONTHS[best.month] : '—'}</small>
    </button>
  )
}
