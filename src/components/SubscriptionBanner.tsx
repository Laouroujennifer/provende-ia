// Correction : Suppression de l'import React (inutile ici)
import { AlertTriangle, Clock } from 'lucide-react' // Correction : Crown supprimé car inutilisé
import { useSubscription } from '../contexts/SubscriptionContext'
import { Link } from 'react-router-dom'

export function SubscriptionBanner() {
  const { subscription } = useSubscription()
  const daysLeft = Math.ceil(
    (new Date(subscription.endDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  )
  const isExpired = daysLeft <= 0

  if (subscription.status === 'active' && !isExpired) return null

  return (
    <div
      className={`w-full px-4 py-3 text-sm font-medium flex items-center justify-center gap-3 ${
        isExpired ? 'bg-red-600 text-white' : 'bg-teal-900 text-teal-50'
      }`}
    >
      {isExpired ? (
        <>
          <AlertTriangle className="w-5 h-5" />
          <span>
            Votre abonnement a expiré. Veuillez renouveler pour continuer à
            utiliser la plateforme.
          </span>
        </>
      ) : (
        <>
          <Clock className="w-5 h-5" />
          <span>
            Mode Essai Gratuit : {daysLeft} jours restants (
            {5 - subscription.formulasCount} formules disponibles)
          </span>
        </>
      )}

      <Link
        to="/pricing"
        className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${
          isExpired
            ? 'bg-white text-red-600 hover:bg-gray-100'
            : 'bg-teal-500 text-white hover:bg-teal-400'
        }`}
      >
        {isExpired ? 'Renouveler' : 'Passer Premium'}
      </Link>
    </div>
  )
}