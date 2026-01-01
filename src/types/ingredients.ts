export interface Ingredient {
  id: string
  name: string
  category: string
  // Nutritional values per kg
  ms: number // Matière Sèche %
  cb: number // Cellulose Brute %
  mg: number // Matière Grasse %
  em: number // Énergie Métabolisable (kcal/kg)
  en: number // Énergie Nette (UF)
  pb: number // Protéine Brute %
  lys: number // Lysine %
  met: number // Méthionine %
  aas: number // Acides Aminés Soufrés %
  ca: number // Calcium %
  p: number // Phosphore %
  na: number // Sodium %
  defaultPrice?: number // FCFA/kg
}

export interface SelectedIngredient extends Ingredient {
  quantity: number // kg
  price: number // FCFA/kg
}

export interface FormulaTotals {
  weight: number
  cost: number
  ms: number
  cb: number
  mg: number
  em: number
  en: number
  pb: number
  lys: number
  met: number
  aas: number
  ca: number
  p: number
  na: number
}
