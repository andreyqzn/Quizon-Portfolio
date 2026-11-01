import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'article' | 'li'
}

export function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  const Component =
    as === 'section'
      ? motion.section
      : as === 'article'
        ? motion.article
        : as === 'li'
          ? motion.li
          : motion.div

  return (
    <Component
      className={cn(className)}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Component>
  )
}
