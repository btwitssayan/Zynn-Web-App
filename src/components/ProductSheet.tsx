import { Link } from 'react-router'
import { useState, type UIEvent } from 'react'
import { PRODUCTS } from '../data/products'
import { inr2 } from '../lib/format'
import { useApp } from '../store/AppStore'
import { EmptyState } from './Bits'
import { Icon } from './Icon'
import { LiquidGlassCard } from './ui/liquid-glass'
import { BottomSheet, InfoDialog } from './Overlays'
import { CustomerReviews, ProductDescription, ZynnSays, ZynnSpark } from './ProductDetails'
import { StoreOptionRow } from './StoreOptionRow'
import { OnlineStores, type OnlineStore } from './OnlineStores'

export function ProductSheet({ id, onClose }: { id: string; onClose: () => void }) {
  const app = useApp()
  const p = PRODUCTS[id]

  if (!p) {
    return (
      <BottomSheet onClose={onClose} grab={false} className="top-11 overflow-hidden p-0" label="Product unavailable">
        <EmptyState
          icon="warn"
          title="No longer available"
          sub="Zynn can't find this product anymore — it may have been removed from the reel it came from."
        >
          <button className="btn" onClick={onClose}>
            Back to your reel
          </button>
        </EmptyState>
      </BottomSheet>
    )
  }

  const offers = [...p.offers].sort((a, b) => a.price - b.price)
  const connectedOffers = offers.filter((o) => app.connected[o.store])
  const lowestConnectedPrice = connectedOffers.length > 1 ? Math.min(...connectedOffers.map((o) => o.price)) : null
  const checkedStores = p.offers.map((o) => o.store)
  const checkedLabel =
    checkedStores.length > 1 ? `${checkedStores[0]} & ${checkedStores[1]}` : checkedStores[0]
  const online: OnlineStore[] = [
    ...(p.fallback ?? []),
    ...(p.brandSite ? [{ store: 'Brand website', price: p.brandSite }] : []),
  ].sort((a, b) => a.price - b.price)
  const saved = app.favourites.includes(id)
  const visit = (store: string) => app.toast(`Opening ${store}…`)
  const gallery = p.images?.length ? p.images : p.image ? [p.image] : []
  const [activeImage, setActiveImage] = useState(0)
  const [info, setInfo] = useState<{ title: string; body: string } | null>(null)

  const handleGalleryScroll = (event: UIEvent<HTMLDivElement>) => {
    const scroller = event.currentTarget
    if (!scroller.clientWidth) return
    setActiveImage(Math.round(scroller.scrollLeft / scroller.clientWidth))
  }

  return (
    <BottomSheet onClose={onClose} grab={false} className="top-11 overflow-hidden p-0" label={p.title}>
      <div className="h-full overflow-y-auto">
        <div className={`ph relative h-[220px] text-sm ${gallery.length ? 'p-0' : 'p-12'}`}>
          {gallery.length ? (
            <div
              className="pd-gallery absolute inset-0"
              aria-label={`${p.title} images`}
              onScroll={handleGalleryScroll}
            >
              {gallery.map((src, i) => (
                <figure key={src} className="pd-gallery-slide">
                  <img src={src} alt={`${p.title} image ${i + 1}`} className="h-full w-full object-cover" />
                </figure>
              ))}
            </div>
          ) : (
            p.title
          )}
          {gallery.length > 1 && (
            <div className="pd-gallery-position" role="img" aria-label={`Image ${activeImage + 1} of ${gallery.length}`}>
              {gallery.map((_, i) => (
                <span key={i} className={i === activeImage ? 'on' : undefined} />
              ))}
            </div>
          )}
          <div className="absolute top-2 left-1/2 h-[5px] w-10 -translate-x-1/2 rounded bg-[#D0D0D5]" />
          {/* Floats over the product photo, where refraction reads best. */}
          <LiquidGlassCard press className="!absolute top-3.5 right-3.5 h-11 w-11" borderRadius="999px" distortion="sm" tint="rgba(60,60,67,.18)">
            <button className="rb h-full w-full text-white" aria-label="Close" onClick={onClose}>
              <Icon name="close" size={26} strokeWidth={1.8} />
            </button>
          </LiquidGlassCard>
        </div>

        <div className="px-5 pt-12 pb-14">
          <div className="pd-identity flex items-start gap-3">
            <div className="flex-1">
              <p className="pd-brand">{p.brand}</p>
              <h2 className="pd-title mt-0.5">{p.title}</h2>
            </div>
            <button
              className="rb g"
              aria-label={saved ? 'Remove from favourites' : 'Save to favourites'}
              aria-pressed={saved}
              onClick={() => app.toggleFav(id)}
              style={{ color: saved ? 'var(--z-fav)' : undefined }}
            >
              <Icon name="heart" size={26} strokeWidth={1.8} fill={saved ? 'var(--z-fav)' : 'none'} />
            </button>
          </div>
          {p.facts.length > 0 && (
            <div className="chips pd-facts mt-8">
              {p.facts.map((f) => (
                <span key={f} className="chip f">
                  {f}
                </span>
              ))}
            </div>
          )}

          {offers.length > 0 && (
            <section className="pr-panel pd-buy-section" aria-label="Quick commerce">
              <header className="pr-head">
                <span className="pr-label pr-label-zynn">
                  <ZynnSpark className="pr-spark" />
                  <span className="pr-zynn-text">Zynn checked {checkedLabel}</span>
                </span>
                <button
                  className="pr-info"
                  aria-label="About quick delivery"
                  onClick={() =>
                    setInfo({
                      title: 'Quick commerce',
                      body: "Add items to cart and check out through your connected stores — Instamart or Zepto. \"Best · connected\" marks the lowest price among stores you're logged into; other stores may be cheaper once you connect them. Delivery times and availability can vary by location.",
                    })
                  }
                >
                  <Icon name="info" size={20} strokeWidth={2} />
                </button>
              </header>
              <p className="pr-fresh">Checked just now · prices can shift by the time you order</p>
              {offers.map((o) => {
                const q = app.lineQty(id, o.store)
                const connected = app.connected[o.store]
                const hasDiscount = o.mrp != null && o.mrp > o.price
                return (
                  <StoreOptionRow
                    key={o.store}
                    store={o.store}
                    price={inr2(o.price)}
                    mrp={hasDiscount ? inr2(o.mrp!) : undefined}
                    savingsPct={hasDiscount ? Math.round(((o.mrp! - o.price) / o.mrp!) * 100) : undefined}
                    subtotal={q > 1 ? inr2(o.price * q) : undefined}
                    eta={o.eta}
                    kind={q ? 'added' : 'add'}
                    lowest={connected && o.price === lowestConnectedPrice}
                    connected={connected}
                    qty={q}
                    max={o.max}
                    onAdd={() => app.add(id, o.store)}
                    onInc={() => app.setQty(id, o.store, q + 1)}
                    onDec={() => app.setQty(id, o.store, q - 1)}
                  />
                )
              })}
            </section>
          )}

          {!offers.length && !online.length && (
            <div className="pr-panel pr-unavailable pd-buy-section" role="status">
              <Icon name="warn" size={20} strokeWidth={1.8} />
              <p>Zynn couldn't find this anywhere right now — not on Instamart, Zepto, or any listed online store.</p>
            </div>
          )}

          {!offers.length && !!online.length && (
            <div className="pr-panel pr-unavailable pd-buy-section" role="status">
              <Icon name="warn" size={20} strokeWidth={1.8} />
              <p>Not available on Instamart or Zepto right now.</p>
            </div>
          )}

          <OnlineStores
            stores={online}
            className="pd-store-section"
            onVisit={(store) => visit(store === 'Brand website' ? 'brand website' : store)}
            onInfo={() =>
              setInfo({
                title: 'E-commerce prices',
                body: "Zynn checked prices across the stores listed here. You'll complete the purchase on the store's own website.",
              })
            }
          />

          {p.zynnSays && (
            <ZynnSays
              text={p.zynnSays}
              relevance={p.relevance}
              onInfo={() =>
                setInfo({
                  title: 'How Zynn picks',
                  body: 'Zynn weighs your request, review evidence, price, and availability to surface this product.',
                })
              }
            />
          )}

          {p.noReviews ? (
            <p className="s text-sm mt-4">Zynn hasn't found enough verified reviews for this one yet.</p>
          ) : (
            !!p.reviews?.length && (
              <CustomerReviews
                reviews={p.reviews}
                onInfo={() =>
                  setInfo({
                    title: 'Customer reviews',
                    body: 'Reviews are collected from the stores listed above and shown with their original source.',
                  })
                }
                onReadAll={() => app.toast('Opening all reviews…')}
              />
            )
          )}

          {p.description && <ProductDescription text={p.description} />}
        </div>

        <div className="sticky bottom-0 flex justify-end px-5 pb-6">
          <LiquidGlassCard press className="h-12" borderRadius="999px" distortion="sm" tint="var(--z-lens)">
            <Link
              to={`/chat?p=${id}`}
              onClick={onClose}
              className="flex h-full items-center gap-2 px-5 text-sm font-semibold text-z-tx"
            >
              <Icon name="arrowRight" />
              Follow up
            </Link>
          </LiquidGlassCard>
        </div>
      </div>
      {info && (
        <InfoDialog title={info.title} onClose={() => setInfo(null)}>
          {info.body}
        </InfoDialog>
      )}
    </BottomSheet>
  )
}
