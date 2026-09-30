import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon } from '../components/Icons'

// ที่มาและสัญญาอนุญาตของภาพจริงทั้งหมด (ดาวน์โหลดจาก Wikimedia Commons)
export const PHOTOS = {
  'eclipse-total-2017': { src: '/photos/eclipse-total-2017.jpg', credit: 'NASA/Aubrey Gemignani', license: 'Public domain' },
  'eclipse-annular-2012': { src: '/photos/eclipse-annular-2012.jpg', credit: 'Brocken Inaglory', license: 'CC BY-SA 3.0' },
  'eclipse-partial': { src: '/photos/eclipse-partial.jpg', credit: 'W.carter', license: 'CC BY 4.0' },
  'lunar-total-2026': { src: '/photos/lunar-total-2026.jpg', credit: 'NASA', license: 'Public domain' },
  'lunar-sequence-2026': { src: '/photos/lunar-sequence-2026.jpg', credit: 'NASA', license: 'Public domain' },
  'epic-moon-shadow-2017': { src: '/photos/epic-moon-shadow-2017.png', credit: 'NASA DSCOVR EPIC', license: 'Public domain' },
  'thaicom-8': { src: '/photos/thaicom-8.jpg', credit: 'SpaceX', license: 'CC0' },
  'knacksat-2': { src: '/photos/knacksat-2.jpg', credit: 'Siravijbb', license: 'CC BY-SA 4.0' },
  'thailand-flood-2011': { src: '/photos/thailand-flood-2011.jpg', credit: 'NASA MODIS Rapid Response Team', license: 'Public domain' },
  'himawari-8': { src: '/photos/himawari-8.jpg', credit: 'JMA (Himawari-8)', license: 'Public domain' },
  'gps-block-3a': { src: '/photos/gps-block-3a.jpg', credit: 'U.S. Government', license: 'Public domain' },
  'thai-national-observatory': { src: '/photos/thai-national-observatory.jpg', credit: 'Jooshaa', license: 'CC BY-SA 4.0' },
}

export default function Photo({ id, alt, caption, className = '', ratio }) {
  const [open, setOpen] = useState(false)
  const p = PHOTOS[id]

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <figure className={`photo ${className}`}>
        <button className="photo-frame" style={ratio ? { aspectRatio: ratio } : undefined} onClick={() => setOpen(true)} aria-label={`ขยายภาพ ${alt}`}>
          <img src={p.src} alt={alt} loading="lazy" />
          <span className="photo-zoom">⤢</span>
        </button>
        {caption && <figcaption>{caption}</figcaption>}
        <small className="photo-credit">ภาพ: {p.credit} · {p.license}</small>
      </figure>
      {/* portal ไปที่ body เพราะการ์ดที่มี animation สร้าง stacking context ทำให้ position: fixed ถูกขังไว้ */}
      {open && createPortal(
        <div className="lightbox" onClick={() => setOpen(false)} role="dialog" aria-label={alt}>
          <img src={p.src} alt={alt} />
          <div className="lightbox-cap">
            {caption && <p>{caption}</p>}
            <small>ภาพ: {p.credit} · {p.license} · Wikimedia Commons</small>
          </div>
          <button className="icon-btn lightbox-close" aria-label="ปิด"><CloseIcon /></button>
        </div>,
        document.body,
      )}
    </>
  )
}
