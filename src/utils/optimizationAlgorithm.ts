/**
 * optimizationAlgorithm.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * VERSION 7 — Solveur LP (Programmation Linéaire) industriel
 *
 * Utilise le solveur Simplexe de javascript-lp-solver pour garantir que la
 * formule respecte les plages nutritionnelles ET minimise le coût.
 *
 * STRATÉGIE :
 *   1. Auto-injection des ingrédients essentiels manquants
 *   2. Construction du modèle LP avec :
 *      - Variables : quantité (%) de chaque ingrédient
 *      - Contrainte de somme : Σxᵢ = 100
 *      - Bornes individuelles : lb ≤ xᵢ ≤ ub (selon phase)
 *      - Contraintes nutritionnelles : min ≤ Σ(valᵢⱼ × xᵢ)/100 ≤ max
 *      - Objectif : minimiser coût total
 *   3. Si infaisable : relaxation cascadée des bornes max (par ordre de priorité)
 *      jusqu'à obtenir une solution dans les plages
 *   4. Si encore infaisable : solveur de minimum violation (moindres carrés)
 *
 * GARANTIE : Si une solution existe avec les ingrédients sélectionnés,
 *           l'algorithme la trouve. Sinon, retourne la solution la plus
 *           proche des plages avec un message clair.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { SelectedIngredient } from '../types/ingredients'
import type { AnimalRequirement }   from '../types/animalRequirements'
import { ingredientsDatabase }      from '../data/ingredientsDatabase'
import solver from 'javascript-lp-solver'

// Types pour le solver LP (compatibles avec les types officiels de javascript-lp-solver)
type LPModel = {
  optimize: string
  opType: 'min' | 'max'
  constraints: Record<string, { min?: number; max?: number; equal?: number }>
  variables: Record<string, Record<string, number>>
}

type LPSolveResult = {
  feasible: boolean
  result: number
  bounded?: boolean
  [ingredientId: string]: number | boolean | undefined
}

// ─── CONSTANTES ───────────────────────────────────────────────────────────────

const IDEAL_MARGIN = 0.80

// ─── TYPES ────────────────────────────────────────────────────────────────────

type PhaseKey = 'chair_starter' | 'chair_grower' | 'layer_starter' | 'layer_grower' | 'layer_pullet' | 'layer_production'

export interface OptimizationQuality {
  score: number
  allOptimal: boolean
  nutrients: {
    key: string; label: string; value: number
    min: number; max: number; center: number
    status: 'optimal' | 'acceptable' | 'warning'
  }[]
}

export interface SafetyAlert {
  level: 'error' | 'warning'
  message: string
  ingredientId?: string
}

interface NutrientSpec {
  key: 'em' | 'pb' | 'ca' | 'p' | 'lys' | 'met'
  label: string
  min: number
  max: number
}

// ─── DÉTERMINATION DE LA PHASE ────────────────────────────────────────────────

function getPhaseKey(requirement: AnimalRequirement): PhaseKey {
  const req = requirement as AnimalRequirement & { phaseKey?: PhaseKey }
  if (req.phaseKey) return req.phaseKey
  const stage = requirement.stage?.toLowerCase() ?? ''
  if (stage.includes('démarrage') && stage.includes('ponte')) return 'layer_starter'
  if (stage.includes('démarrage'))                             return 'chair_starter'
  if (stage.includes('croissance') && stage.includes('ponte')) return 'layer_grower'
  if (stage.includes('croissance'))                            return 'chair_grower'
  if (stage.includes('poulette'))                              return 'layer_pullet'
  if (stage.includes('ponte'))                                 return 'layer_production'
  return 'chair_grower'
}

// ─── BORNES PAR PHASE ─────────────────────────────────────────────────────────

function getBounds(ing: SelectedIngredient, phase: PhaseKey): { lb: number; ub: number } {
  const dbIng = ingredientsDatabase.find(i => i.id === ing.id)
  const b = dbIng?.phaseBounds?.[phase]
  if (b) return { lb: b.min, ub: b.max }
  return { lb: 0, ub: 100 }
}

function adjustBounds(
  ing: SelectedIngredient,
  phase: PhaseKey,
  bounds: { lb: number; ub: number }
): { lb: number; ub: number } {
  const id = ing.id
  let { lb, ub } = bounds

  // Premix toujours présent (0.25-0.5%)
  if (id === 'premix') {
    lb = Math.max(lb, 0.25)
    ub = Math.min(ub === 100 ? 0.5 : ub, 0.5)
  }
  // Sel
  if (id === 'nacl') {
    lb = Math.max(lb, 0.2)
    ub = Math.min(ub === 100 ? 0.5 : ub, 0.5)
  }
  // Phosphate bicalcique
  if (id === 'phosphate_bicalcique') {
    ub = Math.min(ub === 100 ? 2.5 : ub, 2.5)
  }
  // AA synthétiques
  if (id === 'lysine' || id === 'methionine') {
    ub = Math.min(ub === 100 ? 0.5 : ub, 0.5)
  }
  // Coquille en ponte production : permettre jusqu'à 12%
  if (phase === 'layer_production') {
    if (id === 'coquille_huitre' || id === 'coquille_escargot' || id === 'calcaire_broye') {
      ub = Math.max(ub, 12)
    }
  }

  return { lb, ub }
}

// ─── BESOINS NUTRITIONNELS ────────────────────────────────────────────────────

function getNutrientSpecs(req: AnimalRequirement): NutrientSpec[] {
  return [
    { key: 'em',  label: 'Énergie (EM)',     min: req.em.min,  max: req.em.max  },
    { key: 'pb',  label: 'Protéines brutes', min: req.pb.min,  max: req.pb.max  },
    { key: 'ca',  label: 'Calcium',          min: req.ca.min,  max: req.ca.max  },
    { key: 'p',   label: 'Phosphore',        min: req.p.min,   max: req.p.max   },
    { key: 'lys', label: 'Lysine',           min: req.lys.min, max: req.lys.max },
    { key: 'met', label: 'Méthionine',       min: req.met.min, max: req.met.max },
  ]
}

function getNutrientValue(ing: SelectedIngredient, key: NutrientSpec['key']): number {
  switch (key) {
    case 'em':  return ing.em
    case 'pb':  return ing.pb
    case 'ca':  return ing.ca
    case 'p':   return ing.p
    case 'lys': return ing.lys
    case 'met': return ing.met
  }
}

function computeTotals(formula: SelectedIngredient[], specs: NutrientSpec[]): Record<string, number> {
  const totals: Record<string, number> = {}
  for (const spec of specs) {
    let sum = 0
    for (const ing of formula) {
      sum += getNutrientValue(ing, spec.key) * ing.quantity
    }
    totals[spec.key] = sum / 100
  }
  return totals
}

// ─── AUTO-COMPLÉTION ─────────────────────────────────────────────────────────

function autoCompletePool(
  formula: SelectedIngredient[],
  phase: PhaseKey
): SelectedIngredient[] {
  const result: SelectedIngredient[] = formula.map(f => ({ ...f }))
  const has = (id: string) => result.some(i => i.id === id)
  const inject = (id: string) => {
    if (has(id)) return
    const db = ingredientsDatabase.find(i => i.id === id)
    if (!db) return
    result.push({
      ...db,
      quantity: 0,
      price: db.defaultPrice || 0,
    } as SelectedIngredient)
  }

  // Céréale énergétique
  if (!result.some(i => ['mais', 'sorgho', 'mil', 'ble', 'riz_brise'].includes(i.id))) {
    inject('mais')
  }

  // Source protéique principale
  if (!result.some(i =>
    ['tourteau_soja', 'soja_graine', 'tourteau_arachide', 'farine_poisson', 'tourteau_coton'].includes(i.id)
  )) {
    inject('tourteau_soja')
  }

  // Démarrage : besoins très élevés en EM+PB simultanément → 
  // forcer l'injection de soja_graine (EM=3900, PB=37) qui est essentiel pour faisabilité
  if (phase === 'chair_starter' || phase === 'layer_starter') {
    if (!has('soja_graine')) inject('soja_graine')
    const proteinCount = result.filter(i =>
      ['tourteau_soja', 'soja_graine', 'tourteau_arachide', 'farine_poisson'].includes(i.id)
    ).length
    if (proteinCount < 2) inject('farine_poisson')
  }
  
  // Croissance chair : aussi besoin de haute énergie → soja_graine recommandé
  if (phase === 'chair_grower') {
    if (!has('soja_graine')) inject('soja_graine')
  }

  // Croissance ponte et ponte production : Goliath utilise soja_graine (10kg, 13kg)
  // pour atteindre EM>=2900 avec PB>=19/17
  if (phase === 'layer_grower' || phase === 'layer_production') {
    if (!has('soja_graine')) inject('soja_graine')
  }

  // Poulette (9-20 sem) : besoins PB modérés (16-18%) mais Lys/P plafonnés bas.
  // Si seulement maïs+TS dans le pool, le TS sature très vite Lys (2.7%) et P (0.7%).
  // Goliath utilise : maïs + son de blé + tourteau de palmiste + tourteau de coton + coquille + soja_graine
  // → on injecte du son de blé (dilueur Lys/P) et du tourteau de palmiste (protéine pauvre en Lys)
  if (phase === 'layer_pullet') {
    if (!has('son_ble') && !has('son_riz')) inject('son_ble')
    // Si la seule protéine est tourteau_soja, ajouter une protéine plus pauvre en Lys
    const proteins = result.filter(i =>
      ['tourteau_soja', 'soja_graine', 'tourteau_arachide', 'tourteau_coton', 'tourteau_palmiste', 'farine_poisson'].includes(i.id)
    )
    if (proteins.length === 1 && proteins[0].id === 'tourteau_soja') {
      // Privilégier le tourteau de palmiste (pauvre en Lys), fallback tourteau de coton
      if (!has('tourteau_palmiste')) inject('tourteau_palmiste')
      else if (!has('tourteau_coton')) inject('tourteau_coton')
    }
  }

  // Calcium
  if (!has('coquille_huitre') && !has('coquille_escargot') && !has('calcaire_broye')) {
    inject('coquille_huitre')
  }

  // Phosphate
  if (!has('phosphate_bicalcique')) inject('phosphate_bicalcique')

  // Premix
  if (!has('premix')) inject('premix')

  // Sel
  if (!has('nacl')) inject('nacl')

  // AA synthétiques
  if (!has('lysine')) inject('lysine')
  if (!has('methionine')) inject('methionine')

  return result
}

// ─── CATÉGORIE POUR RELAXATION ───────────────────────────────────────────────

function getRelaxationCategory(ingId: string): 'cereal' | 'protein' | 'calcium' | 'phosphate' | 'other' | 'none' {
  if (['mais', 'sorgho', 'mil', 'ble', 'riz_brise'].includes(ingId)) return 'cereal'
  if (['tourteau_soja', 'soja_graine', 'tourteau_arachide', 'tourteau_coton',
       'tourteau_palmiste', 'tourteau_coprah', 'tourteau_sesame', 'tourteau_colza',
       'farine_poisson', 'farine_viande', 'farine_sang', 'farine_os',
       'farine_insectes'].includes(ingId)) return 'protein'
  if (['coquille_huitre', 'coquille_escargot', 'calcaire_broye'].includes(ingId)) return 'calcium'
  if (['phosphate_bicalcique'].includes(ingId)) return 'phosphate'
  if (['premix', 'nacl', 'lysine', 'methionine', 'sulfate_fer'].includes(ingId)) return 'none'
  return 'other'
}

// ─── CONSTRUCTION DU MODÈLE LP ───────────────────────────────────────────────

interface LPResult {
  feasible: boolean
  quantities: Record<string, number>
  cost: number
}

function buildAndSolveLP(
  formula: SelectedIngredient[],
  specs: NutrientSpec[],
  phase: PhaseKey,
  relaxation: Record<string, number>,
): LPResult {
  // Construction du modèle LP au format JSON
  const variables: Record<string, Record<string, number>> = {}
  const constraints: Record<string, { min?: number; max?: number; equal?: number }> = {}

  // Variables : une par ingrédient
  for (const ing of formula) {
    const bounds = adjustBounds(ing, phase, getBounds(ing, phase))
    const relax = relaxation[ing.id] || 0
    const effectiveUb = Math.min(100, bounds.ub + relax)

    const varDef: Record<string, number> = {
      // Coût (à minimiser)
      cost: ing.price || ingredientsDatabase.find(i => i.id === ing.id)?.defaultPrice || 0,
      // Contrainte de somme (chaque variable contribue 1 à la somme)
      sum: 1,
    }

    // Contributions nutritionnelles : pour chaque nutriment, valeur/100
    // car Σ(val_i × x_i) / 100 doit être ∈ [min, max]
    for (const spec of specs) {
      varDef[spec.key] = getNutrientValue(ing, spec.key) / 100
    }

    // Bornes individuelles via contrainte propre
    varDef[`bnd_${ing.id}_lb`] = 1
    varDef[`bnd_${ing.id}_ub`] = 1

    variables[ing.id] = varDef

    // Bornes individuelles
    constraints[`bnd_${ing.id}_lb`] = { min: bounds.lb }
    constraints[`bnd_${ing.id}_ub`] = { max: effectiveUb }
  }

  // Contrainte de somme : Σxᵢ = 100
  constraints.sum = { equal: 100 }

  // Contraintes nutritionnelles avec marge intérieure pour éviter les bornes pile
  for (const spec of specs) {
    const range = spec.max - spec.min
    // Marge de 5% du range vers l'intérieur, mais pas plus de 5% de la valeur
    const margin = Math.min(range * 0.01, 0.05)
    constraints[spec.key] = {
      min: spec.min + margin,
      max: spec.max - margin,
    }
  }

  const model: LPModel = {
    optimize: 'cost',
    opType: 'min',
    constraints,
    variables,
  }

  try {
    const result = solver.Solve(model) as LPSolveResult

    if (!result.feasible) {
      return { feasible: false, quantities: {}, cost: 0 }
    }

    const quantities: Record<string, number> = {}
    for (const ing of formula) {
      quantities[ing.id] = (result[ing.id] as number) || 0
    }

    return { feasible: true, quantities, cost: result.result || 0 }
  } catch {
    return { feasible: false, quantities: {}, cost: 0 }
  }
}

// ─── PHASE FALLBACK : MINIMISATION DES VIOLATIONS ────────────────────────────

/**
 * Si même avec relaxation maximale le LP est infaisable, on utilise un
 * modèle qui minimise les violations (l'somme des distances aux plages).
 * Chaque nutriment a 2 variables d'écart (under, over) qu'on pénalise fortement.
 */
