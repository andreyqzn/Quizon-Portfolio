import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

type SectionTitleProps = {
  icon: LucideIcon
  children: ReactNode
  className?: string
}

export function SectionTitle({ icon: Icon, children, className }: SectionTitleProps) {
  return (
    <h3
      className={cn(
        'mb-8 flex items-center gap-3 font-display text-2xl tracking-tight text-primary md:text-3xl',
        className,
      )}
    >
      <Icon className="h-5 w-5 shrink-0 text-muted" strokeWidth={1.5} aria-hidden="true" />
      <span>{children}</span>
    </h3>
  )
}
