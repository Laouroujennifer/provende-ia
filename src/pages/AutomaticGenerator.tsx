// src/pages/AutomaticGenerator.tsx
import { useState } from 'react'
import { Wand2, Lock, ArrowRight, CheckCircle2, Beaker, AlertTriangle } from 'lucide-react'
import { useSubscription } from '../contexts/SubscriptionContext'
import { Link } from 'react-router-dom'
import { ingredientsDatabase } from '../data/ingredientsDatabase'
import { FormulaInputs } from '../components/FormulaInputs'
import { animalRequirements } from '../data/animalRequirements'
import { optimizeFormula } from '../utils/optimizationAlgorithm'
import type { SelectedIngredient } from '../types/ingredients'
import { IngredientTable } from '../components/IngredientTable'
import { NutritionalSummary } from '../components/NutritionalSummary'
import { calculateTotals } from '../utils/nutritionCalculations'

export function AutomaticGenerator() {
  const { canAccessMode2, subscription, incrementAutoCount } = useSubscription()
  const [formulaName, setFormulaName] = useState('')
  const [selectedRequirementId, setSelectedRequirementId] = useState(animalRequirements[0].id)
  const [optimizedResult, setOptimizedResult] = useState<SelectedIngredient[] | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [checkedIds, setCheckedIds] = useState<Set<string>>(
    new Set(['mais', 'tourteau_soja', 'premix'])
  )

  // Correction de l'erreur ESLint @typescript-eslint/no-unused-expressions
  const toggleIngredient = (id: string) => {
    const newSet = new Set(checkedIds)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setCheckedIds(newSet)
  }

  const handleOptimize = () => {
    if (!canAccessMode2) return
    
    if (checkedIds.size < 2) {
      alert('⚠️ Veuillez sélectionner au moins 2 ingrédients pour l\'optimisation.')
      return
    }

    setIsOptimizing(true)
    
    setTimeout(() => {
      const requirement = animalRequirements.find(r => r.id === selectedRequirementId)
      if (requirement) {
        const pool = ingredientsDatabase
          .filter(i => checkedIds.has(i.id))
          .map(i => ({ ...i, quantity: 0, price: i.defaultPrice || 0 }))

        const result = optimizeFormula(pool, requirement)
        setOptimizedResult(result)
        incrementAutoCount()
      }
      setIsOptimizing(false)
    }, 1500)
  }

  const requirement = animalRequirements.find(r => r.id === selectedRequirementId)

  // Écran d'accès limité (Version Redesignée)
  if (!canAccessMode2) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-xl">
        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <Lock className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Accès IA Limité</h2>
        <p className="text-slate-500 mb-8 font-medium leading-relaxed">
          Vous avez utilisé vos 3 essais gratuits. Passez au plan Pro pour bénéficier de la puissance de notre algorithme d'optimisation en illimité.
        </p>
        <Link
          to="/pricing"
          className="inline-flex items-center gap-3 bg-linear-to-r from-blue-600 to-indigo-700 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-blue-200"
        >
          Voir les Offres Pro
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Trial Banner - Mise à jour Tailwind v4 */}
      {subscription.status !== 'active' && (
        <div className="bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Beaker className="text-amber-600" size={24} />
            </div>
            <div>
              <p className="font-black text-[#064e3b] uppercase text-xs tracking-widest mb-1">Essai Gratuit Actif</p>
              <p className="text-sm text-amber-800 font-bold">
                Calculs restants : <span className="text-xl">{3 - (subscription.autoFormulasCount || 0)}</span> / 3
              </p>
            </div>
          </div>
          <Link
            to="/pricing"
            className="bg-linear-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:shadow-lg transition-all"
          >
            S'abonner
          </Link>
        </div>
      )}

      {/* Generator Card */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <Wand2 className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Générateur IA</h2>
        </div>

        <p className="text-slate-600 mb-8 bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 font-medium">
          🤖 <strong className="text-emerald-700">L'Intelligence Artificielle</strong> calcule automatiquement les quantités optimales pour 100kg de mélange, en respectant les besoins nutritionnels exacts de vos volailles au moindre coût.
        </p>

        <FormulaInputs
          name={formulaName}
          setName={setFormulaName}
          selectedRequirementId={selectedRequirementId}
          setRequirementId={setSelectedRequirementId}
        />

        {/* Ingredient Selection */}
        <div className="mt-12">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Matières premières disponibles :</h3>
          
          {checkedIds.size < 2 && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              <p className="text-sm text-amber-800 font-bold">
                ⚠️ Sélectionnez au moins 2 ingrédients pour lancer l'optimisation.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {ingredientsDatabase.map(ing => (
              <button
                key={ing.id}
                onClick={() => toggleIngredient(ing.id)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden group ${
                  checkedIds.has(ing.id)
                    ? 'border-emerald-500 bg-emerald-50/30 shadow-md ring-4 ring-emerald-500/10'
                    : 'border-slate-100 bg-white hover:border-emerald-200'
                }`}
              >
                <p className={`font-black text-sm mb-1 ${checkedIds.has(ing.id) ? 'text-emerald-700' : 'text-slate-700'}`}>
                    {ing.name}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ing.category}</p>
                {checkedIds.has(ing.id) && (
                    <div className="absolute top-2 right-2">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                    </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Optimize Button */}
        <button
          onClick={handleOptimize}
          disabled={isOptimizing || checkedIds.size < 2}
          className={`w-full mt-12 bg-linear-to-r from-emerald-600 to-teal-700 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all ${
            isOptimizing || checkedIds.size < 2 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01] hover:shadow-emerald-200'
          }`}
        >
          {isOptimizing ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Calcul IA en cours...
            </span>
          ) : (
            '🚀 Calculer la Formule Optimale'
          )}
        </button>
      </div>

      {/* Results Section */}
      {optimizedResult && requirement && (
        <div className="space-y-8 pb-20">
          {/* Success Banner */}
          <div className="bg-linear-to-r from-emerald-500 to-teal-600 rounded-[2rem] p-8 flex items-center gap-6 text-white shadow-xl shadow-emerald-100">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <p className="font-black text-xl uppercase tracking-tighter">Formule optimisée !</p>
              <p className="text-emerald-50 font-medium">
                Les quantités ont été calculées pour un mélange de 100 kg.
              </p>
            </div>
          </div>

          {/* Nutritional Summary */}
          <NutritionalSummary
            totals={calculateTotals(optimizedResult)}
            requirement={requirement}
          />

          {/* Ingredient Table */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900">Composition de la Recette</h3>
              <span className="bg-slate-100 px-4 py-1 rounded-full text-[10px] font-black text-slate-500 uppercase">
                {optimizedResult.length} ingrédients
              </span>
            </div>
            <IngredientTable
              selectedIngredients={optimizedResult}
              onUpdateIngredients={setOptimizedResult}
            />
          </div>
        </div>
      )}
    </div>
  )
}