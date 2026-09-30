// เลย์เอาต์ของหน้ารายละเอียดดาว ใช้ร่วมกันระหว่างกล้อง 3D และ UI
// x, y = view offset (px) ที่เลื่อนภาพ 3D, radiusPx = รัศมีดาวบนจอ
// cx, cy = จุดศูนย์กลางดาวบนจอ
export const CARDS_WIDTH = 400

export function detailLayout(w, h) {
  if (w > 900) {
    const x = CARDS_WIDTH / 2
    const y = -h * 0.02
    return { x, y, radiusPx: Math.min(h * 0.23, (w - CARDS_WIDTH) * 0.22), cx: w / 2 - x, cy: h / 2 - y, wide: true }
  }
  const y = h * 0.15
  return { x: 0, y, radiusPx: Math.min(w * 0.28, h * 0.15), cx: w / 2, cy: h / 2 - y, wide: false }
}
