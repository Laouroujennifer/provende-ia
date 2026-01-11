import type { FormulaTotals } from '../types/ingredients'
import type { AnimalRequirement } from '../types/animalRequirements'
import { getFinalValues } from '../utils/nutritionCalculations'

export function NutritionalSummary({ totals, requirement }: { totals: FormulaTotals, requirement?: AnimalRequirement }) {
  if (!requirement || totals.weight === 0) return null
  const final = getFinalValues(totals)

  const metrics = [
    { label: 'Énergie', value: final.em, target: requirement.em, unit: 'kcal', color: 'bg-orange-500' },
    { label: 'Protéines', value: final.pb, target: requirement.pb, unit: '%', color: 'bg-blue-500' },
    { label: 'Lysine', value: final.lys, target: requirement.lys, unit: '%', color: 'bg-purple-500' },
    { label: 'Méthionine', value: final.met, target: requirement.met, unit: '%', color: 'bg-pink-500' },
    { label: 'Calcium', value: final.ca, target: requirement.ca, unit: '%', color: 'bg-emerald-500' },
    { label: 'Phosphore', value: final.p, target: requirement.p, unit: '%', color: 'bg-cyan-500' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      {metrics.map((m) => {
        const isLow = m.value < m.target.min
        const isHigh = m.value > m.target.max
        const percentage = Math.min(100, (m.value / m.target.max) * 100)

        return (
          <div key={m.label} className="glass-card p-6 rounded-3xl relative overflow-hidden group hover:scale-[1.02] transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">
                  {m.value.toFixed(m.unit === 'kcal' ? 0 : 2)}
                  <span className="text-sm font-bold text-slate-400 ml-1">{m.unit}</span>
                </h3>
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                isLow ? 'bg-amber-100 text-amber-600' : isHigh ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                {isLow ? 'Trop bas' : isHigh ? 'Trop haut' : 'Optimal'}
              </div>
            </div>

            {/* Barre de progression moderne */}
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${isLow ? 'bg-amber-400' : isHigh ? 'bg-red-400' : m.color}`} 
                style={{ width: `${percentage}%` }}
              />
            </div>
            
            <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-400 uppercase">
              <span>Min: {m.target.min}</span>
              <span>Max: {m.target.max}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}