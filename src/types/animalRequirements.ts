/**
 * types/animalRequirements.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Interface TypeScript pour les besoins nutritionnels par espèce et phase.
 * SOURCE : Guide d'élevage Goliath 2023 (CD-Entrepreneur)
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface AnimalRequirement {
  id: string
  species: string
  stage: string
  ageRange: string
  // Clé de phase pour getBounds() dans optimizationAlgorithm.ts
  phaseKey: 'chair_starter' | 'chair_grower' | 'layer_starter' | 'layer_grower' | 'layer_pullet' | 'layer_production'
  em:  { min: number; max: number }
  pb:  { min: number; max: number }
  lys: { min: number; max: number }
  met: { min: number; max: number }
  ca:  { min: number; max: number }
  p:   { min: number; max: number }
  na:  { min: number; max: number }
  mg:  { min: number; max: number }
}