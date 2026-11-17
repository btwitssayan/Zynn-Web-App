import { Link } from 'react-router'
import { PRODUCTS } from '../data/products'
import { inr2 } from '../lib/format'
import { useApp } from '../store/AppStore'
import { Icon } from './Icon'
import { BottomSheet } from './Overlays'
import { StoreOptionRow } from './StoreOptionRow'

export function ProductSheet({ id, onClose }: { id: string; onClose: () => void }) {
  const app = useApp()
  const p = PRODUCTS[id]
  const offers = [...p.offers].sort((a, b) => a.price - b.price)
  const saved = app.favourites.includes(id)
  const visit = (store: string) => app.toast(`Opening ${store}…`)

  return (
    <BottomSheet onClose={onClose} grab={false} className="top-11 overflow-hidden p-0" label={p.title}>
      <div className="h-full overflow-y-auto">
        <div className={`ph relative h-[220px] text-[13px] ${p.image ? 'p-0' : 'p-12'}`}>
          {p.image ? <img src={p.image} alt={p.title} className="absolute inset-0 h-full w-full object-cover" /> : p.title}
          <div className="absolute top-2 left-1/2 h-[5px] w-10 -translate-x-1/2 rounded bg-[#D0D0D5]" />
          <button
            className="rb absolute top-3.5 right-3.5 border border-white/50 bg-[rgba(60,60,67,.32)] text-white"
            aria-label="Close"
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="px-5 pt-[18px] pb-6">
          <div className="flex items-start gap-3">
            <h2 className="h2 flex-1 text-[21px]">{p.title}</h2>
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
          <p className="s mt-0.5 text-sm">{p.brand}</p>
          {p.noReviews && <p className="s mt-2.5">We could not gather enough verified review evidence for this product.</p>}
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
            <>
              <div className="dk mt-4 px-4 pt-3 pb-1">
                <p className="h3">Buy from</p>
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
                      line={i > 0}
                      qty={q}
                      max={o.max}
                      onAdd={() => app.add(id, o.store)}
                      onInc={() => app.setQty(id, o.store, q + 1)}
                      onDec={() => app.setQty(id, o.store, q - 1)}
                    />
                  )
                })}
              </div>
              {p.brandSite && (
                <div className="dk mt-3 px-4 pt-3 pb-1">
                  <p className="h3">Also on</p>
                  <StoreOptionRow
                    store="Brand website"
                    price={inr2(p.brandSite)}
                    kind="visit"
                    onVisit={() => visit('brand website')}
                  />
                </div>
              )}
            </>
          )}

          {!offers.length && p.fallback && (
            <>
              <p className="s mt-3.5">Not available on Instamart, Zepto or brand stores right now.</p>
              <div className="dk mt-2.5 px-4 pt-3 pb-1">
                <div className="flex items-center justify-between">
                  <p className="h3">Best prices</p>
                  <span className="xs">Compare instantly</span>
                </div>
                {p.fallback.map((f, i) => (
                  <StoreOptionRow
                    key={f.store}
                    store={f.store}
                    price={inr2(f.price)}
                    kind="fb"
                    logo={f.logo}
                    line={i > 0}
                    onVisit={() => visit(f.store)}
                  />
                ))}
              </div>
            </>
          )}

          {!offers.length && !p.fallback && p.brandSite && (
            <>
              <div className="dk mt-1 px-4 pt-3 pb-1">
                <p className="h3">Buy on the brand's website</p>
                <StoreOptionRow
                  store="Brand website"
                  price={inr2(p.brandSite)}
                  kind="visit"
                  onVisit={() => visit('brand website')}
                />
              </div>
              <p className="s mt-2.5">You'll complete this purchase on their website.</p>
            </>
          )}
        </div>

        <div className="sticky bottom-0 flex justify-end px-5 pb-6">
          <Link
            to={`/chat?p=${id}`}
            onClick={onClose}
            className="g flex h-12 items-center gap-2 rounded-full bg-[rgba(30,30,34,.85)] px-5 text-[15px] font-semibold text-z-tx"
          >
            <Icon name="arrowRight" />
            Follow up
          </Link>
        </div>
      </div>
    </BottomSheet>
  )
}
