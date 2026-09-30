import { useEffect, useState } from 'react'
import { PlayIcon, PauseIcon } from '../../components/Icons'

// วันทางจันทรคติ 1..30 → ขึ้น 1–15 ค่ำ, แรม 1–15 ค่ำ
// มุมเฟส θ: 0° = เดือนดับ, 180° = วันเพ็ญ
const thaiDay = (v) => (v <= 15 ? `ขึ้น ${v} ค่ำ` : `แรม ${v - 15} ค่ำ`)
const phaseAngle = (v) => (v / 30) * 360

function phaseName(v) {
  if (v === 15) return 'วันเพ็ญ · เต็มดวง'
  if (v === 30) return 'เดือนดับ · มองไม่เห็น'
  if (v <= 6) return 'เสี้ยว · ข้างขึ้น'
  if (v <= 8) return 'ครึ่งดวง · ข้างขึ้น'
  if (v <= 14) return 'ค่อนดวง · ข้างขึ้น'
  if (v <= 21) return 'ค่อนดวง · ข้างแรม'
  if (v <= 23) return 'ครึ่งดวง · ข้างแรม'
  return 'เสี้ยว · ข้างแรม'
}

function whenVisible(v) {
  if (v === 30) return 'ดวงจันทร์อยู่ฝั่งเดียวกับดวงอาทิตย์ ด้านที่หันมาหาโลกไม่ได้รับแสง'
  if (v < 15) return 'เห็นได้ช่วงหัวค่ำ ส่วนสว่างอยู่ทางขวา และจะค่อยๆ เพิ่มขึ้นทุกคืน'
  if (v === 15) return 'ขึ้นทางทิศตะวันออกตอนหัวค่ำ เห็นได้ตลอดคืน'
  return 'ขึ้นช้าลงทุกคืน เห็นได้ช่วงดึกถึงเช้า ส่วนสว่างอยู่ทางซ้ายและค่อยๆ ลดลง'
}

// เงาบนดวงจันทร์ที่เห็นจากโลก (ส่วนมืด) — ครึ่งวงกลม + เส้นแบ่งกลางวันกลางคืนแบบวงรี
function shadowPath(theta, cx, cy, r) {
  const t = ((theta % 360) + 360) % 360
  if (t < 0.5 || t > 359.5) return `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`
  if (Math.abs(t - 180) < 0.5) return ''
  const waxing = t < 180
  const rx = Math.abs(Math.cos((t * Math.PI) / 180)) * r
  const darkBig = waxing ? t < 90 : t > 270
  const s1 = waxing ? 0 : 1
  const s2 = waxing ? (darkBig ? 0 : 1) : darkBig ? 1 : 0
  return `M${cx} ${cy - r} A${r} ${r} 0 0 ${s1} ${cx} ${cy + r} A${rx} ${r} 0 0 ${s2} ${cx} ${cy - r}Z`
}

export function MoonView({ theta, size = 220, id = 'mv' }) {
  const r = size / 2 - 6
  const c = size / 2
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="moon-view">
      <defs>
        <clipPath id={`${id}-clip`}><circle cx={c} cy={c} r={r} /></clipPath>
        <radialGradient id={`${id}-glow`}><stop offset=".7" stopColor="#e8ecff" stopOpacity=".25" /><stop offset="1" stopColor="#e8ecff" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx={c} cy={c} r={c} fill={`url(#${id}-glow)`} opacity={(1 - Math.cos((theta * Math.PI) / 180)) / 2} />
      <image href="/textures/moon_1024.jpg" x={c - r * 2} y={c - r} width={r * 4} height={r * 2} clipPath={`url(#${id}-clip)`} preserveAspectRatio="none" />
      <path d={shadowPath(theta, c, c, r + 0.5)} fill="#05081a" opacity=".93" />
    </svg>
  )
}

const KEY_DAYS = [30, 4, 8, 11, 15, 19, 23, 26]

