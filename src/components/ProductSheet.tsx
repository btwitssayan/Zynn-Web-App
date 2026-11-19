import { Link } from 'react-router'
import { useState, type UIEvent } from 'react'
import { PRODUCTS } from '../data/products'
import { inr2 } from '../lib/format'
import { useApp } from '../store/AppStore'
import { Icon } from './Icon'
import { LiquidGlass } from './ui/liquid-glass'
import { BottomSheet } from './Overlays'
import { CustomerReviews, ProductDescription, ZynnSays } from './ProductDetails'
import { StoreOptionRow } from './StoreOptionRow'

export function ProductSheet({ id, onClose }: { id: string; onClose: () => void }) {
  const app = useApp()
  const p = PRODUCTS[id]
  const offers = [...p.offers].sort((a, b) => a.price - b.price)
  const online = [...(p.fallback ?? [])].sort((a, b) => a.price - b.price)
  const saved = app.favourites.includes(id)
  const visit = (store: string) => app.toast(`Opening ${store}…`)
  const gallery = p.images?.length ? p.images : p.image ? [p.image] : []
  const [activeImage, setActiveImage] = useState(0)

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
          <LiquidGlass press className="!absolute top-3.5 right-3.5 h-11 w-11" tint="rgba(60,60,67,.18)" frost={0.4}>
            <button className="rb h-full w-full text-white" aria-label="Close" onClick={onClose}>
              <Icon name="close" />
            </button>
          </LiquidGlass>
        </div>

        <div className="px-5 pt-[18px] pb-6">
          <div className="flex items-start gap-3">
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
              <Icon name="heart" fill={saved ? '#FF4D61' : 'none'} />
            </button>
          </div>
          {p.facts.length > 0 && (
            <div className="chips mt-3.5">
              {p.facts.map((f) => (
                <span key={f} className="chip f">
                  {f}
                </span>
              ))}
            </div>
          )}

          {offers.length > 0 && (
            <div className="pr-panel mt-4">
              <div className="pr-head">
                <p className="pr-title">Quick commerce</p>
                <span className="pr-sub">Delivered in minutes</span>
              </div>
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
            </div>
          )}

          {!offers.length && <p className="s mt-4">Not available on Instamart or Zepto right now.</p>}

          {(online.length > 0 || p.brandSite) && (
            <div className={`pr-panel ${offers.length ? 'mt-3' : 'mt-2.5'}`}>
              <div className="pr-head">
                <p className="pr-title">Online stores</p>
                <span className="pr-sub">Compare instantly</span>
              </div>
              {online.map((f, i) => (
                <StoreOptionRow
                  key={f.store}
                  store={f.store}
                  price={inr2(f.price)}
                  kind="fb"
                  logo={f.logo}
                  lowest={online.length > 1 && i === 0}
                  onVisit={() => visit(f.store)}
                />
              ))}
              {p.brandSite && (
                <StoreOptionRow
                  store="Brand website"
                  price={inr2(p.brandSite)}
                  kind="visit"
                  onVisit={() => visit('brand website')}
                />
              )}
            </div>
          )}
          {!offers.length && !online.length && p.brandSite && (
            <p className="s mt-2.5">You'll complete this purchase on their website.</p>
          )}

          {p.zynnSays && (
            <ZynnSays
              text={p.zynnSays}
              relevance={p.relevance}
              onInfo={() => app.toast('Zynn weighs your request, reviews and prices to pick this')}
            />
          )}

          {p.noReviews ? (
            <p className="s mt-4">We could not gather enough verified review evidence for this product.</p>
          ) : (
            !!p.reviews?.length && (
              <CustomerReviews
                reviews={p.reviews}
                onInfo={() => app.toast('Reviews are collected from the stores listed above')}
                onReadAll={() => app.toast('Opening all reviews…')}
              />
            )
          )}

          {p.description && <ProductDescription text={p.description} />}
        </div>

        <div className="sticky bottom-0 flex justify-end px-5 pb-6">
          <LiquidGlass press className="h-12" tint="rgba(30,30,34,.55)" frost={0.6}>
            <Link
              to={`/chat?p=${id}`}
              onClick={onClose}
              className="flex h-full items-center gap-2 px-5 text-[15px] font-semibold text-z-tx"
            >
              <Icon name="arrowRight" />
              Follow up
            </Link>
          </LiquidGlass>
        </div>
      </div>
    </BottomSheet>
  )
}
