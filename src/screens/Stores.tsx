import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Note, StoreLogo } from '../components/Bits'
import { Icon } from '../components/Icon'
import { Busy } from '../components/Overlays'
import { TopBar } from '../components/TopBar'
import { STORE_INFO } from '../data/seed'
import { STORES, type StoreName } from '../data/types'
import { maskPhone } from '../lib/format'
import { useApp } from '../store/AppStore'

function useStoreLogin() {
  const app = useApp()
  const [connecting, setConnecting] = useState<StoreName | null>(null)
  const [failed, setFailed] = useState<StoreName | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const connect = (s: StoreName) => {
    setFailed(null)
    setConnecting(s)
    timer.current = setTimeout(() => {
      setConnecting(null)
      if (!navigator.onLine) return setFailed(s)
      app.setConnected(s, true)
      app.toast(`Connected to ${s}`)
    }, 1600)
  }
  return { connecting, failed, connect }
}

function StoreCard({
  store,
  onLogin,
  onLogout,
  className = '',
}: {
  store: StoreName
  onLogin: () => void
  onLogout?: () => void
  className?: string
}) {
  const app = useApp()
  const on = app.connected[store]
  const info = STORE_INFO[store]
  return (
    <div className={`dk gc flex items-center gap-3 ${className}`}>
      <StoreLogo letter={info.logo} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="h3">{info.full}</span>
        {on ? (
          <span className="xs flex flex-wrap items-center gap-1.5">
            <span className="acc flex items-center gap-1 font-semibold">
              <Icon name="check" size={14} strokeWidth={2.4} />
              Connected
            </span>
            {app.user && `· ${maskPhone(app.user.phone)}`}
          </span>
        ) : (
          <span className="xs">Not connected</span>
        )}
      </div>
      {!on && (
        <button className="btn sm" onClick={onLogin}>
          Log in
        </button>
      )}
      {on && onLogout && (
        <button className="btn sm o" onClick={onLogout}>
          Log out
        </button>
      )}
    </div>
  )
}

export function ConnectStores() {
  const app = useApp()
  const nav = useNavigate()
  const { connecting, failed, connect } = useStoreLogin()
  const stores = app.checkout.length ? app.checkout : STORES
  const ready = stores.every((s) => app.connected[s])

  return (
    <div className="scr pb-36">
      <TopBar inner />
      <div className="px-5 pt-4">
        <h1 className="h1">Connect your stores</h1>
        <p className="s mt-2 text-sm">Log in once to each store in your cart. Zynn never sees your OTP.</p>
        {stores.map((s, i) => (
          <StoreCard key={s} store={s} onLogin={() => connect(s)} className={i === 0 ? 'mt-6' : 'mt-3'} />
        ))}
        {failed && (
          <div className="mt-3">
            <Note tone="err" text={`Couldn't connect to ${failed}. Try again.`} action="Try again" onAction={() => connect(failed)} />
          </div>
        )}
        <p className="xs mt-4 leading-normal">You'll log in on the store's secure page, then come back here.</p>
      </div>
      <div className="foot">
        <button className="btn w" disabled={!ready} onClick={() => nav('/address')}>
          Continue
        </button>
      </div>
      {connecting && <Busy title={`Opening ${connecting} login...`} sub="Come back to Zynn after logging in." />}
    </div>
  )
}

export function ConnectedStores() {
  const app = useApp()
  const { connecting, failed, connect } = useStoreLogin()

  return (
    <div className="scr pb-10">
      <TopBar inner />
      <div className="px-5 pt-3">
        <h1 className="h1">Connected stores</h1>
        {STORES.map((s, i) => (
          <StoreCard
            key={s}
            store={s}
            className={i === 0 ? 'mt-5' : 'mt-3'}
            onLogin={() => connect(s)}
            onLogout={() => {
              app.setConnected(s, false)
              app.toast(`Logged out of ${s}`)
            }}
          />
        ))}
        {failed && (
          <div className="mt-3">
            <Note tone="err" text={`Couldn't connect to ${failed}. Try again.`} action="Try again" onAction={() => connect(failed)} />
          </div>
        )}
        <p className="s mt-3.5">Logging out disconnects Zynn from that store account.</p>
        <div className="dk gc mt-5 flex items-center gap-3">
          <Icon name="info" className="text-z-acc" />
          <span className="flex-1 text-sm">Shopify stores need no login.</span>
        </div>
      </div>
      {connecting && <Busy title={`Opening ${connecting} login...`} sub="Come back to Zynn after logging in." />}
    </div>
  )
}
