import { useEffect, useState } from 'react'

const read = (name: string) =>
  typeof document === 'undefined' ? '' : getComputedStyle(document.documentElement).getPropertyValue(name).trim()

/** Resolved value of a :root custom property, kept in sync with the system
 *  colour scheme. For components that need a concrete colour (canvas, JS
 *  gradients) rather than a `var()` reference. */
export function useCssVar(name: string, fallback: string) {
  const [value, setValue] = useState(() => read(name) || fallback)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const sync = () => setValue(read(name) || fallback)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [name, fallback])
  return value
}
