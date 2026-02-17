// src/pages/Academy.tsx
import { useState } from 'react'
import { ExternalLink, ArrowLeft, PlayCircle, BookOpen } from 'lucide-react'

export function Academy() {
  const formationUrl = "https://frica-volaille.systeme.io/formation"
  const [showFullSite, setShowFullSite] = useState(false)

  // SI ON OUVRE LA FORMATION (IFRAME)
  if (showFullSite) {
    return (
      <div className="h-[calc(100vh-100px)] flex flex-col animate-in fade-in duration-500">
        <button 
          onClick={() => setShowFullSite(false)}
          className="mb-4 flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft size={14} /> Retour au catalogue
        </button>
        <div className="flex-1 rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-2xl bg-white">
          <iframe 
            src={formationUrl} 
            className="w-full h-full"
            title="Formation Frica-Volaille"
          />
        </div>
      </div>
    )
  }

  // AFFICHAGE DE LA CARTE SEULE
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-700 pb-20">
      
      <div className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
        <div className="flex flex-col md:flex-row">
          
          {/* Image de gauche */}
          <div className="md:w-2/5 relative h-64 md:h-auto">
            <img 
              src="https://images.unsplash.com/photo-1595246140625-573b715d11dc?q=80&w=600" 
              className="w-full h-full object-cover" 
              alt="Fabrication" 
            />
            <div className="absolute inset-0 bg-emerald-900/10 flex items-center justify-center">
                <PlayCircle size={64} className="text-white/80" />
            </div>
          </div>

          {/* Contenu de droite */}
          <div className="md:w-3/5 p-10 text-left flex flex-col justify-center">
            <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-4">
              <BookOpen size={14} /> Programme Certifié
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight">
              Maîtriser la fabrication de son aliment Volaille
            </h3>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed text-sm">
              Inclus : Formules pour Poulets de Chair, Pondeuses et plus. Apprenez à utiliser les matières premières locales pour maximiser vos profits.
            </p>
            
            <button 
              onClick={() => setShowFullSite(true)}
              className="w-full md:w-fit flex items-center justify-center gap-3 px-10 py-5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-emerald-600 hover:scale-105 transition-all"
            >
              Accéder à la formation <ExternalLink size={16} />
            </button>
          </div>

        </div>
      </div>

      {/* Petit badge de réassurance en bas */}
      <div className="mt-8 flex items-center justify-center gap-3 text-slate-400">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Formation propulsée par Frica-Volaille</p>
      </div>

    </div>
  )
}