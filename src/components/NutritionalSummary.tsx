// Correction : Suppression de React car inutile ici
import type { FormulaTotals } from '../types/ingredients'
import type { AnimalRequirement } from '../types/animalRequirements'
import { getFinalValues } from '../utils/nutritionCalculations'

interface NutritionalSummaryProps {
  totals: FormulaTotals
  requirement?: AnimalRequirement
}

export function NutritionalSummary({
  totals,
  requirement,
}: NutritionalSummaryProps) {
  if (!requirement || totals.weight === 0) return null
  
  const final = getFinalValues(totals)
  
  const metrics = [
    {
      label: 'Énergie (kcal)',
      value: final.em,
      target: requirement.em,
      unit: '',
    },
    {
      label: 'Protéine (%)',
      value: final.pb,
      target: requirement.pb,
      unit: '%',
    },
    {
      label: 'Lysine (%)',
      value: final.lys,
      target: requirement.lys,
      unit: '%',
    },
    {
      label: 'Méthionine (%)',
      value: final.met,
      target: requirement.met,
      unit: '%',
    },
    {
      label: 'Calcium (%)',
      value: final.ca,
      target: requirement.ca,
      unit: '%',
    },
    {
      label: 'Phosphore (%)',
      value: final.p,
      target: requirement.p,
      unit: '%',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {metrics.map((m) => {
        const isLow = m.value < m.target.min
        const isHigh = m.value > m.target.max
        // Correction ESLint : Suppression de la variable isOk car elle n'est jamais utilisée
        
        let colorClass = 'bg-white border-gray-200'
        let textClass = 'text-gray-900'
        let statusColor = 'bg-gray-100 text-gray-600'

        if (isLow) {
          colorClass = 'bg-amber-50 border-amber-200'
          textClass = 'text-amber-900'
          statusColor = 'bg-amber-100 text-amber-700'
        } else if (isHigh) {
          colorClass = 'bg-red-50 border-red-200'
          textClass = 'text-red-900'
          statusColor = 'bg-red-100 text-red-700'
        } else {
          colorClass = 'bg-green-50 border-green-200'
          textClass = 'text-green-900'
          statusColor = 'bg-green-100 text-green-700'
        }

        return (
          <div
            key={m.label}
            className={`p-4 rounded-xl border ${colorClass} shadow-sm`}
          >
            <p className="text-xs font-medium text-gray-500 mb-1">{m.label}</p>
            <p className={`text-xl font-bold ${textClass} mb-2`}>
              {m.value.toFixed(2)}
              {m.unit}
            </p>
            <div
              className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusColor}`}
            >
              Cible: {m.target.min}-{m.target.max}
            </div>
          </div>
        )
      })}
    </div>
  )
}