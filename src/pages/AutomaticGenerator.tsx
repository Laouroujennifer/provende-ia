import { useState } from 'react'
import { Wand2, Lock, ArrowRight, CheckCircle2, Beaker } from 'lucide-react'
import { useSubscription } from '../contexts/SubscriptionContext'
import { Link } from 'react-router-dom'
import { ingredientsDatabase } from '../data/ingredientsDatabase'
import { FormulaInputs } from '../components/FormulaInputs'
import { animalRequirements } from '../data/animalRequirements'
import { optimizeFormula } from '../utils/optimizationAlgorithm'
import type { SelectedIngredient } from '../types/ingredients'
import { IngredientTable } from '../components/IngredientTable' // Importation remise
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
    if (!canAccessMode2) return

    setIsOptimizing(true)
    setTimeout(() => {
      const requirement = animalRequirements.find((r) => r.id === selectedRequirementId)
      if (requirement) {
        // Préparation du pool d'ingrédients avec prix par défaut
        const pool = ingredientsDatabase
          .filter(i => checkedIds.has(i.id))
          .map(i => ({ ...i, quantity: 0, price: i.defaultPrice || 0 }))
        
        const result = optimizeFormula(pool, requirement)
        setOptimizedResult(result)
        incrementAutoCount() // Consomme l'essai
      }
      setIsOptimizing(false)
    }, 1500)
  }

  // --- VUE SI L'UTILISATEUR EST BLOQUÉ ---
  if (!canAccessMode2) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-2xl mx-auto mt-8 animate-in zoom-in">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-orange-600" />
        </div>
        <h2 className="text-2xl font-black mb-4">Limite de 3 essais atteinte</h2>
        <p className="text-gray-500 mb-8">Passez en mode <strong>Premium</strong> pour obtenir des formules illimitées.</p>
        <Link to="/pricing" className="inline-flex items-center gap-2 bg-teal-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-teal-700">
          Activer le mode Premium
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Barre d'info abonnement */}
      {subscription.status !== 'active' && (
        <div className="bg-blue-600 text-white p-4 rounded-2xl flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <Beaker size={20} />
            <span className="font-bold text-sm">Mode Essai : {3 - (subscription.autoFormulasCount || 0)} essais restants.</span>
          </div>
          <Link to="/pricing" className="bg-white text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">S'abonner</Link>
        </div>
      )}

      {/* Formulaire de sélection */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-black mb-6 flex items-center gap-2"><Wand2 className="text-teal-600" /> Générateur IA</h2>
        
        <FormulaInputs 
          name={formulaName} 
          setName={setFormulaName} 
          selectedRequirementId={selectedRequirementId} 
          setRequirementId={setSelectedRequirementId} 
        />

        <div className="mt-8">
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 text-center tracking-widest">Étape 1 : Cochez vos produits en stock</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {ingredientsDatabase.map((ing) => (
              <button 
                key={ing.id} 
                onClick={() => toggleIngredient(ing.id)} 
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  checkedIds.has(ing.id) ? 'border-teal-500 bg-white shadow-md ring-2 ring-teal-50' : 'border-gray-100 opacity-50 grayscale'
                }`}
              >
                <div className="font-bold text-sm text-gray-800">{ing.name}</div>
                <div className="text-[9px] text-gray-400 uppercase font-bold">{ing.category}</div>
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleOptimize} 
          disabled={isOptimizing || checkedIds.size < 2} 
          className="w-full mt-10 bg-teal-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-teal-700 shadow-xl shadow-teal-100 active:scale-95 transition-all disabled:opacity-30"
        >
          {isOptimizing ? "Analyse IA en cours..." : "Étape 2 : Trouver la recette optimale"}
        </button>
      </div>

      {/* ZONE DE RÉSULTAT (LÀ OÙ ON VOIT LES KG) */}
      {optimizedResult && (
        <div className="space-y-6 animate-in slide-in-from-bottom-10 duration-700">
          <div className="bg-green-50 p-6 rounded-3xl border border-green-200 flex items-center gap-4">
            <div className="bg-green-600 p-2 rounded-full text-white"><CheckCircle2 /></div>
            <div>
               <span className="font-black text-green-800 text-xl tracking-tight">Recette IA prête !</span>
               <p className="text-sm text-green-700 opacity-80 font-medium">Voici les quantités exactes à mélanger pour 100kg de provende.</p>
            </div>
          </div>

          <NutritionalSummary 
            totals={calculateTotals(optimizedResult)} 
            requirement={animalRequirements.find((r) => r.id === selectedRequirementId)} 
          />

          {/* TABLEAU RÉTABLI : Affiche les KG et les prix pour chaque ingrédient */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
              <h3 className="font-bold text-gray-700">Fiche de mélange (pour 100 kg)</h3>
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