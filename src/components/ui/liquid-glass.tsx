import { cn } from '@/lib/utils'
import { motion, type HTMLMotionProps } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'
import { useState } from 'react'

/*
 * Liquid glass from uilayouts (`npx uilayouts@latest add liquid-glass`),
 * adapted for this app:
 *  - one shared SVG filter (<LiquidGlassFilters/>, mounted in App) instead of
 *    a duplicate `#glass-blur` per instance;
 *  - the bend / face / edge layers sit *behind* the content (isolated stacking
 *    context, z-index -1, no pointer events) so buttons inside stay tappable
 *    and layout is untouched;
 *  - draggable is opt-in, because drag captures touch and stops page scroll;
 *  - `distortion` scales the displacement to the lens size (the original 200px
 *    displacement pulls empty pixels into a 44px button);
 *  - `tint` fills the face layer for legibility over busy content.
 * The same three layers drive the `.g` CSS class in index.css.
 */

type Intensity = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type GlassDistortion = 'none' | 'sm' | 'md' | 'lg'

export type LiquidGlassCardProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  children?: ReactNode
  draggable?: boolean
  expandable?: boolean
  width?: string
  height?: string
  expandedWidth?: string
  expandedHeight?: string
  blurIntensity?: 'sm' | 'md' | 'lg' | 'xl'
  shadowIntensity?: Intensity
  glowIntensity?: Intensity
  borderRadius?: string
  distortion?: GlassDistortion
  /** Any CSS colour painted over the refracted backdrop. */
  tint?: string
  /** Scale the lens down while pressed (for buttons). */
  press?: boolean
}

const blurClasses = {
  sm: 'backdrop-blur-xs',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
}

const shadowStyles: Record<Intensity, string> = {
  none: 'inset 0 0 0 0 rgba(255, 255, 255, 0)',
  xs: 'inset 1px 1px 1px 0 rgba(255, 255, 255, 0.3), inset -1px -1px 1px 0 rgba(255, 255, 255, 0.3)',
  sm: 'inset 2px 2px 2px 0 rgba(255, 255, 255, 0.35), inset -2px -2px 2px 0 rgba(255, 255, 255, 0.35)',
  md: 'inset 3px 3px 3px 0 rgba(255, 255, 255, 0.45), inset -3px -3px 3px 0 rgba(255, 255, 255, 0.45)',
  lg: 'inset 4px 4px 4px 0 rgba(255, 255, 255, 0.5), inset -4px -4px 4px 0 rgba(255, 255, 255, 0.5)',
  xl: 'inset 6px 6px 6px 0 rgba(255, 255, 255, 0.55), inset -6px -6px 6px 0 rgba(255, 255, 255, 0.55)',
  '2xl': 'inset 8px 8px 8px 0 rgba(255, 255, 255, 0.6), inset -8px -8px 8px 0 rgba(255, 255, 255, 0.6)',
}

const glowStyles: Record<Intensity, string> = {
  none: '0 4px 4px rgba(0, 0, 0, 0.05), 0 0 12px rgba(0, 0, 0, 0.05)',
  xs: '0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 16px rgba(255, 255, 255, 0.05)',
  sm: '0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 24px rgba(255, 255, 255, 0.1)',
  md: '0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 32px rgba(255, 255, 255, 0.15)',
  lg: '0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 40px rgba(255, 255, 255, 0.2)',
  xl: '0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 48px rgba(255, 255, 255, 0.25)',
  '2xl': '0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 60px rgba(255, 255, 255, 0.3)',
}

/** Displacement in px per level; ids are referenced by `.g` in index.css too. */
const DISTORTION_SCALE: Record<Exclude<GlassDistortion, 'none'>, number> = {
  sm: 24,
  md: 80,
  lg: 200,
}

const filterUrl = (d: GlassDistortion) => (d === 'none' ? undefined : `url(#glass-blur-${d})`)

/** The shared turbulence filters. Mount once near the app root. */
export function LiquidGlassFilters() {
  return (
    <svg aria-hidden className="pointer-events-none absolute size-0 overflow-hidden">
      <defs>
        {(Object.keys(DISTORTION_SCALE) as (keyof typeof DISTORTION_SCALE)[]).map((d) => (
          <filter key={d} id={`glass-blur-${d}`} x="0" y="0" width="100%" height="100%" filterUnits="objectBoundingBox">
            <feTurbulence type="fractalNoise" baseFrequency="0.003 0.007" numOctaves="1" result="turbulence" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale={DISTORTION_SCALE[d]}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        ))}
      </defs>
    </svg>
  )
}

const ease = [0.5, 1.5, 0.5, 1] as const

export function LiquidGlassCard({
  children,
  className,
  draggable = false,
  expandable = false,
  width,
  height,
  expandedWidth,
  expandedHeight,
  blurIntensity = 'xl',
  borderRadius = '32px',
  glowIntensity = 'sm',
  shadowIntensity = 'md',
  distortion = 'lg',
  tint,
  press = false,
  style,
  onClick,
  ...props
}: LiquidGlassCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const interactive = draggable || expandable

  const motionProps: HTMLMotionProps<'div'> = interactive
    ? {
        variants: expandable
          ? {
              collapsed: { width: width || 'auto', height: height || 'auto', transition: { duration: 0.4, ease } },
              expanded: {
                width: expandedWidth || 'auto',
                height: expandedHeight || 'auto',
                transition: { duration: 0.4, ease },
              },
            }
          : undefined,
        animate: expandable ? (isExpanded ? 'expanded' : 'collapsed') : undefined,
        drag: draggable,
        dragConstraints: draggable ? { left: 0, right: 0, top: 0, bottom: 0 } : undefined,
        dragElastic: draggable ? 0.3 : undefined,
        dragTransition: draggable ? { bounceStiffness: 300, bounceDamping: 10, power: 0.3 } : undefined,
        whileDrag: draggable ? { scale: 1.02 } : undefined,
        whileHover: { scale: 1.01 },
        whileTap: { scale: 0.98 },
      }
    : {}

  const layer: CSSProperties = { borderRadius: 'inherit' }

  return (
    <motion.div
      data-liquid-glass=""
      className={cn(
        'liquid-glass relative isolate',
        draggable && 'cursor-grab active:cursor-grabbing',
        expandable && 'cursor-pointer',
        press && 'lg-press',
        className,
      )}
      style={{
        borderRadius,
        ...(width && !expandable && { width }),
        ...(height && !expandable && { height }),
        ...style,
      }}
      onClick={(e) => {
        // Don't toggle when the tap lands on something interactive inside.
        if (expandable && !(e.target as Element).closest('a, button, input, select, textarea')) {
          setIsExpanded((v) => !v)
        }
        onClick?.(e)
      }}
      {...motionProps}
      {...props}
    >
      {/* Bend layer: backdrop blur, warped by the turbulence filter. */}
      <div
        aria-hidden
        className={cn('lgc-bend pointer-events-none absolute inset-0 -z-10', blurClasses[blurIntensity])}
        style={{ ...layer, filter: filterUrl(distortion) }}
      />
      {/* Face layer: outer shadow + glow, and the optional tint. */}
      <div
        aria-hidden
        className="lgc-face pointer-events-none absolute inset-0 -z-10"
        style={{ ...layer, boxShadow: glowStyles[glowIntensity], background: tint }}
      />
      {/* Edge layer: inner highlights on the rim. */}
      <div
        aria-hidden
        className="lgc-edge pointer-events-none absolute inset-0 -z-10"
        style={{ ...layer, boxShadow: shadowStyles[shadowIntensity] }}
      />
      {children}
    </motion.div>
  )
}
