import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
// Correction TS1484 : Utilisation de "import type"
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
          price: 0, 
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

  const updateQuantity = (index: number, value: number) => {
    const newIngredients = [...selectedIngredients]
    newIngredients[index] = {
      ...newIngredients[index],
      quantity: value,
    }
    onUpdateIngredients(newIngredients)
  }

  const rawTotals = calculateTotals(selectedIngredients)
  const finalTotals = getFinalValues(rawTotals)

  // TRI ALPHABÉTIQUE : On filtre et on trie de A à Z
  const availableIngredients = ingredientsDatabase
    .filter((i) => !selectedIngredients.find((si) => si.id === i.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] w-64">
                Matière Première
              </th>
              <th className="px-4 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] w-32">
                Quantité (kg)
              </th>
              <th className="px-4 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                EM kcal
              </th>
              <th className="px-4 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                PB %
              </th>
              <th className="px-4 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Lys %
              </th>
              <th className="px-4 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Met %
              </th>
              <th className="px-4 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Ca %
              </th>
              <th className="px-4 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                P %
              </th>
              <th className="px-4 py-5 text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] w-16">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {selectedIngredients.map((ing, index) => (
              <tr key={ing.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 text-sm font-bold text-slate-900">
                  {ing.name}
                </td>
                <td className="px-4 py-4 text-right">
                  <input
                    type="number"
                    min="0"
                    placeholder="0.00"
                    value={ing.quantity || ''}
                    onChange={(e) =>
                      updateQuantity(index, parseFloat(e.target.value) || 0)
                    }
                    className="w-24 text-right px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none font-black text-slate-900 bg-slate-50/50 group-hover:bg-white transition-all"
                  />
                </td>
                <td className="px-4 py-4 text-right text-sm font-medium text-slate-400 italic">
                  {ing.em}
                </td>
                <td className="px-4 py-4 text-right text-sm font-medium text-slate-400 italic">
                  {ing.pb}
                </td>
                <td className="px-4 py-4 text-right text-sm font-medium text-slate-400 italic">
                  {ing.lys}
                </td>
                <td className="px-4 py-4 text-right text-sm font-medium text-slate-400 italic">
                  {ing.met}
                </td>
                <td className="px-4 py-4 text-right text-sm font-medium text-slate-400 italic">
                  {ing.ca}
                </td>
                <td className="px-4 py-4 text-right text-sm font-medium text-slate-400 italic">
                  {ing.p}
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    onClick={() => handleRemove(index)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}

            {/* Ligne d'ajout */}
            <tr className="bg-slate-50/30">
              <td className="px-6 py-6" colSpan={9}>
                <div className="flex items-center gap-4 max-w-2xl">
                  <select
                    value={selectedToAdd}
                    onChange={(e) => setSelectedToAdd(e.target.value)}
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-bold text-sm text-slate-700 shadow-sm"
                  >
                    <option value="">Sélectionner une matière première (A-Z)...</option>
                    {availableIngredients.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAdd}
                    disabled={!selectedToAdd}
                    className="flex items-center gap-3 bg-[#064e3b] text-white px-8 py-3 rounded-2xl hover:bg-emerald-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-900/10 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter au mélange
                  </button>
                </div>
              </td>
            </tr>

            {/* Ligne TOTAL */}
            <tr className="bg-emerald-50/50 border-t-2 border-emerald-100/50 font-black">
              <td className="px-6 py-6 text-emerald-900 text-xs uppercase tracking-[0.2em]">Poids Total du mélange</td>
              <td className={`px-4 py-6 text-right text-lg ${rawTotals.weight === 100 ? 'text-emerald-600' : 'text-slate-900'}`}>
                {rawTotals.weight.toFixed(2)} <span className="text-[10px] text-slate-400">kg</span>
              </td>
              <td className="px-4 py-6 text-right text-emerald-900 text-sm">
                {finalTotals.em.toFixed(0)}
              </td>
              <td className="px-4 py-6 text-right text-emerald-900 text-sm">
                {finalTotals.pb.toFixed(2)}%
              </td>
              <td className="px-4 py-6 text-right text-emerald-900 text-sm">
                {finalTotals.lys.toFixed(2)}%
              </td>
              <td className="px-4 py-6 text-right text-emerald-900 text-sm">
                {finalTotals.met.toFixed(2)}%
              </td>
              <td className="px-4 py-6 text-right text-emerald-900 text-sm">
                {finalTotals.ca.toFixed(2)}%
              </td>
              <td className="px-4 py-6 text-right text-emerald-900 text-sm">
                {finalTotals.p.toFixed(2)}%
              </td>
              <td className="px-4 py-6"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}