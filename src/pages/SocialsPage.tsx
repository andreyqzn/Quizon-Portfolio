import { motion, useReducedMotion } from 'motion/react'
import { BrandIcon } from '../components/BrandIcon'
import { DynamicFavicon } from '../components/DynamicFavicon'
import { FloatingThemeToggle } from '../components/FloatingThemeToggle'
import { usePortfolioContent } from '../hooks/usePortfolioContent'
import { useTheme } from '../hooks/useTheme'
import { cn } from '../lib/cn'

export function SocialsPage() {
  const { theme, toggleTheme } = useTheme()
  const { content } = usePortfolioContent()
  const reduceMotion = useReducedMotion()
  const { profile, socialsPage } = content

  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-6 py-16 md:px-8">
      <DynamicFavicon href={profile.photoUrl} />
      <FloatingThemeToggle theme={theme} onToggle={toggleTheme} />

      <motion.div
        className="flex flex-1 flex-col items-center justify-center"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          data-theme-dodge
          src={profile.photoUrl}
          alt=""
          className="h-24 w-24 rounded-full object-cover object-center"
        />
        <h1 className="mt-6 font-display text-3xl tracking-tight text-primary">
          {socialsPage.displayName}
        </h1>

        <nav className="mt-10 flex w-full flex-col gap-3" aria-label="Social links">
          {socialsPage.links.map((link, index) => (
            <motion.a
              key={link.id ?? `${link.label}-${index}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + index * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'flex min-h-14 items-center gap-4 rounded-2xl border border-border bg-surface/60 px-5 py-3.5 text-primary',
                'transition-colors hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
              )}
            >
              <BrandIcon slug={link.iconSlug} className="h-5 w-5" />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-medium">{link.label}</span>
                {link.handle ? (
                  <span className="truncate text-xs text-muted">{link.handle}</span>
                ) : null}
              </span>
            </motion.a>
          ))}
        </nav>
      </motion.div>
    </div>
  )
}
