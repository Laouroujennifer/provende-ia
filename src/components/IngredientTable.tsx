import { useState } from 'react' // Suppression de "React" car seul useState est utilisé
import { Plus, Trash2 } from 'lucide-react' // Suppression de "Save" car non utilisé ici
// Correction TS1484 : Utilisation de "import type" pour les interfaces
import type { SelectedIngredient } from '../types/ingredients' 
import { ingredientsDatabase } from '../data/ingredientsDatabase'
import { calculateTotals, getFinalValues } from '../utils/nutritionCalculations'

interface IngredientTableProps {
  selectedIngredients: SelectedIngredient[]
  onUpdateIngredients: (ingredients: SelectedIngredient[]) => void
}

export function IngredientTable({
  selectedIngredients,
  onUpdateIngredients,
}: IngredientTableProps) {
  const [selectedToAdd, setSelectedToAdd] = useState<string>('')

  const handleAdd = () => {
    if (!selectedToAdd) return
    const ingredient = ingredientsDatabase.find((i) => i.id === selectedToAdd)
    if (ingredient) {
      onUpdateIngredients([
        ...selectedIngredients,
        {
          ...ingredient,
          quantity: 0,
          price: ingredient.defaultPrice || 0,
        },
      ])
      setSelectedToAdd('')
    }
  }

  const handleRemove = (index: number) => {
    const newIngredients = [...selectedIngredients]
    newIngredients.splice(index, 1)
    onUpdateIngredients(newIngredients)
  }

  const updateValue = (
    index: number,
    field: 'quantity' | 'price',
    value: number,
  ) => {
    const newIngredients = [...selectedIngredients]
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: value,
    }
    onUpdateIngredients(newIngredients)
  }

  const rawTotals = calculateTotals(selectedIngredients)
  const finalTotals = getFinalValues(rawTotals)

  // Ingrédients disponibles (exclure ceux déjà sélectionnés)
  const availableIngredients = ingredientsDatabase.filter(
    (i) => !selectedIngredients.find((si) => si.id === i.id),
  )

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="w-full min-w-250px">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-64">
                Matière Première
              </th>
              <th className="px-4 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                Qté (kg)
              </th>
              <th className="px-4 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                Prix (FCFA)
              </th>
              <th className="px-4 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                EM kcal
              </th>
              <th className="px-4 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                PB %
              </th>
              <th className="px-4 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Lys %
              </th>
              <th className="px-4 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Met %
              </th>
              <th className="px-4 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Ca %
              </th>
              <th className="px-4 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                P %
              </th>
              <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {selectedIngredients.map((ing, index) => (
              <tr key={ing.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 text-sm font-medium text-gray-900">
                  {ing.name}
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min="0"
                    value={ing.quantity || ''}
                    onChange={(e) =>
                      updateValue(
                        index,
                        'quantity',
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    className="w-full text-right px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-teal-500 outline-none"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min="0"
                    value={ing.price || ''}
                    onChange={(e) =>
                      updateValue(
                        index,
                        'price',
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    className="w-full text-right px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-teal-500 outline-none"
                  />
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-500">
                  {ing.em}
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-500">
                  {ing.pb}
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-500">
                  {ing.lys}
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-500">
                  {ing.met}
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-500">
                  {ing.ca}
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-500">
                  {ing.p}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleRemove(index)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}

            {/* Ligne d'ajout */}
            <tr className="bg-gray-50">
              <td className="px-6 py-3" colSpan={10}>
                <div className="flex items-center gap-4">
                  <select
                    value={selectedToAdd}
                    onChange={(e) => setSelectedToAdd(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                  >
                    <option value="">Sélectionner un ingrédient...</option>
                    {availableIngredients.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAdd}
                    disabled={!selectedToAdd}
                    className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </button>
                </div>
              </td>
            </tr>

            {/* Ligne TOTAL */}
            <tr className="bg-teal-50 border-t-2 border-teal-100 font-bold">
              <td className="px-6 py-4 text-teal-900">TOTAL</td>
              <td className="px-4 py-4 text-right text-teal-900">
                {rawTotals.weight.toFixed(2)}
              </td>
              <td className="px-4 py-4 text-right text-teal-900">
                {rawTotals.cost.toLocaleString()}
              </td>
              <td className="px-4 py-4 text-right text-teal-900">
                {finalTotals.em.toFixed(0)}
              </td>
              <td className="px-4 py-4 text-right text-teal-900">
                {finalTotals.pb.toFixed(2)}
              </td>
              <td className="px-4 py-4 text-right text-teal-900">
                {finalTotals.lys.toFixed(2)}
              </td>
              <td className="px-4 py-4 text-right text-teal-900">
                {finalTotals.met.toFixed(2)}
              </td>
              <td className="px-4 py-4 text-right text-teal-900">
                {finalTotals.ca.toFixed(2)}
              </td>
              <td className="px-4 py-4 text-right text-teal-900">
                {finalTotals.p.toFixed(2)}
              </td>
              <td className="px-4 py-4"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}