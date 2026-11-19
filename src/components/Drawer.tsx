import { Fragment, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { PRODUCTS } from '../data/products'
import { RECENTS } from '../data/seed'
import { useApp } from '../store/AppStore'
import { Icon, type IconName } from './Icon'
import { Portal } from './Overlays'
import { Logo } from './TopBar'

const LINKS: { label: string; icon: IconName; to: string }[] = [
  { label: 'Orders', icon: 'receipt', to: '/orders' },
  { label: 'Favourites', icon: 'heart', to: '/favourites' },
  { label: 'Addresses', icon: 'pin', to: '/addresses' },
  { label: 'Connected stores', icon: 'link', to: '/account/stores' },
  { label: 'Account', icon: 'user', to: '/account' },
  { label: 'Help', icon: 'help', to: '/chat?q=I%20need%20help' },
]

/** 2×2 product collage for a recent capture; pads short sets with photo-well tiles. */
function Collage({ ids }: { ids: string[] }) {
  const imgs = ids.map((id) => PRODUCTS[id]?.image).filter((s): s is string => !!s)
  if (imgs.length === 1)
    return (
      <span className="block h-11 w-11 flex-none overflow-hidden rounded-[10px] border border-ink/10 [background:var(--z-photo)]">
        <img src={imgs[0]} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
      </span>
    )
  return (
    <span className="grid h-11 w-11 flex-none grid-cols-2 grid-rows-2 gap-px overflow-hidden rounded-[10px] border border-ink/10 bg-ink/10">
      {[0, 1, 2, 3].map((i) =>
        imgs[i] ? (
          <img key={i} src={imgs[i]} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
        ) : (
          <span key={i} className="[background:var(--z-photo)]" />
        ),
      )}
    </span>
  )
}

export function Drawer({ onClose }: { onClose: () => void }) {
  const app = useApp()
  const nav = useNavigate()
  const panel = useRef<HTMLElement>(null)
  const [closing, setClosing] = useState(false)

  const close = () => setClosing(true)
  const go = (to: string) => {
    close()
    // Decide auth redirects at the tap: committing /account first and letting
    // its guard bounce to /login restarts the page transition mid-slide (jerk).
    nav(to === '/account' && !app.user ? '/login' : to)
  }

  // Take focus on open, give it back to the trigger when the drawer unmounts.
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    panel.current?.focus({ preventScroll: true })
    return () => prev?.focus({ preventScroll: true })
  }, [])

  // The page behind must not scroll while the drawer is up.
  useEffect(() => {
    const old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = old
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setClosing(true)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Unmount when the exit slide finishes; the timeout covers a missed animationend.
  useEffect(() => {
    if (!closing) return
    const t = setTimeout(onClose, 400)
    return () => clearTimeout(t)
  }, [closing, onClose])

  const out = closing ? ' closing' : ''
  return (
    <Portal>
      <div className={'dim' + out} onClick={close} />
      <nav
        ref={panel}
        tabIndex={-1}
        className={'drawer' + out}
        aria-label="Menu"
        onAnimationEnd={(e) => e.animationName === 'zDrawerOut' && onClose()}
      >
        <div className="flex items-center justify-between">
          <Logo size={22} />
          <button className="rb" aria-label="Close menu" onClick={close}>
            <Icon name="close" />
          </button>
        </div>

        {app.user ? (
          <div className="mt-4 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(242,163,94,.16)] text-lg font-extrabold text-z-acc">
              {app.user.name[0]}
            </span>
            <span className="h3 flex-1">{app.user.name}</span>
          </div>
        ) : (
          <div className="g mt-4 flex items-center gap-2.5 rounded-[20px] p-3">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-ink/15 bg-[var(--z-well)]">
              <Icon name="user" size={18} className="text-z-tx" />
            </span>
            <span className="min-w-0 flex-1">
              <b className="block text-[14px] leading-[18px] tracking-[-0.01em]">Log in to Zynn.ai</b>
              <span className="mut mt-0.5 block text-[11px] leading-[14px]">Save your searches, orders &amp; more.</span>
            </span>
            <button
              className="btn h-10 gap-1.5 px-3 text-[13px]"
              onClick={() => {
                close()
                app.openLogin()
              }}
            >
              <Icon name="login" size={15} strokeWidth={2} />
              Log in
            </button>
          </div>
        )}

        <button className="btn w mt-[18px] h-12" onClick={() => go('/chat')}>
          <Icon name="plus" />
          New chat
        </button>

        <p className="cap mt-6 mb-0">Recents</p>
        {RECENTS.map((g) => (
          <Fragment key={g.group}>
            <p className="xs mt-4 mb-1.5 font-semibold">{g.group}</p>
            {g.items.map((r) => (
              <button
                key={r.t}
                onClick={() => go(r.to)}
                className="flex min-h-14 w-full items-center gap-3 text-left text-z-tx transition-transform duration-150 ease-out active:scale-[0.98]"
              >
                <Collage ids={r.ids} />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-sm font-semibold">{r.t}</span>
                  <span className="xs truncate">{r.s}</span>
                </div>
              </button>
            ))}
          </Fragment>
        ))}

        <div className="mt-auto pt-6">
          <hr className="hr mb-2" />
          {LINKS.map((l) => (
            <button key={l.label} className="li min-h-12" onClick={() => go(l.to)}>
              <Icon name={l.icon} />
              {l.label}
            </button>
          ))}
        </div>
      </nav>
    </Portal>
  )
}
