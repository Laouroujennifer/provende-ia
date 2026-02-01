// src/pages/Login.tsx
import { Link } from 'react-router-dom'
import { Sprout, ArrowLeft, ArrowRight } from 'lucide-react'

export function Login() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Effets de lueur d'arrière-plan (Style Minea) */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -ml-48 -mt-48" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] -mr-48 -mb-48" />

      {/* Retour Accueil discret */}
      <Link 
        to="/" 
        className="absolute top-10 left-10 text-white/40 hover:text-white flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
        Accueil
      </Link>

      {/* Logo au-dessus de la carte */}
      <div className="mb-10 flex flex-col items-center gap-4 relative z-10">
        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/20">
          <Sprout className="text-slate-950" size={28} />
        </div>
        <span className="text-xl font-black uppercase tracking-tighter text-white">
          PROVENDE<span className="text-emerald-400">BUILDER</span>
        </span>
      </div>

      {/* CARTE DE CONNEXION */}
      <div className="w-full max-w-[440px] bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl relative z-10 border border-white/5">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Se connecter</h2>
          <p className="text-slate-400 font-medium mt-2 text-sm">Accédez à votre outil de formulation IA</p>
        </div>

        {/* 1. CONNEXION SOCIALE (GOOGLE) */}
        <button className="w-full py-4 border border-slate-200 rounded-2xl flex items-center justify-center gap-3 font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all mb-8 shadow-sm">
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Continuer avec Google
        </button>

        {/* Séparateur */}
        <div className="relative mb-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <span className="relative bg-white px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
            ou avec votre email
          </span>
        </div>

        {/* 2. FORMULAIRE CLASSIQUE */}
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
              Adresse Mail
            </label>
            <input 
              type="email" 
              required 
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium text-slate-900 placeholder:text-slate-300" 
              placeholder="nom@exemple.com" 
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                 Mot de passe
               </label>
               <Link to="/reset" className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:text-emerald-700">
                 Oublié ?
               </Link>
            </div>
            <input 
              type="password" 
              required 
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium text-slate-900" 
              placeholder="••••••••" 
            />
          </div>

          <button className="w-full py-5 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 group">
            SE CONNECTER
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Footer de la carte */}
        <p className="text-center mt-10 text-slate-500 font-medium text-sm">
          Nouveau ici ? <Link to="/register" className="text-emerald-600 font-black border-b-2 border-emerald-50 hover:border-emerald-500 transition-all ml-1">S'inscrire gratuitement</Link>
        </p>
      </div>

      {/* Mention légale discrète en bas */}
      <p className="mt-12 text-white/20 text-[10px] font-bold uppercase tracking-[0.1em]">
        © 2026 ProvendeBuilder — Sécurité Totale & Chiffrement Cloud
      </p>
    </div>
  )
}