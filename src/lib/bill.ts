import type { StoreName } from '../data/types'
import { inr } from './format'

export const MIN_ORDER = 99

const HANDLING: Record<StoreName, [string, number]> = {
  Instamart: ['Handling charge', 9],
  Zepto: ['Handling fee', 12],
}

export interface Coupon {
  code: string
  desc: string
  discount: (itemTotal: number) => number
}

export const COUPONS: Coupon[] = [
  { code: 'INSTA20', desc: '₹20 off on orders above ₹249', discount: (t) => (t >= 249 ? 20 : 0) },
  { code: 'BEAUTY10', desc: '10% off up to ₹40 on beauty items', discount: (t) => Math.min(40, Math.round(t * 0.1)) },
]

export function billFor(store: StoreName, items: { price: number; qty: number }[], coupon?: string | null) {
  const itemTotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const [label, fee] = HANDLING[store]
  const rows = [
    { k: 'Item total', v: inr(itemTotal) },
    { k: label, v: inr(fee) },
    { k: 'Delivery fee', v: 'Free' },
  ]
  let total = itemTotal + fee
  const c = coupon ? COUPONS.find((x) => x.code === coupon) : undefined
  const off = c ? c.discount(itemTotal) : 0
  if (c && off > 0) {
    rows.push({ k: `Coupon ${c.code}`, v: `−${inr(off)}` })
    total -= off
  }
  return { rows, total, itemTotal }
}
