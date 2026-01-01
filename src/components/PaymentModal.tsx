import { useState } from 'react' // Suppression de React car seul useState est utilisé
import { X, CreditCard, Smartphone, CheckCircle, Loader2 } from 'lucide-react'
// Correction TS1484 : Ajout de "type" et suppression de Currency (inutilisé ici)
import type { SubscriptionPlan } from '../types/subscription'
import { formatPrice } from '../utils/geolocation'
import { useSubscription } from '../contexts/SubscriptionContext'

interface PaymentModalProps {
  plan: SubscriptionPlan
  onClose: () => void
}

export function PaymentModal({ plan, onClose }: PaymentModalProps) {
  const { currency, upgradeSubscription } = useSubscription()
  const [step, setStep] = useState<
    'method' | 'form' | 'processing' | 'success'
  >('method')
  const [method, setMethod] = useState<'mobile' | 'card' | null>(null)
  const [mobileProvider, setMobileProvider] = useState('')

  const handlePayment = () => {
    setStep('processing')
    // Simulation d'appel API
    setTimeout(() => {
      upgradeSubscription(plan.id as 'monthly' | 'annual')
      setStep('success')
    }, 2000)
  }

  if (step === 'success') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-in zoom-in duration-300">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Paiement Réussi !
          </h3>
          <p className="text-gray-500 mb-8">
            Votre abonnement {plan.name} est maintenant actif. Vous avez accès à
            toutes les fonctionnalités.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700"
          >
            Commencer à utiliser
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-900">Paiement Sécurisé</h3>
            <p className="text-sm text-gray-500">
              {plan.name} • {formatPrice(plan.price[currency], currency)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 'method' && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-700 mb-4">
                Choisissez votre mode de paiement :
              </p>

              {currency === 'XOF' && (
                <button
                  onClick={() => {
                    setMethod('mobile')
                    setStep('form')
                  }}
                  className="w-full flex items-center gap-4 p-4 border rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-all group"
                >
                  <div className="bg-orange-100 p-3 rounded-lg group-hover:bg-orange-200 transition-colors">
                    <Smartphone className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gray-900">Mobile Money</div>
                    <div className="text-xs text-gray-500">
                      MTN, Orange, Moov, Wave
                    </div>
                  </div>
                </button>
              )}

              <button
                onClick={() => {
                  setMethod('card')
                  setStep('form')
                }}
                className="w-full flex items-center gap-4 p-4 border rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-all group"
              >
                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900">Carte Bancaire</div>
                  <div className="text-xs text-gray-500">
                    Visa, Mastercard, PayPal
                  </div>
                </div>
              </button>
            </div>
          )}

          {step === 'form' && method === 'mobile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 mb-6">
                {['MTN', 'Orange', 'Moov', 'Wave'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setMobileProvider(p)}
                    className={`p-3 border rounded-lg text-sm font-medium transition-all ${mobileProvider === p ? 'border-teal-500 bg-teal-50 text-teal-700 ring-1 ring-teal-500' : 'hover:bg-gray-50'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  placeholder="+225 07..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <button
                onClick={handlePayment}
                disabled={!mobileProvider}
                className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                Payer {formatPrice(plan.price[currency], currency)}
              </button>

              <button
                onClick={() => setStep('method')}
                className="w-full text-sm text-gray-500 hover:text-gray-700 mt-2"
              >
                Retour
              </button>
            </div>
          )}

          {step === 'form' && method === 'card' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Numéro de carte
                </label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Expiration
                  </label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    CVC
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handlePayment}
                className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 mt-4"
              >
                Payer {formatPrice(plan.price[currency], currency)}
              </button>

              <button
                onClick={() => setStep('method')}
                className="w-full text-sm text-gray-500 hover:text-gray-700 mt-2"
              >
                Retour
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
              <h4 className="font-bold text-gray-900">
                Traitement en cours...
              </h4>
              <p className="text-sm text-gray-500">
                Veuillez valider la transaction sur votre téléphone si
                nécessaire.
              </p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Paiement sécurisé par SSL 256-bit
          </p>
        </div>
      </div>
    </div>
  )
}