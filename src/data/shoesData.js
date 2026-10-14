export const categories = [
  'All',
  'Performance',
  'Running',
  'Streetwear',
  'Lifestyle'
]

export const sizes = ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12']

export const products = [
  // ── 01. BANGTAN SHADOW (Performance Flagship) ─────────────
  {
    id: 'bangtan-shadow',
    name: 'BANGTAN SHADOW',
    brand: 'BANGTAN-SHOES',
    category: 'Performance',
    price: 12999,
    originalPrice: 15999,
    discount: '19% OFF',
    tag: 'POPULAR',
    tagColor: '#8b5cf6',
    rating: 4.9,
    reviews: 342,
    image: '/shoes/hero-purple.webp',
    colors: [
      {
        name: 'Cyber Violet',
        hex: '#7c3aed',
        img: '/shoes/hero-purple.webp'
      },
      {
        name: 'Electric Cobalt',
        hex: '#2563eb',
        img: '/shoes/galaxy-blue.webp'
      },
      {
        name: 'Stealth Eclipse',
        hex: '#18181b',
        img: '/shoes/eclipse-violet.webp'
      },
      {
        name: 'Luminescent Aurora',
        hex: '#d8b4fe',
        img: '/shoes/aurora-ice.webp'
      }
    ],
    unavailableSizes: ['6', '12'],
    description: 'Performance runner featuring cybernetic violet lightning accents, ultra-responsive nitrogen foam soles, and high-traction honeycomb outsoles. Step beyond ordinary.'
  },

  // ── 02. BANGTAN GALAXY (Electric Cobalt Running) ──────────
  {
    id: 'bangtan-galaxy',
    name: 'BANGTAN GALAXY',
    brand: 'BANGTAN-SHOES',
    category: 'Running',
    price: 10999,
    originalPrice: 12999,
    discount: '15% OFF',
    tag: 'BESTSELLER',
    tagColor: '#2563eb',
    rating: 4.9,
    reviews: 285,
    image: '/shoes/galaxy-blue.webp',
    colors: [
      {
        name: 'Electric Cobalt',
        hex: '#2563eb',
        img: '/shoes/galaxy-blue.webp'
      },
      {
        name: 'Cyber Violet',
        hex: '#7c3aed',
        img: '/shoes/hero-purple.webp'
      },
      {
        name: 'Luminescent Aurora',
        hex: '#d8b4fe',
        img: '/shoes/aurora-ice.webp'
      },
      {
        name: 'Stealth Eclipse',
        hex: '#18181b',
        img: '/shoes/eclipse-violet.webp'
      }
    ],
    unavailableSizes: ['7', '11.5'],
    description: 'Electric cobalt running silhouette engineered with aerodynamic micro-mesh channels and kinetic nitrogen cells for effortless energy return on track and pavement.'
  },

  // ── 03. BANGTAN ECLIPSE (Midnight High-Top Streetwear) ─────
  {
    id: 'bangtan-eclipse',
    name: 'BANGTAN ECLIPSE',
    brand: 'BANGTAN-SHOES',
    category: 'Streetwear',
    price: 14499,
    originalPrice: 17999,
    discount: '19% OFF',
    tag: 'ICONIC',
    tagColor: '#7c3aed',
    rating: 5.0,
    reviews: 198,
    image: '/shoes/eclipse-violet.webp',
    colors: [
      {
        name: 'Stealth Eclipse',
        hex: '#18181b',
        img: '/shoes/eclipse-violet.webp'
      },
      {
        name: 'Cyber Violet',
        hex: '#7c3aed',
        img: '/shoes/hero-purple.webp'
      },
      {
        name: 'Electric Cobalt',
        hex: '#2563eb',
        img: '/shoes/galaxy-blue.webp'
      },
      {
        name: 'Luminescent Aurora',
        hex: '#d8b4fe',
        img: '/shoes/aurora-ice.webp'
      }
    ],
    unavailableSizes: ['8', '10.5'],
    description: 'High-top tactical silhouette crafted in midnight black with neon purple accents, reinforced ankle support, and rugged street-grip treads built for urban explorers.'
  },

  // ── 04. BANGTAN AURORA (Pastel Lavender Lifestyle) ────────
  {
    id: 'bangtan-aurora',
    name: 'BANGTAN AURORA',
    brand: 'BANGTAN-SHOES',
    category: 'Lifestyle',
    price: 13499,
    originalPrice: 15999,
    discount: '16% OFF',
    tag: 'LIMITED',
    tagColor: '#c084fc',
    rating: 4.8,
    reviews: 164,
    image: '/shoes/aurora-ice.webp',
    colors: [
      {
        name: 'Luminescent Aurora',
        hex: '#d8b4fe',
        img: '/shoes/aurora-ice.webp'
      },
      {
        name: 'Cyber Violet',
        hex: '#7c3aed',
        img: '/shoes/hero-purple.webp'
      },
      {
        name: 'Electric Cobalt',
        hex: '#2563eb',
        img: '/shoes/galaxy-blue.webp'
      },
      {
        name: 'Stealth Eclipse',
        hex: '#18181b',
        img: '/shoes/eclipse-violet.webp'
      }
    ],
    unavailableSizes: ['6.5', '12'],
    description: 'Luminescent pastel sneaker reflecting ambient light. Features ultra-soft memory foam insoles, iridescent side-wall branding, and featherlight construction.'
  },

  // ── 05. BANGTAN QUANTUM ZERO (Signature Orbital Edition) ──
  {
    id: 'bangtan-quantum-zero',
    name: 'BANGTAN QUANTUM ZERO',
    brand: 'BANGTAN-SHOES',
    category: 'Performance',
    price: 16999,
    originalPrice: 19999,
    discount: '15% OFF',
    tag: 'SIGNATURE',
    tagColor: '#a855f7',
    rating: 5.0,
    reviews: 412,
    image: '/shoes/hero-purple.webp',
    colors: [
      {
        name: 'Quantum Violet',
        hex: '#8b5cf6',
        img: '/shoes/hero-purple.webp'
      },
      {
        name: 'Cyber Violet',
        hex: '#7c3aed',
        img: '/shoes/hero-purple.webp'
      },
      {
        name: 'Electric Cobalt',
        hex: '#2563eb',
        img: '/shoes/galaxy-blue.webp'
      },
      {
        name: 'Stealth Eclipse',
        hex: '#18181b',
        img: '/shoes/eclipse-violet.webp'
      }
    ],
    unavailableSizes: ['7', '11'],
    description: 'The pinnacle of BANGTAN-SHOES engineering. Zero-gravity orbital cushioning with luminous violet energy rings and breathable titanium-weave upper.'
  },

  // ── 06. BANGTAN VORTEX (Cyber Streetwear Series) ───────────
  {
    id: 'bangtan-vortex',
    name: 'BANGTAN VORTEX',
    brand: 'BANGTAN-SHOES',
    category: 'Streetwear',
    price: 11499,
    originalPrice: 13999,
    discount: '18% OFF',
    tag: 'NEW',
    tagColor: '#06b6d4',
    rating: 4.9,
    reviews: 178,
    image: '/shoes/hero-purple.webp',
    colors: [
      {
        name: 'Cyber Violet',
        hex: '#7c3aed',
        img: '/shoes/hero-purple.webp'
      },
      {
        name: 'Stealth Eclipse',
        hex: '#18181b',
        img: '/shoes/eclipse-violet.webp'
      },
      {
        name: 'Electric Cobalt',
        hex: '#2563eb',
        img: '/shoes/galaxy-blue.webp'
      },
      {
        name: 'Luminescent Aurora',
        hex: '#d8b4fe',
        img: '/shoes/aurora-ice.webp'
      }
    ],
    unavailableSizes: ['8', '11.5'],
    description: 'The BANGTAN VORTEX combines nocturnal cybernetics with all-day rebound comfort. Built with reinforced exoskeleton cages for creators moving differently.'
  },

  // ── 07. BANGTAN KINETIC PULSE (Aerodynamic Marathon) ───────
  {
    id: 'bangtan-kinetic-pulse',
    name: 'BANGTAN KINETIC PULSE',
    brand: 'BANGTAN-SHOES',
    category: 'Running',
    price: 12499,
    originalPrice: 14999,
    discount: '17% OFF',
    tag: 'ENDURANCE',
    tagColor: '#3b82f6',
    rating: 4.8,
    reviews: 156,
    image: '/shoes/galaxy-blue.webp',
    colors: [
      {
        name: 'Electric Cobalt',
        hex: '#2563eb',
        img: '/shoes/galaxy-blue.webp'
      },
      {
        name: 'Luminescent Aurora',
        hex: '#d8b4fe',
        img: '/shoes/aurora-ice.webp'
      },
      {
        name: 'Cyber Violet',
        hex: '#7c3aed',
        img: '/shoes/hero-purple.webp'
      },
      {
        name: 'Stealth Eclipse',
        hex: '#18181b',
        img: '/shoes/eclipse-violet.webp'
      }
    ],
    unavailableSizes: ['7.5', '10.5'],
    description: 'Lightweight aerodynamic marathon chassis with dual-density nitrogen foam core, dynamic arch stabilizer, and breathable 3D air-mesh.'
  },

  // ── 08. BANGTAN NEO-CHRONO (Daily Minimalist) ─────────────
  {
    id: 'bangtan-neo-chrono',
    name: 'BANGTAN NEO-CHRONO',
    brand: 'BANGTAN-SHOES',
    category: 'Lifestyle',
    price: 9999,
    originalPrice: 11999,
    discount: '17% OFF',
    tag: 'ESSENTIAL',
    tagColor: '#ec4899',
    rating: 4.8,
    reviews: 210,
    image: '/shoes/aurora-ice.webp',
    colors: [
      {
        name: 'Luminescent Aurora',
        hex: '#d8b4fe',
        img: '/shoes/aurora-ice.webp'
      },
      {
        name: 'Stealth Eclipse',
        hex: '#18181b',
        img: '/shoes/eclipse-violet.webp'
      },
      {
        name: 'Cyber Violet',
        hex: '#7c3aed',
        img: '/shoes/hero-purple.webp'
      },
      {
        name: 'Electric Cobalt',
        hex: '#2563eb',
        img: '/shoes/galaxy-blue.webp'
      }
    ],
    unavailableSizes: ['6', '12'],
    description: 'Clean daily silhouette designed for versatile urban life with premium soft-touch nubuck, ergonomic cupsole, and subtle BANGTAN-SHOES heel branding.'
  }
]


