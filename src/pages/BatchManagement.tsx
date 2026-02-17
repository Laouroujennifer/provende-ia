// src/pages/BatchManagement.tsx
import { useState } from 'react'
import { Plus, Bird, Utensils, X, Skull, Syringe, Calendar, Hash } from 'lucide-react'
import { HealthTracker } from '../components/HealthTracker'

export function BatchManagement() {
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false)
  const [isDailyEntryOpen, setIsDailyEntryOpen] = useState(false)
  const [showHealth, setShowHealth] = useState(false) // Pour afficher/masquer le carnet de santé
  
  const activeBatches = [
    { id: 1, name: "Bande A - Poulets de Chair", count: 500, age: "14 jours", mortality: "2%", status: "Croissance", foodConsum: "12 sacs" },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-slate-900">
      
      {/* 1. BARRE D'ACTION DISCRÈTE */}
      <div className="flex justify-end">
        <button 
          onClick={() => setIsAddBatchOpen(true)}
          className="flex items-center gap-3 bg-primary text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-emerald-900/10"
        >
          <Plus size={16} /> Lancer une Nouvelle Bande
        </button>
      </div>

      {/* 2. LISTE DES BANDES SOUS FORME DE CARTES PRO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
        {activeBatches.map(batch => (
          <div key={batch.id} className="bg-white border border-slate-100 rounded-[3rem] p-8 shadow-sm hover:border-emerald-500/30 transition-all">
            
            <div className="flex justify-between items-start mb-8">
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                  <Bird size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{batch.name}</h3>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{batch.status}</p>
                </div>
              </div>
            </div>

            {/* GRILLE DE STATS RAPIDES */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 text-center">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Effectif</p>
                <p className="text-lg font-black">{batch.count}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Âge</p>
                <p className="text-lg font-black">{batch.age}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100/50 text-red-600">
                <p className="text-[8px] font-black text-red-400 uppercase mb-1">Morts</p>
                <p className="text-lg font-black">{batch.mortality}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Conso</p>
                <p className="text-lg font-black">{batch.foodConsum}</p>
              </div>
            </div>

            {/* BOUTONS D'ACTION SUR LA BANDE */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setIsDailyEntryOpen(true)}
                className="flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-md"
              >
                <Utensils size={14} /> Saisir le jour
              </button>
              <button 
                onClick={() => setShowHealth(!showHealth)}
                className="flex items-center justify-center gap-2 py-4 bg-blue-50 text-blue-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-100 transition-all"
              >
                <Syringe size={14} /> Santé & Vaccins
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3. SECTION SANTÉ (Affichage conditionnel) */}
      {showHealth && (
        <div className="animate-in slide-in-from-top-4 duration-500">
          <HealthTracker />
        </div>
      )}

      {/* --- MODALE : NOUVELLE BANDE --- */}
      {isAddBatchOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900">Nouvelle Bande</h3>
              <button onClick={() => setIsAddBatchOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X /></button>
            </div>
            <form className="space-y-6 text-left" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom du lot</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                    <Bird size={18} className="text-slate-400" />
                    <input type="text" placeholder="Ex: Bande Janvier A" className="bg-transparent w-full outline-none font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Effectif initial</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                    <Hash size={18} className="text-slate-400" />
                    <input type="number" placeholder="500" className="bg-transparent w-full outline-none font-bold" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Arrivée</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                    <Calendar size={18} className="text-slate-400" />
                    <input type="date" className="bg-transparent w-full outline-none font-bold text-xs" />
                  </div>
                </div>
              </div>
              <button className="w-full py-5 bg-emerald-500 text-slate-950 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-emerald-500/20">Lancer la production</button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODALE : SAISIE QUOTIDIENNE --- */}
      {isDailyEntryOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black">Saisie du jour</h3>
              <button onClick={() => setIsDailyEntryOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X /></button>
            </div>
            <form className="space-y-8 text-left" onSubmit={(e) => e.preventDefault()}>
              <div className="flex items-center gap-6 p-6 bg-red-50 rounded-4xl border border-red-100">
                 <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200"><Skull size={24} /></div>
                 <div className="flex-1">
                    <label className="text-[10px] font-black text-red-400 uppercase tracking-widest">Mortalité</label>
                    <input type="number" placeholder="0" className="w-full bg-transparent text-2xl font-black text-red-600 outline-none" />
                 </div>
              </div>
              <div className="flex items-center gap-6 p-6 bg-emerald-50 rounded-4xl border border-emerald-100">
                 <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200"><Utensils size={24} /></div>
                 <div className="flex-1">
                    <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Sacs d'aliment</label>
                    <input type="number" placeholder="0" className="w-full bg-transparent text-2xl font-black text-emerald-700 outline-none" />
                 </div>
              </div>
              <button className="w-full py-6 bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl">Mettre à jour les stats</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}