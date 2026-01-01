import { useState } from 'react' // Suppression de React car seul useState est utilisé
import { Save, Lock } from 'lucide-react'
import { FormulaInputs } from '../components/FormulaInputs'
import { IngredientTable } from '../components/IngredientTable'
import { AIRecommendations } from '../components/AIRecommendations'
import { NutritionalSummary } from '../components/NutritionalSummary'
// Correction TS1484 : Utilisation de "import type"
import type { SelectedIngredient } from '../types/ingredients'
import { animalRequirements } from '../data/animalRequirements'
import type { AnimalRequirement } from '../types/animalRequirements'
import {
  calculateTotals,
  generateRecommendations,
} from '../utils/nutritionCalculations'
import { useSubscription } from '../contexts/SubscriptionContext'
import { Link } from 'react-router-dom'

export function ManualAnalyzer() {
  const { canSaveFormula, incrementFormulaCount } = useSubscription()
  const [formulaName, setFormulaName] = useState('')
  const [selectedRequirementId, setSelectedRequirementId] = useState(
    animalRequirements[0].id,
  )
  const [selectedIngredients, setSelectedIngredients] = useState<
    SelectedIngredient[]
  >([])

  // Ajout du type pour éviter l'erreur "implicit any"
  const currentRequirement = animalRequirements.find(
    (r: AnimalRequirement) => r.id === selectedRequirementId,
  )

  const totals = calculateTotals(selectedIngredients)
  const recommendations = generateRecommendations(totals, currentRequirement)

  const handleSave = () => {
    if (!canSaveFormula) return
    if (!formulaName) {
      alert('Veuillez donner un nom à votre formule.')
      return
    }
    incrementFormulaCount()
    alert(`Formule "${formulaName}" sauvegardée avec succès !`)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <FormulaInputs
        name={formulaName}
        setName={setFormulaName}
        selectedRequirementId={selectedRequirementId}
        setRequirementId={setSelectedRequirementId}
      />

      <NutritionalSummary totals={totals} requirement={currentRequirement} />

      <IngredientTable
        selectedIngredients={selectedIngredients}
        onUpdateIngredients={setSelectedIngredients}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AIRecommendations recommendations={recommendations} />
        </div>
        <div className="flex items-end justify-end lg:justify-start">
          {canSaveFormula ? (
            <button
              onClick={handleSave}
              className="w-full lg:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all font-bold text-lg"
            >
              <Save className="w-5 h-5" />
              Sauvegarder la formule
            </button>
          ) : (
            <Link
              to="/pricing"
              className="w-full lg:w-auto flex items-center justify-center gap-2 bg-gray-100 text-gray-500 px-8 py-4 rounded-xl hover:bg-gray-200 transition-all font-bold text-lg border border-gray-200"
            >
              <Lock className="w-5 h-5" />
              Limite atteinte (Passer Pro)
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}