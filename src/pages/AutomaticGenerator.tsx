import { useState, useMemo } from 'react'
import {
  Wand2, CheckCircle2, Star, RotateCcw, Gift,
  Sparkles, AlertTriangle, TrendingUp, Save, Printer, Copy, Search, X, Check,
  CreditCard, Plus,
} from 'lucide-react'
import { useSubscription } from '../contexts/SubscriptionContext'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import { ingredientsDatabase } from '../data/ingredientsDatabase'
import { animalRequirements } from '../data/animalRequirements'
import { optimizeFormula, computeOptimizationQuality } from '../utils/optimizationAlgorithm'
import type { AnimalRequirement } from '../types/animalRequirements'
import type { SelectedIngredient } from '../types/ingredients'
import { IngredientTable } from '../components/IngredientTable'
import { calculateTotals, getFinalValues, computeNutritionScore } from '../utils/nutritionCalculations'
import type { FormulaTotals } from '../types/ingredients'

// ─── STYLES CATÉGORIES ────────────────────────────────────────────────────────

const CAT: Record<string, string> = {
  'Céréale':    'bg-[#FF6800]/10 border-[#FF6800]/30 text-[#FF8533]',
  'Protéine':   'bg-white/5 border-white/20 text-white/70',
  'Minéral':    'bg-white/5 border-white/20 text-white/70',
  'Complément': 'bg-white/5 border-white/20 text-white/70',
}

// ─── BILAN NUTRITIONNEL ───────────────────────────────────────────────────────

interface OptimalSummaryProps {
  totals: FormulaTotals
  req: AnimalRequirement
}

