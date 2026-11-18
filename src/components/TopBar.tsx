import { Link, useNavigate } from 'react-router'
import { Icon } from './Icon'
import { LiquidGlass } from './ui/liquid-glass'

/** Wordmark image. `size` keeps its old meaning (type size in px); the image
 *  height includes the descender of the "y". */
export function Logo({ size = 26 }: { size?: number }) {
  const h = Math.round(size * 1.2)
  return <img src="/logo.png" alt="Zynn.ai" className="logo" height={h} width={Math.round((h * 560) / 180)} draggable={false} />
}

export function useBack(fallback = '/') {
  const nav = useNavigate()
  return () => ((window.history.state?.idx ?? 0) > 0 ? nav(-1) : nav(fallback))
}

export function TopBar({ inner, onMenu }: { inner?: boolean; onMenu?: () => void }) {
  const back = useBack()
  return (
    <header className="relative flex h-[72px] items-center gap-2.5 px-5 py-3.5">
      {inner ? (
        <>
          <LiquidGlass press className="h-11 w-11 shrink-0" tint={0.1} frost={0.5}>
            <button className="rb h-full w-full" aria-label="Back" onClick={back}>
              <Icon name="back" />
            </button>
          </LiquidGlass>
          <Link to="/" aria-label="Zynn home" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Logo />
          </Link>
        </>
      ) : (
        <>
          <LiquidGlass press className="h-11 w-11 shrink-0" tint={0.1} frost={0.5}>
            <button className="rb h-full w-full" aria-label="Menu" onClick={onMenu}>
              <Icon name="menu" />
            </button>
          </LiquidGlass>
          <LiquidGlass press className="h-11 w-11 shrink-0" tint={0.1} frost={0.5}>
            <Link className="rb h-full w-full" aria-label="Favourites" to="/favourites">
              <Icon name="heart" />
            </Link>
          </LiquidGlass>
          <div className="flex-1" />
          <Link to="/" aria-label="Zynn home">
            <Logo />
          </Link>
        </>
      )}
    </header>
  )
}
