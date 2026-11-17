import type { Offer, Product, StoreName } from './types'

const im = (price: number, extra: Partial<Offer> = {}): Offer => ({ store: 'Instamart', price, eta: '10 mins', ...extra })
const zp = (price: number, extra: Partial<Offer> = {}): Offer => ({ store: 'Zepto', price, eta: '12 mins', ...extra })

const grocery = (id: string, short: string, size: string, brand: string, price: number): Product => ({
  id,
  title: size ? `${short} ${size}` : short,
  short,
  size,
  brand,
  facts: size ? [size] : [],
  offers: [im(price)],
})

const LIST: Product[] = [
  {
    id: 'maybelline-ultimatte',
    title: 'Maybelline Color Sensational Ultimatte Lipstick 1.7 g',
    short: 'Maybelline Color Sensational Ultimatte',
    size: '1.7 g',
    brand: 'Maybelline New York',
    facts: ['Shade: Rich Ruby', '1.7 g'],
    offers: [im(299, { mrp: 399 })],
  },
  {
    id: 'lakme-9to5-lip',
    title: 'Lakmé 9to5 Primer + Matte Lip Color 3.6 g',
    short: 'Lakmé 9to5 Primer + Matte Lip Color',
    size: '3.6 g',
    brand: 'Lakmé',
    facts: ['Matte', '3.6 g'],
    offers: [zp(275)],
  },
  {
    id: 'sugar-matte-crayon',
    title: 'SUGAR Matte As Hell Crayon Lipstick 2.8 g',
    short: 'SUGAR Matte As Hell Crayon Lipstick',
    size: '2.8 g',
    brand: 'SUGAR Cosmetics',
    facts: ['Matte', '2.8 g'],
    offers: [zp(499)],
  },
  {
    id: 'minimalist-niacinamide',
    title: 'Minimalist Niacinamide 10% Face Serum 30 ml',
    short: 'Minimalist Niacinamide 10%',
    size: '30 ml',
    brand: 'Minimalist',
    facts: ['Niacinamide 10%', '30 ml'],
    offers: [zp(579), im(599)],
    brandSite: 599,
  },
  {
    id: 'dermaco-niacinamide',
    title: 'The Derma Co 10% Niacinamide Serum 30 ml',
    short: 'The Derma Co 10% Niacinamide Serum',
    size: '30 ml',
    brand: 'The Derma Co',
    facts: ['Niacinamide 10%', '30 ml'],
    offers: [im(549)],
  },
  {
    id: 'lakme-eyeconic-kajal',
    title: 'Lakmé Eyeconic Kajal 0.35 g',
    short: 'Lakmé Eyeconic Kajal',
    size: '0.35 g',
    brand: 'Lakmé',
    facts: ['Black', '0.35 g'],
    offers: [zp(199, { max: 2 })],
  },
  {
    id: 'reequil-moisturiser',
    title: "Re'equil Ceramide & Hyaluronic Acid Moisturiser 100 g",
    short: "Re'equil Ceramide & Hyaluronic Acid Moisturiser",
    size: '100 g',
    brand: "Re'equil",
    facts: ['Dry, Normal', '100 g'],
    offers: [],
    fallback: [
      { store: 'Myntra', price: 245, logo: 'M' },
      { store: 'Tirabeauty', price: 355, logo: 'T' },
      { store: 'Amazon', price: 355, logo: 'A' },
    ],
    noReviews: true,
  },
  {
    id: 'minimalist-b5',
    title: 'Minimalist Vitamin B5 10% Moisturizer 50 g',
    short: 'Minimalist Vitamin B5 10% Moisturizer',
    size: '50 g',
    brand: 'Minimalist',
    facts: ['Vitamin B5 10%', '50 g'],
    offers: [im(299)],
  },
  {
    id: 'lip-oil',
    title: 'Lip Oil',
    short: 'Lip Oil',
    size: '',
    brand: 'Shopify brand store',
    facts: [],
    offers: [],
    brandSite: 650,
  },
  grocery('mdh-pav-bhaji', 'MDH Pav Bhaji Masala', '100 g', 'MDH', 84),
  grocery('everest-pav-bhaji', 'Everest Pav Bhaji Masala', '100 g', 'Everest', 80),
  grocery('catch-pav-bhaji', 'Catch Pav Bhaji Masala', '100 g', 'Catch', 72),
  grocery('everest-kashmiri', 'Everest Kashmiri Chilli', '100 g', 'Everest', 86),
  grocery('mdh-kashmiri', 'MDH Kashmiri Chilli', '100 g', 'MDH', 92),
  grocery('catch-kashmiri', 'Catch Kashmiri Chilli', '100 g', 'Catch', 78),
  grocery('amul-butter-100', 'Amul Butter', '100 g', 'Amul', 62),
  grocery('mother-dairy-butter', 'Mother Dairy Butter', '100 g', 'Mother Dairy', 58),
  grocery('amul-butter-500', 'Amul Butter', '500 g', 'Amul', 285),
  grocery('ladi-pav-8', 'Ladi Pav', '8 pcs', 'Fresh bakery', 40),
  grocery('ladi-pav-12', 'Ladi Pav', '12 pcs', 'Fresh bakery', 55),
  grocery('potato', 'Potato', '1 kg', 'Fresh', 45),
  grocery('tomato', 'Tomato', '500 g', 'Fresh', 30),
  grocery('capsicum', 'Capsicum', '250 g', 'Fresh', 28),
]

