import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { BillCard, CartItemRow, EmptyState, StatusPill, Tick } from '../components/Bits'
import { Icon } from '../components/Icon'
import { TopBar } from '../components/TopBar'
import type { Order } from '../data/types'
import { billFor } from '../lib/bill'
import { formatWhen, inr } from '../lib/format'
import { useApp } from '../store/AppStore'

const paidText = (o: Order) => (o.payment === 'Cash on delivery' ? 'to pay on delivery' : `paid by ${o.payment.split(' · ')[0]}`)

export function Placed() {
  const app = useApp()
  const { i } = useParams()
  const idx = Number(i ?? 0)
  const order = app.orders.find((o) => o.id === app.sessionOrders[idx])
  if (!order) return <Navigate to="/orders" replace />

  const n = app.checkout.length
  const isLast = idx >= n - 1
  if (isLast && n > 1) return <AllPlaced />

  const next = app.checkout[idx + 1]
  const nextItems = next ? app.itemsFor(next) : []

  return (
    <div className="scr pb-10">
      <div className="flex flex-col items-center px-7 pt-[140px] text-center">
        <Tick />
        <h2 className="h2 mt-7">{order.store} order placed successfully.</h2>
        <p className="s mt-2.5">
          Order #{order.id} · {inr(order.total)} {paidText(order)} · to {order.address.label}
        </p>
      </div>
      <div className="mt-10 px-5">
        {next && nextItems.length > 0 && (
          <div className="dk gc mb-3">
            <p className="h3">
              Next: {next} order · {nextItems.length} {nextItems.length === 1 ? 'item' : 'items'} ·{' '}
              {inr(billFor(next, nextItems).total)}
            </p>
            <Link className="btn w mt-4" to={`/checkout/${idx + 1}`} replace>
              Continue to {next}
            </Link>
          </div>
        )}
        <Link className="btn o w" to={`/track/${order.id}`}>
          Track this order
        </Link>
        {!next && (
          <Link className="btn w mt-3" to="/">
            Back to home
          </Link>
        )}
      </div>
    </div>
  )
}

function AllPlaced() {
  const app = useApp()
  const placed = app.sessionOrders.map((id) => app.orders.find((o) => o.id === id)).filter((o): o is Order => !!o)
  return (
    <div className="scr pb-10">
      <div className="flex flex-col items-center px-7 pt-40 text-center">
        <Tick />
        <h1 className="h1 mt-7">{placed.length === 2 ? 'Both orders placed' : 'All orders placed'}</h1>
      </div>
      <div className="mt-8 px-5">
        {placed.map((o) => (
          <Link key={o.id} to={`/track/${o.id}`} className="dk gc mt-3 flex items-center gap-3 text-z-tx">
            <span className="h3">{o.store}</span>
            <span className="s flex-1">· {inr(o.total)}</span>
            <StatusPill>Placed</StatusPill>
            <span className="flex items-center gap-0.5 text-sm font-semibold">
              Track
              <Icon name="chevRight" size={16} />
            </span>
          </Link>
        ))}
        <Link className="btn o w mt-6" to="/">
          Back to home
        </Link>
      </div>
    </div>
  )
}

function useMinutesLeft(o: Order | undefined) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 15_000)
    return () => clearInterval(t)
  }, [])
  if (!o) return 0
  return Math.max(1, o.eta - Math.floor((now - o.createdAt) / 60_000))
}

const isLive = (o: Order) => o.status === 'placed' && Date.now() - o.createdAt < 2 * 3600_000

