import { useState } from 'react'
import {
  LayoutGrid, LogOut, Menu, Gift, FlaskConical,
  TrendingUp, ArrowUpRight, Wheat, ChevronRight, Sparkles
} from 'lucide-react'
import { ModeSelector } from '../components/ModeSelector'
import { ManualAnalyzer } from './ManualAnalyzer'
import { AutomaticGenerator } from './AutomaticGenerator'
import { ReferralSection } from './ReferralSection'
import { SavedFormulas } from './SavedFormulas'
import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../contexts/SubscriptionContext'

type View = 'home' | 'calculator' | 'referral' | 'history'

interface KpiCardProps { label: string; value: string | number; sub: string; accent: string; icon: React.ReactNode }

function KpiCard({ label, value, sub, accent, icon }: KpiCardProps) {
  return (
    <div className="relative bg-white rounded-3xl p-6 border border-slate-200 shadow-sm overflow-hidden group hover:border-emerald-500 transition-all duration-300">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 -mr-8 -mt-8 ${accent}`} />
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent} bg-opacity-10 text-slate-900`}>{icon}</div>
        <ArrowUpRight size={14} className="text-slate-300 group-hover:text-emerald-500" />
      </div>
      <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</p>
      <p className="text-[11px] text-slate-400 font-medium mt-2 italic border-t border-slate-50 pt-2">{sub}</p>
    </div>
  )
}

export function Dashboard() {
  const { user, signOut } = useAuth()
  const { subscription } = useSubscription()
  const [activeView, setActiveView] = useState<View>('home')
  const [mode, setMode] = useState<'manual' | 'auto'>('manual')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const userName = user?.user_metadata?.first_name || "Éleveur"
  
  const navItems = [
    { id: 'home' as View, label: 'Accueil', icon: <LayoutGrid size={18} /> },
    { id: 'calculator' as View, label: 'Calculateur', icon: <FlaskConical size={18} /> },
    { id: 'history' as View, label: 'Mes Formules', icon: <Wheat size={18} /> },
    { id: 'referral' as View, label: 'Parrainage', icon: <Gift size={18} /> },
  ]

  const viewTitles = {
    home: { t: "Tableau de bord", s: "Vue d'ensemble de votre activité" },
    calculator: { t: "Espace Formulation", s: "Optimisez vos coûts alimentaires" },
    history: { t: "Mes Formules", s: "Retrouvez vos calculs enregistrés" },
    referral: { t: "Programme Ambassadeur", s: "Invitez des amis et gagnez des bonus" }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden text-slate-900 font-sans">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#052e20] text-white flex flex-col transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className="p-8 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-slate-950 font-black shadow-lg">PB</div>
            <span className="font-black uppercase tracking-tighter text-lg">Provende<span className="text-emerald-400">Builder</span></span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => { setActiveView(item.id); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeView === item.id ? 'bg-emerald-500 text-slate-950 shadow-xl' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-5 py-4 text-red-400/60 font-black text-[10px] uppercase tracking-widest hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all">
            <LogOut size={18}/> Se déconnecter
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        
        {/* MOBILE HEADER */}
        <header className="lg:hidden bg-white border-b p-4 flex justify-between items-center sticky top-0 z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-100 rounded-xl text-slate-600"><Menu size={20}/></button>
          <span className="font-black uppercase text-sm text-slate-900 tracking-tighter">ProvendeBuilder</span>
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center font-black text-xs text-slate-950">{userName.substring(0, 2).toUpperCase()}</div>
        </header>

        {/* PAGE HEADER (DESKTOP) */}
        <div className="hidden lg:flex items-center justify-between px-12 py-8 bg-white border-b border-slate-200">
            <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{viewTitles[activeView].t}</h2>
                <p className="text-sm text-slate-400 font-medium">{viewTitles[activeView].s}</p>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-xs text-white uppercase">{userName.substring(0, 2)}</div>
                <div className="text-left leading-none">
                    <p className="text-[10px] font-black uppercase text-slate-400">Éleveur Pro</p>
                    <p className="text-xs font-bold text-slate-900">{userName}</p>
                </div>
            </div>
        </div>

        <div className="flex-1 p-6 md:p-12">
          
          {/* HOME VIEW */}
          {activeView === 'home' && (
             <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Bienvenue, {userName} 👋</h1>
                        <p className="text-slate-500 font-medium">Voici le résumé de votre activité.</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 font-black text-[10px] uppercase tracking-widest">
                        <Sparkles size={14} /> Système IA Actif
                    </div>
                </div>

                {/* KPI GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KpiCard label="Recettes" value={subscription.formulasCount} sub="Sauvegardées" accent="bg-emerald-500" icon={<FlaskConical size={18} />} />
                    <KpiCard label="Essais IA" value={`${subscription.autoFormulasCount}/${3 + subscription.bonusCalculations}`} sub="Utilisés / Total" accent="bg-amber-400" icon={<TrendingUp size={18} />} />
                    <KpiCard label="Bonus" value={subscription.bonusCalculations} sub="Via parrainage" accent="bg-purple-500" icon={<Gift size={18} />} />
                    <KpiCard label="Statut" value={subscription.status === 'active' ? "PRO" : "FREE"} sub="Niveau d'accès" accent="bg-blue-500" icon={<LayoutGrid size={18} />} />
                </div>

                {/* ACTIONS RAPIDES (CORRIGÉ : MAINTENANT TRÈS VISIBLE) */}
                <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-200 pb-4">Actions Rapides</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        {/* CARTE CALCULATEUR (VERT SOMBRE) */}
                        <button 
                          onClick={() => setActiveView('calculator')} 
                          className="group relative bg-[#064e3b] p-8 rounded-[2.5rem] text-left hover:scale-[1.01] transition-all shadow-2xl overflow-hidden border border-emerald-800"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                <FlaskConical size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2">Calculateur de Provende</h3>
                            <p className="text-emerald-100/60 text-sm font-medium mb-6">Ajustez vos ingrédients ou utilisez l'IA pour optimiser vos coûts.</p>
                            <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest">
                                Ouvrir l'outil <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>

                        {/* CARTE HISTORIQUE (BLANC) */}
                        <button 
                          onClick={() => setActiveView('history')} 
                          className="group relative bg-white p-8 rounded-[2.5rem] text-left border border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all overflow-hidden"
                        >
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-6 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                <Wheat size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Historique des Recettes</h3>
                            <p className="text-slate-400 text-sm font-medium mb-6">Retrouvez toutes vos formulations sauvegardées et vos résultats IA.</p>
                            <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                                Voir mes archives <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>

                    </div>
                </div>
             </div>
          )}

          {/* CALCULATOR VIEW */}
          {activeView === 'calculator' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm inline-block">
                <ModeSelector currentMode={mode} onModeChange={setMode} />
              </div>
              <div className="mt-4">
                {mode === 'manual' ? <ManualAnalyzer /> : <AutomaticGenerator />}
              </div>
            </div>
          )}

          {/* HISTORY VIEW */}
          {activeView === 'history' && (
            <div className="max-w-6xl mx-auto">
              <SavedFormulas />
            </div>
          )}

          {/* REFERRAL VIEW */}
          {activeView === 'referral' && (
            <div className="max-w-4xl mx-auto">
              <ReferralSection />
            </div>
          )}

        </div>
      </main>
    </div>
  )
}