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
  credits: number
}

interface SubscriptionContextType {
  subscription: UserSubscription
  currency: Currency
  setCurrency: (c: Currency) => void
  upgradeSubscription: (planId: 'monthly' | 'annual') => Promise<void>
  addCredits: (amount: number) => Promise<void>
  useCredit: () => Promise<boolean>
  incrementAutoCount: () => Promise<void>
  incrementFormulaCount: () => Promise<void>
  canAccessMode2: boolean
  canSaveFormula: boolean
  hasCredits: boolean
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

const INITIAL_SUB: UserSubscription = {
  status: 'trial',
  planId: 'free',
  startDate: '',
  endDate: '',
  formulasCount: 0,
  autoFormulasCount: 0,
  bonusCalculations: 0,
  credits: 0,
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [currency, setCurrency] = useState<Currency>('XOF')
  const [subscription, setSubscription] = useState<UserSubscription>(INITIAL_SUB)

  // ─── CHARGEMENT DU PROFIL ───────────────────────────────────────────────
  useEffect(() => {
    async function loadProfile() {
      if (!user) return
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()

        if (data && !error) {
          const isPro = data.subscription_status === 'pro'
          setSubscription({
            status: isPro ? 'active' : 'trial',
            planId: isPro ? 'monthly' : 'free',
            startDate: data.created_at,
            endDate: new Date(
              new Date(data.created_at).getTime() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
            formulasCount: data.manual_formulas_count || 0,
            autoFormulasCount: data.auto_formulas_count || 0,
            bonusCalculations: data.bonus_calculations || 0,
            // 2 crédits offerts au départ (DEFAULT 2 dans la DB)
            credits: data.credits ?? 2,
          })
        }
      } catch (err) {
        console.error('Erreur chargement profil:', err)
      }
    }
    loadProfile()

    // Écoute les changements en temps réel (ex: après achat Chariow via webhook)
    if (!user) return
    const channel = supabase
      .channel(`profile-credits-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          const updated = payload.new as Record<string, unknown>
          setSubscription(prev => ({
            ...prev,
            credits: (updated.credits as number) ?? prev.credits,
            formulasCount: (updated.manual_formulas_count as number) ?? prev.formulasCount,
            autoFormulasCount: (updated.auto_formulas_count as number) ?? prev.autoFormulasCount,
          }))
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user])

  // ─── UPGRADE ABONNEMENT (conservé pour compatibilité) ───────────────────
  const upgradeSubscription = async (planId: 'monthly' | 'annual') => {
    if (!user) return
    const { error } = await supabase
      .from('profiles')
      .update({ subscription_status: 'pro' })
      .eq('id', user.id)
    if (!error) setSubscription(prev => ({ ...prev, status: 'active', planId }))
  }

  // ─── AJOUTER DES CRÉDITS (après paiement Chariow) ───────────────────────
  const addCredits = async (amount: number) => {
    if (!user) return
    const newCredits = (subscription.credits || 0) + amount
    const { error } = await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', user.id)
    if (!error) {
      setSubscription(prev => ({ ...prev, credits: newCredits }))
    } else {
      console.error('Erreur ajout crédits:', error)
      throw new Error("Erreur lors de l'ajout des crédits")
    }
  }

  // ─── CONSOMMER 1 CRÉDIT ──────────────────────────────────────────────────
  // 1 crédit = 1 génération IA OU 1 analyse IA
  // Retourne true si consommé, false si solde insuffisant
  const useCredit = async (): Promise<boolean> => {
    if (!user) return false
    if ((subscription.credits || 0) <= 0) return false

    const newCredits = subscription.credits - 1
    const { error } = await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', user.id)

    if (!error) {
      setSubscription(prev => ({ ...prev, credits: newCredits }))
      return true
    } else {
      console.error('Erreur consommation crédit:', error)
      return false
    }
  }

  // ─── INCRÉMENT COMPTEURS ────────────────────────────────────────────────
  const incrementAutoCount = async () => {
    if (!user) return
    const next = (subscription.autoFormulasCount || 0) + 1
    await supabase
      .from('profiles')
      .update({ auto_formulas_count: next })
      .eq('id', user.id)
    setSubscription(prev => ({ ...prev, autoFormulasCount: next }))
  }

  const incrementFormulaCount = async () => {
    if (!user) return
    const next = (subscription.formulasCount || 0) + 1
    await supabase
      .from('profiles')
      .update({ manual_formulas_count: next })
      .eq('id', user.id)
    setSubscription(prev => ({ ...prev, formulasCount: next }))
  }

  // ─── PERMISSIONS ────────────────────────────────────────────────────────
  const hasCredits = (subscription.credits || 0) > 0
  const canAccessMode2 = hasCredits
  const canSaveFormula = true // La sauvegarde est toujours gratuite

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      currency,
      setCurrency,
      upgradeSubscription,
      addCredits,
      useCredit,
      incrementAutoCount,
      incrementFormulaCount,
      canAccessMode2,
      canSaveFormula,
      hasCredits,
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