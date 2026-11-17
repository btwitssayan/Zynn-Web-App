import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { TopBar } from '../components/TopBar'
import { formatPhone, maskPhone } from '../lib/format'
import { useApp } from '../store/AppStore'

export function LoginPhone() {
  const nav = useNavigate()
  const [digits, setDigits] = useState('')
  const valid = /^[6-9]\d{9}$/.test(digits)
  const showErr = digits.length === 10 && !valid

  return (
    <div className="scr">
      <TopBar inner />
      <form
        className="px-5 pt-6"
        onSubmit={(e) => {
          e.preventDefault()
          if (valid) nav('/login/otp', { state: { phone: digits } })
        }}
      >
        <h1 className="h1">Your phone number</h1>
        <label className="lbl mt-7" htmlFor="phone">
          Phone number
        </label>
        <div className="flex gap-2.5">
          <div className="in flex w-[84px] flex-none items-center justify-center">+91</div>
          <input
            id="phone"
            autoFocus
            className={`in flex-1 ${showErr ? 'bad' : ''}`}
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="98765 43210"
            value={formatPhone(digits)}
            onChange={(e) => setDigits(e.target.value.replace(/\D/g, '').slice(0, 10))}
            aria-invalid={showErr}
          />
        </div>
        <p className={`xs mt-2 ${showErr ? 'err' : ''}`}>{showErr ? 'Enter a valid mobile number' : '10-digit mobile number'}</p>
        <button className="btn w mt-7" disabled={!valid}>
          Send OTP
        </button>
        <p className="xs mt-4 text-center leading-normal">By continuing, you agree to Zynn's Terms of Service and Privacy Policy.</p>
      </form>
    </div>
  )
}

const LEN = 6

export function LoginOtp() {
  const app = useApp()
  const nav = useNavigate()
  const { state } = useLocation()
  const phone = (state as { phone?: string } | null)?.phone
  const [code, setCode] = useState<string[]>(Array(LEN).fill(''))
  const [error, setError] = useState(false)
  const [wait, setWait] = useState(24)
  const refs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (wait <= 0) return
    const t = setTimeout(() => setWait((w) => w - 1), 1000)
    return () => clearTimeout(t)
  }, [wait])

  if (!phone) return <Navigate to="/login" replace />

  const value = code.join('')
  const focus = (i: number) => refs.current[Math.max(0, Math.min(LEN - 1, i))]?.focus()

  const setDigit = (i: number, d: string) => {
    setError(false)
    setCode((c) => c.map((x, k) => (k === i ? d : x)))
    if (d) focus(i + 1)
  }

  const onKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[i]) focus(i - 1)
    if (e.key === 'ArrowLeft') focus(i - 1)
    if (e.key === 'ArrowRight') focus(i + 1)
  }

  const onPaste = (e: ClipboardEvent) => {
    const d = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LEN)
    if (!d) return
    e.preventDefault()
    setError(false)
    setCode(Array.from({ length: LEN }, (_, k) => d[k] ?? ''))
    focus(d.length)
  }

  const verify = () => {
    // Demo rule: 000000 simulates a wrong code; any other 6 digits logs in.
    if (value === '000000') {
      setError(true)
      return
    }
    app.login(phone)
    app.toast("You're logged in")
    nav('/', { replace: true })
  }

  const nextEmpty = code.findIndex((c) => !c)

  return (
    <div className="scr">
      <TopBar inner />
      <div className="px-5 pt-6">
        <h1 className="h1">Enter the OTP</h1>
        <p className="s mt-2 text-sm">
          Sent to {maskPhone(phone)} ·{' '}
          <Link to="/login" replace className="font-semibold text-z-tx underline">
            Change
          </Link>
        </p>
        <div className="mt-7 flex gap-2.5" onPaste={onPaste}>
          {code.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el
              }}
              autoFocus={i === 0}
              className={`in h-[58px] w-[46px] p-0 text-center text-[22px] font-bold ${error ? 'bad' : i === nextEmpty ? 'on' : ''}`}
              value={d}
              inputMode="numeric"
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              aria-label={`OTP digit ${i + 1}`}
              onChange={(e) => setDigit(i, e.target.value.replace(/\D/g, '').slice(-1))}
              onKeyDown={(e) => onKey(i, e)}
            />
          ))}
        </div>
        {error && (
          <p className="err mt-3 text-[13px]" role="alert">
            That OTP is incorrect. Try again.
          </p>
        )}
        {wait > 0 ? (
          <p className="s mt-4">Resend in 0:{String(wait).padStart(2, '0')}</p>
        ) : (
          <button
            className="lk mt-2 px-0"
            onClick={() => {
              setWait(24)
              app.toast('OTP sent')
            }}
          >
            Resend OTP
          </button>
        )}
        <button className="btn w mt-7" disabled={value.length < LEN} onClick={verify}>
          Verify
        </button>
      </div>
    </div>
  )
}
