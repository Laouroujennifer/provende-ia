import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { RecipeItem } from '../../types/recipe'
import { INGREDIENTS } from '../../utils/nutritionCalculator'

interface MixingBowlProps {
  items: RecipeItem[]
  onRemove: (index: number) => void
}

export function MixingBowl({ items, onRemove }: MixingBowlProps) {
  const data = items.map((item) => {
    const ingredient = INGREDIENTS.find((i) => i.id === item.ingredientId)
    return {
      name: ingredient?.name || 'Inconnu',
      value: item.weight,
      color: ingredient?.color || '#ccc',
      originalItem: item,
    }
  })

  if (items.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center bg-gray-50 rounded-full border-4 border-dashed border-gray-200 relative overflow-hidden">
        <div className="text-center p-6 z-10">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12h20" />
              <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
              <path d="m4 8 16-4" />
              <path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.55a2 2 0 0 1 2.43 1.46l.45 1.8" />
            </svg>
          </div>
          <p className="text-gray-400 font-medium text-sm">Votre bol est vide</p>
          <p className="text-gray-300 text-xs mt-1">Ajoutez des ingrédients pour commencer</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-64 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            onClick={(_, index) => onRemove(index)}
            cursor="pointer"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="white"
                strokeWidth={2}
                className="hover:opacity-80 transition-opacity"
              />
            ))}
          </Pie>
          <Tooltip
            // CORRECTION : On remplace 'any' par une union de types autorisés
            formatter={(value: number | string | undefined) => (value ? `${value} kg` : '0 kg')}
            contentStyle={{
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Étiquette centrale */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <span className="block text-2xl font-bold text-gray-800">
            {items.reduce((acc, i) => acc + i.weight, 0)}
          </span>
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            kg Total
          </span>
        </div>
      </div>
    </div>
  )
} 