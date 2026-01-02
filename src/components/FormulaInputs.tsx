import { useState } from 'react' // Correction : suppression de useEffect
import { animalRequirements } from '../data/animalRequirements'
import type { AnimalRequirement } from '../types/animalRequirements'

interface FormulaInputsProps {
  name: string
  setName: (name: string) => void
  selectedRequirementId: string
  setRequirementId: (id: string) => void
}

export function FormulaInputs({
  name,
  setName,
  selectedRequirementId,
  setRequirementId,
}: FormulaInputsProps) {
  
  // 1. Liste unique des espèces
  const speciesList = Array.from(new Set(animalRequirements.map((r) => r.species)))
  
  // 2. État pour l'espèce actuellement sélectionnée
  const [currentSpecies, setCurrentSpecies] = useState(() => {
    const initial = animalRequirements.find(r => r.id === selectedRequirementId)
    return initial ? initial.species : speciesList[0]
  })

  // 3. Filtrer les stades correspondant à l'espèce choisie
  const filteredStages = animalRequirements.filter(r => r.species === currentSpecies)

  // 4. Si l'espèce change, on remet le premier stade de cette espèce par défaut
  const handleSpeciesChange = (speciesName: string) => {
    setCurrentSpecies(speciesName)
    const firstStageOfSpecies = animalRequirements.find(r => r.species === speciesName)
    if (firstStageOfSpecies) {
      setRequirementId(firstStageOfSpecies.id)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Nom de la formule</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Ma Formule Janvier"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Type de volaille</label>
        <select
          value={currentSpecies}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
          onChange={(e) => handleSpeciesChange(e.target.value)}
        >
          {speciesList.map((s: string) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Stade d'élevage</label>
        <select
          value={selectedRequirementId}
          onChange={(e) => setRequirementId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
        >
          {filteredStages.map((req: AnimalRequirement) => (
            <option key={req.id} value={req.id}>
              {req.stage}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}