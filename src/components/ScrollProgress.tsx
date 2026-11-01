import { useEffect, useState } from 'react'
import { cn } from '../lib/cn'

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [hasOverflow, setHasOverflow] = useState(false)

  useEffect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setHasOverflow(scrollable > 8)
      setProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  if (!hasOverflow) return null

  return (
    <div
      className="pointer-events-none fixed top-0 right-0 z-40 flex h-dvh w-3 items-stretch justify-center py-8"
      aria-hidden="true"
    >
      <div className="relative h-full w-px overflow-hidden bg-border/70">
        <div
          className={cn('absolute inset-x-0 top-0 w-full origin-top bg-primary transition-[height] duration-150 ease-out')}
          style={{ height: `${progress * 100}%` }}
        />
      </div>
    </div>
  )
}
