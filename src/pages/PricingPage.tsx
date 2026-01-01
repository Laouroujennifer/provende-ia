import { useState } from 'react' // Suppression de React car seul useState est utilisé
import { useSubscription } from '../contexts/SubscriptionContext'
import { PricingCard } from '../components/PricingCard'
import { PaymentModal } from '../components/PaymentModal'
// Correction TS1484 : Utilisation de "import type" et ajout de Currency
import type { SubscriptionPlan, Currency } from '../types/subscription'
import { Globe } from 'lucide-react'

const PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Essai Gratuit',
    price: {
      XOF: 0,
      EUR: 0,
      USD: 0,
    },
    period: 'trial',
    features: [
      'Accès au Mode 1 (Manuel)',
      '5 formules sauvegardées',
      'Calculs nutritionnels de base',
      'Support par email',
    ],
    limitations: [
      'Pas de Mode Automatique',
      "Pas d'export PDF",
      'Limité à 7 jours',
    ],
  },
  {
    id: 'monthly',
    name: 'Pro Mensuel',
    price: {
      XOF: 5000,
      EUR: 8,
      USD: 9,
    },
    period: 'month',
    features: [
      'Accès illimité Mode 1 & 2',
      'Générateur Automatique IA',
      'Formules illimitées',
      'Export PDF professionnel',
      'Support prioritaire WhatsApp',
    ],
  },
  {
    id: 'annual',
    name: 'Pro Annuel',
    price: {
      XOF: 50000,
      EUR: 80,
      USD: 90,
    },
    period: 'year',
    features: [
      'Tout du plan Mensuel',
      '2 mois offerts (économie)',
      'Formation nutrition offerte',
      'Badge "Éleveur Certifié"',
      'Accès anticipé aux nouveautés',
    ],
  },
]

export function PricingPage() {
  const { currency, setCurrency } = useSubscription()
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null,
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tarifs Simples et Transparents
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Rentabilisez votre élevage dès le premier mois grâce à des formules
            optimisées.
          </p>

          {/* Currency Selector */}
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
            <Globe className="w-4 h-4 text-gray-500" />
            <select
              value={currency}
              // CORRECTION : On remplace 'any' par le type 'Currency'
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 cursor-pointer"
            >
              <option value="XOF">FCFA (Afrique)</option>
              <option value="EUR">EUR (Europe)</option>
              <option value="USD">USD (International)</option>
            </select>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan: SubscriptionPlan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              currency={currency}
              isPopular={plan.id === 'annual'}
              onSelect={() => {
                if (plan.id === 'free') return // Déjà actif ou essai
                setSelectedPlan(plan)
              }}
            />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Questions Fréquentes
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">
                Comment fonctionne l'essai gratuit ?
              </h3>
              <p className="text-gray-600">
                Vous avez accès au mode manuel pendant 7 jours sans carte
                bancaire. Après 7 jours, vous devrez choisir un abonnement pour
                continuer.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">
                Puis-je payer par Mobile Money ?
              </h3>
              <p className="text-gray-600">
                Oui, nous acceptons MTN, Orange, Moov et Wave dans toute la zone
                UEMOA/CEMAC via nos partenaires sécurisés.
              </p>
            </div>
          </div>
        </div>
      </div>

      {selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  )
}