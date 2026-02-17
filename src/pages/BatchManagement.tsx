// src/pages/BatchManagement.tsx
import { useState } from 'react'
import { Plus, Bird, Utensils, X,  Skull } from 'lucide-react'
import { HealthTracker } from '../components/HealthTracker'

export function BatchManagement() {
  // 1. ÉTATS POUR LES FENÊTRES (MODALES)
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false)
  const [isDailyEntryOpen, setIsDailyEntryOpen] = useState(false)
  
  const activeBatches = [
    { id: 1, name: "Bande A - Poulets de Chair", count: 500, age: "14 jours", mortality: "2%", status: "Croissance", foodConsum: "12 sacs" },
  ]

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 text-slate-900">
      
      {/* HEADER AVEC BOUTON AJOUTER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Gestion des Bandes</h2>
          <p className="text-slate-500 font-medium italic text-left">Suivi de production en temps réel</p>
        </div>
        <button 
          onClick={() => setIsAddBatchOpen(true)}
          className="flex items-center gap-3 bg-[#064e3b] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
        >
          <Plus size={18} /> Nouvelle Bande
        </button>
      </div>

      {/* LISTE DES BANDES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
        {activeBatches.map(batch => (
          <div key={batch.id} className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm hover:border-emerald-500/30 transition-all">
            <div className="flex justify-between items-start mb-10">
              <div className="flex gap-5">
                <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600">
                  <Bird size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{batch.name}</h3>
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">{batch.status}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              {/* Stats d'affichage (statiques ici pour l'exemple) */}
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[9px] font-black text-slate-400 uppercase">Effectif</p>
                <p className="text-xl font-black">{batch.count}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[9px] font-black text-slate-400 uppercase">Âge</p>
                <p className="text-xl font-black">{batch.age}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-2xl">
                <p className="text-[9px] font-black text-red-400 uppercase">Morts</p>
                <p className="text-xl font-black text-red-600">{batch.mortality}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[9px] font-black text-slate-400 uppercase">Conso</p>
                <p className="text-xl font-black">{batch.foodConsum}</p>
              </div>
            </div>

            <button 
              onClick={() => setIsDailyEntryOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-5 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200"
            >
              <Utensils size={14} /> Saisir Données du Jour
            </button>
          </div>
        ))}
      </div>

      {/* --- FORMULAIRE 1 : AJOUTER UNE NOUVELLE BANDE (MODALE) --- */}
      {isAddBatchOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900">Nouvelle Bande</h3>
              <button onClick={() => setIsAddBatchOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X /></button>
            </div>
            
            <form className="space-y-6 text-left" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom du lot</label>
                <input type="text" placeholder="Ex: Bande Janvier A" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre initial</label>
                  <input type="number" placeholder="500" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date d'arrivée</label>
                  <input type="date" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" />
                </div>
              </div>
              <button className="w-full py-5 bg-emerald-500 text-slate-950 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-emerald-500/20">Créer la Bande</button>
            </form>
          </div>
        </div>
      )}

      {/* --- FORMULAIRE 2 : SAISIE QUOTIDIENNE (MODALE) --- */}
      {isDailyEntryOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8 text-slate-900">
              <h3 className="text-2xl font-black">Saisie du Jour</h3>
              <button onClick={() => setIsDailyEntryOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X /></button>
            </div>
            
            <p className="text-sm font-medium text-slate-500 mb-8 text-left italic">Entrez les chiffres d'aujourd'hui pour mettre à jour vos performances.</p>

            <form className="space-y-8 text-left" onSubmit={(e) => e.preventDefault()}>
              <div className="flex items-center gap-6 p-6 bg-red-50 rounded-[2rem] border border-red-100">
                 <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white"><Skull size={24} /></div>
                 <div className="flex-1">
                    <label className="text-[10px] font-black text-red-400 uppercase tracking-widest">Mortalité (Nombre de morts)</label>
                    <input type="number" placeholder="0" className="w-full bg-transparent text-2xl font-black text-red-600 outline-none" />
                 </div>
              </div>

              <div className="flex items-center gap-6 p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100">
                 <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white"><Utensils size={24} /></div>
                 <div className="flex-1">
                    <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Alimentation (Sacs de 50kg donnés)</label>
                    <input type="number" placeholder="0" className="w-full bg-transparent text-2xl font-black text-emerald-700 outline-none" />
                 </div>
              </div>

              <button className="w-full py-6 bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl">Enregistrer les données</button>
            </form>
          </div>
        </div>
      )}

      <HealthTracker />
    </div>
  )
}