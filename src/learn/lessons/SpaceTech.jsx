import { useState } from 'react'
import Photo from '../Photo'

// วงโคจรในภาพย่อส่วนให้ดูง่าย ไม่ใช่ขนาดจริง
const SATS = [
  {
    id: 'iss', name: 'สถานีอวกาศนานาชาติ', en: 'ISS', color: '#ffd27a',
    orbit: { rx: 118, ry: 118, rot: 0 }, dur: 9,
    height: '~400 กม.', use: 'ห้องทดลองในอวกาศ มีนักบินอวกาศอยู่ประจำ',
    text: 'โคจรรอบโลก 1 รอบใช้เวลาประมาณ 90 นาที นักบินอวกาศทำการทดลองในสภาพไร้น้ำหนัก เพื่อศึกษาการใช้ชีวิตและพัฒนาเทคโนโลยีใหม่',
  },
  {
    id: 'theos', name: 'ดาวเทียมสำรวจทรัพยากร', en: 'ไทยโชต · THEOS-2', color: '#7ee0a0',
    orbit: { rx: 42, ry: 140, rot: 0 }, dur: 11,
    height: '~600–800 กม. · วงโคจรผ่านขั้วโลก', use: 'ถ่ายภาพพื้นผิวโลก',
    text: 'ดาวเทียมสำรวจทรัพยากรของไทย ถ่ายภาพพื้นที่เกษตร ป่าไม้ แหล่งน้ำ ใช้ติดตามน้ำท่วม ไฟป่า และวางผังเมือง',
  },
  {
    id: 'gps', name: 'ดาวเทียมนำทาง', en: 'GPS', color: '#8ec5ff',
    orbit: { rx: 190, ry: 110, rot: -28 }, dur: 16,
    height: '~20,200 กม.', use: 'บอกตำแหน่งบนโลก',
    text: 'มีดาวเทียมหลายดวงโคจรรอบโลก โทรศัพท์รับสัญญาณจากดาวเทียมอย่างน้อย 4 ดวงพร้อมกันเพื่อคำนวณตำแหน่ง ใช้ในแผนที่นำทาง',
  },
  {
    id: 'comm', name: 'ดาวเทียมสื่อสาร', en: 'ไทยคม (THAICOM)', color: '#ff9a6a',
    orbit: { rx: 250, ry: 250, rot: 0 }, dur: 30,
    height: '~36,000 กม. · ค้างฟ้า', use: 'ถ่ายทอดโทรทัศน์ โทรศัพท์ อินเทอร์เน็ต',
    text: 'โคจรเร็วเท่ากับที่โลกหมุน จึงดูเหมือนลอยนิ่งอยู่เหนือจุดเดิมบนโลก (ค้างฟ้า) เหมาะกับการส่งสัญญาณโทรทัศน์และการสื่อสาร',
  },
  {
    id: 'weather', name: 'ดาวเทียมอุตุนิยมวิทยา', en: 'ฮิมาวาริ (Himawari)', color: '#b18cff',
    orbit: { rx: 250, ry: 250, rot: 0 }, dur: 30, phase: 0.5,
    height: '~36,000 กม. · ค้างฟ้า', use: 'ถ่ายภาพเมฆ พยากรณ์อากาศ',
    text: 'ถ่ายภาพเมฆและพายุทุกๆ ไม่กี่นาที กรมอุตุนิยมวิทยาใช้ภาพเหล่านี้พยากรณ์อากาศและเตือนภัยพายุล่วงหน้า',
  },
]

const USES = [
  { icon: '📍', title: 'นำทางด้วย GPS', text: 'แผนที่ในมือถือ แอปเรียกรถ การเดินเรือและการบิน' },
  { icon: '⛈', title: 'พยากรณ์อากาศ', text: 'ติดตามเมฆ ฝน และพายุ วางแผนการเกษตร' },
  { icon: '🌊', title: 'เตือนภัยธรรมชาติ', text: 'ติดตามน้ำท่วม ไฟป่า พายุ ช่วยอพยพได้ทันเวลา' },
  { icon: '📡', title: 'สื่อสาร', text: 'โทรทัศน์ดาวเทียม โทรศัพท์ อินเทอร์เน็ตในพื้นที่ห่างไกล' },
]

