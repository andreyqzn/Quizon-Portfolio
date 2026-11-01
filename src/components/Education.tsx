import { GraduationCap } from 'lucide-react'
import type { EducationContent } from '../types/portfolio'
import { Reveal } from './Reveal'
import { SectionTitle } from './SectionTitle'

type EducationProps = {
  education: EducationContent
}

export function Education({ education }: EducationProps) {
  return (
    <Reveal as="section" className="border-t border-border py-16 md:py-20">
      <SectionTitle icon={GraduationCap}>Education</SectionTitle>
      <div className="max-w-2xl">
        <h4 className="text-lg font-medium tracking-tight text-primary md:text-xl">{education.degree}</h4>
        <p className="mt-1 text-base text-primary">{education.school}</p>
        <p className="mt-3 text-sm text-muted md:text-base">{education.detail}</p>
      </div>
    </Reveal>
  )
}
