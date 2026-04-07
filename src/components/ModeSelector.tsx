
import { Calculator, Zap, Check, Infinity } from 'lucide-react'

interface ModeSelectorProps {
  currentMode: 'manual' | 'auto'
  onModeChange: (mode: 'manual' | 'auto') => void
}

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4 w-full">

      {/* ── MANUEL ── */}
      <button
        onClick={() => onModeChange('manual')}
        className={`relative flex flex-col items-start p-7 rounded-2xl border-[2.5px] text-left transition-all duration-200 hover:-translate-y-1 ${
          currentMode === 'manual'
            ? 'border-emerald-500 bg-emerald-50'
            : 'border-emerald-200 bg-emerald-50 hover:border-emerald-400'
        }`}
      >
        {currentMode === 'manual' && (
          <span className="absolute top-4 right-4 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
            <Check size={13} className="text-white" strokeWidth={3} />
          </span>
        )}

        <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-4">
          <Calculator size={26} className="text-white" />
        </div>

        <p className="text-xl font-black text-emerald-900 mb-2">Manuel</p>
        <p className="text-[13px] text-emerald-700 font-medium leading-relaxed">
          Saisissez vos ingrédients et ajustez les proportions vous-même, étape par étape.
        </p>

        <div className="flex items-center gap-1.5 mt-4 bg-emerald-500 text-emerald-50 text-[11px] font-black px-3 py-1.5 rounded-full">
          <Infinity size={12} /> Gratuit &amp; illimité
        </div>
      </button>

      {/* ── AUTOMATIQUE ── */}
      <button
        onClick={() => onModeChange('auto')}
        className={`relative flex flex-col items-start p-7 rounded-2xl border-[2.5px] text-left transition-all duration-200 hover:-translate-y-1 ${
          currentMode === 'auto'
            ? 'border-amber-500 bg-amber-50'
            : 'border-amber-300 bg-amber-50 hover:border-amber-500'
        }`}
      >
        {/* Halo qui pulse quand non sélectionné */}
        {currentMode !== 'auto' && (
          <span className="absolute inset-0 rounded-2xl border-[2.5px] border-amber-400 animate-ping opacity-30 pointer-events-none" />
        )}

        {currentMode === 'auto' && (
          <span className="absolute top-4 right-4 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
            <Check size={13} className="text-white" strokeWidth={3} />
          </span>
        )}

        <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center mb-4">
          <Zap size={26} className="text-white" fill="currentColor" />
        </div>

        <p className="text-xl font-black text-amber-900 mb-2">Automatique IA</p>
        <p className="text-[13px] text-amber-700 font-medium leading-relaxed">
          L'IA génère et optimise votre formule selon vos objectifs nutritionnels.
        </p>

        <div className="flex items-center gap-1.5 mt-4 bg-amber-500 text-amber-50 text-[11px] font-black px-3 py-1.5 rounded-full">
          <Zap size={12} fill="currentColor" /> Utilise un essai
        </div>
      </button>

    </div>
  )
}