export function Track() {
  const app = useApp()
  const { id } = useParams()
  const order = app.orders.find((o) => o.id === id)
  const mins = useMinutesLeft(order)
  if (!order) return <Navigate to="/orders" replace />
  if (!isLive(order)) return <Navigate to={`/orders/${order.id}`} replace />

  if (order.store === 'Zepto')
    return (
      <div className="scr pb-10">
        <TopBar inner />
        <div className="px-5 pt-3">
          <p className="s">Zepto</p>
          <h1 className="h1 mt-1">Order confirmed</h1>
          <p className="mt-3.5 text-[30px] font-extrabold tracking-[-.6px] text-z-acc">Arriving in {mins} mins</p>
          <div className="dk gc mt-5">
            <span className="h3">Items ({order.items.length})</span>
            {order.items.map((it) => (
              <CartItemRow key={it.title} title={it.title} size={it.size} price={inr(it.price * it.qty)} qty={it.qty} mode="qty" />
            ))}
            <div className="hr mt-1" />
            <div className="kv mt-2 text-base font-extrabold">
              <span>Total</span>
              <span>{inr(order.total)}</span>
            </div>
          </div>
          <div className="dk gc mt-3 flex items-start gap-3">
            <Icon name="help" />
            <p className="flex-1 text-sm leading-[1.45]">For help, go to Help in the Zepto app</p>
          </div>
          <p className="xs mt-4 text-center">Updates automatically</p>
        </div>
      </div>
    )

  return (
    <div className="scr pb-10">
      <TopBar inner />
      <div className="px-5 pt-3">
        <div className="relative aspect-[350/220] overflow-hidden rounded-3xl border border-ink/8 bg-z-surface-2">
          <svg viewBox="0 0 350 220" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <path d="M-10 60H360M-10 160H360M90 -10V230M250 -10V230M0 230L180 -10" style={{ stroke: 'var(--z-map-road)' }} strokeWidth="12" fill="none" />
            <path d="M60 52H250V150H292" stroke="#F2A35E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <span className="g absolute top-[14.5%] left-[11.4%] flex h-10 w-10 items-center justify-center rounded-full bg-[var(--z-glass-strong)]">
            <Icon name="store" size={18} />
          </span>
          <span className="pulse-dot absolute top-[41.8%] left-[68.9%] h-[18px] w-[18px] rounded-full bg-z-acc" />
          <span className="g absolute top-[59.1%] left-[79.4%] flex h-10 w-10 items-center justify-center rounded-full bg-[var(--z-glass-strong)]">
            <Icon name="pin" size={18} />
          </span>
        </div>
        <h1 className="h1 mt-[22px]">Your order is on the way</h1>
        <p className="s mt-1.5 text-sm">Picked up from the store</p>
        <p className="mt-3.5 text-[30px] font-extrabold tracking-[-.6px] text-z-acc">Arriving in {mins} mins</p>

        <div className="dk gc mt-5">
          <div className="flex items-start gap-3">
            <Icon name="store" />
            <div className="flex flex-1 flex-col gap-1">
              <span className="h3">Instamart · Indiranagar</span>
              <span className="s">100 Feet Rd, HAL 2nd Stage, Bengaluru</span>
            </div>
          </div>
          <div className="hr my-3.5" />
          <div className="flex items-start gap-3">
            <Icon name="pin" />
            <div className="flex flex-1 flex-col gap-1">
              <span className="h3">{order.address.label}</span>
              <span className="s whitespace-pre-line">{order.address.lines}</span>
            </div>
          </div>
          <div className="hr my-3.5" />
          <p className="h3">Items ({order.items.length})</p>
          {order.items.map((it) => (
            <div key={it.title} className="mt-2.5 flex items-center gap-3">
              <div className="ph th h-11 w-11 rounded-xl text-[6px]">{it.title}</div>
              <span className="flex-1 text-sm">{it.title}</span>
              <span className="s">× {it.qty}</span>
            </div>
          ))}
          <div className="hr my-3.5" />
          <div className="kv p-0">
            <span className="mut">
              {order.payment === 'Cash on delivery' ? `Pay ${inr(order.total)} on delivery` : `Paid ${inr(order.total)} via UPI`}
            </span>
          </div>
        </div>
        <SwiggyHelp />
        <p className="xs mt-4 text-center">Updates automatically</p>
      </div>
    </div>
  )
}

function SwiggyHelp() {
  return (
    <div className="dk gc mt-3 flex items-start gap-3">
      <Icon name="phone" />
      <p className="flex-1 text-sm leading-[1.45]">
        Need to cancel or have an issue? Call Swiggy customer care{' '}
        <a href="tel:08067466729" className="font-bold text-z-acc">
          080-67466729
        </a>
      </p>
    </div>
  )
}

const FILTERS = ['All', 'Active', 'Delivered', 'Cancelled'] as const
const matches = (o: Order, f: (typeof FILTERS)[number]) =>
  f === 'All' ||
  (f === 'Active' && (o.status === 'placed' || o.status === 'way')) ||
  (f === 'Delivered' && o.status === 'done') ||
  (f === 'Cancelled' && o.status === 'cancel')