const productArtwork = {
  'bangtan-shadow': { image: '/shoes/hero-purple.webp', hue: 270, scale: 88, backdrop: '#080810' },
  'bangtan-galaxy': { image: '/shoes/galaxy-blue.webp', hue: 220, scale: 80, backdrop: '#080810' },
  'bangtan-eclipse': { image: '/shoes/eclipse-violet.webp', hue: 260, scale: 84, backdrop: '#080810' },
  'bangtan-aurora': { image: '/shoes/aurora-ice.webp', hue: 0, scale: 78, backdrop: '#080810' },
  'bangtan-quantum-zero': { image: '/shoes/quantum-runner.webp', hue: 0, scale: 91, backdrop: '#111116' },
  'bangtan-vortex': { image: '/shoes/vortex-canvas.webp', hue: 220, scale: 89, backdrop: '#111116' },
  'bangtan-kinetic-pulse': { image: '/shoes/kinetic-runner.webp', hue: 0, scale: 82, backdrop: '#111116' },
  'bangtan-neo-chrono': { image: '/shoes/neo-canvas.webp', hue: 220, scale: 82, backdrop: '#111116' },
};

const colorHues = { 'Cyber Violet': 270, 'Quantum Violet': 270, 'Electric Cobalt': 220, 'Luminescent Aurora': 282 };

products.forEach((product) => {
  const artwork = productArtwork[product.id];
  if (!artwork) return;
  product.image = artwork.image;
  product.imageScale = artwork.scale;
  product.mediaBackground = artwork.backdrop;
  product.colors.forEach((color) => {
    color.img = artwork.image;
    if (color.name === 'Stealth Eclipse') {
      color.filter = 'grayscale(1) brightness(.62) contrast(1.22)';
    } else if (artwork.hue === 0) {
      color.filter = color.name === 'Luminescent Aurora'
        ? 'grayscale(.12) brightness(1.12) saturate(.68)'
        : `sepia(.82) saturate(2.8) hue-rotate(${colorHues[color.name] - 35}deg)`;
    } else {
      color.filter = `hue-rotate(${colorHues[color.name] - artwork.hue}deg) saturate(1.36)`;
    }
  });
});
