import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'motion/react'
import { Icon } from './Icon'

interface SlideToCheckoutProps {
  onSlideComplete: () => void
  disabled?: boolean
  ordersCount?: number
  label?: string
  disabledLabel?: string
  className?: string
}

const THUMB_SIZE = 48
const PADDING = 4

export function SlideToCheckout({
  onSlideComplete,
  disabled = false,
  ordersCount = 1,
  label,
  disabledLabel,
  className = '',
}: SlideToCheckoutProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [maxDrag, setMaxDrag] = useState(0)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const isConfirmedRef = useRef(false)
  const completeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const prefersReducedMotion = useReducedMotion()

  const x = useMotionValue(0)

  // Measure available travel distance inside the track
  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    const updateDistance = () => {
      const trackWidth = el.clientWidth
      const available = Math.max(0, trackWidth - THUMB_SIZE - PADDING * 2)
      setMaxDrag(available)
    }

    updateDistance()

    const observer = new ResizeObserver(updateDistance)
    observer.observe(el)

    return () => {
      observer.disconnect()
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current)
    }
  }, [])

  // Linked transforms: zero React re-renders during drag gestures
  const textOpacity = useTransform(x, [0, maxDrag > 0 ? maxDrag * 0.42 : 1], [1, 0])
  const fillWidth = useTransform(
    x,
    (val) => `${Math.max(THUMB_SIZE + PADDING * 2, val + THUMB_SIZE + PADDING * 2)}px`
  )
  const chevronOpacity = useTransform(x, [0, maxDrag > 0 ? maxDrag * 0.25 : 1], [0.65, 0])

  const triggerConfirm = useCallback(
    (velocity = 0) => {
      if (isConfirmedRef.current || disabled) return
      isConfirmedRef.current = true
      setIsConfirmed(true)

      // Tactile haptic feedback on mobile if supported
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(24)
        } catch {
          // ignore
        }
      }

      // Smoothly spring thumb to the right bumper
      animate(x, maxDrag, {
        type: 'spring',
        stiffness: 480,
        damping: 32,
        velocity,
      })

      // Brief pause to display completion feedback (checkmark) before executing checkout
      completeTimerRef.current = setTimeout(() => {
        onSlideComplete()
      }, 280)
    },
    [disabled, maxDrag, onSlideComplete, x]
  )

  // Immediate lock-in when thumb hits the far-right bumper during active drag
  useEffect(() => {
    if (disabled || isConfirmed) return
    const unsubscribe = x.on('change', (latest) => {
      if (!isConfirmedRef.current && maxDrag > 0 && latest >= maxDrag - 2) {
        triggerConfirm()
      }
    })
    return () => unsubscribe()
  }, [disabled, isConfirmed, maxDrag, triggerConfirm, x])

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }
  ) => {
    if (disabled || isConfirmedRef.current) return

    const currentX = x.get()
    const progress = maxDrag > 0 ? currentX / maxDrag : 0
    const isFling = progress >= 0.25 && info.velocity.x > 320
    const isFarEnough = progress >= 0.65

    if (isFarEnough || isFling) {
      triggerConfirm(info.velocity.x)
    } else {
      // Physical snap-back on incomplete release
      animate(x, 0, {
        type: 'spring',
        stiffness: 450,
        damping: 28,
        velocity: info.velocity.x,
      })
    }
  }

  // Keyboard accessibility (Enter, Space, ArrowRight)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || isConfirmedRef.current) return
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
      e.preventDefault()
      triggerConfirm(200)
    }
  }

  const defaultText =
    ordersCount > 1 ? `Slide to check out · ${ordersCount} orders` : 'Slide to check out'
  const displayText = disabled ? (disabledLabel ?? defaultText) : (label ?? defaultText)

  return (
    <div
      ref={trackRef}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={displayText}
      aria-disabled={disabled}
      onKeyDown={handleKeyDown}
      className={`relative flex h-14 w-full select-none items-center overflow-hidden rounded-full transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-z-acc ${
        disabled
          ? 'cursor-not-allowed border border-white/5 bg-[#18181b]/70 opacity-60'
          : 'border border-white/12 bg-[rgba(24,24,28,0.85)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.35),0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-xl'
      } ${className}`}
      style={{ touchAction: 'pan-y' }}
    >
      {/* Progress fill tracking behind the thumb */}
      {!disabled && (
        <motion.div
          className="pointer-events-none absolute inset-y-0 left-0 rounded-full"
          style={{
            width: fillWidth,
            background: isConfirmed
              ? 'linear-gradient(95deg, #f08a3c, #d8c7a6 55%, #98a5d8)'
              : 'linear-gradient(90deg, rgba(240, 138, 60, 0.28), rgba(242, 163, 94, 0.45))',
            boxShadow: isConfirmed ? '0 0 24px rgba(242, 163, 94, 0.5)' : 'none',
            transition: 'background 0.2s, box-shadow 0.2s',
          }}
        />
      )}

      {/* Track center label & animated chevrons */}
      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center pl-14 pr-6 select-none"
        style={{ opacity: disabled ? 0.6 : textOpacity }}
      >
        <span
          className={`text-[15px] font-bold tracking-tight ${
            disabled ? 'text-z-mut' : 'text-[#ededef]'
          }`}
          style={
            !disabled && !prefersReducedMotion
              ? {
                  background:
                    'linear-gradient(90deg, rgba(237,237,239,0.7) 0%, #ffffff 50%, rgba(237,237,239,0.7) 100%)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'zShimmer 2.4s linear infinite',
                }
              : undefined
          }
        >
          {displayText}
        </span>

        {/* Subtle sliding directional cue chevrons */}
        {!disabled && !isConfirmed && (
          <motion.div
            className="ml-2 flex items-center gap-0.5 text-xs text-z-mut"
            style={{ opacity: chevronOpacity }}
          >
            <span className="inline-block animate-pulse font-bold" style={{ animationDelay: '0ms' }}>
              ›
            </span>
            <span className="inline-block animate-pulse font-bold" style={{ animationDelay: '200ms' }}>
              ›
            </span>
            <span className="inline-block animate-pulse font-bold" style={{ animationDelay: '400ms' }}>
              ›
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Draggable thumb */}
      <motion.div
        drag={disabled || isConfirmed || maxDrag === 0 ? false : 'x'}
        dragConstraints={{ left: 0, right: maxDrag }}
        dragElastic={{ left: 0, right: 0.12 }}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        whileTap={disabled || isConfirmed ? undefined : { scale: 0.96 }}
        className={`absolute top-1 left-1 z-10 flex h-12 w-12 items-center justify-center rounded-full transition-colors select-none ${
          disabled
            ? 'cursor-not-allowed bg-[#2a2a2e] text-[#6e6e73]'
            : isConfirmed
              ? 'bg-white text-[#0b0b0d] shadow-[0_0_18px_rgba(242,163,94,0.6)]'
              : 'cursor-grab bg-white text-[#0b0b0d] shadow-[0_3px_12px_rgba(0,0,0,0.4),0_1px_3px_rgba(0,0,0,0.2),inset_0_1px_0_#ffffff] active:cursor-grabbing'
        }`}
        style={{
          x,
          touchAction: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
        }}
      >
        {isConfirmed ? (
          <motion.div
            initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="flex items-center justify-center text-[#0b0b0d]"
          >
            <Icon name="check" size={22} strokeWidth={2.8} />
          </motion.div>
        ) : (
          <Icon
            name="arrowRight"
            size={19}
            strokeWidth={2.4}
            className={disabled ? 'text-[#6e6e73]' : 'text-[#0b0b0d]'}
          />
        )}
      </motion.div>
    </div>
  )
}
