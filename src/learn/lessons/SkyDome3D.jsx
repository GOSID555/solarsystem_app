import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Line } from '@react-three/drei'
import * as THREE from 'three'
import { canvasDpr } from '../../ui'
import { CONSTELLATIONS, BRIGHT_STARS, ECLIPTIC, altAz, centroid } from '../constellations'

// ท้องฟ้าจำลอง 3 มิติ: ผู้ดูยืนอยู่จุดศูนย์กลางของทรงกลมฟ้า ลากเพื่อหมุนมองรอบตัว
// พิกัด: ทิศเหนือ = -z, ทิศตะวันออก = +x, จุดเหนือศีรษะ = +y

const SKY_R = 100
const RAD = Math.PI / 180
const DIR8 = ['เหนือ', 'ตะวันออกเฉียงเหนือ', 'ตะวันออก', 'ตะวันออกเฉียงใต้', 'ใต้', 'ตะวันตกเฉียงใต้', 'ตะวันตก', 'ตะวันตกเฉียงเหนือ']

function toVec(alt, az, r = SKY_R) {
  const a = alt * RAD
  const z = az * RAD
  return new THREE.Vector3(Math.cos(a) * Math.sin(z) * r, Math.sin(a) * r, -Math.cos(a) * Math.cos(z) * r)
}