function buildAndSolveMinViolation(
  formula: SelectedIngredient[],
  specs: NutrientSpec[],
  phase: PhaseKey,
  relaxation: Record<string, number>
): LPResult {
  const variables: Record<string, Record<string, number>> = {}
  const constraints: Record<string, { min?: number; max?: number; equal?: number }> = {}

  // Variables d'ingrédients
  for (const ing of formula) {
    const bounds = adjustBounds(ing, phase, getBounds(ing, phase))
    const relax = relaxation[ing.id] || 0
    const effectiveUb = Math.min(100, bounds.ub + relax)

    const varDef: Record<string, number> = {
      penalty: 0.001 * (ing.price || ingredientsDatabase.find(i => i.id === ing.id)?.defaultPrice || 0),
      sum: 1,
    }

    for (const spec of specs) {
      varDef[`nut_${spec.key}`] = getNutrientValue(ing, spec.key) / 100
    }

    varDef[`bnd_${ing.id}_lb`] = 1
    varDef[`bnd_${ing.id}_ub`] = 1

    variables[ing.id] = varDef

    constraints[`bnd_${ing.id}_lb`] = { min: bounds.lb }
    constraints[`bnd_${ing.id}_ub`] = { max: effectiveUb }
  }

  // Variables d'écart : pour chaque nutriment, "under" et "over"
  for (const spec of specs) {
    // Poids des pénalités : tous les nutriments doivent être respectés.
    // PB et Ca sont critiques car directement liés à la croissance/coquille.
    // Lys, P, Met ont aussi un impact sanitaire fort → poids relevés.
    const w =
      spec.key === 'pb'  ? 200 :
      spec.key === 'ca'  ? 150 :
      spec.key === 'p'   ? 120 :
      spec.key === 'lys' ? 100 :
      spec.key === 'met' ? 100 :
                            80   // em

    // Variable "under_X" : combien il manque par rapport à min_X
    variables[`under_${spec.key}`] = {
      penalty: w,
      [`nut_${spec.key}`]: 1, // ajoute virtuellement au total
    }
    // Variable "over_X" : combien on dépasse max_X
    variables[`over_${spec.key}`] = {
      penalty: w,
      [`nut_${spec.key}`]: -1, // retire virtuellement du total
    }

    constraints[`nut_${spec.key}`] = { min: spec.min, max: spec.max }
  }

  constraints.sum = { equal: 100 }

  const model: LPModel = {
    optimize: 'penalty',
    opType: 'min',
    constraints,
    variables,
  }

  try {
    const result = solver.Solve(model) as LPSolveResult

    if (!result.feasible) {
      return { feasible: false, quantities: {}, cost: 0 }
    }

    const quantities: Record<string, number> = {}
    for (const ing of formula) {
      quantities[ing.id] = (result[ing.id] as number) || 0
    }

    return { feasible: true, quantities, cost: result.result || 0 }
  } catch {
    return { feasible: false, quantities: {}, cost: 0 }
  }
}

