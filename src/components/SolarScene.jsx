import { useMemo, useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, Line, useTexture } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { SUN, PLANETS, BODIES, orbitAngle } from '../data/planets'
import { detailLayout } from '../layout'

const BODY_BY_ID = Object.fromEntries(BODIES.map((b) => [b.id, b]))

// รัศมีที่ใช้จัดเฟรมกล้อง: ดาวที่มีวงแหวนต้องถอยออกให้เห็นวงแหวนครบ
const frameRadius = (b) => (b.ring ? b.ring.outer * 0.78 : b.radius)

// ตำแหน่งในฉาก ณ เวลาจำลอง t (วันนับจาก J2000)
function orbitPosition(body, t, out) {
  const a = orbitAngle(body, t)
  return out.set(Math.cos(a) * body.orbit, 0, -Math.sin(a) * body.orbit)
}

function useColorTexture(url) {
  const tex = useTexture(url)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

const pointer = {
  onPointerOver: () => (document.body.style.cursor = 'pointer'),
  onPointerOut: () => (document.body.style.cursor = 'auto'),
}

// แสงเรืองขอบดาวแบบ fresnel ให้ดูเหมือนมีชั้นบรรยากาศ
const atmosphereVert = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const atmosphereFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uIntensity;
  varying vec3 vNormal;
  void main() {
    float i = pow(max(0.0, 0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0))), uPower);
    gl_FragColor = vec4(uColor, 1.0) * i * uIntensity;
  }
