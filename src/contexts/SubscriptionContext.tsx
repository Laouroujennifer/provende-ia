import { useEffect, useState, createContext, useContext, type ReactNode } from 'react'
import type { UserSubscription, Currency } from '../types/subscription'
import { detectCurrency } from '../utils/geolocation'

// L'interface doit TOUT contenir pour que les autres pages ne fassent pas d'erreur
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
    if (saved) return JSON.parse(saved)
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
    setSubscription(prev => ({
      ...prev,
      status: 'active',
      planId: planId,
      autoFormulasCount: 0,
      formulasCount: 0
    }))
  }

  const incrementAutoCount = () => {
    setSubscription((prev: UserSubscription) => ({
      ...prev,
      autoFormulasCount: (prev.autoFormulasCount || 0) + 1,
    }))
  }

  const incrementFormulaCount = () => {
    setSubscription((prev: UserSubscription) => ({
      ...prev,
      formulasCount: (prev.formulasCount || 0) + 1,
    }))
  }

  const isExpired = new Date(subscription.endDate) < new Date()
  
  // Autorisation Mode IA (3 essais)
  const canAccessMode2 = subscription.status === 'active' || (subscription.autoFormulasCount || 0) < 3

  // Autorisation Sauvegarde Manuel (5 essais)
  const canSaveFormula = !isExpired && (subscription.status === 'active' || (subscription.formulasCount || 0) < 5)

  return (
    <SubscriptionContext.Provider value={{
      subscription, 
      currency, 
      setCurrency, 
      upgradeSubscription, 
      incrementAutoCount, 
      incrementFormulaCount, 
      canAccessMode2, 
      canSaveFormula
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