import { useId, useState } from 'react'
import { inr2 } from '../lib/format'
import { Icon } from './Icon'
import { StoreLogo } from './StoreLogo'
import { Price, StoreOptionRow } from './StoreOptionRow'

export interface OnlineStore {
  store: string
  price: number
  logo?: string
}

/**
 * E-commerce panel of the product sheet: the cheapest online store leads with a
 * large price and a Visit action; the other stores fold out underneath.
 */
export function OnlineStores({
  stores,
  onVisit,
  onInfo,
  className = '',
}: {
  stores: OnlineStore[]
  onVisit: (store: string) => void
  onInfo: () => void
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const listId = useId()
  if (!stores.length) return null

  const [best, ...rest] = stores
  const count = stores.length

  return (
    <section className={`pr-panel ${className}`} aria-label="E-commerce">
      <header className="pr-head">
        <span className="pr-label">{`Found at ${count} store${count === 1 ? '' : 's'}`}</span>
        <button className="pr-info" aria-label="About online prices" onClick={onInfo}>
          <Icon name="info" size={20} strokeWidth={2} />
        </button>
      </header>

      <div className="pr-lead">
        <div className="pr-lead-copy">
          <Price value={inr2(best.price)} className="pr-lead-amt" />
          <span className="pr-lead-store">
            <span className="pr-logo">
              <StoreLogo store={best.store} fallback={best.logo} />
            </span>
            <span className="truncate">at {best.store}</span>
          </span>
        </div>
        <button className="pr-visit pr-visit-out" onClick={() => onVisit(best.store)}>
          Visit store
          <Icon name="arrowUpRight" size={16} strokeWidth={2.4} />
        </button>
      </div>

      {rest.length > 0 && (
        <>
          <button
            className="pr-more"
            aria-expanded={open}
            aria-controls={listId}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Hide other stores' : `Compare ${rest.length} more store${rest.length === 1 ? '' : 's'}`}
            <Icon name="chevDown" size={18} strokeWidth={2.2} />
          </button>
          <div id={listId} className="pr-fold" data-open={open} inert={!open}>
            <div className="pr-fold-in">
              {rest.map((s) => (
                <StoreOptionRow
                  key={s.store}
                  store={s.store}
                  price={inr2(s.price)}
                  logo={s.logo}
                  kind="fb"
                  onVisit={() => onVisit(s.store)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  )
}
