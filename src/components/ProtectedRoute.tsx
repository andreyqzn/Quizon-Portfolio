import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading, configured } = useAuth()
  const location = useLocation()

  if (!configured) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-3 px-4 text-primary">
        <h1 className="text-xl font-semibold">Supabase not configured</h1>
        <p className="text-sm text-muted">
          Add <code className="text-primary">VITE_SUPABASE_URL</code> and{' '}
          <code className="text-primary">VITE_SUPABASE_ANON_KEY</code> to{' '}
          <code className="text-primary">.env.local</code>, then run the SQL in{' '}
          <code className="text-primary">supabase/schema.sql</code>. See{' '}
          <code className="text-primary">supabase/SETUP.md</code>.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted">
        Checking session…
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  return children
}
