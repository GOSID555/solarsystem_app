import { useEffect, useState } from 'react'
import { PlayIcon, PauseIcon } from '../../components/Icons'

const TILT = 23.5
const MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
const MONTH_START = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
const dateFmt = new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'long' })

const EVENTS = [
  { day: 79, name: 'วสันตวิษุวัต', note: 'กลางวันเท่ากับกลางคืนทั่วโลก' },
  { day: 171, name: 'ครีษมายัน', note: 'ซีกโลกเหนือกลางวันยาวที่สุด' },
  { day: 265, name: 'ศารทวิษุวัต', note: 'กลางวันเท่ากับกลางคืนทั่วโลก' },
  { day: 354, name: 'เหมายัน', note: 'ซีกโลกเหนือกลางวันสั้นที่สุด' },
]

// ละติจูดที่แสงอาทิตย์ตกตั้งฉาก (องศา, + = เหนือ)
const subsolar = (d) => TILT * Math.sin((2 * Math.PI * (d - 79)) / 365)

function season(d, north) {
  // ฤดูแบบเขตอบอุ่น: มี.ค.–มิ.ย. ใบไม้ผลิ, มิ.ย.–ก.ย. ร้อน, ก.ย.–ธ.ค. ใบไม้ร่วง, ธ.ค.–มี.ค. หนาว
  const names = ['ฤดูใบไม้ผลิ', 'ฤดูร้อน', 'ฤดูใบไม้ร่วง', 'ฤดูหนาว']
  const idx = d >= 79 && d < 171 ? 0 : d >= 171 && d < 265 ? 1 : d >= 265 && d < 354 ? 2 : 3
  return names[north ? idx : (idx + 2) % 4]
}

// ความยาวกลางวัน (ชั่วโมง) ที่ละติจูด lat
function dayLength(lat, decl) {
  const x = -Math.tan((lat * Math.PI) / 180) * Math.tan((decl * Math.PI) / 180)
  if (x <= -1) return 24
  if (x >= 1) return 0
  return (2 * Math.acos(x) * 180) / Math.PI / 15
}
const hm = (h) => `${Math.floor(h)} ชม. ${Math.round((h % 1) * 60)} นาที`

