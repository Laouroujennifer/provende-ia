/**
 * animalRequirements.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * SOURCE : Guide d'élevage Goliath 2023 (CD-Entrepreneur)
 * Toutes les valeurs sont extraites directement du document officiel.
 * 
 * PHASES disponibles :
 *   - Poulet de chair : Démarrage (0-4 sem), Croissance (5-10 sem)
 *   - Poule pondeuse  : Démarrage (0-4 sem), Croissance ponte (5-8 sem),
 *                       Poulette (9-20 sem), Ponte (≥21 sem)
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface AnimalRequirement {
  id: string
  species: string
  stage: string
  ageRange: string
  // Clé de phase pour getBounds() dans l'algorithme
  phaseKey: 'chair_starter' | 'chair_grower' | 'layer_starter' | 'layer_grower' | 'layer_pullet' | 'layer_production'
  em:  { min: number; max: number }
  pb:  { min: number; max: number }
  lys: { min: number; max: number }
  met: { min: number; max: number }
  ca:  { min: number; max: number }
  p:   { min: number; max: number }
  na:  { min: number; max: number }
  mg:  { min: number; max: number } // Matière grasse
}

export const animalRequirements: AnimalRequirement[] = [
  // ─── POULET DE CHAIR ────────────────────────────────────────────────────────

  {
    id: 'chair_demarrage',
    species: 'Poulet de chair (Goliath)',
    stage: 'Démarrage',
    ageRange: '0 à 4 semaines',
    phaseKey: 'chair_starter',
    em:  { min: 3000, max: 3200 },
    pb:  { min: 21,   max: 24   },
    lys: { min: 0.9,  max: 1.24 },
    met: { min: 0.4,  max: 0.52 },
    ca:  { min: 1.0,  max: 1.1  },
    p:   { min: 0.45, max: 0.6  },
    na:  { min: 0.15, max: 0.20 },
    mg:  { min: 2,    max: 5    },
  },

  {
    id: 'chair_croissance',
    species: 'Poulet de chair (Goliath)',
    stage: 'Croissance',
    ageRange: '5 à 10 semaines',
    phaseKey: 'chair_grower',
    em:  { min: 2900, max: 3200 },
    pb:  { min: 20,   max: 22   },
    lys: { min: 0.74, max: 1.0  },
    met: { min: 0.30, max: 0.5  },
    ca:  { min: 0.9,  max: 1.2  },
    p:   { min: 0.35, max: 0.5  },
    na:  { min: 0.15, max: 0.20 },
    mg:  { min: 2,    max: 7    },
  },

  // ─── POULE PONDEUSE ─────────────────────────────────────────────────────────

  {
    id: 'ponte_demarrage',
    species: 'Poule pondeuse (Goliath)',
    stage: 'Démarrage Ponte',
    ageRange: '0 à 4 semaines',
    phaseKey: 'layer_starter',
    em:  { min: 3000, max: 3200 },
    pb:  { min: 21,   max: 24   },
    lys: { min: 0.9,  max: 1.24 },
    met: { min: 0.4,  max: 0.52 },
    ca:  { min: 1.0,  max: 1.1  },
    p:   { min: 0.45, max: 0.6  },
    na:  { min: 0.15, max: 0.20 },
    mg:  { min: 2,    max: 5    },
  },

  {
    id: 'ponte_croissance',
    species: 'Poule pondeuse (Goliath)',
    stage: 'Croissance Ponte',
    ageRange: '5 à 8 semaines',
    phaseKey: 'layer_grower',
    em:  { min: 2900, max: 3000 },
    pb:  { min: 19,   max: 21   },
    lys: { min: 0.85, max: 1.0  },
    met: { min: 0.32, max: 0.5  },
    ca:  { min: 0.97, max: 1.0  },
    p:   { min: 0.40, max: 0.6  },
    na:  { min: 0.15, max: 0.20 },
    mg:  { min: 2,    max: 5    },
  },

  {
    id: 'ponte_poulette',
    species: 'Poule pondeuse (Goliath)',
    stage: 'Poulette',
    ageRange: '9 à 20 semaines',
    phaseKey: 'layer_pullet',
    em:  { min: 2600, max: 2800 },
    pb:  { min: 16,   max: 18   },
    lys: { min: 0.55, max: 0.8  },
    met: { min: 0.24, max: 0.5  },
    ca:  { min: 0.90, max: 1.20 },
    p:   { min: 0.35, max: 0.5  },
    na:  { min: 0.15, max: 0.20 },
    mg:  { min: 2,    max: 7    },
  },

  {
    id: 'ponte_production',
    species: 'Poule pondeuse (Goliath)',
    stage: 'Ponte en production',
    ageRange: 'Dès la 21ème semaine',
    phaseKey: 'layer_production',
    em:  { min: 2600, max: 2900 },
    pb:  { min: 17,   max: 19   },
    lys: { min: 0.7,  max: 0.93 },
    met: { min: 0.35, max: 0.45 },
    ca:  { min: 3.5,  max: 4.0  }, // ← DIFFÉRENCE MAJEURE : calcium élevé pour la coquille des œufs
    p:   { min: 0.35, max: 0.45 },
    na:  { min: 0.15, max: 0.20 },
    mg:  { min: 2,    max: 5    },
  },
]