import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { FocusScope } from '@radix-ui/react-focus-scope'
import { Drawer } from 'vaul'
import { useApp } from '../store/AppStore'
import { Icon } from './Icon'
import { LiquidGlassCard } from './ui/liquid-glass'

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
      <LiquidGlassCard className="busy !fixed" borderRadius="28px" distortion="md" tint="var(--z-lens)" role="status" aria-live="polite">
        <div className="spin" />
        <p className="h3 mt-5">{title}</p>
        <p className="s mt-1.5">{sub}</p>
      </LiquidGlassCard>
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
        <LiquidGlassCard className="toast pl-[18px]" borderRadius="999px" distortion="sm" tint="var(--z-lens)">
          <Icon name="wifiOff" className="text-z-err" />
          No internet connection.
        </LiquidGlassCard>
      )}
      {toastMsg && (
        <LiquidGlassCard key={toastMsg.id} className="toast" borderRadius="999px" distortion="sm" tint="var(--z-lens)">
          <span className="toast-tick">
            <Icon name="check" size={15} strokeWidth={2.4} />
          </span>
          {toastMsg.text}
        </LiquidGlassCard>
      )}
    </div>
  )
}

export function InfoDialog({
  title,
  children,
  onClose,
}: {
  title: string
  children: ReactNode
  onClose: () => void
}) {
  // The parent mounts this component to open the dialog. A dismissal flips `closing` so the
  // exit animation plays while still mounted, then unmounts via onClose once it has finished.
  const [closing, setClosing] = useState(false)
  const close = useCallback(() => setClosing(true), [])

  useEffect(() => {
    if (!closing) return
    const t = setTimeout(onClose, 180)
    return () => clearTimeout(t)
  }, [closing, onClose])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      // This sits above the Vaul sheet that opened it, so swallow the key: Escape closes the
      // dialog, not the product sheet underneath it.
      event.stopPropagation()
      event.preventDefault()
      close()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [close])

  // Vaul's sheet is modal: it sets `pointer-events: none` on <body> and dismisses itself on any
  // pointerdown outside its content. This dialog is portaled to <body>, so it re-enables pointer
  // events on itself (.info-dim / .info-dialog in index.css) and keeps pointerdown from reaching
  // Vaul's document listener.
  const keepInside = (event: { stopPropagation: () => void }) => event.stopPropagation()

  return (
    <Portal>
      <div className={`dim info-dim${closing ? ' closing' : ''}`} onPointerDown={keepInside} onClick={close} />
      {/* A nested trapped scope pauses the sheet's own focus trap while this is open — without it
          Radix pulls focus straight back out of the dialog — and hands focus back to the info
          button on unmount. `contents` keeps the wrapper out of the layout. */}
      <FocusScope trapped loop className="contents">
        <LiquidGlassCard
          className={`info-dialog !fixed${closing ? ' closing' : ''}`}
          borderRadius="26px"
          distortion="md"
          tint="var(--z-lens)"
          role="dialog"
          aria-modal="true"
          aria-labelledby="info-dialog-title"
          onPointerDown={keepInside}
          onClick={keepInside}
        >
          <div className="info-dialog-head">
            <h2 id="info-dialog-title">{title}</h2>
            <button className="info-dialog-close" aria-label="Close" onClick={close}>
              <Icon name="close" size={17} strokeWidth={2.2} />
            </button>
          </div>
          <p>{children}</p>
        </LiquidGlassCard>
      </FocusScope>
    </Portal>
  )
}
