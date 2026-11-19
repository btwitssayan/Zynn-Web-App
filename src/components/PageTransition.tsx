import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'motion/react'
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router'

/**
 * Route depth drives the transition: deeper = push in from the right,
 * shallower = pop back out to the right, equal = crossfade.
 * Order matters, first match wins.
 */
const DEPTH: [RegExp, number][] = [
  [/^\/$/, 0],
  [/^\/reel\//, 0],
  [/^\/chat$/, 1],
  [/^\/favourites$/, 1],
  [/^\/cart$/, 1],
  [/^\/orders$/, 1],
  [/^\/account$/, 1],
  [/^\/login$/, 1],
  [/^\/dev$/, 1],
  [/^\/orders\/[^/]+$/, 2],
  [/^\/account\/stores$/, 2],
  [/^\/login\/otp$/, 2],
  [/^\/connect$/, 2],
  [/^\/addresses$/, 2],
  [/^\/address$/, 2],
  [/^\/checkout\//, 2],
  [/^\/address\/new$/, 3],
  [/^\/pay\/(upi|qr)\//, 3],
  [/^\/pay\//, 4],
  [/^\/placed\//, 4],
  [/^\/track\//, 5],
]

function depthOf(path: string) {
  for (const [re, d] of DEPTH) if (re.test(path)) return d
  return 1
}

/** 1 = push forward, -1 = pop back, 0 = lateral crossfade. */
type Dir = 1 | 0 | -1

const DirContext = createContext<Dir>(0)

// iOS-ish drawer curve (Ionic). Strong out, no overshoot.
const EASE = [0.32, 0.72, 0, 1] as const
const SLIDE = { duration: 0.28, ease: EASE }
const FADE = { duration: 0.2, ease: [0.23, 1, 0.32, 1] as const }

// How far the covered page parallaxes back while the new one slides over it.
const BEHIND = 'translateX(-24%)'
const AHEAD = 'translateX(100%)'
const REST = 'translateX(0%)'

function Layer({ children, first }: { children: ReactNode; first: boolean }) {
  const dir = useContext(DirContext)
  const isPresent = useIsPresent()
  const reduce = useReducedMotion()
  const [settled, setSettled] = useState(first)

  useEffect(() => {
    if (settled || !isPresent) return
    const t = setTimeout(() => setSettled(true), 420)
    return () => clearTimeout(t)
  }, [settled, isPresent])

  const frozen = useRef<number | null>(null)
  if (!isPresent && frozen.current === null) frozen.current = window.scrollY
  const exiting = !isPresent
  const y = frozen.current ?? 0

  const slide = !reduce && dir !== 0
  const onTop = exiting ? dir !== 1 : dir === 1

  // Build animation spec—slides for depth, fades for lateral moves
  // A transform left on the page layer makes `position: fixed` children (the chat
  // bar and cart dock) pin to this layer instead of the viewport, so clear it at rest.
  const animSpec = slide
    ? {
        initial: { transform: dir === 1 ? AHEAD : BEHIND },
        animate: { transform: REST, transitionEnd: { transform: 'none' } },
        exit: { transform: dir === 1 ? BEHIND : AHEAD },
        transition: SLIDE,
      }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: FADE,
      }

  return (
    <motion.div
      {...animSpec}
      onAnimationComplete={() => setSettled(true)}
      style={{
        position: exiting ? 'absolute' : 'relative',
        left: 0,
        right: 0,
        top: exiting ? -y : undefined,
        zIndex: onTop ? 2 : 1,
        background: '#000',
        height: exiting ? y + window.innerHeight : settled ? undefined : '100dvh',
        overflow: settled && !exiting ? 'auto' : 'hidden',
        pointerEvents: exiting ? 'none' : undefined,
      }}
    >
      {children}
    </motion.div>
  )
}

export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const prev = useRef<string | null>(null)
  const dir = useRef<Dir>(0)
  const first = useRef(true)

  if (prev.current !== pathname) {
    const from = prev.current
    prev.current = pathname
    first.current = from === null
    if (from !== null) {
      const delta = depthOf(pathname) - depthOf(from)
      dir.current = delta > 0 ? 1 : delta < 0 ? -1 : 0
    }
  }

  return (
    <DirContext.Provider value={dir.current}>
      <AnimatePresence initial={false}>
        <Layer key={pathname} first={first.current}>
          {children}
        </Layer>
      </AnimatePresence>
    </DirContext.Provider>
  )
}
