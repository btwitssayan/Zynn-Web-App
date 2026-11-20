import { useReducedMotion } from 'motion/react'
import { Confetti } from './ui/confetti'

const BRAND = ['#f08a3c', '#f2a35e', '#d8c7a6', '#98a5d8', '#b7c0f0']

/**
 * One brand-coloured confetti burst (Magic UI Confetti) for the moment the
 * shopping is actually done: an order placed with nothing left to pay for.
 * It fires once on mount from just above the tick, never loops, and is
 * skipped entirely under reduced motion.
 */
export function Celebrate() {
  const reduce = useReducedMotion()
  if (reduce) return null
  return (
    <Confetti
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 mx-auto h-dvh w-full max-w-[var(--frame)]"
      // No worker: StrictMode remounts would try to transfer the canvas twice.
      globalOptions={{ resize: true, useWorker: false }}
      options={{
        particleCount: 90,
        spread: 75,
        startVelocity: 34,
        gravity: 0.9,
        ticks: 220,
        scalar: 0.85,
        origin: { x: 0.5, y: 0.28 },
        colors: BRAND,
        disableForReducedMotion: true,
      }}
    />
  )
}
