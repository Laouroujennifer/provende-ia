import { useState } from 'react'
import { Wand2, Lock, ArrowRight, CheckCircle2, Info } from 'lucide-react'
import { useSubscription } from '../contexts/SubscriptionContext'
import { Link } from 'react-router-dom'
import { ingredientsDatabase } from '../data/ingredientsDatabase'
import { FormulaInputs } from '../components/FormulaInputs'
import { animalRequirements } from '../data/animalRequirements'
import { optimizeFormula } from '../utils/optimizationAlgorithm'
import type { SelectedIngredient, Ingredient } from '../types/ingredients'
import { IngredientTable } from '../components/IngredientTable'
import { NutritionalSummary } from '../components/NutritionalSummary'
import { calculateTotals } from '../utils/nutritionCalculations'

export function AutomaticGenerator() {
  const { canAccessMode2, subscription, incrementAutoCount } = useSubscription()
  const [formulaName, setFormulaName] = useState('')
  const [selectedRequirementId, setSelectedRequirementId] = useState(animalRequirements[0].id)
  
  // On utilise les prix par défaut de la base pour simplifier
  const [availableIngredients] = useState<SelectedIngredient[]>(
    ingredientsDatabase.map((i: Ingredient) => ({
      ...i,
      quantity: 0,
      price: i.defaultPrice || 0,
    })),
  )
  
  const [optimizedResult, setOptimizedResult] = useState<SelectedIngredient[] | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set(['mais', 'tourteau_soja', 'coquille_huitre', 'premix']))

  const toggleIngredient = (id: string) => {
    const newSet = new Set(checkedIds)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setCheckedIds(newSet)
  }

  const handleOptimize = () => {
    setIsOptimizing(true)
    setTimeout(() => {
      const requirement = animalRequirements.find((r) => r.id === selectedRequirementId)
      if (requirement) {
        const pool = availableIngredients.filter((i) => checkedIds.has(i.id))
        const result = optimizeFormula(pool, requirement)
        setOptimizedResult(result)
        incrementAutoCount() // On compte un essai
      }
      setIsOptimizing(false)
    }, 1500)
  }

  if (!canAccessMode2) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center max-w-2xl mx-auto mt-8">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Essais Gratuits Terminés</h2>
        <p className="text-gray-500 mb-8 text-lg">
          Vous avez utilisé vos 3 essais gratuits de l'IA. 
          Passez en mode **Premium** pour optimiser vos formules en illimité.
        </p>
        <Link to="/pricing" className="inline-flex items-center gap-2 bg-teal-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg">
          Voir les abonnements
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {subscription.status === 'trial' && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center gap-3 text-blue-800 text-sm">
          <Info className="w-5 h-5" />
          <span>Il vous reste <strong>{3 - (subscription.autoFormulasCount || 0)} essais gratuits</strong> avec l'IA.</span>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-teal-600" />
          Générateur Automatique IA
        </h2>
        <p className="text-sm text-gray-500 mb-6 italic">Cochez simplement ce que vous avez, l'IA calcule les doses idéales.</p>

        <FormulaInputs
          name={formulaName}
          setName={setFormulaName}
          selectedRequirementId={selectedRequirementId}
          setRequirementId={setSelectedRequirementId}
        />

        <div className="mt-8">
          <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase">Cochez vos ingrédients disponibles :</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-4 border bg-gray-50 rounded-xl">
            {availableIngredients.map((ing) => (
              <button
                key={ing.id}
                onClick={() => toggleIngredient(ing.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  checkedIds.has(ing.id) 
                    ? 'bg-white border-teal-500 ring-2 ring-teal-500' 
                    : 'bg-white border-gray-200 opacity-60'
                }`}
              >
                <div className="font-bold text-xs text-gray-800">{ing.name}</div>
                <div className="text-[9px] text-gray-400">{ing.category}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleOptimize}
            disabled={isOptimizing || checkedIds.size < 3}
            className="bg-teal-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-teal-700 disabled:opacity-50 transition-all shadow-xl"
          >
            {isOptimizing ? "Calcul en cours..." : "Trouver la formule idéale"}
          </button>
        </div>
      </div>

      {optimizedResult && (
        <div className="space-y-6 animate-in slide-in-from-bottom-8">
          <div className="flex items-center gap-3 text-green-700 bg-green-50 p-6 rounded-xl border border-green-200">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-bold text-lg">Proportions calculées avec succès !</span>
          </div>
          <NutritionalSummary totals={calculateTotals(optimizedResult)} requirement={animalRequirements.find((r) => r.id === selectedRequirementId)} />
          <IngredientTable selectedIngredients={optimizedResult} onUpdateIngredients={setOptimizedResult} />
        </div>
      )}
    </div>
  )
}