function OptimalSummary({ totals, req }: OptimalSummaryProps) {
  const final = getFinalValues(totals)
  const score = computeNutritionScore(totals, req)

  const nutrients = [
    { label: 'Énergie métab.', unit: 'kcal/kg', value: final.em,  min: req.em.min,  max: req.em.max,  decimals: 0 },
    { label: 'Protéines brutes', unit: '%',     value: final.pb,  min: req.pb.min,  max: req.pb.max,  decimals: 1 },
    { label: 'Calcium',          unit: '%',     value: final.ca,  min: req.ca.min,  max: req.ca.max,  decimals: 2 },
    { label: 'Phosphore',        unit: '%',     value: final.p,   min: req.p.min,   max: req.p.max,   decimals: 2 },
    { label: 'Lysine',           unit: '%',     value: final.lys, min: req.lys.min, max: req.lys.max, decimals: 2 },
    { label: 'Méthionine',       unit: '%',     value: final.met, min: req.met.min, max: req.met.max, decimals: 2 },
  ]

  const eps = (n: typeof nutrients[0]) => Math.max((n.max - n.min) * 0.005, 0.005)
  const inRangeOf = (n: typeof nutrients[0]) => n.value >= n.min - eps(n) && n.value <= n.max + eps(n)
  const allInRange = nutrients.every(inRangeOf)

  const scoreColor = score >= 90 ? 'text-emerald-400' : score >= 70 ? 'text-amber-400' : 'text-red-400'

  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-black text-white text-sm uppercase tracking-widest">Bilan nutritionnel</h3>
          <p className="text-xs text-white/40 mt-1">Score qualité basé sur le centrage dans les plages cibles</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <span className={`text-3xl font-black ${scoreColor}`}>{score}</span>
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">/100</span>
          </div>
          {allInRange ? (
            <span className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-[10px] font-black uppercase">
              <CheckCircle2 size={12} /> Tous critères atteints
            </span>
          ) : (
            <span className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl text-[10px] font-black uppercase">
              <AlertTriangle size={12} /> Vérification requise
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {nutrients.map(n => {
          const inRange = inRangeOf(n)
          const center  = (n.min + n.max) / 2
          const plage   = n.max - n.min || 1
          const isCentered = Math.abs(n.value - center) <= (plage / 2) * 0.80

          const pct = Math.min(Math.max(((n.value - n.min) / plage) * 100, 0), 100)
          const barColor = !inRange ? 'bg-red-400' : isCentered ? 'bg-emerald-500' : 'bg-amber-400'
          const cardBg   = !inRange ? 'bg-red-500/10 border-red-500/30' : isCentered ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'
          const textColor = !inRange ? 'text-red-300' : isCentered ? 'text-emerald-300' : 'text-amber-300'
          const labelColor = !inRange ? 'text-red-400/70' : isCentered ? 'text-emerald-400/70' : 'text-amber-400/70'

          return (
            <div key={n.label} className={`border rounded-2xl p-4 ${cardBg}`}>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${labelColor}`}>{n.label}</p>
              <p className={`text-xl font-black ${textColor}`}>
                {n.value.toFixed(n.decimals)}{' '}
                <span className="text-sm font-bold opacity-60">{n.unit}</span>
              </p>
              <div className="mt-2 h-2 bg-[#0A0A0A] rounded-full overflow-hidden relative">
                <div className="absolute top-0 h-full bg-emerald-500/20 rounded-full" style={{ left: '10%', width: '80%' }} />
                <div className={`absolute top-0 h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${Math.max(pct, 6)}%` }} />
                <div className="absolute top-0 h-full w-0.5 bg-white/40" style={{ left: '50%' }} />
              </div>
              <div className="flex justify-between mt-1">
                <p className="text-[9px] font-bold opacity-50">Min: {n.min.toFixed(n.decimals)}</p>
                <p className="text-[9px] font-bold opacity-50">Ctr: {center.toFixed(n.decimals)}</p>
                <p className="text-[9px] font-bold opacity-50">Max: {n.max.toFixed(n.decimals)}</p>
              </div>
              {isCentered && inRange && <p className="text-[9px] font-black text-emerald-400 mt-1">✓ Zone optimale</p>}
              {!isCentered && inRange && <p className="text-[9px] font-black text-amber-400 mt-1">~ Acceptable (hors centre)</p>}
              {!inRange && <p className="text-[9px] font-black text-red-400 mt-1">✗ Hors plage</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── ANALYSE IA PANEL ─────────────────────────────────────────────────────────

interface AIAnalysisProps {
  result: SelectedIngredient[]
  req: AnimalRequirement
  score: number
  onNoCredits: () => void
}

function AIAnalysisPanel({ result, req, score, onNoCredits }: AIAnalysisProps) {
  const { useCredit, subscription } = useSubscription()
  const [analysis, setAnalysis] = useState<string>('')
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(false)

  const credits = subscription.credits ?? 0

  const buildLocalAnalysis = (): string => {
    const totals = calculateTotals(result)
    const final  = getFinalValues(totals)

    type NutInfo = {
      key: string; label: string; value: number; min: number; max: number;
      unit: string; center: number; distance: number; position: 'low' | 'center' | 'high'
    }
    const buildNut = (key: string, label: string, value: number, min: number, max: number, unit: string): NutInfo => {
      const center = (min + max) / 2
      const range = max - min
      const rel = range > 0 ? (value - center) / (range / 2) : 0
      const position: 'low' | 'center' | 'high' = rel < -0.5 ? 'low' : rel > 0.5 ? 'high' : 'center'
      return { key, label, value, min, max, unit, center, distance: Math.abs(value - center), position }
    }
    const nutrients: NutInfo[] = [
      buildNut('em',  'Énergie métabolisable', final.em,  req.em.min,  req.em.max,  'kcal/kg'),
      buildNut('pb',  'Protéines brutes',      final.pb,  req.pb.min,  req.pb.max,  '%'),
      buildNut('lys', 'Lysine',                final.lys, req.lys.min, req.lys.max, '%'),
      buildNut('met', 'Méthionine',            final.met, req.met.min, req.met.max, '%'),
      buildNut('ca',  'Calcium',               final.ca,  req.ca.min,  req.ca.max,  '%'),
      buildNut('p',   'Phosphore',             final.p,   req.p.min,   req.p.max,   '%'),
    ]

    const eps = (n: NutInfo) => Math.max((n.max - n.min) * 0.005, 0.005)
    const inRange = nutrients.filter(n => n.value >= n.min - eps(n) && n.value <= n.max + eps(n))
    const tooLow  = nutrients.filter(n => n.value < n.min - eps(n))
    const tooHigh = nutrients.filter(n => n.value > n.max + eps(n))
    const optimal = inRange.filter(n => { const half = (n.max - n.min) / 2; return half > 0 && n.distance / half <= 0.5 })
    const offCenter = inRange.filter(n => !optimal.includes(n))

    const fmt = (n: NutInfo) => `${n.value.toFixed(n.unit === '%' ? 2 : 0)}${n.unit}`
    const targetStr = (n: NutInfo) => `cible ${n.center.toFixed(n.unit === '%' ? 2 : 0)}${n.unit}`
    const totalKg = result.reduce((s, i) => s + i.quantity, 0) || 100
    const dominance = (id: string) => { const ing = result.find(i => i.id === id); return ing ? (ing.quantity / totalKg) * 100 : 0 }
    const has = (id: string) => result.some(i => i.id === id && i.quantity > 0.5)

    let txt = ''
    txt += '**Verdict global**\n\n'
    if (tooLow.length === 0 && tooHigh.length === 0) {
      if (optimal.length === nutrients.length) {
        txt += `Excellente formule. Les 6 nutriments sont dans les plages Goliath et bien centrés. Vous pouvez fabriquer en confiance.\n\n`
      } else if (optimal.length >= 4) {
        txt += `Bonne formule. ${optimal.length} nutriments sur 6 sont bien centrés. Les ${offCenter.length} autres sont dans la plage mais proches d'une borne.\n\n`
      } else {
        txt += `Formule acceptable. Tous les nutriments respectent les plages mais ${offCenter.length} sont proches des bornes. Voir les suggestions.\n\n`
      }
    } else {
      txt += `Formule à ajuster. ${tooLow.length + tooHigh.length} nutriment(s) sortent des plages : ${[...tooLow, ...tooHigh].map(n => n.label.toLowerCase().split(' ')[0]).join(', ')}.\n\n`
    }

    if (optimal.length > 0) {
      txt += '**Points forts**\n\n'
      for (const n of optimal) txt += `- ${n.label} : ${fmt(n)} — parfaitement centré (${n.min}-${n.max}${n.unit}).\n`
      txt += '\n'
    }

    if (tooLow.length > 0 || tooHigh.length > 0) {
      txt += '**Corrections obligatoires**\n\n'
      for (const n of tooLow) {
        const gap = ((n.min - n.value) / n.min * 100).toFixed(0)
        txt += `- **${n.label} trop bas** (${fmt(n)}, il manque ${gap}%). `
        if (n.key === 'pb')       txt += `Augmentez le tourteau de soja de 2-3 kg.\n`
        else if (n.key === 'em')  txt += `Ajoutez 1-2 kg de soja graine ou 0,5 kg d'huile rouge.\n`
        else if (n.key === 'ca')  txt += `Augmentez la coquille d'huître de 1-2 kg.\n`
        else if (n.key === 'p')   txt += `Ajoutez 0,5-1 kg de phosphate bicalcique.\n`
        else if (n.key === 'lys') txt += `Ajoutez 0,1-0,2 kg de lysine HCl synthétique.\n`
        else if (n.key === 'met') txt += `Ajoutez 0,05-0,15 kg de DL-méthionine.\n`
      }
      for (const n of tooHigh) {
        const excess = ((n.value - n.max) / n.max * 100).toFixed(0)
        txt += `- **${n.label} trop élevé** (${fmt(n)}, ${excess}% au-dessus). `
        if (n.key === 'pb')  txt += `Réduisez le tourteau de soja, augmentez les céréales.\n`
        else if (n.key === 'em') txt += `Réduisez l'huile et le soja graine, augmentez le son de blé.\n`
        else if (n.key === 'ca') txt += `Réduisez la coquille d'huître.\n`
        else if (n.key === 'p')  txt += `Réduisez le phosphate bicalcique.\n`
        else if (n.key === 'lys') txt += `Diversifiez les sources de protéines.\n`
        else if (n.key === 'met') txt += `Réduisez la DL-méthionine ou la farine de poisson.\n`
      }
      txt += '\n'
    }

    const suggestions: string[] = []
    for (const n of offCenter) {
      if (n.position === 'high' && n.key === 'pb' && dominance('tourteau_soja') > 22)
        suggestions.push(`**Protéines proches du plafond** (${fmt(n)}, ${targetStr(n)}). Descendez à 18-20% de tourteau de soja.`)
      else if (n.position === 'low' && n.key === 'em')
        suggestions.push(`**Énergie proche du plancher** (${fmt(n)}, ${targetStr(n)}). Ajoutez 1-2 kg de soja graine.`)
      else if (n.position === 'low' && n.key === 'lys')
        suggestions.push(`**Lysine proche du plancher** (${fmt(n)}, ${targetStr(n)}). Ajoutez 0,05-0,1 kg de lysine synthétique.`)
      else if (n.position === 'low' && n.key === 'met')
        suggestions.push(`**Méthionine proche du plancher** (${fmt(n)}, ${targetStr(n)}). Ajoutez 0,03-0,08 kg de DL-méthionine.`)
    }
    if (dominance('mais') > 60) suggestions.push(`**Maïs très dominant** (${dominance('mais').toFixed(0)}%). Diversifiez avec du sorgho ou son de blé.`)
    if (dominance('tourteau_soja') > 30) suggestions.push(`**Tourteau de soja très dominant** (${dominance('tourteau_soja').toFixed(0)}%). Remplacez 5-8 kg par du tourteau de palmiste.`)
    if (!has('farine_poisson') && (req.stage.toLowerCase().includes('démarrage') || req.stage.toLowerCase().includes('croissance')))
      suggestions.push(`**Pas de farine de poisson**. 2-4 kg amélioreraient le profil lysine, méthionine, Ca et P.`)
    if (!has('premix') && !has('cmv') && !has('concentre_chair') && !has('concentre_ponte'))
      suggestions.push(`**Pas de prémix (CMV) détecté**. Ajoutez 0,25-0,5 kg de prémix pour 100 kg.`)

    if (suggestions.length > 0) {
      txt += "**Suggestions d'amélioration**\n\n"
      for (const s of suggestions) txt += `- ${s}\n`
      txt += '\n'
    }

    txt += '**Conseil pratique terrain**\n\n'
    const stage = req.stage.toLowerCase()
    if (stage.includes('démarrage')) txt += `Distribuez 5-6 petits repas par jour, eau fraîche en permanence, température 32-35°C la première semaine.`
    else if (stage.includes('croissance') && req.species.toLowerCase().includes('chair')) txt += `Contrôlez le poids hebdomadaire (10 sujets). Objectif ~1,8-2 kg à 8 semaines.`
    else if (stage.includes('ponte')) txt += `Distribuez le calcium en 2 fois : 1/3 le matin (poudre fine), 2/3 le soir (gros grain).`
    else txt += `Stockez au sec, à l'abri des rongeurs. Vérifiez l'absence de moisissures sur le maïs.`

    return txt
  }

  const runAnalysis = async () => {
    const ok = await useCredit()
    if (!ok) {
      onNoCredits()
      return
    }
    setLoading(true)
    setAnalysis('')
    setDone(false)

    const fullText = buildLocalAnalysis()
    const words = fullText.split(/(\s+)/)
    for (let i = 0; i < words.length; i++) {
      await new Promise(r => setTimeout(r, 8))
      setAnalysis(prev => prev + words[i])
    }
    setDone(true)
    setLoading(false)
  }

  const formatAnalysis = (text: string) => {
    const lines = text.split('\n')
    const sections: { title: string; content: string[] }[] = []
    let current: { title: string; content: string[] } | null = null
    for (const line of lines) {
      const titleMatch = line.match(/^\*\*([^*]+)\*\*$/)
      if (titleMatch) {
        if (current) sections.push(current)
        current = { title: titleMatch[1], content: [] }
      } else if (current) {
        current.content.push(line)
      }
    }
    if (current) sections.push(current)

    const sectionConfig: Record<string, { color: string; bg: string; border: string; icon: string }> = {
      'Verdict global':            { color: 'text-white',        bg: 'bg-[#0A0A0A]',       border: 'border-[#2A2A2A]',       icon: '📋' },
      'Points forts':              { color: 'text-emerald-300',  bg: 'bg-emerald-500/10',  border: 'border-emerald-500/30',  icon: '✨' },
      'Corrections obligatoires':  { color: 'text-red-300',      bg: 'bg-red-500/10',      border: 'border-red-500/30',      icon: '⚠️' },
      "Suggestions d'amélioration":{ color: 'text-[#FF8533]',    bg: 'bg-[#FF6800]/10',    border: 'border-[#FF6800]/30',    icon: '💡' },
      'Conseil pratique terrain':  { color: 'text-[#FF8533]',    bg: 'bg-[#FF6800]/5',     border: 'border-[#FF6800]/20',    icon: '🌾' },
    }

    return (
      <div className="space-y-4">
        {sections.map((sec, idx) => {
          const cfg = sectionConfig[sec.title] ?? { color: 'text-white', bg: 'bg-[#1A1A1A]', border: 'border-[#2A2A2A]', icon: '•' }
          return (
            <div key={idx} className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-5`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{cfg.icon}</span>
                <h4 className={`font-black text-xs uppercase tracking-widest ${cfg.color}`}>{sec.title}</h4>
              </div>
              <div className="space-y-2">
                {sec.content.filter(l => l.trim() !== '').map((line, j) => {
                  const isBullet = line.startsWith('- ')
                  const clean = isBullet ? line.slice(2) : line
                  const parts = clean.split(/(\*\*[^*]+\*\*)/g)
                  const bulletColor =
                    cfg.color === 'text-emerald-300' ? 'bg-emerald-400' :
                    cfg.color === 'text-red-300' ? 'bg-red-400' :
                    'bg-[#FF6800]'
                  return (
                    <div key={j} className={`text-sm leading-relaxed text-white/80 ${isBullet ? 'pl-4 relative' : ''}`}>
                      {isBullet && <span className={`absolute left-0 top-2 w-1.5 h-1.5 rounded-full ${bulletColor}`} />}
                      {parts.map((p, k) => {
                        const boldMatch = p.match(/^\*\*([^*]+)\*\*$/)
                        if (boldMatch) return <strong key={k} className="font-black text-white">{boldMatch[1]}</strong>
                        return <span key={k}>{p}</span>
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="bg-[#1A1A1A] border border-[#FF6800]/20 rounded-3xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#FF6800]/20 border border-[#FF6800]/30 rounded-xl flex items-center justify-center">
            <Sparkles size={16} className="text-[#FF6800]" />
          </div>
          <div>
            <h3 className="font-black text-[#FF6800] text-sm uppercase tracking-widest">Analyse détaillée</h3>
            <p className="text-[11px] text-white/40 font-medium">
              {done ? 'Analyse complète' : `1 crédit requis · Solde actuel : ${credits} crédit${credits > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {!done && (
          <button
            onClick={runAnalysis}
            disabled={loading || credits === 0}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${
              loading
                ? 'bg-[#2A2A2A] text-white/40 cursor-wait'
                : credits === 0
                  ? 'bg-[#2A2A2A] text-white/30 cursor-not-allowed'
                  : 'bg-[#FF6800] text-white hover:bg-[#FF8533] shadow-lg shadow-[#FF6800]/30'
            }`}
          >
            {loading ? (
              <><RotateCcw size={13} className="animate-spin" /> Analyse…</>
            ) : credits === 0 ? (
              <><CreditCard size={13} /> Crédits épuisés</>
            ) : (
              <><Sparkles size={13} /> Analyser (1 crédit)</>
            )}
          </button>
        )}

        {done && (
          <button
            onClick={runAnalysis}
            disabled={credits === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest bg-[#1A1A1A] border border-[#2A2A2A] text-white/60 hover:bg-[#2A2A2A] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <RotateCcw size={12} /> Relancer (1 crédit)
          </button>
        )}
      </div>

      {!analysis && !loading && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-16 h-16 bg-[#FF6800]/10 border border-[#FF6800]/20 rounded-2xl flex items-center justify-center mb-4">
            <Sparkles size={28} className="text-[#FF6800]" />
          </div>
          <p className="font-black text-white mb-1">Analyse détaillée disponible</p>
          <p className="text-sm text-white/40 max-w-xs">
            {credits === 0
              ? 'Rechargez vos crédits pour débloquer l\'analyse personnalisée.'
              : 'Cliquez sur "Analyser" pour obtenir un diagnostic nutritionnel détaillé. Coûte 1 crédit.'}
          </p>
          {credits === 0 && (
            <Link
              to="/pricing"
              className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-[#FF6800] text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-[#FF8533] transition-all"
            >
              <Plus size={13} /> Recharger des crédits
            </Link>
          )}
          <div className={`mt-6 px-6 py-3 rounded-2xl border ${
            score >= 90 ? 'bg-emerald-500/10 border-emerald-500/30' :
            score >= 70 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-red-500/10 border-red-500/30'
          }`}>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1 text-white/50">Score actuel</p>
            <p className={`text-4xl font-black ${score >= 90 ? 'text-emerald-400' : score >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
              {score}<span className="text-lg">/100</span>
            </p>
          </div>
        </div>
      )}

      {(analysis || loading) && (
        <div className="relative">
          {loading && !analysis && (
            <div className="flex flex-col items-center justify-center py-12 px-6 bg-[#FF6800]/5 rounded-2xl border border-[#FF6800]/20">
              <div className="relative">
                <div className="w-14 h-14 bg-[#1A1A1A] rounded-2xl shadow-lg flex items-center justify-center mb-3 border border-[#FF6800]/30">
                  <Sparkles size={24} className="text-[#FF6800] animate-pulse" />
                </div>
                <div className="absolute -inset-1 bg-[#FF6800]/20 rounded-2xl animate-ping" />
              </div>
              <span className="font-black text-sm text-[#FF6800] uppercase tracking-widest">Analyse en cours…</span>
            </div>
          )}
          {analysis && formatAnalysis(analysis)}
          {loading && analysis && (
            <div className="flex items-center gap-2 text-[#FF6800] text-xs font-bold mt-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF6800] animate-pulse" />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF6800] animate-pulse [animation-delay:200ms]" />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF6800] animate-pulse [animation-delay:400ms]" />
            </div>
          )}
          {done && (
            <div className="mt-4 pt-4 border-t border-[#FF6800]/20 flex items-center gap-2 text-[10px] text-white/40 font-bold">
              <CheckCircle2 size={12} className="text-emerald-400" />
              Analyse générée à partir des plages Goliath — vérifiez avec un nutritionniste pour des décisions critiques.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface AutomaticGeneratorProps {
  onTrialExhausted: () => void
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────

export function AutomaticGenerator({ onTrialExhausted }: AutomaticGeneratorProps) {
  const { subscription, useCredit, incrementAutoCount } = useSubscription()
  const { user } = useAuth()

  const [formulaName, setFormulaName]         = useState('')
  const [selectedReqId, setSelectedReqId]     = useState<string>(animalRequirements[0].id)
  const [optimizedResult, setOptimizedResult] = useState<SelectedIngredient[] | null>(null)
  const [isOptimizing, setIsOptimizing]       = useState(false)
  const [checkedIds, setCheckedIds]           = useState<Set<string>>(
    new Set(['mais', 'tourteau_soja', 'premix'])
  )
  const [searchQuery, setSearchQuery]         = useState('')
  const [isSaving, setIsSaving]               = useState(false)
  const [savedOk, setSavedOk]                 = useState(false)
  const [saveError, setSaveError]             = useState<string | null>(null)
  const [batchKg, setBatchKg]                 = useState(100)
  const [copiedOk, setCopiedOk]               = useState(false)

  const [userPrices, setUserPrices] = useState<Record<string, number>>(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('provende_user_prices') : null
      return stored ? JSON.parse(stored) : {}
    } catch { return {} }
  })

  const updateUserPrice = (ingredientId: string, price: number) => {
    setUserPrices(prev => {
      const next = { ...prev, [ingredientId]: price }
      try { localStorage.setItem('provende_user_prices', JSON.stringify(next)) } catch (e) { console.error(e) }
      return next
    })
    if (optimizedResult) {
      setOptimizedResult(optimizedResult.map(ing =>
        ing.id === ingredientId ? { ...ing, price } : ing
      ))
    }
  }

  const resetUserPrices = () => {
    if (!window.confirm('Supprimer tous tes prix personnalisés ?')) return
    setUserPrices({})
    try { localStorage.removeItem('provende_user_prices') } catch (e) { console.error(e) }
    if (optimizedResult) {
      setOptimizedResult(optimizedResult.map(ing => {
        const db = ingredientsDatabase.find(i => i.id === ing.id)
        return { ...ing, price: db?.defaultPrice || 0 }
      }))
    }
  }

  const credits = subscription.credits ?? 0
  const selectedReq = animalRequirements.find(r => r.id === selectedReqId) ?? animalRequirements[0]

  const speciesGroups = animalRequirements.reduce<Record<string, AnimalRequirement[]>>((acc, r) => {
    if (!acc[r.species]) acc[r.species] = []
    acc[r.species].push(r)
    return acc
  }, {})

  const toggleIngredient = (id: string) => {
    setCheckedIds(prev => {
      const s = new Set(prev)
      if (s.has(id)) s.delete(id); else s.add(id)
      return s
    })
  }

  const handleOptimize = async () => {
    if (credits <= 0) { onTrialExhausted(); return }
    if (checkedIds.size < 2) return

    const ok = await useCredit()
    if (!ok) { onTrialExhausted(); return }

    setIsOptimizing(true)
    setOptimizedResult(null)

    setTimeout(() => {
      const pool = ingredientsDatabase
        .filter(i => checkedIds.has(i.id))
        .map(i => ({ ...i, quantity: 0, price: userPrices[i.id] ?? i.defaultPrice ?? 0 }))
      const result = optimizeFormula(pool, selectedReq)
      const resultWithPrices = result.map(ing => ({
        ...ing,
        price: userPrices[ing.id] ?? ing.price ?? ingredientsDatabase.find(i => i.id === ing.id)?.defaultPrice ?? 0,
      }))
      setOptimizedResult(resultWithPrices)
      incrementAutoCount()
      setIsOptimizing(false)
    }, 2200)
  }

  const canGenerate = !isOptimizing && checkedIds.size >= 2

  const filteredIngredients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const base = q
      ? ingredientsDatabase.filter(i => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q))
      : ingredientsDatabase
    return [...base].sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }))
  }, [searchQuery])

  const handleSaveFormula = async () => {
    if (!optimizedResult || !user) {
      setSaveError(!user ? 'Vous devez être connecté.' : 'Aucune formule à enregistrer.')
      setTimeout(() => setSaveError(null), 3000)
      return
    }
    const name = formulaName.trim() || `${selectedReq.species} - ${selectedReq.stage} (${new Date().toLocaleDateString('fr-FR')})`
    setIsSaving(true)
    setSaveError(null)
    const totals = calculateTotals(optimizedResult)
    const costPer100kg = optimizedResult.reduce((acc, ing) => acc + (ing.price || 0) * (ing.quantity / 100), 0)
    const { error } = await supabase.from('formulas').insert([{
      user_id: user.id, name, ingredients: optimizedResult,
      nutritional_stats: totals, cost_per_100kg: Math.round(costPer100kg),
    }])
    setIsSaving(false)
    if (error) {
      setSaveError("Erreur lors de l'enregistrement.")
      setTimeout(() => setSaveError(null), 4000)
    } else {
      setSavedOk(true)
      setTimeout(() => setSavedOk(false), 3000)
    }
  }

  const handleCopy = async () => {
    if (!optimizedResult) return
    const factor = batchKg / 100
    const lines = [
      `Formule ${selectedReq.species} - ${selectedReq.stage}`,
      `Pour ${batchKg} kg de mélange`, '',
      ...optimizedResult.filter(i => i.quantity > 0.01).map(i => `${i.name}: ${(i.quantity * factor).toFixed(2)} kg`),
      '', `Total: ${batchKg} kg`,
    ]
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopiedOk(true)
      setTimeout(() => setCopiedOk(false), 2000)
    } catch (e) { console.error(e) }
  }

  // ── VUE RÉSULTATS ───────────────────────────────────────────────────────────

  if (optimizedResult) {
    const totals       = calculateTotals(optimizedResult)
    const score        = computeNutritionScore(totals, selectedReq)
    const quality      = computeOptimizationQuality(optimizedResult, selectedReq)
    const costPer100kg = optimizedResult.reduce((acc, ing) => acc + (ing.price || 0) * (ing.quantity / 100), 0)
    const costPerTonne = (costPer100kg * 10).toLocaleString('fr-FR', { maximumFractionDigits: 0 })
    const costForBatch = (costPer100kg * batchKg / 100).toLocaleString('fr-FR', { maximumFractionDigits: 0 })
    const inRangeCount = quality.nutrients.filter(n => n.status !== 'warning').length
    const totalNutrients = quality.nutrients.length

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 print:space-y-2">

        <div className="relative bg-gradient-to-br from-[#1A1A1A] via-[#0A0A0A] to-[#1A1A1A] rounded-3xl overflow-hidden text-white shadow-2xl border border-[#FF6800]/30 print:bg-white print:text-slate-900 print:shadow-none">
          <div className="absolute inset-0 pointer-events-none print:hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#FF6800]/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          </div>

          <div className="relative z-10 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  quality.allOptimal ? 'bg-emerald-500/20 border border-emerald-500/40' : 'bg-[#FF6800]/20 border border-[#FF6800]/40'
                }`}>
                  {quality.allOptimal
                    ? <CheckCircle2 size={26} className="text-emerald-400" />
                    : <TrendingUp size={26} className="text-[#FF6800]" />}
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF6800] mb-1">Votre formule optimisée</p>
                  <h2 className="font-black text-white text-2xl md:text-3xl tracking-tight">
                    {quality.allOptimal ? 'Formule optimisée' : 'Formule générée'}
                  </h2>
                  <p className="text-white/70 text-sm font-medium mt-1">
                    {selectedReq.species} · <span className="font-black text-[#FF6800]">{selectedReq.stage}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 print:hidden">
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Score qualité</p>
                  <p className={`text-4xl font-black ${score >= 85 ? 'text-emerald-400' : score >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
                    {score}<span className="text-base text-white/40">/100</span>
                  </p>
                </div>
                <div className={`px-3 py-2 rounded-2xl border ${
                  inRangeCount === totalNutrients
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-[#FF6800]/20 border-[#FF6800]/40 text-[#FF8533]'
                }`}>
                  <p className="text-2xl font-black">{inRangeCount}<span className="text-sm opacity-60">/{totalNutrients}</span></p>
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-80">Dans plage</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Coût / tonne', value: `${costPerTonne} F` },
                { label: 'Coût / 100 kg', value: `${costPer100kg.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} F` },
                { label: `Pour ${batchKg} kg`, value: `${costForBatch} F` },
              ].map(c => (
                <div key={c.label} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#FF6800] mb-1">{c.label}</p>
                  <p className="text-xl font-black text-white">{c.value}</p>
                </div>
              ))}
            </div>

            {/* Batch + actions */}
            <div className="flex flex-col md:flex-row gap-3 print:hidden">
              <div className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-4 py-3 flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6800] shrink-0">Lot</span>
                <div className="flex flex-1 gap-1">
                  {[25, 50, 100, 200, 500].map(qty => (
                    <button key={qty} onClick={() => setBatchKg(qty)}
                      className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                        batchKg === qty
                          ? 'bg-[#FF6800] text-white shadow-lg shadow-[#FF6800]/30'
                          : 'bg-[#0A0A0A] text-white/60 hover:bg-[#2A2A2A] border border-[#2A2A2A]'
                      }`}
                    >{qty} kg</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap md:flex-nowrap">
                <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-3 bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                  {copiedOk ? <Check size={13} /> : <Copy size={13} />} {copiedOk ? 'Copié' : 'Copier'}
                </button>
                <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-3 bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                  <Printer size={13} /> Imprimer
                </button>
                <button onClick={handleSaveFormula} disabled={isSaving}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg ${
                    savedOk ? 'bg-emerald-500 text-white shadow-emerald-500/30' :
                    isSaving ? 'bg-[#2A2A2A] text-white/40 cursor-wait' :
                    'bg-[#FF6800] hover:bg-[#FF8533] text-white shadow-[#FF6800]/30'
                  }`}
                >
                  {savedOk ? <Check size={13} /> : isSaving ? <RotateCcw size={13} className="animate-spin" /> : <Save size={13} />}
                  {savedOk ? 'Enregistré !' : isSaving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
                <button onClick={() => setOptimizedResult(null)} className="flex items-center gap-2 px-4 py-3 bg-[#0A0A0A] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                  <RotateCcw size={13} /> Nouveau
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 print:hidden">
              <input type="text" value={formulaName} onChange={e => setFormulaName(e.target.value)}
                placeholder={`Nom de la formule…`}
                className="flex-1 px-4 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-sm text-white placeholder:text-white/30 font-medium focus:outline-none focus:bg-[#0A0A0A] focus:border-[#FF6800] transition"
              />
            </div>
            {saveError && <p className="text-xs text-red-300 mt-2 flex items-center gap-2"><AlertTriangle size={12} /> {saveError}</p>}
          </div>
        </div>

        <OptimalSummary totals={totals} req={selectedReq} />

        <AIAnalysisPanel result={optimizedResult} req={selectedReq} score={score} onNoCredits={onTrialExhausted} />

        {/* Tableau ingrédients */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Recette de fabrication</h3>
              <p className="text-xs text-white/40 font-medium mt-1">Quantités pour {batchKg} kg de mélange</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2A2A2A] text-left">
                  <th className="py-2 px-3 font-black text-[10px] text-[#FF6800] uppercase tracking-widest">Ingrédient</th>
                  <th className="py-2 px-3 font-black text-[10px] text-[#FF6800] uppercase tracking-widest text-right">%</th>
                  <th className="py-2 px-3 font-black text-[10px] text-[#FF6800] uppercase tracking-widest text-right">Qté ({batchKg} kg)</th>
                  <th className="py-2 px-3 font-black text-[10px] text-[#FF6800] uppercase tracking-widest text-right">Prix (F/kg)</th>
                  <th className="py-2 px-3 font-black text-[10px] text-[#FF6800] uppercase tracking-widest text-right">Sous-total</th>
                </tr>
              </thead>
              <tbody>
                {optimizedResult.filter(i => i.quantity > 0.01).map(ing => {
                  const kgForBatch = (ing.quantity * batchKg) / 100
                  const subTotal = kgForBatch * (ing.price || 0)
                  const isUserPrice = userPrices[ing.id] !== undefined
                  return (
                    <tr key={ing.id} className="border-b border-[#2A2A2A] hover:bg-[#FF6800]/5">
                      <td className="py-3 px-3 font-bold text-white">{ing.name}</td>
                      <td className="py-3 px-3 text-right font-bold text-white/60">{ing.quantity.toFixed(2)} %</td>
                      <td className="py-3 px-3 text-right font-black text-[#FF6800]">{kgForBatch.toFixed(2)} <span className="text-xs text-white/40 font-medium">kg</span></td>
                      <td className="py-3 px-3 text-right print:hidden">
                        <div className="flex items-center justify-end gap-1">
                          <input type="number" min="0" step="10" value={ing.price || 0}
                            onChange={e => updateUserPrice(ing.id, parseFloat(e.target.value) || 0)}
                            className={`w-20 px-2 py-1 text-right text-xs font-bold rounded-lg border outline-none focus:ring-2 focus:ring-[#FF6800] transition ${
                              isUserPrice
                                ? 'border-[#FF6800]/40 bg-[#FF6800]/10 text-[#FF6800]'
                                : 'border-[#2A2A2A] bg-[#0A0A0A] text-white/60'
                            }`}
                          />
                          <span className="text-xs text-white/40 font-medium">F</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-white/70 text-xs">{subTotal.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} F</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="bg-[#FF6800]/10 border-t-2 border-[#FF6800]/30">
                  <td className="py-3 px-3 font-black text-white text-sm">TOTAL</td>
                  <td className="py-3 px-3 text-right font-black text-white">100 %</td>
                  <td className="py-3 px-3 text-right font-black text-[#FF6800]">{batchKg} kg</td>
                  <td className="py-3 px-3"></td>
                  <td className="py-3 px-3 text-right font-black text-white text-sm">{costForBatch} F</td>
                </tr>
              </tfoot>
            </table>
          </div>
          {Object.keys(userPrices).length > 0 && (
            <div className="mt-4 flex items-center justify-between p-3 bg-[#0A0A0A] rounded-2xl border border-[#2A2A2A]">
              <p className="text-xs text-white/60 font-medium">
                <strong className="text-[#FF6800]">{Object.keys(userPrices).length} prix personnalisé{Object.keys(userPrices).length > 1 ? 's' : ''}</strong> — sauvegardés dans votre navigateur
              </p>
              <button onClick={resetUserPrices} className="text-[10px] font-black text-white/40 hover:text-red-400 uppercase tracking-widest flex items-center gap-1 transition-all">
                <RotateCcw size={11} /> Réinitialiser
              </button>
            </div>
          )}
          <details className="mt-6">
            <summary className="text-xs font-black text-white/60 uppercase tracking-widest cursor-pointer hover:text-white">
              ✏️ Modifier manuellement les quantités
            </summary>
            <div className="mt-4">
              <IngredientTable selectedIngredients={optimizedResult} onUpdateIngredients={setOptimizedResult} />
            </div>
          </details>
        </div>
      </div>
    )
  }

  // ── FORMULAIRE ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6800] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-md shadow-[#FF6800]/30">
          <Sparkles size={12} /> Mode Générateur
        </span>
        <span className="text-[10px] font-bold text-[#FF6800] uppercase tracking-widest">
          1 crédit par génération
        </span>
      </div>

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#1A1A1A] via-[#0A0A0A] to-[#1A1A1A] rounded-3xl p-8 overflow-hidden text-white shadow-xl border border-[#FF6800]/30">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-56 h-56 bg-[#FF6800]/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FF6800]/15 border border-[#FF6800]/30 rounded-2xl flex items-center justify-center">
              <Wand2 size={24} className="text-[#FF6800]" />
            </div>
            <div>
              <p className="text-[10px] font-black text-[#FF6800] uppercase tracking-[0.2em] mb-1">Générateur automatique</p>
              <h2 className="text-2xl font-black tracking-tight">La meilleure formule au meilleur coût</h2>
              <p className="text-white/80 text-sm font-medium mt-0.5">Qualité nutritionnelle respectée · Analyse détaillée incluse</p>
            </div>
          </div>
          <div className="shrink-0 flex flex-col items-center bg-[#FF6800]/10 border border-[#FF6800]/20 rounded-2xl px-6 py-4">
            <p className={`text-2xl font-black ${credits > 0 ? 'text-white' : 'text-red-400'}`}>{credits}</p>
            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">
              {credits > 1 ? 'Crédits restants' : credits === 1 ? 'Crédit restant' : 'Crédits épuisés'}
            </p>
            {credits === 0 && (
              <Link to="/pricing" className="mt-2 text-[10px] font-black text-[#FF6800] underline hover:text-[#FF8533]">
                + Recharger
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8 shadow-sm space-y-6">
        <h3 className="text-sm font-black text-[#FF6800] uppercase tracking-widest">Informations de base</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] font-black text-white/40 uppercase tracking-widest mb-2">Nom de la formule</label>
            <input type="text" value={formulaName} onChange={e => setFormulaName(e.target.value)}
              placeholder="Ex: Poulet de chair lot A"
              className="w-full px-5 py-4 rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] font-bold text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6800] focus:border-[#FF6800] placeholder-white/30 transition"
            />
          </div>
          <div>
            <label className="block text-[11px] font-black text-white/40 uppercase tracking-widest mb-2">Espèce &amp; Phase</label>
            <select value={selectedReqId} onChange={e => setSelectedReqId(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] font-bold text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6800] focus:border-[#FF6800] transition appearance-none cursor-pointer"
            >
              {Object.entries(speciesGroups).map(([species, reqs]) => (
                <optgroup key={species} label={species} className="bg-[#1A1A1A]">
                  {reqs.map(r => <option key={r.id} value={r.id} className="bg-[#1A1A1A]">{r.stage} · {r.ageRange}</option>)}
                </optgroup>
              ))}
            </select>
            <div className="mt-3 flex items-start gap-2 px-4 py-2.5 bg-[#FF6800]/10 border border-[#FF6800]/20 rounded-xl">
              <CheckCircle2 size={14} className="text-[#FF6800] shrink-0 mt-0.5" />
              <p className="text-[10px] text-[#FF8533]/80 font-medium">
                EM {selectedReq.em.min}–{selectedReq.em.max} kcal/kg · PB {selectedReq.pb.min}–{selectedReq.pb.max}% · Ca {selectedReq.ca.min}–{selectedReq.ca.max}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sélection ingrédients */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8 shadow-sm text-left">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-black text-[#FF6800] uppercase tracking-widest">Ingrédients en stock</h3>
            <p className="text-[11px] text-white/40 mt-1">Sélectionnez les matières disponibles — les proportions sont calculées automatiquement.</p>
          </div>
          <span className="px-4 py-1.5 bg-[#FF6800]/10 border border-[#FF6800]/30 text-[#FF8533] rounded-xl text-[10px] font-black uppercase">
            {checkedIds.size} sélectionnés
          </span>
        </div>

        <div className="relative mb-5">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher un ingrédient…"
            className="w-full pl-11 pr-11 py-3 rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] text-sm font-medium text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FF6800] focus:border-[#FF6800] transition"
          />
          {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"><X size={16} /></button>}
        </div>

        {filteredIngredients.length === 0 ? (
          <div className="text-center py-8 text-white/40 text-sm font-medium">Aucun ingrédient trouvé pour "{searchQuery}"</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredIngredients.map(ing => {
              const isChecked = checkedIds.has(ing.id)
              return (
                <button key={ing.id} onClick={() => toggleIngredient(ing.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    isChecked
                      ? 'border-[#FF6800] bg-[#FF6800]/10 ring-4 ring-[#FF6800]/10'
                      : 'border-[#2A2A2A] bg-[#0A0A0A] hover:border-[#FF6800]/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className={`font-black text-sm leading-tight ${isChecked ? 'text-white' : 'text-white/70'}`}>{ing.name}</p>
                    {isChecked && <div className="w-5 h-5 rounded-full bg-[#FF6800] flex items-center justify-center shrink-0"><Check size={11} className="text-white" strokeWidth={3} /></div>}
                  </div>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${CAT[ing.category] ?? 'bg-[#1A1A1A] border-[#2A2A2A] text-white/40'}`}>{ing.category}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Bouton générer */}
      <div className="relative">
        {canGenerate && credits > 0 && (
          <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6800] via-[#FF8533] to-[#FF6800] rounded-3xl blur-lg opacity-60 animate-pulse" aria-hidden="true" />
        )}
        <button
          onClick={handleOptimize}
          disabled={!canGenerate}
          className={`relative w-full py-8 rounded-3xl font-black text-base md:text-lg uppercase tracking-widest transition-all shadow-2xl border-2 ${
            !canGenerate ? 'bg-[#2A2A2A] text-white/30 border-[#2A2A2A] cursor-not-allowed' :
            credits === 0 ? 'bg-gradient-to-r from-red-600 to-red-500 text-white border-red-400 hover:from-red-500 hover:to-red-400 hover:scale-[1.02] shadow-red-500/40 active:scale-95' :
            'bg-gradient-to-r from-[#FF6800] via-[#FF8533] to-[#FF6800] text-white border-[#FF6800] hover:scale-[1.02] shadow-[#FF6800]/50 active:scale-95'
          }`}
        >
          {isOptimizing ? (
            <span className="flex items-center justify-center gap-3"><RotateCcw className="animate-spin" size={24} /> Optimisation en cours…</span>
          ) : credits === 0 ? (
            <span className="flex items-center justify-center gap-3"><CreditCard size={22} /> Recharger pour continuer →</span>
          ) : (
            <span className="flex items-center justify-center gap-3">
              <Sparkles size={24} className="animate-pulse" />
              <span className="drop-shadow-md">Générer la formule optimale</span>
              <Wand2 size={24} />
            </span>
          )}
        </button>
        {canGenerate && credits > 0 && (
          <p className="text-center text-xs font-bold text-[#FF6800] mt-3">
            ✨ Phase : <span className="text-white">{selectedReq.stage}</span> · {checkedIds.size} ingrédient{checkedIds.size > 1 ? 's' : ''} · <strong>1 crédit sera consommé</strong>
          </p>
        )}
        {!canGenerate && checkedIds.size < 2 && (
          <p className="text-center text-xs font-bold text-white/50 mt-3 flex items-center justify-center gap-2">
            <AlertTriangle size={13} /> Coche au moins 2 ingrédients pour activer le bouton
          </p>
        )}
      </div>

      {credits === 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/pricing" className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#FF6800] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#FF8533] transition-all text-center shadow-lg shadow-[#FF6800]/30">
            <Star size={14} fill="currentColor" /> Recharger des crédits
          </Link>
          <Link to="/dashboard" className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#1A1A1A] border border-[#2A2A2A] text-white/60 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#2A2A2A] transition-all text-center">
            <Gift size={14} /> Parrainer pour +1 crédit
          </Link>
        </div>
      )}
    </div>
  )
}