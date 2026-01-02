import { useState } from 'react'
import { Wand2, Lock, ArrowRight, CheckCircle2, Beaker } from 'lucide-react'
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
  
  const [availableIngredients] = useState<SelectedIngredient[]>(
    ingredientsDatabase.map((i: Ingredient) => ({
      ...i,
      quantity: 0,
      price: i.defaultPrice || 0,
    })),
  )
  
  const [optimizedResult, setOptimizedResult] = useState<SelectedIngredient[] | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set(['mais', 'tourteau_soja', 'premix']))

  const toggleIngredient = (id: string) => {
    const newSet = new Set(checkedIds)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setCheckedIds(newSet)
  }

  const handleOptimize = () => {
    // BLOCAGE DE SÉCURITÉ : Si on est déjà à 3, on ne lance même pas le calcul
    if (subscription.status !== 'active' && subscription.autoFormulasCount >= 3) {
      return 
    }

    setIsOptimizing(true)
    setTimeout(() => {
      const requirement = animalRequirements.find((r: AnimalRequirement) => r.id === selectedRequirementId)
      if (requirement) {
        const pool = availableIngredients.filter((i: SelectedIngredient) => checkedIds.has(i.id))
        const result = optimizeFormula(pool, requirement)
        
        // On affiche le résultat
        setOptimizedResult(result)
        
        // ON INCRÉMENTE LE COMPTEUR ICI
        incrementAutoCount()
      }
      setIsOptimizing(false)
    }, 1500)
  }

  // --- VUE BLOQUÉE ---
  // Dès que le compteur passe à 3, React re-render et affiche cet écran
  if (!canAccessMode2) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center max-w-2xl mx-auto mt-8 animate-in zoom-in">
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-12 h-12 text-orange-600" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">Essais Gratuits Terminés</h2>
        <p className="text-gray-500 mb-10 text-lg">
          Vous avez utilisé vos <strong>3 essais gratuits</strong>. 
          Passez en mode <strong>Premium</strong> pour continuer à utiliser l'IA.
        </p>
        <Link to="/pricing" className="inline-flex items-center gap-3 bg-teal-600 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-teal-700 shadow-2xl">
          Passer Premium
          <ArrowRight className="w-6 h-6" />
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      {subscription.status !== 'active' && (
        <div className="bg-blue-600 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <Beaker className="w-6 h-6" />
            <span className="font-bold">Essais restants : {3 - (subscription.autoFormulasCount || 0)}</span>
          </div>
          <Link to="/pricing" className="bg-white text-blue-600 px-4 py-1.5 rounded-full text-xs font-black uppercase">S'abonner</Link>
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2 mb-2">
          <Wand2 className="w-6 h-6 text-teal-600" />
          Générateur Automatique
        </h2>
        <p className="text-gray-500 mb-8">Cochez vos produits, l'IA calcule les doses idéales.</p>

        <FormulaInputs
          name={formulaName}
          setName={setFormulaName}
          selectedRequirementId={selectedRequirementId}
          setRequirementId={setSelectedRequirementId}
        />

        <div className="mt-10">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Vos ingrédients :</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
            {availableIngredients.map((ing: SelectedIngredient) => (
              <button
                key={ing.id}
                onClick={() => toggleIngredient(ing.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  checkedIds.has(ing.id) 
                    ? 'bg-white border-teal-500 ring-4 ring-teal-50 shadow-md' 
                    : 'bg-gray-50 border-transparent opacity-60 grayscale'
                }`}
              >
                <div className="font-bold text-sm text-gray-800">{ing.name}</div>
                <div className="text-[10px] text-gray-400 uppercase">{ing.category}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={handleOptimize}
            disabled={isOptimizing || checkedIds.size < 3}
            className="w-full md:w-auto bg-teal-600 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-teal-700 shadow-2xl active:scale-95 transition-all"
          >
            {isOptimizing ? "Calcul IA..." : "Générer la Formule"}
          </button>
        </div>
      </div>

      {optimizedResult && (
        <div className="space-y-6 animate-in slide-in-from-bottom-10">
          <div className="flex items-center gap-4 text-green-700 bg-green-50 p-8 rounded-3xl border-2 border-green-100">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
            <div>
              <span className="font-black text-2xl tracking-tight text-green-800">Formule IA Trouvée !</span>
              <p className="font-medium opacity-70">Le mélange optimal a été calculé avec succès.</p>
            </div>
          </div>
          <NutritionalSummary totals={calculateTotals(optimizedResult)} requirement={animalRequirements.find((r) => r.id === selectedRequirementId)} />
          <IngredientTable selectedIngredients={optimizedResult} onUpdateIngredients={setOptimizedResult} />
        </div>
      )}
    </div>
  )
}