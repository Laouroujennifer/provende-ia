import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { SubscriptionProvider } from './contexts/SubscriptionContext'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { PricingPage } from './pages/PricingPage' // Vérifie cet import
import { Header } from './components/Header'
import { Footer } from './components/Footer'

function AppContent() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="h-screen bg-slate-950 flex items-center justify-center text-emerald-500 font-black">PROVENDEBUILDER...</div>
  }

  const isIsolated = ['/login', '/register', '/dashboard'].includes(location.pathname)

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      {!isIsolated && <Header />}
      <main className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!isIsolated && <Footer />}
    </div>
  )
}

export function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </SubscriptionProvider>
    </AuthProvider>
  )
}