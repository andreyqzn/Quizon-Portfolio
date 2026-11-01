import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!)
  : null

export const PORTFOLIO_BUCKET = 'portfolio-assets'

export function getPublicAssetUrl(path: string | null | undefined): string | null {
  if (!path || !supabase) return null
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) {
    return path
  }
  const { data } = supabase.storage.from(PORTFOLIO_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
