import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { BillCard, CartItemRow } from '../components/Bits'
import { Icon, type IconName } from '../components/Icon'
import { BottomSheet, Busy } from '../components/Overlays'
import { TopBar } from '../components/TopBar'
import type { StoreName } from '../data/types'
import { billFor, COUPONS } from '../lib/bill'
import { inr } from '../lib/format'
import { useApp } from '../store/AppStore'

export const UPI_APPS = [
  { id: 'GPay', logo: 'G' },
  { id: 'PhonePe', logo: 'Pe' },
  { id: 'Paytm', logo: 'Pt' },
  { id: 'Other UPI', logo: 'UPI' },
]

const METHODS: Record<StoreName, { id: string; icon: IconName }[]> = {
  Instamart: [
    { id: 'Scan QR to pay', icon: 'qr' },
    { id: 'Swiggy Money', icon: 'wallet' },
    { id: 'Cash on delivery', icon: 'cash' },
  ],
  Zepto: [
    { id: 'UPI', icon: 'upi' },
    { id: 'Card', icon: 'card' },
    { id: 'Cash on delivery', icon: 'cash' },
    { id: 'Zepto Cash', icon: 'wallet' },
  ],
}

export function useCheckoutStep() {
  const { i } = useParams()
  const app = useApp()
  const idx = Number(i ?? 0)
  const store = app.checkout[idx] as StoreName | undefined
  const items = store ? app.itemsFor(store) : []
  const bill = store ? billFor(store, items, store === 'Instamart' ? app.coupon : null) : undefined
  return { idx, store, items, bill, isLast: idx === app.checkout.length - 1 }
}

export function usePay() {
  const app = useApp()
  const nav = useNavigate()
  const [redirecting, setRedirecting] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const pay = (idx: number, method: string) => {
    const store = app.checkout[idx]
    if (UPI_APPS.some((u) => u.id === method)) return nav(`/pay/upi/${idx}`, { state: { method } })
    if (method === 'Scan QR to pay') return nav(`/pay/qr/${idx}`)
    if (store === 'Zepto' && (method === 'UPI' || method === 'Card')) {
      setRedirecting(true)
      timer.current = setTimeout(() => {
        app.placeOrder(store, method)
        nav(`/placed/${idx}`, { replace: true })
      }, 1500)
      return
    }
    app.placeOrder(store, method)
    nav(`/placed/${idx}`, { replace: true })
  }
  return { pay, redirecting }
}