export default function MoonPhases() {
  const [day, setDay] = useState(8)
  const [playing, setPlaying] = useState(false)
  const theta = phaseAngle(day)
  const lit = Math.round(((1 - Math.cos((theta * Math.PI) / 180)) / 2) * 100)

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setDay((d) => (d % 30) + 1), 450)
    return () => clearInterval(t)
  }, [playing])

  // แผนภาพมองจากด้านบน: ดวงอาทิตย์อยู่ทางซ้าย ดวงจันทร์โคจรทวนเข็มนาฬิกา
  const cx = 250
  const cy = 190
  const R = 130
  const a = ((180 + theta) * Math.PI) / 180
  const mx = cx + R * Math.cos(a)
  const my = cy - R * Math.sin(a)

  return (
    <section className="stage">
      <div className="stage-head">
        <div>
          <h2>เลื่อนดูดวงจันทร์ในแต่ละวัน</h2>
          <p>ครึ่งดวงที่หันเข้าหาดวงอาทิตย์สว่างเสมอ แต่เราเห็นส่วนสว่างนั้นมากน้อยต่างกัน</p>
        </div>
        <button className="play-btn" onClick={() => setPlaying((p) => !p)}>
          {playing ? <PauseIcon /> : <PlayIcon />} {playing ? 'หยุด' : 'เล่นอัตโนมัติ'}
        </button>
      </div>

      <div className="split">
        <svg className="stage-svg" viewBox="0 0 520 380">
          <defs>
            <marker id="mp-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0 0 10 5 0 10z" fill="#ffd27a" />
            </marker>
            <marker id="mp-orbit" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="8" markerHeight="8" orient="auto">
              <path d="M0 0 10 5 0 10z" fill="#5d6685" />
            </marker>
          </defs>
          {[70, 130, 190, 250, 310].map((y) => (
            <line key={y} x1="8" y1={y} x2="70" y2={y} stroke="#ffd27a" strokeWidth="2" markerEnd="url(#mp-arrow)" className="ray" />
          ))}
          <text x="14" y="30" className="svg-note">แสงจากดวงอาทิตย์ →</text>

          <circle cx={cx} cy={cy} r={R} fill="none" stroke="#3a4270" strokeDasharray="3 5" />
          <path d={`M${cx + R * 0.72} ${cy + R * 0.69} A${R} ${R} 0 0 0 ${cx + R * 0.98} ${cy + R * 0.2}`} fill="none" stroke="#5d6685" strokeWidth="2" markerEnd="url(#mp-orbit)" />

          {/* โลก: ด้านซ้ายกลางวัน ด้านขวากลางคืน */}
          <circle cx={cx} cy={cy} r="30" fill="#2f6fc0" />
          <path d={`M${cx} ${cy - 30} A30 30 0 0 1 ${cx} ${cy + 30}Z`} fill="#050818" opacity=".75" />
          <text x={cx} y={cy + 52} textAnchor="middle" className="svg-sub">โลก</text>

          {/* แนวสายตาจากโลก */}
          <line x1={cx} y1={cy} x2={mx} y2={my} stroke="#8ec5ff" strokeOpacity=".5" strokeDasharray="4 4" />

          {/* ดวงจันทร์: ครึ่งซ้ายสว่างเสมอ */}
          <g transform={`translate(${mx} ${my})`}>
            <circle r="17" fill="#1a1f3c" stroke="#3a4270" />
            <path d="M0 -17 A17 17 0 0 0 0 17Z" fill="#e6e8f0" />
          </g>
          <text x={mx} y={my + (my > cy ? 36 : -26)} textAnchor="middle" className="svg-label small">{thaiDay(day)}</text>
        </svg>

        <div className="moon-panel">
          <span className="panel-kicker">มองจากโลก</span>
          <MoonView theta={theta} />
          <b className="moon-day">{thaiDay(day)}</b>
          <span className="moon-name">{phaseName(day)}</span>
          <div className="lit-bar"><span style={{ width: `${lit}%` }} /></div>
          <small>ส่วนสว่างที่เห็น {lit}%</small>
          <p>{whenVisible(day)}</p>
        </div>
      </div>

      <div className="slider-wrap">
        <input type="range" min="1" max="30" value={day} onChange={(e) => { setPlaying(false); setDay(Number(e.target.value)) }} className="slider" style={{ '--p': `${((day - 1) / 29) * 100}%` }} />
        <div className="slider-scale"><span>ขึ้น 1 ค่ำ</span><span>ขึ้น 15 ค่ำ (เพ็ญ)</span><span>แรม 15 ค่ำ (ดับ)</span></div>
      </div>

      <div className="phase-strip">
        {KEY_DAYS.map((d) => (
          <button key={d} className={`phase-chip ${d === day ? 'on' : ''}`} onClick={() => { setPlaying(false); setDay(d) }}>
            <MoonView theta={phaseAngle(d)} size={56} id={`ph${d}`} />
            <span>{thaiDay(d)}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
