// Correction TS1484 : Ajout de "type" pour les importations d'interfaces
import type { SelectedIngredient, FormulaTotals } from '../types/ingredients'
import type { AnimalRequirement } from '../types/animalRequirements'

export const calculateTotals = (
  ingredients: SelectedIngredient[],
): FormulaTotals => {
  const totals: FormulaTotals = {
    weight: 0,
    cost: 0,
    ms: 0,
    cb: 0,
    mg: 0,
    em: 0,
    en: 0,
    pb: 0,
    lys: 0,
    met: 0,
    aas: 0,
    ca: 0,
    p: 0,
    na: 0,
  }

  ingredients.forEach((ing) => {
    const qty = ing.quantity || 0
    const price = ing.price || 0

    totals.weight += qty
    totals.cost += qty * price

    // Calcul de la contribution nutritionnelle brute
    totals.ms += ing.ms * qty
    totals.cb += ing.cb * qty
    totals.mg += ing.mg * qty
    totals.em += ing.em * qty
    totals.en += ing.en * qty
    totals.pb += ing.pb * qty
    totals.lys += ing.lys * qty
    totals.met += ing.met * qty
    totals.aas += ing.aas * qty
    totals.ca += ing.ca * qty
    totals.p += ing.p * qty
    totals.na += ing.na * qty
  })

  return totals
}

export const getFinalValues = (totals: FormulaTotals): FormulaTotals => {
  const weight = totals.weight || 1 // Évite la division par zéro
  return {
    ...totals,
    ms: totals.ms / weight,
    cb: totals.cb / weight,
    mg: totals.mg / weight,
    em: totals.em / weight,
    en: totals.en / weight,
    pb: totals.pb / weight,
    lys: totals.lys / weight,
    met: totals.met / weight,
    aas: totals.aas / weight,
    ca: totals.ca / weight,
    p: totals.p / weight,
    na: totals.na / weight,
  }
}

export interface Recommendation {
  type: 'success' | 'warning' | 'error'
  message: string
  nutrient: string
}

export const generateRecommendations = (
  totals: FormulaTotals,
  requirement: AnimalRequirement | undefined,
): Recommendation[] => {
  if (!requirement || totals.weight === 0) return []

  const final = getFinalValues(totals)
  const recs: Recommendation[] = []

  // Fonction utilitaire pour vérifier les plages
  const check = (
    val: number,
    range: { min: number; max: number },
    name: string,
    unit: string,
  ) => {
    if (val < range.min) {
      recs.push({
        type: 'warning',
        message: `Niveau de ${name} trop bas (${val.toFixed(2)}${unit}). Cible: ${range.min}-${range.max}${unit}.`,
        nutrient: name,
      })
    } else if (val > range.max) {
      recs.push({
        type: 'warning',
        message: `Niveau de ${name} trop élevé (${val.toFixed(2)}${unit}). Cible: ${range.min}-${range.max}${unit}.`,
        nutrient: name,
      })
    } else {
      recs.push({
        type: 'success',
        message: `${name} optimal (${val.toFixed(2)}${unit})`,
        nutrient: name,
      })
    }
  }

  check(final.em, requirement.em, 'Énergie (EM)', ' kcal')
  check(final.pb, requirement.pb, 'Protéine (PB)', '%')
  check(final.lys, requirement.lys, 'Lysine', '%')
  check(final.met, requirement.met, 'Méthionine', '%')
  check(final.ca, requirement.ca, 'Calcium', '%')
  check(final.p, requirement.p, 'Phosphore', '%')

  return recs
}