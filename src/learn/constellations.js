// ตำแหน่งดาวจริงโดยประมาณ (J2000) — ra = ไรต์แอสเซนชัน (ชั่วโมง), dec = เดคลิเนชัน (องศา), mag = โชติมาตร
// lines = คู่ดาวที่ลากเส้นเป็นรูปกลุ่มดาว

const s = (id, name, ra, dec, mag = 3.5) => ({ id, name, ra, dec, mag })

export const CONSTELLATIONS = [
  // ---------- 12 กลุ่มดาวจักรราศี ----------
  {
    id: 'aries', name: 'กลุ่มดาวแกะ', en: 'Aries', zodiac: 'ราศีเมษ', color: '#ff9a6a',
    stars: [s('hamal', 'ฮามาล', 2.12, 23.46, 2.0), s('sheratan', 'เชอราทัน', 1.911, 20.81, 2.6), s('mesarthim', '', 1.892, 19.29, 3.9), s('41ari', '', 2.833, 27.26, 3.6)],
    lines: [['41ari', 'hamal'], ['hamal', 'sheratan'], ['sheratan', 'mesarthim']],
  },
  {
    id: 'taurus', name: 'กลุ่มดาววัว', en: 'Taurus', zodiac: 'ราศีพฤษภ', color: '#ffb35c',
    stars: [
      s('aldebaran', 'อัลเดบาแรน', 4.599, 16.51, 0.9), s('elnath', 'เอลแนท', 5.438, 28.61, 1.7), s('zetatau', '', 5.627, 21.14, 3.0),
      s('theta2tau', '', 4.478, 15.87, 3.4), s('gammatau', '', 4.33, 15.63, 3.6), s('delta1tau', '', 4.382, 17.54, 3.8),
      s('epstau', '', 4.477, 19.18, 3.5), s('lambdatau', '', 4.011, 12.49, 3.4),
    ],
    lines: [['zetatau', 'aldebaran'], ['aldebaran', 'theta2tau'], ['theta2tau', 'gammatau'], ['gammatau', 'delta1tau'], ['delta1tau', 'epstau'], ['epstau', 'elnath'], ['gammatau', 'lambdatau']],
  },
  {
    id: 'gemini', name: 'กลุ่มดาวคนคู่', en: 'Gemini', zodiac: 'ราศีเมถุน', color: '#ffd27a',
    stars: [
      s('castor', 'แคสเตอร์', 7.577, 31.89, 1.6), s('pollux', 'พอลลักซ์', 7.755, 28.03, 1.1), s('alhena', 'อัลฮีนา', 6.629, 16.4, 1.9),
      s('mebsuta', '', 6.732, 25.13, 3.0), s('tejat', '', 6.383, 22.51, 2.9), s('propus', '', 6.248, 22.51, 3.3),
      s('wasat', '', 7.335, 21.98, 3.5), s('mekbuda', '', 7.068, 20.57, 3.8),
    ],
    lines: [['castor', 'mebsuta'], ['mebsuta', 'tejat'], ['tejat', 'propus'], ['pollux', 'wasat'], ['wasat', 'mekbuda'], ['mekbuda', 'alhena'], ['castor', 'pollux']],
  },
  {
    id: 'cancer', name: 'กลุ่มดาวปู', en: 'Cancer', zodiac: 'ราศีกรกฎ', color: '#9fe3e8',
    stars: [s('altarf', '', 8.275, 9.19, 3.5), s('asellusa', '', 8.745, 18.15, 3.9), s('asellusb', '', 8.721, 21.47, 4.7), s('acubens', '', 8.975, 11.86, 4.3), s('iotacnc', '', 8.778, 28.76, 4.0)],
    lines: [['iotacnc', 'asellusb'], ['asellusb', 'asellusa'], ['asellusa', 'altarf'], ['asellusa', 'acubens']],
  },
  {
    id: 'leo', name: 'กลุ่มดาวสิงโต', en: 'Leo', zodiac: 'ราศีสิงห์', color: '#ffcf8a',
    stars: [
      s('regulus', 'เรกูลัส', 10.139, 11.97, 1.4), s('etaleo', '', 10.122, 16.76, 3.5), s('algieba', 'อัลจีบา', 10.333, 19.84, 2.0),
      s('adhafera', '', 10.278, 23.42, 3.4), s('rasalas', '', 9.879, 26.01, 3.9), s('epsleo', '', 9.764, 23.77, 3.0),
      s('zosma', '', 11.235, 20.52, 2.6), s('chertan', '', 11.237, 15.43, 3.3), s('denebola', 'เดเนโบลา', 11.818, 14.57, 2.1),
    ],
    lines: [['regulus', 'etaleo'], ['etaleo', 'algieba'], ['algieba', 'adhafera'], ['adhafera', 'rasalas'], ['rasalas', 'epsleo'], ['algieba', 'zosma'], ['zosma', 'denebola'], ['denebola', 'chertan'], ['chertan', 'regulus'], ['zosma', 'chertan']],
  },
  {
    id: 'virgo', name: 'กลุ่มดาวหญิงสาว', en: 'Virgo', zodiac: 'ราศีกันย์', color: '#b18cff',
    stars: [
      s('spica', 'สไปกา', 13.42, -11.16, 1.0), s('zavijava', '', 11.845, 1.76, 3.6), s('zaniah', '', 12.332, -0.67, 3.9),
      s('porrima', '', 12.694, -1.45, 2.7), s('deltavir', '', 12.927, 3.4, 3.4), s('vindemiatrix', '', 13.036, 10.96, 2.8),
      s('heze', '', 13.578, -0.6, 3.4), s('thetavir', '', 13.166, -5.54, 4.4), s('tauvir', '', 14.028, 1.54, 4.3),
    ],
    lines: [['zavijava', 'zaniah'], ['zaniah', 'porrima'], ['porrima', 'deltavir'], ['deltavir', 'vindemiatrix'], ['porrima', 'thetavir'], ['thetavir', 'spica'], ['deltavir', 'heze'], ['heze', 'spica'], ['heze', 'tauvir']],
  },
  {
    id: 'libra', name: 'กลุ่มดาวคันชั่ง', en: 'Libra', zodiac: 'ราศีตุลย์', color: '#8ec5ff',
    stars: [s('zubenelgenubi', '', 14.848, -16.04, 2.8), s('zubeneschamali', '', 15.283, -9.38, 2.6), s('gammalib', '', 15.592, -14.79, 3.9), s('sigmalib', '', 15.068, -25.28, 3.3), s('upsilonlib', '', 15.617, -28.14, 3.6)],
    lines: [['sigmalib', 'zubenelgenubi'], ['zubenelgenubi', 'zubeneschamali'], ['zubeneschamali', 'gammalib'], ['gammalib', 'zubenelgenubi'], ['gammalib', 'upsilonlib']],
  },
  {
    id: 'scorpius', name: 'กลุ่มดาวแมงป่อง', en: 'Scorpius', zodiac: 'ราศีพิจิก', color: '#ff7a45',
    stars: [
      s('antares', 'แอนทาเรส', 16.49, -26.43, 1.0), s('graffias', '', 16.091, -19.81, 2.6), s('dschubba', '', 16.006, -22.62, 2.3),
      s('pisco', '', 15.981, -26.11, 2.9), s('sigmasco', '', 16.353, -25.59, 2.9), s('tausco', '', 16.598, -28.22, 2.8),
      s('epssco', '', 16.836, -34.29, 2.3), s('musco', '', 16.864, -38.05, 3.0), s('zetasco', '', 16.9, -42.36, 3.6),
      s('etasco', '', 17.203, -43.24, 3.3), s('sargas', '', 17.622, -43.0, 1.9), s('iotasco', '', 17.793, -40.13, 3.0),
      s('kappasco', '', 17.708, -39.03, 2.4), s('shaula', 'ชอลา', 17.56, -37.1, 1.6),
    ],
    lines: [['graffias', 'dschubba'], ['dschubba', 'pisco'], ['dschubba', 'sigmasco'], ['sigmasco', 'antares'], ['antares', 'tausco'], ['tausco', 'epssco'], ['epssco', 'musco'], ['musco', 'zetasco'], ['zetasco', 'etasco'], ['etasco', 'sargas'], ['sargas', 'iotasco'], ['iotasco', 'kappasco'], ['kappasco', 'shaula']],
  },
  {
    id: 'sagittarius', name: 'กลุ่มดาวคนยิงธนู', en: 'Sagittarius', zodiac: 'ราศีธนู', color: '#ffab8a',
    stars: [
      s('kausaus', '', 18.403, -34.38, 1.8), s('kausmed', '', 18.35, -29.83, 2.7), s('kausbor', '', 18.466, -25.42, 2.8),
      s('nunki', 'นุงกิ', 18.921, -26.3, 2.0), s('ascella', '', 19.043, -29.88, 2.6), s('phisgr', '', 18.761, -26.99, 3.2),
      s('tausgr', '', 19.116, -27.67, 3.3), s('alnasl', '', 18.097, -30.42, 3.0),
    ],
    lines: [['alnasl', 'kausmed'], ['kausmed', 'kausaus'], ['kausaus', 'alnasl'], ['kausmed', 'kausbor'], ['kausbor', 'phisgr'], ['phisgr', 'kausmed'], ['phisgr', 'nunki'], ['nunki', 'tausgr'], ['tausgr', 'ascella'], ['ascella', 'phisgr'], ['ascella', 'kausaus']],
  },
  {
    id: 'capricornus', name: 'กลุ่มดาวแพะทะเล', en: 'Capricornus', zodiac: 'ราศีมังกร', color: '#7ee0a0',
    stars: [
      s('algedi', '', 20.3, -12.54, 3.6), s('dabih', '', 20.35, -14.78, 3.1), s('psicap', '', 20.768, -25.27, 4.1),
      s('omegacap', '', 20.864, -26.92, 4.1), s('zetacap', '', 21.444, -22.41, 3.7), s('denebalgedi', '', 21.784, -16.13, 2.9),
      s('nashira', '', 21.668, -16.66, 3.7), s('iotacap', '', 21.371, -16.83, 4.3), s('thetacap', '', 21.099, -17.23, 4.1),
    ],
    lines: [['algedi', 'dabih'], ['dabih', 'psicap'], ['psicap', 'omegacap'], ['omegacap', 'zetacap'], ['zetacap', 'denebalgedi'], ['denebalgedi', 'nashira'], ['nashira', 'iotacap'], ['iotacap', 'thetacap'], ['thetacap', 'algedi']],
  },
  {
    id: 'aquarius', name: 'กลุ่มดาวคนแบกหม้อน้ำ', en: 'Aquarius', zodiac: 'ราศีกุมภ์', color: '#5aa8ff',
    stars: [
      s('sadalmelik', '', 22.096, -0.32, 2.9), s('sadalsuud', '', 21.526, -5.57, 2.9), s('sadachbia', '', 22.361, -1.39, 3.8),
      s('zetaaqr', '', 22.481, -0.02, 3.7), s('etaaqr', '', 22.589, -0.12, 4.0), s('albali', '', 20.795, -9.5, 3.8),
      s('lambdaaqr', '', 22.877, -7.58, 3.7), s('tauaqr', '', 22.827, -13.59, 4.0), s('skat', '', 22.911, -15.82, 3.3),
      s('phiaqr', '', 23.238, -6.05, 4.2), s('psi1aqr', '', 23.265, -9.09, 4.2), s('88aqr', '', 23.157, -21.17, 3.7),
    ],
    lines: [['albali', 'sadalsuud'], ['sadalsuud', 'sadalmelik'], ['sadalmelik', 'sadachbia'], ['sadachbia', 'zetaaqr'], ['zetaaqr', 'etaaqr'], ['sadachbia', 'lambdaaqr'], ['lambdaaqr', 'tauaqr'], ['tauaqr', 'skat'], ['skat', '88aqr'], ['lambdaaqr', 'phiaqr'], ['phiaqr', 'psi1aqr']],
  },
  {
    id: 'pisces', name: 'กลุ่มดาวปลา', en: 'Pisces', zodiac: 'ราศีมีน', color: '#9fb4ff',
    stars: [
      s('alrescha', '', 2.034, 2.76, 3.8), s('nupsc', '', 1.691, 5.49, 4.4), s('mupsc', '', 1.503, 6.14, 4.8), s('zetapsc', '', 1.229, 7.58, 5.2),
      s('epspsc', '', 1.049, 7.89, 4.3), s('deltapsc', '', 0.811, 7.59, 4.4), s('omegapsc', '', 23.989, 6.86, 4.0), s('iotapsc', '', 23.666, 5.63, 4.1),
      s('thetapsc', '', 23.466, 6.38, 4.3), s('gammapsc', '', 23.286, 3.28, 3.7), s('kappapsc', '', 23.449, 1.26, 4.9), s('lambdapsc', '', 23.7, 1.78, 4.5),
      s('omicronpsc', '', 1.756, 9.16, 4.3), s('etapsc', '', 1.525, 15.35, 3.6), s('phipsc', '', 1.229, 24.58, 4.7), s('taupsc', '', 1.194, 30.09, 4.5),
    ],
    lines: [['alrescha', 'nupsc'], ['nupsc', 'mupsc'], ['mupsc', 'zetapsc'], ['zetapsc', 'epspsc'], ['epspsc', 'deltapsc'], ['deltapsc', 'omegapsc'], ['omegapsc', 'iotapsc'], ['iotapsc', 'thetapsc'], ['thetapsc', 'gammapsc'], ['gammapsc', 'kappapsc'], ['kappapsc', 'lambdapsc'], ['lambdapsc', 'iotapsc'], ['alrescha', 'omicronpsc'], ['omicronpsc', 'etapsc'], ['etapsc', 'phipsc'], ['phipsc', 'taupsc']],
  },

  // ---------- กลุ่มดาวอื่นที่ควรรู้จัก ----------
  {
    id: 'dipper', name: 'กลุ่มดาวจระเข้', en: 'Big Dipper', note: 'ส่วนหนึ่งของกลุ่มดาวหมีใหญ่ ใช้ชี้หาดาวเหนือ', color: '#8ec5ff',
    stars: [
      s('dubhe', 'ดูเบ', 11.062, 61.75, 1.8), s('merak', 'เมรัก', 11.031, 56.38, 2.3), s('phecda', '', 11.897, 53.69, 2.4),
      s('megrez', '', 12.257, 57.03, 3.3), s('alioth', '', 12.9, 55.96, 1.8), s('mizar', '', 13.399, 54.93, 2.2), s('alkaid', '', 13.792, 49.31, 1.9),
    ],
    lines: [['alkaid', 'mizar'], ['mizar', 'alioth'], ['alioth', 'megrez'], ['megrez', 'dubhe'], ['dubhe', 'merak'], ['merak', 'phecda'], ['phecda', 'megrez']],
  },
  {
    id: 'orion', name: 'กลุ่มดาวนายพราน', en: 'Orion', note: 'มีดาวไถ (เข็มขัด 3 ดวง) เห็นชัดหน้าหนาว', color: '#a8d0ff',
    stars: [
      s('betelgeuse', 'บีเทลจุส', 5.919, 7.41, 0.5), s('rigel', 'ไรเจล', 5.242, -8.2, 0.1), s('bellatrix', '', 5.419, 6.35, 1.6),
      s('mintaka', '', 5.533, -0.3, 2.2), s('alnilam', '', 5.603, -1.2, 1.7), s('alnitak', '', 5.679, -1.94, 1.8),
      s('saiph', '', 5.796, -9.67, 2.1), s('meissa', '', 5.585, 9.93, 3.4),
    ],
    lines: [['meissa', 'betelgeuse'], ['meissa', 'bellatrix'], ['betelgeuse', 'alnitak'], ['bellatrix', 'mintaka'], ['mintaka', 'alnilam'], ['alnilam', 'alnitak'], ['alnitak', 'saiph'], ['mintaka', 'rigel']],
  },
  {
    id: 'cassiopeia', name: 'กลุ่มดาวค้างคาว', en: 'Cassiopeia', note: 'รูปตัว W อยู่ฝั่งตรงข้ามกับจระเข้ ใช้หาดาวเหนือได้เช่นกัน', color: '#ffd27a',
    stars: [s('caph', '', 0.153, 59.15, 2.3), s('schedar', '', 0.675, 56.54, 2.2), s('navi', '', 0.945, 60.72, 2.2), s('ruchbah', '', 1.43, 60.24, 2.7), s('segin', '', 1.907, 63.67, 3.4)],
    lines: [['caph', 'schedar'], ['schedar', 'navi'], ['navi', 'ruchbah'], ['ruchbah', 'segin']],
  },
  {
    id: 'crux', name: 'กลุ่มดาวกางเขนใต้', en: 'Crux', note: 'เห็นต่ำๆ ทางทิศใต้ ใช้หาทิศใต้', color: '#7ee0a0',
    stars: [s('acrux', '', 12.443, -63.1, 0.8), s('mimosa', '', 12.795, -59.69, 1.3), s('gacrux', '', 12.519, -57.11, 1.6), s('deltacru', '', 12.252, -58.75, 2.8)],
    lines: [['acrux', 'gacrux'], ['mimosa', 'deltacru']],
  },
  {
    id: 'pleiades', name: 'กลุ่มดาวลูกไก่', en: 'Pleiades', note: 'กระจุกดาวเล็กๆ ในกลุ่มดาววัว', color: '#cfe4ff',
    stars: [s('alcyone', '', 3.791, 24.11, 2.9), s('atlas', '', 3.819, 24.05, 3.6), s('electra', '', 3.748, 24.11, 3.7), s('maia', '', 3.763, 24.37, 3.9), s('merope', '', 3.772, 23.95, 4.2), s('taygeta', '', 3.753, 24.47, 4.3)],
    lines: [['electra', 'maia'], ['maia', 'taygeta'], ['electra', 'merope'], ['merope', 'alcyone'], ['alcyone', 'atlas']],
  },
]

