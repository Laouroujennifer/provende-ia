export type Currency = 'XOF' | 'EUR' | 'USD'

export interface SubscriptionPlan {
  id: 'free' | 'monthly' | 'annual'
  name: string
  price: {
    XOF: number
    EUR: number
    USD: number
  }
  period: 'trial' | 'month' | 'year'
  features: string[]
  limitations?: string[]
}

export interface UserSubscription {
  status: 'active' | 'expired' | 'trial'
  planId: 'free' | 'monthly' | 'annual'
  startDate: string
  endDate: string
  formulasCount: number // For free tier limit
}

export type PaymentMethod = 'mobile_money' | 'card'

export interface PaymentProvider {
  id: string
  name: string
  type: PaymentMethod
  logo?: string // URL or icon name
}
