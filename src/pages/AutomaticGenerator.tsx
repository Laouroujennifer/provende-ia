import { useState } from 'react'
import {
  Wand2, CheckCircle2,
  Star, RotateCcw, Download, Gift
} from 'lucide-react'
import { useSubscription } from '../contexts/SubscriptionContext'
import { Link } from 'react-router-dom'
import { ingredientsDatabase } from '../data/ingredientsDatabase'
import { animalRequirements } from '../data/animalRequirements'
import { optimizeFormula } from '../utils/optimizationAlgorithm'
import type { AnimalRequirement } from '../types/animalRequirements'
import type { SelectedIngredient } from '../types/ingredients'
import { IngredientTable } from '../components/IngredientTable'
import { calculateTotals } from '../utils/nutritionCalculations'


const CAT: Record<string, string> = {
  'Céréale':    'bg-amber-50 border-amber-200 text-amber-700',
  'Protéine':   'bg-blue-50 border-blue-200 text-blue-700',
  'Minéral':    'bg-purple-50 border-purple-200 text-purple-700',
  'Complément': 'bg-pink-50 border-pink-200 text-pink-700',
}

// ─── COMPOSANT RÉSUMÉ NUTRITIONNEL OPTIMAL (vert uniquement) ──────────────────

interface OptimalSummaryProps {
  totals: {
    em?: number
    pb?: number
    ca?: number
    p?: number
    lys?: number
    met?: number
  }
  req: AnimalRequirement
}

