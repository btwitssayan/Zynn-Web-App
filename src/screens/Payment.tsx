import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { Tick } from '../components/Bits'
import { Busy } from '../components/Overlays'
import { TopBar } from '../components/TopBar'
import { inr } from '../lib/format'
import { useApp } from '../store/AppStore'
import { useCheckoutStep, usePay } from './Checkout'

export function PayUpi() {
  const app = useApp()
  const nav = useNavigate()
  const { state } = useLocation()
  const { idx, store, items, bill } = useCheckoutStep()
  const [done, setDone] = useState(false)
  if (done) return null
  if (!store || !items.length || !bill) return <Navigate to="/cart" replace />

  const paid = () => {
    setDone(true)
    app.placeOrder(store, `UPI · ${(state as { method?: string } | null)?.method ?? 'UPI'}`)
    nav(`/pay/success/${idx}`, { replace: true })
  }

  return (
    <div className="scr">
      <TopBar inner />
      <div className="g mx-5 mt-[110px] flex flex-col items-center rounded-[28px] bg-[var(--z-glass)] px-6 py-9 text-center">
        <svg viewBox="0 0 80 80" width="80" height="80" aria-hidden="true" className="ring-spin">
          <circle cx="40" cy="40" r="34" fill="none" style={{ stroke: 'rgb(var(--ink) / .1)' }} strokeWidth="6" />
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="#F2A35E"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="70 214"
            transform="rotate(-90 40 40)"
          />
        </svg>
        <p className="h3 mt-5">Complete payment in your UPI app</p>
        <p className="mt-2 text-[38px] font-extrabold tracking-[-1px]">{inr(bill.total)}</p>
        <p className="s mt-2.5">Checking payment... please don't close this page</p>
        <button className="lk mt-4 text-[15px]" onClick={paid}>
          I've paid
        </button>
        <button className="lk mut text-[13px] font-medium" onClick={() => nav(`/pay/failed/${idx}`, { replace: true })}>
          Cancel payment
        </button>
      </div>
    </div>
  )
}