const PROBES = [
  { title: 'กล้องโทรทรรศน์อวกาศ', text: 'เช่น กล้องเจมส์ เว็บบ์ ถ่ายภาพดาราจักรที่อยู่ไกลมาก' },
  { title: 'ยานสำรวจดาวเคราะห์', text: 'เช่น ยานเพอร์เซเวียแรนซ์ ลงสำรวจพื้นผิวดาวอังคาร' },
  { title: 'ยานสำรวจอวกาศไกล', text: 'เช่น ยานวอยเอจเจอร์ 1 เดินทางออกไปนอกระบบสุริยะแล้ว' },
]

const THAI_TIMELINE = [
  { year: 2536, name: 'ไทยคม 1', text: 'ดาวเทียมสื่อสารดวงแรกของไทย', color: '#ff9a6a' },
  { year: 2551, name: 'ไทยโชต (THEOS)', text: 'ดาวเทียมสำรวจทรัพยากรดวงแรก', color: '#7ee0a0' },
  { year: 2559, name: 'ไทยคม 8', text: 'ส่งขึ้นด้วยจรวด Falcon 9', color: '#ff9a6a' },
  { year: 2561, name: 'KNACKSAT', text: 'ดาวเทียมที่คนไทยสร้างเองดวงแรก', color: '#ffd27a' },
  { year: 2563, name: 'NAPA-1', text: 'ดาวเทียมของกองทัพอากาศ', color: '#8ec5ff' },
  { year: 2566, name: 'THEOS-2', text: 'ถ่ายภาพละเอียด 50 ซม.', color: '#7ee0a0' },
]

const USED_TECH = [
  {
    photo: 'gps-block-3a', ratio: '1 / 1', icon: '📍', tag: 'สหรัฐอเมริกา',
    title: 'ระบบนำทางด้วยดาวเทียม GPS',
    text: 'ภาพจำลองดาวเทียม GPS · มือถือในไทยรับสัญญาณจากดาวเทียมเหล่านี้เพื่อบอกตำแหน่ง ใช้ในแอปแผนที่ เรียกรถ ส่งของ และการเดินเรือ',
  },
  {
    photo: 'himawari-8', ratio: '1 / 1', icon: '⛈', tag: 'ญี่ปุ่น',
    title: 'ดาวเทียมอุตุนิยมวิทยาฮิมาวาริ',
    text: 'ภาพโลกทั้งดวงจากดาวเทียมฮิมาวาริ-8 กรมอุตุนิยมวิทยาของไทยใช้ภาพเมฆจากดาวเทียมนี้ติดตามพายุและพยากรณ์อากาศ',
  },
  {
    photo: 'thailand-flood-2011', ratio: '1 / 1', icon: '🌊', tag: 'NASA (MODIS)',
    title: 'ติดตามน้ำท่วมใหญ่ พ.ศ. 2554',
    text: 'ภาพจากดาวเทียมวันที่ 19 ต.ค. 2554 แบบสีผสม: สีเขียว = พืชพรรณ, สีน้ำเงินเข้ม = น้ำ เห็นน้ำท่วมกว้างในภาคกลาง ใช้วางแผนช่วยเหลือและเตือนภัย',
  },
  {
    photo: 'thai-national-observatory', ratio: '1 / 1', icon: '🔭', tag: 'NARIT',
    title: 'หอดูดาวแห่งชาติ ดอยอินทนนท์',
    text: 'ของสถาบันวิจัยดาราศาสตร์แห่งชาติ (สดร.) มีกล้องโทรทรรศน์ขนาด 2.4 เมตร ใช้ศึกษาดาวและกาแล็กซี และให้นักเรียนไทยได้ใช้เรียนรู้',
  },
]

const ellipsePath = ({ rx, ry }) => `M${rx} 0 A${rx} ${ry} 0 1 0 ${-rx} 0 A${rx} ${ry} 0 1 0 ${rx} 0`

