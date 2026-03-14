import { useState } from 'react'
import { Save, RotateCcw, Check, Info, Scale } from 'lucide-react'
import { FormulaInputs } from '../components/FormulaInputs'
import { IngredientTable } from '../components/IngredientTable'
import { AIRecommendations } from '../components/AIRecommendations'
import { NutritionalSummary } from '../components/NutritionalSummary'
import { animalRequirements } from '../data/animalRequirements'
import { calculateTotals, generateRecommendations } from '../utils/nutritionCalculations'
import { useSubscription } from '../contexts/SubscriptionContext'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import type { SelectedIngredient } from '../types/ingredients'

export function ManualAnalyzer() {
  const { user } = useAuth()
  const { canSaveFormula, incrementFormulaCount, subscription } = useSubscription()
  const [formulaName, setFormulaName] = useState('')
  const [selectedRequirementId, setSelectedRequirementId] = useState(animalRequirements[0].id)
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([])
  const [saved, setSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const currentRequirement = animalRequirements.find((r) => r.id === selectedRequirementId)
  
  // 1. CALCULS DES VALEURS BRUTES
  const rawTotals = calculateTotals(selectedIngredients)
  const totalWeight = selectedIngredients.reduce((acc, i) => acc + i.quantity, 0)

  // 2. NORMALISATION (Évite le "trop haut/bas" : tout est ramené à une base 100%)
  const factor = totalWeight > 0 ? (100 / totalWeight) : 1;
  const totals = {
    ...rawTotals,
    em: rawTotals.em * factor,
    pb: rawTotals.pb * factor,
    lys: rawTotals.lys * factor,
    met: rawTotals.met * factor,
    ca: rawTotals.ca * factor,
    p: rawTotals.p * factor,
    cost: rawTotals.cost * factor,
    ms: rawTotals.ms * factor,
    cb: rawTotals.cb * factor,
    mg: rawTotals.mg * factor,
    weight: totalWeight // On affiche le poids réel mais l'analyse se fait sur 100%
  }

  const recommendations = generateRecommendations(totals, currentRequirement)

  const handleSave = async () => {
    if (!canSaveFormula || !user) return
    if (!formulaName) { alert('Nom de formule requis'); return }
    
    setIsSaving(true)
    const { error: formulaError } = await supabase.from('formulas').insert([{
      user_id: user.id,
      name: formulaName,
      ingredients: selectedIngredients,
      nutritional_stats: totals,
      cost_per_100kg: 0 
    }])

    if (!formulaError) {
      const nextCount = (subscription.formulasCount || 0) + 1
      await supabase.from('profiles').update({ manual_formulas_count: nextCount }).eq('id', user.id)
      incrementFormulaCount()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setIsSaving(false)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-left">
      
      {/* BANDEAU SUPÉRIEUR - COULEUR FIXE POUR VISIBILITÉ */}
      <div className="relative bg-[#064e3b] rounded-[2rem] p-8 overflow-hidden text-white shadow-xl border border-emerald-800">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Scale size={24} className="text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1">Analyseur de Ration</p>
                <h2 className="text-2xl font-black tracking-tight italic">Mode Libre</h2>
              </div>
            </div>
            
            {/* AFFICHAGE DU POIDS */}
            <div className="bg-black/20 border border-white/10 rounded-2xl px-8 py-4 text-center backdrop-blur-md">
              <p className="text-3xl font-black text-emerald-400">{totalWeight.toFixed(1)} <span className="text-sm text-white/50">kg</span></p>
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-60 mt-1 text-center">Poids total saisi</p>
            </div>
        </div>
      </div>

      {/* MESSAGE D'AIDE */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 flex gap-4 items-center shadow-sm">
        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
          <Info size={20} />
        </div>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          <strong>Note sur le dosage :</strong> Le système analyse vos ingrédients en pourcentage (%). Peu importe si vous saisissez 10kg ou 200kg de mélange, les jauges ci-dessous comparent la qualité nutritionnelle réelle aux besoins de l'animal.
        </p>
      </div>

      {/* CONFIGURATION */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
        <FormulaInputs name={formulaName} setName={setFormulaName} selectedRequirementId={selectedRequirementId} setRequirementId={setSelectedRequirementId} />
      </div>

      {/* RÉSUMÉ NUTRITIONNEL */}
      <NutritionalSummary totals={totals} requirement={currentRequirement} />

      {/* TABLE DES INGRÉDIENTS */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Ma Liste de matières premières</h3>
            {selectedIngredients.length > 0 && (
                <button onClick={() => setSelectedIngredients([])} className="text-[10px] font-black text-red-400 uppercase flex items-center gap-1 hover:text-red-500 transition-colors">
                    <RotateCcw size={12} /> Réinitialiser
                </button>
            )}
        </div>
        <IngredientTable selectedIngredients={selectedIngredients} onUpdateIngredients={setSelectedIngredients} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 text-left">
            <AIRecommendations recommendations={recommendations} />
        </div>
        
        <div className="flex flex-col gap-4">
          <button 
              onClick={handleSave} 
              disabled={isSaving || selectedIngredients.length === 0} 
              className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 ${
                  saved ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-[#064e3b] text-white hover:bg-[#052e20] active:scale-[0.98]'
              }`}
          >
            {isSaving ? <RotateCcw className="animate-spin" size={16} /> : saved ? <Check size={16} /> : <Save size={16} />}
            {saved ? 'RECETTE SAUVEGARDÉE' : 'ENREGISTRER LA FORMULE'}
          </button>
        </div>
      </div>
    </div>
  )
}