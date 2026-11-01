import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { FluidBackground } from './components/FluidBackground'
import { PageLoader } from './components/PageLoader'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { PortfolioPage } from './pages/PortfolioPage'
import { SocialsPage } from './pages/SocialsPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <PageLoader />
        <FluidBackground />
        <Routes>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="/socials" element={<SocialsPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
