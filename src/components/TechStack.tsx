import { Code2 } from 'lucide-react'
import type { TechStackContent } from '../types/portfolio'
import { cn } from '../lib/cn'
import { Reveal } from './Reveal'
import { SectionTitle } from './SectionTitle'

function Chip({ label }: { label: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-chip-border px-3.5 py-1.5 text-sm text-primary',
        'transition-colors hover:border-primary hover:bg-subtle',
      )}
    >
      {label}
    </span>
  )
}

type TechStackProps = {
  techStack: TechStackContent
}

export function TechStack({ techStack }: TechStackProps) {
  const groups = [
    { title: 'Frontend', items: techStack.frontend },
    { title: 'Backend', items: techStack.backend },
    { title: 'Tools', items: techStack.tools },
  ] as const

  return (
    <Reveal as="section" className="border-t border-border py-16 md:py-20">
      <SectionTitle icon={Code2}>Tech Stack</SectionTitle>
      <div className="grid gap-10 md:grid-cols-3 md:gap-8">
        {groups.map((group) => (
          <div key={group.title}>
            <h4 className="mb-4 text-xs font-medium tracking-[0.14em] text-muted uppercase">
              {group.title}
            </h4>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <Chip key={item} label={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  )
}
