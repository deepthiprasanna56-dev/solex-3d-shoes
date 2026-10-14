import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import './Bangtan.css'
import { products, categories, sizes } from './data/shoesData'
function formatPrice(amount) {
  if (amount == null) return ''
  return `₹${Number(amount).toLocaleString('en-IN')}`
}

const ThreeIntro = lazy(() => import('./components/ThreeIntro'))
const archiveSelections = [
  { category: 'Performance', label: 'THE FAST LANE', note: 'Responsive cushioning, engineered for distance.' },
  { category: 'Streetwear', label: 'AFTER HOURS', note: 'Sculpted silhouettes made for the city.' },
  { category: 'Lifestyle', label: 'EVERYDAY ICONS', note: 'Quiet comfort for the daily rotation.' },
]

/* ── Audio Synthesizer (Web Audio API for Cyber Sounds) ───── */
class CyberSound {
  constructor() {
    this.ctx = null
    this.enabled = false
  }
  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (AudioContext) this.ctx = new AudioContext()
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }
  playBeep(freq = 600, type = 'sine', duration = 0.08, gainVal = 0.05) {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime)
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + duration)
    } catch { /* Sound is optional; keep the storefront usable if audio is unavailable. */ }
  }
  hover() {
    this.playBeep(880, 'sine', 0.04, 0.015)
  }
  click() {
    this.playBeep(1200, 'triangle', 0.06, 0.03)
  }
  success() {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return
      const now = this.ctx.currentTime
      const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.frequency.setValueAtTime(freq, now + idx * 0.06)
        gain.gain.setValueAtTime(0.03, now + idx * 0.06)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.12)
        osc.connect(gain)
        gain.connect(this.ctx.destination)
        osc.start(now + idx * 0.06)
        osc.stop(now + idx * 0.06 + 0.12)
      })
    } catch { /* Sound is optional; keep the storefront usable if audio is unavailable. */ }
  }
}
const sound = new CyberSound()
const particles = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  left: (i * 37.7) % 100,
  size: 2 + ((i * 13) % 4),
  delay: (i * 2.7) % 10,
  duration: 12 + ((i * 7) % 20),
  opacity: 0.15 + ((i * 0.21) % 0.4)
}))

/* ── SVG Icon Component ────────────────────────────────────── */
function Icon({ name, size = 18 }) {
  const c = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  if (name === 'bag') return <svg {...c}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
  if (name === 'arrow') return <svg {...c}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
  if (name === 'close') return <svg {...c}><path d="m18 6-12 12M6 6l12 12"/></svg>
  if (name === 'plus') return <svg {...c}><path d="M12 5v14M5 12h14"/></svg>
  if (name === 'minus') return <svg {...c}><path d="M5 12h14"/></svg>
  if (name === 'check') return <svg {...c}><path d="m4 12 5 5L20 6"/></svg>
  if (name === 'search') return <svg {...c}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
  if (name === 'heart') return <svg {...c}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
  if (name === 'heartFill') return <svg width={size} height={size} viewBox="0 0 24 24" fill="#ec4899" stroke="#ec4899" strokeWidth="1.6"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
  if (name === 'play') return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>
  if (name === 'shield') return <svg {...c}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  if (name === 'truck') return <svg {...c}><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
  if (name === 'soundOn') return <svg {...c}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
  if (name === 'soundOff') return <svg {...c}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
  if (name === 'rotate') return <svg {...c}><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
  return <svg {...c}><circle cx="12" cy="12" r="10"/></svg>
}

