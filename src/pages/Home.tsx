// src/pages/Home.tsx
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, ChevronRight, Calculator, Zap, Microscope } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Home() {
  return (
    <div className="bg-slate-950 text-white min-h-screen selection:bg-emerald-500/30">
      
      {/* 1. HERO SECTION (STYLE MINEA - CENTRÉE) */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden flex flex-col items-center text-center">
        {/* Lueur d'arrière-plan - On mélange Émeraude et Indigo pour la profondeur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-20 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl relative z-10"
        >
          {/* Badge vibrant */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Zap size={12} fill="currentColor" /> L'IA au service de la provende
          </div>

          <h1 className="text-5xl md:text-8xl font-black leading-[1.05] tracking-tighter mb-8">
            Trouvez votre provende <br />
            <span className="bg-linear-to-r from-emerald-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent italic drop-shadow-sm">optimale en 3 clics</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            ProvendeBuilder est une solution tout-en-un, conçue pour vous aider à optimiser votre élevage, augmenter votre croissance et booster vos profits.
          </p>
          
          <div className="flex flex-col items-center gap-6">
            <Link to="/register" className="px-12 py-6 bg-emerald-500 text-slate-950 rounded-full font-black text-sm uppercase tracking-widest shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:bg-emerald-400 hover:scale-105 transition-all flex items-center gap-3">
              Démarrer l'essai gratuit <ArrowRight size={20} />
            </Link>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">
              Essai de 3 formules inclus • Sans carte bancaire
            </p>
          </div>
        </motion.div>

        {/* --- C'EST ICI QUE TU MONTRES TON PRODUIT --- */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-20 max-w-5xl w-full border border-white/10 rounded-[2.5rem] p-3 bg-white/5 backdrop-blur-sm shadow-2xl relative group"
        >
          {/* Simulation de barre de navigateur */}
          <div className="absolute top-6 left-10 flex gap-2 z-20">
             <div className="w-3 h-3 rounded-full bg-red-500/50" />
             <div className="w-3 h-3 rounded-full bg-amber-500/50" />
             <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
          </div>

          <div className="relative overflow-hidden rounded-[2rem]">
            {/* ICI : Remplace l'URL par une capture d'écran de ton Dashboard (Analyseur Manuel) */}
            <img 
              src="https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=2000" 
              className="w-full h-auto opacity-90 shadow-2xl group-hover:scale-[1.01] transition-transform duration-700"
              alt="Interface Dashboard ProvendeBuilder"
            />
            {/* Overlay Gradient pour le look Minea */}
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </section>

      {/* 2. SECTION EXPERTISE TECHNIQUE (FOND BLANC - TON TEXTE) */}
      <section className="py-32 px-6 bg-white text-slate-900 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="w-12 h-1.5 bg-emerald-500 rounded-full mb-8"></div>
              <h2 className="text-4xl md:text-5xl font-black text-[#064e3b] mb-8 leading-tight tracking-tight">
                La science de la nutrition <br/>au service de votre rentabilité.
              </h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
                L'alimentation représente 70% des coûts de production. Notre IA ne se contente pas de mélanger des ingrédients : elle équilibre les <strong>Acides Aminés essentiels</strong> (Lysine, Méthionine), l'<strong>Énergie Métabolisable</strong> et les <strong>Minéraux</strong> pour maximiser l'Indice de Consommation (IC).
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { t: "Moindre Coût", d: "Algorithme linéaire pour trouver le prix le plus bas.", i: <Zap className="text-emerald-500" size={20}/> },
                  { t: "Précision Acide Aminé", d: "Équilibre parfait entre Lysine et Méthionine.", i: <Microscope className="text-emerald-500" size={20}/> },
                  { t: "Profils Spécifiques", d: "Démarrage, Croissance et Finition optimisés.", i: <Calculator className="text-emerald-500" size={20}/> },
                  { t: "Analyse des Stocks", d: "Utilisez vos matières premières disponibles.", i: <CheckCircle2 className="text-emerald-500" size={20}/> },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-5 border border-slate-100 rounded-2xl hover:border-emerald-500/30 hover:bg-emerald-50/30 transition-all cursor-default">
                    <div className="mt-1 shrink-0 p-2 bg-emerald-50 rounded-lg">{item.i}</div>
                    <div>
                      <h4 className="font-black text-sm text-slate-800 uppercase tracking-tight">{item.t}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-medium uppercase tracking-wider">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative group">
              {/* Effet décoratif derrière l'image */}
              <div className="absolute inset-0 bg-emerald-500 rounded-[3rem] rotate-3 opacity-10 group-hover:rotate-0 transition-transform duration-500" />
              <img 
                src="https://images.unsplash.com/photo-1516383274235-5f42d6c6426d?q=80&w=2000" 
                className="rounded-[3rem] shadow-2xl relative z-10 border border-slate-100" 
                alt="Élevage de précision" 
              />
              {/* Badge interactif */}
              <div className="absolute -bottom-10 -right-6 bg-[#064e3b] p-8 rounded-[2.5rem] text-white shadow-2xl z-20 border border-emerald-500/20 transform group-hover:scale-105 transition-transform">
                <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] mb-2 text-emerald-400">Impact Économique</p>
                <p className="text-4xl font-black text-white">-15% à -25%</p>
                <p className="text-xs font-bold opacity-80 uppercase tracking-widest mt-1">Sur le coût de la tonne</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION CTA (SANS TARIFS) */}
      <section className="py-32 px-6 bg-slate-50 text-slate-900 border-t border-slate-100">
        <div className="max-w-5xl mx-auto bg-slate-950 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl border border-white/5">
          {/* Lueur interne du CTA */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          
          <h2 className="text-3xl md:text-6xl font-black text-white mb-8 tracking-tighter">
            Prêt à optimiser votre <br/><span className="text-emerald-400 italic">production</span> ?
          </h2>
          <p className="text-white/40 mb-12 max-w-xl mx-auto font-medium leading-relaxed text-lg">
            Rejoignez gratuitement la communauté ProvendeBuilder et commencez à formuler comme un expert.
          </p>
          
          <Link 
            to="/register" 
            className="inline-flex items-center gap-4 px-12 py-6 bg-emerald-500 text-slate-950 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-emerald-500/20"
          >
            CRÉER UN COMPTE GRATUIT <ChevronRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}