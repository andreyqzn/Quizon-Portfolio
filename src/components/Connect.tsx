import { Link2, Mail } from 'lucide-react'
import type { ProfileContent, SocialLinkItem } from '../types/portfolio'
import { BrandIcon } from './BrandIcon'
import { cn } from '../lib/cn'
import { Reveal } from './Reveal'
import { SectionTitle } from './SectionTitle'

type ConnectProps = {
  profile: ProfileContent
  links: SocialLinkItem[]
}

export function Connect({ profile, links }: ConnectProps) {
  return (
    <Reveal as="section" className="border-t border-border py-16 md:py-20">
      <SectionTitle icon={Link2}>Connect</SectionTitle>

      <a
        href={`mailto:${profile.email}`}
        className={cn(
          'group inline-flex min-h-11 items-center gap-3 text-primary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        )}
      >
        <Mail className="h-4 w-4 text-muted transition-colors group-hover:text-primary" strokeWidth={1.5} />
        <span className="text-lg tracking-tight underline-offset-4 group-hover:underline md:text-2xl">
          {profile.email}
        </span>
      </a>

      {links.length > 0 ? (
        <div className="mt-10 flex flex-wrap gap-3">
          {links.map((link) => (
            <a
              key={link.id ?? `${link.label}-${link.url}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className={cn(
                'inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm text-primary',
                'hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
              )}
            >
              <BrandIcon slug={link.iconSlug} />
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
    </Reveal>
  )
}
