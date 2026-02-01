// src/pages/Services.tsx
import { motion } from 'framer-motion'
import { Calculator, Beaker, FileText, Smartphone, ArrowRight, Sparkles, ExternalLink } from 'lucide-react'

export function Services() {
  // TON LIEN EXTERNE UNIQUE
  const serviceExternalUrl = "https://pamphilemehou.systeme.io/frica-volaille"

  const serviceItems = [
    { 
      title: "Analyseur de Ration", 
      icon: <Calculator size={32}/>, 
      desc: "Saisissez vos quantités de maïs, soja et prémix. Visualisez immédiatement si les besoins nutritionnels de vos poulets sont couverts." 
    },
    { 
      title: "Générateur IA", 
      icon: <Beaker size={32}/>, 
      desc: "Laissez notre Intelligence Artificielle calculer la combinaison d'ingrédients la moins chère pour un mélange de 100kg." 
    },
    { 
      title: "Fiches Techniques", 
      icon: <FileText size={32}/>, 
      desc: "Exportez vos recettes optimisées en PDF professionnel pour une fabrication simplifiée en usine ou directement à la ferme." 
    },
    { 
      title: "Suivi de Performance", 
      icon: <Smartphone size={32}/>, 
      desc: "Gardez l'historique complet de vos formules et analysez quelle recette donne le meilleur indice de croissance à vos bandes." 
    },
  ]

  return (
    <div className="bg-white min-h-screen">
      {/* 1. HEADER SECTION - DARK PREMIUM MINEA STYLE */}
      <section className="relative bg-slate-950 pt-48 pb-56 px-6 overflow-hidden">
        {/* Cercles de lumière vibrants */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-400/5 rounded-full blur-[100px] -ml-36 -mb-36 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-white"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400 mb-6 font-black uppercase tracking-[0.3em] text-[10px]">
              <Sparkles size={14} />
              L'excellence en provenderie
            </div>
            <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter">
              Nos Services <br/>
              <span className="bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent italic">Premium</span>.
            </h1>
            <p className="text-xl text-white/50 leading-relaxed font-medium mb-12">
              Nous avons simplifié la nutrition animale pour vous offrir des outils de précision. Augmentez vos rendements dès aujourd'hui.
            </p>
            
            <a 
              href={serviceExternalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 bg-emerald-500 text-slate-950 rounded-full font-black text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105 transition-all"
            >
              Voir les offres d'accompagnement <ExternalLink size={18} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* 2. GRID SERVICES - LES CARTES BLANCHES (LA PARTIE QUE TU AS DEMANDÉE) */}
      <section className="py-32 px-6 -mt-16 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {serviceItems.map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -15 }}
                className="bg-white p-12 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.07)] border border-slate-50 flex flex-col items-start group transition-all duration-500"
              >
                {/* Icône avec cercle émeraude */}
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-8 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm">
                  {s.icon}
                </div>

                {/* Titre & Description */}
                <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight tracking-tight">
                  {s.t} {s.title}
                </h3>
                <p className="text-slate-500 mb-10 leading-relaxed font-medium text-sm">
                  {s.desc}
                </p>
                
                {/* BOUTON DÉCOUVRIR (LIEN EXTERNE) */}
                <a 
                  href={serviceExternalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] hover:gap-4 transition-all group-hover:text-emerald-400"
                >
                  Ouvrir l'outil <ArrowRight size={16}/>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CTA FINAL - STYLE SOMBRE */}
      <section className="py-32 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto bg-slate-950 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter uppercase leading-tight">
            Besoin d'une transformation <br/> industrielle ?
          </h2>
          <p className="text-lg text-white/40 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Rejoignez Pamphile Mehou et l'équipe Frica-Volaille pour transformer votre élevage en une entreprise hautement rentable.
          </p>
          <a 
            href={serviceExternalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 px-12 py-6 bg-white text-slate-950 rounded-full font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-400 hover:scale-105 transition-all"
          >
            Démarrer l'accompagnement
          </a>
        </div>
      </section>
    </div>
  )
}