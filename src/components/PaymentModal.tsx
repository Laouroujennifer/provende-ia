import { useState } from 'react'
import { X, CheckCircle, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom' // Pour la redirection
import { useSubscription } from '../contexts/SubscriptionContext'
import type { SubscriptionPlan } from '../types/subscription'
import { formatPrice } from '../utils/geolocation'

export function PaymentModal({ plan, onClose }: { plan: SubscriptionPlan, onClose: () => void }) {
  const { currency, upgradeSubscription } = useSubscription()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handlePayment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      upgradeSubscription(plan.id as 'monthly' | 'annual')
      setIsProcessing(false)
      setIsSuccess(true)
    }, 2000)
  }

  // Cette fonction gère le retour à l'outil
  const handleBackToApp = () => {
    onClose()
    navigate('/') // Redirige vers la page principale
  }

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Paiement Réussi !</h3>
          <p className="text-gray-500 mb-8">Votre accès Premium est maintenant activé en illimité.</p>
          <button 
            onClick={handleBackToApp}
            className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold hover:bg-teal-700 transition-all"
          >
            Retourner au Générateur
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Confirmer l'abonnement</h2>
            <button onClick={onClose}><X /></button>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl mb-6">
            <p className="text-sm text-gray-500">Offre choisie :</p>
            <p className="font-bold text-lg">{plan.name} - {formatPrice(plan.price[currency], currency)}</p>
          </div>

          {isProcessing ? (
            <div className="text-center py-10">
              <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
              <p className="font-medium">Traitement du paiement...</p>
            </div>
          ) : (
            <button 
              onClick={handlePayment}
              className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-teal-100"
            >
              Payer maintenant
            </button>
          )}
        </div>
      </div>
    </div>
  )
}