// ดาวสว่างที่ใช้เป็นจุดสังเกต
export const BRIGHT_STARS = [
  s('polaris', 'ดาวเหนือ', 2.53, 89.26, 2.0), s('sirius', 'ซิริอุส', 6.752, -16.72, -1.5), s('canopus', 'คาโนปุส', 6.399, -52.7, -0.7),
  s('arcturus', 'อาร์คทูรุส', 14.261, 19.18, 0), s('vega', 'เวกา', 18.616, 38.78, 0), s('capella', 'คาเพลลา', 5.278, 46.0, 0.1),
  s('procyon', 'โปรซิออน', 7.655, 5.22, 0.4), s('altair', 'อัลแตร์', 19.846, 8.87, 0.8), s('deneb', 'เดเนบ', 20.69, 45.28, 1.3),
  s('fomalhaut', 'โฟมัลฮอท', 22.961, -29.62, 1.2),
]

export const ZODIAC = CONSTELLATIONS.filter((c) => c.zodiac)
export const OTHERS = CONSTELLATIONS.filter((c) => !c.zodiac)

// ---------- ดาราศาสตร์ทรงกลม: แปลงพิกัดฟ้าเป็นมุมเงย/มุมทิศ ----------
export const BANGKOK = { lat: 13.75, lon: 100.5 }
const RAD = Math.PI / 180

