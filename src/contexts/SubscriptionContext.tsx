import { useEffect, useState, createContext, useContext, type ReactNode } from 'react'
import type { UserSubscription, Currency } from '../types/subscription'
import { detectCurrency } from '../utils/geolocation'

interface SubscriptionContextType {
  subscription: UserSubscription
  currency: Currency
  setCurrency: (c: Currency) => void
  upgradeSubscription: (planId: 'monthly' | 'annual') => void
  incrementAutoCount: () => void
  incrementFormulaCount: () => void
  canAccessMode2: boolean
  canSaveFormula: boolean
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(() => detectCurrency())

  const [subscription, setSubscription] = useState<UserSubscription>(() => {
    const saved = localStorage.getItem('provende_subscription')
    if (saved) {
      const data = JSON.parse(saved)
      return {
        ...data,
        // Sécurité : on s'assure que le compteur existe même sur une vieille version
        autoFormulasCount: data.autoFormulasCount ?? 0 
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

  const incrementAutoCount = () => {
    setSubscription((prev: UserSubscription) => ({
      ...prev,
      autoFormulasCount: (prev.autoFormulasCount ?? 0) + 1,
    }))
  }

  const incrementFormulaCount = () => {
    setSubscription((prev: UserSubscription) => ({
      ...prev,
      formulasCount: (prev.formulasCount ?? 0) + 1,
    }))
  }

  const isExpired = new Date(subscription.endDate) < new Date()
  
  // LOGIQUE DE BLOCAGE STRICTE
  // Si je suis PRO : OK
  // Si je suis GRATUIT : autoriser SEULEMENT si mon compteur est strictement inférieur à 3
  const canAccessMode2 = !isExpired && (
    subscription.status === 'active' || 
    (subscription.autoFormulasCount ?? 0) < 3
  )

  const canSaveFormula = !isExpired && (subscription.status === 'active' || (subscription.formulasCount ?? 0) < 5)

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