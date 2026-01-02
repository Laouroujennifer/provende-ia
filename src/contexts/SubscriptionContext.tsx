import { useEffect, useState, createContext, useContext, type ReactNode } from 'react'
import type { UserSubscription, Currency } from '../types/subscription'
import { detectCurrency } from '../utils/geolocation'

interface SubscriptionContextType {
  subscription: UserSubscription
  currency: Currency
  setCurrency: (c: Currency) => void
  upgradeSubscription: (planId: 'monthly' | 'annual') => void
  incrementAutoCount: () => void
  incrementFormulaCount: () => void // <-- Ajout de cette ligne manquante
  canAccessMode2: boolean
  canSaveFormula: boolean
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(() => detectCurrency())

  const [subscription, setSubscription] = useState<UserSubscription>(() => {
    const saved = localStorage.getItem('provende_subscription')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        // En cas d'erreur
      }
    }
    return {
      status: 'trial',
      planId: 'free',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      formulasCount: 0,
      autoFormulasCount: 0, 
    }
  })

  useEffect(() => {
    localStorage.setItem('provende_subscription', JSON.stringify(subscription))
  }, [subscription])

  const upgradeSubscription = (planId: 'monthly' | 'annual') => {
    setSubscription({
      status: 'active',
      planId,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + (planId === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString(),
      formulasCount: 0,
      autoFormulasCount: 0,
    })
  }

  // 1. Compteur pour le mode Automatique (IA)
  const incrementAutoCount = () => {
    setSubscription((prev: UserSubscription) => ({
      ...prev,
      autoFormulasCount: prev.autoFormulasCount + 1,
    }))
  }

  // 2. Compteur pour le mode Manuel (Sauvegarde)
  const incrementFormulaCount = () => {
    setSubscription((prev: UserSubscription) => ({
      ...prev,
      formulasCount: prev.formulasCount + 1,
    }))
  }

  const isExpired = new Date(subscription.endDate) < new Date()
  
  const canAccessMode2 = !isExpired && (
    subscription.status === 'active' || 
    subscription.autoFormulasCount < 3
  )

  const canSaveFormula = !isExpired && (subscription.status === 'active' || subscription.formulasCount < 5)

  return (
    <SubscriptionContext.Provider value={{
      subscription, currency, setCurrency, upgradeSubscription, 
      incrementAutoCount, incrementFormulaCount, canAccessMode2, canSaveFormula
    }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSubscription = () => {
  const context = useContext(SubscriptionContext)
  if (!context) throw new Error('useSubscription must be used within SubscriptionProvider')
  return context
}