const QR_PATH =
  'M8 0h1v1h-1zM9 0h1v1h-1zM11 0h1v1h-1zM13 0h1v1h-1zM14 0h1v1h-1zM16 0h1v1h-1zM8 1h1v1h-1zM9 1h1v1h-1zM10 1h1v1h-1zM11 1h1v1h-1zM13 1h1v1h-1zM14 1h1v1h-1zM9 2h1v1h-1zM11 2h1v1h-1zM13 2h1v1h-1zM14 2h1v1h-1zM15 2h1v1h-1zM16 2h1v1h-1zM9 3h1v1h-1zM12 3h1v1h-1zM14 3h1v1h-1zM15 3h1v1h-1zM16 3h1v1h-1zM9 4h1v1h-1zM10 4h1v1h-1zM12 4h1v1h-1zM13 4h1v1h-1zM16 4h1v1h-1zM12 5h1v1h-1zM14 5h1v1h-1zM15 5h1v1h-1zM8 6h1v1h-1zM9 6h1v1h-1zM10 6h1v1h-1zM15 6h1v1h-1zM10 7h1v1h-1zM13 7h1v1h-1zM15 7h1v1h-1zM3 8h1v1h-1zM4 8h1v1h-1zM6 8h1v1h-1zM7 8h1v1h-1zM8 8h1v1h-1zM9 8h1v1h-1zM10 8h1v1h-1zM12 8h1v1h-1zM13 8h1v1h-1zM14 8h1v1h-1zM16 8h1v1h-1zM17 8h1v1h-1zM22 8h1v1h-1zM23 8h1v1h-1zM24 8h1v1h-1zM2 9h1v1h-1zM3 9h1v1h-1zM4 9h1v1h-1zM5 9h1v1h-1zM6 9h1v1h-1zM8 9h1v1h-1zM9 9h1v1h-1zM10 9h1v1h-1zM11 9h1v1h-1zM18 9h1v1h-1zM23 9h1v1h-1zM24 9h1v1h-1zM0 10h1v1h-1zM2 10h1v1h-1zM3 10h1v1h-1zM4 10h1v1h-1zM5 10h1v1h-1zM6 10h1v1h-1zM7 10h1v1h-1zM8 10h1v1h-1zM9 10h1v1h-1zM10 10h1v1h-1zM11 10h1v1h-1zM12 10h1v1h-1zM15 10h1v1h-1zM16 10h1v1h-1zM17 10h1v1h-1zM18 10h1v1h-1zM19 10h1v1h-1zM22 10h1v1h-1zM23 10h1v1h-1zM24 10h1v1h-1zM0 11h1v1h-1zM1 11h1v1h-1zM2 11h1v1h-1zM4 11h1v1h-1zM5 11h1v1h-1zM8 11h1v1h-1zM10 11h1v1h-1zM15 11h1v1h-1zM16 11h1v1h-1zM17 11h1v1h-1zM21 11h1v1h-1zM22 11h1v1h-1zM4 12h1v1h-1zM6 12h1v1h-1zM7 12h1v1h-1zM8 12h1v1h-1zM9 12h1v1h-1zM10 12h1v1h-1zM13 12h1v1h-1zM17 12h1v1h-1zM18 12h1v1h-1zM19 12h1v1h-1zM20 12h1v1h-1zM21 12h1v1h-1zM0 13h1v1h-1zM3 13h1v1h-1zM8 13h1v1h-1zM9 13h1v1h-1zM11 13h1v1h-1zM14 13h1v1h-1zM15 13h1v1h-1zM18 13h1v1h-1zM19 13h1v1h-1zM20 13h1v1h-1zM23 13h1v1h-1zM2 14h1v1h-1zM4 14h1v1h-1zM5 14h1v1h-1zM10 14h1v1h-1zM13 14h1v1h-1zM14 14h1v1h-1zM15 14h1v1h-1zM16 14h1v1h-1zM18 14h1v1h-1zM19 14h1v1h-1zM20 14h1v1h-1zM22 14h1v1h-1zM23 14h1v1h-1zM1 15h1v1h-1zM6 15h1v1h-1zM7 15h1v1h-1zM8 15h1v1h-1zM9 15h1v1h-1zM11 15h1v1h-1zM12 15h1v1h-1zM15 15h1v1h-1zM19 15h1v1h-1zM21 15h1v1h-1zM22 15h1v1h-1zM3 16h1v1h-1zM8 16h1v1h-1zM10 16h1v1h-1zM15 16h1v1h-1zM19 16h1v1h-1zM20 16h1v1h-1zM21 16h1v1h-1zM22 16h1v1h-1zM23 16h1v1h-1zM24 16h1v1h-1zM11 17h1v1h-1zM14 17h1v1h-1zM17 17h1v1h-1zM19 17h1v1h-1zM20 17h1v1h-1zM23 17h1v1h-1zM24 17h1v1h-1zM9 18h1v1h-1zM10 18h1v1h-1zM11 18h1v1h-1zM13 18h1v1h-1zM15 18h1v1h-1zM16 18h1v1h-1zM17 18h1v1h-1zM20 18h1v1h-1zM24 18h1v1h-1zM8 19h1v1h-1zM9 19h1v1h-1zM11 19h1v1h-1zM12 19h1v1h-1zM13 19h1v1h-1zM16 19h1v1h-1zM17 19h1v1h-1zM21 19h1v1h-1zM22 19h1v1h-1zM24 19h1v1h-1zM8 20h1v1h-1zM12 20h1v1h-1zM14 20h1v1h-1zM16 20h1v1h-1zM17 20h1v1h-1zM20 20h1v1h-1zM21 20h1v1h-1zM23 20h1v1h-1zM24 20h1v1h-1zM8 21h1v1h-1zM9 21h1v1h-1zM10 21h1v1h-1zM11 21h1v1h-1zM12 21h1v1h-1zM14 21h1v1h-1zM16 21h1v1h-1zM17 21h1v1h-1zM18 21h1v1h-1zM19 21h1v1h-1zM20 21h1v1h-1zM23 21h1v1h-1zM24 21h1v1h-1zM9 22h1v1h-1zM11 22h1v1h-1zM12 22h1v1h-1zM14 22h1v1h-1zM18 22h1v1h-1zM22 22h1v1h-1zM23 22h1v1h-1zM24 22h1v1h-1zM8 23h1v1h-1zM9 23h1v1h-1zM11 23h1v1h-1zM12 23h1v1h-1zM13 23h1v1h-1zM17 23h1v1h-1zM18 23h1v1h-1zM19 23h1v1h-1zM20 23h1v1h-1zM21 23h1v1h-1zM22 23h1v1h-1zM23 23h1v1h-1zM10 24h1v1h-1zM12 24h1v1h-1zM13 24h1v1h-1zM14 24h1v1h-1zM15 24h1v1h-1zM16 24h1v1h-1zM18 24h1v1h-1zM20 24h1v1h-1zM21 24h1v1h-1zM22 24h1v1h-1zM23 24h1v1h-1zM24 24h1v1h-1zM0 0h7v7h-7zM1 1v5h5v-5zM2 2h3v3h-3zM18 0h7v7h-7zM19 1v5h5v-5zM20 2h3v3h-3zM0 18h7v7h-7zM1 19v5h5v-5zM2 20h3v3h-3z'

