import { useEffect, useRef, type ComponentPropsWithoutRef } from "react"
import { useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

/**
 * Magic UI NumberTicker, tuned for Zynn:
 * - colour and tracking inherit from the surrounding type (no hard black/white);
 * - `startValue` defaults to `value`, so a total only rolls when it *changes*;
 *   pass `startValue={0}` for a deliberate count-up;
 * - `format` lets prices render as rupees (en-IN grouping);
 * - reduced motion jumps straight to the value.
 */
interface NumberTickerProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  value: number
  startValue?: number
  delay?: number
  decimalPlaces?: number
  format?: (n: number) => string
}

const plain = (dp: number) => (n: number) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: dp, maximumFractionDigits: dp })

export function NumberTicker({
  value,
  startValue,
  delay = 0,
  className,
  decimalPlaces = 0,
  format,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const from = startValue ?? value
  const motionValue = useMotionValue(from)
  const springValue = useSpring(motionValue, { stiffness: 180, damping: 32 })
  const isInView = useInView(ref, { once: true, margin: "0px" })
  const fmt = format ?? plain(decimalPlaces)
  const fmtRef = useRef(fmt)
  fmtRef.current = fmt

  useEffect(() => {
    if (!isInView) return
    if (reduce) {
      springValue.jump(value)
      motionValue.jump(value)
      return
    }
    const timer = setTimeout(() => motionValue.set(value), delay * 1000)
    return () => clearTimeout(timer)
  }, [motionValue, springValue, isInView, delay, value, reduce])

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) ref.current.textContent = fmtRef.current(Number(latest.toFixed(decimalPlaces)))
      }),
    [springValue, decimalPlaces]
  )

  return (
    <span ref={ref} className={cn("inline-block tabular-nums", className)} {...props}>
      {fmt(from)}
    </span>
  )
}
