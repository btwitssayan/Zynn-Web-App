import { Link, useNavigate } from 'react-router'
import { Heart, Menu } from 'lucide-react'
import { Icon } from './Icon'
import { LiquidGlassCard } from './ui/liquid-glass'

/** Wordmark image. `size` keeps its old meaning (type size in px); the image
 *  height includes the descender of the "y". */
export function Logo({ size = 22 }: { size?: number }) {
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
          <LiquidGlassCard press className="h-11 w-11 shrink-0" borderRadius="999px" distortion="sm" tint="rgb(255 255 255 / 0.1)">
            <button className="rb h-full w-full" aria-label="Back" onClick={back}>
              <Icon name="back" />
            </button>
          </LiquidGlassCard>
          <Link to="/" aria-label="Zynn home" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Logo />
          </Link>
        </>
      ) : (
        <>
          <LiquidGlassCard press className="h-11 w-11 shrink-0" borderRadius="999px" distortion="sm" tint="rgb(255 255 255 / 0.1)">
            <button className="rb h-full w-full" aria-label="Menu" onClick={onMenu}>
              <Menu className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
            </button>
          </LiquidGlassCard>
          <LiquidGlassCard press className="h-11 w-11 shrink-0" borderRadius="999px" distortion="sm" tint="rgb(255 255 255 / 0.1)">
            <Link className="rb h-full w-full" aria-label="Favourites" to="/favourites">
              <Heart className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
            </Link>
          </LiquidGlassCard>
          <div className="flex-1" />
          <Link to="/" aria-label="Zynn home">
            <Logo />
          </Link>
        </>
      )}
    </header>
  )
}
