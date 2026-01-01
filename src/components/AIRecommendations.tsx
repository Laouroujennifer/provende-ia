import {
  CheckCircle2,
  AlertTriangle,
  BrainCircuit,
} from 'lucide-react'
// Correction TS1484 : Utilisation de "import type"
import type { Recommendation } from '../utils/nutritionCalculations'

interface AIRecommendationsProps {
  recommendations: Recommendation[]
}

export function AIRecommendations({ recommendations }: AIRecommendationsProps) {
  if (recommendations.length === 0) return null

  // Typage explicite des arguments (r, rec, idx) pour éviter les erreurs "implicit any"
  const warnings = recommendations.filter((r: Recommendation) => r.type === 'warning')
  const successes = recommendations.filter((r: Recommendation) => r.type === 'success')

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <BrainCircuit className="w-6 h-6 text-teal-600" />
        <h2 className="text-lg font-bold text-gray-900">
          Analyse IA & Recommandations
        </h2>
      </div>

      <div className="space-y-3">
        {warnings.length > 0 ? (
          warnings.map((rec: Recommendation, idx: number) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 bg-amber-50 text-amber-800 rounded-lg border border-amber-100"
            >
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{rec.message}</span>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-3 p-3 bg-green-50 text-green-800 rounded-lg border border-green-100">
            <CheckCircle2 className="w-5 h-5" />
            <span>
              Excellente formulation ! Tous les paramètres nutritionnels sont
              respectés.
            </span>
          </div>
        )}

        {/* Affichage des indicateurs de succès de manière compacte */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
          {successes.map((rec: Recommendation, idx: number) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100"
            >
              <CheckCircle2 className="w-3 h-3" />
              {rec.nutrient} OK
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}