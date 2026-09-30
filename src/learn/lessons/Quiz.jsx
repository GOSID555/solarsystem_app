import { useState } from 'react'
import { LESSONS } from '../lessons'
import { ChevronRight, ResetIcon } from '../../components/Icons'

const QUESTIONS = [
  { q: 'ข้อใดเป็นดาวฤกษ์', choices: ['ดวงจันทร์', 'ดาวอังคาร', 'ดวงอาทิตย์', 'ดาวศุกร์'], a: 2, lesson: 'stars-planets',
    why: 'ดวงอาทิตย์มีแสงสว่างในตัวเอง จึงเป็นดาวฤกษ์ ส่วนดวงจันทร์และดาวเคราะห์สะท้อนแสงจากดวงอาทิตย์' },
  { q: 'เรามองเห็นดาวเคราะห์ได้เพราะอะไร', choices: ['ดาวเคราะห์มีแสงในตัวเอง', 'ดาวเคราะห์สะท้อนแสงจากดวงอาทิตย์', 'ดาวเคราะห์ร้อนมาก', 'ดาวเคราะห์อยู่ใกล้ดาวฤกษ์ดวงอื่น'], a: 1, lesson: 'stars-planets',
    why: 'ดาวเคราะห์ไม่มีแสงในตัวเอง แต่สะท้อนแสงจากดวงอาทิตย์ จึงเห็นส่องแสงนิ่ง ไม่กะพริบ' },
  { q: 'ดาวเคราะห์ดวงใดเป็นดาวเคราะห์ชั้นนอก', choices: ['ดาวพุธ', 'ดาวเสาร์', 'โลก', 'ดาวอังคาร'], a: 1, lesson: 'planets',
    why: 'ดาวเคราะห์ชั้นนอกคือ ดาวพฤหัสบดี ดาวเสาร์ ดาวยูเรนัส และดาวเนปจูน' },
  { q: 'ดาวเคราะห์ชั้นในมีลักษณะอย่างไร', choices: ['เป็นแก๊สขนาดใหญ่', 'มีวงแหวนทุกดวง', 'พื้นผิวเป็นหิน', 'อยู่ไกลดวงอาทิตย์ที่สุด'], a: 2, lesson: 'planets',
    why: 'ดาวพุธ ดาวศุกร์ โลก และดาวอังคาร มีพื้นผิวเป็นหินแข็ง' },
  { q: 'กลุ่มดาวใดใช้ชี้หาดาวเหนือ', choices: ['กลุ่มดาวนายพราน', 'กลุ่มดาวจระเข้', 'กลุ่มดาวแมงป่อง', 'กลุ่มดาวลูกไก่'], a: 1, lesson: 'constellations',
    why: 'ลากเส้นจากดาว 2 ดวงที่ปลายกลุ่มดาวจระเข้ต่อไปประมาณ 5 เท่า จะพบดาวเหนือ' },
  { q: 'ดาวดวงหนึ่งอยู่ทางทิศตะวันออกพอดี และอยู่กึ่งกลางระหว่างขอบฟ้ากับจุดเหนือศีรษะ ดาวดวงนี้มีมุมทิศและมุมเงยเท่าใด', choices: ['มุมทิศ 0° มุมเงย 45°', 'มุมทิศ 90° มุมเงย 45°', 'มุมทิศ 180° มุมเงย 90°', 'มุมทิศ 90° มุมเงย 90°'], a: 1, lesson: 'alt-az',
    why: 'ทิศตะวันออกมีมุมทิศ 90° (นับจากทิศเหนือตามเข็มนาฬิกา) และกึ่งกลางระหว่างขอบฟ้า (0°) กับจุดเหนือศีรษะ (90°) คือมุมเงย 45°' },
  { q: 'เมื่อยกแผนที่ดาวขึ้นดู ขอบวงกลมของแผนที่ดาวหมายถึงอะไร', choices: ['จุดเหนือศีรษะ', 'ขอบฟ้า', 'เส้นศูนย์สูตร', 'ดาวเหนือ'], a: 1, lesson: 'constellations',
    why: 'ขอบวงกลมของแผนที่ดาวคือขอบฟ้า ส่วนจุดกึ่งกลางคือจุดเหนือศีรษะ' },
  { q: 'วันเพ็ญ (ดวงจันทร์เต็มดวง) ตรงกับวันใด', choices: ['ขึ้น 1 ค่ำ', 'ขึ้น 8 ค่ำ', 'ขึ้น 15 ค่ำ', 'แรม 15 ค่ำ'], a: 2, lesson: 'moon-phases',
    why: 'ขึ้น 15 ค่ำคือวันเพ็ญ ส่วนแรม 15 ค่ำ (หรือ 14 ค่ำ) คือเดือนดับ' },
  { q: 'ข้างขึ้นข้างแรมเกิดจากอะไร', choices: ['เงาของโลกบังดวงจันทร์', 'ดวงจันทร์โคจรรอบโลก ทำให้เห็นส่วนที่ได้รับแสงต่างกัน', 'ดวงจันทร์หมุนรอบตัวเองเร็วมาก', 'เมฆบังดวงจันทร์'], a: 1, lesson: 'moon-phases',
    why: 'ดวงจันทร์โคจรรอบโลก มุมที่เราเห็นส่วนสว่างของดวงจันทร์จึงเปลี่ยนไปในแต่ละวัน (เงาโลกบังดวงจันทร์คือจันทรุปราคา ไม่ใช่ข้างขึ้นข้างแรม)' },
  { q: 'ฤดูกาลบนโลกเกิดจากสาเหตุใด', choices: ['โลกเข้าใกล้และออกห่างดวงอาทิตย์', 'ดวงอาทิตย์ร้อนขึ้นบางช่วง', 'แกนโลกเอียง 23.5° ขณะโคจรรอบดวงอาทิตย์', 'ดวงจันทร์บังแสงอาทิตย์'], a: 2, lesson: 'seasons',
    why: 'แกนโลกเอียงทำให้แต่ละซีกโลกได้รับแสงอาทิตย์ไม่เท่ากันในแต่ละช่วงของปี' },
  { q: 'สุริยุปราคาเกิดเมื่อใด', choices: ['โลกอยู่ระหว่างดวงอาทิตย์กับดวงจันทร์', 'ดวงจันทร์อยู่ระหว่างโลกกับดวงอาทิตย์', 'ดวงอาทิตย์อยู่ระหว่างโลกกับดวงจันทร์', 'ดวงจันทร์อยู่ไกลโลกที่สุด'], a: 1, lesson: 'eclipses',
    why: 'ดวงจันทร์บังดวงอาทิตย์ เงาของดวงจันทร์ตกลงบนโลก (ถ้าโลกอยู่ตรงกลางจะเป็นจันทรุปราคา)' },
  { q: 'ดาวเทียมไทยโชต (THEOS) ของประเทศไทยใช้ทำอะไร', choices: ['ถ่ายทอดสัญญาณโทรทัศน์', 'ถ่ายภาพสำรวจทรัพยากรและพื้นผิวโลก', 'นำทางแบบ GPS', 'สำรวจดาวอังคาร'], a: 1, lesson: 'space-tech',
    why: 'ไทยโชตและ THEOS-2 เป็นดาวเทียมสำรวจทรัพยากรของ GISTDA ส่วนไทยคมเป็นดาวเทียมสื่อสาร' },
  { q: 'ข้อใดเป็นประโยชน์ของดาวเทียม', choices: ['นำทางด้วย GPS', 'พยากรณ์อากาศ', 'การสื่อสารและโทรทัศน์', 'ถูกทุกข้อ'], a: 3, lesson: 'space-tech',
    why: 'ดาวเทียมใช้ทั้งนำทาง พยากรณ์อากาศ สื่อสาร และเตือนภัยธรรมชาติ' },
]

