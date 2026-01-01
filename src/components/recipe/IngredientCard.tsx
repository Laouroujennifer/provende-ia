import { motion } from 'framer-motion'
import { Wheat, Leaf, Fish, Plus } from 'lucide-react'
// Correction TS1484 : Utilisation de "import type"
import type { Ingredient } from '../../types/recipe'

interface IngredientCardProps {
  ingredient: Ingredient
  onAdd: (ingredient: Ingredient) => void
}

export function IngredientCard({ ingredient, onAdd }: IngredientCardProps) {
  // Correction pour le typage des icônes
  const icons = {
    corn: Wheat,
    soy: Leaf,
    fish: Fish,
  }

  // On récupère l'icône de manière sécurisée
  const Icon = icons[ingredient.icon as keyof typeof icons] || Wheat

  return (
    <motion.button
      whileHover={{
        scale: 1.05,
        y: -5,
      }}
      whileTap={{
        scale: 0.95,
      }}
      onClick={() => onAdd(ingredient)}
      className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-colors min-w-35px group relative overflow-hidden"
    >
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity`}
        style={{ backgroundColor: ingredient.color }}
      />

      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-3 text-white shadow-sm"
        style={{
          backgroundColor: ingredient.color,
        }}
      >
        <Icon size={24} />
      </div>

      <h3 className="font-bold text-gray-800 text-sm mb-1">
        {ingredient.name}
      </h3>
      <p className="text-xs text-gray-500 mb-2">
        ${ingredient.costPerKg.toFixed(2)}/kg
      </p>

      <div className="flex flex-wrap justify-center gap-1">
        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded-full text-gray-600">
          {ingredient.nutrients.protein}% Prot
        </span>
        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded-full text-gray-600">
          {ingredient.nutrients.energy} kcal
        </span>
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-gray-900 text-white p-1 rounded-full">
          <Plus size={12} />
        </div>
      </div>
    </motion.button>
  )
}