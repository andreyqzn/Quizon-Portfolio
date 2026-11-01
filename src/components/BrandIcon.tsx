import { cn } from '../lib/cn'
import { simpleIconsUrl } from '../data/brandIcons'

type BrandIconProps = {
  slug: string
  className?: string
  title?: string
}

export function BrandIcon({ slug, className, title }: BrandIconProps) {
  return (
    <img
      src={simpleIconsUrl(slug)}
      alt=""
      title={title}
      className={cn('h-4 w-4 shrink-0 dark:invert', className)}
      loading="lazy"
      decoding="async"
    />
  )
}
