import type { SelectedIngredient } from '../types/ingredients'
import type { AnimalRequirement } from '../types/animalRequirements'
import { calculateTotals, getFinalValues } from './nutritionCalculations'

/**
 * Algorithme d'optimisation avec diversité forcée.
 * Utilise une base de 5kg pour chaque ingrédient sélectionné.
 */
export const optimizeFormula = (
  availableIngredients: SelectedIngredient[],
  requirement: AnimalRequirement,
): SelectedIngredient[] => {
  // CORRECTION ESLint : On utilise 'const' car on modifie les propriétés de l'objet, 
  // mais on ne réassigne jamais la variable 'formula' elle-même.
  const formula = availableIngredients.map((i) => ({ 
    ...i, 
    quantity: 5 // On force chaque ingrédient sélectionné à être présent (5kg mini)
  }))

  const energySources = formula.filter(i => 
    ['Céréales', 'Racines', 'Matières Grasses'].includes(i.category)
  )
  const proteinSources = formula.filter(i => 
    ['Protéines', 'Protéines Animales', 'Concentrés'].includes(i.category)
  )

  // Boucle d'ajustement (30 itérations pour équilibrer)
  for (let i = 0; i < 30; i++) {
    const totals = calculateTotals(formula)
    const final = getFinalValues(totals)

    // Ajustement Énergie (affecte toutes les sources d'énergie cochées)
    if (final.em < requirement.em.min) {
      energySources.forEach(s => s.quantity += 2)
    } else if (final.em > requirement.em.max) {
      energySources.forEach(s => { if(s.quantity > 5) s.quantity -= 1 })
    }

    // Ajustement Protéines (affecte toutes les sources de protéines cochées)
    if (final.pb < requirement.pb.min) {
      proteinSources.forEach(s => s.quantity += 2)
    } else if (final.pb > requirement.pb.max) {
      proteinSources.forEach(s => { if(s.quantity > 5) s.quantity -= 1 })
    }

    // Ajustement Calcium
    const caSource = formula.find(ing => ing.ca > 20)
    if (caSource && final.ca < requirement.ca.min) {
      caSource.quantity += 1
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
    .filter((i) => i.quantity > 0.1)
}