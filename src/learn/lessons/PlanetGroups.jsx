import { useState } from 'react'
import { PLANETS } from '../../data/planets'
import { ChevronRight } from '../../components/Icons'

const INNER = ['mercury', 'venus', 'earth', 'mars']
const MAX_D = Math.max(...PLANETS.map((p) => p.diameterKm))

export default function PlanetGroups({ go }) {
  const [active, setActive] = useState('earth')
  const [trueSize, setTrueSize] = useState(false)
  const planet = PLANETS.find((p) => p.id === active)
  const inner = INNER.includes(active)

  // ขนาดวงกลมบนจอ: โหมดปกติให้เห็นชัดทุกดวง / โหมดขนาดจริงเทียบตามเส้นผ่านศูนย์กลาง
  const size = (p) => (trueSize ? Math.max(4, (p.diameterKm / MAX_D) * 150) : 34 + p.radius * 16)

  const row = (ids) =>
    PLANETS.filter((p) => ids.includes(p.id)).map((p) => (
      <button
        key={p.id}
        className={`pg-planet ${active === p.id ? 'on' : ''}`}
        style={{ '--c': p.color }}
        onClick={() => setActive(p.id)}
      >
        <span className="pg-orb-wrap" style={{ height: trueSize ? 150 : 90 }}>
          <span
            className={`orb ${p.ring ? 'ringed' : ''}`}
            style={{ width: size(p), height: size(p), backgroundImage: `url(${p.texture})` }}
          />
        </span>
        <b>{p.name}</b>
      </button>
    ))

  return (
    <section className="stage">
      <div className="stage-head">
        <div>
          <h2>แตะดาวเคราะห์เพื่อดูข้อมูล</h2>
          <p>เรียงจากใกล้ดวงอาทิตย์ไปไกล: พุธ ศุกร์ โลก อังคาร | พฤหัสบดี เสาร์ ยูเรนัส เนปจูน</p>
        </div>
        <button className={`toggle-btn ${trueSize ? 'on' : ''}`} onClick={() => setTrueSize((v) => !v)}>
          <span className="toggle-knob" />
          เทียบขนาดจริง
        </button>
      </div>

      <div className="pg-lanes">
        <div className="pg-sun" aria-hidden />
        <div className={`pg-group inner ${inner ? 'focus' : ''}`}>
          <span className="pg-tag">ดาวเคราะห์ชั้นใน · ดาวเคราะห์หิน</span>
          <div className="pg-row">{row(INNER)}</div>
        </div>
        <div className="pg-belt" title="แถบดาวเคราะห์น้อย">
          <span>แถบดาวเคราะห์น้อย</span>
        </div>
        <div className={`pg-group outer ${!inner ? 'focus' : ''}`}>
          <span className="pg-tag">ดาวเคราะห์ชั้นนอก · ดาวเคราะห์แก๊สยักษ์</span>
          <div className="pg-row">{row(PLANETS.map((p) => p.id).filter((id) => !INNER.includes(id)))}</div>
        </div>
      </div>

      <div className="pg-info" key={planet.id} style={{ '--c': planet.color }}>
        <span className="orb big" style={{ backgroundImage: `url(${planet.texture})` }} />
        <div className="pg-info-text">
          <span className={`chip ${inner ? 'rock' : 'gas'}`}>{inner ? 'ชั้นใน · หิน' : 'ชั้นนอก · แก๊ส'}</span>
          <h3>{planet.name} <small>{planet.nameEn}</small></h3>
          <p>{planet.description}</p>
          <dl>
            <div><dt>ระยะจากดวงอาทิตย์</dt><dd>{planet.distance}</dd></div>
            <div><dt>1 ปี</dt><dd>{planet.periodText}</dd></div>
            <div><dt>ดวงจันทร์</dt><dd>{planet.moons ? `${planet.moons} ดวง` : 'ไม่มี'}</dd></div>
          </dl>
        </div>
        <button className="cta" onClick={() => go(`explore/${planet.id}`)}>
          ดูแบบ 3 มิติ <ChevronRight />
        </button>
      </div>
    </section>
  )
}
