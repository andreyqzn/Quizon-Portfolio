import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function AdminLoginPage() {
  const { signIn, session, loading, configured } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from || '/admin'

  const [email, setEmail] = useState('canilaoquizonandrey@gmail.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && session) {
    return <Navigate to="/admin" replace />
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const result = await signIn(email.trim(), password)
    setSubmitting(false)
    if (result.error) {
      setError(result.error)
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <div className="rounded-[10px] border border-border bg-card p-6">
        <h1 className="text-xl font-semibold text-primary">Admin login</h1>
        <p className="mt-1 text-sm text-muted">Private CMS for your portfolio content.</p>

        {!configured ? (
          <p className="mt-4 text-sm text-muted">
            Configure Supabase env vars first. See <code>supabase/SETUP.md</code>.
          </p>
        ) : (
          <form className="mt-5 flex flex-col gap-3" onSubmit={onSubmit}>
            <label className="flex flex-col gap-1 text-sm text-primary">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-border bg-well px-3 py-2 text-primary outline-none focus:border-chip-border"
                autoComplete="username"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-primary">
              Password
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border border-border bg-well px-3 py-2 text-primary outline-none focus:border-chip-border"
                autoComplete="current-password"
              />
            </label>
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            <button
              type="submit"
              disabled={submitting}
              className="mt-1 rounded-lg border border-cta bg-cta px-4 py-2 text-sm font-medium text-cta-text disabled:opacity-60"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        )}

        <Link to="/" className="mt-4 inline-block text-sm text-muted underline-offset-2 hover:underline">
          ← Back to portfolio
        </Link>
      </div>
    </div>
  )
}