export default function Quiz({ go }) {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState(null)
  const [answers, setAnswers] = useState([])
  const done = answers.length === QUESTIONS.length && picked === null && i >= QUESTIONS.length

  const score = answers.filter(Boolean).length
  const q = QUESTIONS[i]

  const pick = (c) => {
    if (picked !== null) return
    setPicked(c)
    setAnswers((a) => [...a, c === q.a])
  }
  const next = () => {
    setPicked(null)
    setI((n) => n + 1)
  }
  const restart = () => {
    setI(0)
    setPicked(null)
    setAnswers([])
  }

  if (done) {
    const wrongLessons = [...new Set(QUESTIONS.filter((_, k) => !answers[k]).map((x) => x.lesson))]
    const stars = score >= QUESTIONS.length - 1 ? 3 : score >= QUESTIONS.length * 0.6 ? 2 : score >= QUESTIONS.length * 0.3 ? 1 : 0
    return (
      <section className="stage quiz-result">
        <div className="result-stars">
          {[0, 1, 2].map((k) => <span key={k} className={k < stars ? 'on' : ''} style={{ animationDelay: `${0.2 + k * 0.2}s` }}>★</span>)}
        </div>
        <h2>ได้ {score} / {QUESTIONS.length} คะแนน</h2>
        <p>{score === QUESTIONS.length ? 'สุดยอด! เข้าใจครบทุกเรื่องแล้ว' : score >= QUESTIONS.length * 0.6 ? 'เก่งมาก! ทบทวนอีกนิดจะได้เต็ม' : 'ไม่เป็นไร ลองทบทวนบทเรียนแล้วมาทำใหม่นะ'}</p>
        {wrongLessons.length > 0 && (
          <div className="review">
            <span className="panel-kicker">แนะนำให้ทบทวน</span>
            <div className="chip-row wrap center">
              {wrongLessons.map((id) => {
                const l = LESSONS.find((x) => x.id === id)
                return (
                  <button key={id} className="chip-btn" style={{ '--c': l.color }} onClick={() => go(`lesson/${id}`)}>
                    บทที่ {l.no} {l.title}
                  </button>
                )
              })}
            </div>
          </div>
        )}
        <button className="cta" onClick={restart}><ResetIcon /> ทำแบบทดสอบอีกครั้ง</button>
      </section>
    )
  }

  const answered = picked !== null
  return (
    <section className="stage quiz">
      <div className="quiz-top">
        <span>ข้อ {i + 1} / {QUESTIONS.length}</span>
        <div className="quiz-progress">
          {QUESTIONS.map((_, k) => (
            <i key={k} className={k < answers.length ? (answers[k] ? 'ok' : 'no') : k === i ? 'now' : ''} />
          ))}
        </div>
        <span>คะแนน {score}</span>
      </div>

      <h2 className="quiz-q" key={i}>{q.q}</h2>
      <div className="choices">
        {q.choices.map((c, k) => {
          const state = !answered ? '' : k === q.a ? 'correct' : k === picked ? 'wrong' : 'dim'
          return (
            <button key={k} className={`choice ${state}`} onClick={() => pick(k)} disabled={answered} style={{ '--i': k }}>
              <span className="choice-key">{'กขคง'[k]}</span>
              {c}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className={`explain ${picked === q.a ? 'ok' : 'no'}`}>
          <b>{picked === q.a ? 'ถูกต้อง! 🎉' : 'ยังไม่ถูก'}</b>
          <p>{q.why}</p>
          <button className="cta" onClick={next}>
            {i + 1 < QUESTIONS.length ? 'ข้อถัดไป' : 'ดูผลคะแนน'} <ChevronRight />
          </button>
        </div>
      )}
    </section>
  )
}
