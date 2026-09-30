import { LESSONS } from './lessons'
import LessonArt from './LessonArt'
import { PLANETS, SUN } from '../data/planets'
import { ChevronRight } from '../components/Icons'
import SoundToggle from '../audio/SoundToggle'
import './learn.css'

const GROUPS = [
  { grade: 'ป.5', title: 'ดาวฤกษ์ ดาวเคราะห์ และกลุ่มดาว' },
  { grade: 'ป.6', title: 'โลก ดวงจันทร์ ดวงอาทิตย์ และเทคโนโลยีอวกาศ' },
  { grade: 'ทบทวน', title: 'ทดสอบความเข้าใจ' },
]

export default function Hub({ go }) {
  return (
    <div className="page hub">
      <div className="page-stars" />
      <header className="page-top">
        <button className="brand-link" onClick={() => go('')}>
          <span className="brand-mark small" />
          <b>SOLAR</b> SYSTEM
        </button>
        <SoundToggle />
      </header>

      <section className="hub-hero">
        <span className="eyebrow-text">เมนูหลัก</span>
        <h1>เลือกเส้นทางการเรียนรู้</h1>
        <p>เรียนเนื้อหาวิทยาศาสตร์ ป.5 – ป.6 ผ่านภาพที่ลองขยับได้จริง หรือบินสำรวจระบบสุริยะแบบ 3 มิติ</p>
      </section>

      {/* โหมดสำรวจ 3D แยกเป็นเมนูของตัวเอง */}
      <button className="explore-card" onClick={() => go('explore')}>
        <div className="explore-orbs">
          <span className="orb glow" style={{ backgroundImage: `url(${SUN.texture})` }} />
          {PLANETS.map((p) => (
            <span key={p.id} className="orb" style={{ backgroundImage: `url(${p.texture})`, '--s': p.radius }} />
          ))}
        </div>
        <div className="explore-text">
          <span className="chip">โหมดสำรวจ · 3D</span>
          <h2>สำรวจระบบสุริยะ 3 มิติ</h2>
          <p>หมุน ซูม คลิกดาวแต่ละดวงเพื่อดูข้อมูล ตำแหน่งดาวตรงกับท้องฟ้าจริงวันนี้</p>
        </div>
        <span className="explore-go"><ChevronRight /></span>
      </button>

      {GROUPS.map((g) => (
        <section className="hub-group" key={g.grade}>
          <div className="group-head">
            <span className="grade-badge">{g.grade}</span>
            <h3>{g.title}</h3>
          </div>
          <div className="lesson-grid">
            {LESSONS.filter((l) => l.grade === g.grade).map((l, i) => (
              <button
                key={l.id}
                className="lesson-card"
                style={{ '--c': l.color, '--i': i }}
                onClick={() => go(`lesson/${l.id}`)}
              >
                <div className="lesson-art"><LessonArt id={l.id} /></div>
                <span className="lesson-no">บทที่ {l.no} · {l.en}</span>
                <h4>{l.title}</h4>
                <p>{l.summary}</p>
              </button>
            ))}
          </div>
        </section>
      ))}

      <footer className="page-footer">
        เนื้อหาอ้างอิงหลักสูตรวิทยาศาสตร์ ป.5 – ป.6 · ภาพพื้นผิวดาว{' '}
        <a href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noreferrer">Solar System Scope</a>{' '}
        (<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>) · ภาพถ่ายจาก NASA และ Wikimedia Commons (ดูเครดิตใต้ภาพ)
      </footer>
    </div>
  )
}
