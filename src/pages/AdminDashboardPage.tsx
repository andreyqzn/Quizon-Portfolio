import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { IconPicker } from '../components/IconPicker'
import { useAuth } from '../context/AuthContext'
import { usePortfolioContent } from '../hooks/usePortfolioContent'
import { fallbackContent } from '../data/content'
import { getPublicAssetUrl, supabase } from '../lib/supabase'
import { removePortfolioAsset, slugify, uploadPortfolioAsset } from '../lib/uploads'
import type { ExperienceItem, ProjectItem, SocialLinkItem } from '../types/portfolio'

type Tab =
  | 'profile'
  | 'about'
  | 'experience'
  | 'education'
  | 'tech'
  | 'beyond'
  | 'projects'
  | 'socials'
  | 'assets'

const tabs: { id: Tab; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'tech', label: 'Tech stack' },
  { id: 'beyond', label: 'Beyond' },
  { id: 'projects', label: 'Projects' },
  { id: 'socials', label: 'Socials page' },
  { id: 'assets', label: 'Assets' },
]

const inputClass =
  'w-full rounded-lg border border-border bg-well px-3 py-2 text-sm text-primary outline-none focus:border-chip-border'
const labelClass = 'flex flex-col gap-1 text-sm text-primary'
const btnClass =
  'rounded-lg border border-cta bg-cta px-3 py-2 text-sm font-medium text-cta-text disabled:opacity-60'
const btnGhost =
  'rounded-lg border border-border px-3 py-2 text-sm text-primary hover:opacity-80'

