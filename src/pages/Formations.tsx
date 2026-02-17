// src/pages/Formations.tsx
import { motion } from 'framer-motion'
import { GraduationCap, Play, CheckCircle, ExternalLink, Sparkles, BookOpen } from 'lucide-react'

export function Formations() {
  const formationUrl = "https://frica-volaille.systeme.io/formation"

  return (
    <div className="bg-slate-950 min-h-screen text-white">
      {/* 1. HERO SECTION - STYLE MINEA */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden flex flex-col items-center text-center">
        {/* Lueurs d'arrière-plan */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-125 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-400 mb-8 shadow-2xl">
            <GraduationCap size={14} fill="currentColor" className="opacity-20" />
            <span className="font-black uppercase tracking-[0.3em] text-[10px]">Académie ProvendeBuilder</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black leading-[1.05] tracking-tighter mb-8">
            Maîtrisez l'art de la <br />
            <span className="bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent italic">nutrition animale</span>.
          </h1>
          
          <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed mb-12">
            L'outil ne suffit pas sans le savoir. Apprenez les secrets de fabrication pour vos poulets de chair et pondeuses avec nos experts.
          </p>
          
          <div className="flex flex-col items-center gap-6">
            <a 
              href={formationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-12 py-6 bg-emerald-500 text-slate-950 rounded-full font-black text-sm uppercase tracking-widest shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:scale-105 transition-all flex items-center gap-3 group"
            >
              Accéder au catalogue <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">
              Propulsé par Frica-Volaille Academy
            </p>
          </div>
        </motion.div>
      </section>

      {/* 2. SECTION AVANTAGES - POURQUOI SE FORMER ? */}
      <section className="py-32 px-6 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                t: "Apprentissage Vidéo",
                d: "Des modules pas-à-pas pour maîtriser chaque étape de la fabrication.",
                i: <Play className="text-emerald-400" />
              },
              {
                t: "Certificat d'Expert",
                d: "Validez vos compétences et boostez la crédibilité de votre ferme.",
                i: <Sparkles className="text-emerald-400" />
              },
              {
                t: "Guides Pratiques",
                d: "Téléchargez des fiches techniques et des profilages nutritionnels exclusifs.",
                i: <BookOpen className="text-emerald-400" />
              }
            ].map((f, i) => (
              <div key={i} className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/8 transition-all group">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  {f.i}
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">{f.t}</h3>
                <p className="text-white/50 leading-relaxed font-medium text-sm">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SECTION IMPACT - RÉSULTATS GARANTIS */}
      <section className="py-32 px-6 bg-slate-900/20">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3.5rem] p-12 md:p-20 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
          
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tighter">Apprenez à réduire vos coûts de 40%.</h2>
              <div className="space-y-4">
                {[
                  "Choix des matières premières locales",
                  "Gestion des stocks et stockage",
                  "Analyse des indices de consommation",
                  "Secrets de la croissance rapide"
                ].map(text => (
                  <div key={text} className="flex items-center gap-3 text-white/70 text-sm font-bold">
                    <CheckCircle size={16} className="text-emerald-500" /> {text}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center md:text-right">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-4">Disponible immédiatement</p>
               <a 
                href={formationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-10 py-5 bg-white text-slate-950 rounded-full font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-2xl"
               >
                 Rejoindre la formation
               </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}