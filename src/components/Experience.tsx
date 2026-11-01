import { Briefcase } from 'lucide-react'
import type { ExperienceItem } from '../types/portfolio'
import { Reveal } from './Reveal'
import { SectionTitle } from './SectionTitle'

type ExperienceProps = {
  items: ExperienceItem[]
}

export function Experience({ items }: ExperienceProps) {
  return (
    <Reveal as="section" className="border-t border-border py-16 md:py-20">
      <SectionTitle icon={Briefcase}>Experience</SectionTitle>
      <ul className="flex list-none flex-col gap-0 p-0">
        {items.map((item) => (
          <li
            key={item.id ?? `${item.year}-${item.title}-${item.org}`}
            className="group grid grid-cols-[5.5rem_1fr] gap-4 border-b border-border py-5 last:border-b-0 md:grid-cols-[7rem_1fr] md:gap-8"
          >
            <span className="pt-0.5 font-mono text-xs tracking-wider text-muted uppercase md:text-sm">
              {item.year}
            </span>
            <div>
              <h4 className="text-lg font-medium tracking-tight text-primary transition-opacity group-hover:opacity-70 md:text-xl">
                {item.title}
              </h4>
              <p className="mt-1 text-sm text-muted md:text-base">{item.org}</p>
            </div>
          </li>
        ))}
      </ul>
    </Reveal>
  )
}
