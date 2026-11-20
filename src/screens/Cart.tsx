import { Link, useNavigate } from 'react-router'
import { CartItemRow, EmptyState, Note } from '../components/Bits'
import { Icon } from '../components/Icon'
import { SlideToCheckout } from '../components/SlideToCheckout'
import { TopBar } from '../components/TopBar'
import { NumberTicker } from '../components/ui/number-ticker'
import { offerFor, PRODUCTS, storeLabel, displayPrice } from '../data/products'
import { STORES } from '../data/types'
import { MIN_ORDER } from '../lib/bill'
import { inr } from '../lib/format'
import { unitPrice, useApp } from '../store/AppStore'

export default function Cart() {
  const app = useApp()
  const nav = useNavigate()
  const stores = STORES.filter((s) => app.cart.some((l) => l.store === s))
  const savedLinks = app.favourites.map((id) => PRODUCTS[id]).filter((p) => !p.offers.length)

  if (!app.cart.length)
    return (
      <div className="scr">
        <TopBar inner />
        <EmptyState icon="bag" title="Your cart is empty" sub="Add products from a reel and they'll show up here.">
          <Link className="btn" to="/">
            Back to your reel
          </Link>
        </EmptyState>
      </div>
    )

  const groups = stores.map((s) => {
    const lines = app.cart.filter((l) => l.store === s)
    const total = lines.reduce((sum, l) => sum + unitPrice(l) * l.qty, 0)
    return { store: s, lines, total, short: Math.max(0, MIN_ORDER - total) }
  })
  const blocked = groups.some((g) => g.short > 0)

  const checkout = () => {
    const s = app.startCheckout()
    nav(s.every((x) => app.connected[x]) ? '/address' : '/connect')
  }

  return (
    <div className="scr pb-36">
      <TopBar inner />
      <div className="px-5 pt-3">
        <h1 className="h1">Your cart</h1>
        <p className="s mt-1.5">
          {app.cartCount} {app.cartCount === 1 ? 'item' : 'items'} · <NumberTicker value={app.cartTotal} format={inr} />
        </p>

        {groups.map((g, i) => (
          <div key={g.store} className={`g gc ${i === 0 ? 'mt-[18px]' : 'mt-3'}`}>
            <div className="flex items-center gap-1.5">
              <span className="h3">{g.store}</span>
              <span className="s">
                · Order {i + 1} of {groups.length}
              </span>
            </div>
            {g.lines.map((l) => {
              const p = PRODUCTS[l.productId]
              const o = offerFor(p, l.store)
              const max = o?.max ?? 9
              return (
                <CartItemRow
                  key={l.productId}
                  title={p.title}
                  size={p.size}
                  price={inr(unitPrice(l) * l.qty)}
                  mrp={o?.mrp ? inr(o.mrp * l.qty) : undefined}
                  qty={l.qty}
                  atMax={l.qty >= max}
                  maxNote={o?.max && l.qty >= o.max ? `Max ${o.max} per order` : undefined}
                  oos={p.oos}
                  onInc={() => app.setQty(l.productId, l.store, l.qty + 1)}
                  onDec={() => app.setQty(l.productId, l.store, l.qty - 1)}
                  onRemove={() => app.setQty(l.productId, l.store, 0)}
                />
              )
            })}
            {g.short > 0 && (
              <div className="mt-1 mb-2.5">
                <Note text={`Add ${inr(g.short)} more to order from ${g.store} (minimum ${inr(MIN_ORDER)})`} />
              </div>
            )}
            <div className="hr mt-1" />
            <div className="kv mt-1.5">
              <span className="mut">Item total</span>
              <b>
                <NumberTicker value={g.total} format={inr} />
              </b>
            </div>
          </div>
        ))}

        {groups.length > 1 && <p className="s mt-3.5 text-center">Each store delivers and bills separately.</p>}

        {savedLinks.length > 0 && (
          <>
            <p className="cap mt-6">Saved links</p>
            {savedLinks.map((p) => (
              <div key={p.id} className="flex min-h-16 items-center gap-3">
                <div className="ph h-11 w-11 rounded-xl text-[6px]">{p.short}</div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-sm">{p.title}</span>
                  <span className="xs">
                    {inr(displayPrice(p))} · {storeLabel(p)}
                  </span>
                </div>
                <button
                  className="btn sm o h-10 gap-1"
                  onClick={() => app.toast(`Opening ${storeLabel(p).replace('on ', '')}…`)}
                >
                  Visit <Icon name="arrowUpRight" size={13} strokeWidth={2} />
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="foot">
        <SlideToCheckout
          onSlideComplete={checkout}
          disabled={blocked}
          ordersCount={groups.length}
          disabledLabel="Minimum order not met"
        />
      </div>
    </div>
  )
}
