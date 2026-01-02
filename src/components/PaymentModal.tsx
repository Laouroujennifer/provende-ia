import { useState } from 'react'
import { X, CheckCircle, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSubscription } from '../contexts/SubscriptionContext'
import type { SubscriptionPlan } from '../types/subscription'

export function PaymentModal({ plan, onClose }: { plan: SubscriptionPlan, onClose: () => void }) {
  const { upgradeSubscription } = useSubscription()
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

  // Redirection après succès
  const handleFinalize = () => {
    onClose()
    navigate('/') // Renvoie vers le générateur
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
        {!isSuccess ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold tracking-tight">Paiement Mobile Money</h2>
              <button onClick={onClose}><X /></button>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl mb-8">
              <p className="text-sm text-gray-500">Abonnement :</p>
              <p className="font-bold text-lg">{plan.name}</p>
            </div>
            {isProcessing ? (
              <div className="text-center py-6">
                <Loader2 className="animate-spin mx-auto mb-4 text-teal-600" />
                <p>Validation en cours...</p>
              </div>
            ) : (
              <button onClick={handlePayment} className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-teal-100">
                Confirmer le paiement
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Félicitations !</h2>
            <p className="text-gray-500 mb-8">Votre accès Premium est maintenant débloqué.</p>
            <button onClick={handleFinalize} className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold">
              Retourner au Générateur
            </button>
          </div>
        )}
      </div>
    </div>
  )
}