export function Orders() {
  const app = useApp()
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')

  if (!app.orders.length)
    return (
      <div className="scr">
        <TopBar inner />
        <EmptyState icon="receipt" title="No orders yet" sub="Orders you place in Zynn show up here." />
      </div>
    )

  const list = app.orders.filter((o) => matches(o, filter))

  return (
    <div className="scr pb-10">
      <TopBar inner />
      <div className="px-5 pt-3">
        <h1 className="h1">Orders</h1>
        <div className="cs mt-4" role="tablist">
          {FILTERS.map((f) => (
            <button key={f} role="tab" aria-selected={filter === f} className={`chip ${filter === f ? 'on' : ''}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
        <div key={filter} style={{ animation: 'zFade .18s var(--ease-out) both' }}>
          {!list.length && <p className="s mt-6 text-center">No {filter.toLowerCase()} orders.</p>}
          {list.map((o) => {
          const count = o.items.reduce((s, it) => s + it.qty, 0)
          return (
            <Link key={o.id} to={`/orders/${o.id}`} className="dk gc mt-3 block text-z-tx">
              <div className="flex items-center gap-3">
                <span className="h3 flex-1">{o.store}</span>
                <span className="xs">{formatWhen(o.createdAt)}</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                {o.items.slice(0, 3).map((it) => (
                  <span key={it.title} className="ph h-10 w-10 rounded-[10px] p-1 text-[5px]">
                    {it.title}
                  </span>
                ))}
                <span className="flex-1" />
                <span className="text-sm">
                  {count} {count === 1 ? 'item' : 'items'} · <b>{inr(o.total)}</b>
                </span>
              </div>
              <div className="chips mt-3">
                {o.pills.map((p) => (
                  <StatusPill key={p.t} kind={p.k}>
                    {p.t}
                  </StatusPill>
                ))}
              </div>
            </Link>
          )
        })}
        </div>
      </div>
    </div>
  )
}

export function OrderDetail() {
  const app = useApp()
  const { id } = useParams()
  const o = app.orders.find((x) => x.id === id)
  if (!o) return <Navigate to="/orders" replace />
  const cod = o.payment === 'Cash on delivery'

  return (
    <div className="scr pb-10">
      <TopBar inner />
      <div className="px-5 pt-3">
        <h1 className="h1">{o.store} order</h1>
        <p className="s mt-1.5">
          Order #{o.id} · {formatWhen(o.createdAt)}
        </p>
        <div className="chips mt-2.5">
          {o.pills.map((p) => (
            <StatusPill key={p.t} kind={p.k}>
              {p.t}
            </StatusPill>
          ))}
        </div>
        {isLive(o) && (
          <Link className="btn sm mt-4" to={`/track/${o.id}`}>
            Track order
          </Link>
        )}

        <div className="dk gc mt-[18px]">
          <span className="h3">Items ({o.items.length})</span>
          {o.items.map((it) => (
            <CartItemRow key={it.title} title={it.title} size={it.size} price={inr(it.price * it.qty)} qty={it.qty} mode="qty" />
          ))}
        </div>
        <div className="mt-3">
          <BillCard rows={o.bill} total={inr(o.total)} totalLabel={cod ? 'To pay' : 'Total paid'} />
        </div>
        <div className="dk gc mt-3">
          <div className="flex items-center gap-3">
            <Icon name={cod ? 'cash' : 'upi'} />
            <span className="flex-1 text-sm">{cod ? 'Cash on delivery' : `Paid via ${o.payment.split(' · ')[0]}`}</span>
          </div>
          <div className="hr my-3.5" />
          <div className="flex items-start gap-3">
            <Icon name="pin" />
            <div className="flex flex-1 flex-col gap-1">
              <span className="h3">{o.address.label}</span>
              <span className="s whitespace-pre-line">{o.address.lines}</span>
            </div>
          </div>
        </div>
        {o.store === 'Instamart' ? (
          <SwiggyHelp />
        ) : (
          <div className="dk gc mt-3 flex items-start gap-3">
            <Icon name="help" />
            <p className="flex-1 text-sm leading-[1.45]">For help, go to Help in the Zepto app</p>
          </div>
        )}
      </div>
    </div>
  )
}
