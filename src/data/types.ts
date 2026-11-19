import type { IconName } from '../components/Icon'

export type StoreName = 'Instamart' | 'Zepto'
export const STORES: StoreName[] = ['Instamart', 'Zepto']

export interface Offer {
  store: StoreName
  price: number
  mrp?: number
  eta?: string
  max?: number
}

export interface Fallback {
  store: string
  price: number
  logo: string
}

export interface Product {
  id: string
  title: string
  short: string
  size: string
  brand: string
  facts: string[]
  /** Quick-commerce listings (Instamart, Zepto) that can be added to the cart. */
  offers: Offer[]
  /** E-commerce listings (Nykaa, Myntra, Amazon…) opened on the store's site. */
  fallback?: Fallback[]
  brandSite?: number
  image?: string
  images?: string[]
  oos?: boolean
  noReviews?: boolean
  /** Zynn's one-paragraph take. Wrap phrases in **double asterisks** to bold them. */
  zynnSays?: string
  /** How well the product fits the request, 0–100. */
  relevance?: number
  reviews?: Review[]
  description?: string
}

export interface Review {
  author: string
  date: string
  rating: number
  source: string
  title: string
  body: string
}

export type Tag = '' | 'In reel' | 'Your usual' | 'Cheaper' | 'Bigger pack' | 'Popular'

export interface ReelCard {
  id: string
  tag: Tag
  picked?: boolean
}

export interface ReelGroup {
  title: string
  detail: string
  hint: boolean
  multi?: boolean
  cards: ReelCard[]
}

export type ReelId = 'beauty' | 'recipe' | 'one' | 'none'

export interface Reel {
  id: ReelId
  type: 'shop' | 'recipe' | 'none'
  ha: string
  hi: string
  hb: string
  sub: string
  msg: string
  chips: { icon: IconName; t: string }[]
  hints: string[]
  groups: ReelGroup[]
  hideStore?: boolean
  kitchen?: string[]
  steps?: string[]
}

export interface Address {
  id: string
  label: 'Home' | 'Work' | 'Other'
  lines: string
}

export type PillKind = 'placed' | 'way' | 'done' | 'cancel' | 'pend'

export interface OrderItem {
  title: string
  size: string
  price: number
  qty: number
}

export interface Order {
  id: string
  store: StoreName
  createdAt: number
  items: OrderItem[]
  bill: { k: string; v: string }[]
  total: number
  status: 'placed' | 'way' | 'done' | 'cancel'
  pills: { k: PillKind; t: string }[]
  payment: string
  address: Address
  eta: number
}
