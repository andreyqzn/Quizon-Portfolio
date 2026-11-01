import { ArrowUpRight, LayoutGrid } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import type { ProjectItem } from '../types/portfolio'
import { cn } from '../lib/cn'
import { Reveal } from './Reveal'
import { SectionTitle } from './SectionTitle'

type ProjectsProps = {
  projects: ProjectItem[]
}

export function Projects({ projects }: ProjectsProps) {
  const reduceMotion = useReducedMotion()

  return (
    <Reveal as="section" className="border-t border-border py-16 md:py-20">
      <SectionTitle icon={LayoutGrid}>Projects</SectionTitle>

      <div className="flex flex-col gap-8 md:gap-10">
        {projects.map((project, index) => (
          <Reveal key={project.id} as="article" delay={index * 0.06}>
            <motion.div
              className="group relative overflow-hidden rounded-2xl border border-border"
              whileHover={reduceMotion ? undefined : { y: -2 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-subtle md:aspect-[21/9]">
                <img
                  src={project.image}
                  alt=""
                  className={cn(
                    'h-full w-full object-cover transition-transform duration-700 ease-out',
                    'group-hover:scale-[1.03]',
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-8">
                  <p className="text-xs tracking-[0.12em] text-white/70 uppercase">{project.subtitle}</p>
                  <h3 className="mt-2 font-display text-2xl tracking-tight text-white md:text-4xl">
                    {project.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
                    {project.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tech.map((item) => (
                      <span
                        key={item}
                        className="border border-white/25 px-2.5 py-1 text-[11px] tracking-wide text-white/85"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-5 text-sm text-white">
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                      >
                        Live demo
                        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                      </a>
                    ) : null}
                    {project.repoUrl ? (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                      >
                        Source
                        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="text-white/55">Demo & repo links coming soon</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </Reveal>
  )
}
