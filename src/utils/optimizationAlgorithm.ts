// Correction 1484 : Utilisation de "import type" et suppression des types inutilisés (Ingredient, FormulaTotals)
import type { SelectedIngredient } from '../types/ingredients'
import type { AnimalRequirement } from '../types/animalRequirements'
import { calculateTotals, getFinalValues } from './nutritionCalculations'

/**
 * Algorithme d'optimisation heuristique (Hill Climbing)
 * Cherche une combinaison d'ingrédients qui respecte les besoins au moindre coût.
 */
export const optimizeFormula = (
  availableIngredients: SelectedIngredient[],
  requirement: AnimalRequirement,
): SelectedIngredient[] => {
  // Copie profonde pour éviter de modifier l'original
  const formula = availableIngredients.map((i) => ({ ...i, quantity: 0 }))

  // 1. Identification des sources clés
  const energySources = formula.filter(
    (i) =>
      i.category === 'Céréales' ||
      i.category === 'Racines' ||
      i.category === 'Huile',
  )
  const proteinSources = formula.filter(
    (i) =>
      i.category === 'Protéines' ||
      i.category === 'Protéines Animales' ||
      i.category === 'Concentrés',
  )
  const mineralSources = formula.filter((i) => i.category === 'Minéraux')
  const additives = formula.filter((i) => i.category === 'Additifs')

  // Tri par efficacité économique (Prix par unité de nutriment)
  energySources.sort((a, b) => a.price / a.em - b.price / b.em)
  proteinSources.sort((a, b) => a.price / a.pb - b.price / b.pb)

  // 2. Estimation initiale (Structure de base d'un aliment volaille standard)
  if (energySources.length > 0) {
    energySources[0].quantity = 600 // 60%
  }

  if (proteinSources.length > 0) {
    proteinSources[0].quantity = 250 // 25%
  }

  const caSource = mineralSources.find((i) => i.ca > 20)
  if (caSource) caSource.quantity = 80 // 8%

  const pSource = mineralSources.find((i) => i.p > 10)
  if (pSource) pSource.quantity = 20 // 2%

  const premix = additives.find(
    (i) =>
      i.name.toLowerCase().includes('premix') ||
      i.name.toLowerCase().includes('cmv'),
  )
  if (premix) premix.quantity = 2.5 // 0.25%

  const lys = additives.find((i) => i.name.toLowerCase().includes('lysine'))
  if (lys) lys.quantity = 1

  const met = additives.find((i) => i.name.toLowerCase().includes('méthionine'))
  if (met) met.quantity = 1

  // 3. Raffinement itératif
  for (let i = 0; i < 20; i++) {
    const totals = calculateTotals(formula)
    const final = getFinalValues(totals)
    // Correction ESLint : Suppression de 'totalWeight' car il n'était pas utilisé

    // Ajustement de l'Énergie
    if (final.em < requirement.em.min) {
      if (energySources.length > 0) energySources[0].quantity += 10
    } else if (final.em > requirement.em.max) {
      if (energySources.length > 0 && energySources[0].quantity > 10)
        energySources[0].quantity -= 10
    }

    // Ajustement des Protéines
    if (final.pb < requirement.pb.min) {
      if (proteinSources.length > 0) proteinSources[0].quantity += 10
    } else if (final.pb > requirement.pb.max) {
      if (proteinSources.length > 0 && proteinSources[0].quantity > 10)
        proteinSources[0].quantity -= 10
    }

    // Ajustement du Calcium
    if (final.ca < requirement.ca.min) {
      if (caSource) caSource.quantity += 2
    }
  }

  // Normalisation sur une base de 100kg
  const currentTotal = formula.reduce((sum, i) => sum + i.quantity, 0)
  const scaleFactor = 100 / currentTotal

  return formula
    .map((i) => ({
      ...i,
      quantity: Number((i.quantity * scaleFactor).toFixed(2)),
    }))
    .filter((i) => i.quantity > 0)
}