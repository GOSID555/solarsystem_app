import { useState } from 'react'

const DIR8 = ['เหนือ', 'ตะวันออกเฉียงเหนือ', 'ตะวันออก', 'ตะวันออกเฉียงใต้', 'ใต้', 'ตะวันตกเฉียงใต้', 'ตะวันตก', 'ตะวันตกเฉียงเหนือ']
const dirName = (az) => DIR8[Math.round(az / 45) % 8]
const RAD = Math.PI / 180

// ---------- ฉายทรงกลมฟ้าแบบมองเฉียงจากด้านบน ----------
// พิกัดโลก: x = ตะวันออก, y = ขึ้น, z = เหนือ
const YAW = -28 * RAD
const PITCH = 24 * RAD
const CX = 300
const CY = 250
const SCALE = 210

function proj(alt, az, r = 1) {
  const a = alt * RAD
  const z = az * RAD
  const x = Math.cos(a) * Math.sin(z) * r
  const y = Math.sin(a) * r
  const n = Math.cos(a) * Math.cos(z) * r
  const x2 = x * Math.cos(YAW) + n * Math.sin(YAW)
  const n2 = -x * Math.sin(YAW) + n * Math.cos(YAW)
  return [CX + SCALE * x2, CY - SCALE * (y * Math.cos(PITCH) + n2 * Math.sin(PITCH))]
}
const path = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
const range = (a, b, step = 3) => {
  const out = []
  for (let v = a; v <= b; v += step) out.push(v)
  if (out[out.length - 1] !== b) out.push(b)
  return out
}

const MISSIONS = [
  { az: 0, alt: 14, title: 'ดาวเหนือเมื่อมองจากกรุงเทพฯ', note: 'ดาวเหนืออยู่ทางทิศเหนือพอดี (มุมทิศ 0°) และสูงเท่ากับละติจูดของที่นั้น กรุงเทพฯ อยู่ละติจูดประมาณ 14° เหนือ' },
  { az: 90, alt: 10, title: 'ดวงจันทร์เต็มดวงเพิ่งขึ้นตอนหัวค่ำ', note: 'วันเพ็ญ ดวงจันทร์ขึ้นทางทิศตะวันออกตอนดวงอาทิตย์ตก จึงอยู่ต่ำๆ ที่มุมทิศประมาณ 90°' },
  { az: 225, alt: 45, title: 'ดาวสว่างทางทิศตะวันตกเฉียงใต้', note: 'มุมทิศ 225° คือกึ่งกลางระหว่างทิศใต้ (180°) กับทิศตะวันตก (270°) ส่วนมุมเงย 45° คือครึ่งทางจากขอบฟ้าถึงจุดเหนือศีรษะ' },
]

