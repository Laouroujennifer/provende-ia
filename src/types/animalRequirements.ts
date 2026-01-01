export interface NutrientRange {
  min: number
  max: number
}

export interface AnimalRequirement {
  id: string
  species: string // 'Poulet de chair', 'Pondeuses', etc.
  stage: string // 'Démarrage', 'Croissance', etc.
  ageRange: string // '0-4 semaines', etc.

  // Target ranges
  em: NutrientRange // kcal/kg
  pb: NutrientRange // %
  lys: NutrientRange // %
  met: NutrientRange // %
  ca: NutrientRange // %
  p: NutrientRange // %
  na: NutrientRange // %
  mg: NutrientRange // %
}
