import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import type { Theme } from '../hooks/useTheme'
import { GooeyFilterDefs } from './GooeyFilterDefs'
import { ThemeToggle } from './ThemeToggle'
import { cn } from '../lib/cn'

export const THEME_TOGGLE_ANCHOR_ID = 'theme-toggle-anchor'

const TOGGLE_SIZE = 52
const CLEARANCE = 22
const MAX_DODGE_X = 140
const MAX_DODGE_Y = 88

type FloatingThemeToggleProps = {
  theme: Theme
  onToggle: (origin: { x: number; y: number }) => void
}

type Dodge = { x: number; y: number }

function toggleInset() {
  return window.matchMedia('(min-width: 768px)').matches ? 24 : 16
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

function computeDodge(inset: number): Dodge {
  const homeLeft = window.innerWidth - inset - TOGGLE_SIZE
  const homeTop = inset
  const radius = TOGGLE_SIZE / 2 + CLEARANCE
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-theme-dodge]'))

  let dx = 0
  let dy = 0

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
        const push = (radius - dist) * 1.1
        dx += (vx / dist) * push
        dy += (vy / dist) * push
      }
    }

    dx = clamp(dx, -MAX_DODGE_X, 16)
    dy = clamp(dy, -8, MAX_DODGE_Y)
  }

  return { x: dx, y: dy }
}

export function FloatingThemeToggle({ theme, onToggle }: FloatingThemeToggleProps) {
  const reduceMotion = useReducedMotion()
  const [ready, setReady] = useState(false)
  const [inset, setInset] = useState(16)
  const [gooeyActive, setGooeyActive] = useState(false)
  const [oil, setOil] = useState({ separating: false, stretchX: 0, stretchY: 0 })

  const dodgeX = useMotionValue(0)
  const dodgeY = useMotionValue(0)
  const springX = useSpring(dodgeX, { stiffness: 360, damping: 30, mass: 0.55 })
  const springY = useSpring(dodgeY, { stiffness: 360, damping: 30, mass: 0.55 })

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
      dodgeX.set(0)
      dodgeY.set(0)
      setOil({ separating: false, stretchX: 0, stretchY: 0 })
      return
    }

    let frame = 0
    const measure = () => {
      frame = 0
      const next = computeDodge(inset)
      dodgeX.set(next.x)
      dodgeY.set(next.y)
      const mag = Math.hypot(next.x, next.y)
      setOil({
        separating: mag > 8,
        stretchX: mag > 8 ? clamp(-next.x * 0.28, -14, 14) : 0,
        stretchY: mag > 8 ? clamp(-next.y * 0.28, -14, 14) : 0,
      })
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
  }, [inset, reduceMotion, dodgeX, dodgeY])

  return (
    <>
      {gooeyActive ? <GooeyFilterDefs /> : null}

      <motion.div
        id={THEME_TOGGLE_ANCHOR_ID}
        className="pointer-events-auto fixed z-50"
        style={{
          top: inset,
          right: inset,
          width: TOGGLE_SIZE,
          height: TOGGLE_SIZE,
          x: reduceMotion ? 0 : springX,
          y: reduceMotion ? 0 : springY,
        }}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.78 }}
        animate={{
          opacity: ready ? 1 : 0,
          scale: ready ? (oil.separating ? 0.94 : 1) : 0.78,
        }}
        transition={{
          opacity: { duration: 0.3 },
          scale: { type: 'spring', stiffness: 260, damping: 22, mass: 0.7 },
        }}
        whileHover={reduceMotion ? undefined : { scale: oil.separating ? 0.98 : 1.06 }}
        whileTap={reduceMotion ? undefined : { scale: 0.94 }}
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
                data-separating={oil.separating ? 'true' : undefined}
              />
              <span
                className="theme-toggle-blob theme-toggle-blob--drip"
                data-separating={oil.separating ? 'true' : undefined}
                style={
                  oil.separating
                    ? {
                        transform: `translate3d(${oil.stretchX}px, ${oil.stretchY}px, 0) scale(1.18)`,
                      }
                    : undefined
                }
              />
            </>
          ) : (
            <span
              className={cn(
                'absolute inset-0 rounded-full border border-border/40',
                'bg-page/60 shadow-[0_6px_20px_rgba(0,0,0,0.07)] backdrop-blur-md',
                'dark:bg-page/55 dark:shadow-[0_6px_20px_rgba(0,0,0,0.4)]',
              )}
            />
          )}
        </div>

        <ThemeToggle
          theme={theme}
          onToggle={onToggle}
          className="relative z-10 h-full w-full border-0 bg-transparent text-primary shadow-none"
        />
      </motion.div>
    </>
  )
}