function Dome({ az, alt, target }) {
  const star = proj(alt, az)
  const foot = proj(0, az)
  const center = proj(0, 0, 0)
  const zenith = proj(90, 0)
  const horizon = range(0, 360, 4).map((a) => proj(0, a))
  const azArc = range(0, az, 2).map((a) => proj(0, a, 0.56))
  const altArc = range(0, alt, 2).map((h) => proj(h, az, 0.7))
  const azMid = proj(0, az / 2, 0.72)
  const altMid = proj(alt / 2, az, 0.8)
  const tgt = target && proj(target.alt, target.az)

  return (
    <svg className="stage-svg altaz-svg" viewBox="0 0 600 470">
      <defs>
        <radialGradient id="az-ground"><stop offset="0" stopColor="#1b2a5e" /><stop offset="1" stopColor="#0c1433" /></radialGradient>
        <radialGradient id="az-star"><stop offset="0" stopColor="#fff" /><stop offset=".35" stopColor="#ffe7a8" /><stop offset="1" stopColor="#ffd27a" stopOpacity="0" /></radialGradient>
      </defs>

      {/* พื้นราบ (ระนาบขอบฟ้า) */}
      <path d={path(horizon) + 'Z'} fill="url(#az-ground)" stroke="#8ec5ff" strokeOpacity=".7" strokeWidth="1.5" />
      {[0, 90, 180, 270].map((a) => (
        <path key={a} d={path([center, proj(0, a)])} stroke="#8ec5ff" strokeOpacity=".2" />
      ))}

      {/* โครงทรงกลมฟ้า */}
      {[30, 60].map((h) => (
        <path key={h} d={path(range(0, 360, 4).map((a) => proj(h, a)))} fill="none" stroke="#fff" strokeOpacity=".08" strokeDasharray="3 5" />
      ))}
      {[0, 90, 180, 270].map((a) => (
        <path key={a} d={path(range(0, 90, 3).map((h) => proj(h, a)))} fill="none" stroke="#fff" strokeOpacity=".08" strokeDasharray="3 5" />
      ))}
      <circle cx={zenith[0]} cy={zenith[1]} r="3" fill="#fff" opacity=".6" />
      <text x={zenith[0] + 8} y={zenith[1] - 6} className="svg-sub">จุดเหนือศีรษะ (มุมเงย 90°)</text>

      {/* ป้ายทิศ */}
      {[[0, 'เหนือ N · 0°'], [90, 'ตะวันออก E · 90°'], [180, 'ใต้ S · 180°'], [270, 'ตะวันตก W · 270°']].map(([a, t]) => {
        const [x, y] = proj(0, a, 1.14)
        return <text key={a} x={x} y={y + 5} textAnchor="middle" className={`svg-dir ${a === 0 ? 'north' : ''}`}>{t}</text>
      })}

      {/* เป้าหมายภารกิจ */}
      {tgt && (
        <g className="az-target">
          <circle cx={tgt[0]} cy={tgt[1]} r="16" fill="none" stroke="#6be39b" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx={tgt[0]} cy={tgt[1]} r="3" fill="#6be39b" />
        </g>
      )}

      {/* มุมทิศ: วัดจากทิศเหนือ ตามเข็มนาฬิกา ไปตามขอบฟ้า */}
      <path d={path([center, proj(0, 0, 1)])} stroke="#ffd27a" strokeWidth="2" strokeOpacity=".8" />
      {az > 0 && <path d={path(azArc)} fill="none" stroke="#ffd27a" strokeWidth="3" />}
      <path d={path([center, foot])} stroke="#ffd27a" strokeWidth="2" strokeDasharray="6 5" />
      <text x={azMid[0]} y={azMid[1] + 5} textAnchor="middle" className="az-label az">มุมทิศ {az}°</text>

      {/* มุมเงย: วัดจากขอบฟ้าขึ้นไปหาดาว */}
      <path d={path([star, foot])} stroke="#8ec5ff" strokeOpacity=".35" strokeDasharray="3 4" />
      {alt > 0 && <path d={path(altArc)} fill="none" stroke="#7ee0ff" strokeWidth="3" />}
      <path d={path([center, star])} stroke="#7ee0ff" strokeWidth="2" />
      <text x={altMid[0] + 12} y={altMid[1]} className="az-label alt">มุมเงย {alt}°</text>

      {/* ผู้สังเกต */}
      <g transform={`translate(${center[0]} ${center[1]})`}>
        <ellipse rx="14" ry="5" fill="#000" opacity=".4" />
        <path d="M-6 0 L0 -26 L6 0Z" fill="#dfe6ff" />
        <circle cy="-31" r="6" fill="#dfe6ff" />
      </g>

      {/* ดาว */}
      <circle cx={star[0]} cy={star[1]} r="26" fill="url(#az-star)" />
      <circle cx={star[0]} cy={star[1]} r="6" fill="#fff" />
    </svg>
  )
}

// ---------- เครื่องมือวัด ----------
function Compass({ az }) {
  return (
    <svg viewBox="-120 -120 240 240" className="tool-svg">
      <circle r="112" fill="#0d1636" stroke="#8ec5ff" strokeOpacity=".4" strokeWidth="2" />
      {Array.from({ length: 72 }, (_, i) => {
        const a = i * 5 * RAD
        const l = i % 18 === 0 ? 14 : i % 2 === 0 ? 8 : 4
        return <line key={i} x1={Math.sin(a) * 104} y1={-Math.cos(a) * 104} x2={Math.sin(a) * (104 - l)} y2={-Math.cos(a) * (104 - l)} stroke="#cfe0ff" strokeOpacity=".6" />
      })}
      {[[0, 'N'], [90, 'E'], [180, 'S'], [270, 'W']].map(([a, t]) => (
        <text key={a} x={Math.sin(a * RAD) * 76} y={-Math.cos(a * RAD) * 76 + 6} textAnchor="middle" className={`tool-dir ${a === 0 ? 'north' : ''}`}>{t}</text>
      ))}
      {/* เข็มแม่เหล็กชี้ทิศเหนือ */}
      <path d="M0 -58 L7 0 L0 8 L-7 0Z" fill="#ff6a5a" />
      <path d="M0 58 L7 0 L0 -8 L-7 0Z" fill="#dfe6ff" />
      {/* แนวเล็งไปที่ดาว */}
      <g transform={`rotate(${az})`}>
        <line y1="0" y2="-104" stroke="#ffd27a" strokeWidth="3" />
        <path d="M0 -114 L-7 -100 L7 -100Z" fill="#ffd27a" />
      </g>
      <circle r="5" fill="#fff" />
    </svg>
  )
}

