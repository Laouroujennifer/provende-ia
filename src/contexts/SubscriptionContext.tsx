import { useEffect, useState, createContext, useContext, type ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '../lib/supabase'

export type Currency = 'XOF' | 'EUR' | 'USD'
export interface UserSubscription {
  status: 'trial' | 'active' | 'expired'
  planId: 'free' | 'monthly' | 'annual'
  startDate: string
  endDate: string
  formulasCount: number
  autoFormulasCount: number
  bonusCalculations: number 
}

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

const INITIAL_SUB: UserSubscription = {
  status: 'trial', planId: 'free', startDate: '', endDate: '', formulasCount: 0, autoFormulasCount: 0, bonusCalculations: 0
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [currency, setCurrency] = useState<Currency>('XOF')
  const [subscription, setSubscription] = useState<UserSubscription>(INITIAL_SUB)

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      try {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
        if (data && !error) {
          const isPro = data.subscription_status === 'pro';
          setSubscription({
            status: isPro ? 'active' : 'trial',
            planId: isPro ? 'monthly' : 'free',
            startDate: data.created_at,
            endDate: new Date(new Date(data.created_at).getTime() + 30*24*60*60*1000).toISOString(),
            formulasCount: data.manual_formulas_count || 0,
            autoFormulasCount: data.auto_formulas_count || 0,
            bonusCalculations: data.bonus_calculations || 0
          });
        }
      } catch (err) { console.error("Erreur chargement profil:", err); }
    }
    loadProfile();
  }, [user])

  const upgradeSubscription = async (planId: 'monthly' | 'annual') => {
    if (!user) return;
    const { error } = await supabase.from('profiles').update({ subscription_status: 'pro' }).eq('id', user.id);
    if (!error) setSubscription(prev => ({ ...prev, status: 'active', planId }));
  }

  const incrementAutoCount = async () => {
    if (!user) return;
    const next = (subscription.autoFormulasCount || 0) + 1;
    await supabase.from('profiles').update({ auto_formulas_count: next }).eq('id', user.id);
    setSubscription(prev => ({ ...prev, autoFormulasCount: next }));
  }

  const incrementFormulaCount = async () => {
    if (!user) return;
    const next = (subscription.formulasCount || 0) + 1;
    await supabase.from('profiles').update({ manual_formulas_count: next }).eq('id', user.id);
    setSubscription(prev => ({ ...prev, formulasCount: next }));
  }

  const totalAllowed = 3 + (subscription.bonusCalculations || 0);
  const canAccessMode2 = subscription.status === 'active' || subscription.autoFormulasCount < totalAllowed;
  const canSaveFormula = subscription.status === 'active' || subscription.formulasCount < 10 // Limite généreuse

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
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error('useSubscription must be used within SubscriptionProvider');
  return context;
}