export function localSiderealDeg(date, lon = BANGKOK.lon) {
  const d = (date.getTime() - Date.UTC(2000, 0, 1, 12)) / 86400000
  return (((280.46061837 + 360.98564736629 * d + lon) % 360) + 360) % 360
}

// คืนค่า { alt, az } เป็นองศา (az วัดจากทิศเหนือไปทางตะวันออก)
export function altAz(ra, dec, lst, lat = BANGKOK.lat) {
  const H = (lst - ra * 15) * RAD
  const d = dec * RAD
  const p = lat * RAD
  const alt = Math.asin(Math.sin(p) * Math.sin(d) + Math.cos(p) * Math.cos(d) * Math.cos(H))
  const az = Math.atan2(-Math.cos(d) * Math.sin(H), Math.sin(d) * Math.cos(p) - Math.cos(d) * Math.cos(H) * Math.sin(p))
  return { alt: alt / RAD, az: ((az / RAD) + 360) % 360 }
}

// วันเวลาในประเทศไทย (UTC+7)
export function thaiDate(year, month, day, minutesFrom0) {
  return new Date(Date.UTC(year, month, day, 0, minutesFrom0 - 7 * 60))
}

// จุดศูนย์กลางของกลุ่มดาว (เฉลี่ยพิกัดแบบเวกเตอร์ เพื่อไม่พังตอน RA วนรอบ 24 ชม.)
export function centroid(c) {
  let x = 0, y = 0, z = 0
  c.stars.forEach((st) => {
    const r = st.ra * 15 * RAD
    const d = st.dec * RAD
    x += Math.cos(d) * Math.cos(r)
    y += Math.cos(d) * Math.sin(r)
    z += Math.sin(d)
  })
  const ra = ((Math.atan2(y, x) / RAD + 360) % 360) / 15
  const dec = Math.atan2(z, Math.hypot(x, y)) / RAD
  return { ra, dec }
}

// เดือนที่เห็นกลุ่มดาวสูงที่สุดตอน 21:00 น.
export function bestMonth(c, year = new Date().getFullYear()) {
  const { ra, dec } = centroid(c)
  let best = 0
  let bestAlt = -90
  for (let m = 0; m < 12; m++) {
    const { alt } = altAz(ra, dec, localSiderealDeg(thaiDate(year, m, 15, 21 * 60)))
    if (alt > bestAlt) {
      bestAlt = alt
      best = m
    }
  }
  return { month: best, alt: bestAlt }
}

// เส้นสุริยวิถี: ทางที่ดวงอาทิตย์ดูเหมือนเคลื่อนผ่านกลุ่มดาวจักรราศี
export const ECLIPTIC = Array.from({ length: 73 }, (_, i) => {
  const l = i * 5 * RAD
  const e = 23.44 * RAD
  const ra = ((Math.atan2(Math.sin(l) * Math.cos(e), Math.cos(l)) / RAD + 360) % 360) / 15
  const dec = Math.asin(Math.sin(e) * Math.sin(l)) / RAD
  return { ra, dec }
})
