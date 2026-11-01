import { motion, useReducedMotion } from 'motion/react'

/** Minimal black/white loading mark used by PageLoader and auth gates. */
export function LoaderMark({ label = 'Loading' }: { label?: string }) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative flex flex-col items-center gap-6">
      <motion.div
        className="h-px w-10 origin-center bg-primary"
        initial={reduceMotion ? false : { scaleX: 0, opacity: 0.35 }}
        animate={
          reduceMotion
            ? { opacity: 0.7 }
            : {
                scaleX: [0.35, 1, 0.35],
                opacity: [0.35, 1, 0.35],
              }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 1.4, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }
        }
      />
      <p className="font-display text-sm tracking-[0.28em] text-muted uppercase">{label}</p>
    </div>
  )
}
