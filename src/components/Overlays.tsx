import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Drawer } from 'vaul'
import { useApp } from '../store/AppStore'
import { Icon } from './Icon'
import { LiquidGlass } from './ui/liquid-glass'

export function Portal({ children }: { children: ReactNode }) {
  return createPortal(children, document.body)
}

// Vaul owns the gesture: 1:1 finger tracking, velocity-based dismissal, rubber-banding,
// scroll-vs-drag gating (only drags when the scrollable content is at the top), body-scroll
// lock, focus trap and Escape-to-close — all of it tuned for real touch devices, which the
// hand-rolled Motion version never got right on mobile.
export function BottomSheet({
  onClose,
  children,
  className = '',
  style,
  grab = true,
  label,
}: {
  onClose: () => void
  children: ReactNode
  className?: string
  style?: CSSProperties
  grab?: boolean
  label?: string
}) {
  // The parent mounts this component to open the sheet. We keep an internal `open` flag so a
  // dismissal (drag, overlay tap, Escape) plays Vaul's close animation while still mounted,
  // then unmounts via onClose once the animation has finished.
  const [open, setOpen] = useState(true)

  return (
    <Drawer.Root
      open={open}
      onOpenChange={setOpen}
      onAnimationEnd={(isOpen) => {
        if (!isOpen) onClose()
      }}
    >
      <Drawer.Portal>
        {/* .dim gives the backdrop colour; Vaul drives its opacity in lockstep with the drag,
            so disable the CSS keyframe fade for this instance. */}
        <Drawer.Overlay className="dim" style={{ animation: 'none' }} />
        <Drawer.Content className={`sh ${className}`} style={style} aria-label={label} aria-describedby={undefined}>
          {/* Title is required for the dialog to be accessible; keep it visually hidden. */}
          <Drawer.Title className="sr-only">{label ?? 'Sheet'}</Drawer.Title>
          {grab && <div className="grab" />}
          {children}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export function Busy({ title, sub }: { title: string; sub: string }) {
  return (
    <Portal>
      <div className="dim" />
      <LiquidGlass className="busy !fixed" radius={28} tint="var(--z-lens)" frost={1} role="status" aria-live="polite">
        <div className="spin" />
        <p className="h3 mt-5">{title}</p>
        <p className="s mt-1.5">{sub}</p>
      </LiquidGlass>
    </Portal>
  )
}

export function ToastHost() {
  const { toastMsg, clearToast } = useApp()
  const [offline, setOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const on = () => setOffline(false)
    const off = () => setOffline(true)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  useEffect(() => {
    if (!toastMsg) return
    const t = setTimeout(clearToast, 2200)
    return () => clearTimeout(t)
  }, [toastMsg, clearToast])

  return (
    <div className="toast-wrap" aria-live="polite">
      {offline && (
        <LiquidGlass className="toast pl-[18px]" tint="var(--z-lens)" frost={0.8}>
          <Icon name="wifiOff" className="text-z-err" />
          No internet connection.
        </LiquidGlass>
      )}
      {toastMsg && (
        <LiquidGlass key={toastMsg.id} className="toast" tint="var(--z-lens)" frost={0.8}>
          <span className="toast-tick">
            <Icon name="check" size={15} strokeWidth={2.4} />
          </span>
          {toastMsg.text}
        </LiquidGlass>
      )}
    </div>
  )
}
