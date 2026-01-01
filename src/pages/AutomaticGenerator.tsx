import { useState } from 'react' // Correction : On retire 'React' car seul useState est utilisé
import { Wand2, Lock, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useSubscription } from '../contexts/SubscriptionContext'
import { Link } from 'react-router-dom'
import { ingredientsDatabase } from '../data/ingredientsDatabase'
import { FormulaInputs } from '../components/FormulaInputs'
import { animalRequirements } from '../data/animalRequirements'
import { optimizeFormula } from '../utils/optimizationAlgorithm'
// Correction TS1484 : Utilisation de "import type"
import type { SelectedIngredient } from '../types/ingredients'

import { IngredientTable } from '../components/IngredientTable'
import { NutritionalSummary } from '../components/NutritionalSummary'
import { calculateTotals } from '../utils/nutritionCalculations'

export function AutomaticGenerator() {
  const { canAccessMode2 } = useSubscription()
  const [formulaName, setFormulaName] = useState('')
  const [selectedRequirementId, setSelectedRequirementId] = useState(
    animalRequirements[0].id,
  )
  const [availableIngredients, setAvailableIngredients] = useState<
    SelectedIngredient[]
  >(
    ingredientsDatabase.map((i) => ({
      ...i,
      quantity: 0,
      price: i.defaultPrice || 0,
    })),
  )
  const [optimizedResult, setOptimizedResult] = useState<
    SelectedIngredient[] | null
  >(null)
  const [isOptimizing, setIsOptimizing] = useState(false)

  const [checkedIds, setCheckedIds] = useState<Set<string>>(
    new Set(['mais', 'tourteau_soja', 'coquille_huitre', 'premix']),
  )

  const toggleIngredient = (id: string) => {
    const newSet = new Set(checkedIds)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setCheckedIds(newSet)
  }

  const updatePrice = (id: string, price: number) => {
    setAvailableIngredients((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, price }
          : i,
      ),
    )
  }

  const handleOptimize = () => {
    setIsOptimizing(true)
    setTimeout(() => {
      const requirement = animalRequirements.find(
        (r) => r.id === selectedRequirementId,
      )
      if (requirement) {
        const pool = availableIngredients.filter((i) => checkedIds.has(i.id))
        const result = optimizeFormula(pool, requirement)
        setOptimizedResult(result)
      }
      setIsOptimizing(false)
    }, 1500)
  }

  if (!canAccessMode2) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center max-w-2xl mx-auto mt-8">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Fonctionnalité Premium</h2>
        <p className="text-gray-500 mb-8">
          Le générateur automatique IA est réservé aux membres Pro. Optimisez
          vos coûts de production instantanément.
        </p>
        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 bg-teal-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-teal-700 transition-colors"
        >
          Débloquer le mode Automatique
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-teal-600" />
          Configuration de l'optimisation
        </h2>

        <FormulaInputs
          name={formulaName}
          setName={setFormulaName}
          selectedRequirementId={selectedRequirementId}
          setRequirementId={setSelectedRequirementId}
        />

        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Ingrédients disponibles et prix locaux :
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2 border rounded-lg">
            {availableIngredients.map((ing) => (
              <div
                key={ing.id}
                className={`p-3 rounded-lg border flex items-center gap-3 ${
                  checkedIds.has(ing.id) ? 'bg-teal-50 border-teal-200' : 'bg-white border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checkedIds.has(ing.id)}
                  onChange={() => toggleIngredient(ing.id)}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{ing.name}</div>
                  <div className="text-xs text-gray-500">{ing.category}</div>
                </div>
                <div className="w-24">
                  <input
                    type="number"
                    value={ing.price}
                    onChange={(e) => updatePrice(ing.id, parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-right text-sm border rounded focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleOptimize}
            disabled={isOptimizing || checkedIds.size < 3}
            className="flex items-center gap-2 bg-teal-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-teal-700 disabled:opacity-50 transition-all"
          >
            {isOptimizing ? "Calcul..." : "Générer la formule optimale"}
          </button>
        </div>
      </div>

      {optimizedResult && (
        <div className="space-y-6 animate-in slide-in-from-bottom-8">
          <div className="flex items-center gap-2 text-green-700 bg-green-50 p-4 rounded-lg border border-green-100">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-medium">Optimisation réussie !</span>
          </div>
          <NutritionalSummary
            totals={calculateTotals(optimizedResult)}
            requirement={animalRequirements.find((r) => r.id === selectedRequirementId)}
          />
          <IngredientTable
            selectedIngredients={optimizedResult}
            onUpdateIngredients={setOptimizedResult}
          />
        </div>
      )}
    </div>
  )
}