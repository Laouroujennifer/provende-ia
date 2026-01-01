import { useState } from 'react' // Suppression de "React" car seul useState est utilisé
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Header } from './components/Header'
import { ModeSelector } from './components/ModeSelector'
import { ManualAnalyzer } from './pages/ManualAnalyzer'
import { AutomaticGenerator } from './pages/AutomaticGenerator'
import { PricingPage } from './pages/PricingPage'
import {
  SubscriptionProvider,
  // useSubscription supprimé ici car canAccessMode2 n'était pas utilisé dans ce composant
} from './contexts/SubscriptionContext'
import { SubscriptionBanner } from './components/SubscriptionBanner'

function MainLayout() {
  const [mode, setMode] = useState<'manual' | 'auto'>('manual')
  
  // Suppression de la ligne useSubscription() qui causait l'erreur
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />
      <SubscriptionBanner />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center mb-8">
          <ModeSelector
            currentMode={mode}
            onModeChange={(m) => {
              setMode(m)
            }}
          />
        </div>

        {/* Le switch de mode fonctionne déjà ici */}
        {mode === 'manual' ? <ManualAnalyzer /> : <AutomaticGenerator />}
      </main>
    </div>
  )
}

function PricingLayout() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />
      <PricingPage />
    </div>
  )
}

export function App() {
  return (
    <SubscriptionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/pricing" element={<PricingLayout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SubscriptionProvider>
  )
}