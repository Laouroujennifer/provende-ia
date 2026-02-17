// src/pages/Home.tsx
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, ChevronRight, Calculator, Zap, Microscope } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Home() {
  return (
    <div className="bg-slate-950 text-white min-h-screen selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* 1. HERO SECTION (STYLE MINEA - CENTRÉE) */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 overflow-hidden flex flex-col items-center text-center">
        {/* Lueur d'arrière-plan */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-20 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl relative z-10"
        >
          {/* Badge vibrant - IA supprimé */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Zap size={12} fill="currentColor" /> Technologie & Précision
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tighter mb-8 text-balance">
            Trouvez votre provende <br />
            <span className="bg-linear-to-r from-emerald-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent italic drop-shadow-sm">optimale en 3 clics</span>
          </h1>
          
          <p className="text-base md:text-xl text-white/50 max-w-2xl mx-auto mb-10 md:mb-12 font-medium leading-relaxed">
            ProvendeBuilder est une solution tout-en-un, conçue pour vous aider à optimiser votre élevage, augmenter votre croissance et booster vos profits.
          </p>
          
          <div className="flex flex-col items-center gap-6">
            <Link to="/register" className="w-full sm:w-auto px-8 md:px-12 py-5 md:py-6 bg-emerald-500 text-slate-950 rounded-full font-black text-sm uppercase tracking-widest shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:bg-emerald-400 hover:scale-105 transition-all flex items-center justify-center gap-3">
              Démarrer l'essai gratuit <ArrowRight size={20} />
            </Link>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">
              Essai de 3 formules inclus • Sans carte bancaire
            </p>
          </div>
        </motion.div>

        {/* MOCKUP PRODUIT (OPTION 1 : IMAGE TECH + SIMULATION INTERFACE) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 md:mt-20 max-w-5xl w-full border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] p-2 md:p-3 bg-white/5 backdrop-blur-sm shadow-2xl relative group overflow-hidden"
        >
          {/* Simulation de barre de navigateur */}
          <div className="absolute top-4 md:top-6 left-6 md:left-10 flex gap-1.5 md:gap-2 z-20">
             <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500/50" />
             <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-amber-500/50" />
             <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-emerald-500/50" />
          </div>

          <div className="relative overflow-hidden rounded-[1.2rem] md:rounded-[2rem]">
            {/* Image de fond Tech/Ferme */}
            <img 
              src="https://images.unsplash.com/photo-1595246140625-573b715d11dc?q=80&w=2000" 
              className="w-full h-[300px] md:h-[500px] object-cover opacity-60 group-hover:scale-[1.02] transition-transform duration-1000"
              alt="Technologie agricole de précision"
            />
            
            {/* Overlay Gradient pour le look Dashboard */}
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

            {/* Texte flottant simulant l'outil */}
            <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 text-left z-20">
              <div className="flex items-center gap-3 mb-2 md:mb-4">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <p className="text-emerald-400 font-black text-[10px] md:text-xs uppercase tracking-[0.3em]">Calculateur de précision actif</p>
              </div>
              <p className="text-white text-xl md:text-4xl font-black tracking-tight leading-tight">
                Optimisation des ratios <br className="hidden md:block"/> nutritionnels en temps réel.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. SECTION EXPERTISE TECHNIQUE (FOND BLANC) */}
      <section className="py-20 md:py-32 px-6 bg-white text-slate-900 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="w-12 h-1.5 bg-emerald-500 rounded-full mb-8"></div>
              <h2 className="text-3xl md:text-5xl font-black text-[#064e3b] mb-6 md:mb-8 leading-tight tracking-tight">
                La science de la nutrition <br/>au service de votre rentabilité.
              </h2>
              <p className="text-base md:text-lg text-slate-600 mb-8 md:mb-10 leading-relaxed font-medium">
                L'alimentation représente 70% des coûts de production. Notre système ne se contente pas de mélanger des ingrédients : il équilibre les <strong>Acides Aminés essentiels</strong>, l'<strong>Énergie Métabolisable</strong> et les <strong>Minéraux</strong> pour maximiser votre rendement.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                {[
                  { t: "Moindre Coût", d: "Trouvez le prix le plus bas.", i: <Zap className="text-emerald-500" size={20}/> },
                  { t: "Précision Acide Aminé", d: "Équilibre Lysine / Méthionine.", i: <Microscope className="text-emerald-500" size={20}/> },
                  { t: "Profils Spécifiques", d: "Démarrage, Croissance et Finition.", i: <Calculator className="text-emerald-500" size={20}/> },
                  { t: "Analyse des Stocks", d: "Utilisez vos propres matières.", i: <CheckCircle2 className="text-emerald-500" size={20}/> },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 md:p-5 border border-slate-100 rounded-2xl hover:border-emerald-500/30 hover:bg-emerald-50/30 transition-all cursor-default group/card">
                    <div className="mt-1 shrink-0 p-2 bg-emerald-50 rounded-lg group-hover/card:bg-emerald-500 group-hover/card:text-white transition-colors">{item.i}</div>
                    <div>
                      <h4 className="font-black text-[12px] md:text-sm text-slate-800 uppercase tracking-tight">{item.t}</h4>
                      <p className="text-[10px] md:text-[11px] text-slate-500 mt-1 leading-relaxed font-medium uppercase tracking-wider">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative group order-1 lg:order-2 px-2 md:px-0">
              <div className="absolute inset-0 bg-emerald-500 rounded-[2rem] md:rounded-[3rem] rotate-3 opacity-10 group-hover:rotate-0 transition-transform duration-500" />
              <img 
                src="https://images.unsplash.com/photo-1516383274235-5f42d6c6426d?q=80&w=2000" 
                className="rounded-[2rem] md:rounded-[3rem] shadow-2xl relative z-10 border border-slate-100 w-full" 
                alt="Élevage moderne" 
              />
              {/* Badge flottant */}
              <div className="absolute -bottom-6 -right-2 md:-bottom-10 md:-right-6 bg-[#064e3b] p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] text-white shadow-2xl z-20 border border-emerald-500/20 transform group-hover:scale-105 transition-transform max-w-[180px] md:max-w-none">
                <p className="text-[8px] md:text-[10px] font-black opacity-60 uppercase tracking-[0.2em] mb-1 md:mb-2 text-emerald-400">Impact Économique</p>
                <p className="text-2xl md:text-4xl font-black text-white">-15% à -25%</p>
                <p className="text-[8px] md:text-xs font-bold opacity-80 uppercase tracking-widest mt-1">Sur le coût de la tonne</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION CTA FINAL */}
      <section className="py-20 md:py-32 px-6 bg-slate-50 text-slate-900 border-t border-slate-100">
        <div className="max-w-5xl mx-auto bg-slate-950 rounded-[2rem] md:rounded-[3.5rem] p-10 md:p-24 text-center relative overflow-hidden shadow-2xl border border-white/5">
          {/* Lueur d'ambiance */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
          
          <h2 className="text-3xl md:text-6xl font-black text-white mb-6 md:mb-8 tracking-tighter leading-tight">
            Prêt à optimiser votre <br/><span className="text-emerald-400 italic">production</span> ?
          </h2>
          <p className="text-sm md:text-lg text-white/40 mb-10 md:mb-12 max-w-xl mx-auto font-medium leading-relaxed">
            Rejoignez gratuitement la communauté ProvendeBuilder et commencez à formuler comme un expert dès aujourd'hui.
          </p>
          
          <Link 
            to="/register" 
            className="inline-flex items-center justify-center gap-4 w-full sm:w-auto px-8 md:px-12 py-5 md:py-6 bg-emerald-500 text-slate-950 rounded-full font-black text-xs md:text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-emerald-500/20"
          >
            CRÉER UN COMPTE GRATUIT <ChevronRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}