import { useState, useMemo } from 'react'
import {
  Save, RotateCcw, Check, Scale, Sparkles, Printer, Copy,
  AlertTriangle, CheckCircle2, TrendingUp, ArrowUp, ArrowDown, Plus, Trash2,
} from 'lucide-react'
import { animalRequirements } from '../data/animalRequirements'
import { ingredientsDatabase } from '../data/ingredientsDatabase'
import { calculateTotals, getFinalValues, computeNutritionScore } from '../utils/nutritionCalculations'
import { useSubscription } from '../contexts/SubscriptionContext'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import type { SelectedIngredient } from '../types/ingredients'
import type { AnimalRequirement } from '../types/animalRequirements'

// ─── ANALYSE IA LOCALE ──────────────────────────────────────────────────────

type NutInfo = {
  key: string
  label: string
  value: number
  min: number
  max: number
  unit: string
  center: number
  position: 'low' | 'center' | 'high'
}

function buildLocalAnalysis(
  result: SelectedIngredient[],
  req: AnimalRequirement,
  final: { em: number; pb: number; lys: number; met: number; ca: number; p: number },
): string {
  const buildNut = (key: string, label: string, value: number, min: number, max: number, unit: string): NutInfo => {
    const center = (min + max) / 2
    const range = max - min
    const rel = range > 0 ? (value - center) / (range / 2) : 0
    const position: 'low' | 'center' | 'high' =
      rel < -0.5 ? 'low' : rel > 0.5 ? 'high' : 'center'
    return { key, label, value, min, max, unit, center, position }
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
  const optimal = inRange.filter(n => {
    const half = (n.max - n.min) / 2
    return half > 0 && Math.abs(n.value - n.center) / half <= 0.5
  })
  const offCenter = inRange.filter(n => !optimal.includes(n))

  const fmt = (n: NutInfo) => `${n.value.toFixed(n.unit === '%' ? 2 : 0)}${n.unit}`
  const targetStr = (n: NutInfo) => `cible ${n.center.toFixed(n.unit === '%' ? 2 : 0)}${n.unit}`

  const totalKg = result.reduce((s, i) => s + i.quantity, 0) || 100
  const dom = (id: string) => {
    const ing = result.find(i => i.id === id)
    return ing ? (ing.quantity / totalKg) * 100 : 0
  }
  const has = (id: string) => result.some(i => i.id === id && i.quantity > 0.5)

  let txt = ''

  txt += '**Verdict global**\n\n'
  if (tooLow.length === 0 && tooHigh.length === 0) {
    if (optimal.length === nutrients.length) {
      txt += `Excellente formule vérifiée. Les 6 nutriments sont parfaitement dans les plages Goliath et bien centrés. Tu peux fabriquer en confiance.\n\n`
    } else if (optimal.length >= 4) {
      txt += `Bonne formule vérifiée. ${optimal.length} nutriments sur 6 sont bien centrés. Les ${offCenter.length} autres sont dans la plage mais proches d'une borne — quelques ajustements amélioreraient encore la marge.\n\n`
    } else {
      txt += `Formule acceptable. Tous les nutriments respectent les plages mais ${offCenter.length} sont proches des bornes. Les suggestions ci-dessous t'aideront à recentrer la formule.\n\n`
    }
  } else {
    txt += `Formule à corriger avant utilisation. ${tooLow.length + tooHigh.length} nutriment(s) sortent des plages Goliath : ${[...tooLow, ...tooHigh].map(n => n.label.toLowerCase().split(' ')[0]).join(', ')}. Voir les corrections obligatoires.\n\n`
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
      if (n.key === 'pb')       txt += `Augmente le tourteau de soja de 2-3 kg, ou ajoute du soja graine (37% PB).\n`
      else if (n.key === 'em')  txt += `Ajoute 1-2 kg de soja graine (3900 kcal/kg) ou 0,5 kg d'huile rouge.\n`
      else if (n.key === 'ca')  txt += `Ajoute 1 à 2 kg de coquille d'huître (38% Ca).\n`
      else if (n.key === 'p')   txt += `Ajoute 0,5 à 1 kg de phosphate bicalcique (18% P) ou de la farine de poisson.\n`
      else if (n.key === 'lys') txt += `Ajoute 0,1 à 0,2 kg de lysine HCl synthétique.\n`
      else if (n.key === 'met') txt += `Ajoute 0,05 à 0,15 kg de DL-méthionine.\n`
    }
    for (const n of tooHigh) {
      const excess = ((n.value - n.max) / n.max * 100).toFixed(0)
      txt += `- **${n.label} trop élevé** (${fmt(n)}, ${excess}% au-dessus du max). `
      if (n.key === 'pb')       txt += `Réduis le tourteau de soja, augmente les céréales (maïs, sorgho).\n`
      else if (n.key === 'em')  txt += `Réduis l'huile et le soja graine, augmente le son de blé.\n`
      else if (n.key === 'ca')  txt += `Réduis la coquille d'huître. Excès = mauvaise absorption du P et Zn.\n`
      else if (n.key === 'p')   txt += `Réduis le phosphate bicalcique.\n`
      else if (n.key === 'lys') txt += `Remplace 5-10% du tourteau de soja par du tourteau de palmiste.\n`
      else if (n.key === 'met') txt += `Réduis la DL-méthionine ou la farine de poisson.\n`
    }
    txt += '\n'
  }

  const suggestions: string[] = []
  for (const n of offCenter) {
    if (n.position === 'high') {
      if (n.key === 'pb' && dom('tourteau_soja') > 22) {
        suggestions.push(`**Protéines proches du plafond** (${fmt(n)}, ${targetStr(n)}). Tu as ${dom('tourteau_soja').toFixed(0)}% de tourteau de soja — descendre à 18-20% recentrerait la PB et réduirait le coût.`)
      } else if (n.key === 'ca' && dom('coquille_huitre') > 3) {
        suggestions.push(`**Calcium proche du plafond** (${fmt(n)}, ${targetStr(n)}). Réduis la coquille de 0,5-1 kg.`)
      } else if (n.key === 'lys' && dom('tourteau_soja') > 20) {
        suggestions.push(`**Lysine proche du plafond** (${fmt(n)}, ${targetStr(n)}). Remplace 3-5 kg de tourteau de soja par du tourteau de palmiste pour économiser.`)
      } else {
        suggestions.push(`**${n.label} proche du plafond** (${fmt(n)}, ${targetStr(n)}).`)
      }
    } else if (n.position === 'low') {
      if (n.key === 'em')       suggestions.push(`**Énergie proche du plancher** (${fmt(n)}, ${targetStr(n)}). Ajoute 1-2 kg de soja graine.`)
      else if (n.key === 'pb')  suggestions.push(`**Protéines proches du plancher** (${fmt(n)}, ${targetStr(n)}). Augmente le tourteau de soja de 1-2 kg.`)
      else if (n.key === 'lys') suggestions.push(`**Lysine proche du plancher** (${fmt(n)}, ${targetStr(n)}). Ajoute 0,05-0,1 kg de lysine synthétique.`)
      else if (n.key === 'met') suggestions.push(`**Méthionine proche du plancher** (${fmt(n)}, ${targetStr(n)}). Ajoute 0,03-0,08 kg de DL-méthionine.`)
      else if (n.key === 'ca')  suggestions.push(`**Calcium proche du plancher** (${fmt(n)}, ${targetStr(n)}). Ajoute 0,3-0,7 kg de coquille d'huître.`)
      else if (n.key === 'p')   suggestions.push(`**Phosphore proche du plancher** (${fmt(n)}, ${targetStr(n)}). Ajoute 0,2-0,4 kg de phosphate bicalcique.`)
    }
  }
  if (dom('mais') > 60)              suggestions.push(`**Maïs très dominant** (${dom('mais').toFixed(0)}%). Diversifie avec du sorgho ou du son de blé.`)
  if (dom('tourteau_soja') > 30)     suggestions.push(`**Tourteau de soja très dominant** (${dom('tourteau_soja').toFixed(0)}%). Remplace 5-8 kg par du tourteau de palmiste.`)
  if (!has('farine_poisson') && (req.stage.toLowerCase().includes('démarrage') || req.stage.toLowerCase().includes('croissance')))
    suggestions.push(`**Pas de farine de poisson**. 2-4 kg amélioreraient le profil en lysine, méthionine, Ca, P en un seul ingrédient.`)
  if (!has('premix') && !has('concentre_chair') && !has('concentre_ponte'))
    suggestions.push(`**Pas de prémix détecté**. Ajoute 0,25-0,5 kg de prémix CMV pour 100 kg sinon les performances chuteront.`)

  if (suggestions.length > 0) {
    txt += '**Suggestions d\'amélioration**\n\n'
    for (const s of suggestions) txt += `- ${s}\n`
    txt += '\n'
  }

  txt += '**Conseil pratique terrain**\n\n'
  const stage = req.stage.toLowerCase()
  if (stage.includes('démarrage'))      txt += `À cet âge, distribue 5-6 petits repas par jour, eau fraîche en permanence, température 32-35°C la première semaine.`
  else if (stage.includes('croissance')) txt += `Pèse 10 sujets chaque semaine. Si décrochage, augmente l'énergie (soja graine, huile) avant la protéine.`
  else if (stage.includes('poulette'))  txt += `La poulette doit grandir sans s'engraisser. Évite les rations trop énergétiques (max 2800 kcal/kg).`
  else if (stage.includes('ponte'))     txt += `Pour des œufs solides, distribue le calcium en 2 fois : 1/3 le matin, 2/3 le soir. Les poules forment la coquille la nuit.`
  else                                  txt += `Stocke au sec, à l'abri des rongeurs. Vérifie l'absence de moisissures sur le maïs et le tourteau d'arachide.`

  return txt
}

