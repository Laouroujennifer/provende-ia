import { motion } from 'framer-motion'
import { DollarSign, Award, RefreshCw } from 'lucide-react'
// Correction TS1484 : Utilisation de "import type"
import type { RecipeAnalysis } from '../../types/recipe'

interface RecipeSummaryProps {
  analysis: RecipeAnalysis
  onClear: () => void
}

export function RecipeSummary({ analysis, onClear }: RecipeSummaryProps) {
  const scoreColor =
    analysis.score >= 90
      ? 'text-green-500'
      : analysis.score >= 70
        ? 'text-yellow-500'
        : 'text-red-500'

  return (
    <motion.div
      initial={{
        y: 20,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6"
    >
      <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <DollarSign size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
              Coût Total
            </p>
            <p className="text-2xl font-bold text-gray-900">
              ${analysis.totalCost.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="w-px h-10 bg-gray-100 hidden md:block" />

        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              analysis.score >= 90 
                ? 'bg-green-50 text-green-600' 
                : analysis.score >= 70 
                  ? 'bg-yellow-50 text-yellow-600' 
                  : 'bg-red-50 text-red-600'
            }`}
          >
            <Award size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
              NutriScore
            </p>
            <p className={`text-2xl font-bold ${scoreColor}`}>
              {analysis.score}/100
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onClear}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      >
        <RefreshCw size={16} />
        Réinitialiser
      </button>
    </motion.div>
  )
}