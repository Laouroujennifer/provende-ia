// src/pages/Services.tsx
import { motion } from 'framer-motion'
import { Calculator, Beaker, FileText, Smartphone, ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Services() {
  const serviceItems = [
    { 
      title: "Analyseur de Ration", 
      icon: <Calculator size={32}/>, 
      desc: "Saisissez vos quantités et visualisez immédiatement si les besoins nutritionnels de vos poulets sont couverts.",
      mode: 'manual' // Ouvre l'analyseur manuel
    },
    { 
      title: "Générateur IA", 
      icon: <Beaker size={32}/>, 
      desc: "Notre Intelligence Artificielle calcule pour vous la combinaison d'ingrédients la moins chère pour 100kg.",
      mode: 'auto' // Ouvre le générateur automatique
    },
    { 
      title: "Fiches Techniques", 
      icon: <FileText size={32}/>, 
      desc: "Exportez vos recettes en PDF pour une fabrication simplifiée en usine ou à la ferme.",
      mode: 'manual' 
    },
    { 
      title: "Suivi de Bandes", 
      icon: <Smartphone size={32}/>, 
      desc: "Gardez l'historique de vos formules et analysez quelle recette donne le meilleur indice de consommation.",
      mode: 'manual' 
    },
  ]

  return (
    <div className="bg-white min-h-screen">
      {/* 1. Header Service - DARK TECH MINEA STYLE */}
      <section className="relative bg-slate-950 pt-48 pb-56 px-6 overflow-hidden">
        {/* Cercles de lumière vibrants */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-400/5 rounded-full blur-[100px] -ml-36 -mb-36" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl text-white"
          >
            <div className="flex items-center gap-2 text-emerald-400 mb-6">
              <Sparkles size={18} />
              <span className="font-black uppercase tracking-[0.3em] text-[10px]">Solutions de Précision</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter">
              Nos Solutions <br/>
              <span className="bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent italic">Agro-Tech</span>.
            </h1>
            <p className="text-xl text-white/50 leading-relaxed font-medium">
              Nous transformons la nutrition animale complexe en une interface simple pour tous les éleveurs. Optimisez vos profits en 3 clics.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Grid Services - TES GRANDES CARTES AÉRÉES + LOGIQUE REDIRECTION */}
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
                whileHover={{ y: -15, scale: 1.02 }}
                className="bg-white p-12 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.06)] border border-slate-50 flex flex-col items-start group transition-all duration-300"
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-8 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  {s.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight tracking-tight">{s.title}</h3>
                <p className="text-slate-500 mb-10 leading-relaxed font-medium text-sm">
                  {s.desc}
                </p>
                
                {/* LOGIQUE : On passe le mode via l'état (state) de React Router */}
                <Link 
                  to="/dashboard" 
                  state={{ initialMode: s.mode }}
                  className="mt-auto flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] hover:gap-4 transition-all group-hover:text-emerald-400"
                >
                  Découvrir <ArrowRight size={16}/>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CTA Final - DARK CTA POUR LA COHÉRENCE */}
      <section className="py-32 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto bg-slate-950 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
          {/* Lueur interne */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
          
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter">
            Besoin d'une solution sur-mesure ?
          </h2>
          <p className="text-lg text-white/40 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Nous accompagnons aussi les provenderies industrielles pour intégrer nos algorithmes dans leur chaîne de valeur et automatiser leur production.
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-4 px-12 py-5 bg-emerald-500 text-slate-950 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all"
          >
            Contacter un Expert
          </Link>
        </div>
      </section>
    </div>
  )
}