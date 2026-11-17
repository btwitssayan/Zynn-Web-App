import { Fragment, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { Note } from '../components/Bits'
import { Icon } from '../components/Icon'
import { TopBar, useBack } from '../components/TopBar'
import { STORES, type Address, type StoreName } from '../data/types'
import { useApp } from '../store/AppStore'

const SERVICEABLE = ['bengaluru', 'bangalore', 'indiranagar', 'koramangala', 'marathahalli', 'hsr', 'whitefield', 'jayanagar']

export function ChooseAddress() {
  const app = useApp()
  const nav = useNavigate()
  const stores = app.checkout.length ? app.checkout : STORES
  const [tab, setTab] = useState<StoreName>(stores[0])
  const list = app.addresses[tab]

  return (
    <div className="scr pb-36">
      <TopBar inner />
      <div className="px-5 pt-3">
        <h1 className="h1">Deliver to</h1>
        {stores.length > 1 && (
          <div className="g mt-[18px] flex gap-1 rounded-full p-1" role="tablist">
            {stores.map((s) =>
              s === tab ? (
                <button key={s} role="tab" aria-selected className="btn sm h-10 flex-1">
                  {s}
                </button>
              ) : (
                <button key={s} role="tab" aria-selected={false} className="lk min-h-10 flex-1" onClick={() => setTab(s)}>
                  {s}
                </button>
              ),
            )}
          </div>
        )}

        <div role="radiogroup" aria-label={`${tab} delivery address`}>
          {list.map((a) => {
            const on = app.selected[tab] === a.id
            return (
              <button
                key={a.id}
                role="radio"
                aria-checked={on}
                onClick={() => app.selectAddress(tab, a.id)}
                className={`g gc mt-3 flex w-full items-start gap-3 text-left ${on ? 'z-sel' : ''}`}
              >
                <span className={`rad mt-px ${on ? 'on' : ''}`} />
                <span className="flex flex-col gap-1">
                  <span className="h3">{a.label}</span>
                  <span className="s whitespace-pre-line">{a.lines}</span>
                </span>
              </button>
            )
          })}
        </div>

        <Link className="li mt-1.5" to={`/address/new?store=${tab}`}>
          <Icon name="plus" />
          Add new address
        </Link>
        <div className="mt-1">
          <Note text="Changing the address refreshes your cart, because items and prices can differ by area." />
        </div>
      </div>
      <div className="foot">
        <button
          className="btn w"
          disabled={!stores.every((s) => app.addresses[s].length)}
          onClick={() => nav(app.checkout.length ? '/checkout/0' : '/cart')}
        >
          Deliver here
        </button>
      </div>
    </div>
  )
}

export function AddAddress() {
  const app = useApp()
  const back = useBack('/addresses')
  const [params] = useSearchParams()
  const store = params.get('store') as StoreName | null
  const [flat, setFlat] = useState('')
  const [area, setArea] = useState('')
  const [landmark, setLandmark] = useState('')
  const [label, setLabel] = useState<Address['label']>('Home')
  const [pinned, setPinned] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [err, setErr] = useState('')

  const locate = () => {
    if (!navigator.geolocation) return app.toast("Location isn't available")
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPinned(true)
        setArea(`Pinned location (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`)
        app.toast('Location pinned')
      },
      () => app.toast("Couldn't get your location"),
    )
  }

  const save = () => {
    setSubmitted(true)
    setErr('')
    if (!flat.trim() || !area.trim()) return
    if (!pinned && !SERVICEABLE.some((s) => area.toLowerCase().includes(s))) {
      setErr("This store doesn't deliver here yet.")
      return
    }
    const lines = `${flat.trim()}, ${area.trim()}${landmark.trim() ? `\nNear ${landmark.trim()}` : ''}`
    app.addAddress(store && STORES.includes(store) ? [store] : STORES, { label, lines })
    app.toast('Address saved')
    back()
  }

  const fields = [
    { id: 'flat', label: 'Flat, house no.', value: flat, set: setFlat, req: true },
    { id: 'area', label: 'Building or area', value: area, set: setArea, req: true },
    { id: 'landmark', label: 'Landmark (optional)', value: landmark, set: setLandmark, req: false },
  ]

  return (
    <div className="scr pb-10">
      <TopBar inner />
      <div className="px-5 pt-3">
        <h1 className="h1">New address</h1>
        <div
          className="relative mt-[18px] h-[200px] overflow-hidden rounded-3xl border border-white/8 bg-[#17171A]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        >
          <span className="absolute top-[58px] left-1/2 -translate-x-1/2 text-z-acc">
            <Icon name="pin" size={36} fill="rgba(242,163,94,.2)" />
          </span>
          <button
            onClick={locate}
            className="g absolute bottom-3.5 left-1/2 flex h-11 -translate-x-1/2 items-center gap-2 rounded-full px-4 text-[13px] font-semibold whitespace-nowrap text-z-tx"
          >
            <Icon name="locate" size={18} />
            Use my current location
          </button>
        </div>

        {fields.map((f) => (
          <Fragment key={f.id}>
            <label className="lbl mt-4" htmlFor={f.id}>
              {f.label}
            </label>
            <input
              id={f.id}
              className={`in ${submitted && f.req && !f.value.trim() ? 'bad' : ''}`}
              value={f.value}
              placeholder={f.label}
              aria-invalid={submitted && f.req && !f.value.trim()}
              onChange={(e) => {
                f.set(e.target.value)
                if (f.id === 'area') setPinned(false)
              }}
            />
          </Fragment>
        ))}
        {submitted && (!flat.trim() || !area.trim()) && <p className="err mt-2 text-[13px]">Fill in the flat and area.</p>}

        <p className="lbl mt-4">Save as</p>
        <div className="chips">
          {(['Home', 'Work', 'Other'] as const).map((l) => (
            <button key={l} className={`chip ${label === l ? 'on' : ''}`} aria-pressed={label === l} onClick={() => setLabel(l)}>
              {l}
            </button>
          ))}
        </div>

        {err && (
          <div className="mt-4">
            <Note tone="err" text={err} />
          </div>
        )}
        <button className="btn w mt-6" onClick={save}>
          Save address
        </button>
      </div>
    </div>
  )
}

export function AddressBook() {
  const app = useApp()
  return (
    <div className="scr pb-10">
      <TopBar inner />
      <div className="px-5 pt-3">
        <h1 className="h1">Addresses</h1>
        {STORES.map((s) => (
          <Fragment key={s}>
            <p className="cap mt-[22px] mb-2.5">{s}</p>
            <div className="g gc px-4 py-1">
              {app.addresses[s].map((a) => (
                <div key={a.id} className="flex items-start gap-3 border-b border-white/8 py-3">
                  <Icon name="pin" className="mt-0.5" />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="h3">{a.label}</span>
                    <span className="s whitespace-pre-line">{a.lines}</span>
                  </div>
                  <button
                    className="lk err min-h-8 p-0"
                    onClick={() => {
                      app.deleteAddress(s, a.id)
                      app.toast('Address deleted')
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
              <Link className="li min-h-[52px]" to={`/address/new?store=${s}`}>
                <Icon name="plus" />
                Add new address
              </Link>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
