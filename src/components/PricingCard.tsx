// Correction : Suppression de React car inutile ici
import { Check } from 'lucide-react'
// Correction TS1484 : Utilisation de "import type" pour les interfaces
import type { SubscriptionPlan, Currency } from '../types/subscription'
import { formatPrice } from '../utils/geolocation'

interface PricingCardProps {
  plan: SubscriptionPlan
  currency: Currency
  isPopular?: boolean
  onSelect: () => void
}

export function PricingCard({
  plan,
  currency,
  isPopular,
  onSelect,
}: PricingCardProps) {
  return (
    <div
      className={`relative bg-white rounded-2xl p-8 border-2 flex flex-col h-full transition-transform hover:scale-105 ${
        isPopular ? 'border-teal-500 shadow-xl scale-105 z-10' : 'border-gray-100 shadow-sm'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-teal-500 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
          Recommandé
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-extrabold text-gray-900">
            {formatPrice(plan.price[currency], currency)}
          </span>
          <span className="text-gray-500">
            /{plan.period === 'month' ? 'mois' : 'an'}
          </span>
        </div>
      </div>

      <ul className="space-y-4 mb-8 flex-1">
        {/* Correction : Ajout du type string pour feature */}
        {plan.features.map((feature: string, idx: number) => (
          <li key={idx} className="flex items-start gap-3">
            <div className="bg-teal-50 p-1 rounded-full mt-0.5">
              <Check className="w-3 h-3 text-teal-600" />
            </div>
            <span className="text-gray-600 text-sm">{feature}</span>
          </li>
        ))}
        {/* Correction : Ajout du type string pour limitation */}
        {plan.limitations?.map((limitation: string, idx: number) => (
          <li key={`lim-${idx}`} className="flex items-start gap-3 opacity-50">
            <div className="bg-gray-100 p-1 rounded-full mt-0.5">
              <div className="w-3 h-3" />
            </div>
            <span className="text-gray-500 text-sm">{limitation}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        className={`w-full py-3 rounded-xl font-bold transition-colors ${
          isPopular
            ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-200'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        Choisir ce plan
      </button>
    </div>
  )
}