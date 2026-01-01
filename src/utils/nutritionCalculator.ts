// Correction 1484 : Séparation des imports de types et de constantes
import { NUTRIENT_TARGETS } from '../types/recipe'
import type {
  Ingredient,
  RecipeItem,
  RecipeAnalysis,
} from '../types/recipe'

export const INGREDIENTS: Ingredient[] = [
  {
    id: 'corn',
    name: 'Corn',
    icon: 'corn',
    color: '#FCD34D',
    costPerKg: 0.25,
    nutrients: { protein: 8, fat: 3.5, fiber: 2, energy: 3350, calcium: 0.02 },
  },
  {
    id: 'soy',
    name: 'Soy Meal',
    icon: 'soy',
    color: '#A8A29E',
    costPerKg: 0.45,
    nutrients: { protein: 44, fat: 1, fiber: 7, energy: 2230, calcium: 0.3 },
  },
  {
    id: 'fish',
    name: 'Fish Meal',
    icon: 'fish',
    color: '#60A5FA',
    costPerKg: 1.2,
    nutrients: { protein: 60, fat: 8, fiber: 1, energy: 2800, calcium: 5 },
  },
]

export function calculateRecipe(items: RecipeItem[]): RecipeAnalysis {
  if (items.length === 0) {
    return {
      totalWeight: 0,
      totalCost: 0,
      score: 0,
      nutrients: { protein: 0, fat: 0, fiber: 0, energy: 0, calcium: 0 },
    }
  }

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)

  const totals = items.reduce(
    (acc, item) => {
      const ingredient = INGREDIENTS.find((i) => i.id === item.ingredientId)
      if (!ingredient) return acc

      return {
        cost: acc.cost + ingredient.costPerKg * item.weight,
        protein: acc.protein + ingredient.nutrients.protein * item.weight,
        fat: acc.fat + ingredient.nutrients.fat * item.weight,
        fiber: acc.fiber + ingredient.nutrients.fiber * item.weight,
        energy: acc.energy + ingredient.nutrients.energy * item.weight,
        calcium: acc.calcium + ingredient.nutrients.calcium * item.weight,
      }
    },
    { cost: 0, protein: 0, fat: 0, fiber: 0, energy: 0, calcium: 0 },
  )

  const analysis = {
    totalWeight,
    totalCost: totals.cost,
    nutrients: {
      protein: totals.protein / totalWeight,
      fat: totals.fat / totalWeight,
      fiber: totals.fiber / totalWeight,
      energy: totals.energy / totalWeight,
      calcium: totals.calcium / totalWeight,
    },
    score: 0,
  }

  let totalDeviation = 0
  let metricsCount = 0

  // Correction 7053 : Préciser le type de la clé pour l'indexation
  ;(Object.keys(NUTRIENT_TARGETS) as Array<keyof typeof NUTRIENT_TARGETS>).forEach((key) => {
    // On force le type pour accéder à analysis.nutrients[key]
    const val = analysis.nutrients[key as keyof typeof analysis.nutrients]
    const target = NUTRIENT_TARGETS[key]

    const idealCenter = (target.idealMin + target.idealMax) / 2

    let deviation = 0
    if (val < target.idealMin) {
      deviation = (target.idealMin - val) / idealCenter
    } else if (val > target.idealMax) {
      deviation = (val - target.idealMax) / idealCenter
    }

    totalDeviation += Math.min(deviation * 100, 40)
    metricsCount++
  })

  analysis.score = Math.max(
    0,
    Math.round(100 - (totalDeviation / metricsCount) * 20),
  )

  return analysis
}

export function getNutrientStatus(
  key: keyof typeof NUTRIENT_TARGETS, // Correction du type ici aussi
  value: number,
): 'optimal' | 'caution' | 'warning' {
  const target = NUTRIENT_TARGETS[key]
  if (value >= target.idealMin && value <= target.idealMax) return 'optimal'

  const range = target.idealMax - target.idealMin
  const tolerance = range * 0.5

  if (
    value >= target.idealMin - tolerance &&
    value <= target.idealMax + tolerance
  )
    return 'caution'

  return 'warning'
}