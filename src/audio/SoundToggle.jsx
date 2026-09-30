import { useSyncExternalStore } from 'react'
import { getState, setEnabled, subscribe } from './ambient'

// snapshot เป็น string เพื่อให้ useSyncExternalStore เทียบค่าได้คงที่
const snap = () => {
  const s = getState()
  return `${s.enabled ? 1 : 0}${s.playing ? 1 : 0}`
}

export function useSound() {
  const v = useSyncExternalStore(subscribe, snap)
  return { enabled: v[0] === '1', playing: v[1] === '1' }
}

export default function SoundToggle({ className = '' }) {
  const { enabled, playing } = useSound()
  const on = enabled && playing
  return (
    <button
      className={`sound-btn ${on ? 'on' : ''} ${className}`}
      onClick={(e) => {
        e.stopPropagation()
        setEnabled(!on)
      }}
      aria-label={on ? 'ปิดเสียงบรรยากาศ' : 'เปิดเสียงบรรยากาศ'}
      title={on ? 'ปิดเสียง' : 'เปิดเสียงบรรยากาศ'}
    >
      <span className="sound-bars" aria-hidden>
        <i /><i /><i /><i />
      </span>
      <span className="sound-label">{on ? 'เสียง' : 'ปิดเสียง'}</span>
    </button>
  )
}
