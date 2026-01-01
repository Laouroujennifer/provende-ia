import { useState } from 'react' // Correction : React supprimé car seul useState est utilisé
import { motion, AnimatePresence } from 'framer-motion'
import { INGREDIENTS, calculateRecipe } from '../utils/nutritionCalculator'
// Correction TS1484 : Utilisation de "import type"
import type { Ingredient, RecipeItem } from '../types/recipe'
import { IngredientCard } from '../components/recipe/IngredientCard'
import { MixingBowl } from '../components/recipe/MixingBowl'
import { NutritionalGauge } from '../components/recipe/NutritionalGauge'
import { RecipeSummary } from '../components/recipe/RecipeSummary'
import { ChefHat } from 'lucide-react'

export function RecipeBuilder() {
  const [recipe, setRecipe] = useState<RecipeItem[]>([])
  const analysis = calculateRecipe(recipe)

  const handleAddIngredient = (ingredient: Ingredient) => {
    const newItem: RecipeItem = {
      id: Math.random().toString(36).substring(2, 11),
      ingredientId: ingredient.id,
      weight: 10, // Ajout par défaut de 10kg
    }
    setRecipe((prev) => [...prev, newItem])
  }

  const handleRemoveIngredient = (index: number) => {
    setRecipe((prev) => prev.filter((_, i) => i !== index))
  }

  const handleClear = () => {
    setRecipe([])
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <ChefHat size={20} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600">
              ProvendeBuilder
            </h1>
          </div>
          <div className="text-sm text-gray-500">
            {recipe.length} ingrédients ajoutés
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Sélection d'ingrédients */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Garde-manger</h2>
            <span className="text-sm text-gray-500">Cliquez pour ajouter 10kg</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {INGREDIENTS.map((ingredient: Ingredient) => (
              <IngredientCard
                key={ingredient.id}
                ingredient={ingredient}
                onAdd={handleAddIngredient}
              />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Colonne Gauche: Bol de mélange */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                Bol de mélange
              </h2>
              <MixingBowl items={recipe} onRemove={handleRemoveIngredient} />

              {/* Liste de la recette */}
              <div className="mt-8 space-y-2 max-h-60 overflow-y-auto pr-2">
                <AnimatePresence initial={false}>
                  {recipe.map((item: RecipeItem, index: number) => {
                    const ingredient = INGREDIENTS.find(
                      (i: Ingredient) => i.id === item.ingredientId,
                    )
                    if (!ingredient) return null
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, height: 0, x: -20 }}
                        animate={{ opacity: 1, height: 'auto', x: 0 }}
                        exit={{ opacity: 0, height: 0, x: 20 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-2 h-8 rounded-full"
                            style={{ backgroundColor: ingredient.color }}
                          />
                          <div>
                            <p className="font-medium text-sm text-gray-900">
                              {ingredient.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              ${(ingredient.costPerKg * item.weight).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-700">
                            {item.weight}kg
                          </span>
                          <button
                            onClick={() => handleRemoveIngredient(index)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            &times;
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
                {recipe.length === 0 && (
                  <p className="text-center text-sm text-gray-400 py-4 italic">
                    Aucun ingrédient pour le moment
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Colonne Droite: Jauges */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Équilibre Nutritionnel
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <NutritionalGauge
                  nutrientKey="protein"
                  value={analysis.nutrients.protein}
                  label="Protéines"
                />
                <NutritionalGauge
                  nutrientKey="fat"
                  value={analysis.nutrients.fat}
                  label="M. Grasse"
                />
                <NutritionalGauge
                  nutrientKey="fiber"
                  value={analysis.nutrients.fiber}
                  label="Cellulose"
                />
                <NutritionalGauge
                  nutrientKey="calcium"
                  value={analysis.nutrients.calcium}
                  label="Calcium"
                />
                <div className="col-span-2 md:col-span-1">
                  <NutritionalGauge
                    nutrientKey="energy"
                    value={analysis.nutrients.energy}
                    label="Énergie"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h3 className="text-sm font-bold text-blue-800 mb-2">
                  Conseils IA
                </h3>
                <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                  <li>Visez 18-22% de Protéines pour une croissance optimale.</li>
                  <li>La densité énergétique doit correspondre au stade de l'élevage.</li>
                  <li>Surveillez le Calcium lors d'une forte teneur en farine de poisson.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Résumé du bas */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pointer-events-none">
        <div className="max-w-6xl mx-auto pointer-events-auto">
          <RecipeSummary analysis={analysis} onClear={handleClear} />
        </div>
      </div>
    </div>
  )
}