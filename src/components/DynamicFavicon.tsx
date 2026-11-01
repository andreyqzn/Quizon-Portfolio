import { useEffect } from 'react'

type DynamicFaviconProps = {
  href: string
}

function upsertLink(rel: string, href: string, type?: string) {
  let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!link) {
    link = document.createElement('link')
    link.rel = rel
    document.head.appendChild(link)
  }
  if (type) link.type = type
  else link.removeAttribute('type')
  link.href = href
}

export function DynamicFavicon({ href }: DynamicFaviconProps) {
  useEffect(() => {
    if (!href) return
    upsertLink('icon', href)
    upsertLink('apple-touch-icon', href)
  }, [href])

  return null
}