// ---------- texture ที่สร้างด้วย canvas ----------
function starTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.18, 'rgba(255,255,255,0.95)')
  grad.addColorStop(0.4, 'rgba(190,215,255,0.35)')
  grad.addColorStop(1, 'rgba(190,215,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

// ป้ายข้อความภาษาไทย วาดด้วยฟอนต์ของเบราว์เซอร์ลง canvas
function labelTexture(text, { size = 34, color = '#cfe0ff', weight = 500, bg = null } = {}) {
  const c = document.createElement('canvas')
  const g = c.getContext('2d')
  const font = `${weight} ${size}px "IBM Plex Sans Thai", "Chakra Petch", sans-serif`
  g.font = font
  const w = Math.ceil(g.measureText(text).width) + (bg ? 28 : 12)
  const h = Math.ceil(size * 1.6)
  c.width = w
  c.height = h
  g.font = font
  if (bg) {
    g.fillStyle = bg
    g.beginPath()
    g.roundRect(0, 0, w, h, h / 2)
    g.fill()
  }
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.lineWidth = 6
  g.strokeStyle = 'rgba(3,6,20,0.85)'
  if (!bg) g.strokeText(text, w / 2, h / 2)
  g.fillStyle = color
  g.fillText(text, w / 2, h / 2)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.minFilter = THREE.LinearFilter
  return { tex, aspect: w / h }
}

function Label({ text, position, height = 0.045, center = [0.5, 0], onClick, ...opts }) {
  const { tex, aspect } = useMemo(() => labelTexture(text, opts), [text, opts.color, opts.size, opts.bg, opts.weight]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => tex.dispose(), [tex])
  return (
    <sprite
      position={position}
      scale={[height * aspect, height, 1]}
      center={center}
      onClick={onClick}
      onPointerOver={onClick ? () => (document.body.style.cursor = 'pointer') : undefined}
      onPointerOut={onClick ? () => (document.body.style.cursor = 'auto') : undefined}
    >
      <spriteMaterial map={tex} transparent sizeAttenuation={false} depthWrite={false} />
    </sprite>
  )
}

// ภาพเงาต้นไม้และบ้านตามขอบฟ้า
function silhouetteTexture() {
  const c = document.createElement('canvas')
  c.width = 4096
  c.height = 256
  const g = c.getContext('2d')
  g.fillStyle = '#02040c'
  let seed = 7
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  g.beginPath()
  g.moveTo(0, 256)
  for (let x = 0; x <= 4096; x += 16) g.lineTo(x, 196 - Math.sin(x / 260) * 18 - Math.sin(x / 90) * 6)
  g.lineTo(4096, 256)
  g.fill()
  for (let i = 0; i < 70; i++) {
    const x = rnd() * 4096
    const kind = rnd()
    if (kind < 0.7) {
      const r = 18 + rnd() * 34
      const trunk = 20 + rnd() * 30
      g.fillRect(x - 3, 256 - trunk - 40, 6, trunk + 40)
      g.beginPath()
      g.arc(x, 256 - trunk - 40 - r * 0.6, r, 0, Math.PI * 2)
      g.arc(x - r * 0.6, 256 - trunk - 40, r * 0.7, 0, Math.PI * 2)
      g.arc(x + r * 0.6, 256 - trunk - 40, r * 0.7, 0, Math.PI * 2)
      g.fill()
    } else {
      const w = 60 + rnd() * 80
      const h = 40 + rnd() * 40
      g.fillRect(x, 256 - h - 50, w, h + 50)
      g.beginPath()
      g.moveTo(x - 10, 256 - h - 50)
      g.lineTo(x + w / 2, 256 - h - 90)
      g.lineTo(x + w + 10, 256 - h - 50)
      g.fill()
    }
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = THREE.RepeatWrapping
  return tex
}

function glowTexture() {
  const c = document.createElement('canvas')
  c.width = 4
  c.height = 256
  const g = c.getContext('2d')
  const grad = g.createLinearGradient(0, 0, 0, 256)
  grad.addColorStop(0, 'rgba(40,70,160,0)')
  grad.addColorStop(0.7, 'rgba(60,90,180,0.35)')
  grad.addColorStop(1, 'rgba(110,130,200,0.6)')
  g.fillStyle = grad
  g.fillRect(0, 0, 4, 256)
  return new THREE.CanvasTexture(c)
}

function Ground() {
  const sil = useMemo(silhouetteTexture, [])
  const glow = useMemo(glowTexture, [])
  return (
    <group>
      {/* พื้นดินครึ่งล่าง บังดาวที่อยู่ใต้ขอบฟ้า */}
      <mesh>
        <sphereGeometry args={[90, 48, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshBasicMaterial color="#03050d" side={THREE.BackSide} />
      </mesh>
      {/* แสงเรืองจางๆ ใกล้ขอบฟ้า */}
      <mesh position={[0, 9, 0]}>
        <cylinderGeometry args={[89, 89, 18, 96, 1, true]} />
        <meshBasicMaterial map={glow} transparent side={THREE.BackSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* เงาต้นไม้ บ้าน เสาไฟ */}
      <mesh position={[0, 3.2, 0]}>
        <cylinderGeometry args={[86, 86, 12, 128, 1, true]} />
        <meshBasicMaterial map={sil} transparent alphaTest={0.5} side={THREE.BackSide} />
      </mesh>
    </group>
  )
}

// ---------- กล้อง: มองจากจุดศูนย์กลาง หมุนได้ ซูมด้วยการเปลี่ยนมุมกล้อง ----------
function CameraLook({ look, controlsRef, hudRef, onViewAz }) {
  const { camera, gl } = useThree()
  const target = useRef(null)
  const lastCardinal = useRef(null)
  const cur = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    target.current = toVec(look.alt, look.az, 1).normalize()
  }, [look])

  useEffect(() => {
    const c = controlsRef.current
    const cancel = () => (target.current = null)
    c?.addEventListener('start', cancel)
    const onWheel = (e) => {
      e.preventDefault()
      camera.fov = THREE.MathUtils.clamp(camera.fov + e.deltaY * 0.04, 25, 100)
      camera.updateProjectionMatrix()
    }
    gl.domElement.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      c?.removeEventListener('start', cancel)
      gl.domElement.removeEventListener('wheel', onWheel)
    }
  }, [camera, gl, controlsRef])

  useFrame((_, dt) => {
    const c = controlsRef.current
    if (!c) return
    // ทิศที่กำลังมอง = จากกล้องไปจุดศูนย์กลาง
    cur.copy(c.target).sub(camera.position).normalize()
    if (target.current) {
      cur.lerp(target.current, 1 - Math.pow(0.02, dt)).normalize()
      camera.position.copy(cur).multiplyScalar(-0.01)
      c.update()
      if (cur.angleTo(target.current) < 0.002) target.current = null
    }
    const alt = Math.asin(THREE.MathUtils.clamp(cur.y, -1, 1)) / RAD
    const az = ((Math.atan2(cur.x, -cur.z) / RAD) + 360) % 360
    if (hudRef.current) hudRef.current.textContent = `ทิศ${DIR8[Math.round(az / 45) % 8]} · มุมทิศ ${Math.round(az) % 360}° · มุมเงย ${Math.round(alt)}°`
    const card = Math.round(az / 90) % 4
    if (card !== lastCardinal.current) {
      lastCardinal.current = card
      onViewAz(az)
    }
  })
  return null
}

// แตะเลือกกลุ่มดาว: หาทิศที่แตะ แล้วเลือกกลุ่มดาวที่จุดศูนย์กลางใกล้ที่สุด
// (แม่นกว่าการ raycast ป้ายชื่อ และพื้นที่แตะใหญ่ เหมาะกับจอสัมผัส)
function TapPicker({ lst, onPick }) {
  const { camera, gl } = useThree()
  const pickRef = useRef(onPick)
  pickRef.current = onPick
  const targets = useMemo(
    () =>
      CONSTELLATIONS.map((c) => {
        const cen = centroid(c)
        const p = altAz(cen.ra, cen.dec, lst)
        return { id: c.id, up: p.alt > 0, dir: toVec(p.alt, p.az, 1).normalize() }
      }),
    [lst],
  )

  useEffect(() => {
    const el = gl.domElement
    let down = null
    const onDown = (e) => (down = { x: e.clientX, y: e.clientY })
    // ฟัง pointerup ที่ window เพราะ OrbitControls จับ pointer (pointer capture) ไว้ที่ element อื่น
    const onUp = (e) => {
      const start = down
      down = null
      if (!start || Math.hypot(e.clientX - start.x, e.clientY - start.y) > 6) return
      const r = el.getBoundingClientRect()
      const ndc = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
      const ray = new THREE.Raycaster()
      ray.setFromCamera(ndc, camera)
      const limit = Math.max(4, camera.fov * 0.09) * RAD
      let best = null
      targets.forEach((t) => {
        if (!t.up) return
        const a = t.dir.angleTo(ray.ray.direction)
        if (a < limit && (!best || a < best.a)) best = { id: t.id, a }
      })
      if (best) pickRef.current(best.id)
    }
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [gl, camera, targets])
  return null
}

function Sky({ lst, selected, show }) {
  const starTex = useMemo(starTexture, [])

  const data = useMemo(() => {
    const cons = CONSTELLATIONS.map((c) => {
      const pos = Object.fromEntries(
        c.stars.map((st) => {
          const p = altAz(st.ra, st.dec, lst)
          return [st.id, toVec(p.alt, p.az)]
        }),
      )
      const cen = centroid(c)
      const cp = altAz(cen.ra, cen.dec, lst)
      return { c, pos, cen: toVec(cp.alt, cp.az, SKY_R * 0.98), up: cp.alt > 0 }
    })
    const bright = BRIGHT_STARS.map((st) => {
      const p = altAz(st.ra, st.dec, lst)
      return { st, pos: toVec(p.alt, p.az), up: p.alt > 0 }
    })
    // จุดดาวแยกตามความสว่าง 3 ระดับ
    const groups = [[], [], []]
    const add = (v, mag) => groups[mag < 1.5 ? 0 : mag < 3 ? 1 : 2].push(v.x, v.y, v.z)
    CONSTELLATIONS.forEach((c, i) => c.stars.forEach((st) => add(cons[i].pos[st.id], st.mag)))
    bright.forEach((b) => add(b.pos, b.st.mag))
    const ecl = ECLIPTIC.map((pt) => {
      const p = altAz(pt.ra, pt.dec, lst)
      return toVec(p.alt, p.az, SKY_R * 0.99)
    })
    return { cons, bright, groups: groups.map((g) => new Float32Array(g)), ecl }
  }, [lst])

  const dipper = data.cons.find((d) => d.c.id === 'dipper')
  const polaris = data.bright[0]

  return (
    <group>
      {data.groups.map((arr, i) => (
        <points key={`${i}-${lst}`}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[arr, 3]} />
          </bufferGeometry>
          <pointsMaterial map={starTex} size={[26, 16, 10][i]} sizeAttenuation={false} transparent depthWrite={false} color={['#ffffff', '#eef3ff', '#c9d6ff'][i]} />
        </points>
      ))}

      {show.lines && data.cons.map(({ c, pos }) => {
        const on = c.id === selected
        const pts = c.lines.flatMap(([a, b]) => [pos[a], pos[b]])
        return (
          <Line key={c.id} points={pts} segments color={on ? c.color : '#8ec5ff'} lineWidth={on ? 2.6 : 1.1} transparent opacity={on ? 1 : 0.4} depthWrite={false} />
        )
      })}

      {show.ecliptic && <Line points={data.ecl} color="#ffd27a" lineWidth={1.4} dashed dashSize={1.5} gapSize={1.5} transparent opacity={0.6} />}

      {show.pointer && (
        <Line points={[dipper.pos.merak, polaris.pos]} color="#ffd27a" lineWidth={2} dashed dashSize={1.2} gapSize={1} />
      )}

      {show.names && data.cons.map(({ c, cen }) => (
        <Label
          key={c.id}
          text={c.name.replace('กลุ่มดาว', '')}
          position={cen}
          center={[0.5, 0.5]}
          height={c.id === selected ? 0.064 : 0.048}
          color={c.id === selected ? '#ffffff' : '#a9bbef'}
          weight={c.id === selected ? 700 : 500}
          bg={c.id === selected ? 'rgba(40,60,140,0.75)' : null}
        />
      ))}
      {show.names && data.bright.map(({ st, pos }) => (
        <Label key={st.id} text={st.name} position={pos} center={[0.5, 1.3]} height={0.04} color="#e8ecff" size={30} />
      ))}
    </group>
  )
}

export default function SkyDome3D({ lst, look, selected, onPick, show, onViewAz }) {
  const controlsRef = useRef()
  const hudRef = useRef()
  const dirLabels = useMemo(
    () => DIR8.map((name, i) => ({ name, az: i * 45, main: i % 2 === 0 })),
    [],
  )

  return (
    <div className="sky3d">
      <Canvas camera={{ fov: 70, near: 0.001, far: 500, position: [0, 0, -0.01] }} dpr={canvasDpr()}>
        <color attach="background" args={['#040818']} />
        <Sky lst={lst} selected={selected} show={show} />
        <TapPicker lst={lst} onPick={onPick} />
        <Ground />
        {dirLabels.map((d) => (
          <Label
            key={d.az}
            text={d.name}
            position={toVec(3, d.az, 80)}
            center={[0.5, 0]}
            height={d.main ? 0.066 : 0.044}
            size={d.main ? 40 : 30}
            weight={d.main ? 700 : 500}
            color={d.az === 0 ? '#ffd27a' : d.main ? '#cfe0ff' : '#8ea3d8'}
          />
        ))}
        <OrbitControls ref={controlsRef} enableZoom={false} enablePan={false} rotateSpeed={-0.35} enableDamping dampingFactor={0.1}
          minPolarAngle={80 * RAD} maxPolarAngle={179 * RAD} />
        <CameraLook look={look} controlsRef={controlsRef} hudRef={hudRef} onViewAz={onViewAz} />
      </Canvas>
      <div className="sky3d-hud">
        <span ref={hudRef} />
        <small>ลากเพื่อหมุนมองรอบตัว · สกรอลล์เพื่อซูม · แตะชื่อกลุ่มดาว</small>
      </div>
    </div>
  )
}
