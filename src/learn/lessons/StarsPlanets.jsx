import { useMemo, useState } from 'react'

// ท้องฟ้าจำลอง: ดาวฤกษ์กะพริบ ดาวเคราะห์นิ่ง ให้ผู้เรียนแตะหาดาวเคราะห์
const SKY = [
  { x: 12, y: 30, r: 2.4, d: 0.0 }, { x: 24, y: 62, r: 1.8, d: 1.3 }, { x: 38, y: 22, r: 2.8, d: 0.6 },
  { x: 52, y: 48, r: 2.0, d: 2.1 }, { x: 70, y: 26, r: 2.2, d: 1.7 }, { x: 84, y: 58, r: 2.6, d: 0.3 },
  { x: 90, y: 20, r: 1.8, d: 2.6 }, { x: 60, y: 72, r: 2.0, d: 0.9 },
]
const PLANET = { x: 32, y: 44 }

function NightSky() {
  const [picked, setPicked] = useState(null)
  const bg = useMemo(
    () => Array.from({ length: 60 }, () => ({ x: Math.random() * 100, y: Math.random() * 100, o: 0.15 + Math.random() * 0.35 })),
    [],
  )
  const result =
    picked === 'planet'
      ? { ok: true, text: 'ถูกต้อง! ดวงนี้ส่องแสงนิ่ง ไม่กะพริบ เพราะเป็นดาวเคราะห์ (ดาวพฤหัสบดี) ที่สะท้อนแสงจากดวงอาทิตย์' }
      : picked !== null
        ? { ok: false, text: 'ยังไม่ใช่ — ดวงนี้ระยิบระยับ แสดงว่าเป็นดาวฤกษ์ที่มีแสงในตัวเอง ลองหาดวงที่ส่องแสงนิ่งๆ ดู' }
        : null

  return (
    <div className="sky-game">
      <div className="sky-head">
        <b>ลองเล่น: ดาวดวงไหนเป็นดาวเคราะห์?</b>
        <span>สังเกตให้ดี ดาวฤกษ์จะระยิบระยับ แต่ดาวเคราะห์ส่องแสงนิ่ง แล้วแตะดวงที่คิดว่าใช่</span>
      </div>
      <div className="sky-field">
        {bg.map((s, i) => (
          <i key={i} className="sky-dust" style={{ left: `${s.x}%`, top: `${s.y}%`, opacity: s.o }} />
        ))}
        {SKY.map((s, i) => (
          <button
            key={i}
            className={`sky-star ${picked === i ? 'wrong' : ''}`}
            style={{ left: `${s.x}%`, top: `${s.y}%`, '--r': `${s.r * 2}px`, animationDelay: `${s.d}s` }}
            onClick={() => setPicked(i)}
            aria-label="ดาว"
          />
        ))}
        <button
          className={`sky-planet ${picked === 'planet' ? 'right' : ''}`}
          style={{ left: `${PLANET.x}%`, top: `${PLANET.y}%` }}
          onClick={() => setPicked('planet')}
          aria-label="ดาว"
        />
        <div className="horizon" />
      </div>
      <p className={`sky-result ${result ? (result.ok ? 'ok' : 'no') : ''}`}>{result ? result.text : ' '}</p>
    </div>
  )
}