export default function Seasons() {
  const [day, setDay] = useState(171)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setDay((d) => (d + 3) % 365), 60)
    return () => clearInterval(t)
  }, [playing])

  const decl = subsolar(day)
  const event = EVENTS.find((e) => Math.abs(e.day - day) <= 3)
  const date = new Date(2025, 0, 1 + day)

  // วงโคจรแบบมุมมองเฉียง: มิ.ย. อยู่ซ้าย, ธ.ค. อยู่ขวา (แกนโลกเอียงไปทางขวาเสมอ)
  const ocx = 300
  const ocy = 170
  const rx = 230
  const ry = 78
  const ang = ((180 + ((day - 171) / 365) * 360) * Math.PI) / 180
  const ex = ocx + rx * Math.cos(ang)
  const ey = ocy - ry * Math.sin(ang)
  const behind = ey < ocy
  const toSun = Math.atan2(ocy - ey, ocx - ex) * (180 / Math.PI)

  const earthSmall = (
    <g transform={`translate(${ex} ${ey})`}>
      <circle r="20" fill="#0b1433" />
      <g transform={`rotate(${toSun})`}>
        <path d="M0 -20 A20 20 0 0 1 0 20Z" fill="#4f8fe0" />
      </g>
      <g transform={`rotate(${TILT})`}>
        <line y1="-32" y2="32" stroke="#fff" strokeWidth="1.5" />
        <circle cy="-32" r="2.5" fill="#fff" />
      </g>
    </g>
  )

  const R = 104
  const bkkLat = 13.75
  const place = (lat) => [-R * Math.cos((lat * Math.PI) / 180), -R * Math.sin((lat * Math.PI) / 180)]

  return (
    <section className="stage">
      <div className="stage-head">
        <div>
          <h2>โลกโคจรรอบดวงอาทิตย์ 1 ปี</h2>
          <p>สังเกตว่าแกนโลก (เส้นสีขาว) ชี้ไปทางเดิมตลอด ซีกโลกที่เอียงเข้าหาดวงอาทิตย์จะได้รับแสงตรงกว่า</p>
        </div>
        <button className="play-btn" onClick={() => setPlaying((p) => !p)}>
          {playing ? <PauseIcon /> : <PlayIcon />} {playing ? 'หยุด' : 'เล่นทั้งปี'}
        </button>
      </div>

      <svg className="stage-svg" viewBox="0 0 600 330">
        <defs>
          <radialGradient id="ss-sun"><stop offset="0" stopColor="#fff6d8" /><stop offset=".5" stopColor="#ffb35c" /><stop offset="1" stopColor="#ff6a00" stopOpacity="0" /></radialGradient>
        </defs>
        <ellipse cx={ocx} cy={ocy} rx={rx} ry={ry} fill="none" stroke="#3a4270" strokeDasharray="3 5" />
        {[['มิ.ย.', ocx - rx - 34, ocy + 4], ['ก.ย.', ocx, ocy + ry + 26], ['ธ.ค.', ocx + rx + 32, ocy + 4], ['มี.ค.', ocx, ocy - ry - 12]].map(([t, x, y]) => (
          <text key={t} x={x} y={y} textAnchor="middle" className="svg-sub">{t}</text>
        ))}
        {behind && earthSmall}
        <circle cx={ocx} cy={ocy} r="70" fill="url(#ss-sun)" />
        <circle cx={ocx} cy={ocy} r="30" fill="#ffc861" />
        {!behind && earthSmall}
        <text x="16" y="310" className="svg-note">ขนาดและระยะไม่ตามสัดส่วนจริง</text>
      </svg>

      <div className="slider-wrap">
        <input type="range" min="0" max="364" value={day} onChange={(e) => { setPlaying(false); setDay(Number(e.target.value)) }} className="slider" style={{ '--p': `${(day / 364) * 100}%` }} />
        <div className="slider-scale months">
          {MONTHS.map((m, i) => (
            <button key={m} onClick={() => { setPlaying(false); setDay(MONTH_START[i] + 20) }}>{m}</button>
          ))}
        </div>
      </div>

      <div className="split">
        <svg className="stage-svg" viewBox="-200 -150 400 300">
          <defs>
            <marker id="ss-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0 0 10 5 0 10z" fill="#ffd27a" />
            </marker>
            <clipPath id="ss-earth"><circle r={R} /></clipPath>
          </defs>
          {[-80, -40, 0, 40, 80].map((y) => (
            <line key={y} x1="-196" y1={y} x2={-Math.sqrt(Math.max(0, R * R - y * y)) - 6} y2={y}
              stroke="#ffd27a" strokeWidth={y === 0 ? 3 : 1.5} opacity={y === 0 ? 1 : 0.5} markerEnd="url(#ss-arrow)" />
          ))}
          <text x="-196" y="-120" className="svg-note">แสงอาทิตย์</text>

          <g clipPath="url(#ss-earth)">
            <circle r={R} fill="#2f6fc0" />
            <g transform={`rotate(${-decl})`}>
              {[[0, 'เส้นศูนย์สูตร'], [23.5, ''], [-23.5, '']].map(([lat, t]) => {
                const y = -R * Math.sin((lat * Math.PI) / 180)
                return <line key={lat} x1={-R} x2={R} y1={y} y2={y} stroke="#fff" strokeOpacity={lat === 0 ? 0.6 : 0.25} strokeDasharray={lat === 0 ? '' : '4 4'} />
              })}
            </g>
            <rect x="0" y={-R} width={R} height={2 * R} fill="#050818" opacity=".72" />
          </g>
          <g transform={`rotate(${-decl})`}>
            <line y1={-R - 26} y2={R + 26} stroke="#fff" strokeWidth="2" />
            <text y={-R - 32} textAnchor="middle" className="svg-sub">ขั้วโลกเหนือ</text>
            <circle cx={place(bkkLat)[0]} cy={place(bkkLat)[1]} r="5" fill="#ffd27a" stroke="#000" />
            <text x={place(bkkLat)[0] + 10} y={place(bkkLat)[1] - 6} className="svg-sub">ไทย</text>
          </g>
          <text x={-R + 8} y={4} className="svg-note strong">แสงตั้งฉาก</text>
          <text x={R - 4} y={R + 30} textAnchor="end" className="svg-note">ด้านกลางคืน</text>
        </svg>

        <div className="season-panel">
          <span className="panel-kicker">{dateFmt.format(date)}</span>
          <h3>{event ? event.name : `แสงตั้งฉากที่ ${Math.abs(decl).toFixed(1)}° ${decl >= 0 ? 'เหนือ' : 'ใต้'}`}</h3>
          {event && <p className="event-note">{event.note}</p>}
          <div className="hemis">
            <div className={decl > 2 ? 'warm' : decl < -2 ? 'cold' : ''}>
              <small>ซีกโลกเหนือ</small>
              <b>{season(day, true)}</b>
            </div>
            <div className={decl < -2 ? 'warm' : decl > 2 ? 'cold' : ''}>
              <small>ซีกโลกใต้</small>
              <b>{season(day, false)}</b>
            </div>
          </div>
          <dl className="daylen">
            <div><dt>กลางวันที่กรุงเทพฯ</dt><dd>{hm(dayLength(bkkLat, decl))}</dd></div>
            <div><dt>กลางวันที่ละติจูด 60° เหนือ</dt><dd>{hm(dayLength(60, decl))}</dd></div>
          </dl>
          <p className="muted">ประเทศไทยอยู่ใกล้เส้นศูนย์สูตร ความยาวกลางวันจึงเปลี่ยนไม่มาก ส่วนฤดูของไทย (ร้อน ฝน หนาว) ได้รับผลจากลมมรสุมด้วย</p>
        </div>
      </div>
    </section>
  )
}