export function AdminDashboardPage() {
  const { user, signOut } = useAuth()
  const { content, refresh, fromRemote } = usePortfolioContent()
  const [tab, setTab] = useState<Tab>('profile')
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Profile
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [location, setLocation] = useState('')
  const [email, setEmail] = useState('')
  const [connectLinks, setConnectLinks] = useState<SocialLinkItem[]>([])

  // About / beyond / education / tech
  const [aboutText, setAboutText] = useState('')
  const [beyond, setBeyond] = useState('')
  const [degree, setDegree] = useState('')
  const [school, setSchool] = useState('')
  const [eduDetail, setEduDetail] = useState('')
  const [frontend, setFrontend] = useState('')
  const [backend, setBackend] = useState('')
  const [tools, setTools] = useState('')

  // Experience / projects / socials page
  const [experience, setExperience] = useState<ExperienceItem[]>([])
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [socialsDisplayName, setSocialsDisplayName] = useState('Heiz')
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>([])

  // Asset paths from DB (not resolved URLs)
  const [photoPath, setPhotoPath] = useState<string | null>(null)
  const [resumePath, setResumePath] = useState<string | null>(null)

  useEffect(() => {
    setName(content.profile.name)
    setRole(content.profile.role)
    setLocation(content.profile.location)
    setEmail(content.profile.email)
    setConnectLinks(content.connectLinks)
    setAboutText(content.about.paragraphs.join('\n\n'))
    setBeyond(content.beyondCoding)
    setDegree(content.education.degree)
    setSchool(content.education.school)
    setEduDetail(content.education.detail)
    setFrontend(content.techStack.frontend.join(', '))
    setBackend(content.techStack.backend.join(', '))
    setTools(content.techStack.tools.join(', '))
    setExperience(content.experience)
    setProjects(content.projects)
    setSocialsDisplayName(content.socialsPage.displayName)
    setSocialLinks(content.socialsPage.links)
  }, [content])

  useEffect(() => {
    if (!supabase) return
    void supabase
      .from('profile')
      .select('photo_path, resume_path')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setPhotoPath(data.photo_path)
          setResumePath(data.resume_path)
        }
      })
  }, [content])

  function splitList(value: string) {
    return value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }

  async function withSave(action: () => Promise<void>) {
    if (!supabase) {
      setError('Supabase is not configured')
      return
    }
    setSaving(true)
    setError(null)
    setStatus(null)
    try {
      await action()
      setStatus('Saved')
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function saveProfile(e: FormEvent) {
    e.preventDefault()
    await withSave(async () => {
      const { error: err } = await supabase!.from('profile').upsert({
        id: 1,
        name,
        role,
        location,
        email,
      })
      if (err) throw err

      const { error: clearErr } = await supabase!
        .from('connect_links')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')
      if (clearErr) throw clearErr

      const rows = connectLinks
        .map((link, index) => ({
          label: link.label.trim(),
          handle: link.handle.trim(),
          url: link.url.trim(),
          icon_slug: (link.iconSlug || 'link').trim().toLowerCase() || 'link',
          sort_order: index,
        }))
        .filter((link) => link.label && link.url)

      if (rows.length > 0) {
        const { error: insertErr } = await supabase!.from('connect_links').insert(rows)
        if (insertErr) throw insertErr
      }
    })
  }

  async function saveSocialsPage(e: FormEvent) {
    e.preventDefault()
    await withSave(async () => {
      const { error: pageErr } = await supabase!.from('socials_page').upsert({
        id: 1,
        display_name: socialsDisplayName.trim() || 'Heiz',
      })
      if (pageErr) throw pageErr

      const { error: clearErr } = await supabase!
        .from('social_links')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')
      if (clearErr) throw clearErr

      const rows = socialLinks
        .map((link, index) => ({
          label: link.label.trim(),
          handle: link.handle.trim(),
          url: link.url.trim(),
          icon_slug: (link.iconSlug || 'link').trim().toLowerCase() || 'link',
          sort_order: index,
        }))
        .filter((link) => link.label && link.url)

      if (rows.length > 0) {
        const { error: insertErr } = await supabase!.from('social_links').insert(rows)
        if (insertErr) throw insertErr
      }
    })
  }

  async function saveAbout(e: FormEvent) {
    e.preventDefault()
    await withSave(async () => {
      const paragraphs = aboutText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
      const { error: err } = await supabase!.from('about').upsert({ id: 1, paragraphs })
      if (err) throw err
    })
  }

  async function saveEducation(e: FormEvent) {
    e.preventDefault()
    await withSave(async () => {
      const { error: err } = await supabase!.from('education').upsert({
        id: 1,
        degree,
        school,
        detail: eduDetail,
      })
      if (err) throw err
    })
  }

  async function saveTech(e: FormEvent) {
    e.preventDefault()
    await withSave(async () => {
      const { error: err } = await supabase!.from('tech_stack').upsert({
        id: 1,
        frontend: splitList(frontend),
        backend: splitList(backend),
        tools: splitList(tools),
      })
      if (err) throw err
    })
  }

  async function saveBeyond(e: FormEvent) {
    e.preventDefault()
    await withSave(async () => {
      const { error: err } = await supabase!.from('beyond_coding').upsert({ id: 1, body: beyond })
      if (err) throw err
    })
  }

  async function saveExperience(e: FormEvent) {
    e.preventDefault()
    await withSave(async () => {
      const { error: delErr } = await supabase!.from('experience').delete().not('id', 'is', null)
      if (delErr) throw delErr
      const rows = experience.map((item, index) => ({
        year: item.year,
        title: item.title,
        org: item.org,
        sort_order: index,
      }))
      if (rows.length) {
        const { error: insErr } = await supabase!.from('experience').insert(rows)
        if (insErr) throw insErr
      }
    })
  }

  async function saveProjects(e: FormEvent) {
    e.preventDefault()
    await withSave(async () => {
      const { data: existing, error: listErr } = await supabase!.from('projects').select('id')
      if (listErr) throw listErr

      const keepIds = new Set(
        projects.filter((p) => p.id && !p.id.startsWith('new-')).map((p) => p.id),
      )
      const toDelete = (existing ?? []).map((row) => row.id).filter((id) => !keepIds.has(id))
      if (toDelete.length) {
        const { error: delErr } = await supabase!.from('projects').delete().in('id', toDelete)
        if (delErr) throw delErr
      }

      for (const [index, project] of projects.entries()) {
        const slug = project.slug || slugify(project.title) || `project-${index}`
        const payload = {
          slug,
          title: project.title,
          subtitle: project.subtitle,
          description: project.description,
          tech: project.tech,
          live_url: project.liveUrl || null,
          repo_url: project.repoUrl || null,
          featured: Boolean(project.featured),
          sort_order: index,
        }

        if (project.id && !project.id.startsWith('new-')) {
          const { error: err } = await supabase!.from('projects').update(payload).eq('id', project.id)
          if (err) throw err
        } else {
          const { error: err } = await supabase!.from('projects').insert(payload)
          if (err) throw err
        }
      }
    })
  }

  async function onPhotoChange(file: File | null) {
    if (!file || !supabase) return
    if (file.size > 2 * 1024 * 1024) {
      setError('Photo must be 2MB or smaller')
      return
    }
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `photo/profile.${ext}`
    setSaving(true)
    setError(null)
    const uploaded = await uploadPortfolioAsset(path, file)
    if (uploaded.error) {
      setError(uploaded.error)
      setSaving(false)
      return
    }
    const { error: err } = await supabase.from('profile').update({ photo_path: path }).eq('id', 1)
    setSaving(false)
    if (err) {
      setError(err.message)
      return
    }
    setPhotoPath(path)
    setStatus('Photo updated')
    await refresh()
  }

  async function onResumeChange(file: File | null) {
    if (!file || !supabase) return
    if (file.type !== 'application/pdf') {
      setError('Resume must be a PDF')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Resume must be 5MB or smaller')
      return
    }
    const path = 'resume/cv.pdf'
    setSaving(true)
    setError(null)
    const uploaded = await uploadPortfolioAsset(path, file)
    if (uploaded.error) {
      setError(uploaded.error)
      setSaving(false)
      return
    }
    const { error: err } = await supabase.from('profile').update({ resume_path: path }).eq('id', 1)
    setSaving(false)
    if (err) {
      setError(err.message)
      return
    }
    setResumePath(path)
    setStatus('Resume updated')
    await refresh()
  }

  async function onProjectImageChange(index: number, file: File | null) {
    if (!file || !supabase) return
    const project = projects[index]
    const slug = project.slug || slugify(project.title) || `project-${index}`
    const ext = file.name.split('.').pop() || 'png'
    const path = `projects/${slug}.${ext}`
    setSaving(true)
    setError(null)
    const uploaded = await uploadPortfolioAsset(path, file)
    if (uploaded.error) {
      setError(uploaded.error)
      setSaving(false)
      return
    }

    if (project.id && !project.id.startsWith('new-')) {
      const { error: err } = await supabase.from('projects').update({ image_path: path }).eq('id', project.id)
      if (err) {
        setError(err.message)
        setSaving(false)
        return
      }
    }

    setProjects((prev) =>
      prev.map((p, i) =>
        i === index
          ? { ...p, image: getPublicAssetUrl(path) || p.image, slug }
          : p,
      ),
    )
    setSaving(false)
    setStatus('Project image uploaded — save Projects to persist new rows')
    await refresh()
  }

  async function onPhotoRemove() {
    if (!supabase || !photoPath) return
    const ok = window.confirm(
      'Remove the profile photo from storage and the database?\n\nThe site will fall back to the default placeholder photo.',
    )
    if (!ok) return

    setSaving(true)
    setError(null)
    const removed = await removePortfolioAsset(photoPath)
    if (removed.error) {
      setError(removed.error)
      setSaving(false)
      return
    }
    const { error: err } = await supabase.from('profile').update({ photo_path: null }).eq('id', 1)
    setSaving(false)
    if (err) {
      setError(err.message)
      return
    }
    setPhotoPath(null)
    setStatus('Photo removed — using default placeholder')
    await refresh()
  }

  async function onResumeRemove() {
    if (!supabase || !resumePath) return
    const ok = window.confirm(
      'Remove the resume PDF from storage and the database?\n\nThe site will fall back to the default placeholder resume.',
    )
    if (!ok) return

    setSaving(true)
    setError(null)
    const removed = await removePortfolioAsset(resumePath)
    if (removed.error) {
      setError(removed.error)
      setSaving(false)
      return
    }
    const { error: err } = await supabase.from('profile').update({ resume_path: null }).eq('id', 1)
    setSaving(false)
    if (err) {
      setError(err.message)
      return
    }
    setResumePath(null)
    setStatus('Resume removed — using default placeholder')
    await refresh()
  }

  const photoPreview = getPublicAssetUrl(photoPath) || fallbackContent.profile.photoUrl
  const resumePreview = getPublicAssetUrl(resumePath) || fallbackContent.profile.resumeUrl
  const hasCustomPhoto = Boolean(photoPath)
  const hasCustomResume = Boolean(resumePath)

  return (
    <div className="mx-auto min-h-screen max-w-3xl bg-page px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Portfolio CMS</h1>
          <p className="text-sm text-muted">
            Signed in as {user?.email}
            {fromRemote ? ' · live data' : ' · using fallback until Supabase seed loads'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/" className={btnGhost}>
            View site
          </Link>
          <button type="button" className={btnGhost} onClick={() => void signOut()}>
            Log out
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-lg border px-3 py-1.5 text-sm ${
              tab === t.id
                ? 'border-cta bg-cta text-cta-text'
                : 'border-border text-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {(status || error) && (
        <p className={`mb-4 text-sm ${error ? 'text-red-500' : 'text-muted'}`}>{error || status}</p>
      )}

      {tab === 'profile' && (
        <form className="space-y-4 rounded-[10px] border border-border bg-card p-4" onSubmit={saveProfile}>
          <label className={labelClass}>Name<input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} /></label>
          <label className={labelClass}>Role<input className={inputClass} value={role} onChange={(e) => setRole(e.target.value)} /></label>
          <label className={labelClass}>Location<input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} /></label>
          <label className={labelClass}>Email<input className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>

          <div className="space-y-3 border-t border-border pt-4">
            <h2 className="text-base font-medium text-primary">Connect links</h2>
            <p className="text-sm text-muted">Shown on the portfolio Connect section (email above is always included).</p>
            {connectLinks.map((link, index) => (
              <div key={link.id ?? index} className="grid gap-2 rounded-lg border border-border p-3">
                <input
                  className={inputClass}
                  placeholder="Label (e.g. Instagram)"
                  value={link.label}
                  onChange={(e) => {
                    const next = [...connectLinks]
                    next[index] = { ...link, label: e.target.value }
                    setConnectLinks(next)
                  }}
                />
                <input
                  className={inputClass}
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => {
                    const next = [...connectLinks]
                    next[index] = { ...link, url: e.target.value }
                    setConnectLinks(next)
                  }}
                />
                <div>
                  <p className="mb-1 text-xs text-muted">Icon</p>
                  <IconPicker
                    value={link.iconSlug || 'link'}
                    onChange={(slug) => {
                      const next = [...connectLinks]
                      next[index] = { ...link, iconSlug: slug }
                      setConnectLinks(next)
                    }}
                    inputClassName={inputClass}
                  />
                </div>
                <button
                  type="button"
                  className={btnGhost}
                  onClick={() => setConnectLinks(connectLinks.filter((_, i) => i !== index))}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className={btnGhost}
              onClick={() =>
                setConnectLinks([...connectLinks, { label: '', handle: '', url: '', iconSlug: 'link' }])
              }
            >
              Add Connect link
            </button>
          </div>

          <button className={btnClass} disabled={saving} type="submit">Save profile</button>
        </form>
      )}

      {tab === 'about' && (
        <form className="space-y-3 rounded-[10px] border border-border bg-card p-4" onSubmit={saveAbout}>
          <label className={labelClass}>
            About paragraphs (blank line separates paragraphs)
            <textarea className={`${inputClass} min-h-48`} value={aboutText} onChange={(e) => setAboutText(e.target.value)} />
          </label>
          <button className={btnClass} disabled={saving} type="submit">Save about</button>
        </form>
      )}

      {tab === 'experience' && (
        <form className="space-y-4 rounded-[10px] border border-border bg-card p-4" onSubmit={saveExperience}>
          {experience.map((item, index) => (
            <div key={item.id ?? index} className="grid gap-2 rounded-lg border border-border p-3 md:grid-cols-3">
              <input className={inputClass} placeholder="Year" value={item.year} onChange={(e) => {
                const next = [...experience]
                next[index] = { ...item, year: e.target.value }
                setExperience(next)
              }} />
              <input className={inputClass} placeholder="Title" value={item.title} onChange={(e) => {
                const next = [...experience]
                next[index] = { ...item, title: e.target.value }
                setExperience(next)
              }} />
              <input className={inputClass} placeholder="Organization" value={item.org} onChange={(e) => {
                const next = [...experience]
                next[index] = { ...item, org: e.target.value }
                setExperience(next)
              }} />
              <button type="button" className={`${btnGhost} md:col-span-3`} onClick={() => setExperience(experience.filter((_, i) => i !== index))}>
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className={btnGhost}
            onClick={() => setExperience([...experience, { year: '', title: '', org: '' }])}
          >
            Add experience
          </button>
          <button className={btnClass} disabled={saving} type="submit">Save experience</button>
        </form>
      )}

      {tab === 'education' && (
        <form className="space-y-3 rounded-[10px] border border-border bg-card p-4" onSubmit={saveEducation}>
          <label className={labelClass}>Degree<input className={inputClass} value={degree} onChange={(e) => setDegree(e.target.value)} /></label>
          <label className={labelClass}>School<input className={inputClass} value={school} onChange={(e) => setSchool(e.target.value)} /></label>
          <label className={labelClass}>Detail<textarea className={`${inputClass} min-h-24`} value={eduDetail} onChange={(e) => setEduDetail(e.target.value)} /></label>
          <button className={btnClass} disabled={saving} type="submit">Save education</button>
        </form>
      )}

      {tab === 'tech' && (
        <form className="space-y-3 rounded-[10px] border border-border bg-card p-4" onSubmit={saveTech}>
          <label className={labelClass}>Frontend (comma-separated)<input className={inputClass} value={frontend} onChange={(e) => setFrontend(e.target.value)} /></label>
          <label className={labelClass}>Backend (comma-separated)<input className={inputClass} value={backend} onChange={(e) => setBackend(e.target.value)} /></label>
          <label className={labelClass}>Tools (comma-separated)<input className={inputClass} value={tools} onChange={(e) => setTools(e.target.value)} /></label>
          <button className={btnClass} disabled={saving} type="submit">Save tech stack</button>
        </form>
      )}

      {tab === 'beyond' && (
        <form className="space-y-3 rounded-[10px] border border-border bg-card p-4" onSubmit={saveBeyond}>
          <label className={labelClass}>
            Beyond coding
            <textarea className={`${inputClass} min-h-40`} value={beyond} onChange={(e) => setBeyond(e.target.value)} />
          </label>
          <button className={btnClass} disabled={saving} type="submit">Save</button>
        </form>
      )}

      {tab === 'projects' && (
        <form className="space-y-4 rounded-[10px] border border-border bg-card p-4" onSubmit={saveProjects}>
          {projects.map((project, index) => (
            <div key={project.id} className="space-y-2 rounded-lg border border-border p-3">
              <input className={inputClass} placeholder="Title" value={project.title} onChange={(e) => {
                const next = [...projects]
                next[index] = { ...project, title: e.target.value }
                setProjects(next)
              }} />
              <input className={inputClass} placeholder="Subtitle" value={project.subtitle} onChange={(e) => {
                const next = [...projects]
                next[index] = { ...project, subtitle: e.target.value }
                setProjects(next)
              }} />
              <textarea className={`${inputClass} min-h-24`} placeholder="Description" value={project.description} onChange={(e) => {
                const next = [...projects]
                next[index] = { ...project, description: e.target.value }
                setProjects(next)
              }} />
              <input className={inputClass} placeholder="Tech (comma-separated)" value={project.tech.join(', ')} onChange={(e) => {
                const next = [...projects]
                next[index] = { ...project, tech: splitList(e.target.value) }
                setProjects(next)
              }} />
              <input className={inputClass} placeholder="Live URL" value={project.liveUrl || ''} onChange={(e) => {
                const next = [...projects]
                next[index] = { ...project, liveUrl: e.target.value }
                setProjects(next)
              }} />
              <input className={inputClass} placeholder="Repo URL" value={project.repoUrl || ''} onChange={(e) => {
                const next = [...projects]
                next[index] = { ...project, repoUrl: e.target.value }
                setProjects(next)
              }} />
              <label className="flex items-center gap-2 text-sm text-primary">
                <input
                  type="checkbox"
                  checked={Boolean(project.featured)}
                  onChange={(e) => {
                    const next = [...projects]
                    next[index] = { ...project, featured: e.target.checked }
                    setProjects(next)
                  }}
                />
                Featured
              </label>
              <label className={labelClass}>
                Project image
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  onChange={(e) => void onProjectImageChange(index, e.target.files?.[0] ?? null)}
                />
              </label>
              {project.image ? (
                <img src={project.image} alt="" className="h-24 w-auto rounded border border-border object-cover" />
              ) : null}
              <button type="button" className={btnGhost} onClick={() => setProjects(projects.filter((_, i) => i !== index))}>
                Remove project
              </button>
            </div>
          ))}
          <button
            type="button"
            className={btnGhost}
            onClick={() =>
              setProjects([
                ...projects,
                {
                  id: `new-${Date.now()}`,
                  title: '',
                  subtitle: '',
                  description: '',
                  tech: [],
                  image: '/assets/img/smart-queue-placeholder.svg',
                },
              ])
            }
          >
            Add project
          </button>
          <button className={btnClass} disabled={saving} type="submit">Save projects</button>
        </form>
      )}

      {tab === 'socials' && (
        <form className="space-y-4 rounded-[10px] border border-border bg-card p-4" onSubmit={saveSocialsPage}>
          <p className="text-sm text-muted">
            Controls the public <code className="text-primary">/socials</code> page only. Portfolio Connect links stay in Profile.
          </p>
          <label className={labelClass}>
            Display name
            <input
              className={inputClass}
              value={socialsDisplayName}
              onChange={(e) => setSocialsDisplayName(e.target.value)}
              placeholder="Heiz"
            />
          </label>
          {socialLinks.map((link, index) => (
            <div key={link.id ?? index} className="grid gap-2 rounded-lg border border-border p-3">
              <input
                className={inputClass}
                placeholder="Label (e.g. Instagram)"
                value={link.label}
                onChange={(e) => {
                  const next = [...socialLinks]
                  next[index] = { ...link, label: e.target.value }
                  setSocialLinks(next)
                }}
              />
              <input
                className={inputClass}
                placeholder="Handle (e.g. @heizzzx)"
                value={link.handle}
                onChange={(e) => {
                  const next = [...socialLinks]
                  next[index] = { ...link, handle: e.target.value }
                  setSocialLinks(next)
                }}
              />
              <input
                className={inputClass}
                placeholder="URL"
                value={link.url}
                onChange={(e) => {
                  const next = [...socialLinks]
                  next[index] = { ...link, url: e.target.value }
                  setSocialLinks(next)
                }}
              />
              <div>
                <p className="mb-1 text-xs text-muted">Icon (Simple Icons)</p>
                <IconPicker
                  value={link.iconSlug || 'link'}
                  onChange={(slug) => {
                    const next = [...socialLinks]
                    next[index] = { ...link, iconSlug: slug }
                    setSocialLinks(next)
                  }}
                  inputClassName={inputClass}
                />
              </div>
              <button
                type="button"
                className={btnGhost}
                onClick={() => setSocialLinks(socialLinks.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className={btnGhost}
            onClick={() =>
              setSocialLinks([...socialLinks, { label: '', handle: '', url: '', iconSlug: 'instagram' }])
            }
          >
            Add social link
          </button>
          <button className={btnClass} disabled={saving} type="submit">
            Save socials page
          </button>
        </form>
      )}

      {tab === 'assets' && (
        <div className="space-y-6 rounded-[10px] border border-border bg-card p-4">
          <div>
            <h2 className="mb-2 text-base font-medium text-primary">Profile photo</h2>
            <img src={photoPreview} alt="Profile preview" className="mb-3 h-32 w-32 rounded-lg object-cover" />
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={saving}
                onChange={(e) => void onPhotoChange(e.target.files?.[0] ?? null)}
              />
              {hasCustomPhoto ? (
                <button
                  type="button"
                  className={btnGhost}
                  disabled={saving}
                  onClick={() => void onPhotoRemove()}
                >
                  Remove photo
                </button>
              ) : null}
            </div>
            <p className="mt-1 text-xs text-muted">
              JPEG/PNG/WebP, max 2MB. Stored at photo/profile.*
              {!hasCustomPhoto ? ' · Showing default placeholder' : ''}
            </p>
          </div>
          <div>
            <h2 className="mb-2 text-base font-medium text-primary">Resume (PDF)</h2>
            <a
              href={resumePreview}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-3 inline-block text-sm text-primary underline"
            >
              {hasCustomResume ? 'Current resume' : 'Default resume placeholder'}
            </a>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="file"
                accept="application/pdf"
                disabled={saving}
                onChange={(e) => void onResumeChange(e.target.files?.[0] ?? null)}
              />
              {hasCustomResume ? (
                <button
                  type="button"
                  className={btnGhost}
                  disabled={saving}
                  onClick={() => void onResumeRemove()}
                >
                  Remove resume
                </button>
              ) : null}
            </div>
            <p className="mt-1 text-xs text-muted">
              PDF only, max 5MB. Stored at resume/cv.pdf
              {!hasCustomResume ? ' · Showing default placeholder' : ''}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