// ─── FORMATAGE DE L'ANALYSE EN CARTES COLORÉES ─────────────────────────────

function formatAnalysis(text: string) {
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

  const cfg: Record<string, { text: string; bg: string; border: string; icon: string; bullet: string }> = {
    'Verdict global':              { text: 'text-slate-900',   bg: 'bg-white',         border: 'border-slate-200',   icon: '📋', bullet: 'bg-slate-400'   },
    'Points forts':                { text: 'text-emerald-900', bg: 'bg-emerald-50/50', border: 'border-emerald-200', icon: '✨', bullet: 'bg-emerald-400' },
    'Corrections obligatoires':    { text: 'text-red-900',     bg: 'bg-red-50/50',     border: 'border-red-200',     icon: '⚠️', bullet: 'bg-red-400'     },
    "Suggestions d'amélioration":  { text: 'text-amber-900',   bg: 'bg-amber-50/50',   border: 'border-amber-200',   icon: '💡', bullet: 'bg-amber-400'   },
    'Conseil pratique terrain':    { text: 'text-blue-900',    bg: 'bg-blue-50/50',    border: 'border-blue-200',    icon: '🌾', bullet: 'bg-blue-400'    },
  }

  return (
    <div className="space-y-4">
      {sections.map((sec, idx) => {
        const c = cfg[sec.title] ?? { text: 'text-slate-900', bg: 'bg-slate-50', border: 'border-slate-200', icon: '•', bullet: 'bg-slate-400' }
        return (
          <div key={idx} className={`rounded-2xl border ${c.border} ${c.bg} p-5`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{c.icon}</span>
              <h4 className={`font-black text-xs uppercase tracking-widest ${c.text}`}>{sec.title}</h4>
            </div>
            <div className="space-y-2">
              {sec.content.filter(l => l.trim() !== '').map((line, j) => {
                const isBullet = line.startsWith('- ')
                const clean = isBullet ? line.slice(2) : line
                const parts = clean.split(/(\*\*[^*]+\*\*)/g)
                return (
                  <div key={j} className={`text-sm leading-relaxed ${c.text.replace('-900', '-800')} ${isBullet ? 'pl-4 relative' : ''}`}>
                    {isBullet && (
                      <span className={`absolute left-0 top-2 w-1.5 h-1.5 rounded-full ${c.bullet}`} />
                    )}
                    {parts.map((p, k) => {
                      const boldMatch = p.match(/^\*\*([^*]+)\*\*$/)
                      if (boldMatch) return <strong key={k} className="font-black">{boldMatch[1]}</strong>
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

// ─── COMPOSANT PRINCIPAL ────────────────────────────────────────────────────

export function ManualAnalyzer() {
  const { user } = useAuth()
  const { canSaveFormula, incrementFormulaCount, subscription } = useSubscription()

  const [formulaName, setFormulaName] = useState('')
  const [selectedReqId, setSelectedReqId] = useState(animalRequirements[0].id)
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([])
  const [selectedToAdd, setSelectedToAdd] = useState<string>('')

  const [isSaving, setIsSaving] = useState(false)
  const [savedOk, setSavedOk] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [copiedOk, setCopiedOk] = useState(false)

  const [aiText, setAiText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiDone, setAiDone] = useState(false)

  const [userPrices, setUserPrices] = useState<Record<string, number>>(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('provende_user_prices') : null
      return stored ? JSON.parse(stored) : {}
    } catch { return {} }
  })

  // ─── DONNÉES DÉRIVÉES ─────────────────────────────────────────────────────
  const currentReq = animalRequirements.find(r => r.id === selectedReqId) ?? animalRequirements[0]
  const speciesList = useMemo(() => Array.from(new Set(animalRequirements.map(r => r.species))), [])
  const currentSpecies = currentReq.species
  const filteredStages = useMemo(
    () => animalRequirements.filter(r => r.species === currentSpecies),
    [currentSpecies]
  )

  const rawTotals = calculateTotals(selectedIngredients)
  const totalWeight = selectedIngredients.reduce((acc, i) => acc + i.quantity, 0)

  const factor = totalWeight > 0 ? 100 / totalWeight : 1
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
    weight: totalWeight,
  }
  const final = getFinalValues(totals)
  const score = computeNutritionScore(totals, currentReq)

  const costPer100kg = selectedIngredients.reduce((acc, ing) => {
    const db = ingredientsDatabase.find(i => i.id === ing.id)
    const price = userPrices[ing.id] ?? ing.price ?? db?.defaultPrice ?? 0
    const pctOf100 = ing.quantity * factor
    return acc + price * (pctOf100 / 100)
  }, 0)

  const nutrientList = [
    { key: 'em',  label: 'Énergie',  short: 'EM',  unit: ' kcal', value: final.em,  min: currentReq.em.min,  max: currentReq.em.max,  decimals: 0 },
    { key: 'pb',  label: 'Protéine', short: 'PB',  unit: '%',     value: final.pb,  min: currentReq.pb.min,  max: currentReq.pb.max,  decimals: 1 },
    { key: 'ca',  label: 'Calcium',  short: 'Ca',  unit: '%',     value: final.ca,  min: currentReq.ca.min,  max: currentReq.ca.max,  decimals: 2 },
    { key: 'p',   label: 'Phosphore',short: 'P',   unit: '%',     value: final.p,   min: currentReq.p.min,   max: currentReq.p.max,   decimals: 2 },
    { key: 'lys', label: 'Lysine',   short: 'Lys', unit: '%',     value: final.lys, min: currentReq.lys.min, max: currentReq.lys.max, decimals: 2 },
    { key: 'met', label: 'Méthionine',short: 'Met',unit: '%',     value: final.met, min: currentReq.met.min, max: currentReq.met.max, decimals: 2 },
  ]
  const eps = (n: typeof nutrientList[0]) => Math.max((n.max - n.min) * 0.005, 0.005)
  const isInRange = (n: typeof nutrientList[0]) => n.value >= n.min - eps(n) && n.value <= n.max + eps(n)
  const isCentered = (n: typeof nutrientList[0]) => {
    const center = (n.min + n.max) / 2
    const half = (n.max - n.min) / 2
    return half > 0 && Math.abs(n.value - center) / half <= 0.5
  }
  const nutStatus = (n: typeof nutrientList[0]): 'optimal' | 'acceptable' | 'low' | 'high' => {
    if (!isInRange(n)) return n.value < n.min ? 'low' : 'high'
    return isCentered(n) ? 'optimal' : 'acceptable'
  }
  const inRangeCount = nutrientList.filter(isInRange).length

  // ─── HANDLERS ─────────────────────────────────────────────────────────────

  const handleSpeciesChange = (species: string) => {
    const firstStage = animalRequirements.find(r => r.species === species)
    if (firstStage) setSelectedReqId(firstStage.id)
  }

  const handleAddIngredient = () => {
    if (!selectedToAdd) return
    const ing = ingredientsDatabase.find(i => i.id === selectedToAdd)
    if (!ing) return
    setSelectedIngredients([
      ...selectedIngredients,
      { ...ing, quantity: 0, price: userPrices[ing.id] ?? ing.defaultPrice ?? 0 },
    ])
    setSelectedToAdd('')
  }

  const handleRemoveIngredient = (index: number) => {
    const next = [...selectedIngredients]
    next.splice(index, 1)
    setSelectedIngredients(next)
  }

  const handleUpdateQuantity = (index: number, value: number) => {
    const next = [...selectedIngredients]
    next[index] = { ...next[index], quantity: value }
    setSelectedIngredients(next)
  }

  const updateUserPrice = (ingredientId: string, price: number) => {
    const next = { ...userPrices, [ingredientId]: price }
    setUserPrices(next)
    try { localStorage.setItem('provende_user_prices', JSON.stringify(next)) } catch (e) { console.error(e) }
    setSelectedIngredients(selectedIngredients.map(ing =>
      ing.id === ingredientId ? { ...ing, price } : ing
    ))
  }

  const handleSave = async () => {
    if (!canSaveFormula || !user) {
      setSaveError(!user ? 'Vous devez être connecté.' : 'Limite atteinte.')
      setTimeout(() => setSaveError(null), 3000)
      return
    }
    if (selectedIngredients.length === 0) {
      setSaveError('Ajoute au moins un ingrédient.')
      setTimeout(() => setSaveError(null), 3000)
      return
    }
    const name = formulaName.trim() || `${currentReq.species} - ${currentReq.stage} (${new Date().toLocaleDateString('fr-FR')})`

    setIsSaving(true)
    setSaveError(null)

    const { error } = await supabase.from('formulas').insert([{
      user_id: user.id,
      name,
      ingredients: selectedIngredients,
      nutritional_stats: totals,
      cost_per_100kg: Math.round(costPer100kg),
    }])

    if (!error) {
      const nextCount = (subscription.formulasCount || 0) + 1
      await supabase.from('profiles').update({ manual_formulas_count: nextCount }).eq('id', user.id)
      incrementFormulaCount()
      setSavedOk(true)
      setTimeout(() => setSavedOk(false), 3000)
    } else {
      setSaveError("Erreur lors de l'enregistrement.")
      setTimeout(() => setSaveError(null), 4000)
    }
    setIsSaving(false)
  }

  const handlePrint = () => window.print()

  const handleCopy = async () => {
    const lines = [
      `Formule : ${formulaName || 'Sans nom'}`,
      `${currentReq.species} - ${currentReq.stage}`,
      `Total : ${totalWeight.toFixed(2)} kg`,
      '',
      ...selectedIngredients.map(i => `${i.name} : ${i.quantity.toFixed(2)} kg`),
      '',
      `Score qualité : ${score}/100`,
      `Coût pour 100 kg : ${Math.round(costPer100kg).toLocaleString('fr-FR')} F`,
    ]
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopiedOk(true)
      setTimeout(() => setCopiedOk(false), 2000)
    } catch (e) { console.error(e) }
  }

  const handleAIAnalyze = async () => {
    if (selectedIngredients.length === 0) return
    setAiLoading(true)
    setAiText('')
    setAiDone(false)
    const fullText = buildLocalAnalysis(selectedIngredients, currentReq, final)
    const words = fullText.split(/(\s+)/)
    for (let i = 0; i < words.length; i++) {
      await new Promise(r => setTimeout(r, 8))
      setAiText(prev => prev + words[i])
    }
    setAiDone(true)
    setAiLoading(false)
  }

  const availableIngredients = useMemo(() =>
    ingredientsDatabase
      .filter(i => !selectedIngredients.find(si => si.id === i.id))
      .sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })),
    [selectedIngredients]
  )

  const hasData = selectedIngredients.length > 0

  // ─── RENDU ────────────────────────────────────────────────────────────────
  // NOTE : pas de fond rose ici. Le fond rose vient maintenant du Dashboard.tsx
  // pour qu'il couvre TOUTE la page (titre + onglets + contenu).

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Sticker "MODE VÉRIFICATEUR" */}
      <div className="flex items-center gap-2 mb-2 print:hidden">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-600 to-pink-400 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-md shadow-pink-300">
          <Scale size={12} /> Mode Vérificateur
        </span>
        <span className="text-[10px] font-bold text-pink-700 uppercase tracking-widest">
          Analyse de ta formule
        </span>
      </div>

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-pink-600 via-pink-500 to-rose-500 rounded-3xl p-8 overflow-hidden text-white shadow-xl border border-pink-400/30 print:bg-white print:text-slate-900 print:shadow-none">
        <div className="absolute inset-0 pointer-events-none print:hidden">
          <div className="absolute top-0 right-0 w-56 h-56 bg-pink-300/20 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-300/20 rounded-full -ml-16 -mb-16 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/15 border border-white/30 rounded-2xl flex items-center justify-center">
              <Scale size={26} className="text-pink-100 print:text-pink-600" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-pink-100/80 uppercase tracking-[0.2em] mb-1 print:text-pink-700">Analyseur de ration</p>
              <h2 className="text-2xl font-black tracking-tight print:text-slate-900">Vérificateur de formule</h2>
              <p className="text-white/70 text-sm font-medium mt-0.5 print:text-slate-600">
                Saisis ta recette et l'IA la compare aux besoins Goliath
              </p>
            </div>
          </div>

          <div className="shrink-0 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-center backdrop-blur-md print:bg-pink-50 print:border-pink-200">
            <p className={`text-3xl font-black ${totalWeight > 0 ? 'text-white print:text-pink-700' : 'text-white/40'}`}>
              {totalWeight.toFixed(1)} <span className="text-sm text-white/50 print:text-pink-400">kg</span>
            </p>
            <p className="text-[9px] font-bold uppercase tracking-widest opacity-60 mt-1 print:opacity-80">Poids total saisi</p>
          </div>
        </div>
      </div>

      {/* Configuration : nom + espèce + phase */}
      <div className="bg-white/80 backdrop-blur-sm border border-pink-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="text-sm font-black text-pink-500 uppercase tracking-widest mb-5">1. Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-black text-pink-500 uppercase tracking-widest mb-2">Nom de la formule</label>
            <input
              type="text"
              value={formulaName}
              onChange={e => setFormulaName(e.target.value)}
              placeholder="Ex: Lot janvier"
              className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50/60 font-bold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent placeholder-pink-300 transition"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-pink-500 uppercase tracking-widest mb-2">Type de volaille</label>
            <select
              value={currentSpecies}
              onChange={e => handleSpeciesChange(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50/60 font-bold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent appearance-none cursor-pointer transition"
            >
              {speciesList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-pink-500 uppercase tracking-widest mb-2">Phase d'élevage</label>
            <select
              value={selectedReqId}
              onChange={e => setSelectedReqId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50/60 font-bold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent appearance-none cursor-pointer transition"
            >
              {filteredStages.map(r => <option key={r.id} value={r.id}>{r.stage}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Saisie ingrédients */}
      <div className="bg-white/80 backdrop-blur-sm border border-pink-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-black text-pink-500 uppercase tracking-widest">2. Saisis ta recette</h3>
            <p className="text-[11px] text-pink-400 mt-1">Ajoute tes ingrédients et indique combien de kg de chacun</p>
          </div>
          {selectedIngredients.length > 0 && (
            <div className="flex items-center gap-3">
              <span className={`text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-xl ${
                Math.abs(totalWeight - 100) < 0.5 ? 'bg-emerald-50 text-emerald-700' : 'bg-pink-100 text-pink-700'
              }`}>
                {Math.abs(totalWeight - 100) < 0.5 ? `Total : 100 kg ✓` : `Total : ${totalWeight.toFixed(1)} kg`}
              </span>
              <button
                onClick={() => setSelectedIngredients([])}
                className="text-[10px] font-black text-pink-400 hover:text-red-500 uppercase flex items-center gap-1 transition-colors"
              >
                <RotateCcw size={11} /> Vider
              </button>
            </div>
          )}
        </div>

        {/* Tableau des ingrédients saisis */}
        {selectedIngredients.length > 0 ? (
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-pink-200 text-left">
                  <th className="py-2 px-3 font-black text-[10px] text-pink-500 uppercase tracking-widest">Matière première</th>
                  <th className="py-2 px-3 font-black text-[10px] text-pink-500 uppercase tracking-widest text-right">Quantité (kg)</th>
                  <th className="py-2 px-3 font-black text-[10px] text-pink-500 uppercase tracking-widest text-right print:hidden">Prix (F/kg) ✏️</th>
                  <th className="py-2 px-3 font-black text-[10px] text-pink-500 uppercase tracking-widest text-right">Sous-total</th>
                  <th className="py-2 px-3 print:hidden"></th>
                </tr>
              </thead>
              <tbody>
                {selectedIngredients.map((ing, index) => {
                  const price = userPrices[ing.id] ?? ing.price ?? 0
                  const sub = ing.quantity * price
                  const isUserPrice = userPrices[ing.id] !== undefined
                  return (
                    <tr key={ing.id} className="border-b border-pink-100 hover:bg-pink-50/50">
                      <td className="py-3 px-3 font-bold text-slate-700">{ing.name}</td>
                      <td className="py-3 px-3 text-right">
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="0"
                          value={ing.quantity || ''}
                          onChange={e => handleUpdateQuantity(index, parseFloat(e.target.value) || 0)}
                          className="w-24 px-3 py-1.5 text-right text-sm font-black rounded-lg border border-pink-200 bg-pink-50/60 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                        />
                      </td>
                      <td className="py-3 px-3 text-right print:hidden">
                        <div className="flex items-center justify-end gap-1">
                          <input
                            type="number"
                            min="0"
                            step="10"
                            value={price}
                            onChange={e => updateUserPrice(ing.id, parseFloat(e.target.value) || 0)}
                            className={`w-20 px-2 py-1.5 text-right text-xs font-bold rounded-lg border outline-none focus:ring-2 focus:ring-pink-400 transition ${
                              isUserPrice ? 'border-pink-300 bg-pink-50 text-pink-800' : 'border-pink-200 bg-pink-50/60 text-slate-600'
                            }`}
                            title={isUserPrice ? 'Prix personnalisé' : 'Prix par défaut — clique pour modifier'}
                          />
                          <span className="text-[10px] text-pink-400 font-medium">F</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-pink-700 text-xs">
                        {sub.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} F
                      </td>
                      <td className="py-3 px-3 print:hidden">
                        <button
                          onClick={() => handleRemoveIngredient(index)}
                          className="p-1.5 text-pink-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="bg-pink-100/60">
                  <td className="py-3 px-3 font-black text-slate-900 text-sm">TOTAL</td>
                  <td className="py-3 px-3 text-right font-black text-slate-900">{totalWeight.toFixed(2)} kg</td>
                  <td className="py-3 px-3 print:hidden"></td>
                  <td className="py-3 px-3 text-right font-black text-pink-700 text-sm">
                    {selectedIngredients.reduce((acc, i) => acc + (i.quantity * (userPrices[i.id] ?? i.price ?? 0)), 0).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} F
                  </td>
                  <td className="py-3 px-3 print:hidden"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 px-6 bg-pink-50/60 border border-dashed border-pink-300 rounded-2xl mb-4">
            <Scale size={32} className="mx-auto text-pink-300 mb-3" />
            <p className="text-sm font-bold text-pink-500">Ta recette est vide</p>
            <p className="text-xs text-pink-400 mt-1">Ajoute ton premier ingrédient ci-dessous</p>
          </div>
        )}

        {/* Sélecteur d'ajout */}
        <div className="flex gap-3 print:hidden">
          <select
            value={selectedToAdd}
            onChange={e => setSelectedToAdd(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50/60 font-bold text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-400 transition appearance-none cursor-pointer"
          >
            <option value="">Sélectionner un ingrédient (A-Z)…</option>
            {availableIngredients.map(i => (
              <option key={i.id} value={i.id}>{i.name}</option>
            ))}
          </select>
          <button
            onClick={handleAddIngredient}
            disabled={!selectedToAdd}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-pink-400 text-white px-6 py-3 rounded-2xl hover:from-pink-500 hover:to-pink-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-pink-400/30"
          >
            <Plus size={14} /> Ajouter
          </button>
        </div>
      </div>

      {/* Score + Coût */}
      {hasData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Score */}
          <div className={`relative rounded-3xl p-6 overflow-hidden ${
            score >= 85 ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 border border-emerald-400/30' :
            score >= 70 ? 'bg-gradient-to-br from-amber-500 to-orange-600 border border-amber-400/30' :
                          'bg-gradient-to-br from-red-500 to-red-700 border border-red-400/30'
          } text-white shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Score qualité</p>
                <p className="text-5xl font-black leading-none">{score}<span className="text-2xl opacity-60">/100</span></p>
                <p className="text-xs font-bold opacity-80 mt-2">
                  {inRangeCount}/{nutrientList.length} nutriments dans la plage
                </p>
              </div>
              <div className="text-right">
                {score >= 85 ? <CheckCircle2 size={48} className="opacity-80" /> :
                 score >= 70 ? <TrendingUp size={48} className="opacity-80" /> :
                                <AlertTriangle size={48} className="opacity-80" />}
              </div>
            </div>
          </div>

          {/* Coût */}
          <div className="relative rounded-3xl p-6 overflow-hidden bg-gradient-to-br from-pink-500 to-rose-500 border border-pink-400/30 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Coût pour 100 kg</p>
                <p className="text-5xl font-black leading-none">{Math.round(costPer100kg).toLocaleString('fr-FR')}<span className="text-2xl opacity-60"> F</span></p>
                <p className="text-xs font-bold opacity-80 mt-2">
                  ≈ {Math.round(costPer100kg / 100).toLocaleString('fr-FR')} F / kg fini
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bilan nutritionnel */}
      {hasData && (
        <div className="bg-white/80 backdrop-blur-sm border border-pink-200 rounded-3xl p-6 md:p-8 shadow-sm">
          <h3 className="text-sm font-black text-pink-500 uppercase tracking-widest mb-5">3. Bilan nutritionnel</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {nutrientList.map(n => {
              const status = nutStatus(n)
              const styles =
                status === 'optimal'    ? { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', sub: 'text-emerald-600', icon: <Check size={14} className="text-emerald-500" /> } :
                status === 'acceptable' ? { bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-900',   sub: 'text-amber-600',   icon: n.value > (n.min + n.max) / 2 ? <ArrowUp size={14} className="text-amber-500" /> : <ArrowDown size={14} className="text-amber-500" /> } :
                status === 'low'        ? { bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-900',     sub: 'text-red-600',     icon: <ArrowDown size={14} className="text-red-500" /> } :
                                          { bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-900',     sub: 'text-red-600',     icon: <ArrowUp size={14} className="text-red-500" /> }

              return (
                <div key={n.key} className={`rounded-2xl border p-4 ${styles.bg} ${styles.border}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${styles.text}`}>{n.short}</span>
                    {styles.icon}
                  </div>
                  <p className={`text-xl font-black leading-tight ${styles.text}`}>
                    {n.value.toFixed(n.decimals)}{n.unit}
                  </p>
                  <p className={`text-[10px] font-bold mt-1 ${styles.sub}`}>
                    {status === 'optimal' && `cible ${n.min}-${n.max}${n.unit}`}
                    {status === 'acceptable' && (n.value > (n.min + n.max) / 2 ? `proche du max ${n.max}${n.unit}` : `proche du min ${n.min}${n.unit}`)}
                    {status === 'low' && `trop bas, min ${n.min}${n.unit}`}
                    {status === 'high' && `trop élevé, max ${n.max}${n.unit}`}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-pink-100 text-[10px] font-bold text-pink-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Optimal (centré)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Acceptable (proche borne)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Hors plage</span>
          </div>
        </div>
      )}

      {/* Analyse IA */}
      {hasData && (
        <div className="bg-gradient-to-br from-violet-50 via-purple-50/40 to-pink-50 border border-violet-200 rounded-3xl p-6 md:p-8 shadow-sm print:bg-white print:border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md shadow-violet-200">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-violet-900 uppercase tracking-widest">4. Analyse IA personnalisée</h3>
                <p className="text-xs text-violet-600/80 font-medium mt-0.5">Diagnostic nutritionnel détaillé</p>
              </div>
            </div>
            {!aiText && !aiLoading && (
              <button
                onClick={handleAIAnalyze}
                disabled={!hasData || totalWeight === 0}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-5 py-3 rounded-2xl hover:from-violet-500 hover:to-purple-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-violet-500/30 print:hidden"
              >
                <Sparkles size={14} /> Analyser ma formule
              </button>
            )}
            {aiText && !aiLoading && (
              <button
                onClick={handleAIAnalyze}
                className="text-[10px] font-black text-violet-500 hover:text-violet-700 uppercase tracking-widest flex items-center gap-1 transition-colors print:hidden"
              >
                <RotateCcw size={11} /> Relancer
              </button>
            )}
          </div>

          {!aiText && !aiLoading && (
            <div className="text-center py-8 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 mb-3">
                <Sparkles size={28} className="text-violet-500" />
              </div>
              <p className="text-sm font-bold text-violet-900 mb-1">Analyse IA disponible</p>
              <p className="text-xs text-violet-600/80 max-w-md mx-auto">
                Clique sur "Analyser ma formule" pour obtenir un verdict, les points forts, les corrections obligatoires et des conseils terrain personnalisés.
              </p>
            </div>
          )}

          {aiLoading && !aiText && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative mb-3">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                  <Sparkles size={24} className="text-violet-600 animate-pulse" />
                </div>
                <div className="absolute -inset-1 bg-violet-400/20 rounded-2xl animate-ping" />
              </div>
              <span className="font-black text-sm text-violet-700 uppercase tracking-widest">L'IA analyse votre formule</span>
            </div>
          )}

          {aiText && formatAnalysis(aiText)}

          {aiLoading && aiText && (
            <div className="flex items-center gap-2 text-violet-500 text-xs font-bold mt-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse [animation-delay:200ms]" />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse [animation-delay:400ms]" />
            </div>
          )}

          {aiDone && (
            <div className="mt-4 pt-4 border-t border-violet-200 flex items-center gap-2 text-[10px] text-violet-500 font-bold">
              <CheckCircle2 size={12} className="text-emerald-500" />
              Analyse générée à partir des plages Goliath — vérifiez avec un nutritionniste pour des décisions critiques.
            </div>
          )}
        </div>
      )}

      {/* Barre d'actions finale */}
      {hasData && (
        <div className="flex flex-col sm:flex-row gap-3 print:hidden">
          <button
            onClick={handleSave}
            disabled={isSaving || selectedIngredients.length === 0}
            className={`flex-1 flex items-center justify-center gap-2 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg ${
              savedOk ? 'bg-emerald-500 text-white shadow-emerald-500/30' :
              isSaving ? 'bg-pink-200 text-pink-400 cursor-wait' :
              'bg-gradient-to-r from-pink-600 to-pink-400 text-white hover:from-pink-500 hover:to-pink-300 shadow-pink-500/30 active:scale-95'
            }`}
          >
            {isSaving ? <RotateCcw className="animate-spin" size={16} /> :
             savedOk ? <Check size={16} /> :
             <Save size={16} />}
            {savedOk ? 'Formule enregistrée !' : isSaving ? 'Enregistrement…' : 'Enregistrer la formule'}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 py-5 px-6 rounded-2xl font-black text-[11px] uppercase tracking-widest bg-white border border-pink-200 text-pink-700 hover:bg-pink-50 transition-all"
          >
            <Printer size={14} /> Imprimer
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 py-5 px-6 rounded-2xl font-black text-[11px] uppercase tracking-widest bg-white border border-pink-200 text-pink-700 hover:bg-pink-50 transition-all"
          >
            {copiedOk ? <Check size={14} /> : <Copy size={14} />}
            {copiedOk ? 'Copié !' : 'Copier'}
          </button>
        </div>
      )}

      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-2 text-sm text-red-700 font-bold print:hidden">
          <AlertTriangle size={16} /> {saveError}
        </div>
      )}
    </div>
  )
}