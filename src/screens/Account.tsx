import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { Icon, type IconName } from '../components/Icon'
import { BottomSheet } from '../components/Overlays'
import { TopBar } from '../components/TopBar'
import { maskPhone } from '../lib/format'
import { useApp } from '../store/AppStore'

export default function Account() {
  const app = useApp()
  const nav = useNavigate()
  const [confirmDelete, setConfirmDelete] = useState(false)
  if (!app.user) return <Navigate to="/login" replace />

  const soon = (what: string) => () => app.toast(`${what} is coming soon`)
  const rows: { label: string; icon: IconName; to?: string; onClick?: () => void }[] = [
    { label: 'Connected Instagram account', icon: 'instagram', onClick: soon('Instagram') },
    { label: 'Connected stores', icon: 'link', to: '/account/stores' },
    { label: 'Addresses', icon: 'pin', to: '/addresses' },
    { label: 'Notifications', icon: 'bell', onClick: soon('Notifications') },
    { label: 'Help', icon: 'help', to: '/chat?q=I%20need%20help' },
  ]

  const leave = (msg: string, fn: () => void) => {
    fn()
    app.toast(msg)
    nav('/', { replace: true })
  }

  return (
    <div className="scr pb-10">
      <TopBar inner />
      <div className="flex flex-col items-center pt-2 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(242,163,94,.16)] text-[32px] font-extrabold text-z-acc">
          {app.user.name[0]}
        </span>
        <h2 className="h2 mt-3.5">{app.user.name}</h2>
        <p className="s mt-1">{maskPhone(app.user.phone)}</p>
      </div>
      <div className="mt-6 px-5">
        <div className="dk gc px-3 py-1">
          {rows.map((r) => {
            const inner = (
              <>
                <Icon name={r.icon} />
                <span className="flex-1">{r.label}</span>
                <Icon name="chevRight" size={18} className="text-z-mut" />
              </>
            )
            return r.to ? (
              <Link key={r.label} className="li" to={r.to}>
                {inner}
              </Link>
            ) : (
              <button key={r.label} className="li" onClick={r.onClick}>
                {inner}
              </button>
            )
          })}
          <button className="li" onClick={() => leave("You're logged out", app.logout)}>
            <Icon name="logout" />
            <span className="flex-1">Log out</span>
          </button>
        </div>
        <div className="mt-5 flex justify-center">
          <button className="lk err" onClick={() => setConfirmDelete(true)}>
            Delete my account
          </button>
        </div>
      </div>

      {confirmDelete && (
        <BottomSheet onClose={() => setConfirmDelete(false)} label="Delete account">
          <h2 className="h2">Delete your Zynn account?</h2>
          <p className="s mt-2.5 text-sm">
            Your chats, favourites and order history in Zynn will be removed. Orders already placed stay with the stores.
          </p>
          <div className="mt-6 flex gap-3">
            <button className="btn o flex-1" onClick={() => setConfirmDelete(false)}>
              Cancel
            </button>
            <button className="btn x flex-1" onClick={() => leave('Your account was deleted', app.deleteAccount)}>
              Delete account
            </button>
          </div>
        </BottomSheet>
      )}
    </div>
  )
}