// Open-license stock photos in public/products (sources and licences in public/products/CREDITS.md).
// Products without an entry keep the text placeholder.
const PHOTOS: Record<string, string> = {
  'maybelline-ultimatte': '/products/lipstick-product.jpg',
  'lakme-9to5-lip': '/products/makeup-products.jpg',
  'sugar-matte-crayon': '/products/beauty-makeup.jpg',
  'ladi-pav-8': '/products/pav-bread.jpg',
  'ladi-pav-12': '/products/pav-bread.jpg',
  potato: '/products/potato.jpg',
  tomato: '/products/tomatoes.jpg',
  'everest-kashmiri': '/products/chilli-kashmiri.jpg',
  'mdh-kashmiri': '/products/chilli-kashmiri.jpg',
  'catch-kashmiri': '/products/chilli-kashmiri.jpg',
  'mdh-pav-bhaji': '/products/pav-bhaji.jpg',
  'everest-pav-bhaji': '/products/pav-bhaji.jpg',
  'catch-pav-bhaji': '/products/pav-bhaji.jpg',
  'amul-butter-100': '/products/butter-block.jpg',
  'mother-dairy-butter': '/products/butter-block.jpg',
  'amul-butter-500': '/products/butter-block.jpg',
  capsicum: '/products/bell-pepper.jpg',
  'lip-oil': '/products/lip-balm.jpg',
  // Hosted, not downloaded: Pexels License (serum) and Wikimedia Commons (cream, kohl rods)
  'minimalist-niacinamide': 'https://images.pexels.com/photos/2566853/pexels-photo-2566853.jpeg?w=960',
  'dermaco-niacinamide': 'https://images.pexels.com/photos/2566853/pexels-photo-2566853.jpeg?w=960',
  'reequil-moisturiser': 'https://upload.wikimedia.org/wikipedia/commons/3/35/Crema_Calmante_para_la_piel_%2C_Nature%27s_Soothing_Skin_Cream.jpg',
  'minimalist-b5': 'https://upload.wikimedia.org/wikipedia/commons/3/35/Crema_Calmante_para_la_piel_%2C_Nature%27s_Soothing_Skin_Cream.jpg',
  'lakme-eyeconic-kajal': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/30/Glass_Kohl_rods%2C_Dynasty_18_%281550-1292_BCE%29_Fitzwilliam_Museum%2C_Cambridge.jpg/960px-Glass_Kohl_rods%2C_Dynasty_18_%281550-1292_BCE%29_Fitzwilliam_Museum%2C_Cambridge.jpg',
}

export const PRODUCTS: Record<string, Product> = Object.fromEntries(
  LIST.map((p) => [p.id, { ...p, image: PHOTOS[p.id] ?? p.image }]),
)

export const bestOffer = (p: Product) =>
  p.offers.length ? [...p.offers].sort((a, b) => a.price - b.price)[0] : undefined

export const offerFor = (p: Product, store: StoreName) => p.offers.find((o) => o.store === store)

export const displayPrice = (p: Product) => bestOffer(p)?.price ?? p.fallback?.[0]?.price ?? p.brandSite ?? 0

export const storeLabel = (p: Product) => {
  const o = bestOffer(p)
  if (o) return o.store
  if (p.fallback?.length) return `on ${p.fallback[0].store}`
  return 'on brand website'
}
