import { StoreLogo } from './StoreLogo'
import { Icon } from './Icon'

interface Props {
  store: string
  price: string
  kind: 'add' | 'added' | 'visit' | 'fb'
  eta?: string
  lowest?: boolean
  /** Kept for API compatibility; rows are divided by the panel. */
  line?: boolean
  logo?: string
  qty?: number
  max?: number
  onAdd?: () => void
  onInc?: () => void
  onDec?: () => void
  onVisit?: () => void
}

/**
 * Price with the currency sign and paise set small and raised, so the rupee
 * figure carries the weight: ₹299⁰⁰. Screen readers get the plain string.
 */
export function Price({ value, className = '' }: { value: string; className?: string }) {
  const m = value.match(/^(\D*)([\d,]+)(?:\.(\d+))?$/)
  if (!m) return <span className={className}>{value}</span>
  const [, cur, whole, frac] = m
  return (
    <span className={`price ${className}`}>
      <span className="sr-only">{value}</span>
      <span className="price-sup" aria-hidden="true">
        {cur}
      </span>
      <span aria-hidden="true">{whole}</span>
      {frac && (
        <span className="price-sup" aria-hidden="true">
          {frac}
        </span>
      )}
    </span>
  )
}

/**
 * One store row inside a buying panel. Quick-commerce rows (add / added) carry
 * price and delivery time under the name with a cart control; online rows
 * (visit / fb) are compact and open the store's site.
 */
export function StoreOptionRow({ store, price, kind, eta, lowest, logo, qty = 1, max = 9, ...on }: Props) {
  if (kind === 'visit' || kind === 'fb') {
    return (
      <div className="pr-row pr-row-sm">
        <span className="pr-logo">
          <StoreLogo store={store} fallback={logo} />
        </span>
        <span className="pr-name">{store}</span>
        <Price value={price} className="pr-amt" />
        <button className="pr-go" onClick={on.onVisit} aria-label={`Visit ${store}`}>
          Visit
          <Icon name="arrowUpRight" size={16} strokeWidth={2.2} />
        </button>
      </div>
    )
  }

  return (
    <div className={`pr-row${lowest ? ' is-best' : ''}`}>
      <span className="pr-logo">
        <StoreLogo store={store} fallback={logo} />
      </span>
      <span className="pr-copy">
        <span className="pr-name-line">
          <span className="pr-name">{store}</span>
          {lowest && <span className="pr-best">Best price</span>}
        </span>
        <span className="pr-price-line">
          <Price value={price} className="pr-amt" />
          {eta && <span className="pr-eta">{eta}</span>}
        </span>
      </span>

      {kind === 'add' && (
        <button className="pr-visit" onClick={on.onAdd} aria-label={`Add from ${store}`}>
          Add
        </button>
      )}
      {kind === 'added' && (
        <div className="pr-step" role="group" aria-label={`${store} quantity`}>
          <button aria-label="Remove one" onClick={on.onDec}>
            −
          </button>
          <span aria-live="polite">{qty}</span>
          <button aria-label="Add one" onClick={on.onInc} disabled={qty >= max}>
            +
          </button>
        </div>
      )}
    </div>
  )
}
