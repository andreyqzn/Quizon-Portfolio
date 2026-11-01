import { AboutIcon } from './icons'
import { Card } from './Card'
import { SectionTitle } from './SectionTitle'

type AboutProps = {
  paragraphs: string[]
}

export function About({ paragraphs }: AboutProps) {
  return (
    <Card className="md:col-span-5">
      <SectionTitle icon={<AboutIcon className="h-4 w-4 md:h-[18px] md:w-[18px]" />}>
        About
      </SectionTitle>
      {paragraphs.map((paragraph, index) => (
        <p
          key={`${index}-${paragraph.slice(0, 24)}`}
          className={`text-sm leading-relaxed text-primary ${index > 0 ? 'mt-4' : ''}`}
        >
          {paragraph}
        </p>
      ))}
    </Card>
  )
}