function Quadrant({ alt }) {
  // เครื่องวัดมุมเงย: หลอดเล็งติดกับไม้โปรแทรกเตอร์ สเกลอยู่ฝั่งตา
  // เชือกลูกดิ่งห้อยตรงลงเสมอ จึงตัดสเกลที่ค่าเท่ากับมุมเงยพอดี
  const px = 150
  const py = 120
  const R = 96
  return (
    <svg viewBox="0 0 300 250" className="tool-svg">
      <line x1="0" y1={py} x2="300" y2={py} stroke="#8ec5ff" strokeOpacity=".25" strokeDasharray="4 4" />
      <text x="296" y={py + 16} textAnchor="end" className="svg-note">แนวขอบฟ้า</text>
      <g transform={`rotate(${-alt} ${px} ${py})`}>
        <path d={`M${px} ${py} L${px} ${py + R} A${R} ${R} 0 0 1 ${px - R} ${py}Z`} fill="rgba(142,197,255,.12)" stroke="#8ec5ff" strokeOpacity=".5" />
        {Array.from({ length: 19 }, (_, i) => {
          const th = (90 + i * 5) * RAD
          const l = i % 3 === 0 ? 10 : 5
          return (
            <g key={i}>
              <line x1={px + Math.cos(th) * R} y1={py + Math.sin(th) * R} x2={px + Math.cos(th) * (R - l)} y2={py + Math.sin(th) * (R - l)} stroke="#cfe0ff" strokeOpacity=".7" />
              {i % 6 === 0 && (
                <text x={px + Math.cos(th) * (R - 20)} y={py + Math.sin(th) * (R - 20) + 4} textAnchor="middle" className="tool-tick">{i * 5}</text>
              )}
            </g>
          )
        })}
        <rect x={px - 128} y={py - 8} width="236" height="8" rx="4" fill="#dfe6ff" />
        <text x={px - 128} y={py - 14} className="svg-note">👁 ตา</text>
      </g>
      <line x1={px} y1={py} x2={px} y2={py + R + 10} stroke="#ffd27a" strokeWidth="1.5" />
      <circle cx={px} cy={py + R + 14} r="6" fill="#ffd27a" />
      <circle cx={px} cy={py} r="3.5" fill="#fff" />
      <g transform={`translate(${px + Math.cos(alt * RAD) * 110} ${py - Math.sin(alt * RAD) * 110})`}>
        <circle r="11" fill="#ffd27a" opacity=".3" />
        <circle r="4" fill="#fff" />
      </g>
    </svg>
  )
}

