// src/pages/Dashboard.tsx
import { useState } from 'react'
import { 
  LayoutGrid, LogOut, Home, Menu, X, User, 
  Bird, ShoppingBag, GraduationCap, Gift 
} from 'lucide-react' 
import { Link } from 'react-router-dom'
import { ModeSelector } from '../components/ModeSelector'
import { ManualAnalyzer } from './ManualAnalyzer'
import { AutomaticGenerator } from './AutomaticGenerator'
import { BatchManagement } from './BatchManagement'
import { Marketplace } from './Marketplace'
import { Academy } from './Academy'
import { ReferralSection } from './ReferralSection'

type View = 'calculator' | 'batches' | 'market' | 'academy' | 'referral'

export function Dashboard() {
  const [activeView, setActiveView] = useState<View>('calculator')
  const [mode, setMode] = useState<'manual' | 'auto'>('manual')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const navigateTo = (view: View) => {
    setActiveView(view)
    setIsSidebarOpen(false)
  }

  return (
    // FIX : On ajoute text-slate-900 pour forcer le texte en sombre sur le fond clair
    <div className="min-h-screen bg-slate-50 flex overflow-hidden text-slate-900">
      
      {/* 1. OVERLAY (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 2. SIDEBAR MODERNE */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#064e3b] text-white p-6 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:flex lg:flex-col lg:h-screen
      `}>
        <div className="flex items-center justify-between mb-12 mt-4">
          <span className="text-xl font-black tracking-tighter uppercase italic">
            PB <span className="text-emerald-400">PRO</span>
          </span>
          <button className="lg:hidden p-2 text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="space-y-2 flex-1 overflow-y-auto pr-2">
          <button 
            onClick={() => navigateTo('calculator')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeView === 'calculator' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-emerald-100/60 hover:bg-white/10 hover:text-white'}`}
          >
            <LayoutGrid size={22} />
            <span className="uppercase text-xs tracking-widest">Calculateur</span>
          </button>

          <button 
            onClick={() => navigateTo('batches')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeView === 'batches' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-emerald-100/60 hover:bg-white/10 hover:text-white'}`}
          >
            <Bird size={22} />
            <span className="uppercase text-xs tracking-widest">Mes Bandes</span>
          </button>

          <button 
            onClick={() => navigateTo('market')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeView === 'market' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-emerald-100/60 hover:bg-white/10 hover:text-white'}`}
          >
            <ShoppingBag size={22} />
            <span className="uppercase text-xs tracking-widest">Le Marché</span>
          </button>

          <button 
            onClick={() => navigateTo('academy')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeView === 'academy' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-emerald-100/60 hover:bg-white/10 hover:text-white'}`}
          >
            <GraduationCap size={22} />
            <span className="uppercase text-xs tracking-widest">Académie</span>
          </button>

          <button 
            onClick={() => navigateTo('referral')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeView === 'referral' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-emerald-100/60 hover:bg-white/10 hover:text-white'}`}
          >
            <Gift size={22} />
            <span className="uppercase text-xs tracking-widest">Parrainage</span>
          </button>
        </nav>

        <div className="pt-6 border-t border-white/10 space-y-2">
          <Link to="/" className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-emerald-100/60 hover:text-white transition-all">
            <Home size={22} />
            <span className="uppercase text-xs tracking-widest">Site Public</span>
          </Link>
          <button className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-red-300 hover:bg-red-500/10 transition-all">
            <LogOut size={22} />
            <span className="uppercase text-xs tracking-widest">Quitter</span>
          </button>
        </div>
      </aside>

      {/* 3. CONTENU PRINCIPAL DYNAMIQUE */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-slate-200 p-4 lg:hidden flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-100 rounded-xl text-slate-600">
            <Menu size={24} />
          </button>
          <span className="font-black text-slate-900 text-sm tracking-tighter uppercase">PB PRO</span>
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
            <User size={20} />
          </div>
        </header>

        <div className="p-4 md:p-8 lg:p-12">
          {/* HEADER DE LA PAGE ACTIVE */}
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="text-left">
              <h1 className="text-4xl font-black text-slate-900 leading-tight">
                {activeView === 'calculator' && "Espace Formulation"}
                {activeView === 'batches' && "Gestion des Bandes"}
                {activeView === 'market' && "Le Marché B2B"}
                {activeView === 'academy' && "Académie de Formation"}
                {activeView === 'referral' && "Programme Ambassadeur"}
              </h1>
              <p className="text-slate-500 font-medium">
                {activeView === 'calculator' && "Optimisez vos coûts alimentaires."}
                {activeView === 'batches' && "Suivez vos performances de production."}
                {activeView === 'market' && "Trouvez vos fournisseurs certifiés."}
                {activeView === 'academy' && "Apprenez les meilleures techniques."}
                {activeView === 'referral' && "Partagez et gagnez des récompenses."}
              </p>
            </div>
            
            <div className="hidden lg:flex items-center gap-4 bg-white p-2 pr-6 rounded-full border border-slate-200 shadow-sm">
               <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">PM</div>
               <div className="text-left leading-none">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Éleveur Pro</p>
                  <p className="text-xs font-bold text-slate-700">Pamphile M.</p>
               </div>
            </div>
          </header>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {activeView === 'calculator' && (
              <>
                <div className="mb-8">
                  <ModeSelector currentMode={mode} onModeChange={setMode} />
                </div>
                {mode === 'manual' ? <ManualAnalyzer /> : <AutomaticGenerator />}
              </>
            )}

            {activeView === 'batches' && <BatchManagement />}
            {activeView === 'market' && <Marketplace />}
            {activeView === 'academy' && <Academy />}
            {activeView === 'referral' && <ReferralSection />}
          </div>
        </div>
      </main>
    </div>
  )
}