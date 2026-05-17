// src/utils/nutritionCalculations.ts
// v2 : Recommandations basées sur le centrage dans la plage, pas seulement les bornes

import type { SelectedIngredient, FormulaTotals } from '../types/ingredients'
import type { AnimalRequirement } from '../types/animalRequirements'

export const calculateTotals = (
  ingredients: SelectedIngredient[],
): FormulaTotals => {
  const totals: FormulaTotals = {
    weight: 0, cost: 0,
    ms: 0, cb: 0, mg: 0, em: 0, en: 0,
    pb: 0, lys: 0, met: 0, aas: 0, ca: 0, p: 0, na: 0,
  }

  ingredients.forEach((ing) => {
    const qty   = ing.quantity || 0
    const price = ing.price    || 0

    totals.weight += qty
    totals.cost   += qty * price
    totals.ms     += (ing.ms  || 0) * qty
    totals.cb     += (ing.cb  || 0) * qty
    totals.mg     += (ing.mg  || 0) * qty
    totals.em     += (ing.em  || 0) * qty
    totals.en     += (ing.en  || 0) * qty
    totals.pb     += (ing.pb  || 0) * qty
    totals.lys    += (ing.lys || 0) * qty
    totals.met    += (ing.met || 0) * qty
    totals.aas    += (ing.aas || 0) * qty
    totals.ca     += (ing.ca  || 0) * qty
    totals.p      += (ing.p   || 0) * qty
    totals.na     += (ing.na  || 0) * qty
  })

  return totals
}

export const getFinalValues = (totals: FormulaTotals): FormulaTotals => {
  const weight = totals.weight || 1
  return {
    ...totals,
    ms:  totals.ms  / weight,
    cb:  totals.cb  / weight,
    mg:  totals.mg  / weight,
    em:  totals.em  / weight,
    en:  totals.en  / weight,
    pb:  totals.pb  / weight,
    lys: totals.lys / weight,
    met: totals.met / weight,
    aas: totals.aas / weight,
    ca:  totals.ca  / weight,
    p:   totals.p   / weight,
    na:  totals.na  / weight,
  }
}

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface Recommendation {
  type: 'success' | 'warning' | 'error' | 'info'
  message: string
  nutrient: string
  /** Pourcentage de la plage atteint (0=min, 50=centre, 100=max) */
  fillPct: number
  /** true si la valeur est dans les 80% centraux */
  isCentered: boolean
}

// ─── RECOMMANDATIONS v2 ───────────────────────────────────────────────────────

const IDEAL_MARGIN = 0.80 // 80% centraux = zone "optimal"

export const generateRecommendations = (
  totals: FormulaTotals,
  requirement: AnimalRequirement | undefined,
): Recommendation[] => {
  if (!requirement || totals.weight === 0) return []

  const final = getFinalValues(totals)
  const recs: Recommendation[] = []

  const check = (
    val: number,
    range: { min: number; max: number },
    name: string,
    unit: string,
  ) => {
    const { min, max } = range
    const plage = max - min || 1
    const center = (min + max) / 2
    const halfRange = plage / 2

    // Position dans la plage (0% = min, 100% = max)
    const fillPct = Math.min(Math.max(((val - min) / plage) * 100, 0), 100)

    // Zone idéale : [center - halfRange*IDEAL_MARGIN, center + halfRange*IDEAL_MARGIN]
    const idealMin = center - halfRange * IDEAL_MARGIN
    const idealMax = center + halfRange * IDEAL_MARGIN
    const isCentered = val >= idealMin && val <= idealMax

    if (val < min) {
      recs.push({
        type: 'error',
        message: `${name} insuffisant : ${val.toFixed(2)}${unit} (min requis : ${min}${unit}). Augmentez les sources riches en ${name}.`,
        nutrient: name,
        fillPct: 0,
        isCentered: false,
      })
    } else if (val > max) {
      recs.push({
        type: 'warning',
        message: `${name} trop élevé : ${val.toFixed(2)}${unit} (max : ${max}${unit}). Réduisez les apports.`,
        nutrient: name,
        fillPct: 100,
        isCentered: false,
      })
    } else if (isCentered) {
      recs.push({
        type: 'success',
        message: `${name} optimal : ${val.toFixed(2)}${unit} — bien centré dans la plage cible (${min}–${max}${unit}).`,
        nutrient: name,
        fillPct,
        isCentered: true,
      })
    } else {
      // Dans la plage mais pas centré
      const direction = val < center ? 'légèrement bas' : 'légèrement haut'
      recs.push({
        type: 'info',
        message: `${name} acceptable mais ${direction} : ${val.toFixed(2)}${unit} (cible idéale ≈ ${center.toFixed(2)}${unit}).`,
        nutrient: name,
        fillPct,
        isCentered: false,
      })
    }
  }

  check(final.em,  requirement.em,  'Énergie (EM)',    ' kcal/kg')
  check(final.pb,  requirement.pb,  'Protéine (PB)',   '%')
  check(final.lys, requirement.lys, 'Lysine',          '%')
  check(final.met, requirement.met, 'Méthionine',      '%')
  check(final.ca,  requirement.ca,  'Calcium',         '%')
  check(final.p,   requirement.p,   'Phosphore',       '%')

  return recs
}

// ─── SCORE GLOBAL DE QUALITÉ NUTRITIONNELLE ───────────────────────────────────

/**
 * Retourne un score de 0 à 100 basé sur le centrage de chaque nutriment.
 * 100 = tous les nutriments parfaitement centrés dans leur plage idéale.
 */
export const computeNutritionScore = (
  totals: FormulaTotals,
  requirement: AnimalRequirement | undefined,
): number => {
  if (!requirement || totals.weight === 0) return 0

  const final = getFinalValues(totals)

  const checks = [
    { val: final.em,  range: requirement.em  },
    { val: final.pb,  range: requirement.pb  },
    { val: final.lys, range: requirement.lys },
    { val: final.met, range: requirement.met },
    { val: final.ca,  range: requirement.ca  },
    { val: final.p,   range: requirement.p   },
  ].filter(c => c.range.max > 0)

  if (checks.length === 0) return 0

  let totalScore = 0
  for (const { val, range } of checks) {
    const { min, max } = range
    const plage = max - min || 1
    const center = (min + max) / 2

    if (val < min || val > max) {
      // Hors plage : score proportionnel à la distance
      const dist = val < min ? min - val : val - max
      totalScore += Math.max(0, 40 - (dist / plage) * 100)
    } else {
      // Dans la plage : 100 si au centre, 60 si aux bords
      const distFromCenter = Math.abs(val - center) / (plage / 2)
      totalScore += 100 - distFromCenter * 40
    }
  }

  return Math.round(totalScore / checks.length)
}