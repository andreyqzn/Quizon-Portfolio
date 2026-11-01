import { Sparkles } from 'lucide-react'
import { Reveal } from './Reveal'
import { SectionTitle } from './SectionTitle'

type BeyondCodingProps = {
  body: string
}

export function BeyondCoding({ body }: BeyondCodingProps) {
  return (
    <Reveal as="section" className="border-t border-border py-16 md:py-20">
      <SectionTitle icon={Sparkles}>Beyond Coding</SectionTitle>
      <p className="max-w-2xl text-base leading-relaxed text-primary md:text-lg md:leading-relaxed">
        {body}
      </p>
    </Reveal>
  )
}
