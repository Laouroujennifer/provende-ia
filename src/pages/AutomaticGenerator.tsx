import { useState } from 'react'
import { Wand2, Lock, ArrowRight, CheckCircle2,  Beaker } from 'lucide-react'
import { useSubscription } from '../contexts/SubscriptionContext'
import { Link } from 'react-router-dom'
import { ingredientsDatabase } from '../data/ingredientsDatabase'
import { FormulaInputs } from '../components/FormulaInputs'
import { animalRequirements } from '../data/animalRequirements'
import { optimizeFormula } from '../utils/optimizationAlgorithm'
import type { SelectedIngredient, Ingredient } from '../types/ingredients'
import type { AnimalRequirement } from '../types/animalRequirements'
import { IngredientTable } from '../components/IngredientTable'
import { NutritionalSummary } from '../components/NutritionalSummary'
import { calculateTotals } from '../utils/nutritionCalculations'

export function AutomaticGenerator() {
  const { canAccessMode2, subscription, incrementAutoCount } = useSubscription()
  const [formulaName, setFormulaName] = useState('')
  const [selectedRequirementId, setSelectedRequirementId] = useState(animalRequirements[0].id)
  
  // On garde les ingrédients avec leurs prix par défaut (cachés à l'utilisateur pour simplifier)
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
      const requirement = animalRequirements.find((r: AnimalRequirement) => r.id === selectedRequirementId)
      if (requirement) {
        const pool = availableIngredients.filter((i: SelectedIngredient) => checkedIds.has(i.id))
        const result = optimizeFormula(pool, requirement)
        setOptimizedResult(result)
        incrementAutoCount() // Consomme un essai
      }
      setIsOptimizing(false)
    }, 1500)
  }

  // --- VUE SI L'UTILISATEUR EST BLOQUÉ ---
  if (!canAccessMode2) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center max-w-2xl mx-auto mt-8 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-12 h-12 text-orange-600" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Essais Gratuits Terminés</h2>
        <p className="text-gray-500 mb-10 text-lg leading-relaxed">
          Vous avez utilisé vos <strong>3 essais gratuits</strong> de l'Intelligence Artificielle. 
          Passez en mode <strong>Premium</strong> pour continuer à optimiser vos coûts de production.
        </p>
        <Link 
          to="/pricing" 
          className="inline-flex items-center gap-3 bg-teal-600 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-teal-700 transition-all shadow-2xl shadow-teal-200 active:scale-95"
        >
          Devenir Membre Pro
          <ArrowRight className="w-6 h-6" />
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Indicateur d'essais pour les non-abonnés */}
      {subscription.status !== 'active' && (
        <div className="bg-blue-600 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-blue-100">
          <div className="flex items-center gap-3">
            <Beaker className="w-6 h-6" />
            <span className="font-bold">Mode Découverte : Il vous reste {3 - (subscription.autoFormulasCount || 0)} essais gratuits avec l'IA.</span>
          </div>
          <Link to="/pricing" className="bg-white text-blue-600 px-4 py-1.5 rounded-full text-xs font-black uppercase">Passer Pro</Link>
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-teal-600" />
            Générateur Automatique
          </h2>
          <p className="text-gray-500 font-medium">Sélectionnez vos matières premières disponibles, l'IA s'occupe du dosage.</p>
        </div>

        <FormulaInputs
          name={formulaName}
          setName={setFormulaName}
          selectedRequirementId={selectedRequirementId}
          setRequirementId={setSelectedRequirementId}
        />

        <div className="mt-10">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Cochez vos stocks disponibles :</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-2">
            {availableIngredients.map((ing: SelectedIngredient) => (
              <button
                key={ing.id}
                onClick={() => toggleIngredient(ing.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                  checkedIds.has(ing.id) 
                    ? 'bg-white border-teal-500 ring-4 ring-teal-50 shadow-md' 
                    : 'bg-gray-50 border-transparent opacity-60 grayscale hover:grayscale-0 hover:opacity-100'
                }`}
              >
                {checkedIds.has(ing.id) && (
                   <div className="absolute top-2 right-2 bg-teal-500 text-white p-0.5 rounded-full">
                     <CheckCircle2 size={14} />
                   </div>
                )}
                <div className="font-bold text-sm text-gray-800 mb-1">{ing.name}</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase">{ing.category}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center md:justify-end">
          <button
            onClick={handleOptimize}
            disabled={isOptimizing || checkedIds.size < 3}
            className="w-full md:w-auto bg-teal-600 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-teal-700 disabled:opacity-20 transition-all shadow-2xl shadow-teal-100 active:scale-95"
          >
            {isOptimizing ? "Calcul en cours..." : "Générer ma Formule"}
          </button>
        </div>
      </div>

      {optimizedResult && (
        <div className="space-y-6 animate-in slide-in-from-bottom-12 duration-700">
          <div className="flex items-center gap-4 text-green-700 bg-green-50 p-8 rounded-3xl border-2 border-green-100">
            <div className="bg-green-600 p-3 rounded-2xl text-white shadow-lg shadow-green-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="font-black text-2xl tracking-tight">Formule Optimisée !</span>
              <p className="font-medium opacity-70">L'IA a trouvé le mélange le plus rentable pour vos animaux.</p>
            </div>
          </div>
          <NutritionalSummary totals={calculateTotals(optimizedResult)} requirement={animalRequirements.find((r) => r.id === selectedRequirementId)} />
          <IngredientTable selectedIngredients={optimizedResult} onUpdateIngredients={setOptimizedResult} />
        </div>
      )}
    </div>
  )
}