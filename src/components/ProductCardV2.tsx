import type { CSSProperties, KeyboardEvent, MouseEvent } from 'react'
import type { Tag } from '../data/types'
import { Icon } from './Icon'

export type CardKind = 'buy' | 'picked' | 'added' | 'visit' | 'oos'

interface Props {
  title: string
  size: string
  price: string
  store: string
  kind: CardKind
  tag: Tag
  image?: string
  qty?: number
  index?: number
  onOpen?: () => void
  onAdd?: () => void
  onInc?: () => void
  onDec?: () => void
  onVisit?: () => void
}

const stop = (fn?: () => void) => (e: MouseEvent) => {
  e.stopPropagation()
  fn?.()
}

export function ProductCardV2({ title, size, price, store, kind, tag, image, qty = 1, index = 0, ...on }: Props) {
  const selected = kind === 'added' || kind === 'picked'
  const tagClass = tag === 'In reel' ? 'stk reel' : tag === 'Cheaper' ? 'stk cheap' : 'stk blk'
  const onKey = (e: KeyboardEvent) => {
    if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      on.onOpen?.()
    }
  }

  return (
    <div
      className={`pc${selected ? ' on' : ''}${kind === 'oos' ? ' off' : ''}`}
      style={{ '--i': index } as CSSProperties}
      role="button"
      tabIndex={0}
      aria-label={`${title}, ${price}`}
      onClick={on.onOpen}
      onKeyDown={onKey}
    >
      <div className="im">
        {image ? <img src={image} alt="" loading="lazy" decoding="async" /> : title}
        {tag && <span className={tagClass}>{tag}</span>}
        {selected && (
          <span className="tk">
            <Icon name="check" size={14} strokeWidth={2.6} />
          </span>
        )}
      </div>
      <div className="bd">
        <p className="nm">{title}</p>
        <p className="sz">{size}</p>
        <p className="pr">{price}</p>
        {store && <p className="st">{store}</p>}
      </div>
      {(kind === 'buy' || kind === 'picked') && (
        <button className="ad" aria-label={`Add ${title} to cart`} onClick={stop(on.onAdd)}>
          <Icon name="plus" size={18} strokeWidth={2.2} />
        </button>
      )}
      {kind === 'added' && (
        <div className="ct" onClick={(e) => e.stopPropagation()}>
          <button aria-label="Remove one" onClick={on.onDec}>
            −
          </button>
          <span>{qty}</span>
          <button aria-label="Add one" onClick={on.onInc}>
            +
          </button>
        </div>
      )}
      {kind === 'visit' && (
        <button className="vs gap-1" onClick={stop(on.onVisit)}>
          Visit <Icon name="arrowUpRight" size={12} strokeWidth={2.2} />
        </button>
      )}
      {kind === 'oos' && <span className="oos">Out of stock</span>}
    </div>
  )
}