/* ── Main App Component ────────────────────────────────────── */
export default function App() {
  // Intro Screen States
  const [introDismissed, setIntroDismissed] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)

  // Navigation & Scroll States
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const searchInputRef = useRef(null)

  // 3D Tilt State for Hero
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [activeHotspot, setActiveHotspot] = useState(null)

  // Perspective preview state for product photography
  const [viewAngle, setViewAngle] = useState(0)
  const [interactiveShoe, setInteractiveShoe] = useState(products[0])

  // Colorway tracking for product cards
  const [cardColorIdx, setCardColorIdx] = useState({})

  // Modals & Drawers
  const [activeProduct, setActiveProduct] = useState(products[0])
  const [selectedColorIdx, setSelectedColorIdx] = useState(0)
  const [selectedSize, setSelectedSize] = useState('9')
  const [quantity, setQuantity] = useState(1)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState(null) // null | 'shipping' | 'confirmed'

  // Cart & Wishlist Data
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [couponCode, setCouponCode] = useState('BANGTAN10')
  const [couponApplied, setCouponApplied] = useState(false)
  const [toastNotice, setToastNotice] = useState('')

  // Checkout Form Inputs
  const [checkoutForm, setCheckoutForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  })

  // Let visitors enter the intro with the keyboard as well as the button.
  useEffect(() => {
    if (introDismissed) return undefined
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    const getIntroDialog = () => document.querySelector('.three-cyber-intro-screen')
    document.body.style.overflow = 'hidden'
    getIntroDialog()?.querySelector('.btn-cyber-enter')?.focus()
    const handleIntroKey = (event) => {
      if (event.key === 'Escape') {
        setIntroDismissed(true)
      } else if (event.key === 'Tab') {
        const dialog = getIntroDialog()
        if (!dialog) return
        const focusable = [...dialog.querySelectorAll('button:not(:disabled), a[href]')]
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (!first) return
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
    }
    window.addEventListener('keydown', handleIntroKey)
    return () => {
      window.removeEventListener('keydown', handleIntroKey)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus?.()
    }
  }, [introDismissed])

  useEffect(() => {
    const dialogSelector = sizeGuideOpen ? '.size-guide-modal-box' : videoModalOpen ? '.cyber-video-modal' : quickViewOpen ? '.quickview-cyber-modal' : cartOpen ? '.cart-drawer' : '.wishlist-drawer'
    const dialog = document.querySelector(dialogSelector)
    if (!dialog) return undefined
    const previousFocus = document.activeElement
    const focusable = () => [...dialog.querySelectorAll('button:not(:disabled), a[href], input, select, textarea')]
    focusable()[0]?.focus()
    const closeTopDialog = () => {
      if (sizeGuideOpen) setSizeGuideOpen(false)
      else if (videoModalOpen) setVideoModalOpen(false)
      else if (quickViewOpen) setQuickViewOpen(false)
      else if (cartOpen) { setCartOpen(false); setCheckoutStep(null) }
      else if (wishlistOpen) setWishlistOpen(false)
    }
    const handleDialogKey = (event) => {
      if (event.key === 'Escape') closeTopDialog()
      if (event.key === 'Tab') {
        const items = focusable()
        if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1)?.focus() }
        else if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0]?.focus() }
      }
    }
    window.addEventListener('keydown', handleDialogKey)
    return () => {
      window.removeEventListener('keydown', handleDialogKey)
      previousFocus?.focus?.()
    }
  }, [cartOpen, wishlistOpen, quickViewOpen, videoModalOpen, sizeGuideOpen, checkoutStep])

  // Sticky Navbar Scroll Observer
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll animations observer
  useEffect(() => {
    if (!introDismissed) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible')
      })
    }, { threshold: 0.1 })
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [introDismissed, activeCategory])

  // Flash toast message
  function notify(msg) {
    setToastNotice(msg)
    sound.click()
    setTimeout(() => setToastNotice(''), 3500)
  }

  // Audio mute toggle
  function toggleSound() {
    sound.enabled = !soundEnabled
    setSoundEnabled(!soundEnabled)
    if (!soundEnabled) sound.click()
  }

  // Cart operations
  function addToCart(product = activeProduct, size = selectedSize, colorObj = product.colors[selectedColorIdx], qty = quantity) {
    sound.success()
    setCart((prev) => {
      const match = prev.find((item) => item.id === product.id && item.size === size && item.colorName === colorObj.name)
      if (match) {
        return prev.map((item) => item === match ? { ...item, qty: item.qty + qty } : item)
      }
      return [...prev, { ...product, size, colorName: colorObj.name, qty, image: colorObj.img || product.image, imageFilter: colorObj.filter || 'none' }]
    })
    notify(`Added ${product.name} [Size US ${size}] to Bag!`)
  }

  function updateCartQty(id, size, colorName, delta) {
    sound.click()
    setCart((prev) => prev.map((item) => {
      if (item.id === id && item.size === size && item.colorName === colorName) {
        const nextQty = item.qty + delta
        return nextQty > 0 ? { ...item, qty: nextQty } : null
      }
      return item
    }).filter(Boolean))
  }

  function removeFromCart(id, size, colorName) {
    sound.click()
    setCart((prev) => prev.filter((item) => !(item.id === id && item.size === size && item.colorName === colorName)))
    notify('Item removed from Bag')
  }

  function toggleWishlist(id, name) {
    sound.click()
    setWishlist((prev) => {
      const exists = prev.includes(id)
      notify(exists ? `Removed ${name} from Wishlist` : `Added ${name} to Wishlist!`)
      return exists ? prev.filter((x) => x !== id) : [...prev, id]
    })
  }

  // Subtotal calculation
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart])
  const discountAmount = couponApplied ? Math.round(subtotal * 0.1) : 0
  const finalTotal = subtotal - discountAmount
  const totalItemCount = cart.reduce((sum, item) => sum + item.qty, 0)

  // Mouse tilt tracking on Hero shoe
  function handleShoePointerMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const xRatio = (e.clientX - rect.left) / rect.width - 0.5
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({
      x: yRatio * -18,
      y: xRatio * 22
    })
  }

  function resetShoeTilt() {
    setTilt({ x: 0, y: 0 })
    setActiveHotspot(null)
  }

  // Open Quick View Modal
  function handleOpenQuickView(prod) {
    sound.click()
    setActiveProduct(prod)
    const initialColorIdx = cardColorIdx[prod.id] || 0
    setSelectedColorIdx(initialColorIdx)
    setSelectedSize(sizes.find((s) => !prod.unavailableSizes.includes(s)) || '9')
    setQuantity(1)
    setQuickViewOpen(true)
  }

  // Filtered products list
  const filteredProducts = products.filter((prod) => {
    const curatedMatches = {
      'New Arrivals': () => prod.tag === 'NEW',
      'Best Sellers': () => prod.tag === 'BESTSELLER',
      'Limited Drops': () => prod.tag === 'LIMITED',
    }
    const matchesCategory = activeCategory === 'All'
      || curatedMatches[activeCategory]?.()
      || prod.category.toLowerCase() === activeCategory.toLowerCase()
    const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) || prod.category.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="bangtan-app">
      {/* ── PROFESSIONAL 3D WEBGL INTRO SCREEN ───────────────── */}
      {!introDismissed && (
        <Suspense fallback={(
          <div className="three-cyber-intro-screen" role="dialog" aria-modal="true" aria-label="Preparing the BANGTAN archive">
            <div className="intro-center-floating-ui intro-loading-shell">
              <span className="intro-sub-eyebrow">BANGTAN · SIGNATURE SERIES</span>
              <strong>Preparing the archive…</strong>
              <button type="button" className="btn-cyber-enter" onClick={() => setIntroDismissed(true)}>
                ENTER THE ARCHIVE <Icon name="arrow" size={16} />
              </button>
            </div>
          </div>
        )}>
          <ThreeIntro
            productImage="/shoes/hero-purple.webp"
            onEnter={() => {
              sound.click()
              setIntroDismissed(true)
            }}
            sound={sound}
          />
        </Suspense>
      )}

      {/* ── AMBIENT CYBER BACKGROUND ─────────────────────────── */}
      <div className="ambient-cyber-space">
        <div className="ambient-gradient-mesh" />
        <div className="particles-canvas">
          {particles.map((p) => (
            <div
              key={p.id}
              className="cyber-particle"
              style={{
                left: `${p.left}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                opacity: p.opacity
              }}
            />
          ))}
        </div>
      </div>

      {/* ── NAVBAR ───────────────────────────────────────────── */}
      <header className={`cyber-navbar ${scrolled ? 'navbar-glass-scrolled' : ''}`}>
        <div className="nav-container">
          <a href="#top" className="nav-brand" onClick={() => sound.click()}>
            <img src="/shoes/bangtan-brand-logo.png" alt="BANGTAN-SHOES" className="brand-logo-img" />
            <div className="brand-title-wrap">
              <span className="brand-name">BANGTAN-SHOES</span>
              <span className="brand-motto">STEP BEYOND ORDINARY</span>
            </div>
          </a>

          <nav className={`nav-menu ${menuOpen ? 'menu-active' : ''}`}>
            <a href="#top" onClick={() => { sound.hover(); setMenuOpen(false) }}>Home</a>
            <a href="#selector" onClick={() => { sound.hover(); setMenuOpen(false) }}>Selector</a>
            <a href="#collection" onClick={() => { sound.hover(); setMenuOpen(false) }}>Collection</a>
            <a href="#story" onClick={() => { sound.hover(); setMenuOpen(false) }}>About</a>
            <a href="#newsletter" onClick={() => { sound.hover(); setMenuOpen(false) }}>Contact</a>
          </nav>

          <div className="nav-actions-cluster">
            {/* Sound Mute/Unmute */}
            <button
              className="nav-icon-btn sound-toggle"
              aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
              title={soundEnabled ? 'Sound On' : 'Sound Muted'}
              onClick={toggleSound}
            >
              <Icon name={soundEnabled ? 'soundOn' : 'soundOff'} size={17} />
            </button>

            {/* Search Input Button */}
            <button
              className="nav-icon-btn"
              aria-label="Search Collection"
              onClick={() => {
                sound.click()
                document.querySelector('#collection')?.scrollIntoView({ behavior: 'smooth' })
                window.setTimeout(() => searchInputRef.current?.focus({ preventScroll: true }), 350)
              }}
            >
              <Icon name="search" size={18} />
            </button>

            {/* Wishlist Button with Badge */}
            <button
              className="nav-icon-btn"
              aria-label={`Wishlist, ${wishlist.length} saved`}
              onClick={() => {
                sound.click()
                setWishlistOpen(true)
              }}
            >
              <Icon name="heart" size={18} />
              {wishlist.length > 0 && <span className="action-badge pulse">{wishlist.length}</span>}
            </button>

            {/* Cart Button with Count */}
            <button
              className="nav-icon-btn cart-trigger-btn"
              aria-label={`Cart with ${totalItemCount} items`}
              onClick={() => {
                sound.click()
                setCartOpen(true)
              }}
            >
              <Icon name="bag" size={18} />
              {totalItemCount > 0 && <span className="action-badge violet">{totalItemCount}</span>}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              className="nav-icon-btn mobile-toggle"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className={`hamburger-bar ${menuOpen ? 'bar-1' : ''}`} />
              <span className={`hamburger-bar ${menuOpen ? 'bar-2' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN BODY ────────────────────────────────────────── */}
      <main className="main-content">
        {/* ── HERO SECTION ───────────────────────────────────── */}
        <section className="cyber-hero" id="top">
          <div className="hero-grid-container">
            {/* Left Copy Column */}
            <div className="hero-copy-column">
              <div className="hero-pill-badge">
                <span className="pill-dot" /> THE NEXT GENERATION
              </div>

              <h1 className="hero-headline">
                STEP INTO<br />
                <span className="neon-text-glow">THE FUTURE</span>
              </h1>

              <p className="hero-subtext">
                Premium sneakers designed for dreamers, creators and go-getters. Experience the perfect blend of style, comfort and performance.
              </p>

              <div className="hero-button-cluster">
                <a
                  href="#collection"
                  className="btn-cyber-primary"
                  onClick={() => sound.click()}
                >
                  SHOP NOW <Icon name="arrow" size={15} />
                </a>

                <button
                  type="button"
                  className="btn-cyber-glass"
                  onClick={() => {
                    sound.click()
                    setVideoModalOpen(true)
                  }}
                >
                  <span className="play-circle">
                    <Icon name="play" size={10} />
                  </span>
                  WATCH VIDEO
                </button>
              </div>

              {/* Value Props Row */}
              <div className="hero-trust-metrics">
                <div className="metric-item">
                  <Icon name="shield" size={14} />
                  <span>Premium Quality</span>
                </div>
                <div className="metric-item">
                  <Icon name="truck" size={14} />
                  <span>Fast Delivery</span>
                </div>
                <div className="metric-item">
                  <Icon name="check" size={14} />
                  <span>Demo checkout</span>
                </div>
              </div>
            </div>

            {/* Right Visual 3D Showcase Column */}
            <div
              className="hero-3d-visual-column"
              onPointerMove={handleShoePointerMove}
              onPointerLeave={resetShoeTilt}
            >
              {/* Neon Glow Rings & Nebula */}
              <div className="vortex-center-glow" />
              <div className="orbit-disc ring-outer" />
              <div className="orbit-disc ring-inner" />
              <div className="ground-reflection-pedestal" />

              {/* Featured campaign shoe */}
              <div
                className="hero-floating-sneaker-container"
                style={{ transform: `perspective(1000px) rotateX(${5 + tilt.x}deg) rotateY(${tilt.y}deg) translateY(-8px)` }}
              >
                <img
                  src="/shoes/hero-purple.webp"
                  alt="BANGTAN QUANTUM ZERO flagship sneaker"
                  className="hero-sneaker-img"
                  fetchPriority="high"
                />
                <div className="sneaker-specular-sheen" />
              </div>

              {/* Interactive Hotspot Feature Pins */}
              <button
                type="button"
                aria-label="Lightweight design details"
                aria-expanded={activeHotspot === 'lightweight'}
                className={`hotspot-pin pin-lightweight ${activeHotspot === 'lightweight' ? 'active' : ''}`}
                onMouseEnter={() => { sound.hover(); setActiveHotspot('lightweight') }}
                onClick={() => setActiveHotspot(activeHotspot === 'lightweight' ? null : 'lightweight')}
              >
                <span className="hotspot-pulse" />
                <span className="hotspot-core" />
                <div className="hotspot-label-card">
                  <strong>Lightweight Design</strong>
                  <p>Aerospace nitrogen weave weighing under 280g.</p>
                </div>
              </button>

              <button
                type="button"
                aria-label="Breathable mesh details"
                aria-expanded={activeHotspot === 'breathable'}
                className={`hotspot-pin pin-breathable ${activeHotspot === 'breathable' ? 'active' : ''}`}
                onMouseEnter={() => { sound.hover(); setActiveHotspot('breathable') }}
                onClick={() => setActiveHotspot(activeHotspot === 'breathable' ? null : 'breathable')}
              >
                <span className="hotspot-pulse" />
                <span className="hotspot-core" />
                <div className="hotspot-label-card">
                  <strong>Breathable Mesh</strong>
                  <p>Hex-cell micro vents for constant thermal ventilation.</p>
                </div>
              </button>

              <button
                type="button"
                aria-label="Adaptive cushioning details"
                aria-expanded={activeHotspot === 'cushion'}
                className={`hotspot-pin pin-cushion ${activeHotspot === 'cushion' ? 'active' : ''}`}
                onMouseEnter={() => { sound.hover(); setActiveHotspot('cushion') }}
                onClick={() => setActiveHotspot(activeHotspot === 'cushion' ? null : 'cushion')}
              >
                <span className="hotspot-pulse" />
                <span className="hotspot-core" />
                <div className="hotspot-label-card">
                  <strong>Adaptive Cushioning</strong>
                  <p>Multi-density kinetic foam absorbs 94% ground impact.</p>
                </div>
              </button>

              {/* Season Badge & Scroll Hint */}
              <div className="hero-season-tag">
                <span>NEW SEASON</span>
                <strong>2026</strong>
              </div>

              <div className="hero-scroll-cue">
                <div className="mouse-shell">
                  <span className="mouse-wheel-dot" />
                </div>
                <span>SCROLL DOWN</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── ARCHIVE SELECTOR ───────────────────────────────── */}
        <section className="archive-selector-section reveal-on-scroll" id="selector" aria-labelledby="selector-title">
          <div className="archive-selector-heading">
            <div>
              <span className="section-tag-eyebrow">01 / THE ROTATION SELECTOR</span>
              <h2 id="selector-title">FIND YOUR<br /><span>PERFECT PAIR.</span></h2>
            </div>
            <p>Three expressions of the BANGTAN silhouette.<br />Choose a direction to explore the archive.</p>
          </div>
          <div className="archive-selector-grid">
            {archiveSelections.map((selection, index) => {
              const pair = products.find((product) => product.category === selection.category)
              if (!pair) return null
              return (
                <button
                  type="button"
                  className="archive-selector-card"
                  key={selection.category}
                  onClick={() => {
                    setActiveCategory(selection.category)
                    document.querySelector('#collection')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  aria-label={`Explore ${selection.category} sneakers`}
                >
                  <span className="selector-card-index">0{index + 1} / {selection.category.toUpperCase()}</span>
                  <span className="selector-card-image"><img src={pair.image} alt="" loading="lazy" /></span>
                  <span className="selector-card-bottom">
                    <span><strong>{selection.label}</strong><small>{selection.note}</small></span>
                    <span className="selector-card-arrow" aria-hidden="true">↗</span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* ── FEATURED SNEAKERS COLLECTION ────────────────────── */}
        <section className="section-collection" id="collection">
          <div className="section-header reveal-on-scroll">
            <span className="section-tag-eyebrow">OUR COLLECTION</span>
            <h2>FEATURED SNEAKERS</h2>
            <p className="section-sub-desc">Explore our latest collection of premium sneakers.</p>
          </div>

          {/* Category Tabs & Search Bar */}
          <div className="collection-control-bar reveal-on-scroll">
            <div className="category-pill-group">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`cat-pill-btn ${activeCategory === cat ? 'active' : ''}`}
                  aria-pressed={activeCategory === cat}
                  onClick={() => {
                    sound.click()
                    setActiveCategory(cat)
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="collection-search-wrap">
              <Icon name="search" size={15} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search sneakers, models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-search" aria-label="Clear search" onClick={() => setSearchTerm('')}>
                  <Icon name="close" size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Product Cards Grid */}
              <div className="products-cyber-grid">
            {filteredProducts.map((prod) => {
              const isWishlisted = wishlist.includes(prod.id)
              const currentColorIdx = cardColorIdx[prod.id] || 0
              const activeColorObj = prod.colors[currentColorIdx] || prod.colors[0]
              const currentImage = activeColorObj?.img || prod.image

              return (
                <div className="product-cyber-card reveal-on-scroll" key={prod.id}>
                  {/* Card Image Area */}
                  <div className="card-media-zone" style={{ backgroundColor: prod.mediaBackground }}>
                    <button
                      type="button"
                      className="card-media-open-btn"
                      aria-label={`Quick view ${prod.name}`}
                      onClick={() => handleOpenQuickView(prod)}
                    />
                    <span
                      className="card-status-badge"
                      style={{ background: prod.tagColor }}
                    >
                      {prod.tag}
                    </span>

                    <button
                      type="button"
                      className={`card-wishlist-toggle ${isWishlisted ? 'in-wishlist' : ''}`}
                      aria-label="Add to Wishlist"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleWishlist(prod.id, prod.name)
                      }}
                    >
                      <Icon name={isWishlisted ? 'heartFill' : 'heart'} size={15} />
                    </button>

                    <div className="card-pedestal-light" />
                    <img
                      key={currentImage}
                      src={currentImage}
                      alt={`${prod.name} - ${activeColorObj.name}`}
                      loading="lazy"
                      className="card-shoe-img"
                      style={{ filter: activeColorObj.filter, width: `${prod.imageScale}%`, height: `${prod.imageScale}%` }}
                    />

                    <button
                      type="button"
                      className="card-quick-hover-cue"
                      aria-label={`Quick view ${prod.name}`}
                      onClick={() => handleOpenQuickView(prod)}
                    >
                      <span>QUICK VIEW</span>
                    </button>
                  </div>

                  {/* Card Details Area */}
                  <div className="card-info-zone">
                    <div className="card-brand-badge">{prod.brand || 'BANGTAN-SHOES'}</div>
                    <h3 className="card-product-title">{prod.name}</h3>
                    <div className="card-category-rating">
                      <span className="card-cat-name">{prod.category}</span>
                      <span className="card-rating-badge">★ {prod.rating}</span>
                    </div>

                    <div className="card-pricing-row">
                      <span className="current-price">{formatPrice(prod.price)}</span>
                      {prod.originalPrice && (
                        <span className="original-price">{formatPrice(prod.originalPrice)}</span>
                      )}
                      {prod.discount && (
                        <span className="discount-pill">{prod.discount}</span>
                      )}
                    </div>

                    {/* Interactive Color Swatch Selectors */}
                    <div className="card-swatches-row">
                      <div className="swatches-buttons-group">
                        {prod.colors.map((col, idx) => {
                          const isActive = currentColorIdx === idx
                          return (
                            <button
                              key={idx}
                              type="button"
                              className={`swatch-indicator-btn ${isActive ? 'swatch-active' : ''}`}
                              style={{ backgroundColor: col.hex }}
                              title={`${col.name} (Click to change color)`}
                              aria-label={`Select ${col.name} color`}
                              aria-pressed={isActive}
                              onClick={(e) => {
                                e.stopPropagation()
                                sound.click()
                                setCardColorIdx((prev) => ({ ...prev, [prod.id]: idx }))
                              }}
                            >
                              {isActive && <span className="swatch-check-dot" />}
                            </button>
                          )
                        })}
                      </div>
                      <span className="swatch-color-name" title={activeColorObj.name}>
                        {activeColorObj.name}
                      </span>
                    </div>

                    {/* Dual Action Buttons: Add to Cart & Quick View */}
                    <div className="card-actions-row">
                      <button
                        type="button"
                        className="btn-card-add-cart"
                        onClick={(e) => {
                          e.stopPropagation()
                          const availableSize = sizes.find((size) => !prod.unavailableSizes.includes(size)) || '9'
                          addToCart(prod, availableSize, activeColorObj, 1)
                        }}
                      >
                        <Icon name="bag" size={13} /> Add to Cart
                      </button>
                      <button
                        type="button"
                        className="btn-card-quick-view"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenQuickView(prod)
                        }}
                        aria-label={`Quick view ${prod.name}`}
                      >
                        Quick View
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="empty-search-state">
              <p>No pairs match &ldquo;{searchTerm}&rdquo;. Try another term or reset filters.</p>
              <button
                className="btn-cyber-primary"
                onClick={() => {
                  setSearchTerm('')
                  setActiveCategory('All')
                }}
              >
                Reset Filter
              </button>
            </div>
          )}
        </section>

        {/* ── INTERACTIVE PRODUCT PHOTOGRAPHY PREVIEW ────────── */}
        <section className="section-3d-experience reveal-on-scroll" id="view3d">
          <div className="experience-wrapper-box">
            {/* Perspective stage built from campaign photography */}
            <div className="v3d-canvas-zone">
              <div className="v3d-360-badge">
                <Icon name="rotate" size={14} /> PERSPECTIVE PREVIEW
              </div>

              <div className="v3d-shoe-rotator-stage">
                <img
                  src={interactiveShoe.image}
                  alt={interactiveShoe.name}
                  className="v3d-shoe-image"
                  style={{
                    transform: `perspective(900px) rotateY(${viewAngle}deg) rotateX(3deg)`
                  }}
                />
                <div className="v3d-pedestal-glow" />
              </div>

              {/* Small perspective adjustment for the product photograph */}
              <div className="v3d-controls-strip">
                <button className="btn-spin-toggle" onClick={() => setViewAngle(0)}>Reset view</button>
                <input
                  type="range"
                  min="-16"
                  max="16"
                  value={viewAngle}
                  onChange={(e) => setViewAngle(Number(e.target.value))}
                  className="angle-slider"
                  aria-label="Adjust product photo perspective"
                />
                <span className="angle-readout">{viewAngle}°</span>
              </div>
            </div>

            {/* Right Information & Feature Checklist */}
            <div className="v3d-details-zone">
              <span className="section-tag-eyebrow">EXPERIENCE THE DIFFERENCE</span>
              <h2>INTERACTIVE PRODUCT PREVIEW</h2>
              <p className="v3d-statement">
                Explore the campaign photography with a subtle perspective control. Product imagery is presented as photography, not a full 3D model.
              </p>

              <ul className="v3d-checklist">
                <li>
                  <div className="check-icon-circle"><Icon name="check" size={14} /></div>
                  <div>
                    <strong>Perspective control</strong>
                    <span>Adjust the image angle to bring the silhouette into focus.</span>
                  </div>
                </li>
                <li>
                  <div className="check-icon-circle"><Icon name="check" size={14} /></div>
                  <div>
                    <strong>Color variants</strong>
                    <span>Switch between available colorways in the product details.</span>
                  </div>
                </li>
                <li>
                  <div className="check-icon-circle"><Icon name="check" size={14} /></div>
                  <div>
                    <strong>Campaign imagery</strong>
                    <span>Studio lighting brings out each pair’s shape and material.</span>
                  </div>
                </li>
              </ul>

              <div className="v3d-cta-cluster">
                <button
                  type="button"
                  className="btn-cyber-primary"
                  onClick={() => handleOpenQuickView(interactiveShoe)}
                >
                  EXPLORE PRODUCT DETAILS ➔
                </button>

                {/* Thumbnail switcher */}
                <div className="v3d-thumbnail-switcher">
                  {products.slice(0, 4).map((item) => (
                    <button
                      key={item.id}
                      className={`thumb-btn ${interactiveShoe.id === item.id ? 'active' : ''}`}
                      onClick={() => {
                        sound.click()
                        setInteractiveShoe(item)
                      }}
                      title={item.name}
                    >
                      <img src={item.image} alt={item.name} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TECHNOLOGY & INNOVATION ──────────────────────────── */}
        <section className="section-technology" id="tech">
          <div className="section-header reveal-on-scroll">
            <span className="section-tag-eyebrow">OUR TECHNOLOGY</span>
            <h2>BUILT FOR BETTER PERFORMANCE</h2>
            <p className="section-sub-desc">
              Every curve, thread, and compound is engineered to give you an unfair advantage.
            </p>
          </div>

          <div className="tech-grid reveal-on-scroll">
            <div className="tech-card">
              <div className="tech-icon">
                <Icon name="shield" size={22} />
              </div>
              <h3>ZERO-G CUSHION</h3>
              <p>
                Pressurized nitrogen cells embedded along the heel cradle provide instant shock absorption and effortless rebound — keeping you weightless on every stride.
              </p>
            </div>

            <div className="tech-card">
              <div className="tech-icon">
                <Icon name="star" size={22} />
              </div>
              <h3>FLEX WEAVE UPPER</h3>
              <p>
                Interlocking multi-directional micro-strands stretch with the biomechanics of your foot while retaining structural lock-in and breathability.
              </p>
            </div>

            <div className="tech-card">
              <div className="tech-icon">
                <Icon name="lightning" size={22} />
              </div>
              <h3>GRIP TECH OUTSOLE</h3>
              <p>
                Biomorphic razor-siped compound outsole delivers tenacious traction on wet metropolitan stone, steel ramps, and polished concrete.
              </p>
            </div>
          </div>
        </section>

        {/* ── BRAND STORY ──────────────────────────────────────── */}
        <section className="section-story reveal-on-scroll" id="story">
          <div className="story-ambient-card">
            <div className="story-media-side">
              <img
                src="/shoes/hero-purple.webp"
                alt="BANGTAN signature violet high-top sneaker"
                loading="lazy"
              />
              <div className="story-vignette" />
              <div className="story-stamp">BANGTAN ARCHIVE // 2026</div>
            </div>

            <div className="story-content-side">
              <span className="section-tag-eyebrow">OUR STORY</span>
              <h2>BUILT TO MOVE<br /><span className="neon-text-glow">DIFFERENT.</span></h2>
              <p>
                BANGTAN was born from a simple belief: every step should take you closer to your dreams. We craft premium sneakers for the bold, the creative, and the unstoppable.
              </p>
              <p>
                Merging Japanese cyber-minimalism with high-rebound athletic engineering, our silhouettes move confidently from day to night.
              </p>
              <a
                href="#collection"
                className="btn-cyber-primary"
                onClick={() => sound.click()}
              >
                EXPLORE THE ARCHIVE <Icon name="arrow" size={15} />
              </a>
            </div>
          </div>
        </section>

        {/* ── CUSTOMER REVIEWS ─────────────────────────────────── */}
        <section className="section-reviews reveal-on-scroll" id="reviews">
          <div className="section-header">
            <span className="section-tag-eyebrow">CUSTOMER REVIEWS</span>
            <h2>WHAT OUR CUSTOMERS SAY</h2>
            <p className="section-sub-desc">Sample reviews shown for this storefront preview.</p>
          </div>

          <div className="reviews-composite-grid">
            {/* Left Big Rating Box */}
            <div className="reviews-rating-summary-card">
              <div className="score-display">
                <span className="big-rating-number">4.7</span>
                <span className="score-denom">/ 5</span>
              </div>
              <div className="star-rating-row">★★★★★</div>
              <p className="verified-count">Illustrative rating · demo content</p>

              {/* Progress bars */}
              <div className="star-breakdown-ladder">
                {[
                  { star: 5, pct: 78 },
                  { star: 4, pct: 14 },
                  { star: 3, pct: 5 },
                  { star: 2, pct: 2 },
                  { star: 1, pct: 1 }
                ].map((item) => (
                  <div className="ladder-row" key={item.star}>
                    <span className="ladder-star-label">{item.star} ★</span>
                    <div className="ladder-bar-bg">
                      <div className="ladder-bar-fill" style={{ width: `${item.pct}%` }} />
                    </div>
                    <span className="ladder-pct-label">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Testimonial Cards */}
            <div className="reviews-cards-stack">
              <div className="user-testimonial-card">
                <div className="testimonial-header">
                  <div className="user-avatar-circle">A</div>
                  <div>
                    <strong>Ariya S.</strong>
                    <span className="verified-badge">Sample review · 12 Oct 2026</span>
                  </div>
                  <div className="testimonial-stars">★★★★★</div>
                </div>
                <p className="testimonial-quote">
                  &ldquo;Amazing quality! The comfort is next level and the design is truly worth it. The purple ambient glow gets attention everywhere I go!&rdquo;
                </p>
                <div className="bought-item-pill">
                  <span>Shoe:</span> BANGTAN SHADOW [Cyber Violet]
                </div>
              </div>

              <div className="user-testimonial-card">
                <div className="testimonial-header">
                  <div className="user-avatar-circle">M</div>
                  <div>
                    <strong>Marcus B.</strong>
                    <span className="verified-badge">Sample review · 5 Oct 2026</span>
                  </div>
                  <div className="testimonial-stars">★★★★★</div>
                </div>
                <p className="testimonial-quote">
                  &ldquo;Super stylish and lightweight. Perfect for everyday wear and the responsive cushioning saves my feet during 10-hour shoot days.&rdquo;
                </p>
                <div className="bought-item-pill">
                  <span>Shoe:</span> BANGTAN GALAXY [Electric Cobalt]
                </div>
              </div>

              <div className="user-testimonial-card">
                <div className="testimonial-header">
                  <div className="user-avatar-circle">S</div>
                  <div>
                    <strong>Sneha K.</strong>
                    <span className="verified-badge">Sample review · 28 Sep 2026</span>
                  </div>
                  <div className="testimonial-stars">★★★★★</div>
                </div>
                <p className="testimonial-quote">
                  &ldquo;My favourite footwear brand now! The fit is true to size and delivery took only 2 days. The unboxing experience felt futuristic.&rdquo;
                </p>
                <div className="bought-item-pill">
                  <span>Shoe:</span> BANGTAN ECLIPSE [Stealth Eclipse]
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── NEWSLETTER ───────────────────────────────────────── */}
        <section className="section-newsletter reveal-on-scroll" id="newsletter">
          <div className="newsletter-glow-box">
            <span className="section-tag-eyebrow">NEWSLETTER</span>
            <h2>STEP INTO WHAT&rsquo;S NEXT.</h2>
            <p className="newsletter-sub">
              Get early access to high-velocity drops, private archival releases, and exclusive member discounts.
            </p>
            <form
              className="newsletter-form-inline"
              onSubmit={(e) => {
                e.preventDefault()
                sound.success()
                notify('Newsletter preview only — your email was not subscribed.')
                e.currentTarget.reset()
              }}
            >
              <input
                type="email"
                placeholder="Enter your cyber email address..."
                required
              />
              <button type="submit" className="btn-cyber-primary">
                SUBSCRIBE ➔
              </button>
            </form>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────── */}
        <footer className="cyber-footer">
          <div className="footer-top-columns">
            <div className="footer-brand-col">
              <a href="#top" className="footer-brand-logo">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8Z" fill="#a855f7" stroke="#c084fc" strokeWidth="1.2"/>
                </svg>
                <span>BANGTAN</span>
              </a>
              <p className="footer-brand-desc">
                Step into a better tomorrow.<br />
                Engineered for creators, nocturnal runners, and style visionaries.
              </p>
              <div className="footer-social-links">
                <span title="X / Twitter">𝕏</span>
                <span title="Instagram">IG</span>
                <span title="TikTok">TK</span>
                <span title="Discord">DC</span>
              </div>
            </div>

            <div className="footer-nav-col">
              <h4>Shop</h4>
              <a href="#collection">All Products</a>
              <a href="#collection">New Arrivals</a>
              <a href="#collection">Best Sellers</a>
              <a href="#collection">Limited Drops</a>
            </div>

            <div className="footer-nav-col">
              <h4>Support</h4>
              <a href="#collection" onClick={() => setSizeGuideOpen(true)}>Size Guide</a>
              <a href="#collection" onClick={() => notify('Shipping: Global Express (2-4 business days)')}>Shipping & Delivery</a>
              <a href="#collection" onClick={() => notify('30-Day Hassle-Free Returns Guaranteed')}>Return Policy</a>
              <a href="mailto:support@bangtan.studio">Contact Support</a>
            </div>

            <div className="footer-nav-col">
              <h4>About</h4>
              <a href="#story">Our Story</a>
              <a href="#tech">Technology</a>
              <a href="#top" onClick={() => setIntroDismissed(false)}>Replay Bangtan Intro</a>
              <a href="#reviews">Customer Reviews</a>
            </div>

            <div className="footer-status-col">
              <h4>Archive Status</h4>
              <div className="status-pill-glow">
                <span className="live-dot" /> BANGTAN-SHOES ONLINE
              </div>
              <p className="status-note">
                Storefront preview · payments are not processed.
              </p>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <span>© 2026 BANGTAN FOOTWEAR ARCHIVE. ALL RIGHTS RESERVED.</span>
            <div className="footer-legal-links">
              <button type="button" onClick={() => notify('This preview does not send newsletter or checkout details to a server.')}>Privacy</button>
              <span>·</span>
              <button type="button" onClick={() => notify('Prices and shipping details are sample storefront content.')}>Terms</button>
              <span>·</span>
              <button type="button" onClick={() => notify('No payment information is collected or processed in this demo.')}>Security</button>
            </div>
            <button
              className="back-to-top-btn"
              onClick={() => {
                sound.click()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              aria-label="Back to top"
            >
              ↑
            </button>
          </div>
        </footer>
      </main>

      {/* ── FLOATING BACK TO TOP BUTTON ──────────────────────── */}
      <button
        className={`floating-back-to-top ${scrolled ? 'visible' : ''}`}
        onClick={() => {
          sound.click()
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        aria-label="Back to top"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </button>

      {/* ── TOAST NOTIFICATION ───────────────────────────────── */}
      {toastNotice && (
        <div className="cyber-toast" role="status">
          <Icon name="check" size={16} />
          <span>{toastNotice}</span>
          <button onClick={() => setToastNotice('')} aria-label="Dismiss">
            <Icon name="close" size={14} />
          </button>
        </div>
      )}

      {/* ── QUICK VIEW / PRODUCT DETAILS MODAL ───────────────── */}
      {quickViewOpen && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setQuickViewOpen(false)
          }}
        >
          <div className="quickview-cyber-modal" role="dialog" aria-modal="true" aria-label={`${activeProduct.name} product details`}>
            <button
              className="modal-close-icon"
              onClick={() => setQuickViewOpen(false)}
              aria-label="Close modal"
            >
              <Icon name="close" size={18} />
            </button>

            {/* Left Image & Angle Thumbnails */}
            <div className="modal-left-media">
              <div className="modal-main-image-wrap">
                <img
                  src={activeProduct.colors[selectedColorIdx]?.img || activeProduct.image}
                  alt={`${activeProduct.name} ${activeProduct.colors[selectedColorIdx]?.name || ''}`}
                  className="modal-featured-shoe"
                  style={{ filter: activeProduct.colors[selectedColorIdx]?.filter || 'none' }}
                />
                <div className="modal-pedestal-light" />
                <span className="modal-tag-chip" style={{ background: activeProduct.tagColor }}>
                  {activeProduct.tag}
                </span>
              </div>

              {/* Color thumbnails */}
              <div className="modal-colors-strip">
                {activeProduct.colors.map((cObj, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`modal-color-thumb-btn ${selectedColorIdx === i ? 'active' : ''}`}
                    onClick={() => {
                      sound.click()
                      setSelectedColorIdx(i)
                      setCardColorIdx((prev) => ({ ...prev, [activeProduct.id]: i }))
                    }}
                  >
                    <span className="swatch-bubble" style={{ background: cObj.hex }} />
                    <span className="swatch-name-label">{cObj.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Details & Configuration */}
            <div className="modal-right-details">
              <span className="modal-category-eyebrow">{activeProduct.category}</span>
              <h2 className="modal-shoe-title">{activeProduct.name}</h2>

              <div className="modal-rating-row">
                <span className="rating-stars">★★★★★</span>
                <span className="rating-num">{activeProduct.rating} ({activeProduct.reviews} sample reviews)</span>
              </div>

              <div className="modal-pricing-box">
                <span className="modal-current-price">{formatPrice(activeProduct.price)}</span>
                {activeProduct.originalPrice && (
                  <span className="modal-orig-price">{formatPrice(activeProduct.originalPrice)}</span>
                )}
                {activeProduct.discount && (
                  <span className="modal-discount-pill">{activeProduct.discount}</span>
                )}
              </div>

              <p className="modal-description">{activeProduct.description}</p>

              {/* Size Selector */}
              <div className="modal-size-block">
                <div className="size-label-row">
                  <span>SELECT SIZE (US MEN)</span>
                  <button
                    className="size-guide-link"
                    onClick={() => setSizeGuideOpen(true)}
                  >
                    Size Guide ↗
                  </button>
                </div>
                <div className="sizes-grid-selector">
                  {sizes.map((s) => {
                    const unavailable = activeProduct.unavailableSizes.includes(s)
                    return (
                      <button
                        key={s}
                        disabled={unavailable}
                        className={`size-pill-btn ${selectedSize === s ? 'selected' : ''}`}
                        onClick={() => {
                          sound.click()
                          setSelectedSize(s)
                        }}
                      >
                        {s}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Quantity Stepper & Actions */}
              <div className="modal-actions-tray">
                <div className="quantity-stepper">
                  <button
                    disabled={quantity <= 1}
                    onClick={() => {
                      sound.click()
                      setQuantity(Math.max(1, quantity - 1))
                    }}
                  >
                    <Icon name="minus" size={13} />
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => {
                      sound.click()
                      setQuantity(quantity + 1)
                    }}
                  >
                    <Icon name="plus" size={13} />
                  </button>
                </div>

                <button
                  type="button"
                  className="btn-cyber-primary modal-cart-btn"
                  onClick={() => {
                    addToCart(activeProduct, selectedSize, activeProduct.colors[selectedColorIdx], quantity)
                    setQuickViewOpen(false)
                  }}
                >
                  ADD TO CART
                </button>

                <button
                  type="button"
                  className="btn-cyber-glass modal-buy-btn"
                  onClick={() => {
                    addToCart(activeProduct, selectedSize, activeProduct.colors[selectedColorIdx], quantity)
                    setQuickViewOpen(false)
                    setCartOpen(true)
                    setCheckoutStep('shipping')
                  }}
                >
                  BUY NOW
                </button>
              </div>

              {/* Extra Accordions Info */}
              <div className="modal-extra-meta">
                <div className="meta-line">
                  <Icon name="truck" size={14} />
                  <span>Complimentary express delivery (2-4 business days).</span>
                </div>
                <div className="meta-line">
                  <Icon name="shield" size={14} />
                  <span>30-Day risk-free return trial with full refund.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CART DRAWER WITH PROMO CODE & CHECKOUT ────────────── */}
      {cartOpen && (
        <div
          className="drawer-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setCartOpen(false)
              setCheckoutStep(null)
            }
          }}
        >
          <aside className="cyber-drawer cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping cart">
            <div className="drawer-header-row">
              <h3>YOUR CART <span>({totalItemCount})</span></h3>
              <button
                className="drawer-close-btn"
                onClick={() => {
                  setCartOpen(false)
                  setCheckoutStep(null)
                }}
                aria-label="Close cart"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            {/* View 1: Order Confirmed Screen */}
            {checkoutStep === 'confirmed' ? (
              <div className="drawer-confirmed-state">
                <div className="confirmed-check-circle">
                  <Icon name="check" size={32} />
                </div>
                <h2>DEMO CHECKOUT COMPLETE</h2>
                <p>Your selection is saved in this storefront preview. No order was submitted and no payment was processed.</p>

                <div className="order-receipt-summary">
                  <div className="receipt-row">
                    <span>Preview reference</span>
                    <strong>#BANGTAN-DEMO-01</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Recipient</span>
                    <strong>{checkoutForm.fullName}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Destination</span>
                    <strong>{checkoutForm.address}, {checkoutForm.city}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Demo total</span>
                    <strong className="neon-value">{formatPrice(finalTotal)}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-cyber-primary full-width"
                  onClick={() => {
                    sound.success()
                    setCart([])
                    setCheckoutStep(null)
                    setCartOpen(false)
                  }}
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            ) : checkoutStep === 'shipping' ? (
              /* View 2: Multi-step Shipping Checkout Form */
              <div className="drawer-checkout-flow">
                <div className="checkout-step-indicator">
                  <span className="step-tag active">1. DETAILS</span>
                  <span className="step-tag">2. REVIEW</span>
                  <span className="step-tag">3. DEMO</span>
                </div>

                <form
                  className="checkout-form-body"
                  onSubmit={(e) => {
                    e.preventDefault()
                    sound.success()
                    setCheckoutStep('confirmed')
                  }}
                >
                  <h4>Demo delivery details</h4>
                  <p className="checkout-demo-note">This is a storefront demo. Your details stay in this page preview; no order will be sent and no payment will be collected.</p>

                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      required
                      value={checkoutForm.fullName}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, fullName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      required
                      value={checkoutForm.email}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={checkoutForm.phone}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Delivery Address *</label>
                    <input
                      type="text"
                      required
                      value={checkoutForm.address}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                    />
                  </div>

                  <div className="form-row-dual">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        required
                        value={checkoutForm.city}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Postal Code *</label>
                      <input
                        type="text"
                        required
                        value={checkoutForm.zip}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, zip: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Summary row */}
                  <div className="checkout-mini-summary">
                    <div className="c-row">
                      <span>Total Due ({totalItemCount} items):</span>
                      <strong>{formatPrice(finalTotal)}</strong>
                    </div>
                  </div>

                  <button type="submit" className="btn-cyber-primary full-width">
                    COMPLETE DEMO CHECKOUT · {formatPrice(finalTotal)}
                  </button>

                  <button
                    type="button"
                    className="btn-back-link"
                    onClick={() => setCheckoutStep(null)}
                  >
                    ← Back to Cart Overview
                  </button>
                </form>
              </div>
            ) : (
              /* View 3: Normal Cart Items & Promo Code */
              <>
                {cart.length === 0 ? (
                  <div className="drawer-empty-state">
                    <Icon name="bag" size={48} />
                    <h4>Your Cart is Empty</h4>
                    <p>Experience the latest 2026 archive footwear collection.</p>
                    <button
                      type="button"
                      className="btn-cyber-primary"
                      onClick={() => setCartOpen(false)}
                    >
                      Browse Sneakers
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="drawer-scrollable-items">
                      {cart.map((item, idx) => (
                        <div className="cart-item-card" key={`${item.id}-${item.size}-${item.colorName}-${idx}`}>
                          <img src={item.image} alt={`${item.name} ${item.colorName}`} className="cart-item-thumbnail" style={{ filter: item.imageFilter || 'none' }} />

                          <div className="cart-item-details">
                            <strong className="cart-item-name">{item.name}</strong>
                            <span className="cart-item-meta">
                              {item.colorName} · US {item.size}
                            </span>
                            <span className="cart-item-price">{formatPrice(item.price * item.qty)}</span>

                            <div className="cart-qty-pill">
                              <button
                                onClick={() => updateCartQty(item.id, item.size, item.colorName, -1)}
                                aria-label="Decrease quantity"
                              >
                                <Icon name="minus" size={11} />
                              </button>
                              <span>{item.qty}</span>
                              <button
                                onClick={() => updateCartQty(item.id, item.size, item.colorName, 1)}
                                aria-label="Increase quantity"
                              >
                                <Icon name="plus" size={11} />
                              </button>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="cart-remove-item"
                            onClick={() => removeFromCart(item.id, item.size, item.colorName)}
                            title="Remove from Cart"
                          >
                            <Icon name="close" size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Promo Code Input */}
                    <div className="drawer-promo-box">
                      <span className="promo-label">Have a promo code?</span>
                      <div className="promo-input-row">
                        <input
                          type="text"
                          placeholder="e.g. BANGTAN10"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn-apply-coupon"
                          onClick={() => {
                            if (couponCode.trim().toUpperCase() === 'BANGTAN10') {
                              setCouponApplied(true)
                              sound.success()
                              notify('Coupon applied! 10% discount activated.')
                            } else {
                              sound.click()
                              notify('Invalid coupon code. Try "BANGTAN10".')
                            }
                          }}
                        >
                          Apply
                        </button>
                      </div>
                      {couponApplied && (
                        <span className="coupon-active-feedback">
                          ✓ Coupon &ldquo;BANGTAN10&rdquo; active (10% OFF)
                        </span>
                      )}
                    </div>

                    {/* Financial Totals */}
                    <div className="drawer-footer-totals">
                      <div className="totals-line">
                        <span>Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      {couponApplied && (
                        <div className="totals-line discount">
                          <span>Discount (10%)</span>
                          <span>-{formatPrice(discountAmount)}</span>
                        </div>
                      )}
                      <div className="totals-line">
                        <span>Shipping</span>
                        <span className="free-tag">FREE</span>
                      </div>
                      <div className="totals-line final-total">
                        <span>Total</span>
                        <span className="total-number">{formatPrice(finalTotal)}</span>
                      </div>

                      <button
                        type="button"
                        className="btn-cyber-primary full-width"
                        onClick={() => {
                          sound.click()
                          setCheckoutStep('shipping')
                        }}
                      >
                        PROCEED TO CHECKOUT ➔
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </aside>
        </div>
      )}

      {/* ── WISHLIST DRAWER ──────────────────────────────────── */}
      {wishlistOpen && (
        <div
          className="drawer-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setWishlistOpen(false)
          }}
        >
          <aside className="cyber-drawer wishlist-drawer" role="dialog" aria-modal="true" aria-label="Wishlist">
            <div className="drawer-header-row">
              <h3>WISHLIST <span>({wishlist.length})</span></h3>
              <button
                className="drawer-close-btn"
                onClick={() => setWishlistOpen(false)}
                aria-label="Close wishlist"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            {wishlist.length === 0 ? (
              <div className="drawer-empty-state">
                <Icon name="heart" size={48} />
                <h4>Your Wishlist is Empty</h4>
                <p>Click the heart icon on any sneaker to save it for later.</p>
                <button
                  type="button"
                  className="btn-cyber-primary"
                  onClick={() => setWishlistOpen(false)}
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <>
                <div className="drawer-scrollable-items">
                  {products.filter((p) => wishlist.includes(p.id)).map((p) => (
                    <div className="cart-item-card" key={p.id}>
                      <img src={p.image} alt={p.name} className="cart-item-thumbnail" />
                      <div className="cart-item-details">
                        <strong className="cart-item-name">{p.name}</strong>
                        <span className="cart-item-meta">{p.category}</span>
                        <span className="cart-item-price">{formatPrice(p.price)}</span>
                        <button
                          type="button"
                          className="btn-cyber-glass btn-xs"
                          onClick={() => {
                            addToCart(p, '9', p.colors[0], 1)
                          }}
                        >
                          + Add to Cart
                        </button>
                      </div>
                      <button
                        type="button"
                        className="cart-remove-item"
                        onClick={() => toggleWishlist(p.id, p.name)}
                        title="Remove from Wishlist"
                      >
                        <Icon name="close" size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="drawer-footer-totals">
                  <button
                    type="button"
                    className="btn-cyber-primary full-width"
                    onClick={() => {
                      sound.success()
                      products.filter((p) => wishlist.includes(p.id)).forEach((p) => {
                        addToCart(p, '9', p.colors[0], 1)
                      })
                      setWishlist([])
                      notify('All wishlist items moved to your bag!')
                    }}
                  >
                    MOVE ALL TO CART ➔
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {/* ── VIDEO SHOWCASE MODAL ─────────────────────────────── */}
      {videoModalOpen && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setVideoModalOpen(false)
          }}
        >
          <div className="cyber-video-modal" role="dialog" aria-modal="true" aria-label="Bangtan campaign preview">
            <button
              className="modal-close-icon"
              onClick={() => setVideoModalOpen(false)}
              aria-label="Close video"
            >
              <Icon name="close" size={18} />
            </button>
            <div className="video-player-frame">
              <img src={products[0].image} alt="Bangtan Vortex campaign preview" />
              <div className="video-preview-overlay"><span className="play-circle"><Icon name="play" size={14} /></span><strong>CAMPAIGN FILM PREVIEW</strong><span>Video playback is not available in this demo.</span></div>
            </div>
            <div className="video-meta-bar">
              <h4>BANGTAN // SIGNATURE SERIES</h4>
              <p>A campaign image preview. No film playback is enabled in this storefront demo.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── SIZE GUIDE MODAL ─────────────────────────────────── */}
      {sizeGuideOpen && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSizeGuideOpen(false)
          }}
        >
          <div className="size-guide-modal-box" role="dialog" aria-modal="true" aria-labelledby="size-guide-title">
            <button
              className="modal-close-icon"
              onClick={() => setSizeGuideOpen(false)}
              aria-label="Close size guide"
            >
              <Icon name="close" size={18} />
            </button>
            <h3 id="size-guide-title">SNEAKER SIZING GUIDE</h3>
            <p>Our footwear fits true to standard athletic dimensions. If between sizes, select one half-size up.</p>
            <table className="size-guide-table">
              <thead>
                <tr>
                  <th>US</th>
                  <th>UK</th>
                  <th>EUR</th>
                  <th>CM</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>7.0</td><td>6.0</td><td>40.0</td><td>25.0</td></tr>
                <tr><td>8.0</td><td>7.0</td><td>41.0</td><td>26.0</td></tr>
                <tr><td>9.0</td><td>8.0</td><td>42.5</td><td>27.0</td></tr>
                <tr><td>10.0</td><td>9.0</td><td>44.0</td><td>28.0</td></tr>
                <tr><td>11.0</td><td>10.0</td><td>45.0</td><td>29.0</td></tr>
                <tr><td>12.0</td><td>11.0</td><td>46.5</td><td>30.0</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
