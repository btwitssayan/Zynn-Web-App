import { Icon } from './Icon'

interface Props {
  store: string
  price: string
  kind: 'add' | 'added' | 'visit' | 'fb'
  eta?: string
  lowest?: boolean
  line?: boolean
  logo?: string
  qty?: number
  max?: number
  onAdd?: () => void
  onInc?: () => void
  onDec?: () => void
  onVisit?: () => void
}

export function StoreOptionRow({ store, price, kind, eta, lowest, line, logo, qty = 1, max = 9, ...on }: Props) {
  return (
    <div className={`flex min-h-[68px] items-center gap-3 py-2.5 ${line ? 'border-t border-white/8' : ''}`}>
      {logo && (
        <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-white text-sm font-extrabold text-z-strip">
          {logo}
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-semibold">{store}</span>
          {lowest && <span className="tag">Lowest</span>}
        </div>
        {eta && <span className="xs">{eta}</span>}
      </div>
      <span className="text-base font-bold">{price}</span>
      {kind === 'add' && (
        <button className="btn sm h-10 min-w-[72px] px-4" onClick={on.onAdd}>
          Add
        </button>
      )}
      {kind === 'added' && (
        <div className="cnt o">
          <button aria-label="Remove one" onClick={on.onDec}>
            −
          </button>
          <span>{qty}</span>
          <button aria-label="Add one" onClick={on.onInc} disabled={qty >= max}>
            +
          </button>
        </div>
      )}
      {kind === 'visit' && (
        <button className="btn sm h-10 gap-1 px-4" onClick={on.onVisit}>
          Visit <Icon name="arrowUpRight" size={13} strokeWidth={2} />
        </button>
      )}
      {kind === 'fb' && (
        <button
          className="inline-flex h-8 items-center rounded-full bg-[#2A2A2E] px-3.5 text-xs font-semibold text-z-tx"
          onClick={on.onVisit}
        >
          Visit
        </button>
      )}
    </div>
  )
}
