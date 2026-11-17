import type { MouseEvent } from 'react'
import { Icon } from './Icon'

interface Props {
  title: string
  price: string
  store: string
  kind: 'buy' | 'added' | 'visit' | 'oos'
  image?: string
  saved?: boolean
  qty?: number
  photoHeight?: number
  className?: string
  onOpen?: () => void
  onAdd?: () => void
  onInc?: () => void
  onDec?: () => void
  onVisit?: () => void
  onToggleSave?: () => void
}

const stop = (fn?: () => void) => (e: MouseEvent) => {
  e.stopPropagation()
  fn?.()
}

const lift = 'border border-[#E4E4E8] shadow-[0_4px_14px_rgba(0,0,0,.18)]'

export function ProductCard({ title, price, store, kind, image, saved, qty = 1, photoHeight = 190, className = '', ...on }: Props) {
  return (
    <div
      className={`cursor-pointer overflow-hidden rounded-[26px] bg-z-strip text-z-tx ${kind === 'added' ? 'z-sel' : ''} ${className}`}
      style={{ opacity: kind === 'oos' ? 0.5 : 1 }}
      onClick={on.onOpen}
    >
      <div className={`ph relative text-xs ${image ? 'p-0' : 'p-6'}`} style={{ height: photoHeight }}>
        {image ? <img src={image} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" /> : title}
        <button
          className="rb absolute top-2.5 right-2.5 border border-white/50 bg-[rgba(60,60,67,.32)]"
          style={{ color: saved ? '#FF4D61' : '#fff' }}
          aria-label={saved ? 'Remove from favourites' : 'Save'}
          aria-pressed={!!saved}
          onClick={stop(on.onToggleSave)}
        >
          <Icon name="heart" fill={saved ? '#FF4D61' : 'none'} />
        </button>
        {kind === 'oos' && (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-[rgba(20,20,22,.88)] px-2.5 py-1.5 text-[11px] font-semibold text-z-tx">
            Out of stock
          </span>
        )}
        <div className="absolute right-2.5 bottom-2.5" onClick={(e) => e.stopPropagation()}>
          {kind === 'buy' && (
            <button className={`rb h-10 w-10 bg-white text-black ${lift}`} aria-label="Add to cart" onClick={on.onAdd}>
              <Icon name="plus" />
            </button>
          )}
          {kind === 'added' && (
            <div className={`cnt ${lift}`}>
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
            <button className={`btn sm h-10 gap-1 px-4 ${lift}`} onClick={on.onVisit}>
              Visit <Icon name="arrowUpRight" size={13} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
      <div className="px-3.5 pt-3 pb-3.5">
        <p className="line-clamp-2 h-10 text-[15px] leading-5">{title}</p>
        <p className="mt-1 text-xl font-bold">{price}</p>
        <p className="xs mt-0.5">{store}</p>
      </div>
    </div>
  )
}
