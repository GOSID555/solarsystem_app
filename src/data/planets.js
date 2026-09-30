// ขนาด/ระยะในฉาก (radius, orbit) ถูกย่อส่วนให้ดูง่าย ไม่ได้เป็นสัดส่วนจริง
// ค่าจริงที่ใช้คำนวณ: au = กึ่งแกนเอก (AU), L0 = ลองจิจูดเฉลี่ย ณ J2000 (องศา)
// period = คาบโคจร (วันโลก), day = คาบหมุนรอบตัวเอง (ชั่วโมง, ติดลบ = หมุนกลับทิศ)

export const J2000 = Date.UTC(2000, 0, 1, 12)
export const AU_KM = 149597870.7
const LIGHT_KM_S = 299792.458

// มุมบนวงโคจร (เรเดียน) ณ จำนวนวันนับจาก J2000 — วงโคจรแบบวงกลม ใกล้เคียงตำแหน่งจริง
export function orbitAngle(body, daysSinceJ2000) {
  return ((body.L0 + (360 * daysSinceJ2000) / body.period) * Math.PI) / 180
}

// ระยะจริงจากโลก (กม.) ณ เวลาที่กำหนด
export function distanceFromEarthKm(body, daysSinceJ2000) {
  const earth = PLANETS.find((p) => p.id === 'earth')
  const ea = orbitAngle(earth, daysSinceJ2000)
  const ex = Math.cos(ea) * earth.au
  const ey = Math.sin(ea) * earth.au
  if (body.id === 'sun') return Math.hypot(ex, ey) * AU_KM
  const a = orbitAngle(body, daysSinceJ2000)
  return Math.hypot(Math.cos(a) * body.au - ex, Math.sin(a) * body.au - ey) * AU_KM
}

export function lightMinutes(km) {
  return km / LIGHT_KM_S / 60
}

export const SUN = {
  id: 'sun',
  name: 'ดวงอาทิตย์',
  nameEn: 'Sun',
  nickname: 'ดาวฤกษ์ใจกลางระบบ',
  texture: '/textures/sun.jpg',
  color: '#ffb347',
  radius: 5,
  diameterKm: 1392700,
  type: 'ดาวฤกษ์',
  diameter: '1,392,700 กม.',
  distance: '—',
  periodText: '~230 ล้านปี (รอบกาแล็กซี)',
  dayLength: '~27 วัน',
  moons: 0,
  temp: 5500,
  tempNote: 'พื้นผิว',
  orbitalSpeed: '~220 กม./วินาที',
  surfaceKm2: 6.09e12,
  gravity: 274,
  description:
    'ดาวฤกษ์ใจกลางระบบสุริยะ มีมวลคิดเป็น 99.86% ของทั้งระบบ ให้พลังงานผ่านปฏิกิริยานิวเคลียร์ฟิวชันที่แกนกลาง',
}

