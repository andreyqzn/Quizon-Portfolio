import { useCallback, useEffect, useState } from 'react'
import { fallbackContent } from '../data/content'
import { getPublicAssetUrl, isSupabaseConfigured, supabase } from '../lib/supabase'
import type { PortfolioContent } from '../types/portfolio'

function resolveAsset(path: string | null | undefined, fallback: string) {
  return getPublicAssetUrl(path) ?? fallback
}

export function usePortfolioContent() {
  const [content, setContent] = useState<PortfolioContent>(fallbackContent)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState<string | null>(null)
  const [fromRemote, setFromRemote] = useState(false)

  const refresh = useCallback(async () => {
    if (!supabase) {
      setContent(fallbackContent)
      setFromRemote(false)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [
        profileRes,
        aboutRes,
        experienceRes,
        educationRes,
        techRes,
        beyondRes,
        projectsRes,
        socialsPageRes,
        socialLinksRes,
        connectLinksRes,
      ] = await Promise.all([
        supabase.from('profile').select('*').eq('id', 1).maybeSingle(),
        supabase.from('about').select('*').eq('id', 1).maybeSingle(),
        supabase.from('experience').select('*').order('sort_order', { ascending: true }),
        supabase.from('education').select('*').eq('id', 1).maybeSingle(),
        supabase.from('tech_stack').select('*').eq('id', 1).maybeSingle(),
        supabase.from('beyond_coding').select('*').eq('id', 1).maybeSingle(),
        supabase.from('projects').select('*').order('sort_order', { ascending: true }),
        supabase.from('socials_page').select('*').eq('id', 1).maybeSingle(),
        supabase.from('social_links').select('*').order('sort_order', { ascending: true }),
        supabase.from('connect_links').select('*').order('sort_order', { ascending: true }),
      ])

      const firstError =
        profileRes.error ||
        aboutRes.error ||
        experienceRes.error ||
        educationRes.error ||
        techRes.error ||
        beyondRes.error ||
        projectsRes.error

      if (firstError) {
        throw new Error(firstError.message)
      }

      if (!profileRes.data) {
        setContent(fallbackContent)
        setFromRemote(false)
        return
      }

      const p = profileRes.data
      const mapped: PortfolioContent = {
        profile: {
          name: p.name,
          role: p.role,
          location: p.location,
          email: p.email,
          resumeUrl: resolveAsset(p.resume_path, fallbackContent.profile.resumeUrl),
          photoUrl: resolveAsset(p.photo_path, fallbackContent.profile.photoUrl),
          socials: {
            instagram: p.instagram_url || fallbackContent.profile.socials.instagram,
            github: p.github_url || fallbackContent.profile.socials.github,
            linkedin: p.linkedin_url || fallbackContent.profile.socials.linkedin,
          },
        },
        about: {
          paragraphs:
            aboutRes.data?.paragraphs?.length > 0
              ? aboutRes.data.paragraphs
              : fallbackContent.about.paragraphs,
        },
        experience:
          experienceRes.data && experienceRes.data.length > 0
            ? experienceRes.data.map((row) => ({
                id: row.id,
                year: row.year,
                title: row.title,
                org: row.org,
                sortOrder: row.sort_order,
              }))
            : fallbackContent.experience,
        education: educationRes.data
          ? {
              degree: educationRes.data.degree,
              school: educationRes.data.school,
              detail: educationRes.data.detail,
            }
          : fallbackContent.education,
        techStack: techRes.data
          ? {
              frontend: techRes.data.frontend ?? [],
              backend: techRes.data.backend ?? [],
              tools: techRes.data.tools ?? [],
            }
          : fallbackContent.techStack,
        beyondCoding: beyondRes.data?.body || fallbackContent.beyondCoding,
        projects:
          projectsRes.data && projectsRes.data.length > 0
            ? projectsRes.data.map((row) => {
                const fallbackProject = fallbackContent.projects.find((p) => p.slug === row.slug)
                return {
                  id: row.id,
                  slug: row.slug,
                  title: row.title,
                  subtitle: row.subtitle,
                  description: row.description,
                  tech: row.tech ?? [],
                  image: resolveAsset(
                    row.image_path,
                    fallbackProject?.image ?? '/assets/img/smart-queue-placeholder.svg',
                  ),
                  liveUrl: row.live_url || undefined,
                  repoUrl: row.repo_url || undefined,
                  featured: row.featured,
                  sortOrder: row.sort_order,
                }
              })
            : fallbackContent.projects,
        socialsPage: {
          displayName:
            socialsPageRes.data?.display_name || fallbackContent.socialsPage.displayName,
          links:
            !socialLinksRes.error && socialLinksRes.data && socialLinksRes.data.length > 0
              ? socialLinksRes.data.map((row) => ({
                  id: row.id,
                  label: row.label,
                  handle: row.handle ?? '',
                  url: row.url,
                  iconSlug: row.icon_slug || 'link',
                  sortOrder: row.sort_order,
                }))
              : fallbackContent.socialsPage.links,
        },
        connectLinks:
          !connectLinksRes.error && connectLinksRes.data && connectLinksRes.data.length > 0
            ? connectLinksRes.data.map((row) => ({
                id: row.id,
                label: row.label,
                handle: row.handle ?? '',
                url: row.url,
                iconSlug: row.icon_slug || 'link',
                sortOrder: row.sort_order,
              }))
            : fallbackContent.connectLinks,
      }

      setContent(mapped)
      setFromRemote(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content')
      setContent(fallbackContent)
      setFromRemote(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { content, loading, error, fromRemote, refresh }
}
