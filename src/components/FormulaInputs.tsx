
import { animalRequirements } from '../data/animalRequirements'
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
  // Group requirements by species for better UX
  const species = Array.from(new Set(animalRequirements.map((r) => r.species)))
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Nom de la formule
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Formule Poulet Croissance V1"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Type de volaille
        </label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
          onChange={(e) => {
            // Find first requirement for this species
            const first = animalRequirements.find(
              (r) => r.species === e.target.value,
            )
            if (first) setRequirementId(first.id)
          }}
        >
          {species.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Stade d'élevage
        </label>
        <select
          value={selectedRequirementId}
          onChange={(e) => setRequirementId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
        >
          {animalRequirements.map((req) => (
            <option key={req.id} value={req.id}>
              {req.species} - {req.stage} ({req.ageRange})
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
