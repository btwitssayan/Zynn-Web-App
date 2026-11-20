import { StoreLogo } from './StoreLogo'
import { Icon } from './Icon'

interface Props {
  store: string
  price: string
  /** Pre-formatted, struck-through list price; shown with savingsPct when the offer carries a discount. */
  mrp?: string
  /** Whole-number percent saved vs. mrp. */
  savingsPct?: number
  /** Pre-formatted qty × price total; shown only while qty > 1. */
  subtotal?: string
  kind: 'add' | 'added' | 'visit' | 'fb'
  eta?: string
  lowest?: boolean
  /** Whether the user is logged into this store inside Zynn. Quick-commerce rows only; defaults to true for rows (visit/fb) where connection doesn't apply. */
  connected?: boolean
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
export function StoreOptionRow({
  store,
  price,
  mrp,
  savingsPct,
  subtotal,
  kind,
  eta,
  lowest,
  connected = true,
  logo,
  qty = 1,
  max = 9,
  ...on
}: Props) {
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
          {lowest && <span className="pr-best">Best · connected</span>}
          {!connected && <span className="pr-notconn">Not connected</span>}
        </span>
        <span className="pr-price-line">
          <Price value={price} className="pr-amt" />
          {eta && <span className="pr-eta">{eta}</span>}
        </span>
        {mrp && (
          <span className="pr-mrp-line">
            <span className="pr-mrp-strike">{mrp}</span>
            {savingsPct != null && <span className="pr-mrp-pct">{savingsPct}% off</span>}
          </span>
        )}
        {subtotal && (
          <span className="pr-line-total">
            {qty} × {price} = {subtotal}
          </span>
        )}
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
