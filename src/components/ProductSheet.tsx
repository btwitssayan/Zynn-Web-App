import { Link } from 'react-router'
import { useState, type UIEvent } from 'react'
import { PRODUCTS } from '../data/products'
import { inr2 } from '../lib/format'
import { useApp } from '../store/AppStore'
import { Icon } from './Icon'
import { LiquidGlassCard } from './ui/liquid-glass'
import { BottomSheet, InfoDialog } from './Overlays'
import { CustomerReviews, ProductDescription, ZynnSays } from './ProductDetails'
import { StoreOptionRow } from './StoreOptionRow'
import { OnlineStores, type OnlineStore } from './OnlineStores'

export function ProductSheet({ id, onClose }: { id: string; onClose: () => void }) {
  const app = useApp()
  const p = PRODUCTS[id]
  const offers = [...p.offers].sort((a, b) => a.price - b.price)
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
        <div className={`ph relative h-[220px] text-[13px] ${gallery.length ? 'p-0' : 'p-12'}`}>
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
              <p className="s text-sm">{p.brand}</p>
              <h2 className="h2 mt-0.5 text-[21px]">{p.title}</h2>
            </div>
            <button
              className="rb g"
              aria-label={saved ? 'Remove from favourites' : 'Save to favourites'}
              aria-pressed={saved}
              onClick={() => app.toggleFav(id)}
              style={{ color: saved ? '#FF4D61' : undefined }}
            >
              <Icon name="heart" size={26} strokeWidth={1.8} fill={saved ? '#FF4D61' : 'none'} />
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
                <span className="pr-label pr-label-fast">
                  <Icon name="bolt" size={16} strokeWidth={2} />
                  Delivered in minutes
                </span>
                <button
                  className="pr-info"
                  aria-label="About quick delivery"
                  onClick={() =>
                    setInfo({
                      title: 'Quick commerce',
                      body: 'Add items to cart and check out through Instamart or Zepto. Delivery times and availability can vary by location.',
                    })
                  }
                >
                  <Icon name="info" size={20} strokeWidth={2} />
                </button>
              </header>
              {offers.map((o, i) => {
                const q = app.lineQty(id, o.store)
                return (
                  <StoreOptionRow
                    key={o.store}
                    store={o.store}
                    price={inr2(o.price)}
                    eta={o.eta}
                    kind={q ? 'added' : 'add'}
                    lowest={offers.length > 1 && i === 0}
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

          {!offers.length && <p className="pd-buy-note">Not available on Instamart or Zepto right now.</p>}

          <OnlineStores
            stores={online}
            className="pd-store-section"
            onVisit={(store) => visit(store === 'Brand website' ? 'brand website' : store)}
            onInfo={() =>
              setInfo({
                title: 'E-commerce prices',
                body: "These prices come from the stores listed here. You'll complete the purchase on the store's own website.",
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
            <p className="s mt-4">We could not gather enough verified review evidence for this product.</p>
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
              className="flex h-full items-center gap-2 px-5 text-[15px] font-semibold text-z-tx"
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
