import type { Address, Order, StoreName } from './types'

export const DEMO_NAME = 'Kunal'

const home: Address = { id: 'home', label: 'Home', lines: 'Flat 402, Lotus Residency, 12th Main\nIndiranagar, Bengaluru 560038' }
const work: Address = { id: 'work', label: 'Work', lines: '3rd Floor, Prestige Tech Park\nMarathahalli, Bengaluru 560103' }
const other: Address = { id: 'other', label: 'Other', lines: '21 Rose Villa, 5th Cross\nKoramangala, Bengaluru 560034' }

export const SEED_ADDRESSES: Record<StoreName, Address[]> = {
  Instamart: [home, work, other],
  Zepto: [home],
}

export const SEED_FAVOURITES = ['maybelline-ultimatte', 'minimalist-niacinamide', 'reequil-moisturiser', 'lip-oil']

const at = (day: number, h: number, m: number) => new Date(2026, 10, day, h, m).getTime()

export const SEED_ORDERS: Order[] = [
  {
    id: 'IM-48107',
    store: 'Instamart',
    createdAt: at(6, 11, 4),
    items: [{ title: 'Neutrogena Hydro Boost Water Gel 50 g', size: '50 g', price: 352, qty: 1 }],
    bill: [
      { k: 'Item total', v: '₹352' },
      { k: 'Handling charge', v: '₹9' },
      { k: 'Delivery fee', v: 'Free' },
    ],
    total: 361,
    status: 'placed',
    pills: [
      { k: 'placed', t: 'Placed' },
      { k: 'pend', t: 'Payment pending (Cash on delivery)' },
    ],
    payment: 'Cash on delivery',
    address: home,
    eta: 10,
  },
  {
    id: 'IM-48052',
    store: 'Instamart',
    createdAt: at(5, 19, 15),
    items: [{ title: 'Cetaphil Gentle Skin Cleanser 125 ml', size: '125 ml', price: 414, qty: 1 }],
    bill: [
      { k: 'Item total', v: '₹414' },
      { k: 'Delivery', v: '₹30' },
      { k: 'Handling', v: '₹9' },
    ],
    total: 453,
    status: 'placed',
    pills: [{ k: 'placed', t: 'Placed' }],
    payment: 'UPI',
    address: home,
    eta: 10,
  },
  {
    id: 'IM-47966',
    store: 'Instamart',
    createdAt: at(3, 8, 6),
    items: [
      { title: 'Cotton buds 100 pcs', size: '', price: 45, qty: 1 },
      { title: 'Rose water 200 ml', size: '', price: 120, qty: 1 },
      { title: 'Sheet mask 3 pcs', size: '', price: 161, qty: 1 },
    ],
    bill: [
      { k: 'Item total', v: '₹326' },
      { k: 'Delivery', v: '₹30' },
      { k: 'Handling', v: '₹9' },
    ],
    total: 365,
    status: 'cancel',
    pills: [
      { k: 'cancel', t: 'Cancelled' },
      { k: 'cancel', t: 'Refunded' },
    ],
    payment: 'UPI',
    address: home,
    eta: 10,
  },
  {
    id: 'IM-47902',
    store: 'Instamart',
    createdAt: at(1, 20, 9),
    items: [
      { title: 'Cotton pads 80 pcs', size: '', price: 65, qty: 1 },
      { title: 'Lip balm 4.5 g', size: '', price: 49, qty: 1 },
      { title: 'Face wipes 25 pcs', size: '', price: 40, qty: 1 },
    ],
    bill: [
      { k: 'Item total', v: '₹154' },
      { k: 'Delivery', v: '₹30' },
      { k: 'Handling', v: '₹9' },
    ],
    total: 193,
    status: 'done',
    pills: [{ k: 'done', t: 'Delivered' }],
    payment: 'UPI',
    address: home,
    eta: 10,
  },
]

// `ids` are the products whose photos make up the drawer thumbnail collage.
export const RECENTS = [
  {
    group: 'Today',
    items: [
      {
        t: 'Everyday glam reel',
        s: 'From a reel · 5 products',
        to: '/reel/beauty',
        ids: ['maybelline-ultimatte', 'minimalist-niacinamide', 'reequil-moisturiser', 'lip-oil'],
      },
      {
        t: 'Pav bhaji reel',
        s: 'From a reel · 14 products',
        to: '/reel/recipe',
        ids: ['ladi-pav-8', 'mdh-pav-bhaji', 'potato', 'amul-butter-100'],
      },
    ],
  },
  {
    group: 'This week',
    items: [{ t: "Re'equil moisturiser", s: 'From a photo · 1 product', to: '/reel/one', ids: ['reequil-moisturiser'] }],
  },
  {
    group: 'Earlier',
    items: [
      {
        t: 'Glow serum',
        s: 'From chat · 3 products',
        to: '/chat?q=glow%20serum',
        ids: ['minimalist-niacinamide', 'minimalist-b5', 'lip-oil'],
      },
    ],
  },
]

export const STORE_INFO: Record<StoreName, { full: string; logo: string }> = {
  Instamart: { full: 'Instamart, by Swiggy', logo: 'I' },
  Zepto: { full: 'Zepto', logo: 'Z' },
}