export default function SpaceTech() {
  const [active, setActive] = useState('gps')
  const sat = SATS.find((s) => s.id === active)

  return (
    <>
      <section className="stage">
        <div className="stage-head">
          <div>
            <h2>ดาวเทียมรอบโลก</h2>
            <p>แตะดาวเทียมหรือปุ่มด้านล่างเพื่อดูว่าแต่ละดวงทำหน้าที่อะไร</p>
          </div>
        </div>

        <div className="split tech">
          <svg className="stage-svg" viewBox="-300 -290 600 580">
            <defs>
              <clipPath id="st-earth"><circle r="70" /></clipPath>
              <radialGradient id="st-shade" cx=".35" cy=".35" r=".75"><stop offset=".45" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".75" /></radialGradient>
              <radialGradient id="st-atmo"><stop offset=".85" stopColor="#5aa8ff" stopOpacity="0" /><stop offset=".92" stopColor="#5aa8ff" stopOpacity=".5" /><stop offset="1" stopColor="#5aa8ff" stopOpacity="0" /></radialGradient>
            </defs>
            {SATS.map((s) => (
              <path key={s.id} d={ellipsePath(s.orbit)} transform={`rotate(${s.orbit.rot})`} fill="none"
                stroke={s.id === active ? s.color : '#3a4270'} strokeWidth={s.id === active ? 2 : 1}
                strokeDasharray={s.id === active ? '' : '3 5'} opacity={s.id === active ? 0.9 : 0.8} />
            ))}
            <circle r="84" fill="url(#st-atmo)" />
            <g clipPath="url(#st-earth)">
              <image href="/textures/earth_atmos_2048.jpg" x="-140" y="-70" width="420" height="140" preserveAspectRatio="none" className="st-earth-map" />
              <circle r="70" fill="url(#st-shade)" />
            </g>
            <circle r="70" fill="none" stroke="#8ec5ff" strokeOpacity=".3" />

            {SATS.map((s) => (
              <g key={s.id} transform={`rotate(${s.orbit.rot})`}>
                <g className={`sat ${s.id === active ? 'on' : ''}`} onClick={() => setActive(s.id)} style={{ '--c': s.color }}>
                  <animateMotion dur={`${s.dur}s`} repeatCount="indefinite" path={ellipsePath(s.orbit)} begin={`-${(s.phase ?? 0) * s.dur}s`} />
                  <g transform={`rotate(${-s.orbit.rot})`}>
                    <circle r="16" fill="transparent" />
                    <rect x="-5" y="-4" width="10" height="8" rx="1.5" fill="#dfe6ff" />
                    <rect x="-17" y="-2.5" width="10" height="5" fill={s.color} />
                    <rect x="7" y="-2.5" width="10" height="5" fill={s.color} />
                  </g>
                </g>
              </g>
            ))}
            <text x="-290" y="280" className="svg-note">ระยะและขนาดไม่ตามสัดส่วนจริง</text>
          </svg>

          <div className="sat-panel" key={sat.id} style={{ '--c': sat.color }}>
            <span className="panel-kicker">{sat.en}</span>
            <h3>{sat.name}</h3>
            <dl>
              <div><dt>ความสูงจากพื้นโลก</dt><dd>{sat.height}</dd></div>
              <div><dt>หน้าที่</dt><dd>{sat.use}</dd></div>
            </dl>
            <p>{sat.text}</p>
          </div>
        </div>

        <div className="chip-row wrap center">
          {SATS.map((s) => (
            <button key={s.id} className={`chip-btn ${s.id === active ? 'on' : ''}`} style={{ '--c': s.color }} onClick={() => setActive(s.id)}>
              <i className="dot" /> {s.name}
            </button>
          ))}
        </div>
      </section>

      <section className="stage">
        <div className="stage-head">
          <div>
            <h2>🇹🇭 ดาวเทียมของประเทศไทย</h2>
            <p>ประเทศไทยมีดาวเทียมของตัวเองทั้งดาวเทียมสื่อสาร ดาวเทียมสำรวจทรัพยากร และดาวเทียมที่คนไทยสร้างเอง</p>
          </div>
        </div>

        <ol className="timeline">
          {THAI_TIMELINE.map((t, i) => (
            <li key={t.year} style={{ '--c': t.color, '--i': i }}>
              <span className="tl-year">พ.ศ. {t.year}</span>
              <b>{t.name}</b>
              <small>{t.text}</small>
            </li>
          ))}
        </ol>

        <div className="sat-cards">
          <article className="sat-card">
            <Photo id="thaicom-8" alt="จรวด Falcon 9 กับดาวเทียมไทยคม 8" ratio="4 / 3" caption="จรวด Falcon 9 บนฐานปล่อย บรรทุกดาวเทียมไทยคม 8 ไว้ที่ส่วนหัว (27 พ.ค. 2559)" />
            <div className="sat-card-body">
              <span className="chip" style={{ '--c': '#ff9a6a' }}>ดาวเทียมสื่อสาร</span>
              <h3>ไทยคม (THAICOM)</h3>
              <p>ดาวเทียมสื่อสารดวงแรกของไทย ไทยคม 1 ขึ้นสู่อวกาศเมื่อ พ.ศ. 2536 ปัจจุบันมีหลายดวง อยู่ในวงโคจรค้างฟ้าสูงประมาณ 36,000 กม. ใช้ถ่ายทอดสัญญาณโทรทัศน์ โทรศัพท์ และอินเทอร์เน็ต</p>
            </div>
          </article>

          <article className="sat-card">
            <div className="photo-frame illus" aria-hidden>
              <svg viewBox="0 0 240 180">
                <defs><linearGradient id="th-ground" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#2c6e49" /><stop offset="1" stopColor="#153d2a" /></linearGradient></defs>
                <rect width="240" height="180" fill="#070b24" />
                <path d="M0 150 Q120 118 240 150 V180 H0Z" fill="url(#th-ground)" />
                <path d="M120 70 L70 150 H170Z" fill="#7ee0a0" opacity=".14" />
                <g transform="translate(120 58)">
                  <rect x="-12" y="-10" width="24" height="20" rx="3" fill="#dfe6ff" />
                  <rect x="-50" y="-6" width="34" height="12" fill="#5b82ff" />
                  <rect x="16" y="-6" width="34" height="12" fill="#5b82ff" />
                  <circle cy="12" r="4" fill="#0b1433" stroke="#7ee0a0" />
                </g>
                <text x="120" y="24" textAnchor="middle" fill="#9aa6d6" fontSize="11">ภาพประกอบ</text>
              </svg>
            </div>
            <div className="sat-card-body">
              <span className="chip" style={{ '--c': '#7ee0a0' }}>ดาวเทียมสำรวจทรัพยากร</span>
              <h3>ไทยโชต (THEOS) และ THEOS-2</h3>
              <p>ดูแลโดย สทอภ. (GISTDA) ไทยโชตขึ้นสู่อวกาศ 1 ต.ค. 2551 ส่วน THEOS-2 ขึ้นเมื่อ 9 ต.ค. 2566 ถ่ายภาพได้ละเอียดถึง 50 ซม. ใช้วางแผนการเกษตร จัดการน้ำ ติดตามน้ำท่วม ไฟป่า และวางผังเมือง</p>
              <a className="ext-link" href="https://www.gistda.or.th/" target="_blank" rel="noreferrer">ดูภาพจริงจากดาวเทียมที่เว็บไซต์ GISTDA ↗</a>
            </div>
          </article>

          <article className="sat-card">
            <Photo id="knacksat-2" alt="ดาวเทียม KNACKSAT-2" ratio="4 / 3" caption="ดาวเทียม KNACKSAT-2 ในห้องปลอดฝุ่น ขนาดประมาณ 10 × 10 × 30 ซม." />
            <div className="sat-card-body">
              <span className="chip" style={{ '--c': '#ffd27a' }}>สร้างโดยคนไทย</span>
              <h3>แนคแซท (KNACKSAT)</h3>
              <p>ดาวเทียมดวงแรกที่คนไทยออกแบบและสร้างเองทั้งหมด โดยมหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ (มจพ.) ขึ้นสู่อวกาศ พ.ศ. 2561 เป็นดาวเทียมขนาดเล็ก (CubeSat) ส่วน KNACKSAT-2 เป็นรุ่นต่อมา</p>
            </div>
          </article>
        </div>
      </section>

      <section className="stage">
        <div className="stage-head">
          <div>
            <h2>เทคโนโลยีอวกาศที่ประเทศไทยนำมาใช้</h2>
            <p>นอกจากดาวเทียมของไทยเอง เรายังใช้ข้อมูลจากดาวเทียมและเทคโนโลยีของประเทศอื่นในชีวิตประจำวัน</p>
          </div>
        </div>
        <div className="photo-grid tech-photos">
          {USED_TECH.map((u) => (
            <div className="photo-card" key={u.photo}>
              <Photo id={u.photo} alt={u.title} ratio={u.ratio} />
              <span className="use-tag">{u.icon} {u.tag}</span>
              <h3>{u.title}</h3>
              <p>{u.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="stage">
        <div className="stage-head"><div><h2>ประโยชน์ในชีวิตประจำวัน</h2></div></div>
        <div className="use-grid">
          {USES.map((u, i) => (
            <div className="use-card" key={u.title} style={{ '--i': i }}>
              <span className="use-icon">{u.icon}</span>
              <h3>{u.title}</h3>
              <p>{u.text}</p>
            </div>
          ))}
        </div>
        <div className="stage-head" style={{ marginTop: 24 }}><div><h2>ยานอวกาศสำรวจ</h2></div></div>
        <div className="use-grid three">
          {PROBES.map((u, i) => (
            <div className="use-card" key={u.title} style={{ '--i': i }}>
              <h3>{u.title}</h3>
              <p>{u.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
