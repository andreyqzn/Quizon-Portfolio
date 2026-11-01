import type { TechStackContent } from '../types/portfolio'
import { TechIcon } from './icons'
import { Card } from './Card'
import { SectionTitle } from './SectionTitle'

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-block rounded-md border border-chip-border px-2 py-0.5 text-xs text-primary">
      {label}
    </span>
  )
}

type TechStackProps = {
  techStack: TechStackContent
}

export function TechStack({ techStack }: TechStackProps) {
  return (
    <Card className="md:col-span-5">
      <SectionTitle icon={<TechIcon className="h-4 w-4 md:h-[18px] md:w-[18px]" />}>
        Tech Stack
      </SectionTitle>

      <div className="mt-2.5 space-y-3">
        <div>
          <h4 className="mb-2.5 text-base font-medium text-primary">Frontend</h4>
          <div className="flex flex-wrap gap-1.5">
            {techStack.frontend.map((item) => (
              <Chip key={item} label={item} />
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-2.5 text-base font-medium text-primary">Backend</h4>
          <div className="flex flex-wrap gap-1.5">
            {techStack.backend.map((item) => (
              <Chip key={item} label={item} />
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-2.5 text-base font-medium text-primary">Tools</h4>
          <div className="flex flex-wrap gap-1.5">
            {techStack.tools.map((item) => (
              <Chip key={item} label={item} />
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
