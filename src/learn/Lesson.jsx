import { LESSONS } from './lessons'
import { ArrowLeft, ChevronLeft, ChevronRight } from '../components/Icons'
import StarsPlanets from './lessons/StarsPlanets'
import PlanetGroups from './lessons/PlanetGroups'
import AltAz from './lessons/AltAz'
import Constellations from './lessons/Constellations'
import MoonPhases from './lessons/MoonPhases'
import Seasons from './lessons/Seasons'
import Eclipses from './lessons/Eclipses'
import SpaceTech from './lessons/SpaceTech'
import Quiz from './lessons/Quiz'
import SoundToggle from '../audio/SoundToggle'
import './learn.css'

const VISUALS = {
  'stars-planets': StarsPlanets,
  planets: PlanetGroups,
  'alt-az': AltAz,
  constellations: Constellations,
  'moon-phases': MoonPhases,
  seasons: Seasons,
  eclipses: Eclipses,
  'space-tech': SpaceTech,
  quiz: Quiz,
}

export default function Lesson({ id, go }) {
  const index = LESSONS.findIndex((l) => l.id === id)
  if (index < 0) {
    go('menu')
    return null
  }
  const lesson = LESSONS[index]
  const prev = LESSONS[index - 1]
  const next = LESSONS[index + 1]
  const Visual = VISUALS[lesson.id]

  return (
    <div className="page lesson" style={{ '--c': lesson.color }} key={lesson.id}>
      <div className="page-stars" />
      <header className="page-top">
        <button className="back-pill" onClick={() => go('menu')}>
          <ArrowLeft /> <span>เมนู</span>
        </button>
        <div className="top-right">
          <SoundToggle />
          <div className="lesson-steps" aria-label="บทเรียน">
          {LESSONS.map((l) => (
            <button
              key={l.id}
              className={`step-dot ${l.id === lesson.id ? 'on' : ''}`}
              style={{ '--c': l.color }}
              onClick={() => go(`lesson/${l.id}`)}
              title={l.title}
            />
          ))}
          </div>
        </div>
      </header>

      <section className="lesson-head">
        <span className="lesson-kicker">
          <span className="grade-badge">{lesson.grade}</span> บทที่ {lesson.no} · {lesson.en}
        </span>
        <h1>{lesson.title}</h1>
      </section>

      <Visual lesson={lesson} go={go} />

      {lesson.points.length > 0 && (
        <section className="key-points">
          <h2>สรุปสิ่งสำคัญ</h2>
          <div className="points-grid">
            {lesson.points.map((p, i) => (
              <div className="point-card" key={p.title} style={{ '--i': i }}>
                <span className="point-no">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <nav className="lesson-pager">
        {prev ? (
          <button className="pager-card" onClick={() => go(`lesson/${prev.id}`)}>
            <ChevronLeft />
            <span><small>ก่อนหน้า</small>{prev.title}</span>
          </button>
        ) : <span />}
        {next ? (
          <button className="pager-card next" onClick={() => go(`lesson/${next.id}`)}>
            <span><small>ถัดไป</small>{next.title}</span>
            <ChevronRight />
          </button>
        ) : (
          <button className="pager-card next" onClick={() => go('menu')}>
            <span><small>จบบทเรียน</small>กลับเมนูหลัก</span>
            <ChevronRight />
          </button>
        )}
      </nav>
    </div>
  )
}
