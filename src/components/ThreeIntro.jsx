import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function ThreeIntro({ onEnter, sound, productImage }) {
  const mountRef = useRef(null)
  const productRef = useRef(null)
  const [calibrated, setCalibrated] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((value) => {
        const next = Math.min(100, value + 5)
        if (next === 100) {
          setCalibrated(true)
          window.clearInterval(interval)
        }
        return next
      })
    }, 28)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const container = mountRef.current
    if (!container) return undefined
    const interactionSurface = container.parentElement

    let renderer
    let frameId
    let resizeObserver
    let isDisposed = false

    try {
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
      camera.position.set(0, 0, 7)

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
      renderer.setSize(container.clientWidth, container.clientHeight)
      renderer.setClearColor(0x000000, 0)
      container.appendChild(renderer.domElement)

      scene.add(new THREE.AmbientLight(0xcab8ff, 1.5))
      const violetLight = new THREE.PointLight(0x9d5cff, 22, 18)
      violetLight.position.set(2.4, 1.5, 2)
      scene.add(violetLight)
      const pearlLight = new THREE.PointLight(0xe9dcff, 12, 15)
      pearlLight.position.set(-3, -1, 1)
      scene.add(pearlLight)

      const orbitGroup = new THREE.Group()
      orbitGroup.position.set(1.25, 0.1, -0.9)
      scene.add(orbitGroup)
      const orbitStyles = [
        { radius: 2.8, tube: 0.012, color: 0xb278ff, opacity: 0.45, x: 0.72, y: 0.16 },
        { radius: 3.35, tube: 0.009, color: 0x8170c9, opacity: 0.27, x: 1.14, y: -0.34 },
        { radius: 2.2, tube: 0.008, color: 0xe1caff, opacity: 0.2, x: 0.28, y: 0.82 },
      ]
      orbitStyles.forEach(({ radius, tube, color, opacity, x, y }) => {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(radius, tube, 8, 160),
          new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false }),
        )
        ring.rotation.set(x, y, 0)
        orbitGroup.add(ring)
      })

      const starCount = 150
      const starPositions = new Float32Array(starCount * 3)
      for (let index = 0; index < starCount; index += 1) {
        const offset = index * 3
        starPositions[offset] = (Math.random() - 0.5) * 13
        starPositions[offset + 1] = (Math.random() - 0.5) * 8
        starPositions[offset + 2] = (Math.random() - 0.5) * 5 - 1
      }
      const starGeometry = new THREE.BufferGeometry()
      starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
      const stars = new THREE.Points(
        starGeometry,
        new THREE.PointsMaterial({ color: 0xc8a6ff, size: 0.025, transparent: true, opacity: 0.65, depthWrite: false }),
      )
      scene.add(stars)

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const compactScreen = window.matchMedia('(max-width: 600px)').matches
      const animate = (time = 0) => {
        if (isDisposed) return
        if (!reducedMotion && !compactScreen) {
          orbitGroup.rotation.z = Math.sin(time * 0.00012) * 0.07
          orbitGroup.rotation.y = Math.sin(time * 0.00016) * 0.06
          stars.rotation.y = time * 0.000006
        }
        renderer.render(scene, camera)
        if (!reducedMotion && !compactScreen) frameId = window.requestAnimationFrame(animate)
      }
      animate()

      resizeObserver = new ResizeObserver(() => {
        if (!renderer || isDisposed) return
        camera.aspect = container.clientWidth / Math.max(container.clientHeight, 1)
        camera.updateProjectionMatrix()
        renderer.setSize(container.clientWidth, container.clientHeight)
        if (reducedMotion || compactScreen) renderer.render(scene, camera)
      })
      resizeObserver.observe(container)

      const handlePointerMove = (event) => {
        const bounds = interactionSurface.getBoundingClientRect()
        const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
        const y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1
        orbitGroup.rotation.x = 0.08 - y * 0.06
        orbitGroup.rotation.y += (x * 0.1 - orbitGroup.rotation.y) * 0.08
        productRef.current?.style.setProperty('--intro-tilt-x', `${x * 2.4}deg`)
        productRef.current?.style.setProperty('--intro-tilt-y', `${-y * 1.4}deg`)
        if (reducedMotion || compactScreen) renderer.render(scene, camera)
      }
      const handlePointerLeave = () => {
        productRef.current?.style.setProperty('--intro-tilt-x', '0deg')
        productRef.current?.style.setProperty('--intro-tilt-y', '0deg')
      }
      interactionSurface.addEventListener('pointermove', handlePointerMove, { passive: true })
      interactionSurface.addEventListener('pointerleave', handlePointerLeave)

      return () => {
        isDisposed = true
        window.cancelAnimationFrame(frameId)
        resizeObserver?.disconnect()
        interactionSurface.removeEventListener('pointermove', handlePointerMove)
        interactionSurface.removeEventListener('pointerleave', handlePointerLeave)
        scene.traverse((object) => {
          object.geometry?.dispose()
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose())
          else object.material?.dispose()
        })
        renderer?.dispose()
        renderer?.domElement.remove()
      }
    } catch {
      renderer?.dispose()
      renderer?.domElement.remove()
      return undefined
    }
  }, [])

  return (
    <div className="three-cyber-intro-screen" role="dialog" aria-modal="true" aria-label="BANGTAN-SHOES footwear archive introduction">
      <div className="three-canvas-container" ref={mountRef} aria-hidden="true" />
      <div className="intro-product-photography" ref={productRef} aria-hidden="true">
        <img src={productImage || '/shoes/hero-purple.webp'} alt="BANGTAN-SHOES" fetchPriority="high" />
        <span className="intro-photo-caption">BANGTAN SHADOW · PERFORMANCE HIGH-TOP</span>
      </div>
      <div className="intro-matrix-overlay" />

      <div className="intro-hud-top">
        <div className="hud-badge-cluster">
          <span className="hud-tag glow">BANGTAN-SHOES® · OFFICIAL ARCHIVE</span>
          <span className="hud-tag">SPRING / SUMMER 2026</span>
        </div>
        <span className="hud-telemetry" aria-hidden="true">STEP BEYOND ORDINARY · EST. 2026</span>
      </div>

      <div className="intro-center-floating-ui">
        <div className="intro-brand-title">
          <span className="intro-sub-eyebrow">STEP BEYOND ORDINARY</span>
          <h1>BANGTAN<span>-SHOES</span></h1>
          <p className="intro-mission">Considered futuristic silhouettes. Aerospace nitrogen cushioning. A new standard for the cyber footwear rotation.</p>
        </div>
        <div className="intro-progress-container" aria-live="polite">
          <div className="progress-meta">
            <span className="phase-text">{calibrated ? 'THE ARCHIVE IS READY' : `PREPARING THE ARCHIVE... ${progress}%`}</span>
            <span className="pct-text">{progress}%</span>
          </div>
          <div className="progress-bar-track" aria-hidden="true">
            <div className="progress-bar-glow-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="intro-action-zone">
          <button type="button" autoFocus className="btn-cyber-enter" onClick={() => { sound?.success(); onEnter() }}>
            <span className="btn-glow-edge" />
            <span className="btn-text">ENTER THE ARCHIVE</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="intro-hud-bottom">
        <span>EXPLORE THE SIGNATURE SERIES</span>
        <button type="button" className="skip-btn" onClick={() => { sound?.click(); onEnter() }}>SKIP TO STORE <span aria-hidden="true">↗</span></button>
      </div>
    </div>
  )
}
