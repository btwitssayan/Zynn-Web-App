import type { ReactNode } from 'react'
import type { PillKind } from '../data/types'
import { Icon, type IconName } from './Icon'
import { BorderBeam } from './ui/border-beam'

export function BillCard({
  rows,
  total,
  totalLabel = 'To pay',
}: {
  rows: { k: string; v: string }[]
  total: string
  totalLabel?: string
}) {
  return (
    <div className="g gc">
      <p className="h3 mb-2">Bill details</p>
      {rows.map((r) => (
        <div className="kv" key={r.k}>
          <span className="mut">{r.k}</span>
          <span className={r.v === 'Free' || r.v.startsWith('−') ? 'text-z-acc' : ''}>{r.v}</span>
        </div>
      ))}
      <div className="hr my-2.5" />
      <div className="kv text-[17px] font-extrabold">
        <span>{totalLabel}</span>
        <span>{total}</span>
      </div>
    </div>
  )
}

interface CartItemRowProps {
  title: string
  size?: string
  price: string
  mrp?: string
  qty: number
  mode?: 'counter' | 'qty'
  maxNote?: string
  atMax?: boolean
  oos?: boolean
  onInc?: () => void
  onDec?: () => void
  onRemove?: () => void
}

export function CartItemRow({
  title,
  size,
  price,
  mrp,
  qty,
  mode = 'counter',
  maxNote,
  atMax,
  oos,
  ...on
}: CartItemRowProps) {
  return (
    <div className="py-2.5">
      <div className="flex items-start gap-3" style={{ opacity: oos ? 0.45 : 1 }}>
        <div className="ph th">{title}</div>
        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <span className="line-clamp-2 text-sm leading-[19px]">{title}</span>
          {size && <span className="xs">{size}</span>}
          <div className="mt-0.5 flex items-center gap-2">
            <b className="text-[15px]">{price}</b>
            {mrp && <s className="xs">{mrp}</s>}
          </div>
        </div>
        {mode === 'counter' ? (
          <div className="flex flex-col items-end gap-1.5">
            <div className="cnt">
              <button aria-label="Remove one" onClick={on.onDec}>
                −
              </button>
              <span>{qty}</span>
              <button aria-label="Add one" onClick={on.onInc} disabled={atMax}>
                +
              </button>
            </div>
            {maxNote && <span className="xs">{maxNote}</span>}
          </div>
        ) : (
          <span className="s text-z-tx">× {qty}</span>
        )}
      </div>
      {oos && (
        <p className="err mt-2 ml-[68px] text-[13px]">
          Out of stock at this address ·{' '}
          <button className="err font-bold" onClick={on.onRemove}>
            Remove
          </button>
        </p>
      )}
    </div>
  )
}

export function Note({
  text,
  tone = 'info',
  action,
  primary,
  onAction,
}: {
  text: ReactNode
  tone?: 'info' | 'err'
  action?: string
  primary?: boolean
  onAction?: () => void
}) {
  const e = tone === 'err'
  return (
    <div
      className="flex items-start gap-2.5 rounded-[18px] px-3.5 py-3 backdrop-blur-[16px]"
      role={e ? 'alert' : undefined}
      style={{
        background: e ? 'rgba(229,128,122,.1)' : 'rgba(242,163,94,.1)',
        border: `1px solid ${e ? 'rgba(229,128,122,.35)' : 'rgba(242,163,94,.3)'}`,
      }}
    >
      <span className="mt-px flex" style={{ color: e ? 'var(--z-err)' : 'var(--z-acc-tx)' }}>
        <Icon name="info" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <p className="text-[13px] leading-[1.45]" style={{ color: e ? 'var(--z-err)' : 'var(--z-tx)' }}>
          {text}
        </p>
        {action && (
          <button className={`btn sm h-10 self-start ${primary ? '' : 'o'}`} onClick={onAction}>
            {action}
          </button>
        )}
      </div>
    </div>
  )
}

const PILL: Record<PillKind, [string, string, string]> = {
  placed: ['var(--z-tx)', 'rgb(var(--ink) / .08)', 'transparent'],
  way: ['var(--z-acc-tx)', 'rgba(242,163,94,.16)', 'transparent'],
  done: ['var(--z-mut)', 'rgb(var(--ink) / .05)', 'transparent'],
  cancel: ['var(--z-err)', 'rgba(229,128,122,.1)', 'transparent'],
  pend: ['var(--z-acc-tx)', 'transparent', 'var(--z-acc-tx)'],
}

export function StatusPill({ kind = 'placed', children }: { kind?: PillKind; children: ReactNode }) {
  const [c, bg, bd] = PILL[kind]
  return (
    <span
      className="inline-flex h-[26px] items-center rounded-full px-2.5 text-xs font-semibold whitespace-nowrap"
      style={{ color: c, background: bg, border: `1px solid ${bd}` }}
    >
      {children}
    </span>
  )
}

/** A card-shaped placeholder while Zynn reads the reel. A Magic UI border beam
 *  in the brand colours traces each card's edge: the scan in progress. `index`
 *  offsets each beam so the row reads as one sweeping pass, not lockstep. */
export function SkeletonCard({ index = 0 }: { index?: number }) {
  return (
    <div className="skc relative">
      <div className="sk h-24 rounded-none" />
      <div className="px-2.5 py-[18px]">
        <div className="sk h-3 w-[90%]" />
        <div className="sk mt-2 h-3 w-[60%]" />
        <div className="sk mt-3.5 h-[18px] w-[45%]" />
      </div>
      <BorderBeam
        size={120}
        duration={2.4}
        delay={index * 0.5}
        borderWidth={2}
        colorFrom="#f08a3c"
        colorTo="#98a5d8"
        className="skc-beam"
      />
    </div>
  )
}

export function SkeletonCardV1({ width = 232, photoHeight = 190 }: { width?: number; photoHeight?: number }) {
  return (
    <div className="overflow-hidden rounded-[26px] bg-z-strip" style={{ width }}>
      <div className="sk rounded-none" style={{ height: photoHeight }} />
      <div className="p-3.5">
        <div className="sk h-3.5 w-[90%]" />
        <div className="sk mt-2 h-3.5 w-[60%]" />
        <div className="sk mt-3.5 h-5 w-[40%]" />
      </div>
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  sub,
  children,
}: {
  icon: IconName
  title: string
  sub?: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center px-10 pt-[150px] text-center">
      <div className="g flex h-[88px] w-[88px] items-center justify-center rounded-full">
        <Icon name={icon} size={36} strokeWidth={1.4} />
      </div>
      <h2 className="h2 mt-6">{title}</h2>
      {sub && <p className="s mt-2 text-sm">{sub}</p>}
      {children && <div className="mt-7">{children}</div>}
    </div>
  )
}

export function Tick({ tone = 'ok' }: { tone?: 'ok' | 'err' | 'warn' }) {
  if (tone === 'err')
    return (
      <div className="tick" style={{ background: 'rgba(229,128,122,.12)', color: 'var(--z-err)', boxShadow: 'none' }}>
        <Icon name="close" />
      </div>
    )
  return (
    <div className="tick" style={tone === 'warn' ? { boxShadow: 'none' } : undefined}>
      <Icon name={tone === 'warn' ? 'warn' : 'check'} />
    </div>
  )
}

export function StoreLogo({ letter, size = 44 }: { letter: string; size?: number }) {
  return (
    <span
      className="flex flex-none items-center justify-center rounded-full bg-white font-extrabold text-[#141416] ring-1 ring-ink/10"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {letter}
    </span>
  )
}
