import { useNavigate } from 'react-router'
import { useApp } from '../store/AppStore'
import { Icon } from './Icon'
import { BottomSheet } from './Overlays'

export function LoginSheet() {
  const app = useApp()
  const nav = useNavigate()
  if (!app.loginPrompt) return null

  return (
    <BottomSheet onClose={() => app.closeLogin()} label="Log in">
      <h2 className="h2">Log in to save your cart</h2>
      <p className="s mt-2 text-sm">Use your phone number. It takes 20 seconds.</p>
      <button
        className="btn w mt-6"
        onClick={() => {
          app.closeLogin(true)
          nav('/login')
        }}
      >
        <Icon name="phone" />
        Continue with phone
      </button>
      <div className="mt-2 flex justify-center">
        <button className="lk" onClick={() => app.closeLogin()}>
          Not now
        </button>
      </div>
    </BottomSheet>
  )
}
