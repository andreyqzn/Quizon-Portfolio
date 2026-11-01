import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { LoaderMark } from './LoaderMark'

const BOOT_MIN_MS = 520
const ROUTE_MIN_MS = 380

/**
 * Full-viewport loader for first paint and client-side route changes.
 * Dismisses the inline #boot-loader from index.html on mount.
 */
export function PageLoader() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(true)
  const bootDone = useRef(false)
  const hideTimer = useRef<number | null>(null)
  const pathRef = useRef(location.pathname)

  useEffect(() => {
    const boot = document.getElementById('boot-loader')
    if (boot) boot.dataset.ready = 'true'

    const started = performance.now()
    const finishBoot = () => {
      const elapsed = performance.now() - started
      const wait = Math.max(0, BOOT_MIN_MS - elapsed)
      window.setTimeout(() => {
        bootDone.current = true
        setVisible(false)
        boot?.remove()
      }, reduceMotion ? 0 : wait)
    }

    if (document.readyState === 'complete') finishBoot()
    else window.addEventListener('load', finishBoot, { once: true })

    return () => window.removeEventListener('load', finishBoot)
  }, [reduceMotion])

  useEffect(() => {
    if (!bootDone.current) {
      pathRef.current = location.pathname
      return
    }
    if (location.pathname === pathRef.current) return
    pathRef.current = location.pathname

    if (hideTimer.current) window.clearTimeout(hideTimer.current)
    setVisible(true)

    const duration = reduceMotion ? 80 : ROUTE_MIN_MS
    hideTimer.current = window.setTimeout(() => {
      setVisible(false)
      hideTimer.current = null
    }, duration)

    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current)
    }
  }, [location.pathname, reduceMotion])

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="page-loader"
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-page"
          initial={false}
          animate={{ opacity: 1 }}
          exit={
            reduceMotion
              ? { opacity: 0, transition: { duration: 0.12 } }
              : { opacity: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
          }
        >
          <span className="sr-only">Loading</span>
          <LoaderMark />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