export const PLANETS = [
  {
    id: 'mercury', name: 'ดาวพุธ', nameEn: 'Mercury', nickname: 'ผู้ส่งสารที่เร็วที่สุด',
    texture: '/textures/mercury.jpg',
    color: '#a39a90', radius: 0.38, orbit: 9, au: 0.387, L0: 252.25, period: 87.97, day: 1407.6, tilt: 0.03,
    diameterKm: 4879, type: 'ดาวเคราะห์หิน', diameter: '4,879 กม.', distance: '57.9 ล้านกม.',
    periodText: '88 วัน', dayLength: '59 วันโลก', moons: 0, temp: 167, tempNote: 'เฉลี่ย',
    orbitalSpeed: '47.36 กม./วินาที', surfaceKm2: 7.48e7, gravity: 3.7,
    description: 'ดาวเคราะห์ที่เล็กที่สุดและใกล้ดวงอาทิตย์ที่สุด แทบไม่มีชั้นบรรยากาศ อุณหภูมิกลางวัน-กลางคืนต่างกันสุดขั้ว (-173 ถึง 427 °C)',
  },
  {
    id: 'venus', name: 'ดาวศุกร์', nameEn: 'Venus', nickname: 'ดาวประกายพรึก',
    texture: '/textures/venus.jpg', atmosphere: '#ffd9a0',
    color: '#e8c27a', radius: 0.95, orbit: 13, au: 0.723, L0: 181.98, period: 224.7, day: -5832.5, tilt: 3.1,
    diameterKm: 12104, type: 'ดาวเคราะห์หิน', diameter: '12,104 กม.', distance: '108.2 ล้านกม.',
    periodText: '225 วัน', dayLength: '243 วันโลก (หมุนกลับทิศ)', moons: 0, temp: 465, tempNote: 'เฉลี่ย',
    orbitalSpeed: '35.02 กม./วินาที', surfaceKm2: 4.6e8, gravity: 8.87,
    description: 'ดาวเคราะห์ที่ร้อนที่สุด เพราะบรรยากาศ CO₂ หนาแน่นกักเก็บความร้อน หมุนรอบตัวเองในทิศตรงข้ามกับดาวส่วนใหญ่',
  },
  {
    id: 'earth', name: 'โลก', nameEn: 'Earth', nickname: 'บ้านของเรา',
    texture: '/textures/earth_atmos_2048.jpg', atmosphere: '#5aa8ff', clouds: '/textures/earth_clouds_1024.png',
    color: '#4f8fe0', radius: 1, orbit: 18, au: 1, L0: 100.46, period: 365.256, day: 24, tilt: 0.41,
    diameterKm: 12742, type: 'ดาวเคราะห์หิน', diameter: '12,742 กม.', distance: '149.6 ล้านกม. (1 AU)',
    periodText: '365.25 วัน', dayLength: '24 ชั่วโมง', moons: 1, temp: 15, tempNote: 'เฉลี่ย',
    orbitalSpeed: '29.78 กม./วินาที', surfaceKm2: 5.1e8, gravity: 9.81,
    description: 'ดาวเคราะห์ดวงเดียวที่รู้ว่ามีสิ่งมีชีวิต พื้นผิวกว่า 71% ปกคลุมด้วยน้ำ มีสนามแม่เหล็กปกป้องจากลมสุริยะ',
    satellites: [{ name: 'ดวงจันทร์', radius: 0.27, distance: 2, period: 27.32, texture: '/textures/moon_1024.jpg' }],
  },
  {
    id: 'mars', name: 'ดาวอังคาร', nameEn: 'Mars', nickname: 'ดาวเคราะห์สีแดง · เพื่อนบ้าน',
    texture: '/textures/mars.jpg', atmosphere: '#ff9a6a',
    color: '#c1440e', radius: 0.53, orbit: 23, au: 1.524, L0: 355.45, period: 686.98, day: 24.6, tilt: 0.44,
    diameterKm: 6779, type: 'ดาวเคราะห์หิน', diameter: '6,779 กม.', distance: '227.9 ล้านกม.',
    periodText: '687 วัน', dayLength: '24.6 ชั่วโมง', moons: 2, temp: -63, tempNote: 'เฉลี่ย',
    orbitalSpeed: '24.07 กม./วินาที', surfaceKm2: 1.448e8, gravity: 3.71,
    description: 'ดาวเคราะห์สีแดงจากออกไซด์ของเหล็ก มีภูเขาไฟ Olympus Mons ที่ใหญ่ที่สุดในระบบสุริยะ และหุบเขา Valles Marineris ยาวกว่า 4,000 กม.',
  },
  {
    id: 'jupiter', name: 'ดาวพฤหัสบดี', nameEn: 'Jupiter', nickname: 'ราชาแห่งดาวเคราะห์',
    texture: '/textures/jupiter.jpg', atmosphere: '#e8c9a0',
    color: '#d8a878', radius: 2.8, orbit: 33, au: 5.203, L0: 34.4, period: 4332.6, day: 9.9, tilt: 0.05,
    diameterKm: 139820, type: 'ดาวแก๊สยักษ์', diameter: '139,820 กม.', distance: '778.5 ล้านกม.',
    periodText: '11.9 ปี', dayLength: '9.9 ชั่วโมง', moons: 95, temp: -108, tempNote: 'ยอดเมฆ',
    orbitalSpeed: '13.06 กม./วินาที', surfaceKm2: 6.14e10, gravity: 24.79,
    description: 'ดาวเคราะห์ที่ใหญ่ที่สุด มวลมากกว่าดาวเคราะห์ดวงอื่นรวมกัน 2.5 เท่า มีพายุจุดแดงใหญ่ที่หมุนวนมาหลายร้อยปี',
  },
  {
    id: 'saturn', name: 'ดาวเสาร์', nameEn: 'Saturn', nickname: 'เจ้าแห่งวงแหวน',
    texture: '/textures/saturn.jpg', atmosphere: '#f0dca8',
    color: '#e3cf8f', radius: 2.35, orbit: 44, au: 9.537, L0: 49.94, period: 10759, day: 10.7, tilt: 0.47,
    ring: { inner: 3.0, outer: 5.4, map: '/textures/saturn_ring.png' },
    diameterKm: 116460, type: 'ดาวแก๊สยักษ์', diameter: '116,460 กม.', distance: '1.43 พันล้านกม.',
    periodText: '29.5 ปี', dayLength: '10.7 ชั่วโมง', moons: 146, temp: -139, tempNote: 'ยอดเมฆ',
    orbitalSpeed: '9.68 กม./วินาที', surfaceKm2: 4.27e10, gravity: 10.44,
    description: 'โดดเด่นด้วยวงแหวนที่ประกอบจากน้ำแข็งและหิน ความหนาแน่นต่ำกว่าน้ำ จึงลอยน้ำได้ถ้ามีอ่างใหญ่พอ',
  },
  {
    id: 'uranus', name: 'ดาวยูเรนัส', nameEn: 'Uranus', nickname: 'ดาวนอนตะแคง',
    texture: '/textures/uranus.jpg', atmosphere: '#9fe3e8',
    color: '#9fe3e8', radius: 1.6, orbit: 54, au: 19.19, L0: 313.23, period: 30687, day: -17.2, tilt: 1.71,
    ring: { inner: 2.1, outer: 2.7, map: '/textures/saturn_ring.png', color: '#a8d8e0', opacity: 0.35 },
    diameterKm: 50724, type: 'ดาวน้ำแข็งยักษ์', diameter: '50,724 กม.', distance: '2.87 พันล้านกม.',
    periodText: '84 ปี', dayLength: '17.2 ชั่วโมง', moons: 28, temp: -197, tempNote: 'ยอดเมฆ',
    orbitalSpeed: '6.80 กม./วินาที', surfaceKm2: 8.08e9, gravity: 8.69,
    description: 'แกนหมุนเอียงเกือบ 98° ทำให้ดูเหมือนกลิ้งไปตามวงโคจร สีฟ้าอมเขียวมาจากก๊าซมีเทนในบรรยากาศ',
  },
  {
    id: 'neptune', name: 'ดาวเนปจูน', nameEn: 'Neptune', nickname: 'ดาวพายุสีคราม',
    texture: '/textures/neptune.jpg', atmosphere: '#5b82ff',
    color: '#4b70dd', radius: 1.55, orbit: 63, au: 30.07, L0: 304.88, period: 60190, day: 16.1, tilt: 0.49,
    diameterKm: 49244, type: 'ดาวน้ำแข็งยักษ์', diameter: '49,244 กม.', distance: '4.5 พันล้านกม.',
    periodText: '164.8 ปี', dayLength: '16.1 ชั่วโมง', moons: 16, temp: -201, tempNote: 'ยอดเมฆ',
    orbitalSpeed: '5.43 กม./วินาที', surfaceKm2: 7.62e9, gravity: 11.15,
    description: 'ดาวเคราะห์ที่ไกลที่สุด มีลมแรงที่สุดในระบบสุริยะ ความเร็วลมสูงถึง 2,100 กม./ชม.',
  },
]

export const BODIES = [SUN, ...PLANETS]