`

function Atmosphere({ radius, color, scale = 1.1, power = 4, intensity = 0.55 }) {
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color(color) }, uPower: { value: power }, uIntensity: { value: intensity } }),
    [color, power, intensity],
  )
  return (
    <mesh scale={scale}>
      <sphereGeometry args={[radius, 48, 48]} />
      <shaderMaterial
        vertexShader={atmosphereVert}
        fragmentShader={atmosphereFrag}
        uniforms={uniforms}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

function Sun({ onSelect }) {
  const ref = useRef()
  const tex = useColorTexture(SUN.texture)
  useFrame((_, dt) => {
    ref.current.rotation.y += dt * 0.03
  })
  return (
    <group>
      <mesh ref={ref} onClick={(e) => { e.stopPropagation(); onSelect('sun') }} {...pointer}>
        <sphereGeometry args={[SUN.radius, 64, 64]} />
        {/* สีเกิน 1.0 + toneMapped={false} ทำให้ Bloom จับเฉพาะดวงอาทิตย์ */}
        <meshBasicMaterial map={tex} color={[1.5, 1.05, 0.7]} toneMapped={false} />
      </mesh>
      <Atmosphere radius={SUN.radius} color="#ff8a2a" scale={1.3} power={2} intensity={1} />
      <pointLight position={[0, 0, 0]} intensity={2.6} decay={0} color="#fff4e6" />
    </group>
  )
}

function Ring({ ring }) {
  const geo = useMemo(() => {
    const g = new THREE.RingGeometry(ring.inner, ring.outer, 160, 1)
    const pos = g.attributes.position
    const uv = g.attributes.uv
    const v = new THREE.Vector3()
    // map u ตามรัศมี เพื่อให้ภาพแถบวงแหวนวางจากในออกนอก
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)
      uv.setXY(i, (v.length() - ring.inner) / (ring.outer - ring.inner), 0.5)
    }
    return g
  }, [ring])
  // ภาพวงแหวนเป็น PNG ที่มีความโปร่งใสในตัว (alpha channel)
  const map = useTexture(ring.map)
  map.colorSpace = THREE.SRGBColorSpace
  return (
    <mesh geometry={geo} rotation-x={-Math.PI / 2}>
      <meshStandardMaterial
        map={map}
        color={ring.color ?? '#ffffff'}
        transparent
        opacity={ring.opacity ?? 1}
        side={THREE.DoubleSide}
        depthWrite={false}
        emissive="#ffffff"
        emissiveMap={map}
        emissiveIntensity={ring.color ? 0.05 : 0.15}
      />
    </mesh>
  )
}

function Clouds({ radius, url }) {
  const ref = useRef()
  const tex = useColorTexture(url)
  useFrame((_, dt) => (ref.current.rotation.y += dt * 0.02))
  return (
    <mesh ref={ref} scale={1.015}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial map={tex} alphaMap={tex} transparent depthWrite={false} opacity={0.9} />
    </mesh>
  )
}

function Moon({ sat, timeRef }) {
  const ref = useRef()
  const tex = useColorTexture(sat.texture)
  useFrame(() => {
    const a = (timeRef.current / sat.period) * Math.PI * 2
    ref.current.position.set(Math.cos(a) * sat.distance, 0, -Math.sin(a) * sat.distance)
    ref.current.rotation.y = -a
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[sat.radius, 32, 32]} />
      <meshStandardMaterial map={tex} roughness={1} />
    </mesh>
  )
}

function OrbitPath({ radius, highlight }) {
  const points = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 256; i++) {
      const a = (i / 256) * Math.PI * 2
      pts.push([Math.cos(a) * radius, 0, Math.sin(a) * radius])
    }
    return pts
  }, [radius])
  return (
    <Line
      points={points}
      color={highlight ? '#8ec5ff' : '#9fb4ff'}
      transparent
      opacity={highlight ? 0.7 : 0.1}
      lineWidth={highlight ? 1.8 : 1}
    />
  )
}

function Planet({ data, timeRef, registry, onSelect }) {
  const group = useRef()
  const body = useRef()
  const tex = useColorTexture(data.texture)
  const tmp = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    registry.current[data.id] = group.current
    return () => delete registry.current[data.id]
  }, [data.id, registry])

  useFrame(() => {
    const t = timeRef.current
    group.current.position.copy(orbitPosition(data, t, tmp))
    // หมุนรอบตัวเองตามคาบจริง แต่ย่อความเร็วลงให้ยังมองเห็นพื้นผิว
    body.current.rotation.y = (t / (data.day / 24)) * Math.PI * 2 * 0.02
  })

  const select = (e) => { e.stopPropagation(); onSelect(data.id) }

  return (
    <group ref={group}>
      <group rotation-z={data.tilt}>
        <mesh ref={body} onClick={select} {...pointer}>
          <sphereGeometry args={[data.radius, 64, 64]} />
          <meshStandardMaterial map={tex} roughness={0.9} metalness={0} />
        </mesh>
        {data.clouds && <Clouds radius={data.radius} url={data.clouds} />}
        {data.atmosphere && <Atmosphere radius={data.radius} color={data.atmosphere} />}
        {data.ring && <Ring ring={data.ring} />}
      </group>

      {/* จุดคลิกที่ใหญ่กว่าตัวดาว ช่วยให้กดดาวเล็กๆ ได้ง่ายขึ้น */}
      <mesh onClick={select} visible={false}>
        <sphereGeometry args={[Math.max(data.radius * 1.6, 1.2), 12, 12]} />
      </mesh>

      {data.satellites?.map((s) => <Moon key={s.name} sat={s} timeRef={timeRef} />)}
    </group>
  )
}

const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

// กล้องแบบ cinematic: ซูมจากภาพรวมวงโคจรเข้าไปหาดาวด้วย easing
// แล้วเกาะติดดาวขณะโคจร พร้อมเลื่อน view offset ให้ดาวอยู่ในตำแหน่งตามเลย์เอาต์
function CameraRig({ started, selected, registry, controlsRef, onArrive }) {
  const { camera, size } = useThree()
  const s = useRef({ t: 1, dur: 1, fromTarget: new THREE.Vector3(), fromDir: new THREE.Vector3(), fromDist: 115, fromOff: { x: 0, y: 0 }, off: { x: 0, y: 0 }, arrived: true })
  const last = useRef(new THREE.Vector3())
  const v = useMemo(() => ({ target: new THREE.Vector3(), dir: new THREE.Vector3(), tmp: new THREE.Vector3() }), [])

  useEffect(() => {
    // ก่อนกด Start กล้องรออยู่ไกลๆ ในอวกาศ
    if (!started) return
    const controls = controlsRef.current
    const st = s.current
    st.t = 0
    st.arrived = false
    if (controls) {
      st.fromTarget.copy(controls.target)
      st.fromDir.copy(camera.position).sub(controls.target)
      st.fromDist = st.fromDir.length()
      st.fromDir.normalize()
    }
    st.fromOff = { ...st.off }
    st.dur = selected ? 2.2 : st.intro ? 1.8 : 3.6
    st.intro = true
  }, [started, selected, camera, controlsRef])

  useFrame((_, dt) => {
    const controls = controlsRef.current
    if (!controls) return
    const st = s.current
    const body = selected ? BODY_BY_ID[selected] : null

    // ปลายทาง: ตำแหน่งดาว + ทิศมองที่ให้ดาวถูกแสงด้านข้างสวยๆ
    const target = v.target.set(0, 0, 0)
    if (body && body.id !== 'sun') {
      const obj = registry.current[body.id]
      if (!obj) return
      target.copy(obj.position)
    }

    const layout = body ? detailLayout(size.width, size.height) : { x: 0, y: 0, radiusPx: 0 }
    let endDist = 115
    const endDir = v.dir
    if (body) {
      const halfFov = THREE.MathUtils.degToRad(camera.fov / 2)
      endDist = (frameRadius(body) * (size.height / 2)) / (layout.radiusPx * Math.tan(halfFov))
      if (body.id === 'sun') {
        endDir.copy(st.fromDir).setY(0.18).normalize()
      } else {
        // หันกล้องทำมุม ~70° กับทิศดวงอาทิตย์ ให้ดาวมีเงาด้านหนึ่งดูมีมิติ
        endDir.copy(target).negate().setY(0).normalize()
        endDir.applyAxisAngle(THREE.Object3D.DEFAULT_UP, 1.25).setY(0.22).normalize()
      }
    } else {
      endDir.copy(st.fromDir)
      if (endDir.y < 0.5) endDir.setY(0.5)
      endDir.normalize()
    }

    if (st.t < 1) {
      st.t = Math.min(1, st.t + dt / st.dur)
      const e = easeInOut(st.t)
      controls.enabled = false
      const tgt = v.tmp.copy(st.fromTarget).lerp(target, e)
      controls.target.copy(tgt)
      // ระยะไล่แบบ log ให้การซูมดูลื่นทั้งช่วงไกลและใกล้
      const dist = Math.exp(THREE.MathUtils.lerp(Math.log(st.fromDist), Math.log(endDist), e))
      const dir = st.fromDir.clone().lerp(endDir, e).normalize()
      camera.position.copy(tgt).addScaledVector(dir, dist)
      st.off.x = THREE.MathUtils.lerp(st.fromOff.x, layout.x, e)
      st.off.y = THREE.MathUtils.lerp(st.fromOff.y, layout.y, e)
      if (st.t >= 1) {
        controls.enabled = true
        st.arrived = true
        onArrive(selected)
      }
    } else {
      st.off.x = layout.x
      st.off.y = layout.y
      if (body && body.id !== 'sun') {
        // เลื่อนกล้องและเป้าไปพร้อมกับดาว ผู้ใช้ยังหมุน/ซูมได้ตามปกติ
        const delta = v.tmp.copy(target).sub(last.current)
        camera.position.add(delta)
        controls.target.add(delta)
      }
    }
    last.current.copy(target)

    if (Math.abs(st.off.x) > 0.5 || Math.abs(st.off.y) > 0.5) {
      camera.setViewOffset(size.width, size.height, st.off.x, st.off.y, size.width, size.height)
    } else if (camera.view?.enabled) {
      camera.clearViewOffset()
    }
    controls.update()
  })
  return null
}

// ฉายตำแหน่ง 3D ไปเป็นพิกัดบนจอ แล้วขยับ DOM ตรงๆ โดยไม่ผ่าน React render
// - ป้ายชื่อดาวในมุมมองภาพรวม
// - จุดยึดของหน้ารายละเอียด (ป้ายอุณหภูมิข้างดาว)
function Projector({ registry, labelRefs, anchorRefs, selected }) {
  const { camera, size } = useThree()
  const v = useMemo(() => new THREE.Vector3(), [])
  const right = useMemo(() => new THREE.Vector3(), [])
  const up = useMemo(() => new THREE.Vector3(), [])

  const place = (el, vec) => {
    vec.project(camera)
    if (vec.z > 1) {
      el.style.opacity = '0'
      return
    }
    el.style.opacity = ''
    const x = (vec.x * 0.5 + 0.5) * size.width
    const y = (-vec.y * 0.5 + 0.5) * size.height
    el.style.transform = `translate(${x}px, ${y}px)`
  }

  const bodyPos = (id, out) => (id === 'sun' ? out.set(0, 0, 0) : registry.current[id] && out.copy(registry.current[id].position))

  useFrame(() => {
    const labels = labelRefs.current
    for (const id in labels) {
      const el = labels[id]
      if (!el || !bodyPos(id, v)) continue
      v.y += BODY_BY_ID[id].radius * 1.15 + (id === 'sun' ? 0 : 0.4)
      place(el, v)
    }

    const badge = anchorRefs.current.badge
    if (badge && selected && bodyPos(selected, v)) {
      right.set(1, 0, 0).applyQuaternion(camera.quaternion)
      up.set(0, 1, 0).applyQuaternion(camera.quaternion)
      const r = BODY_BY_ID[selected].radius
      v.addScaledVector(right, r * 0.78).addScaledVector(up, r * 0.62)
      place(badge, v)
    }
  })
  return null
}

function TimeKeeper({ timeRef, speed, paused, onTick }) {
  const acc = useRef(0)
  useFrame((_, dt) => {
    if (!paused) timeRef.current += Math.min(dt, 0.1) * speed
    acc.current += dt
    if (acc.current > 0.25) {
      acc.current = 0
      onTick(timeRef.current)
    }
  })
  return null
}

export default function SolarScene({ started, selected, onSelect, onArrive, speed, paused, showOrbits, labelRefs, anchorRefs, timeRef, onTick }) {
  const registry = useRef({})
  const controlsRef = useRef()

  return (
    <>
      <color attach="background" args={['#02030a']} />
      <ambientLight intensity={0.06} />
      <Stars radius={420} depth={140} count={12000} factor={5} saturation={0.5} fade speed={0.4} />

      <TimeKeeper timeRef={timeRef} speed={speed} paused={paused} onTick={onTick} />

      <Sun onSelect={onSelect} />
      {PLANETS.map((p) => (
        <group key={p.id}>
          {showOrbits && <OrbitPath radius={p.orbit} highlight={selected === p.id} />}
          <Planet data={p} timeRef={timeRef} registry={registry} onSelect={onSelect} />
        </group>
      ))}

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minDistance={1.5}
        maxDistance={280}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
      />
      <CameraRig started={started} selected={selected} registry={registry} controlsRef={controlsRef} onArrive={onArrive} />
      <Projector registry={registry} labelRefs={labelRefs} anchorRefs={anchorRefs} selected={selected} />

      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={0.7} radius={0.7} />
        <Vignette offset={0.25} darkness={0.7} />
      </EffectComposer>
    </>
  )
}