// ─── VÉRIFICATION STRICTE DES PLAGES ────────────────────────────────────────
// Le solveur LP peut, dans de rares cas, renvoyer « faisable » une solution
// qui ne respecte pas réellement les plages. On revérifie nous-mêmes.
function quantitiesInRange(
  quantities: Record<string, number>,
  formula: SelectedIngredient[],
  specs: NutrientSpec[]
): boolean {
  for (const spec of specs) {
    let sum = 0
    for (const ing of formula) sum += getNutrientValue(ing, spec.key) * (quantities[ing.id] || 0)
    const value = sum / 100
    const eps = Math.max((spec.max - spec.min) * 0.01, 0.01)
    if (value < spec.min - eps || value > spec.max + eps) return false
  }
  return true
}

// ─── FONCTION PRINCIPALE ──────────────────────────────────────────────────────

export function optimizeFormula(
  selected: SelectedIngredient[],
  requirement: AnimalRequirement
): SelectedIngredient[] {
  if (!selected || selected.length === 0) return []

  const phase = getPhaseKey(requirement)
  const specs = getNutrientSpecs(requirement)

  // 1. Auto-complétion
  let formula = autoCompletePool(selected, phase)

  // Une solution n'est acceptée que si elle est faisable ET réellement dans les plages
  const ok = (r: LPResult) => r.feasible && quantitiesInRange(r.quantities, formula, specs)

  // 2. Tentative LP sans relaxation
  let result = buildAndSolveLP(formula, specs, phase, {})

  // 3. Si pas dans les plages, relaxation cascadée
  if (!ok(result)) {
    const relaxationLevels = [
      { protein: 5, cereal: 0, calcium: 2, phosphate: 1, other: 5 },
      { protein: 15, cereal: 5, calcium: 5, phosphate: 2, other: 10 },
      { protein: 30, cereal: 10, calcium: 10, phosphate: 3, other: 20 },
      { protein: 50, cereal: 25, calcium: 20, phosphate: 5, other: 40 },
      { protein: 70, cereal: 40, calcium: 30, phosphate: 8, other: 60 },
    ]

    for (const level of relaxationLevels) {
      const boundsRelaxation: Record<string, number> = {}
      for (const ing of formula) {
        const cat = getRelaxationCategory(ing.id)
        if (cat === 'none') continue
        if (cat === 'cereal') boundsRelaxation[ing.id] = level.cereal
        else if (cat === 'protein') boundsRelaxation[ing.id] = level.protein
        else if (cat === 'calcium') boundsRelaxation[ing.id] = level.calcium
        else if (cat === 'phosphate') boundsRelaxation[ing.id] = level.phosphate
        else boundsRelaxation[ing.id] = level.other
      }

      result = buildAndSolveLP(formula, specs, phase, boundsRelaxation)
      if (ok(result)) break
    }
  }

  // 4. Si toujours pas dans les plages, fallback : minimisation des violations
  if (!ok(result)) {
    const maxRelaxation: Record<string, number> = {}
    for (const ing of formula) {
      const cat = getRelaxationCategory(ing.id)
      if (cat === 'none') continue
      maxRelaxation[ing.id] = 80
    }
    result = buildAndSolveMinViolation(formula, specs, phase, maxRelaxation)
  }

  // 5. Construction du résultat final
  if (!result.feasible) {
    // Cas extrême : on retourne la formule avec quantités par défaut Goliath
    return fallbackGoliath(formula, phase)
  }

  // Appliquer les quantités trouvées
  for (const ing of formula) {
    ing.quantity = result.quantities[ing.id] || 0
  }

  // Filtrer les ingrédients à quantité quasi-nulle
  formula = formula.filter(ing => ing.quantity > 0.01)

  // Arrondir à 2 décimales
  for (const ing of formula) {
    ing.quantity = Math.round(ing.quantity * 100) / 100
  }

  // Normalisation Σ = 100 : mise à l'échelle proportionnelle.
  // Comme une concentration = Σ(val·q)/Σq, un simple facteur d'échelle ne
  // déséquilibre AUCUN nutriment (contrairement à l'ancien report sur 1 ingrédient).
  const totalQty = formula.reduce((s, i) => s + i.quantity, 0)
  if (totalQty > 0 && Math.abs(totalQty - 100) > 0.001) {
    for (const ing of formula) {
      ing.quantity = Math.round((ing.quantity * 100 / totalQty) * 100) / 100
    }
  }

  return formula
}