// ---------- การประมาณมุมด้วยมือ ----------
function Hand({ kind }) {
  const skin = '#f2c9a0'
  const line = '#b98a62'
  if (kind === 'pinky') {
    return (
      <svg viewBox="0 0 120 120" className="hand-svg">
        <rect x="52" y="20" width="16" height="70" rx="8" fill={skin} stroke={line} />
        <path d="M44 16 H76" stroke="#ffd27a" strokeWidth="2" />
      </svg>
    )
  }
  if (kind === 'three') {
    return (
      <svg viewBox="0 0 120 120" className="hand-svg">
        {[0, 1, 2].map((i) => <rect key={i} x={34 + i * 18} y={16 + Math.abs(i - 1) * 6} width="17" height="80" rx="8.5" fill={skin} stroke={line} />)}
        <path d="M32 10 H88" stroke="#ffd27a" strokeWidth="2" />
      </svg>
    )
  }
  if (kind === 'fist') {
    return (
      <svg viewBox="0 0 120 120" className="hand-svg">
        <rect x="26" y="30" width="68" height="62" rx="18" fill={skin} stroke={line} />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${30 + i * 16} 46 h14`} stroke={line} strokeLinecap="round" />)}
        <path d="M26 64 q-10 6 0 16" fill={skin} stroke={line} />
        <path d="M24 22 H96" stroke="#ffd27a" strokeWidth="2" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 120 120" className="hand-svg">
      <ellipse cx="62" cy="80" rx="24" ry="22" fill={skin} stroke={line} />
      {[-38, -14, 0, 14, 30].map((a, i) => (
        <rect key={i} x="56" y={i === 0 ? 40 : 16} width="13" height={i === 0 ? 40 : 56} rx="6.5" fill={skin} stroke={line} transform={`rotate(${a} 62 80)`} />
      ))}
      <path d="M10 18 H112" stroke="#ffd27a" strokeWidth="2" />
    </svg>
  )
}

const HANDS = [
  { kind: 'pinky', deg: '1°', name: 'นิ้วก้อย 1 นิ้ว' },
  { kind: 'three', deg: '5°', name: 'นิ้วชี้ กลาง นาง ชิดกัน' },
  { kind: 'fist', deg: '10°', name: 'กำมือ' },
  { kind: 'spread', deg: '20°', name: 'กางมือ (หัวแม่มือถึงนิ้วก้อย)' },
]

const EXAMPLES = [
  { t: 'ดวงจันทร์เต็มดวง', d: 'กว้างประมาณ ½° นิ้วก้อยนิ้วเดียวบังได้ทั้งดวง' },
  { t: 'เข็มขัดนายพราน (ดาวไถ)', d: 'ดาว 3 ดวงเรียงยาวประมาณ 3°' },
  { t: 'ดาวคู่ชี้ของกลุ่มดาวจระเข้', d: 'ห่างกันประมาณ 5° เท่ากับ 3 นิ้ว' },
  { t: 'ความยาวกลุ่มดาวจระเข้', d: 'ประมาณ 25° ยาวกว่ากางมือหนึ่งช่วง' },
]

export default function AltAz() {
  const [az, setAz] = useState(135)
  const [alt, setAlt] = useState(40)
  const [mission, setMission] = useState(null)
  const target = mission !== null ? MISSIONS[mission] : null
  const gap = target ? Math.abs(((az - target.az + 540) % 360) - 180) : 99
  const hit = target && gap <= 5 && Math.abs(alt - target.alt) <= 5

  return (
    <>
      <section className="stage">
        <div className="stage-head">
          <div>
            <h2>บอกตำแหน่งดาวด้วยมุม 2 ค่า</h2>
            <p>เลื่อนแถบด้านขวาเพื่อย้ายดาว สังเกตเส้นสีเหลือง (มุมทิศ) และสีฟ้า (มุมเงย)</p>
          </div>
        </div>

        <div className="split altaz">
          <Dome az={az} alt={alt} target={target} />
          <div className="altaz-panel">
            <div className="angle-card az">
              <span className="panel-kicker">มุมทิศ (Azimuth)</span>
              <b>{az}°</b>
              <small>ทิศ{dirName(az)}</small>
              <input type="range" min="0" max="359" value={az} onChange={(e) => setAz(Number(e.target.value))}
                className="slider" style={{ '--p': `${(az / 359) * 100}%`, '--c': '#ffd27a' }} />
              <p>มุมที่วัดตามแนว<b>ขอบฟ้า</b> เริ่มจาก<b>ทิศเหนือ = 0°</b> วนตามเข็มนาฬิกา ตะวันออก 90° ใต้ 180° ตะวันตก 270°</p>
            </div>
            <div className="angle-card alt">
              <span className="panel-kicker">มุมเงย (Altitude)</span>
              <b>{alt}°</b>
              <small>{alt === 0 ? 'อยู่ที่ขอบฟ้า' : alt === 90 ? 'อยู่เหนือศีรษะพอดี' : alt < 30 ? 'อยู่ต่ำใกล้ขอบฟ้า' : alt < 60 ? 'อยู่กลางฟ้า' : 'อยู่สูงเกือบเหนือศีรษะ'}</small>
              <input type="range" min="0" max="90" value={alt} onChange={(e) => setAlt(Number(e.target.value))}
                className="slider" style={{ '--p': `${(alt / 90) * 100}%`, '--c': '#7ee0ff' }} />
              <p>มุมที่วัดจาก<b>ขอบฟ้า (0°)</b> ขึ้นไปหาดาว จนถึง<b>จุดเหนือศีรษะ (90°)</b></p>
            </div>
          </div>
        </div>

        <div className="altaz-mission">
          <div className="stage-head">
            <div>
              <h2>ภารกิจ: ย้ายดาวไปตำแหน่งที่กำหนด</h2>
              <p>เลือกภารกิจ แล้วเลื่อนแถบให้ดาวไปอยู่ในวงสีเขียว (คลาดได้ไม่เกิน 5°)</p>
            </div>
            <div className="seg-tabs">
              {MISSIONS.map((m, i) => (
                <button key={i} className={mission === i ? 'on' : ''} onClick={() => setMission(i)}>ภารกิจ {i + 1}</button>
              ))}
            </div>
          </div>
          {target ? (
            <div className={`mission ${hit ? 'ok' : ''}`}>
              <h3>{target.title}</h3>
              <ul>
                <li className={gap <= 5 ? 'ok' : ''}><span>{gap <= 5 ? '✓' : ''}</span>มุมทิศ {target.az}° (ตอนนี้ {az}°)</li>
                <li className={Math.abs(alt - target.alt) <= 5 ? 'ok' : ''}><span>{Math.abs(alt - target.alt) <= 5 ? '✓' : ''}</span>มุมเงย {target.alt}° (ตอนนี้ {alt}°)</li>
              </ul>
              {hit && (
                <div className="mission-done">
                  <b>ถูกต้อง! 🎉</b>
                  <p>{target.note}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="foot-note">กดเลือกภารกิจด้านบนเพื่อเริ่ม</p>
          )}
        </div>
      </section>

      <section className="stage">
        <div className="stage-head">
          <div>
            <h2>เครื่องมือวัดมุม</h2>
            <p>ภาพทั้งสองเปลี่ยนตามตำแหน่งดาวที่ตั้งไว้ด้านบน</p>
          </div>
        </div>
        <div className="tools-grid">
          <div className="tool-card">
            <Compass az={az} />
            <h3>เข็มทิศ → วัดมุมทิศ</h3>
            <ol>
              <li>ถือเข็มทิศให้ขนานพื้น หมุนหน้าปัดจนเข็มสีแดงชี้ตรงตัว N (0°)</li>
              <li>หันแนวเล็งไปทางดาว</li>
              <li>อ่านตัวเลขบนหน้าปัดตรงแนวเล็ง = มุมทิศ <b className="gold">{az}°</b></li>
            </ol>
          </div>
          <div className="tool-card">
            <Quadrant alt={alt} />
            <h3>เครื่องวัดมุมเงย → วัดมุมเงย</h3>
            <ol>
              <li>ทำจากไม้โปรแทรกเตอร์ติดหลอดดูด แขวนเชือกกับลูกดิ่งที่จุดศูนย์กลาง</li>
              <li>มองดาวผ่านหลอด ลูกดิ่งจะห้อยตรงลงพื้นเสมอ</li>
              <li>อ่านตัวเลขตรงที่เชือกทับ = มุมเงย <b className="cyan">{alt}°</b></li>
            </ol>
          </div>
        </div>
      </section>

      <section className="stage">
        <div className="stage-head">
          <div>
            <h2>ไม่มีเครื่องมือ? ใช้มือกะมุมได้</h2>
            <p>เหยียดแขนไปข้างหน้าให้สุด แล้วใช้มือเทียบกับท้องฟ้า (ค่าโดยประมาณ ขนาดมือแต่ละคนต่างกันเล็กน้อย)</p>
          </div>
        </div>
        <div className="hand-grid">
          {HANDS.map((h, i) => (
            <div className="hand-card" key={h.kind} style={{ '--i': i }}>
              <Hand kind={h.kind} />
              <b>≈ {h.deg}</b>
              <small>{h.name}</small>
            </div>
          ))}
        </div>
        <div className="hand-tip">
          <b>ตัวอย่าง: กะมุมเงยด้วยกำปั้น</b>
          <p>วางกำปั้นให้ขอบล่างแตะขอบฟ้า แล้ววางกำปั้นซ้อนขึ้นไปทีละกำ นับได้ 3 กำปั้นก็ถึงดาว แปลว่าดาวมีมุมเงยประมาณ 3 × 10° = 30°</p>
        </div>
        <div className="use-grid">
          {EXAMPLES.map((e, i) => (
            <div className="use-card" key={e.t} style={{ '--i': i }}>
              <h3>{e.t}</h3>
              <p>{e.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
