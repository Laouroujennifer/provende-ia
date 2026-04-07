// src/utils/nutritionCalculations.ts

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
    totals.ms += (ing.ms || 0) * qty
    totals.cb += (ing.cb || 0) * qty
    totals.mg += (ing.mg || 0) * qty
    totals.em += (ing.em || 0) * qty
    totals.en += (ing.en || 0) * qty
    totals.pb += (ing.pb || 0) * qty
    totals.lys += (ing.lys || 0) * qty
    totals.met += (ing.met || 0) * qty
    totals.aas += (ing.aas || 0) * qty
    totals.ca += (ing.ca || 0) * qty
    totals.p += (ing.p || 0) * qty
    totals.na += (ing.na || 0) * qty
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

  /**
   * Fonction utilitaire améliorée avec TOLÉRANCE
   * Permet d'éviter d'afficher "Trop bas" pour une différence infime
   */
  const check = (
    val: number,
    range: { min: number; max: number },
    name: string,
    unit: string,
  ) => {
    const tolerance = 0.97; // Tolérance de 3% sur le minimum
    const upperLimit = 1.05; // Tolérance de 5% sur le maximum (moins critique en nutrition)

    const isTooLow = val < (range.min * tolerance);
    const isTooHigh = val > (range.max * upperLimit);

    if (isTooLow) {
      recs.push({
        type: 'warning',
        message: `Niveau de ${name} trop bas (${val.toFixed(2)}${unit}). Cible min: ${range.min}${unit}.`,
        nutrient: name,
      })
    } else if (isTooHigh) {
      recs.push({
        type: 'warning',
        message: `Niveau de ${name} trop élevé (${val.toFixed(2)}${unit}). Cible max: ${range.max}${unit}.`,
        nutrient: name,
      })
    } else {
      // Si on est dans la plage (avec tolérance), c'est OPTIMAL
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