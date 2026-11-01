import type { ProfileContent } from '../types/portfolio'
import { ConnectIcon, GithubIcon, InstagramIcon, LinkedinIcon } from './icons'
import { Card } from './Card'
import { SectionTitle } from './SectionTitle'

type ConnectProps = {
  profile: ProfileContent
}

export function Connect({ profile }: ConnectProps) {
  return (
    <Card className="md:col-span-8">
      <SectionTitle icon={<ConnectIcon className="h-4 w-4 md:h-[18px] md:w-[18px]" />}>
        Connect
      </SectionTitle>

      <a
        href={`mailto:${profile.email}`}
        className="mt-4 block cursor-pointer rounded-[10px] bg-well px-5 py-2.5 transition-colors duration-300 hover:opacity-80"
      >
        <p className="m-0 text-xs text-muted">Email</p>
        <span className="text-sm text-primary md:text-base">{profile.email}</span>
      </a>

      <div className="mt-2.5 flex flex-col gap-2.5">
        <p className="mt-2.5 text-xs text-muted">Social Links</p>
        <div className="grid grid-cols-3 gap-2">
          <a
            href={profile.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex items-center justify-center rounded-[10px] bg-well p-2 text-primary transition-colors duration-300 hover:opacity-80"
          >
            <InstagramIcon className="h-4 w-4" />
          </a>
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex items-center justify-center rounded-[10px] bg-well p-2 text-primary transition-colors duration-300 hover:opacity-80"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          <a
            href={profile.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex items-center justify-center rounded-[10px] bg-well p-2 text-primary transition-colors duration-300 hover:opacity-80"
          >
            <LinkedinIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </Card>
  )
}