// ─── FALLBACK GOLIATH ─────────────────────────────────────────────────────────

function fallbackGoliath(formula: SelectedIngredient[], phase: PhaseKey): SelectedIngredient[] {
  const targets: Record<PhaseKey, Record<string, number>> = {
    chair_starter: {
      mais: 50, tourteau_soja: 22, soja_graine: 10, farine_poisson: 6,
      coquille_huitre: 1.5, phosphate_bicalcique: 1.5, premix: 0.4, nacl: 0.35,
      lysine: 0.15, methionine: 0.15,
    },
    chair_grower: {
      mais: 48, sorgho: 5, tourteau_soja: 14, soja_graine: 18, farine_poisson: 4,
      son_ble: 3, coquille_huitre: 1.5, phosphate_bicalcique: 1.5,
      premix: 0.4, nacl: 0.35, lysine: 0.1, methionine: 0.1,
    },
    layer_starter: {
      mais: 50, tourteau_soja: 22, soja_graine: 8, farine_poisson: 6,
      coquille_huitre: 1.5, phosphate_bicalcique: 1.5, premix: 0.4, nacl: 0.35,
      lysine: 0.15, methionine: 0.15,
    },
    layer_grower: {
      mais: 48, sorgho: 5, tourteau_soja: 12, soja_graine: 10, farine_poisson: 5,
      son_ble: 10, coquille_huitre: 2, phosphate_bicalcique: 1.5,
      premix: 0.4, nacl: 0.35, lysine: 0.1, methionine: 0.1,
    },
    layer_pullet: {
      mais: 50, sorgho: 5, tourteau_soja: 8, soja_graine: 5, tourteau_arachide: 8,
      farine_poisson: 3, son_ble: 12, coquille_huitre: 2.5, phosphate_bicalcique: 1.2,
      premix: 0.4, nacl: 0.35, lysine: 0.1, methionine: 0.1,
    },
    layer_production: {
      mais: 50, tourteau_soja: 15, soja_graine: 13, farine_poisson: 4,
      coquille_huitre: 8.5, phosphate_bicalcique: 1.5, premix: 0.4, nacl: 0.35,
      lysine: 0.1, methionine: 0.1,
    },
  }

  const phaseTargets = targets[phase] || {}
  for (const ing of formula) {
    ing.quantity = phaseTargets[ing.id] || 0
  }

  // Normaliser Σ = 100
  const total = formula.reduce((s, i) => s + i.quantity, 0)
  if (total > 0 && Math.abs(total - 100) > 0.01) {
    for (const ing of formula) {
      ing.quantity = ing.quantity * 100 / total
      ing.quantity = Math.round(ing.quantity * 100) / 100
    }
  }
  return formula.filter(i => i.quantity > 0.01)
}

