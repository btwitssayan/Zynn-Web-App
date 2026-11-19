import { StoreLogo } from './StoreLogo'

interface Props {
  store: string
  price: string
  kind: 'add' | 'added' | 'visit' | 'fb'
  eta?: string
  lowest?: boolean
  /** Kept for API compatibility; cards are spaced instead of divided. */
  line?: boolean
  logo?: string
  qty?: number
  max?: number
  onAdd?: () => void
  onInc?: () => void
  onDec?: () => void
  onVisit?: () => void
}

/** One store card in the "Best prices" panel: logo, name, price and an action pill. */
export function StoreOptionRow({ store, price, kind, eta, lowest, logo, qty = 1, max = 9, ...on }: Props) {
  return (
    <div className={`pr-card${lowest ? ' is-best' : ''}`}>
      <span className="pr-logo">
        <StoreLogo store={store} fallback={logo} />
      </span>
      <span className="pr-info">
        <span className="pr-name">{store}</span>
        {eta && <span className="pr-eta">{eta}</span>}
      </span>
      <span className="pr-amt">{price}</span>

      {kind === 'add' && (
        <button className="pr-visit" onClick={on.onAdd}>
          Add
        </button>
      )}
      {kind === 'added' && (
        <div className="pr-step">
          <button aria-label="Remove one" onClick={on.onDec}>
            −
          </button>
          <span>{qty}</span>
          <button aria-label="Add one" onClick={on.onInc} disabled={qty >= max}>
            +
          </button>
        </div>
      )}
      {(kind === 'visit' || kind === 'fb') && (
        <button className="pr-visit" onClick={on.onVisit}>
          Visit
        </button>
      )}

      {lowest && (
        <span className="pr-ribbon" aria-label="Best price">
          <span className="pr-ribbon-in">
            BEST
            <br />
            PRICE
          </span>
        </span>
      )}
    </div>
  )
}
