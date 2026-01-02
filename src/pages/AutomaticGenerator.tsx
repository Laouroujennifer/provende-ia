import { useState } from 'react'
import { Wand2, Lock, ArrowRight, CheckCircle2, Beaker } from 'lucide-react'
import { useSubscription } from '../contexts/SubscriptionContext'
import { Link } from 'react-router-dom'
import { ingredientsDatabase } from '../data/ingredientsDatabase'
import { FormulaInputs } from '../components/FormulaInputs'
import { animalRequirements } from '../data/animalRequirements'
import { optimizeFormula } from '../utils/optimizationAlgorithm'
import type { SelectedIngredient } from '../types/ingredients'
import { NutritionalSummary } from '../components/NutritionalSummary'
import { calculateTotals } from '../utils/nutritionCalculations'

export function AutomaticGenerator() {
  const { canAccessMode2, subscription, incrementAutoCount } = useSubscription()
  const [formulaName, setFormulaName] = useState('')
  const [selectedRequirementId, setSelectedRequirementId] = useState(animalRequirements[0].id)
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
    if (!canAccessMode2) return; // Sécurité supplémentaire

    setIsOptimizing(true)
    setTimeout(() => {
      const requirement = animalRequirements.find((r) => r.id === selectedRequirementId)
      if (requirement) {
        const pool = ingredientsDatabase
          .filter(i => checkedIds.has(i.id))
          .map(i => ({ ...i, quantity: 0, price: i.defaultPrice || 0 }))
        
        const result = optimizeFormula(pool, requirement)
        setOptimizedResult(result)
        incrementAutoCount() // <--- Consomme l'essai immédiatement
      }
      setIsOptimizing(false)
    }, 1500)
  }

  // --- AFFICHAGE DU PAYWALL (BLOCAGE) ---
  if (!canAccessMode2) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-2xl mx-auto mt-8 animate-in zoom-in">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-orange-600" />
        </div>
        <h2 className="text-2xl font-black mb-4">Limite de 3 essais atteinte</h2>
        <p className="text-gray-500 mb-8">Vous avez découvert la puissance de l'IA. Passez en mode <strong>Premium</strong> pour des calculs illimités.</p>
        <Link to="/pricing" className="inline-flex items-center gap-2 bg-teal-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-teal-700">
          Activer le mode Premium
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      {subscription.status !== 'active' && (
        <div className="bg-blue-600 text-white p-4 rounded-2xl flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <Beaker size={20} />
            <span className="font-bold text-sm">Mode Essai : {3 - (subscription.autoFormulasCount || 0)} essais restants.</span>
          </div>
          <Link to="/pricing" className="bg-white text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">S'abonner</Link>
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-black mb-6 flex items-center gap-2"><Wand2 className="text-teal-600" /> Générateur IA</h2>
        <FormulaInputs name={formulaName} setName={setFormulaName} selectedRequirementId={selectedRequirementId} setRequirementId={setSelectedRequirementId} />
        <div className="mt-8">
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-4">Cochez vos stocks :</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {ingredientsDatabase.map((ing) => (
              <button key={ing.id} onClick={() => toggleIngredient(ing.id)} className={`p-3 rounded-xl border-2 text-left transition-all ${checkedIds.has(ing.id) ? 'border-teal-500 bg-teal-50' : 'border-gray-100 opacity-60'}`}>
                <div className="font-bold text-xs">{ing.name}</div>
              </button>
            ))}
          </div>
        </div>
        <button onClick={handleOptimize} disabled={isOptimizing} className="w-full mt-10 bg-teal-600 text-white py-4 rounded-2xl font-bold hover:bg-teal-700 shadow-lg">
          {isOptimizing ? "Calcul en cours..." : "Lancer le calcul IA"}
        </button>
      </div>

      {optimizedResult && (
        <div className="space-y-6">
          <div className="bg-green-50 p-6 rounded-2xl border border-green-200 flex items-center gap-3">
            <CheckCircle2 className="text-green-600" />
            <span className="font-bold text-green-800 text-lg">Formule générée !</span>
          </div>
          <NutritionalSummary totals={calculateTotals(optimizedResult)} requirement={animalRequirements.find((r) => r.id === selectedRequirementId)} />
        </div>
      )}
    </div>
  )
}