const base = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const PlayIcon = () => (
  <svg {...base} fill="currentColor" stroke="none"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>
)
export const PauseIcon = () => (
  <svg {...base} fill="currentColor" stroke="none"><rect x="6" y="5" width="4" height="14" rx="1.2" /><rect x="14" y="5" width="4" height="14" rx="1.2" /></svg>
)
export const OrbitIcon = () => (
  <svg {...base}><ellipse cx="12" cy="12" rx="10" ry="5.5" transform="rotate(-20 12 12)" /><circle cx="12" cy="12" r="2.2" /><circle cx="20.2" cy="8.6" r="1.6" fill="currentColor" stroke="none" /></svg>
)
export const TagIcon = () => (
  <svg {...base}><path d="M4 7h16M4 12h10M4 17h13" /></svg>
)
export const OverviewIcon = () => (
  <svg {...base}><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="8" strokeDasharray="2 3" /></svg>
)
export const ResetIcon = () => (
  <svg {...base}><path d="M4 12a8 8 0 1 0 2.4-5.7" /><path d="M4 4v4.5h4.5" /></svg>
)
export const ChevronLeft = () => (
  <svg {...base}><path d="m15 6-6 6 6 6" /></svg>
)
export const ChevronRight = () => (
  <svg {...base}><path d="m9 6 6 6-6 6" /></svg>
)
export const ArrowLeft = () => (
  <svg {...base}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
)
export const GaugeIcon = () => (
  <svg {...base}><path d="M4.5 17a8.5 8.5 0 1 1 15 0" /><path d="m12 13 4-5" /><circle cx="12" cy="13" r="1.5" fill="currentColor" /></svg>
)
export const MoonIcon = () => (
  <svg {...base}><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="9" strokeDasharray="1.5 3.5" /><circle cx="20" cy="8.5" r="1.6" fill="currentColor" stroke="none" /></svg>
)
export const GlobeIcon = () => (
  <svg {...base}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" /></svg>
)
export const RotateIcon = () => (
  <svg {...base}><path d="M20 12a8 8 0 1 1-3-6.25" /><path d="M20 4v4.5h-4.5" /><circle cx="12" cy="12" r="2" /></svg>
)
export const CalendarIcon = () => (
  <svg {...base}><rect x="4" y="5" width="16" height="15" rx="3" /><path d="M4 10h16M9 3v4M15 3v4" /></svg>
)
export const RulerIcon = () => (
  <svg {...base}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M6 10v4M18 10v4" /></svg>
)
export const GravityIcon = () => (
  <svg {...base}><path d="M12 3v14M7 12l5 5 5-5" /><path d="M5 21h14" /></svg>
)
export const ThermoIcon = () => (
  <svg {...base}><path d="M10 13.5V5a2 2 0 1 1 4 0v8.5a4 4 0 1 1-4 0Z" /><circle cx="12" cy="16.5" r="1.5" fill="currentColor" /></svg>
)
export const RocketIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12c-2.5-3-6-4.5-10-4.5L7.5 5.5 6.5 8C4.5 8.6 3 10.2 3 12s1.5 3.4 3.5 4l1 2.5 3.5-2c4 0 7.5-1.5 10-4.5Zm-6.5 1.3a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Z" /></svg>
)
export const CloseIcon = () => (
  <svg {...base}><path d="M6 6l12 12M18 6 6 18" /></svg>
)