export function PayQr() {
  const app = useApp()
  const nav = useNavigate()
  const { idx, store, items, bill } = useCheckoutStep()
  const [left, setLeft] = useState(272)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setLeft((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [])

  // Simulated payment detection: the QR flow has no "I've paid" step in the design.
  useEffect(() => {
    if (!store || !items.length) return
    const t = setTimeout(() => {
      setDone(true)
      app.placeOrder(store, 'UPI QR')
      nav(`/pay/success/${idx}`, { replace: true })
    }, 8000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (left <= 0) nav(`/pay/failed/${idx}`, { replace: true })
  }, [left, idx, nav])

  if (done) return null
  if (!store || !items.length || !bill) return <Navigate to="/cart" replace />

  return (
    <div className="scr">
      <TopBar inner />
      <div className="flex flex-col items-center px-5 pt-14 text-center">
        <h2 className="h2">Scan with any UPI app</h2>
        <p className="s mt-2 text-sm">
          {inr(bill.total)} · {store}
        </p>
        <div className="mt-7 rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,.5)]">
          <svg viewBox="0 0 25 25" width="210" height="210" role="img" aria-label="UPI QR code" shapeRendering="crispEdges">
            <path fill="#000" fillRule="evenodd" d={QR_PATH} />
          </svg>
        </div>
        <p className="s mt-[22px]">
          Expires in{' '}
          <b className="text-z-acc">
            {Math.floor(Math.max(0, left) / 60)}:{String(Math.max(0, left) % 60).padStart(2, '0')}
          </b>
        </p>
        <button className="lk mut mt-3 text-[13px] font-medium" onClick={() => nav(`/pay/failed/${idx}`, { replace: true })}>
          Cancel payment
        </button>
      </div>
    </div>
  )
}

export function PayResult({ status }: { status: 'success' | 'failed' | 'duplicate' }) {
  const app = useApp()
  const nav = useNavigate()
  const { state } = useLocation()
  const { idx } = useCheckoutStep()
  const { pay, redirecting } = usePay()

  useEffect(() => {
    if (status !== 'success') return
    const t = setTimeout(() => nav(`/placed/${idx}`, { replace: true }), 1200)
    return () => clearTimeout(t)
  }, [status, idx, nav])

  if (status !== 'success' && !app.checkout[idx]) return <Navigate to="/cart" replace />

  const content = {
    success: { tone: 'ok' as const, title: 'Payment received' },
    failed: { tone: 'err' as const, title: 'Payment failed. No money was taken.' },
    duplicate: { tone: 'warn' as const, title: 'Looks like you just placed this same order.' },
  }[status]

  return (
    <div className="scr">
      <div className="flex flex-col items-center px-7 pt-[230px] text-center">
        <Tick tone={content.tone} />
        <h2 className="h2 mt-7">{content.title}</h2>
      </div>
      {status !== 'success' && (
        <div className="pin-frame bottom-0 z-20 flex flex-col gap-3 px-5 pb-[calc(40px+var(--safe-b))]">
          {status === 'failed' ? (
            <>
              <button className="btn w" onClick={() => nav(`/pay/upi/${idx}`, { replace: true })}>
                Try again
              </button>
              <button className="btn o w" onClick={() => nav(`/checkout/${idx}`, { replace: true })}>
                Pay another way
              </button>
            </>
          ) : (
            <>
              <button className="btn o w" onClick={() => pay(idx, (state as { method?: string } | null)?.method ?? 'UPI')}>
                Place it again
              </button>
              <button className="btn w" onClick={() => nav('/orders')}>
                View my orders
              </button>
            </>
          )}
        </div>
      )}
      {redirecting && <Busy title="Opening secure payment page..." sub="Come back to Zynn after paying." />}
    </div>
  )
}
