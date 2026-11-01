import { User } from 'lucide-react'
import { Reveal } from './Reveal'
import { SectionTitle } from './SectionTitle'

type AboutProps = {
  paragraphs: string[]
}

export function About({ paragraphs }: AboutProps) {
  return (
    <Reveal as="section" className="border-t border-border py-16 md:py-20">
      <SectionTitle icon={User}>About</SectionTitle>
      <div className="max-w-2xl space-y-5">
        {paragraphs.map((paragraph, index) => (
          <p
            key={`${index}-${paragraph.slice(0, 24)}`}
            className="text-base leading-relaxed text-primary md:text-lg md:leading-relaxed"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </Reveal>
  )
}
