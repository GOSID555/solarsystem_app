import { uiScale } from './ui'

// เลย์เอาต์ของหน้ารายละเอียดดาว ใช้ร่วมกันระหว่างกล้อง 3D และ UI
// x, y = view offset (px) ที่เลื่อนภาพ 3D, radiusPx = รัศมีดาวบนจอ
// cx, cy = จุดศูนย์กลางดาวบนจอ, cardW = ความกว้างคอลัมน์การ์ดด้านขวา
// แบบกว้าง (wide): ดาวซ้าย การ์ดขวา — จอคอม แท็บเล็ตแนวนอน ทีวี และมือถือแนวนอน
// แบบแคบ: ดาวบน การ์ดเลื่อนอยู่ด้านล่าง — มือถือและแท็บเล็ตแนวตั้ง
export function detailLayout(w, h) {
  const ui = uiScale(w, h)
  const landscapePhone = w > h && h < 600 && w >= 600

  if (w > 900 || landscapePhone) {
    const cardW = landscapePhone ? Math.min(340, w * 0.42) : 360 * ui
    const margin = landscapePhone ? 24 : 40 * ui
    const x = (cardW + margin) / 2
    const y = landscapePhone ? h * 0.04 : -h * 0.02
    const radiusPx = landscapePhone ? h * 0.19 : Math.min(h * 0.23, (w - cardW - margin) * 0.22)
    return { x, y, radiusPx, cx: w / 2 - x, cy: h / 2 - y, cardW, wide: true, compact: landscapePhone }
  }

  // จอเตี้ย: เลื่อนดาวลงให้มีที่พอสำหรับปุ่มย้อนกลับและชื่อดาวด้านบน
  const radiusPx = Math.min(w * 0.28, h * 0.15)
  const cy = Math.max(h * 0.35, radiusPx + 156)
  return { x: 0, y: h / 2 - cy, radiusPx, cx: w / 2, cy, wide: false, compact: false }
}
