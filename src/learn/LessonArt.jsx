// ภาพประกอบเล็กๆ ของแต่ละบทเรียน (SVG) ใช้บนการ์ดเมนู
export default function LessonArt({ id }) {
  switch (id) {
    case 'stars-planets':
      return (
        <svg viewBox="0 0 120 80">
          <defs>
            <radialGradient id="la-star"><stop offset="0" stopColor="#fff6d8" /><stop offset=".5" stopColor="#ffb35c" /><stop offset="1" stopColor="#ff6a00" stopOpacity="0" /></radialGradient>
          </defs>
          <circle cx="36" cy="40" r="26" fill="url(#la-star)" />
          <circle cx="36" cy="40" r="11" fill="#ffd27a" />
          <g stroke="#ffcf8a" strokeWidth="1.5" strokeLinecap="round" opacity=".7">
            <path d="M36 8v6M36 66v6M4 40h6M62 40h6" />
          </g>
          <circle cx="92" cy="40" r="12" fill="#1a2350" />
          <path d="M92 28a12 12 0 0 0 0 24Z" fill="#6f8fd8" />
        </svg>
      )
    case 'planets':
      return (
        <svg viewBox="0 0 120 80">
          {[['#a39a90', 3], ['#e8c27a', 4.5], ['#4f8fe0', 4.8], ['#c1440e', 3.6]].map(([c, r], i) => (
            <circle key={i} cx={12 + i * 13} cy="40" r={r} fill={c} />
          ))}
          <path d="M62 22v36" stroke="#8a93b2" strokeDasharray="2 3" />
          <circle cx="78" cy="40" r="9" fill="#d8a878" />
          <circle cx="100" cy="40" r="7.5" fill="#e3cf8f" />
          <ellipse cx="100" cy="40" rx="13" ry="3.5" fill="none" stroke="#d9c89a" strokeWidth="1.5" />
        </svg>
      )
    case 'alt-az':
      return (
        <svg viewBox="0 0 120 80">
          <ellipse cx="60" cy="58" rx="50" ry="14" fill="#1b2a5e" stroke="#8ec5ff" strokeOpacity=".6" />
          <path d="M60 58 L60 44" stroke="#ffd27a" strokeWidth="2" />
          <path d="M60 58 L96 64" stroke="#ffd27a" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M60 50 A10 6 0 0 1 72 56" fill="none" stroke="#ffd27a" strokeWidth="2.5" />
          <path d="M60 58 L90 20" stroke="#7ee0ff" strokeWidth="2" />
          <path d="M80 60 A22 22 0 0 0 76 38" fill="none" stroke="#7ee0ff" strokeWidth="2.5" />
          <circle cx="92" cy="18" r="6" fill="#ffe7a8" />
          <circle cx="92" cy="18" r="2.5" fill="#fff" />
        </svg>
      )
    case 'constellations': {
      const pts = [[14, 30], [30, 26], [44, 32], [56, 38], [60, 56], [80, 58], [84, 40]]
      return (
        <svg viewBox="0 0 120 80">
          <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke="#8ec5ff" strokeOpacity=".5" />
          <path d="M84 40 60 56" stroke="#8ec5ff" strokeOpacity=".5" />
          <path d="M84 40 100 8" stroke="#ffd27a" strokeDasharray="3 3" />
          {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.2" fill="#fff" />)}
          <circle cx="102" cy="6" r="3.2" fill="#ffe7a8" />
        </svg>
      )
    }
    case 'moon-phases':
      return (
        <svg viewBox="0 0 120 80">
          {[0.15, 0.5, 1, 0.5, 0.15].map((k, i) => {
            const cx = 14 + i * 23
            const waxing = i < 2
            return (
              <g key={i}>
                <circle cx={cx} cy="40" r="9" fill="#1f2547" />
                {k === 1 ? (
                  <circle cx={cx} cy="40" r="9" fill="#e6e8f0" />
                ) : (
                  <path
                    d={`M${cx} 31 A9 9 0 0 ${waxing ? 1 : 0} ${cx} 49 A${9 * Math.abs(1 - 2 * k)} 9 0 0 ${k < 0.5 === waxing ? 0 : 1} ${cx} 31`}
                    fill="#e6e8f0"
                  />
                )}
              </g>
            )
          })}
        </svg>
      )
    case 'seasons':
      return (
        <svg viewBox="0 0 120 80">
          <ellipse cx="60" cy="40" rx="48" ry="16" fill="none" stroke="#5d6685" strokeDasharray="2 3" />
          <circle cx="60" cy="40" r="8" fill="#ffb35c" />
          <g transform="rotate(23.5 14 40)">
            <circle cx="14" cy="40" r="7" fill="#4f8fe0" />
            <path d="M14 28v24" stroke="#fff" strokeWidth="1.2" />
          </g>
          <g transform="rotate(23.5 106 40)">
            <circle cx="106" cy="40" r="7" fill="#4f8fe0" />
            <path d="M106 28v24" stroke="#fff" strokeWidth="1.2" />
          </g>
        </svg>
      )
    case 'eclipses':
      return (
        <svg viewBox="0 0 120 80">
          <circle cx="60" cy="40" r="24" fill="#ffb35c" opacity=".35" />
          <circle cx="60" cy="40" r="18" fill="#ffc86e" />
          <circle cx="66" cy="38" r="17" fill="#0b0f22" />
        </svg>
      )
    case 'space-tech':
      return (
        <svg viewBox="0 0 120 80">
          <circle cx="60" cy="46" r="18" fill="#2f6fc0" />
          <path d="M46 40q8-6 14 0t14 2" stroke="#3fa35a" strokeWidth="5" fill="none" strokeLinecap="round" />
          <ellipse cx="60" cy="46" rx="44" ry="14" fill="none" stroke="#9fe3e8" strokeOpacity=".5" strokeDasharray="2 3" transform="rotate(-12 60 46)" />
          <g transform="translate(96 26) rotate(-12)">
            <rect x="-4" y="-3" width="8" height="6" rx="1" fill="#dfe6ff" />
            <rect x="-15" y="-2" width="9" height="4" fill="#5b82ff" />
            <rect x="6" y="-2" width="9" height="4" fill="#5b82ff" />
          </g>
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 120 80">
          <circle cx="60" cy="40" r="24" fill="#b18cff" opacity=".2" />
          <text x="60" y="52" textAnchor="middle" fontSize="34" fontWeight="700" fill="#d6c6ff" fontFamily="Chakra Petch">?</text>
        </svg>
      )
  }
}
