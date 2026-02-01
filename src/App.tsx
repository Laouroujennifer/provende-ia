// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { SubscriptionProvider } from './contexts/SubscriptionContext'

import { Home } from './pages/Home'
import { Services } from './pages/Services'
import { About } from './pages/About'
import { PricingPage } from './pages/PricingPage'
import { Contact } from './pages/Contact'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { Header } from './components/Header'
import { Footer } from './components/Footer'

function AppContent() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const hideLayout = ['/login', '/register', '/dashboard'].includes(location.pathname)

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Header />}
      <main className="flex-grow">
        <Routes>
          {/* VÉRIFIE QUE LES PATHS SONT BIEN CEUX-LÀ */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<Contact />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/register" />} 
          />

          {/* Cette ligne ne s'active que si aucune route ci-dessus ne correspond */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  )
}

export function App() {
  return (
    <SubscriptionProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </SubscriptionProvider>
  )
}