function OptimalSummary({ totals, req }: OptimalSummaryProps) {
  const nutrients = [
    { label: 'Énergie métab.', unit: 'kcal/kg', value: totals.em,  min: req.em.min,  max: req.em.max,  decimals: 0 },
    { label: 'Protéines brutes', unit: '%',      value: totals.pb,  min: req.pb.min,  max: req.pb.max,  decimals: 1 },
    { label: 'Calcium',          unit: '%',      value: totals.ca,  min: req.ca.min,  max: req.ca.max,  decimals: 2 },
    { label: 'Phosphore',        unit: '%',      value: totals.p,   min: req.p.min,   max: req.p.max,   decimals: 2 },
    { label: 'Lysine',           unit: '%',      value: totals.lys, min: req.lys.min, max: req.lys.max, decimals: 2 },
    { label: 'Méthionine',       unit: '%',      value: totals.met, min: req.met.min, max: req.met.max, decimals: 2 },
  ]

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">Bilan nutritionnel</h3>
        <span className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-[10px] font-black uppercase">
          <CheckCircle2 size={12} /> Tous critères atteints
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {nutrients.map(n => {
          const val = n.value ?? 0
          const pct = Math.min(((val - n.min) / (n.max - n.min)) * 100, 100)
          return (
            <div key={n.label} className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4">
              <p className="text-[10px] font-black text-emerald-700/60 uppercase tracking-widest mb-1">{n.label}</p>
              <p className="text-xl font-black text-emerald-800">
                {val.toFixed(n.decimals)} <span className="text-sm font-bold text-emerald-600/60">{n.unit}</span>
              </p>
              <div className="mt-2 h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(pct, 8)}%` }}
                />
              </div>
              <p className="text-[9px] text-emerald-600/50 font-bold mt-1">
                Cible : {n.min.toFixed(n.decimals)} – {n.max.toFixed(n.decimals)} {n.unit}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface AutomaticGeneratorProps {
  onTrialExhausted: () => void
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────

export function AutomaticGenerator({ onTrialExhausted }: AutomaticGeneratorProps) {
  const { subscription, incrementAutoCount } = useSubscription()

  const [formulaName, setFormulaName]         = useState('')
  const [selectedReqId, setSelectedReqId]     = useState<string>(animalRequirements[0].id)
  const [optimizedResult, setOptimizedResult] = useState<SelectedIngredient[] | null>(null)
  const [isOptimizing, setIsOptimizing]       = useState(false)
  const [checkedIds, setCheckedIds]           = useState<Set<string>>(
    new Set(['mais', 'tourteau_soja', 'premix'])
  )

  const used         = subscription.autoFormulasCount || 0
  const bonus        = subscription.bonusCalculations || 0
  const totalAllowed = 1 + bonus
  const remaining    = totalAllowed - used

  const selectedReq = animalRequirements.find(r => r.id === selectedReqId) ?? animalRequirements[0]

  // Grouper par espèce pour le select
  const speciesGroups = animalRequirements.reduce<Record<string, AnimalRequirement[]>>((acc, r) => {
    if (!acc[r.species]) acc[r.species] = []
    acc[r.species].push(r)
    return acc
  }, {})

  const toggleIngredient = (id: string) => {
    setCheckedIds(prev => {
      const s = new Set(prev)
      if (s.has(id)) { s.delete(id) } else { s.add(id) }
      return s
    })
  }

  const handleOptimize = () => {
    if (used >= totalAllowed) { onTrialExhausted(); return }
    if (checkedIds.size < 2) return

    setIsOptimizing(true)
    setOptimizedResult(null)

    setTimeout(() => {
      const pool = ingredientsDatabase
        .filter(i => checkedIds.has(i.id))
        .map(i => ({ ...i, quantity: 0, price: i.defaultPrice || 0 }))
      const result = optimizeFormula(pool, selectedReq)
      setOptimizedResult(result)
      incrementAutoCount()
      setIsOptimizing(false)
    }, 2200)
  }

  const canGenerate = !isOptimizing && checkedIds.size >= 2

  // ── VUE RÉSULTATS ────────────────────────────────────────────────────────────

  if (optimizedResult) {
    const totals      = calculateTotals(optimizedResult)
    const costPerTonne = optimizedResult
      .reduce((acc, ing) => acc + (ing.price || 0) * (ing.quantity / 100) * 10, 0)
      .toLocaleString('fr-FR')

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

        <div className="relative bg-[#064e3b] rounded-3xl p-8 overflow-hidden text-white shadow-xl border border-emerald-800">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full -mr-20 -mt-20 blur-2xl" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl flex items-center justify-center">
                <CheckCircle2 size={28} className="text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="font-black text-white text-xl">Formule optimisée !</p>
                <p className="text-emerald-100/50 text-sm font-medium">
                  {selectedReq.species} · <span className="text-emerald-400 font-black">{selectedReq.stage}</span>
                  {' · '}Coût estimé : <span className="text-emerald-400 font-black">{costPerTonne} F / tonne</span>
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

        <OptimalSummary totals={totals} req={selectedReq} />

        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          <IngredientTable
            selectedIngredients={optimizedResult}
            onUpdateIngredients={setOptimizedResult}
          />
        </div>
      </div>
    )
  }

  // ── FORMULAIRE ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Hero */}
      <div className="relative bg-slate-900 rounded-3xl p-8 overflow-hidden text-white border border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-56 h-56 bg-amber-500/8 rounded-full -mr-16 -mt-16 blur-2xl" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/15 border border-amber-400/20 rounded-2xl flex items-center justify-center">
              <Wand2 size={24} className="text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-amber-400/60 uppercase tracking-widest mb-1">
                Générateur de formules automatiques
              </p>
              <h2 className="text-2xl font-black tracking-tight">Algorithme moindre coût</h2>
              <p className="text-white/40 text-sm font-medium mt-0.5">
                Entrez l'âge des poussins — les besoins sont calculés automatiquement
              </p>
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

      {/* Nom de formule + Sélection phase */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Informations de base</h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Nom */}
          <div>
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
              Nom de la formule
            </label>
            <input
              type="text"
              value={formulaName}
              onChange={e => setFormulaName(e.target.value)}
              placeholder="Ex: Poulet de chair lot A"
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent placeholder-slate-300 transition"
            />
          </div>

          {/* Phase / Espèce */}
          <div>
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
              Espèce &amp; Phase
            </label>
            <select
              value={selectedReqId}
              onChange={e => setSelectedReqId(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition appearance-none cursor-pointer"
            >
              {Object.entries(speciesGroups).map(([species, reqs]) => (
                <optgroup key={species} label={species}>
                  {reqs.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.stage} · {r.ageRange}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            {/* Résumé besoins de la phase sélectionnée */}
            <div className="mt-3 flex items-start gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-black text-emerald-800">
                  {selectedReq.species} · {selectedReq.stage}
                </p>
                <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
                  EM {selectedReq.em.min}–{selectedReq.em.max} kcal/kg
                  · PB {selectedReq.pb.min}–{selectedReq.pb.max}%
                  · Ca {selectedReq.ca.min}–{selectedReq.ca.max}%
                  · Lys {selectedReq.lys.min}–{selectedReq.lys.max}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sélection ingrédients */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm text-left">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Ingrédients en stock</h3>
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
                <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg border ${CAT[ing.category] ?? 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                  {ing.category}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Bouton générer */}
      <button
        onClick={handleOptimize}
        disabled={!canGenerate}
        className={`w-full py-7 rounded-3xl font-black text-sm uppercase tracking-widest transition-all shadow-xl ${
          !canGenerate
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
          `Générer la formule optimale · ${selectedReq.stage}`
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