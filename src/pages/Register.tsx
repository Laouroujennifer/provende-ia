// src/pages/Register.tsx
import { useEffect, useState } from 'react' 
import { Link, useNavigate } from 'react-router-dom'
import { Sprout, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export function Register() {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  // SÉCURITÉ & REDIRECTION : 
  // Dès que isAuthenticated passe à 'true', on change de page.
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleAuthSimulation = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsLoading(true) // On lance l'animation de chargement
    
    // On simule un petit délai réseau de 800ms pour faire "vrai"
    setTimeout(() => {
      register()
    }, 800)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start md:justify-center p-4 md:p-6 relative overflow-x-hidden">
      
      {/* EFFETS DE FOND (Lueurs) */}
      <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-emerald-500/10 rounded-full blur-[80px] md:blur-[100px] -ml-20 md:-ml-48 -mt-20 md:-mt-48 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-emerald-500/5 rounded-full blur-[80px] md:blur-[100px] -mr-20 md:-mr-48 -mb-20 md:-mb-48 pointer-events-none" />

      {/* LIEN RETOUR (Responsive) */}
      <div className="w-full max-w-[500px] flex justify-start mb-6 md:absolute md:top-10 md:left-10 md:mb-0">
        <Link 
            to="/" 
            className="text-white/40 hover:text-white flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all group z-20"
        >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            Retour au site
        </Link>
      </div>

      {/* LOGO */}
      <div className="mb-8 md:mb-10 flex flex-col items-center gap-3 md:gap-4 relative z-10">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/20">
          <Sprout className="text-slate-950" size={24} md:size={28} />
        </div>
        <span className="text-lg md:text-xl font-black uppercase tracking-tighter text-white">
          PROVENDE<span className="text-emerald-400">BUILDER</span>
        </span>
      </div>

      {/* CARTE D'INSCRIPTION */}
      <div className="w-full max-w-[500px] bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-14 shadow-2xl relative z-10 border border-white/5 mb-12">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Inscription</h2>
          <p className="text-emerald-600 font-bold mt-2 text-xs md:text-sm italic">Commencez vos 3 essais gratuits</p>
        </div>

        {/* BOUTON GOOGLE */}
        <button 
          onClick={() => handleAuthSimulation()}
          disabled={isLoading}
          className="w-full py-3 md:py-4 border border-slate-200 rounded-2xl flex items-center justify-center gap-3 font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] disabled:opacity-50 transition-all mb-6 md:mb-8 shadow-sm text-sm"
        >
          {isLoading ? <Loader2 className="animate-spin text-emerald-500" size={20} /> : <img src="https://www.google.com/favicon.ico" className="w-4 h-4 md:w-5 md:h-5" alt="Google" />}
          {isLoading ? 'Connexion...' : 'Continuer avec Google'}
        </button>

        <div className="relative mb-6 md:mb-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <span className="relative bg-white px-4 text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
            ou par formulaire
          </span>
        </div>

        {/* FORMULAIRE */}
        <form className="space-y-4 md:space-y-5" onSubmit={handleAuthSimulation}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Prénom</label>
              <input type="text" required className="w-full p-3 md:p-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium text-slate-900 text-sm" placeholder="Ex: Jean" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nom</label>
              <input type="text" required className="w-full p-3 md:p-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium text-slate-900 text-sm" placeholder="Ex: Koffi" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Adresse Mail</label>
            <input type="email" required className="w-full p-3 md:p-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium text-slate-900 text-sm" placeholder="nom@exemple.com" />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Mot de passe</label>
            <input type="password" required className="w-full p-3 md:p-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium text-slate-900 text-sm" placeholder="••••••••" />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 md:py-5 bg-emerald-500 text-slate-950 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-70 transition-all flex items-center justify-center gap-3 group"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                CRÉER MON COMPTE
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 md:mt-10 text-slate-500 font-medium text-xs md:text-sm">
          Déjà inscrit ? <Link to="/login" className="text-emerald-600 font-black border-b-2 border-emerald-50 hover:border-emerald-500 transition-all ml-1">Se connecter</Link>
        </p>
      </div>

      <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest mb-6 relative z-10">
        © 2026 ProvendeBuilder — Sécurité Cloud
      </p>
    </div>
  )
}