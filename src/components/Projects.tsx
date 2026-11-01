import type { ProjectItem } from '../types/portfolio'
import { ProjectsIcon } from './icons'
import { Card } from './Card'
import { SectionTitle } from './SectionTitle'

type ProjectsProps = {
  projects: ProjectItem[]
}

export function Projects({ projects }: ProjectsProps) {
  return (
    <Card className="md:col-span-8">
      <SectionTitle icon={<ProjectsIcon className="h-4 w-4 md:h-[18px] md:w-[18px]" />}>
        Projects
      </SectionTitle>

      <div className="mt-2.5 flex flex-col gap-1.5">
        {projects.map((project) => (
          <article
            key={project.id}
            className="relative flex min-h-[200px] items-end overflow-hidden rounded-[10px] border border-border bg-cover bg-center"
            style={{ backgroundImage: `url('${project.image}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-black/10" />
            <div className="relative z-10 p-[15px]">
              <p className="w-max rounded-[3px] bg-label px-1.5 py-0.5 text-xs text-primary italic dark:text-white">
                {project.subtitle}
              </p>
              <h3 className="mt-1 text-base text-white">{project.title}</h3>
              <p className="scrollbar-none mt-1 max-h-[60px] overflow-y-auto text-xs text-white/75 md:text-sm">
                {project.description}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {project.tech.map((item) => (
                  <span
                    key={item}
                    className="rounded border border-white/40 px-1.5 py-0.5 text-[10px] text-white/90"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-white">
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-2 hover:underline"
                  >
                    Live demo
                  </a>
                ) : null}
                {project.repoUrl ? (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-2 hover:underline"
                  >
                    Source
                  </a>
                ) : (
                  <span className="text-white/60">Demo & repo links coming soon</span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Card>
  )
}
