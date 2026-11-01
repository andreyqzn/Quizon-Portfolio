import { Moon, Sun } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { Theme } from '../hooks/useTheme'
import { cn } from '../lib/cn'

type ThemeToggleProps = {
  theme: Theme
  onToggle: (origin: { x: number; y: number }) => void
  className?: string
}

export function ThemeToggle({ theme, onToggle, className }: ThemeToggleProps) {
  const reduceMotion = useReducedMotion()

  return (
    <button
      type="button"
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        onToggle({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        })
      }}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'inline-flex h-11 w-11 items-center justify-center rounded-full text-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={reduceMotion ? false : { opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24, mass: 0.7 }}
          className="inline-flex"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <Moon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
