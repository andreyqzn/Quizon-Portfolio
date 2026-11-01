import { PORTFOLIO_BUCKET, supabase } from './supabase'

export async function uploadPortfolioAsset(
  path: string,
  file: File,
): Promise<{ path: string; error: string | null }> {
  if (!supabase) return { path: '', error: 'Supabase is not configured' }

  const { error } = await supabase.storage.from(PORTFOLIO_BUCKET).upload(path, file, {
    upsert: true,
    cacheControl: '3600',
    contentType: file.type || undefined,
  })

  if (error) return { path: '', error: error.message }
  return { path, error: null }
}

export async function removePortfolioAsset(
  path: string,
): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase is not configured' }
  if (!path || path.startsWith('http') || path.startsWith('/')) {
    return { error: null }
  }

  const { error } = await supabase.storage.from(PORTFOLIO_BUCKET).remove([path])
  if (error) return { error: error.message }
  return { error: null }
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
