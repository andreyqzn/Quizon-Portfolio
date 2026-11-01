import { useCallback, useEffect, useRef, useState } from 'react'

export type Theme = 'light' | 'dark'

type ThemeToggleOrigin = {
  x: number
  y: number
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return 'dark'
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  localStorage.setItem('theme', theme)
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

async function runThemeWave(
  next: Theme,
  origin: ThemeToggleOrigin | undefined,
  onApplied: () => void,
) {
  const doc = document as Document & {
    startViewTransition?: (callback: () => void) => {
      ready: Promise<void>
      finished: Promise<void>
    }
  }

  const update = () => {
    applyTheme(next)
    onApplied()
  }

  if (typeof doc.startViewTransition !== 'function' || prefersReducedMotion()) {
    update()
    return
  }

  // Skip expensive full-page view transitions on coarse / small screens.
  const isMobile =
    window.matchMedia('(max-width: 767px)').matches ||
    window.matchMedia('(pointer: coarse)').matches

  if (isMobile) {
    update()
    return
  }

  const x = origin?.x ?? window.innerWidth - 40
  const y = origin?.y ?? 40
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  )

  document.documentElement.dataset.themeWave = 'true'

  const transition = doc.startViewTransition(update)

  try {
    await transition.ready

    document.documentElement.animate(
      {
        clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
      },
      {
        duration: 720,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        pseudoElement: '::view-transition-new(root)',
      },
    )
  } catch {
    // View transition aborted or unsupported mid-flight
  } finally {
    try {
      await transition.finished
    } catch {
      // ignore abort
    }
    delete document.documentElement.dataset.themeWave
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)
  const themeRef = useRef(theme)
  const animatingRef = useRef(false)

  useEffect(() => {
    themeRef.current = theme
  }, [theme])

  useEffect(() => {
    applyTheme(theme)
    // Sync DOM once on mount; subsequent changes go through animated toggles.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const commitTheme = useCallback((next: Theme) => {
    themeRef.current = next
    setThemeState(next)
  }, [])

  const setTheme = useCallback(
    (next: Theme, origin?: ThemeToggleOrigin) => {
      if (animatingRef.current || next === themeRef.current) return
      animatingRef.current = true
      void (async () => {
        try {
          await runThemeWave(next, origin, () => commitTheme(next))
        } finally {
          animatingRef.current = false
        }
      })()
    },
    [commitTheme],
  )

  const toggleTheme = useCallback(
    (origin?: ThemeToggleOrigin) => {
      if (animatingRef.current) return
      const next = themeRef.current === 'dark' ? 'light' : 'dark'
      animatingRef.current = true
      void (async () => {
        try {
          await runThemeWave(next, origin, () => commitTheme(next))
        } finally {
          animatingRef.current = false
        }
      })()
    },
    [commitTheme],
  )

  return { theme, setTheme, toggleTheme }
}