// ─── QUALITÉ DE L'OPTIMISATION ───────────────────────────────────────────────

export function computeOptimizationQuality(
  formula: SelectedIngredient[],
  requirement: AnimalRequirement
): OptimizationQuality {
  const specs = getNutrientSpecs(requirement)
  const totals = computeTotals(formula, specs)

  const nutrients = specs.map(spec => {
    const value = totals[spec.key]
    const center = (spec.min + spec.max) / 2
    const halfRange = (spec.max - spec.min) / 2
    const distance = Math.abs(value - center)

    // Tolérance epsilon : 0.5% du range, minimum 0.005 (pour pourcentages comme 18.0 dans [16-18])
    // Évite les faux "hors plage" causés par l'arithmétique flottante du LP solver
    const eps = Math.max((spec.max - spec.min) * 0.005, 0.005)

    let status: 'optimal' | 'acceptable' | 'warning'
    if (value < spec.min - eps || value > spec.max + eps) {
      status = 'warning'
    } else if (halfRange > 0 && distance / halfRange <= IDEAL_MARGIN) {
      status = 'optimal'
    } else {
      status = 'acceptable'
    }

    return {
      key: spec.key,
      label: spec.label,
      value,
      min: spec.min,
      max: spec.max,
      center,
      status,
    }
  })

  const optimalCount = nutrients.filter(n => n.status === 'optimal').length
  const acceptableCount = nutrients.filter(n => n.status === 'acceptable').length
  const warningCount = nutrients.filter(n => n.status === 'warning').length
  const total = nutrients.length

  let score: number
  if (warningCount === 0) {
    score = Math.round((optimalCount * 100 + acceptableCount * 75) / total)
  } else {
    score = Math.round((optimalCount * 100 + acceptableCount * 75 + warningCount * 25) / total)
  }

  return {
    score,
    allOptimal: warningCount === 0 && acceptableCount === 0,
    nutrients,
  }
}

// ─── ALERTES DE SÉCURITÉ ─────────────────────────────────────────────────────

export function detectSafetyAlerts(
  formula: SelectedIngredient[],
  requirement: AnimalRequirement
): SafetyAlert[] {
  const alerts: SafetyAlert[] = []
  const phase = getPhaseKey(requirement)

  for (const ing of formula) {
    const dbIng = ingredientsDatabase.find(i => i.id === ing.id)
    if (!dbIng) continue

    const bounds = dbIng.phaseBounds?.[phase]
    if (bounds && ing.quantity > bounds.max + 0.5) {
      alerts.push({
        level: 'warning',
        message: `${ing.name} : ${ing.quantity.toFixed(1)}% dépasse la limite recommandée (${bounds.max}%) pour cette phase`,
        ingredientId: ing.id,
      })
    }

    if (dbIng.safetyNote && ing.quantity > 0) {
      alerts.push({
        level: 'warning',
        message: `${ing.name} : ${dbIng.safetyNote}`,
        ingredientId: ing.id,
      })
    }
  }

  return alerts
}