export default function StarsPlanets() {
  const [sunOn, setSunOn] = useState(true)

  return (
    <>
      <section className="stage">
        <div className="stage-head">
          <div>
            <h2>ใครมีแสงในตัวเอง?</h2>
            <p>ลองกด “ปิดดวงอาทิตย์” แล้วดูว่าดาวดวงไหนยังสว่างอยู่</p>
          </div>
          <button className={`toggle-btn ${sunOn ? 'on' : ''}`} onClick={() => setSunOn((v) => !v)}>
            <span className="toggle-knob" />
            {sunOn ? 'ดวงอาทิตย์ส่องแสง' : 'ปิดดวงอาทิตย์แล้ว'}
          </button>
        </div>

        <svg className={`stage-svg wide sp ${sunOn ? '' : 'sun-off'}`} viewBox="0 0 800 360">
          <defs>
            <radialGradient id="sp-sun">
              <stop offset="0" stopColor="#fff6d8" />
              <stop offset=".45" stopColor="#ffc15a" />
              <stop offset=".75" stopColor="#ff7a1a" />
              <stop offset="1" stopColor="#ff5a00" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="sp-star">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset=".3" stopColor="#dfe8ff" />
              <stop offset="1" stopColor="#8ec5ff" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="sp-planet" x1="0" x2="1">
              <stop offset="0" stopColor="#f0d6a8" />
              <stop offset=".5" stopColor="#c99a6b" />
              <stop offset=".52" stopColor="#1b1f36" />
              <stop offset="1" stopColor="#10142a" />
            </linearGradient>
            <marker id="sp-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0 10 5 0 10z" fill="#ffd27a" />
            </marker>
            <marker id="sp-arrow2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0 10 5 0 10z" fill="#a8c4ff" />
            </marker>
          </defs>

          {/* ดวงอาทิตย์ */}
          <g className="sp-sun">
            <circle cx="130" cy="180" r="120" fill="url(#sp-sun)" className="sp-glow" />
            <circle cx="130" cy="180" r="58" fill="#ffc861" />
          </g>
          <text x="130" y="300" textAnchor="middle" className="svg-label">ดวงอาทิตย์ (ดาวฤกษ์)</text>
          <text x="130" y="320" textAnchor="middle" className="svg-sub">{sunOn ? 'มีแสงในตัวเอง' : 'ถ้าดับ…'}</text>

          {/* แสงจากดวงอาทิตย์ → ดาวเคราะห์ → ตาเรา */}
          <g className="sp-rays">
            <path d="M200 160 L505 128" stroke="#ffd27a" strokeWidth="2" className="ray" markerEnd="url(#sp-arrow)" />
            <path d="M200 185 L505 148" stroke="#ffd27a" strokeWidth="2" className="ray" markerEnd="url(#sp-arrow)" />
            <path d="M548 162 L676 262" stroke="#a8c4ff" strokeWidth="2" className="ray slow" markerEnd="url(#sp-arrow2)" />
            <text x="350" y="130" textAnchor="middle" className="svg-note">แสงอาทิตย์</text>
            <text x="650" y="200" className="svg-note">แสงสะท้อน</text>
          </g>

          {/* ดาวเคราะห์ */}
          <circle cx="540" cy="140" r="34" fill={sunOn ? 'url(#sp-planet)' : '#0e1226'} stroke={sunOn ? 'none' : '#2a3160'} className="sp-planet" />
          <text x="540" y="202" textAnchor="middle" className="svg-label">ดาวเคราะห์</text>
          <text x="540" y="222" textAnchor="middle" className="svg-sub">{sunOn ? 'สะท้อนแสงอาทิตย์' : 'มืดสนิท มองไม่เห็น'}</text>

          {/* ผู้สังเกตบนโลก */}
          <g transform="translate(700 280)">
            <circle r="24" fill="#2f6fc0" />
            <path d="M-14 -6q8-8 16 0t12 4" stroke="#3fa35a" strokeWidth="6" fill="none" strokeLinecap="round" />
          </g>
          <text x="700" y="330" textAnchor="middle" className="svg-sub">ผู้สังเกตบนโลก</text>

          {/* ดาวฤกษ์ไกลๆ ยังสว่างเสมอ */}
          <g className="sp-far-star">
            <circle cx="720" cy="70" r="26" fill="url(#sp-star)" />
            <circle cx="720" cy="70" r="4" fill="#fff" />
          </g>
          <text x="720" y="118" textAnchor="middle" className="svg-label small">ดาวฤกษ์ไกลๆ</text>
          <text x="720" y="136" textAnchor="middle" className="svg-sub">{sunOn ? 'มีแสงในตัวเอง' : 'ยังส่องแสงอยู่!'}</text>
        </svg>

        <div className="compare-table">
          <div className="ct-col star">
            <h3>ดาวฤกษ์</h3>
            <ul>
              <li><b>แสง</b> มีแสงในตัวเอง</li>
              <li><b>มองเห็น</b> ระยิบระยับ กะพริบ</li>
              <li><b>ตัวอย่าง</b> ดวงอาทิตย์ ดาวเหนือ ดาวซิริอุส</li>
            </ul>
          </div>
          <div className="ct-col planet">
            <h3>ดาวเคราะห์</h3>
            <ul>
              <li><b>แสง</b> ไม่มีแสงในตัวเอง สะท้อนแสงอาทิตย์</li>
              <li><b>มองเห็น</b> ส่องแสงนิ่ง ไม่กะพริบ</li>
              <li><b>ตัวอย่าง</b> ดาวศุกร์ ดาวอังคาร ดาวพฤหัสบดี</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="stage">
        <NightSky />
      </section>
    </>
  )
}
