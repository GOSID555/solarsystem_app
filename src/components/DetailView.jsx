import { PLANETS, SUN, distanceFromEarthKm, lightMinutes } from '../data/planets'
import {
  ArrowLeft, ChevronLeft, ChevronRight, GaugeIcon, MoonIcon, GlobeIcon, RotateIcon,
  CalendarIcon, RulerIcon, GravityIcon, ThermoIcon, RocketIcon,
} from './Icons'

const EARTH = PLANETS.find((p) => p.id === 'earth')
const num = (n, d = 1) => n.toLocaleString('th-TH', { maximumFractionDigits: d })

function formatKm(km) {
  if (km >= 1e9) return `${num(km / 1e9, 2)} พันล้าน กม.`
  return `${num(km / 1e6, 1)} ล้าน กม.`
}

function formatLight(min) {
  if (min < 60) return `${num(min, 1)} นาที`
  const h = Math.floor(min / 60)
  return `${h} ชม. ${Math.round(min - h * 60)} นาที`
}

function formatArea(km2) {
  if (km2 >= 1e12) return `${num(km2 / 1e12, 2)} ล้านล้าน กม²`
  return `${num(km2 / 1e6, 1)} ล้าน กม²`
}

function SizeCompare({ body }) {
  const ratio = body.diameterKm / EARTH.diameterKm
  const max = 64
  const big = ratio >= 1
  const bodySize = big ? max : Math.max(max * ratio, 6)
  const earthSize = big ? Math.max(max / ratio, 3) : max
  const text =
    body.id === 'earth'
      ? 'ใช้เป็นขนาดอ้างอิง'
      : big
        ? `ใหญ่กว่าโลก ${ratio >= 10 ? Math.round(ratio) : ratio.toFixed(1)} เท่า`
        : `ขนาด ${(ratio * 100).toFixed(0)}% ของโลก`
  return (
    <div className="card compare">
      <div className="compare-vis">
        <span className={`orb ${body.id === 'sun' ? 'glow' : ''}`} style={{ width: bodySize, height: bodySize, backgroundImage: `url(${body.texture})` }} />
        {body.id !== 'earth' && (
          <span className="orb" style={{ width: earthSize, height: earthSize, backgroundImage: `url(${EARTH.texture})` }} />
        )}
      </div>
      <div>
        <span className="card-label">เทียบขนาดกับโลก</span>
        <b className="card-value">{text}</b>
      </div>
    </div>
  )
}

function Distance({ body, days, layout }) {
  const fromSun = body.id === 'earth'
  const km = fromSun ? distanceFromEarthKm(SUN, days) : distanceFromEarthKm(body, days)
  const origin = fromSun ? SUN : EARTH
  return (
    <div className="distance" style={{ left: layout.cx, top: layout.cy + layout.radiusPx + 26 }}>
      <span className="distance-label">{fromSun ? 'ระยะห่างจากดวงอาทิตย์ตอนนี้' : 'ระยะห่างจากโลกตอนนี้'}</span>
      <b className="distance-value">{formatKm(km)}</b>
      <div className="distance-track">
        <span className={`orb ${fromSun ? 'glow' : ''}`} style={{ backgroundImage: `url(${origin.texture})` }} />
        <span className="track-line">
          <span className="rocket"><RocketIcon /></span>
        </span>
        <span className={`orb ${body.id === 'sun' ? 'glow' : ''}`} style={{ backgroundImage: `url(${body.texture})` }} />
      </div>
      <small className="distance-sub">แสงใช้เวลาเดินทาง {formatLight(lightMinutes(km))}</small>
    </div>
  )
}

export default function DetailView({ body, days, layout, anchorRefs, onBack, onPrev, onNext }) {
  const gravityRatio = body.gravity / EARTH.gravity
  const cards = [
    { icon: <GaugeIcon />, label: 'ความเร็วโคจรเฉลี่ย', value: body.orbitalSpeed },
    { icon: <MoonIcon />, label: 'ดวงจันทร์บริวาร', value: body.moons ? `${body.moons} ดวง` : 'ไม่มี' },
    { icon: <GlobeIcon />, label: 'พื้นที่ผิว', value: formatArea(body.surfaceKm2) },
    { icon: <RotateIcon />, label: 'คาบการหมุนรอบตัวเอง', value: body.dayLength },
    { icon: <CalendarIcon />, label: 'คาบการโคจร (1 ปี)', value: body.periodText },
    { icon: <RulerIcon />, label: 'เส้นผ่านศูนย์กลาง', value: body.diameter },
    {
      icon: <GravityIcon />,
      label: 'แรงโน้มถ่วงที่พื้นผิว',
      value: `${num(body.gravity, 2)} m/s²`,
      note: body.id === 'earth' ? null : `${num(gravityRatio, 2)} เท่าของโลก`,
    },
  ]

  return (
    <div className="detail" style={{ '--c': body.color }} key={body.id}>
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft /> <span>ระบบสุริยะ</span>
      </button>

      <header className="detail-title" style={{ left: layout.cx, top: layout.cy - layout.radiusPx - 28 }}>
        <button className="nav-arrow" onClick={onPrev} aria-label="ดาวก่อนหน้า"><ChevronLeft /></button>
        <div>
          <h2>{body.nameEn}</h2>
          <p>{body.name} · {body.nickname}</p>
        </div>
        <button className="nav-arrow" onClick={onNext} aria-label="ดาวถัดไป"><ChevronRight /></button>
      </header>

      <div className="temp-badge" ref={(el) => (anchorRefs.current.badge = el)}>
        <ThermoIcon />
        <span>{num(body.temp, 0)}°</span>
      </div>

      <Distance body={body} days={days} layout={layout} />

      <aside className="cards" style={{ '--sheet-top': `${layout.cy + layout.radiusPx + 140}px` }}>
        <div className="card desc-card">
          <span className="card-label">{body.type}</span>
          <p>{body.description}</p>
        </div>
        {cards.map((c, i) => (
          <div className="card stat-card" key={c.label} style={{ '--i': i }}>
            <span className="card-icon">{c.icon}</span>
            <div>
              <span className="card-label">{c.label}</span>
              <b className="card-value">{c.value}</b>
              {c.note && <small className="card-note">{c.note}</small>}
            </div>
          </div>
        ))}
        <SizeCompare body={body} />
      </aside>
    </div>
  )
}
