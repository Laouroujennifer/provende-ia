import { useEffect, useState, createContext, useContext, type ReactNode } from 'react'
import type { UserSubscription, Currency } from '../types/subscription'
import { detectCurrency } from '../utils/geolocation'

interface SubscriptionContextType {
  subscription: UserSubscription
  currency: Currency
  setCurrency: (c: Currency) => void
  upgradeSubscription: (planId: 'monthly' | 'annual') => void
  incrementFormulaCount: () => void
  canAccessMode2: boolean
  canSaveFormula: boolean
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined,
)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  // CORRECTION 1 : Initialisation directe de la monnaie (pas besoin de useEffect)
  const [currency, setCurrency] = useState<Currency>(() => detectCurrency())

  // CORRECTION 2 : Chargement immédiat depuis le localStorage
  const [subscription, setSubscription] = useState<UserSubscription>(() => {
    const saved = localStorage.getItem('provende_subscription')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error("Erreur de lecture du stockage", e)
      }
    }
    // Valeur par défaut si rien n'est sauvegardé
    return {
      status: 'trial',
      planId: 'free',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      formulasCount: 0,
    }
  })

  // On garde cet effect uniquement pour SAUVEGARDER quand ça change
  useEffect(() => {
    localStorage.setItem('provende_subscription', JSON.stringify(subscription))
  }, [subscription])

  const upgradeSubscription = (planId: 'monthly' | 'annual') => {
    const newSub: UserSubscription = {
      status: 'active',
      planId,
      startDate: new Date().toISOString(),
      endDate: new Date(
        Date.now() + (planId === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000,
      ).toISOString(),
      formulasCount: 0,
    }
    setSubscription(newSub)
  }

  const incrementFormulaCount = () => {
    setSubscription((prev: UserSubscription) => ({
      ...prev,
      formulasCount: prev.formulasCount + 1,
    }))
  }

  const isExpired = new Date(subscription.endDate) < new Date()
  const canAccessMode2 = subscription.status === 'active' && !isExpired
  const canSaveFormula =
    !isExpired &&
    (subscription.status === 'active' || subscription.formulasCount < 5)

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        currency,
        setCurrency,
        upgradeSubscription,
        incrementFormulaCount,
        canAccessMode2,
        canSaveFormula,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

// CORRECTION 3 : Pour l'erreur react-refresh
// ESLint préfère que les composants et les hooks soient bien séparés.
// Si l'erreur persiste, tu peux ajouter cette ligne juste au-dessus de l'export du hook :
// eslint-disable-next-line react-refresh/only-export-components
export const useSubscription = () => {
  const context = useContext(SubscriptionContext)
  if (!context)
    throw new Error('useSubscription must be used within SubscriptionProvider')
  return context
}