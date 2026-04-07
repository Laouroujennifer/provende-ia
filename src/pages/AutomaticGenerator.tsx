import { useState } from 'react'
import {
  Wand2, CheckCircle2,
  Star, RotateCcw, Download, Gift
} from 'lucide-react'
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

const CAT: Record<string, string> = {
  'Céréale':    'bg-amber-50 border-amber-200 text-amber-700',
  'Protéine':   'bg-blue-50 border-blue-200 text-blue-700',
  'Minéral':    'bg-purple-50 border-purple-200 text-purple-700',
  'Complément': 'bg-pink-50 border-pink-200 text-pink-700',
}

interface AutomaticGeneratorProps {
  onTrialExhausted: () => void
}

export function AutomaticGenerator({ onTrialExhausted }: AutomaticGeneratorProps) {
  const { subscription, incrementAutoCount } = useSubscription()
  const [formulaName, setFormulaName] = useState('')
  const [selectedRequirementId, setSelectedRequirementId] = useState(animalRequirements[0].id)
  const [optimizedResult, setOptimizedResult] = useState<SelectedIngredient[] | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [checkedIds, setCheckedIds] = useState<Set<string>>(
    new Set(['mais', 'tourteau_soja', 'premix'])
  )

  const used = subscription.autoFormulasCount || 0
  const bonus = subscription.bonusCalculations || 0
  const totalAllowed = 1 + bonus
  const remaining = totalAllowed - used

  const toggleIngredient = (id: string) => {
    const newSet = new Set(checkedIds)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setCheckedIds(newSet)
  }

  const handleOptimize = () => {
    // Bloquer si essai déjà épuisé
    if (used >= totalAllowed) {
      onTrialExhausted()
      return
    }
    if (checkedIds.size < 2) return

    setIsOptimizing(true)
    setOptimizedResult(null)

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
    }, 2000)
  }

  const requirement = animalRequirements.find(r => r.id === selectedRequirementId)

  // ── VUE RÉSULTATS ──────────────────────────────────────────────────────────
  if (optimizedResult && requirement) {
    const totals = calculateTotals(optimizedResult)
    const costPerTonne = optimizedResult
      .reduce((acc, ing) => acc + (ing.price || 0) * (ing.quantity / 100) * 10, 0)
      .toLocaleString('fr-FR')

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative bg-[#064e3b] rounded-3xl p-8 overflow-hidden text-white shadow-xl border border-emerald-800">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl flex items-center justify-center">
                <CheckCircle2 size={28} className="text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="font-black text-white text-xl">Formule optimisée !</p>
                <p className="text-emerald-100/50 text-sm font-medium">
                  Coût estimé : <span className="text-emerald-400 font-black">{costPerTonne} F / tonne</span>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button disabled className="flex items-center gap-2 px-5 py-3 bg-white/10 text-white/40 rounded-xl font-black text-[10px] uppercase cursor-not-allowed border border-white/5">
                <Download size={13} /> PDF (Pro)
              </button>
              <button
                onClick={() => setOptimizedResult(null)}
                className="flex items-center gap-2 px-5 py-3 bg-slate-800 text-white rounded-xl font-black text-[10px] uppercase hover:bg-slate-700 transition-colors shadow-lg"
              >
                <RotateCcw size={13} /> Nouveau
              </button>
            </div>
          </div>
        </div>
        <NutritionalSummary totals={totals} requirement={requirement} />
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          <IngredientTable selectedIngredients={optimizedResult} onUpdateIngredients={setOptimizedResult} />
        </div>
      </div>
    )
  }

  // ── FORMULAIRE PRINCIPAL ───────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="relative bg-slate-900 rounded-3xl p-8 overflow-hidden text-white border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 bg-amber-500/15 border border-amber-400/20 rounded-2xl flex items-center justify-center">
              <Wand2 size={24} className="text-amber-400" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-amber-400/60 uppercase tracking-widest mb-1">Générateur IA de précision</p>
              <h2 className="text-2xl font-black tracking-tight">Algorithme moindre coût</h2>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
            <p className={`text-2xl font-black ${remaining > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {remaining}
            </p>
            <p className="text-[9px] font-black opacity-30 uppercase tracking-widest">
              {remaining > 0 ? 'Essai restant' : 'Essai épuisé'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
        <FormulaInputs
          name={formulaName}
          setName={setFormulaName}
          selectedRequirementId={selectedRequirementId}
          setRequirementId={setSelectedRequirementId}
        />
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm text-left">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Mes Ingrédients en stock</h3>
          <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase">
            {checkedIds.size} sélectionnés
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {ingredientsDatabase.map(ing => {
            const isChecked = checkedIds.has(ing.id)
            return (
              <button
                key={ing.id}
                onClick={() => toggleIngredient(ing.id)}
                className={`p-5 rounded-2xl border-2 text-left transition-all ${
                  isChecked
                    ? 'border-emerald-400 bg-emerald-50 ring-4 ring-emerald-50'
                    : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                <p className={`font-black text-sm mb-2 ${isChecked ? 'text-slate-900' : 'text-slate-500'}`}>
                  {ing.name}
                </p>
                <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg border ${CAT[ing.category]}`}>
                  {ing.category}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <button
        onClick={handleOptimize}
        disabled={isOptimizing || checkedIds.size < 2}
        className={`w-full py-7 rounded-3xl font-black text-sm uppercase tracking-widest transition-all shadow-xl ${
          isOptimizing || checkedIds.size < 2
            ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            : remaining === 0
              ? 'bg-red-500 text-white hover:bg-red-400 hover:scale-[1.01] shadow-red-200 active:scale-95'
              : 'bg-[#064e3b] text-white hover:scale-[1.01] hover:bg-emerald-900 shadow-emerald-900/20 active:scale-95'
        }`}
      >
        {isOptimizing ? (
          <span className="flex items-center justify-center gap-2">
            <RotateCcw className="animate-spin" size={20} /> Optimisation en cours...
          </span>
        ) : remaining === 0 ? (
          'Passer Pro pour continuer →'
        ) : (
          'Calculer la formule optimale'
        )}
      </button>

      {remaining === 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/pricing"
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#042818] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-900 transition-all text-center"
          >
            <Star size={14} fill="currentColor" className="text-amber-400" /> Voir les offres Pro
          </Link>
          <Link
            to="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-purple-50 border border-purple-200 text-purple-700 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-purple-100 transition-all text-center"
          >
            <Gift size={14} /> Parrainer pour +1 essai
          </Link>
        </div>
      )}
    </div>
  )
}