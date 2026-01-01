export interface Nutrient {
  name: string
  value: number // percentage or absolute value
  unit: string
}

export interface Ingredient {
  id: string
  name: string
  icon: 'corn' | 'soy' | 'fish'
  color: string
  costPerKg: number
  nutrients: {
    protein: number // %
    fat: number // %
    fiber: number // %
    energy: number // kcal/kg
    calcium: number // %
  }
}

export interface RecipeItem {
  id: string // unique instance id
  ingredientId: string
  weight: number // kg
}

export interface RecipeAnalysis {
  totalWeight: number
  totalCost: number
  score: number
  nutrients: {
    protein: number
    fat: number
    fiber: number
    energy: number
    calcium: number
  }
}

export interface NutrientTarget {
  min: number
  max: number
  idealMin: number
  idealMax: number
  unit: string
}

export const NUTRIENT_TARGETS: Record<string, NutrientTarget> = {
  protein: { min: 0, max: 70, idealMin: 18, idealMax: 22, unit: '%' },
  fat: { min: 0, max: 15, idealMin: 3, idealMax: 5, unit: '%' },
  fiber: { min: 0, max: 15, idealMin: 3, idealMax: 6, unit: '%' },
  energy: { min: 0, max: 4000, idealMin: 2800, idealMax: 3200, unit: 'kcal' },
  calcium: { min: 0, max: 8, idealMin: 0.8, idealMax: 1.2, unit: '%' },
}
