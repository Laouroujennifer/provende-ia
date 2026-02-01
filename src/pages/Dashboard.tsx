// src/pages/Dashboard.tsx
import { useState } from 'react'
import { LayoutGrid,  FileText, LogOut, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ModeSelector } from '../components/ModeSelector'
import { ManualAnalyzer } from './ManualAnalyzer'
import { AutomaticGenerator } from './AutomaticGenerator'

export function Dashboard() {
  const [mode, setMode] = useState<'manual' | 'auto'>('manual')

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR : Seule navigation possible ici */}
      <aside className="w-20 lg:w-72 bg-[#064e3b] flex flex-col p-6 text-white fixed h-full z-40">
        <div className="mb-12 mt-4 hidden lg:block">
            <span className="text-xl font-black tracking-tighter uppercase italic">PB <span className="text-emerald-400">PRO</span></span>
        </div>
        
        <nav className="space-y-2 flex-1">
          <button className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold bg-emerald-500 text-white shadow-lg shadow-emerald-900/20">
            <LayoutGrid size={22} />
            <span className="hidden lg:block uppercase text-xs tracking-widest">Calculateur</span>
          </button>
          {/* Liens inactifs pour la démo */}
          <button className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-emerald-100/40 hover:bg-white/5">
            <FileText size={22} />
            <span className="hidden lg:block uppercase text-xs tracking-widest">Mes Recettes</span>
          </button>
        </nav>

        {/* Boutons de sortie */}
        <div className="pt-6 border-t border-white/10 space-y-2">
          <Link to="/" className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-emerald-100/40 hover:text-white transition-all">
            <Home size={22} />
            <span className="hidden lg:block uppercase text-xs tracking-widest">Site Public</span>
          </Link>
          <button className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-red-300 hover:bg-red-500/10 transition-all">
            <LogOut size={22} />
            <span className="hidden lg:block uppercase text-xs tracking-widest">Quitter</span>
          </button>
        </div>
      </aside>

      {/* CONTENU DU DASHBOARD */}
      <main className="flex-1 ml-20 lg:ml-72 p-6 lg:p-12">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Espace de Formulation</h1>
            <p className="text-slate-500 font-medium">Bonjour, prêt pour un nouveau mélange ?</p>
          </div>
        </header>

        <ModeSelector currentMode={mode} onModeChange={setMode} />

        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {mode === 'manual' ? <ManualAnalyzer /> : <AutomaticGenerator />}
        </div>
      </main>
    </div>
  )
}