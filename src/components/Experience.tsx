import type { ExperienceItem } from '../types/portfolio'
import { ExpIcon } from './icons'
import { Card } from './Card'
import { SectionTitle } from './SectionTitle'

type ExperienceProps = {
  items: ExperienceItem[]
}

export function Experience({ items }: ExperienceProps) {
  return (
    <Card className="md:col-span-3 md:row-span-2">
      <SectionTitle icon={<ExpIcon className="h-4 w-4 md:h-[18px] md:w-[18px]" />}>
        Experience
      </SectionTitle>
      <ul className="mt-5 ml-4 flex list-none flex-col gap-2.5 md:ml-1.5">
        {items.map((item) => (
          <li key={item.id ?? `${item.year}-${item.title}-${item.org}`} className="flex flex-row items-center">
            <span className="mr-2.5 rounded-[10px] border border-chip-border px-2.5 py-0.5 text-xs text-primary">
              {item.year}
            </span>
            <div>
              <h4 className="text-base font-medium text-primary">{item.title}</h4>
              <p className="text-sm text-primary">{item.org}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
