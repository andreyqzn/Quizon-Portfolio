import type { ProfileContent } from '../types/portfolio'
import type { Theme } from '../hooks/useTheme'
import { CvIcon, EmailIcon, LocationIcon } from './icons'
import { ThemeToggle } from './ThemeToggle'

type HeaderProps = {
  profile: ProfileContent
  theme: Theme
  onToggleTheme: () => void
}

export function Header({ profile, theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="flex flex-row items-stretch justify-start gap-[15px]">
      <img
        src={profile.photoUrl}
        alt={`${profile.name} profile photo`}
        className="h-40 w-40 shrink-0 rounded-lg object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-lg font-bold text-primary md:text-[25px]">{profile.name}</h1>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
          <p className="mt-0.5 flex items-center justify-start text-xs text-muted md:text-base">
            <LocationIcon className="mr-1.5 h-3 w-3 md:h-4 md:w-4" />
            <span>{profile.location}</span>
          </p>
          <h2 className="mt-0.5 text-[13px] font-normal text-primary md:text-base">{profile.role}</h2>
        </div>
        <div className="mt-1.5 flex flex-col">
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-7 w-fit items-center rounded-lg border border-cta bg-cta px-2 text-[10px] font-medium text-cta-text transition-transform duration-300 hover:[transform:perspective(500px)_translateZ(20px)] md:h-8 md:px-4 md:text-sm"
          >
            <CvIcon className="mr-1.5 h-3 w-3 md:h-[18px] md:w-[18px]" />
            Resume
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="mt-1.5 inline-flex h-7 w-fit items-center rounded-lg border border-border bg-transparent px-2 text-[10px] font-medium text-primary transition-transform duration-300 hover:[transform:perspective(500px)_translateZ(20px)] md:h-8 md:px-4 md:text-sm"
          >
            <EmailIcon className="mr-1.5 h-3 w-3 md:h-[18px] md:w-[18px]" />
            Send Email
          </a>
        </div>
      </div>
    </header>
  )
}