export function ReviewOrder() {
  const app = useApp()
  const nav = useNavigate()
  const { idx, store, items, bill } = useCheckoutStep()
  const [method, setMethod] = useState(store === 'Zepto' ? 'UPI' : 'GPay')
  const [coupons, setCoupons] = useState(false)
  const { pay, redirecting } = usePay()

  if (!store) return <Navigate to="/cart" replace />
  if (!items.length || !bill) return <Navigate to={app.sessionOrders[idx] ? `/placed/${idx}` : '/cart'} replace />

  const address = app.addressFor(store)
  const place = () => {
    if (app.isDuplicate(store)) return nav(`/pay/duplicate/${idx}`, { state: { method } })
    pay(idx, method)
  }

  return (
    <div className="scr pb-36">
      <TopBar inner />
      <div className="px-5 pt-3">
        <h1 className="h1">Review order</h1>
        <div className="mt-3 flex gap-1.5">
          {app.checkout.map((s, k) => (
            <div key={s} className="h-1 flex-1 rounded-sm" style={{ background: k <= idx ? '#F2A35E' : 'rgba(255,255,255,.12)' }} />
          ))}
        </div>
        <p className="s mt-2">
          Order {idx + 1} of {app.checkout.length} · {store}
        </p>

        <div className="g gc mt-[18px] flex items-start gap-3">
          <Icon name="pin" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="h3">Deliver to {address?.label}</span>
            <span className="s whitespace-pre-line">{address?.lines}</span>
          </div>
          <Link to="/address" className="lk acc min-h-6 p-0">
            Change
          </Link>
        </div>

        <div className="g gc mt-3">
          <span className="h3">Items ({items.length})</span>
          {items.map((it) => (
            <CartItemRow key={it.title} title={it.title} size={it.size} price={inr(it.price * it.qty)} qty={it.qty} mode="qty" />
          ))}
        </div>

        {store === 'Instamart' && (
          <button className="g gc mt-3 flex w-full items-center gap-3 text-left text-z-tx" onClick={() => setCoupons(true)}>
            <Icon name="tag" />
            <span className="h3 flex-1">Coupons</span>
            <span className={app.coupon ? 'acc text-[13px] font-semibold' : 's'}>
              {app.coupon ? `${app.coupon} applied` : `${COUPONS.length} available`}
            </span>
            <Icon name="chevRight" size={18} />
          </button>
        )}

        <div className="mt-3">
          <BillCard rows={bill.rows} total={inr(bill.total)} />
        </div>

        <p className="h3 mt-[22px]">Pay with</p>
        {store === 'Instamart' && (
          <div className="mt-3.5 flex gap-3" role="radiogroup" aria-label="UPI apps">
            {UPI_APPS.map((u) => (
              <button
                key={u.id}
                role="radio"
                aria-checked={method === u.id}
                onClick={() => setMethod(u.id)}
                className="flex w-[76px] flex-col items-center gap-2 text-xs font-medium text-z-tx"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full bg-white text-sm font-extrabold text-z-strip ${method === u.id ? 'z-sel' : ''}`}
                >
                  {u.logo}
                </span>
                {u.id}
              </button>
            ))}
          </div>
        )}
        <div className="g gc mt-3.5 px-4 py-0.5" role="radiogroup" aria-label="Payment methods">
          {METHODS[store].map((m, k) => (
            <button
              key={m.id}
              role="radio"
              aria-checked={method === m.id}
              onClick={() => setMethod(m.id)}
              className={`flex min-h-14 w-full items-center gap-3 text-left text-z-tx ${k ? 'border-t border-white/8' : ''}`}
            >
              <Icon name={m.icon} />
              <span className="flex-1 text-[15px]">{m.id}</span>
              <span className={`rad ${method === m.id ? 'on' : ''}`} />
            </button>
          ))}
        </div>
        <p className="s mt-3.5">
          Placing order with {store} to {address?.label}.
        </p>
      </div>

      <div className="foot">
        <button className="btn w" onClick={place}>
          Place order · {inr(bill.total)}
        </button>
      </div>

      {coupons && <CouponsSheet itemTotal={bill.itemTotal} onClose={() => setCoupons(false)} />}
      {redirecting && <Busy title="Opening secure payment page..." sub="Come back to Zynn after paying." />}
    </div>
  )
}

function CouponsSheet({ itemTotal, onClose }: { itemTotal: number; onClose: () => void }) {
  const app = useApp()
  return (
    <BottomSheet onClose={onClose} label="Coupons">
      <div className="flex items-center">
        <h2 className="h2 flex-1">Coupons</h2>
        <button className="rb" aria-label="Close" onClick={onClose}>
          <Icon name="close" />
        </button>
      </div>
      {COUPONS.map((c) => {
        const applied = app.coupon === c.code
        const eligible = c.discount(itemTotal) > 0
        return (
          <div key={c.code} className={`g gc mt-3 flex items-center gap-3 ${applied ? 'z-sel' : ''}`}>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-[15px] font-extrabold tracking-[.06em]">{c.code}</span>
              <span className="s">{c.desc}</span>
            </div>
            {applied ? (
              <button className="acc flex items-center gap-1.5 text-sm font-bold" onClick={() => app.setCoupon(null)}>
                <Icon name="check" size={18} strokeWidth={2.4} />
                Applied
              </button>
            ) : (
              <button
                className="btn sm o"
                disabled={!eligible}
                onClick={() => {
                  app.setCoupon(c.code)
                  app.toast(`${c.code} applied`)
                  onClose()
                }}
              >
                Apply
              </button>
            )}
          </div>
        )
      })}
    </BottomSheet>
  )
}
