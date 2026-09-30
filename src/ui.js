// ขยาย UI ตามขนาดจอ เพื่อให้ตัวหนังสือและปุ่มไม่เล็กจิ๋วบนจอใหญ่ (จอ 2K, 4K, ทีวี)
// จอทั่วไปถึง ~1600px = 1 เท่า, Full HD ≈ 1.08, 4K (3840×2160) ≈ 2.16
export function uiScale(w = window.innerWidth, h = window.innerHeight) {
  const s = Math.min(w / 1600, h / 1000)
  return Math.round(Math.min(Math.max(s, 1), 2.5) * 100) / 100
}

// ตั้งค่า CSS variable --ui ให้ทั้งหน้า และอัปเดตเมื่อหมุนจอ/ปรับขนาดหน้าต่าง
export function watchUiScale() {
  const apply = () => document.documentElement.style.setProperty('--ui', String(uiScale()))
  apply()
  window.addEventListener('resize', apply)
  window.addEventListener('orientationchange', apply)
}

// จำกัดจำนวนพิกเซลของ canvas 3D ไม่ให้เกิน ~4K (3840×2160)
// จอ 4K ที่ความละเอียด 2x จะได้ canvas 7680×4320 ซึ่งหนักจน GPU เรนเดอร์ไม่ไหว (ภาพดำ)
const MAX_PIXELS = 3840 * 2160

export function canvasDpr() {
  const area = window.innerWidth * window.innerHeight
  const cap = Math.sqrt(MAX_PIXELS / area)
  return Math.max(0.75, Math.min(window.devicePixelRatio || 1, 2, cap))
}
