// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { SubscriptionProvider } from './contexts/SubscriptionContext' // <--- IMPORT ICI
import { Home } from './pages/Home'
import { Services } from './pages/Services'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Formations } from './pages/Formations'
import { Dashboard } from './pages/Dashboard'

import { Header } from './components/Header'
import { Footer } from './components/Footer'

function AppContent() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  // Pages totalement isolées (Pas de Header, Pas de Footer)
  const isIsolated = ['/login', '/register', '/dashboard'].includes(location.pathname)

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      {!isIsolated && <Header />}
      
      <main className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
       
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/formations" element={<Formations />} />
          
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/register" />} 
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
      {/* 2. ON ENVELOPPE TOUT ICI */}
      <SubscriptionProvider> 
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </SubscriptionProvider>
    </AuthProvider>
  )
}