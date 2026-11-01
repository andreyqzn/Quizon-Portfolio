import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import type { Theme } from '../hooks/useTheme'
import { GooeyFilterDefs } from './GooeyFilterDefs'
import { ThemeToggle } from './ThemeToggle'

export const THEME_TOGGLE_ANCHOR_ID = 'theme-toggle-anchor'

const TOGGLE_SIZE = 56
/** Soft clearance around the toggle before it starts dodging. */
const CLEARANCE = 26
const MAX_DODGE_X = 132
const MAX_DODGE_Y = 96

type FloatingThemeToggleProps = {
  theme: Theme
  onToggle: (origin: { x: number; y: number }) => void
}

type Dodge = { x: number; y: number }

function toggleInset() {
  return window.matchMedia('(min-width: 768px)').matches ? 28 : 20
}

function prefersGooey() {
  return (
    window.matchMedia('(min-width: 768px)').matches &&
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/** Repulsion from nearby content so the toggle “oils away” instead of covering it. */
function computeDodge(inset: number): Dodge {
  const homeLeft = window.innerWidth - inset - TOGGLE_SIZE
  const homeTop = inset
  const radius = TOGGLE_SIZE / 2 + CLEARANCE
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-theme-dodge]'))

  let dx = 0
  let dy = 0

  // A few passes so the final resting spot fully clears the content.
  for (let pass = 0; pass < 3; pass++) {
    const cx = homeLeft + TOGGLE_SIZE / 2 + dx
    const cy = homeTop + TOGGLE_SIZE / 2 + dy

    for (const el of targets) {
      const r = el.getBoundingClientRect()
      if (r.width < 4 || r.height < 4) continue
      if (r.bottom < -80 || r.top > window.innerHeight + 80) continue

      const closestX = clamp(cx, r.left, r.right)
      const closestY = clamp(cy, r.top, r.bottom)
      const vx = cx - closestX
      const vy = cy - closestY
      const dist = Math.hypot(vx, vy)

      if (dist < 0.5) {
        const toLeft = cx - r.left
        const toRight = r.right - cx
        const toTop = cy - r.top
        const toBottom = r.bottom - cy
        if (Math.min(toLeft, toRight) <= Math.min(toTop, toBottom)) {
          dx += toLeft <= toRight ? -(toLeft + radius) : toRight + radius
        } else {
          dy += toTop <= toBottom ? -(toTop + radius) : toBottom + radius
        }
        continue
      }

      if (dist < radius) {
        const push = (radius - dist) * 1.15
        dx += (vx / dist) * push
        dy += (vy / dist) * push
      }
    }

    dx = clamp(dx, -MAX_DODGE_X, 24)
    dy = clamp(dy, -12, MAX_DODGE_Y)
  }

  return { x: dx, y: dy }
}

export function FloatingThemeToggle({ theme, onToggle }: FloatingThemeToggleProps) {
  const reduceMotion = useReducedMotion()
  const [ready, setReady] = useState(false)
  const [inset, setInset] = useState(20)
  const [gooeyActive, setGooeyActive] = useState(false)
  const [dodge, setDodge] = useState<Dodge>({ x: 0, y: 0 })

  useEffect(() => {
    const sync = () => {
      setInset(toggleInset())
      setGooeyActive(prefersGooey())
    }
    sync()
    const boot = requestAnimationFrame(() => setReady(true))
    window.addEventListener('resize', sync)
    return () => {
      cancelAnimationFrame(boot)
      window.removeEventListener('resize', sync)
    }
  }, [])

  useEffect(() => {
    if (reduceMotion) {
      setDodge({ x: 0, y: 0 })
      return
    }

    let frame = 0
    const measure = () => {
      frame = 0
      const next = computeDodge(inset)
      setDodge((prev) =>
        Math.abs(prev.x - next.x) < 0.4 && Math.abs(prev.y - next.y) < 0.4 ? prev : next,
      )
    }
    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [inset, reduceMotion])

  const separating = Math.hypot(dodge.x, dodge.y) > 6
  // Oil stretch points toward the obstacle (opposite of dodge travel).
  const stretchX = separating ? clamp(-dodge.x * 0.35, -18, 18) : 0
  const stretchY = separating ? clamp(-dodge.y * 0.35, -18, 18) : 0

  return (
    <>
      {gooeyActive ? <GooeyFilterDefs /> : null}

      <motion.div
        id={THEME_TOGGLE_ANCHOR_ID}
        className="pointer-events-auto fixed z-50 h-14 w-14"
        style={{ top: inset, right: inset }}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.72 }}
        animate={{
          opacity: ready ? 1 : 0,
          scale: ready ? 1 : 0.72,
          x: reduceMotion ? 0 : dodge.x,
          y: reduceMotion ? 0 : dodge.y,
        }}
        transition={{
          opacity: { duration: 0.35 },
          scale: { type: 'spring', stiffness: 200, damping: 22, mass: 0.85 },
          x: { type: 'spring', stiffness: 320, damping: 28, mass: 0.7 },
          y: { type: 'spring', stiffness: 320, damping: 28, mass: 0.7 },
        }}
        whileHover={reduceMotion ? undefined : { scale: 1.05 }}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      >
        <div
          className="absolute inset-0"
          style={gooeyActive ? { filter: 'url(#gooey-oil-water)' } : undefined}
          aria-hidden
        >
          {gooeyActive ? (
            <>
              <span className="theme-toggle-blob theme-toggle-blob--core" />
              <span
                className="theme-toggle-blob theme-toggle-blob--orbit"
                data-separating={separating ? 'true' : undefined}
              />
              <span
                className="theme-toggle-blob theme-toggle-blob--drip"
                data-separating={separating ? 'true' : undefined}
                style={
                  separating
                    ? { transform: `translate3d(${stretchX}px, ${stretchY}px, 0) scale(1.2)` }
                    : undefined
                }
              />
            </>
          ) : (
            <span className="absolute inset-0 rounded-full border border-border/50 bg-page/55 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md dark:bg-page/50 dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)]" />
          )}
        </div>

        <ThemeToggle
          theme={theme}
          onToggle={onToggle}
          className="relative z-10 h-14 w-14 border-0 bg-transparent text-primary shadow-none"
        />
      </motion.div>
    </>
  )
}
