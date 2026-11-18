import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { Icon } from './Icon'
import { LiquidGlass } from './ui/liquid-glass'

const EASE = [0.32, 0.72, 0, 1] as const
const EASE_OUT = [0.23, 1, 0.32, 1] as const
const COLLAPSED = 44
const EXPAND_DELAY = 0.28
const EXPAND_TIME = 0.5

export function CartBar({
  text,
  thumbs = [],
  count,
  productCount,
}: {
  text: string
  thumbs?: { id: string; src: string }[]
  count?: number
  productCount?: number
}) {
  const reduce = useReducedMotion()
  // The newest product (first thumb) drops in when a NEW product joins the cart;
  // quantity bumps don't count. poof mounts the removal lottie above the pill.
  const newest = thumbs[0]?.id
  const [dropId, setDropId] = useState<string>()
  const [poof, setPoof] = useState(0)
  const prevProducts = useRef(productCount)
  const prevCount = useRef(count)

  useEffect(() => {
    const before = prevProducts.current
    prevProducts.current = productCount
    if (productCount !== undefined && before !== undefined && productCount > before) setDropId(newest)
  }, [productCount, newest])

  useEffect(() => {
    const before = prevCount.current
    prevCount.current = count
    if (count === undefined || before === undefined || count >= before || reduce) return
    setPoof((p) => p + 1)
    const t = setTimeout(() => setPoof(0), 1600)
    return () => clearTimeout(t)
  }, [count, reduce])

  // Enter: the circle rises from below, then widens into the pill.
  // Leave: the pill folds back into the circle, then sinks away.
  const wrap = reduce
    ? {
        hidden: { opacity: 0 },
        shown: { opacity: 1, transition: { duration: 0.2 } },
        gone: { opacity: 0, transition: { duration: 0.2 } },
      }
    : {
        hidden: { transform: 'translateY(100%)', opacity: 0 },
        shown: {
          transform: 'translateY(0%)',
          opacity: 1,
          transitionEnd: { transform: 'none' },
          transition: { duration: 0.3, ease: EASE },
        },
        gone: { transform: 'translateY(100%)', opacity: 0, transition: { delay: 0.34, duration: 0.3, ease: EASE } },
      }
  const pill = reduce
    ? { hidden: { width: 'auto' }, shown: { width: 'auto' }, gone: { width: 'auto' } }
    : {
        hidden: { width: COLLAPSED },
        shown: { width: 'auto', transition: { delay: EXPAND_DELAY, duration: EXPAND_TIME, ease: EASE } },
        gone: { width: COLLAPSED, transition: { duration: 0.3, ease: EASE } },
      }
  const fade = {
    hidden: { opacity: 0 },
    shown: { opacity: 1, transition: { delay: reduce ? 0 : 0.42, duration: 0.2 } },
    gone: { opacity: 0, transition: { duration: 0.12 } },
  }
  // Text waits until the pill has fully expanded, then fades in.
  const label = {
    hidden: { opacity: 0 },
    shown: {
      opacity: 1,
      transition: { delay: reduce ? 0 : EXPAND_DELAY + EXPAND_TIME, duration: 0.3, ease: EASE_OUT },
    },
    gone: { opacity: 0, transition: { duration: 0.12 } },
  }

  return (
    <motion.div className="cartwrap" variants={wrap} initial="hidden" animate="shown" exit="gone">
      {poof > 0 && (
        <span className="pointer-events-none absolute -top-16 left-0 h-16 w-28" aria-hidden="true">
          <DotLottieReact key={poof} src="/Background.lottie" autoplay />
        </span>
      )}
      <motion.div className="cartfab" variants={pill}>
        <Link to="/cart" aria-label={`View cart, ${text}`}>
          {thumbs.length > 0 ? (
            <span className="cf-th">
              {thumbs.slice(0, 3).map((t, i) => (
                // Keyed by product so existing thumbs stay mounted when a new one joins.
                <motion.span
                  key={t.id}
                  className={t.id === dropId ? 'drop' : undefined}
                  variants={i === 0 ? undefined : fade}
                  style={{ zIndex: 3 - i }}
                >
                  <img src={t.src} alt="" loading="lazy" decoding="async" />
                </motion.span>
              ))}
            </span>
          ) : (
            <span className="cf-th">
              <span className="flex items-center justify-center !bg-none bg-[rgba(61,28,4,.22)] text-white">
                <Icon name="bag" size={17} />
              </span>
            </span>
          )}
          <motion.span className="min-w-0 flex-1 pr-1" variants={label}>
            <b className="block text-[14px] leading-[17px] tracking-[-0.01em]">View cart</b>
            <span className="cf-sub block truncate text-[11px] leading-[14px] font-medium">{text}</span>
          </motion.span>
          <motion.span className="cf-go" variants={label}>
            <Icon name="chevRight" size={16} strokeWidth={2} />
          </motion.span>
        </Link>
      </motion.div>
    </motion.div>
  )
}

interface ChatBarProps {
  hints: string[]
  onSubmit: (text: string) => void
  disabled?: boolean
  gradient?: boolean
}

export function ChatBar({ hints, onSubmit, disabled, gradient }: ChatBarProps) {
  const [value, setValue] = useState('')
  const [i, setI] = useState(0)

  useEffect(() => {
    if (hints.length < 2) return
    const t = setInterval(() => setI((x) => (x + 1) % hints.length), 3000)
    return () => clearInterval(t)
  }, [hints.length])

  const ready = !!value.trim() && !disabled

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const v = value.trim()
    if (!v || disabled) return
    onSubmit(v)
    setValue('')
  }

  return (
    <form
      onSubmit={submit}
      className="flex w-full items-center gap-2.5 transition-opacity duration-200 ease-out"
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      {/* Dark tint keeps placeholder and typed text legible over busy content. */}
      <LiquidGlass className="cbar-field h-11 min-w-0 flex-1" tint="rgba(30,30,34,.5)" frost={0.6}>
        <label
          className={`flex h-full w-full items-center gap-3 ${
            gradient ? 'cb !bg-transparent' : 'rounded-full px-3.5'
          }`}
        >
          <Icon name="plus" className="text-z-mut" size={16} />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={disabled}
            placeholder={hints[i % hints.length]}
            aria-label="Ask Zynn"
            enterKeyHint="send"
            className="cbar-input min-w-0 flex-1 bg-transparent text-[15px] text-z-tx outline-none placeholder:text-z-mut"
          />
        </label>
      </LiquidGlass>
      <LiquidGlass
        press={ready}
        className={`cbar-send h-11 w-11 shrink-0${ready ? ' ready' : ''}`}
        tint="rgba(30,30,34,.5)"
        frost={0.6}
      >
        <button type="submit" className="rb h-full w-full" aria-label="Send" disabled={!ready}>
          <Icon name="send" size={16} />
        </button>
      </LiquidGlass>
    </form>
  )
}

export function CollapsePill({ count, expanded, onClick }: { count: number; expanded: boolean; onClick: () => void }) {
  return (
    <button className={`g cp${expanded ? ' up' : ''}`} onClick={onClick} aria-expanded={expanded}>
      {expanded ? (
        'Show less'
      ) : (
        <>
          See all<span className="bg">{count}</span>products
        </>
      )}
      <Icon name="chevDown" />
    </button>
  )
}

export function GroupHeader({ title, detail, hint }: { title: string; detail?: string; hint?: boolean }) {
  return (
    <div className="gh">
      <b>{title}</b>
      <span>{detail}</span>
      {hint && (
        <em className="flex items-center gap-1">
          swipe <Icon name="arrowRight" size={12} />
        </em>
      )}
    </div>
  )
}
