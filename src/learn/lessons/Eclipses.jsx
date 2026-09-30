import { useEffect, useRef, useState } from 'react'
import Photo from '../Photo'

// มุมดวงจันทร์รอบโลก: 180° = อยู่ระหว่างโลกกับดวงอาทิตย์ (สุริยุปราคา), 0° = อยู่หลังโลก (จันทรุปราคา)
const WINDOW = 14 // ช่วงมุมที่ยังเกิดอุปราคา (ขยายให้เห็นง่ายในภาพ)

const angDiff = (a, b) => {
  const d = (((a - b) % 360) + 540) % 360 - 180
  return d
}

function SunFromEarth({ off }) {
  // off: -1..1 ตำแหน่งดวงจันทร์เทียบดวงอาทิตย์ (0 = บังพอดี)
  const covered = Math.abs(off) < 0.06
  const visible = Math.abs(off) <= 1
  return (
    <svg viewBox="0 0 200 160" className={`inset-svg ${covered ? 'total' : ''}`}>
      <rect width="200" height="160" rx="14" fill={covered ? '#02030a' : visible ? '#0d2350' : '#2d6fc4'} className="inset-sky" />
      {covered && <circle cx="100" cy="80" r="52" fill="#fff" opacity=".22" className="corona" />}
      <circle cx="100" cy="80" r="38" fill="#ffd27a" />
      {visible && <circle cx={100 + off * 80} cy={80 - off * 10} r="39" fill="#0b0f22" />}
    </svg>
  )
}

function MoonFromEarth({ off }) {
  const inside = Math.abs(off) < 0.25
  const visible = Math.abs(off) <= 1
  return (
    <svg viewBox="0 0 200 160" className="inset-svg">
      <defs>
        <clipPath id="ec-moon"><circle cx="100" cy="80" r="38" /></clipPath>
      </defs>
      <rect width="200" height="160" rx="14" fill="#050818" />
      <image href="/textures/moon_1024.jpg" x="24" y="42" width="152" height="76" clipPath="url(#ec-moon)" preserveAspectRatio="none" />
      <circle cx="100" cy="80" r="38" fill="#b3401a" opacity={inside ? 0.62 : 0} style={{ transition: 'opacity .4s', mixBlendMode: 'multiply' }} />
      {visible && (
        <circle cx={100 + off * 110} cy="80" r="62" fill="#000" opacity={inside ? 0.25 : 0.72} clipPath="url(#ec-moon)" />
      )}
    </svg>
  )
}

