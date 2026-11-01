import { FileText, Mail, MapPin } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import type { ProfileContent } from '../types/portfolio'
import { cn } from '../lib/cn'

type HeaderProps = {
  profile: ProfileContent
}

export function Header({ profile }: HeaderProps) {
  const reduceMotion = useReducedMotion()

  return (
    <header className="relative">
      <div className="grid items-end gap-10 md:grid-cols-12 md:gap-12">
        <motion.div
          className="order-2 md:order-1 md:col-span-7"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-4 flex items-center gap-2 text-sm tracking-wide text-muted uppercase">
            <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            <span>{profile.location}</span>
          </p>

          <h1 className="font-display text-5xl leading-[0.95] tracking-tight text-primary sm:text-6xl md:text-7xl lg:text-8xl">
            {profile.name}
          </h1>

          <p className="mt-5 max-w-md text-base text-muted md:text-lg">{profile.role}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex h-11 items-center gap-2 rounded-full bg-cta px-5 text-sm font-medium text-cta-text',
                'hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
              )}
            >
              <FileText className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              Resume
            </a>
            <a
              href={`mailto:${profile.email}`}
              className={cn(
                'inline-flex h-11 items-center gap-2 rounded-full border border-border bg-transparent px-5 text-sm font-medium text-primary',
                'hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
              )}
            >
              <Mail className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              Email
            </a>
          </div>
        </motion.div>

        <motion.div
          className="order-1 md:order-2 md:col-span-5"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        >
          <div
            data-theme-dodge
            className="relative -mx-6 h-[58vw] overflow-hidden rounded-2xl sm:h-[48vw] md:mx-0 md:aspect-[4/5] md:h-auto md:rounded-3xl"
          >
            <img
              src={profile.photoUrl}
              alt={`${profile.name} profile photo`}
              width={800}
              height={1000}
              decoding="async"
              fetchPriority="high"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </motion.div>
      </div>
    </header>
  )
}
