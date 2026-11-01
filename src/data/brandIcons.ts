export type BrandIconOption = {
  slug: string
  label: string
}

/** Curated Simple Icons slugs for the admin picker. */
export const BRAND_ICON_OPTIONS: BrandIconOption[] = [
  { slug: 'instagram', label: 'Instagram' },
  { slug: 'github', label: 'GitHub' },
  { slug: 'linkedin', label: 'LinkedIn' },
  { slug: 'x', label: 'X (Twitter)' },
  { slug: 'tiktok', label: 'TikTok' },
  { slug: 'youtube', label: 'YouTube' },
  { slug: 'facebook', label: 'Facebook' },
  { slug: 'discord', label: 'Discord' },
  { slug: 'twitch', label: 'Twitch' },
  { slug: 'behance', label: 'Behance' },
  { slug: 'dribbble', label: 'Dribbble' },
  { slug: 'spotify', label: 'Spotify' },
  { slug: 'telegram', label: 'Telegram' },
  { slug: 'whatsapp', label: 'WhatsApp' },
  { slug: 'threads', label: 'Threads' },
  { slug: 'linktree', label: 'Linktree' },
  { slug: 'gmail', label: 'Email (Gmail)' },
  { slug: 'link', label: 'Generic link' },
]

export function simpleIconsUrl(slug: string) {
  const safe = (slug || 'link').trim().toLowerCase() || 'link'
  return `https://cdn.simpleicons.org/${encodeURIComponent(safe)}`
}