export default function Eclipses() {
  const [angle, setAngle] = useState(140)
  const anim = useRef()

  const animateTo = (target) => {
    cancelAnimationFrame(anim.current)
    const start = performance.now()
    const from = angle
    const d = angDiff(target, from)
    const step = (now) => {
      const t = Math.min(1, (now - start) / 1200)
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      setAngle((((from + d * e) % 360) + 360) % 360)
      if (t < 1) anim.current = requestAnimationFrame(step)
    }
    anim.current = requestAnimationFrame(step)
  }
  useEffect(() => () => cancelAnimationFrame(anim.current), [])

  const solarOff = angDiff(angle, 180) / WINDOW
  const lunarOff = angDiff(angle, 0) / WINDOW
  const solar = Math.abs(solarOff) <= 1
  const lunar = Math.abs(lunarOff) <= 1

  // แผนภาพ: ดวงอาทิตย์ซ้าย โลกขวา ดวงจันทร์โคจรรอบโลก
  const ex = 560
  const ey = 180
  const orbit = 120
  const a = (angle * Math.PI) / 180
  const mx = ex + orbit * Math.cos(a)
  const my = ey - orbit * Math.sin(a)

  let status = { cls: '', title: 'ยังไม่เรียงเป็นเส้นตรง', text: 'ดวงอาทิตย์ โลก และดวงจันทร์ยังไม่อยู่ในแนวเดียวกัน จึงไม่เกิดอุปราคา' }
  if (solar) {
    const total = Math.abs(solarOff) < 0.06
    status = {
      cls: 'solar',
      title: total ? 'สุริยุปราคาเต็มดวง!' : 'สุริยุปราคาบางส่วน',
      text: 'ดวงจันทร์อยู่ระหว่างโลกกับดวงอาทิตย์ เงาของดวงจันทร์ตกลงบนโลก คนที่อยู่ในเงาจะเห็นดวงอาทิตย์ถูกบัง',
    }
  } else if (lunar) {
    const total = Math.abs(lunarOff) < 0.25
    status = {
      cls: 'lunar',
      title: total ? 'จันทรุปราคาเต็มดวง!' : 'จันทรุปราคาบางส่วน',
      text: total
        ? 'โลกอยู่ระหว่างดวงอาทิตย์กับดวงจันทร์ เงาโลกบังดวงจันทร์ทั้งดวง ดวงจันทร์เป็นสีแดงอิฐเพราะบรรยากาศโลกหักเหแสงสีแดงเข้าไปในเงา'
        : 'โลกอยู่ระหว่างดวงอาทิตย์กับดวงจันทร์ เงาของโลกเริ่มบังดวงจันทร์',
    }
  }

  return (
    <>
    <section className="stage">
      <div className="stage-head">
        <div>
          <h2>ลากดวงจันทร์ให้เรียงเป็นเส้นตรง</h2>
          <p>เลื่อนแถบด้านล่าง หรือกดปุ่มเพื่อจัดตำแหน่งให้เกิดอุปราคา</p>
        </div>
        <div className="chip-row">
          <button className="chip-btn solar" onClick={() => animateTo(180)}>☀ สุริยุปราคา</button>
          <button className="chip-btn lunar" onClick={() => animateTo(0)}>☾ จันทรุปราคา</button>
        </div>
      </div>

      <svg className="stage-svg wide" viewBox="0 0 800 360">
        <defs>
          <radialGradient id="ec-sun"><stop offset="0" stopColor="#fff6d8" /><stop offset=".45" stopColor="#ffb35c" /><stop offset="1" stopColor="#ff6a00" stopOpacity="0" /></radialGradient>
          <linearGradient id="ec-umbra" x1="0" x2="1"><stop offset="0" stopColor="#000" stopOpacity=".85" /><stop offset="1" stopColor="#000" stopOpacity=".2" /></linearGradient>
        </defs>
        <circle cx="40" cy="180" r="170" fill="url(#ec-sun)" />
        <circle cx="40" cy="180" r="92" fill="#ffc861" />
        <text x="60" y="340" className="svg-label">ดวงอาทิตย์</text>

        {[120, 180, 240].map((y) => (
          <line key={y} x1="140" y1={y} x2="500" y2={y} stroke="#ffd27a" strokeOpacity=".25" strokeDasharray="6 8" className="ray" />
        ))}

        <circle cx={ex} cy={ey} r={orbit} fill="none" stroke="#3a4270" strokeDasharray="3 5" />

        {/* เงามืดของโลก */}
        <path d={`M${ex} ${ey - 34} L${ex + 250} ${ey} L${ex} ${ey + 34}Z`} fill="url(#ec-umbra)" />
        {/* เงามืดของดวงจันทร์ */}
        <path d={`M${mx} ${my - 12} L${mx + 118} ${my} L${mx} ${my + 12}Z`} fill="url(#ec-umbra)" />

        <circle cx={ex} cy={ey} r="34" fill="#2f6fc0" />
        <path d={`M${ex} ${ey - 34} A34 34 0 0 1 ${ex} ${ey + 34}Z`} fill="#050818" opacity=".7" />
        {solar && <ellipse cx={ex - 33} cy={ey + (my - ey) * 0.3} rx="4" ry="9" fill="#000" opacity=".9" />}
        <text x={ex} y={ey + 60} textAnchor="middle" className="svg-sub">โลก</text>

        <g transform={`translate(${mx} ${my})`}>
          <circle r="12" fill={lunar && Math.abs(lunarOff) < 0.25 ? '#b3401a' : '#1a1f3c'} />
          {!(lunar && Math.abs(lunarOff) < 0.5) && <path d="M0 -12 A12 12 0 0 0 0 12Z" fill="#e6e8f0" />}
        </g>
        <text x={mx} y={my + (my > ey ? 30 : -20)} textAnchor="middle" className="svg-sub">ดวงจันทร์</text>
        <text x="780" y="340" textAnchor="end" className="svg-note">ขนาดและระยะไม่ตามสัดส่วนจริง</text>
      </svg>

      <div className="slider-wrap">
        <input
          type="range" min="0" max="359" value={Math.round(angle)}
          onChange={(e) => { cancelAnimationFrame(anim.current); setAngle(Number(e.target.value)) }}
          className="slider" style={{ '--p': `${(angle / 359) * 100}%` }}
        />
        <div className="slider-scale"><span>หลังโลก</span><span>ระหว่างโลกกับดวงอาทิตย์</span><span>หลังโลก</span></div>
      </div>

      <div className={`eclipse-status ${status.cls}`}>
        <div className="insets">
          <figure>
            <SunFromEarth off={solarOff} />
            <figcaption>ดวงอาทิตย์ที่เห็นจากโลก</figcaption>
          </figure>
          <figure>
            <MoonFromEarth off={lunarOff} />
            <figcaption>ดวงจันทร์ที่เห็นจากโลก</figcaption>
          </figure>
        </div>
        <div className="status-text">
          <h3>{status.title}</h3>
          <p>{status.text}</p>
          {solar && <p className="warn">⚠ ห้ามมองดวงอาทิตย์ด้วยตาเปล่า ต้องใช้แว่นกรองแสงสำหรับดูสุริยุปราคาโดยเฉพาะ</p>}
        </div>
      </div>

      <div className="eclipse-compare">
        <div className="ec-card solar">
          <h3>สุริยุปราคา <small>สุริยคราส</small></h3>
          <div className="order"><span className="o-sun">ดวงอาทิตย์</span>→<span className="o-moon">ดวงจันทร์</span>→<span className="o-earth">โลก</span></div>
          <p>เงาดวงจันทร์ตกบนโลก · เกิดตอนกลางวัน ในวันเดือนดับ</p>
        </div>
        <div className="ec-card lunar">
          <h3>จันทรุปราคา <small>จันทรคราส</small></h3>
          <div className="order"><span className="o-sun">ดวงอาทิตย์</span>→<span className="o-earth">โลก</span>→<span className="o-moon">ดวงจันทร์</span></div>
          <p>เงาโลกบังดวงจันทร์ · เกิดตอนกลางคืน ในวันเพ็ญ</p>
        </div>
      </div>
    </section>

    <section className="stage">
      <div className="stage-head">
        <div>
          <h2>ภาพจริง: สุริยุปราคา</h2>
          <p>สุริยุปราคามี 3 แบบ ขึ้นกับว่าดวงจันทร์บังดวงอาทิตย์ได้มากแค่ไหน แตะภาพเพื่อขยาย</p>
        </div>
      </div>
      <div className="photo-feature">
        <Photo
          id="eclipse-total-2017"
          alt="ลำดับขั้นสุริยุปราคาเต็มดวง"
          ratio="3 / 2"
          caption="สุริยุปราคาเต็มดวง 21 ส.ค. 2560 (สหรัฐอเมริกา) ภาพถ่ายซ้อนหลายช่วงเวลา ดวงจันทร์ค่อยๆ เลื่อนบังดวงอาทิตย์ ตรงกลางคือช่วงบังมิด เห็นแสงโคโรนา (บรรยากาศชั้นนอกของดวงอาทิตย์) เป็นวงสว่างรอบๆ"
        />
      </div>
      <div className="photo-grid">
        <div className="photo-card">
          <Photo id="eclipse-annular-2012" alt="สุริยุปราคาวงแหวน" ratio="1 / 1" />
          <h3>สุริยุปราคาวงแหวน</h3>
          <p>ดวงจันทร์อยู่ไกลโลกกว่าปกติ จึงดูเล็กกว่าดวงอาทิตย์ บังไม่มิด เหลือขอบสว่างเป็นวงแหวน (20 พ.ค. 2555)</p>
        </div>
        <div className="photo-card">
          <Photo id="eclipse-partial" alt="สุริยุปราคาบางส่วน" ratio="1 / 1" />
          <h3>สุริยุปราคาบางส่วน</h3>
          <p>ดวงจันทร์บังดวงอาทิตย์เพียงบางส่วน ดวงอาทิตย์จึงแหว่งเหมือนถูกกัด เป็นแบบที่คนเห็นบ่อยที่สุด</p>
        </div>
        <div className="photo-card">
          <Photo id="epic-moon-shadow-2017" alt="เงาดวงจันทร์บนโลกถ่ายจากอวกาศ" ratio="1 / 1" />
          <h3>เงาดวงจันทร์บนโลก</h3>
          <p>ภาพถ่ายจากดาวเทียม DSCOVR ในวันเกิดสุริยุปราคา 21 ส.ค. 2560 เห็นเงาดวงจันทร์เป็นจุดมืดบนทวีปอเมริกาเหนือ คนในเงาเห็นดวงอาทิตย์ถูกบัง</p>
        </div>
      </div>
      <p className="warn-banner">⚠ ห้ามมองดวงอาทิตย์ด้วยตาเปล่า กล้องถ่ายรูป หรือกล้องส่องทางไกล แม้ขณะเกิดสุริยุปราคา ต้องใช้แว่นกรองแสงสำหรับดูดวงอาทิตย์โดยเฉพาะ</p>
    </section>

    <section className="stage">
      <div className="stage-head">
        <div>
          <h2>ภาพจริง: จันทรุปราคา</h2>
          <p>ดวงจันทร์ค่อยๆ เข้าไปในเงาของโลก แล้วกลายเป็นสีแดงอิฐ มองด้วยตาเปล่าได้อย่างปลอดภัย</p>
        </div>
      </div>
      <div className="photo-grid two">
        <div className="photo-card">
          <Photo id="lunar-sequence-2026" alt="ลำดับขั้นจันทรุปราคา" ratio="1 / 1" />
          <h3>ลำดับการเกิด</h3>
          <p>เงาโลกค่อยๆ กินดวงจันทร์จากด้านหนึ่ง (บางส่วน) จนบังทั้งดวง (เต็มดวง) ถ่ายเมื่อ 3 มี.ค. 2569</p>
        </div>
        <div className="photo-card">
          <Photo id="lunar-total-2026" alt="จันทรุปราคาเต็มดวง" ratio="3 / 2" />
          <h3>จันทรุปราคาเต็มดวง</h3>
          <p>ดวงจันทร์ไม่มืดสนิท แต่เป็นสีแดงอิฐ เพราะบรรยากาศโลกหักเหแสงสีแดงของดวงอาทิตย์เข้าไปในเงา</p>
        </div>
      </div>
    </section>
    </>
  )
}
