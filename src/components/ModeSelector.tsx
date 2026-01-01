// Correction : Suppression de l'import React car inutile
import { Calculator, Wand2 } from 'lucide-react'

interface ModeSelectorProps {
  currentMode: 'manual' | 'auto'
  onModeChange: (mode: 'manual' | 'auto') => void
}

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="flex gap-4 mb-8 bg-gray-100 p-1 rounded-xl w-fit">
      <button
        onClick={() => onModeChange('manual')}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
          currentMode === 'manual' ? 'bg-white text-teal-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <Calculator className="w-5 h-5" />
        Analyseur Manuel
      </button>
      <button
        onClick={() => onModeChange('auto')}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
          currentMode === 'auto' ? 'bg-white text-teal-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <Wand2 className="w-5 h-5" />
        Générateur Automatique
      </button>
    </div>
  )
}