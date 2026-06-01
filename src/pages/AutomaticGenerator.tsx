import { useState, useMemo } from 'react'
import {
  Wand2, CheckCircle2, Star, RotateCcw, Gift,
  Sparkles, AlertTriangle, TrendingUp, Save, Printer, Copy, Search, X, Check,
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

// ─── STYLES CATÉGORIES (DARK) ────────────────────────────────────────────────

const CAT: Record<string, string> = {
  'Céréale':    'bg-amber-500/10 border-amber-500/30 text-amber-300',
  'Protéine':   'bg-blue-500/10 border-blue-500/30 text-blue-300',
  'Minéral':    'bg-purple-500/10 border-purple-500/30 text-purple-300',
  'Complément': 'bg-pink-500/10 border-pink-500/30 text-pink-300',
}

// ─── BILAN NUTRITIONNEL (DARK) ──────────────────────────────────────────────

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
          const halfRange = plage / 2
          const isCentered = Math.abs(n.value - center) <= halfRange * 0.80

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
                <div
                  className="absolute top-0 h-full bg-emerald-500/20 rounded-full"
                  style={{ left: '10%', width: '80%' }}
                />
                <div
                  className={`absolute top-0 h-full rounded-full transition-all duration-700 ${barColor}`}
                  style={{ width: `${Math.max(pct, 6)}%` }}
                />
                <div className="absolute top-0 h-full w-0.5 bg-white/40" style={{ left: '50%' }} />
              </div>

              <div className="flex justify-between mt-1">
                <p className="text-[9px] font-bold opacity-50">Min: {n.min.toFixed(n.decimals)}</p>
                <p className="text-[9px] font-bold opacity-50">Ctr: {center.toFixed(n.decimals)}</p>
                <p className="text-[9px] font-bold opacity-50">Max: {n.max.toFixed(n.decimals)}</p>
              </div>

              {isCentered && inRange && (
                <p className="text-[9px] font-black text-emerald-400 mt-1">✓ Zone optimale</p>
              )}
              {!isCentered && inRange && (
                <p className="text-[9px] font-black text-amber-400 mt-1">~ Acceptable (hors centre)</p>
              )}
              {!inRange && (
                <p className="text-[9px] font-black text-red-400 mt-1">✗ Hors plage</p>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 pt-4 border-t border-[#2A2A2A]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-white/50 font-bold">Optimal (zone centrale 80%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="text-[10px] text-white/50 font-bold">Acceptable (dans la plage, hors centre)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <span className="text-[10px] text-white/50 font-bold">Hors plage réglementaire</span>
        </div>
      </div>
    </div>
  )
}

// ─── ANALYSE IA PANEL (DARK) ─────────────────────────────────────────────────

interface AIAnalysisProps {
  result: SelectedIngredient[]
  req: AnimalRequirement
  score: number
}

function AIAnalysisPanel({ result, req, score }: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<string>('')
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(false)

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
      const distance = Math.abs(value - center)
      const rel = range > 0 ? (value - center) / (range / 2) : 0
      const position: 'low' | 'center' | 'high' =
        rel < -0.5 ? 'low' : rel > 0.5 ? 'high' : 'center'
      return { key, label, value, min, max, unit, center, distance, position }
    }
    const nutrients: NutInfo[] = [
      buildNut('em',  'Énergie métabolisable', final.em,  req.em.min,  req.em.max,  'kcal/kg'),
      buildNut('pb',  'Protéines brutes',      final.pb,  req.pb.min,  req.pb.max,  '%'),
      buildNut('lys', 'Lysine',                 final.lys, req.lys.min, req.lys.max, '%'),
      buildNut('met', 'Méthionine',             final.met, req.met.min, req.met.max, '%'),
      buildNut('ca',  'Calcium',                final.ca,  req.ca.min,  req.ca.max,  '%'),
      buildNut('p',   'Phosphore',              final.p,   req.p.min,   req.p.max,   '%'),
    ]

    const eps = (n: NutInfo) => Math.max((n.max - n.min) * 0.005, 0.005)
    const inRange = nutrients.filter(n => n.value >= n.min - eps(n) && n.value <= n.max + eps(n))
    const tooLow  = nutrients.filter(n => n.value < n.min - eps(n))
    const tooHigh = nutrients.filter(n => n.value > n.max + eps(n))
    const optimal = inRange.filter(n => {
      const half = (n.max - n.min) / 2
      return half > 0 && Math.abs(n.value - n.center) / half <= 0.5
    })
    const offCenter = inRange.filter(n => !optimal.includes(n))

    const fmt = (n: NutInfo) => `${n.value.toFixed(n.unit === '%' ? 2 : 0)}${n.unit}`
    const targetStr = (n: NutInfo) => `cible ${n.center.toFixed(n.unit === '%' ? 2 : 0)}${n.unit}`

    const totalKg = result.reduce((s, i) => s + i.quantity, 0) || 100
    const dominance = (id: string) => {
      const ing = result.find(i => i.id === id)
      return ing ? (ing.quantity / totalKg) * 100 : 0
    }
    const has = (id: string) => result.some(i => i.id === id && i.quantity > 0.5)
    const maisPct = dominance('mais')
    const tsPct = dominance('tourteau_soja')
    const sojaGrainePct = dominance('soja_graine')
    const sonBlePct = dominance('son_ble')
    const coquillePct = dominance('coquille_huitre')

    let txt = ''

    txt += '**Verdict global**\n\n'
    if (tooLow.length === 0 && tooHigh.length === 0) {
      if (optimal.length === nutrients.length) {
        txt += `Excellente formule pour ${req.species.toLowerCase()} en phase ${req.stage.toLowerCase()}. Les 6 nutriments sont non seulement dans les plages Goliath mais aussi centrés au cœur de la zone idéale. Tu peux fabriquer en confiance.\n\n`
      } else if (optimal.length >= 4) {
        txt += `Bonne formule pour ${req.species.toLowerCase()} en phase ${req.stage.toLowerCase()}. ${optimal.length} nutriments sur 6 sont bien centrés. Les ${offCenter.length} autres sont dans la plage mais proches d'une borne — des ajustements simples permettraient de les recentrer.\n\n`
      } else {
        txt += `Formule acceptable pour ${req.species.toLowerCase()} en phase ${req.stage.toLowerCase()}. Tous les nutriments respectent les plages Goliath, mais ${offCenter.length} sont proches des bornes (${offCenter.map(n => n.label.toLowerCase().split(' ')[0]).join(', ')}). Les ajustements ci-dessous amélioreraient la marge de sécurité et le confort digestif.\n\n`
      }
    } else {
      txt += `Formule à ajuster avant utilisation. ${tooLow.length + tooHigh.length} nutriment(s) sortent des plages recommandées : ${[...tooLow, ...tooHigh].map(n => n.label.toLowerCase().split(' ')[0]).join(', ')}. Voir les corrections obligatoires ci-dessous.\n\n`
    }

    if (optimal.length > 0) {
      txt += '**Points forts**\n\n'
      for (const n of optimal) {
        txt += `- ${n.label} : ${fmt(n)} — parfaitement centré dans la plage (${n.min}-${n.max}${n.unit}).\n`
      }
      txt += '\n'
    }

    if (tooLow.length > 0 || tooHigh.length > 0) {
      txt += '**Corrections obligatoires**\n\n'

      for (const n of tooLow) {
        const gap = ((n.min - n.value) / n.min * 100).toFixed(0)
        txt += `- **${n.label} trop bas** (${fmt(n)}, il manque ${gap}%). `
        if (n.key === 'pb')       txt += `Augmente le tourteau de soja de 2-3 kg pour 100 kg, ou remplace une partie du maïs par du soja graine (37% PB).\n`
        else if (n.key === 'em')  txt += `Ajoute 1-2 kg de soja graine (3900 kcal/kg) ou 0,5 kg d'huile rouge (8800 kcal/kg) pour 100 kg.\n`
        else if (n.key === 'ca')  txt += `Augmente la coquille d'huître de 1 à 2 kg pour 100 kg (38% Ca).\n`
        else if (n.key === 'p')   txt += `Ajoute 0,5 à 1 kg de phosphate bicalcique (18% P) ou 2-3 kg de farine de poisson.\n`
        else if (n.key === 'lys') txt += `Ajoute 0,1 à 0,2 kg de lysine HCl synthétique pour 100 kg (très efficace, faible coût).\n`
        else if (n.key === 'met') txt += `Ajoute 0,05 à 0,15 kg de DL-méthionine pour 100 kg.\n`
      }

      for (const n of tooHigh) {
        const excess = ((n.value - n.max) / n.max * 100).toFixed(0)
        txt += `- **${n.label} trop élevé** (${fmt(n)}, ${excess}% au-dessus du max). `
        if (n.key === 'pb')       txt += `Réduis le tourteau de soja de 2-3 kg, compense avec du maïs ou du sorgho.\n`
        else if (n.key === 'em')  txt += `Réduis l'huile et le soja graine, augmente le son de blé (1650 kcal/kg).\n`
        else if (n.key === 'ca')  txt += `Réduis la coquille d'huître. Un excès de calcium bloque l'absorption du phosphore et du zinc, et cause des problèmes de pattes chez les jeunes.\n`
        else if (n.key === 'p')   txt += `Réduis le phosphate bicalcique. Le tourteau de soja apporte déjà 0,7% P et la farine de poisson 2,5%.\n`
        else if (n.key === 'lys') txt += `Diversifie les sources de protéines : remplace 5-10% du tourteau de soja par du tourteau de palmiste (1,75% Lys) ou de coton (4,25% Lys).\n`
        else if (n.key === 'met') txt += `Réduis la méthionine synthétique si tu en ajoutes, ou réduis la farine de poisson.\n`
      }
      txt += '\n'
    }

    const suggestions: string[] = []

    for (const n of offCenter) {
      if (n.position === 'high') {
        if (n.key === 'em' && (sojaGrainePct > 12 || maisPct > 55)) {
          suggestions.push(`**Énergie proche du plafond** (${fmt(n)}, ${targetStr(n)}). Réduis le soja graine de 1-2 kg ou substitue 3-5 kg de maïs par du son de blé pour redescendre vers le centre.`)
        } else if (n.key === 'pb' && tsPct > 22) {
          suggestions.push(`**Protéines proches du plafond** (${fmt(n)}, ${targetStr(n)}). Tu as ${tsPct.toFixed(0)}% de tourteau de soja — descendre à 18-20% recentrerait la PB tout en faisant baisser le coût.`)
        } else if (n.key === 'ca' && coquillePct > 3) {
          suggestions.push(`**Calcium proche du plafond** (${fmt(n)}, ${targetStr(n)}). Réduis la coquille d'huître de 0,5 à 1 kg — le calcium en excès en phase démarrage/croissance peut perturber l'absorption du phosphore.`)
        } else if (n.key === 'lys' && tsPct > 20) {
          suggestions.push(`**Lysine proche du plafond** (${fmt(n)}, ${targetStr(n)}). Pas dangereux mais signe que ton mélange est riche en soja — tu peux remplacer 3-5 kg de tourteau de soja par du tourteau de palmiste pour économiser sans perdre en croissance.`)
        } else if (n.key === 'p') {
          suggestions.push(`**Phosphore proche du plafond** (${fmt(n)}, ${targetStr(n)}). Réduis le phosphate bicalcique de 0,3-0,5 kg si tu en mets — le P en excès se retrouve dans les fientes et pollue.`)
        } else {
          suggestions.push(`**${n.label} proche du plafond** (${fmt(n)}, ${targetStr(n)}). Recommandation : viser le centre de la plage pour une marge de sécurité.`)
        }
      } else if (n.position === 'low') {
        if (n.key === 'em') {
          suggestions.push(`**Énergie proche du plancher** (${fmt(n)}, ${targetStr(n)}). Ajoute 1-2 kg de soja graine ou 0,3-0,5 kg d'huile rouge pour remonter vers le centre.`)
        } else if (n.key === 'pb') {
          suggestions.push(`**Protéines proches du plancher** (${fmt(n)}, ${targetStr(n)}). Augmente le tourteau de soja de 1-2 kg, ou ajoute 2-3 kg de farine de poisson pour booster aussi la lysine et la méthionine.`)
        } else if (n.key === 'lys') {
          suggestions.push(`**Lysine proche du plancher** (${fmt(n)}, ${targetStr(n)}). Ajoute 0,05-0,1 kg de lysine synthétique — investissement minime, gros impact sur la croissance.`)
        } else if (n.key === 'met') {
          suggestions.push(`**Méthionine proche du plancher** (${fmt(n)}, ${targetStr(n)}). Ajoute 0,03-0,08 kg de DL-méthionine. Limitant en aviculture, ça paie toujours.`)
        } else if (n.key === 'ca') {
          suggestions.push(`**Calcium proche du plancher** (${fmt(n)}, ${targetStr(n)}). Ajoute 0,3-0,7 kg de coquille d'huître pour des os solides.`)
        } else if (n.key === 'p') {
          suggestions.push(`**Phosphore proche du plancher** (${fmt(n)}, ${targetStr(n)}). Ajoute 0,2-0,4 kg de phosphate bicalcique.`)
        }
      }
    }

    if (maisPct > 60) {
      suggestions.push(`**Maïs très dominant** (${maisPct.toFixed(0)}%). Une trop forte part d'une seule céréale rend la formule vulnérable aux variations de qualité (aflatoxines, prix). Essaie de remplacer 10-15 kg de maïs par du sorgho ou du son de blé.`)
    }
    if (tsPct > 30) {
      suggestions.push(`**Tourteau de soja très dominant** (${tsPct.toFixed(0)}%). Le soja est cher et seul, il déséquilibre les acides aminés. Remplace 5-8 kg par du tourteau de palmiste ${has('farine_poisson') ? '' : 'ou ajoute 2-3 kg de farine de poisson '}pour un meilleur profil.`)
    }
    if (!has('farine_poisson') && (req.stage.toLowerCase().includes('démarrage') || req.stage.toLowerCase().includes('croissance'))) {
      suggestions.push(`**Pas de farine de poisson dans la formule**. En démarrage/croissance, 2-4 kg de farine de poisson améliorent fortement le profil en lysine, méthionine, calcium et phosphore en un seul ingrédient.`)
    }
    if (!has('premix') && !has('cmv') && !has('concentre_chair') && !has('concentre_ponte')) {
      suggestions.push(`**Pas de prémix (CMV) détecté**. Les vitamines et oligoéléments sont indispensables — ajoute 0,25-0,5 kg de prémix pour 100 kg sinon les performances chuteront même avec un bon profil EM/PB.`)
    }
    if (sonBlePct > 18) {
      suggestions.push(`**Son de blé un peu élevé** (${sonBlePct.toFixed(0)}%). En démarrage, dépasser 15% peut diluer trop l'énergie et causer des fientes molles. Réduis à 10-12 kg si tu es en phase démarrage.`)
    }

    if (suggestions.length > 0) {
      txt += '**Suggestions d\'amélioration**\n\n'
      for (const s of suggestions) {
        txt += `- ${s}\n`
      }
      txt += '\n'
    }

    txt += '**Conseil pratique terrain**\n\n'
    const stage = req.stage.toLowerCase()
    if (stage.includes('démarrage')) {
      txt += `À cet âge, les poussins doivent manger souvent. Distribue 5 à 6 petits repas par jour plutôt qu'un seul gros, garde l'eau toujours propre et fraîche, et maintiens la température entre 32-35°C la première semaine. Le démarrage conditionne toute la performance future — ne lésine pas sur la qualité du prémix.`
    } else if (stage.includes('croissance') && req.species.toLowerCase().includes('chair')) {
      txt += `En croissance chair, contrôle le poids hebdomadaire (pèse 10 sujets au hasard). L'objectif est ~1,8-2 kg à 8 semaines pour la souche Goliath. Si tu décroches, augmente l'énergie (soja graine, huile) plutôt que la protéine.`
    } else if (stage.includes('croissance')) {
      txt += `En croissance ponte, ne pousse pas l'énergie. L'objectif est une poulette en bonne santé qui grandit régulièrement, pas une poulette grasse. Vérifie le poids vif chaque semaine.`
    } else if (stage.includes('poulette')) {
      txt += `La poulette doit grandir sans s'engraisser. Évite les rations trop énergétiques (max 2800 kcal/kg). Une poulette grasse pond mal et se casse au démarrage de la ponte. Distribue la ration en quantité contrôlée plutôt qu'à volonté.`
    } else if (stage.includes('ponte')) {
      txt += `Pour des œufs à coquille solide, distribue le calcium en 2 fois : 1/3 le matin (poudre fine), 2/3 le soir (gros grain). Les poules absorbent mieux le calcium la nuit, au moment de la formation de la coquille. Surveille la couleur du jaune — si pâle, ajoute 0,5 kg d'huile rouge.`
    } else {
      txt += `Stocke tes matières premières au sec et à l'abri des rongeurs. Vérifie l'absence de moisissures (aflatoxines) sur le maïs et le tourteau d'arachide avant chaque fabrication — c'est la cause #1 de chute des performances.`
    }

    return txt
  }

  const runAnalysis = async () => {
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
      'Verdict global':            { color: 'text-white',         bg: 'bg-[#0A0A0A]',           border: 'border-[#2A2A2A]',          icon: '📋' },
      'Points forts':              { color: 'text-emerald-300',   bg: 'bg-emerald-500/10',      border: 'border-emerald-500/30',     icon: '✨' },
      'Corrections obligatoires':  { color: 'text-red-300',       bg: 'bg-red-500/10',          border: 'border-red-500/30',         icon: '⚠️' },
      "Suggestions d'amélioration":{ color: 'text-amber-300',     bg: 'bg-amber-500/10',        border: 'border-amber-500/30',       icon: '💡' },
      'Conseil pratique terrain':  { color: 'text-cyan-300',      bg: 'bg-cyan-500/10',         border: 'border-cyan-500/30',        icon: '🌾' },
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
                  return (
                    <div
                      key={j}
                      className={`text-sm leading-relaxed text-white/80 ${isBullet ? 'pl-4 relative' : ''}`}
                    >
                      {isBullet && (
                        <span className={`absolute left-0 top-2 w-1.5 h-1.5 rounded-full ${
                          cfg.color === 'text-emerald-300' ? 'bg-emerald-400' :
                          cfg.color === 'text-red-300' ? 'bg-red-400' :
                          cfg.color === 'text-amber-300' ? 'bg-amber-400' :
                          cfg.color === 'text-cyan-300' ? 'bg-cyan-400' : 'bg-white/40'
                        }`} />
                      )}
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
    <div className="bg-gradient-to-br from-purple-950/40 via-[#1A1A1A] to-violet-950/40 border border-purple-500/30 rounded-3xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
            <Sparkles size={16} className="text-purple-400" />
          </div>
          <div>
            <h3 className="font-black text-purple-300 text-sm uppercase tracking-widest">Analyse IA</h3>
            <p className="text-[11px] text-purple-400/70 font-medium">Recommandations personnalisées par intelligence artificielle</p>
          </div>
        </div>

        {!done && (
          <button
            onClick={runAnalysis}
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${
              loading
                ? 'bg-[#2A2A2A] text-white/40 cursor-wait'
                : 'bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-500 hover:to-violet-500 shadow-lg shadow-purple-500/30'
            }`}
          >
            {loading ? (
              <>
                <RotateCcw size={13} className="animate-spin" /> Analyse en cours…
              </>
            ) : (
              <>
                <Sparkles size={13} /> Analyser cette formule
              </>
            )}
          </button>
        )}

        {done && (
          <button
            onClick={runAnalysis}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest bg-[#1A1A1A] border border-[#2A2A2A] text-white/60 hover:bg-[#2A2A2A] transition-all"
          >
            <RotateCcw size={12} /> Relancer
          </button>
        )}
      </div>

      {!analysis && !loading && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-16 h-16 bg-purple-500/20 border border-purple-500/30 rounded-2xl flex items-center justify-center mb-4">
            <Sparkles size={28} className="text-purple-400" />
          </div>
          <p className="font-black text-white mb-1">Analyse IA disponible</p>
          <p className="text-sm text-white/40 max-w-xs">
            Cliquez sur "Analyser cette formule" pour obtenir un diagnostic nutritionnel détaillé
            et des conseils personnalisés.
          </p>

          <div className={`mt-6 px-6 py-3 rounded-2xl border ${
            score >= 90 ? 'bg-emerald-500/10 border-emerald-500/30' :
            score >= 70 ? 'bg-amber-500/10 border-amber-500/30' :
            'bg-red-500/10 border-red-500/30'
          }`}>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1 text-white/50">Score actuel</p>
            <p className={`text-4xl font-black ${score >= 90 ? 'text-emerald-400' : score >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
              {score}<span className="text-lg">/100</span>
            </p>
            <p className="text-[11px] font-bold mt-1 text-white/60">
              {score >= 90 ? '🌟 Excellent — formule très bien centrée' :
               score >= 70 ? '✅ Bon — quelques ajustements possibles' :
               '⚠️ Des améliorations importantes sont possibles'}
            </p>
          </div>
        </div>
      )}

      {(analysis || loading) && (
        <div className="relative">
          {loading && !analysis && (
            <div className="flex flex-col items-center justify-center py-12 px-6 bg-purple-500/5 rounded-2xl border border-purple-500/20">
              <div className="relative">
                <div className="w-14 h-14 bg-[#1A1A1A] rounded-2xl shadow-lg flex items-center justify-center mb-3 border border-purple-500/30">
                  <Sparkles size={24} className="text-purple-400 animate-pulse" />
                </div>
                <div className="absolute -inset-1 bg-purple-400/20 rounded-2xl animate-ping" />
              </div>
              <span className="font-black text-sm text-purple-300 uppercase tracking-widest">L'IA analyse votre formule</span>
              <span className="text-xs text-purple-400/70 mt-1 font-medium">Diagnostic nutritionnel en cours…</span>
            </div>
          )}

          {analysis && formatAnalysis(analysis)}

          {loading && analysis && (
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold mt-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse [animation-delay:200ms]" />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse [animation-delay:400ms]" />
            </div>
          )}

          {done && (
            <div className="mt-4 pt-4 border-t border-purple-500/20 flex items-center gap-2 text-[10px] text-purple-400/70 font-bold">
              <CheckCircle2 size={12} className="text-emerald-400" />
              Analyse générée localement à partir des plages Goliath — vérifiez avec un nutritionniste pour des décisions critiques.
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
  const { subscription, incrementAutoCount } = useSubscription()
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
    } catch {
      return {}
    }
  })

  const updateUserPrice = (ingredientId: string, price: number) => {
    setUserPrices(prev => {
      const next = { ...prev, [ingredientId]: price }
      try {
        localStorage.setItem('provende_user_prices', JSON.stringify(next))
      } catch (e) {
        console.error('localStorage error:', e)
      }
      return next
    })
    if (optimizedResult) {
      setOptimizedResult(optimizedResult.map(ing =>
        ing.id === ingredientId ? { ...ing, price } : ing
      ))
    }
  }

  const resetUserPrices = () => {
    if (!window.confirm('Supprimer tous tes prix personnalisés et revenir aux prix par défaut ?')) return
    setUserPrices({})
    try {
      localStorage.removeItem('provende_user_prices')
    } catch (e) {
      console.error('localStorage error:', e)
    }
    if (optimizedResult) {
      setOptimizedResult(optimizedResult.map(ing => {
        const db = ingredientsDatabase.find(i => i.id === ing.id)
        return { ...ing, price: db?.defaultPrice || 0 }
      }))
    }
  }

  const used         = subscription.autoFormulasCount || 0
  const bonus        = subscription.bonusCalculations || 0
  const totalAllowed = 9999 + bonus
  const remaining    = totalAllowed - used

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

  const handleOptimize = () => {
    if (used >= totalAllowed) { onTrialExhausted(); return }
    if (checkedIds.size < 2) return

    setIsOptimizing(true)
    setOptimizedResult(null)

    setTimeout(() => {
      const pool = ingredientsDatabase
        .filter(i => checkedIds.has(i.id))
        .map(i => ({
          ...i,
          quantity: 0,
          price: userPrices[i.id] ?? i.defaultPrice ?? 0,
        }))
      const result = optimizeFormula(pool, selectedReq)
      const resultWithPrices = result.map(ing => ({
        ...ing,
        price: userPrices[ing.id] ?? ing.price ?? ingredientsDatabase.find(i => i.id === ing.id)?.defaultPrice ?? 0,
      }))
      setOptimizedResult(resultWithPrices)
      const hasValidResult = resultWithPrices && resultWithPrices.length > 0 && resultWithPrices.some(i => i.quantity > 0.01)
      if (hasValidResult) {
        incrementAutoCount()
      }
      setIsOptimizing(false)
    }, 2200)
  }

  const canGenerate = !isOptimizing && checkedIds.size >= 2

  const filteredIngredients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const base = q
      ? ingredientsDatabase.filter(i =>
          i.name.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
        )
      : ingredientsDatabase
    return [...base].sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }))
  }, [searchQuery])

  const handleSaveFormula = async () => {
    if (!optimizedResult || !user) {
      setSaveError(!user ? 'Vous devez être connecté pour enregistrer.' : 'Aucune formule à enregistrer.')
      setTimeout(() => setSaveError(null), 3000)
      return
    }
    const name = formulaName.trim() || `${selectedReq.species} - ${selectedReq.stage} (${new Date().toLocaleDateString('fr-FR')})`

    setIsSaving(true)
    setSaveError(null)

    const totals = calculateTotals(optimizedResult)
    const costPer100kg = optimizedResult.reduce((acc, ing) => acc + (ing.price || 0) * (ing.quantity / 100), 0)

    const { error } = await supabase.from('formulas').insert([{
      user_id: user.id,
      name,
      ingredients: optimizedResult,
      nutritional_stats: totals,
      cost_per_100kg: Math.round(costPer100kg),
    }])

    setIsSaving(false)
    if (error) {
      setSaveError("Erreur lors de l'enregistrement. Réessayez.")
      console.error('save formula error:', error)
      setTimeout(() => setSaveError(null), 4000)
    } else {
      setSavedOk(true)
      setTimeout(() => setSavedOk(false), 3000)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleCopy = async () => {
    if (!optimizedResult) return
    const factor = batchKg / 100
    const lines = [
      `Formule ${selectedReq.species} - ${selectedReq.stage}`,
      `Pour ${batchKg} kg de mélange`,
      '',
      ...optimizedResult.filter(i => i.quantity > 0.01).map(i => `${i.name}: ${(i.quantity * factor).toFixed(2)} kg`),
      '',
      `Total: ${batchKg} kg`,
    ]
    const txt = lines.join('\n')
    try {
      await navigator.clipboard.writeText(txt)
      setCopiedOk(true)
      setTimeout(() => setCopiedOk(false), 2000)
    } catch (e) {
      console.error('copy failed:', e)
    }
  }

  // ── VUE RÉSULTATS (DARK) ────────────────────────────────────────────────────

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

        {/* Header résultats — DARK + ORANGE */}
        <div className="relative bg-gradient-to-br from-[#1A1A1A] via-[#0A0A0A] to-[#1A1A1A] rounded-3xl overflow-hidden text-white shadow-2xl border border-[#FF6800]/30 print:bg-white print:text-slate-900 print:shadow-none">
          <div className="absolute inset-0 pointer-events-none print:hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#FF6800]/10 rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full -ml-20 -mb-20 blur-3xl" />
          </div>

          <div className="relative z-10 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  quality.allOptimal ? 'bg-emerald-500/20 border border-emerald-500/40' : 'bg-amber-500/20 border border-amber-500/40'
                } print:bg-slate-100 print:border-slate-200`}>
                  {quality.allOptimal
                    ? <CheckCircle2 size={26} className="text-emerald-400 print:text-emerald-600" />
                    : <TrendingUp size={26} className="text-amber-400 print:text-amber-600" />
                  }
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF6800] mb-1">
                    Formule générée par IA
                  </p>
                  <h2 className="font-black text-white text-2xl md:text-3xl tracking-tight print:text-slate-900">
                    {quality.allOptimal ? 'Formule optimisée' : 'Formule générée'}
                  </h2>
                  <p className="text-white/70 text-sm font-medium mt-1 print:text-slate-600">
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
                    : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                }`}>
                  <p className="text-2xl font-black">{inRangeCount}<span className="text-sm opacity-60">/{totalNutrients}</span></p>
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-80">Dans plage</p>
                </div>
              </div>
            </div>

            {/* Coûts */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6 print:grid-cols-3">
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 print:bg-slate-50 print:border-slate-200">
                <p className="text-[9px] font-black uppercase tracking-widest text-[#FF6800] mb-1 print:text-slate-500">Coût / tonne</p>
                <p className="text-xl font-black text-white print:text-slate-900">{costPerTonne} <span className="text-xs text-white/40 font-medium">F</span></p>
              </div>
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 print:bg-slate-50 print:border-slate-200">
                <p className="text-[9px] font-black uppercase tracking-widest text-[#FF6800] mb-1 print:text-slate-500">Coût / 100 kg</p>
                <p className="text-xl font-black text-white print:text-slate-900">{costPer100kg.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} <span className="text-xs text-white/40 font-medium">F</span></p>
              </div>
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 print:bg-slate-50 print:border-slate-200">
                <p className="text-[9px] font-black uppercase tracking-widest text-[#FF6800] mb-1 print:text-slate-500">Pour {batchKg} kg</p>
                <p className="text-xl font-black text-white print:text-slate-900">{costForBatch} <span className="text-xs text-white/40 font-medium">F</span></p>
              </div>
            </div>

            {/* Convertisseur batch + Actions */}
            <div className="flex flex-col md:flex-row gap-3 print:hidden">
              <div className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-4 py-3 flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6800] shrink-0">Fabriquer</span>
                <div className="flex flex-1 gap-1">
                  {[25, 50, 100, 200, 500].map(qty => (
                    <button
                      key={qty}
                      onClick={() => setBatchKg(qty)}
                      className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                        batchKg === qty
                          ? 'bg-[#FF6800] text-white shadow-lg shadow-[#FF6800]/30'
                          : 'bg-[#0A0A0A] text-white/60 hover:bg-[#2A2A2A] border border-[#2A2A2A]'
                      }`}
                    >
                      {qty} kg
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 flex-wrap md:flex-nowrap">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-3 bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                >
                  {copiedOk ? <Check size={13} /> : <Copy size={13} />}
                  {copiedOk ? 'Copié' : 'Copier'}
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-3 bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                >
                  <Printer size={13} /> Imprimer
                </button>
                <button
                  onClick={handleSaveFormula}
                  disabled={isSaving}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg ${
                    savedOk
                      ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                      : isSaving
                        ? 'bg-[#2A2A2A] text-white/40 cursor-wait'
                        : 'bg-[#FF6800] hover:bg-[#FF8533] text-white shadow-[#FF6800]/30'
                  }`}
                >
                  {savedOk ? <Check size={13} /> : isSaving ? <RotateCcw size={13} className="animate-spin" /> : <Save size={13} />}
                  {savedOk ? 'Enregistré !' : isSaving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
                <button
                  onClick={() => setOptimizedResult(null)}
                  className="flex items-center gap-2 px-4 py-3 bg-[#0A0A0A] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                >
                  <RotateCcw size={13} /> Nouveau
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 print:hidden">
              <input
                type="text"
                value={formulaName}
                onChange={e => setFormulaName(e.target.value)}
                placeholder={`Nom de la formule (ex: Poulet lot ${new Date().toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })})`}
                className="flex-1 px-4 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-sm text-white placeholder:text-white/30 font-medium focus:outline-none focus:bg-[#0A0A0A] focus:border-[#FF6800] transition"
              />
            </div>
            {saveError && (
              <p className="text-xs text-red-300 mt-2 flex items-center gap-2">
                <AlertTriangle size={12} /> {saveError}
              </p>
            )}
          </div>
        </div>

        <OptimalSummary totals={totals} req={selectedReq} />

        <AIAnalysisPanel result={optimizedResult} req={selectedReq} score={score} />

        {/* Tableau ingrédients + convertisseur batch */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Recette de fabrication</h3>
              <p className="text-xs text-white/40 font-medium mt-1">Quantités à peser pour {batchKg} kg de mélange</p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Lot</span>
              <div className="flex gap-1">
                {[25, 50, 100, 200, 500].map(qty => (
                  <button
                    key={qty}
                    onClick={() => setBatchKg(qty)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                      batchKg === qty
                        ? 'bg-[#FF6800] text-white shadow-sm'
                        : 'bg-[#0A0A0A] text-white/60 hover:bg-[#2A2A2A] border border-[#2A2A2A]'
                    }`}
                  >
                    {qty}kg
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2A2A2A] text-left">
                  <th className="py-2 px-3 font-black text-[10px] text-[#FF6800] uppercase tracking-widest">Ingrédient</th>
                  <th className="py-2 px-3 font-black text-[10px] text-[#FF6800] uppercase tracking-widest text-right">% du mélange</th>
                  <th className="py-2 px-3 font-black text-[10px] text-[#FF6800] uppercase tracking-widest text-right">Quantité ({batchKg} kg)</th>
                  <th className="py-2 px-3 font-black text-[10px] text-[#FF6800] uppercase tracking-widest text-right print:text-left">
                    <span className="print:hidden">Prix (F/kg) ✏️</span>
                    <span className="hidden print:inline">Prix F/kg</span>
                  </th>
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
                      <td className="py-3 px-3 text-right font-black text-[#FF6800]">
                        {kgForBatch.toFixed(2)} <span className="text-xs text-white/40 font-medium">kg</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1 print:hidden">
                          <input
                            type="number"
                            min="0"
                            step="10"
                            value={ing.price || 0}
                            onChange={e => updateUserPrice(ing.id, parseFloat(e.target.value) || 0)}
                            className={`w-20 px-2 py-1 text-right text-xs font-bold rounded-lg border outline-none focus:ring-2 focus:ring-[#FF6800] transition ${
                              isUserPrice
                                ? 'border-[#FF6800]/40 bg-[#FF6800]/10 text-[#FF6800]'
                                : 'border-[#2A2A2A] bg-[#0A0A0A] text-white/60'
                            }`}
                            title={isUserPrice ? 'Prix que tu as personnalisé' : 'Prix par défaut — clique pour modifier'}
                          />
                          <span className="text-xs text-white/40 font-medium">F</span>
                        </div>
                        <span className="hidden print:inline text-slate-700 font-bold">{(ing.price || 0).toLocaleString('fr-FR')} F</span>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-amber-400 text-xs">
                        {subTotal.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} F
                      </td>
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
                  <td className="py-3 px-3 text-right font-black text-amber-400 text-sm">{costForBatch} F</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-[#0A0A0A] rounded-2xl border border-[#2A2A2A] print:hidden">
            <div className="flex items-start gap-2 text-xs text-white/60">
              <span className="text-base">💡</span>
              <p className="font-medium leading-relaxed">
                <strong className="text-white">Les prix changent souvent ?</strong> Édite-les directement dans le tableau ci-dessus.
                Tes prix sont sauvegardés dans ce navigateur.
                {Object.keys(userPrices).length > 0 && (
                  <span className="ml-1 text-[#FF6800] font-bold">
                    ({Object.keys(userPrices).length} prix personnalisé{Object.keys(userPrices).length > 1 ? 's' : ''})
                  </span>
                )}
              </p>
            </div>
            {Object.keys(userPrices).length > 0 && (
              <button
                onClick={resetUserPrices}
                className="text-[10px] font-black text-white/60 hover:text-red-400 uppercase tracking-widest flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-all shrink-0"
              >
                <RotateCcw size={11} /> Réinitialiser les prix
              </button>
            )}
          </div>

          <details className="mt-6">
            <summary className="text-xs font-black text-white/60 uppercase tracking-widest cursor-pointer hover:text-white">
              ✏️ Modifier manuellement les quantités
            </summary>
            <div className="mt-4">
              <IngredientTable
                selectedIngredients={optimizedResult}
                onUpdateIngredients={setOptimizedResult}
              />
            </div>
          </details>
        </div>
      </div>
    )
  }

  // ── FORMULAIRE (DARK + ORANGE) ──────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Sticker "MODE GÉNÉRATEUR IA" */}
      <div className="flex items-center gap-2 mb-2 print:hidden">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#FF8533] to-[#FF6800] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-md shadow-[#FF6800]/30">
          <Sparkles size={12} /> Mode Générateur IA
        </span>
        <span className="text-[10px] font-bold text-[#FF6800] uppercase tracking-widest">
          Optimisation automatique
        </span>
      </div>

      {/* Hero — DARK ORANGE GLOW */}
      <div className="relative bg-gradient-to-br from-[#FF6800] via-[#FF8533] to-[#FF6800] rounded-3xl p-8 overflow-hidden text-white shadow-xl border border-[#FF6800]/30">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/15 border border-white/30 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Wand2 size={24} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/80 uppercase tracking-widest mb-1">
                Générateur de formules automatiques
              </p>
              <h2 className="text-2xl font-black tracking-tight">Algorithme moindre coût + qualité</h2>
              <p className="text-white/80 text-sm font-medium mt-0.5">
                Optimisation nutritionnelle centrée · Analyse IA intégrée
              </p>
            </div>
          </div>
          <div className="shrink-0 flex flex-col items-center bg-white/10 border border-white/20 rounded-2xl px-6 py-4 backdrop-blur-md">
            <p className={`text-2xl font-black ${remaining > 0 ? 'text-white' : 'text-red-300'}`}>
              {remaining}
            </p>
            <p className="text-[9px] font-black text-white/70 uppercase tracking-widest">
              {remaining > 1 ? 'Essais restants' : remaining === 1 ? 'Essai restant' : 'Essais épuisés'}
            </p>
          </div>
        </div>
      </div>

      {/* Nom de formule + Sélection phase */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8 shadow-sm space-y-6">
        <h3 className="text-sm font-black text-[#FF6800] uppercase tracking-widest">Informations de base</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] font-black text-white/40 uppercase tracking-widest mb-2">
              Nom de la formule
            </label>
            <input
              type="text"
              value={formulaName}
              onChange={e => setFormulaName(e.target.value)}
              placeholder="Ex: Poulet de chair lot A"
              className="w-full px-5 py-4 rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] font-bold text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6800] focus:border-[#FF6800] placeholder-white/30 transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-white/40 uppercase tracking-widest mb-2">
              Espèce &amp; Phase
            </label>
            <select
              value={selectedReqId}
              onChange={e => setSelectedReqId(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] font-bold text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6800] focus:border-[#FF6800] transition appearance-none cursor-pointer"
            >
              {Object.entries(speciesGroups).map(([species, reqs]) => (
                <optgroup key={species} label={species} className="bg-[#1A1A1A]">
                  {reqs.map(r => (
                    <option key={r.id} value={r.id} className="bg-[#1A1A1A]">
                      {r.stage} · {r.ageRange}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            <div className="mt-3 flex items-start gap-2 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-black text-emerald-300">
                  {selectedReq.species} · {selectedReq.stage}
                </p>
                <p className="text-[10px] text-emerald-400/70 font-medium mt-0.5">
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
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8 shadow-sm text-left">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-black text-[#FF6800] uppercase tracking-widest">Ingrédients en stock</h3>
            <p className="text-[11px] text-white/40 mt-1">
              L'algorithme peut compléter automatiquement avec les ingrédients essentiels manquants.
            </p>
          </div>
          <span className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-[10px] font-black uppercase">
            {checkedIds.size} sélectionnés
          </span>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-5">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher un ingrédient (ex: maïs, tourteau, son…)"
            className="w-full pl-11 pr-11 py-3 rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] text-sm font-medium text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FF6800] focus:border-[#FF6800] transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {filteredIngredients.length === 0 ? (
          <div className="text-center py-8 text-white/40 text-sm font-medium">
            Aucun ingrédient trouvé pour "<span className="font-black">{searchQuery}</span>"
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredIngredients.map(ing => {
              const isChecked = checkedIds.has(ing.id)
              return (
                <button
                  key={ing.id}
                  onClick={() => toggleIngredient(ing.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    isChecked
                      ? 'border-[#FF6800] bg-[#FF6800]/10 ring-4 ring-[#FF6800]/10'
                      : 'border-[#2A2A2A] bg-[#0A0A0A] hover:border-[#FF6800]/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className={`font-black text-sm leading-tight ${isChecked ? 'text-white' : 'text-white/70'}`}>
                      {ing.name}
                    </p>
                    {isChecked && (
                      <div className="w-5 h-5 rounded-full bg-[#FF6800] flex items-center justify-center shrink-0">
                        <Check size={11} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${CAT[ing.category] ?? 'bg-[#1A1A1A] border-[#2A2A2A] text-white/40'}`}>
                    {ing.category}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Bouton générer — TRÈS visible (ORANGE) */}
      <div className="relative">
        {canGenerate && remaining > 0 && (
          <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6800] via-[#FF8533] to-[#FF6800] rounded-3xl blur-lg opacity-60 animate-pulse" aria-hidden="true" />
        )}
        <button
          onClick={handleOptimize}
          disabled={!canGenerate}
          className={`relative w-full py-8 rounded-3xl font-black text-base md:text-lg uppercase tracking-widest transition-all shadow-2xl border-2 ${
            !canGenerate
              ? 'bg-[#2A2A2A] text-white/30 border-[#2A2A2A] cursor-not-allowed'
              : remaining === 0
                ? 'bg-gradient-to-r from-red-600 to-red-500 text-white border-red-400 hover:from-red-500 hover:to-red-400 hover:scale-[1.02] shadow-red-500/40 active:scale-95'
                : 'bg-gradient-to-r from-[#FF6800] via-[#FF8533] to-[#FF6800] text-white border-[#FF6800] hover:scale-[1.02] shadow-[#FF6800]/50 active:scale-95'
          }`}
        >
          {isOptimizing ? (
            <span className="flex items-center justify-center gap-3">
              <RotateCcw className="animate-spin" size={24} />
              Optimisation en cours…
            </span>
          ) : remaining === 0 ? (
            <span className="flex items-center justify-center gap-3">
              <Star size={22} fill="currentColor" />
              Passer Pro pour continuer →
            </span>
          ) : (
            <span className="flex items-center justify-center gap-3">
              <Sparkles size={24} className="animate-pulse" />
              <span className="drop-shadow-md">Générer la formule optimale</span>
              <Wand2 size={24} />
            </span>
          )}
        </button>
        {canGenerate && remaining > 0 && (
          <p className="text-center text-xs font-bold text-[#FF6800] mt-3">
            ✨ Phase : <span className="text-white">{selectedReq.stage}</span> ·
            {checkedIds.size} ingrédient{checkedIds.size > 1 ? 's' : ''} sélectionné{checkedIds.size > 1 ? 's' : ''}
          </p>
        )}
        {!canGenerate && checkedIds.size < 2 && (
          <p className="text-center text-xs font-bold text-amber-400 mt-3 flex items-center justify-center gap-2">
            <AlertTriangle size={13} /> Coche au moins 2 ingrédients pour activer le bouton
          </p>
        )}
      </div>

      {remaining === 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/pricing"
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#FF6800] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#FF8533] transition-all text-center shadow-lg shadow-[#FF6800]/30"
          >
            <Star size={14} fill="currentColor" /> Voir les offres Pro
          </Link>
          <Link
            to="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-purple-500/20 transition-all text-center"
          >
            <Gift size={14} /> Parrainer pour +1 essai
          </Link>
        </div>
      )}
    </div>
  )
}