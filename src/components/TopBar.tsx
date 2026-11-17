import { Link, useNavigate } from 'react-router'
import { Icon } from './Icon'

export function Logo({ size }: { size?: number }) {
  return (
    <span className="logo" style={size ? { fontSize: size } : undefined}>
      Zynn<small>.ai</small>
    </span>
  )
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
          <button className="rb g" aria-label="Back" onClick={back}>
            <Icon name="back" />
          </button>
          <Link to="/" aria-label="Zynn home" className="absolute top-[23px] left-1/2 -translate-x-1/2">
            <Logo />
          </Link>
        </>
      ) : (
        <>
          <button className="rb g" aria-label="Menu" onClick={onMenu}>
            <Icon name="menu" />
          </button>
          <Link className="rb g" aria-label="Favourites" to="/favourites">
            <Icon name="heart" />
          </Link>
          <div className="flex-1" />
          <Link to="/" aria-label="Zynn home">
            <Logo />
          </Link>
        </>
      )}
    </header>
  )
}
