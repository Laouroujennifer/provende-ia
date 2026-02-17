// src/pages/Marketplace.tsx
import { useState } from 'react'
import { 
  ShoppingBag, Truck, MapPin, Star, BadgeCheck, 
  Search,  ArrowRight, Wheat, Bird, Zap 
} from 'lucide-react'

export function Marketplace() {
  const [activeCategory, setActiveCategory] = useState('Tous')

  const categories = [
    { name: 'Tous', icon: <ShoppingBag size={14} /> },
    { name: 'Aliments', icon: <Wheat size={14} /> },
    { name: 'Poussins', icon: <Bird size={14} /> },
    { name: 'Équipement', icon: <Zap size={14} /> },
  ]

  const providers = [
    { 
      name: "Aliment-Pro Bénin", 
      type: "Provendier", 
      location: "Cotonou", 
      rating: 4.9, 
      reviews: 128,
      tags: ["Maïs", "Soja", "Concentré"], 
      verified: true,
      priceRange: "€€",
      delivery: "Sous 24h"
    },
    { 
      name: "Poussins-Express", 
      type: "Accouveur", 
      location: "Abomey-Calavi", 
      rating: 4.7, 
      reviews: 85,
      tags: ["Poussins J1", "Qualité Or"], 
      verified: true,
      priceRange: "€€€",
      delivery: "Retrait ferme"
    },
    { 
      name: "Agri-Tech Africa", 
      type: "Équipementier", 
      location: "Porto-Novo", 
      rating: 4.5, 
      reviews: 42,
      tags: ["Mangeoires", "IA"], 
      verified: false,
      priceRange: "€€",
      delivery: "Livraison incluse"
    },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-slate-900 pb-20">
      
      {/* 1. HERO BANNER - DESIGN ÉPURÉ */}
      <div className="relative bg-primary rounded-[3.5rem] p-12 overflow-hidden text-white shadow-2xl shadow-emerald-900/20">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 blur-[100px] -mr-40 -mt-40 rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 blur-[80px] -ml-32 -mb-32 rounded-full" />
        
        <div className="relative z-10 max-w-2xl text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6">
            <BadgeCheck size={14} /> Partenaires vérifiés
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter leading-tight">
            Trouvez vos <br /><span className="text-emerald-400 italic">matières premières</span>.
          </h2>
          <p className="text-emerald-100/60 font-medium text-lg">
            Commandez vos poussins et intrants directement auprès des fournisseurs certifiés.
          </p>
        </div>
      </div>

      {/* 2. BARRE DE RECHERCHE ET FILTRES */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
                activeCategory === cat.name 
                ? 'bg-primary text-white shadow-lg' 
                : 'bg-white text-slate-400 hover:bg-slate-100'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un fournisseur..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all font-medium"
          />
        </div>
      </div>

      {/* 3. GRILLE DES FOURNISSEURS */}
      <div className="grid grid-cols-1 gap-6">
        {providers.map((p, i) => (
          <div 
            key={i} 
            className="group bg-white p-8 rounded-[3rem] border border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-8 hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-500"
          >
            {/* Colonne gauche : Logo et Titre */}
            <div className="flex gap-8 items-center w-full lg:w-auto text-left">
              <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-3xl border border-slate-100 shadow-inner group-hover:scale-110 transition-transform duration-500">
                {p.type === 'Provendier' ? '🏢' : p.type === 'Accouveur' ? '🐥' : '⚙️'}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{p.name}</h3>
                  {p.verified && <BadgeCheck className="text-blue-500" size={20} fill="#dbeafe" />}
                </div>
                <div className="flex flex-wrap gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Truck size={12} className="text-emerald-500" /> {p.delivery}</span>
                  <span className="flex items-center gap-1"><MapPin size={12} className="text-slate-300" /> {p.location}</span>
                  <span className="text-slate-900">{p.priceRange}</span>
                </div>
              </div>
            </div>
            
            {/* Colonne centrale : Tags spécialisés */}
            <div className="flex gap-2 flex-wrap justify-center max-w-xs">
              {p.tags.map(t => (
                <span key={t} className="px-4 py-2 bg-emerald-50/50 border border-emerald-100/50 rounded-full text-[9px] font-black text-emerald-700 uppercase tracking-tight">
                  {t}
                </span>
              ))}
            </div>

            {/* Colonne droite : Note et CTA */}
            <div className="flex flex-col items-center lg:items-end gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, starI) => (
                    <Star key={starI} size={14} className={starI < 4 ? "text-amber-400" : "text-slate-200"} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs font-black text-slate-900">{p.rating}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">({p.reviews} avis)</span>
              </div>
              
              <button className="w-full lg:w-auto px-10 py-5 bg-slate-950 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-600 hover:scale-105 transition-all flex items-center justify-center gap-3">
                Voir le catalogue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 4. FOOTER APPEL À L'ACTION */}
      <div className="bg-slate-50 border border-slate-200 border-dashed rounded-[3rem] p-10 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Vous êtes un fournisseur ?</p>
          <h4 className="text-xl font-black text-slate-900 mb-6">Rejoignez le réseau ProvendeBuilder PRO</h4>
          <button className="px-8 py-4 border-2 border-primary text-primary rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
            Créer un profil marchand
          </button>
      </div>
    </div>
  )
}