// src/pages/Services.tsx
import { motion } from 'framer-motion'
import { Calculator, Beaker, FileText, Smartphone, ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Services() {
  const serviceItems = [
    { title: "Analyseur de Ration", icon: <Calculator size={32}/>, desc: "Saisissez vos quantités et visualisez immédiatement si les besoins nutritionnels de vos poulets sont couverts." },
    { title: "Générateur IA", icon: <Beaker size={32}/>, desc: "Notre Intelligence Artificielle calcule pour vous la combinaison d'ingrédients la moins chère pour 100kg." },
    { title: "Fiches Techniques", icon: <FileText size={32}/>, desc: "Exportez vos recettes en PDF pour une fabrication simplifiée en usine ou à la ferme." },
    { title: "Suivi de Bandes", icon: <Smartphone size={32}/>, desc: "Gardez l'historique de vos formules et analysez quelle recette donne le meilleur indice de consommation." },
  ]

  return (
    <div className="bg-white min-h-screen">
      {/* 1. Header Service - VERT PLUS VIVANT AVEC GRADIENT ET LUMIÈRE */}
      <section className="relative bg-linear-to-br from-[#064e3b] via-[#065f46] to-[#064e3b] pt-48 pb-40 px-6 overflow-hidden">
        {/* Effets de lumière pour casser le côté "fade" */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-[100px] -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-[80px] -ml-32 -mb-32" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-2xl text-white">
            <div className="flex items-center gap-2 text-emerald-400 mb-6">
              <Sparkles size={18} />
              <span className="font-black uppercase tracking-[0.3em] text-xs">Innovation Agricole</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              Nos Solutions <br/>
              <span className="text-emerald-400 underline decoration-white/10 underline-offset-10 italic">Agro-Tech</span>.
            </h1>
            <p className="text-xl text-emerald-100/70 leading-relaxed font-medium">
              Nous transformons la nutrition animale complexe en une interface simple pour tous les éleveurs.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Grid Services - LOGIQUE "DÉCOUVRIR" */}
      <section className="py-32 px-6 -mt-24 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {serviceItems.map((s, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -15 }}
                className="bg-white p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-50 flex flex-col items-start group transition-all duration-300"
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-8 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  {s.icon}
                </div>
                <h3 className="text-2xl font-black text-[#064e3b] mb-4 leading-tight">{s.title}</h3>
                <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                  {s.desc}
                </p>
                {/* LOGIQUE : Link vers le dashboard (ce qui forcera l'inscription) */}
                <Link 
                  to="/dashboard" 
                  className="mt-auto flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest hover:gap-4 transition-all"
                >
                  Découvrir <ArrowRight size={16}/>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CTA Final - OPTIMISÉ */}
      <section className="py-32 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-black text-[#064e3b] mb-8 uppercase tracking-tighter">
            Besoin d'une solution sur-mesure ?
          </h2>
          <p className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Nous accompagnons aussi les provenderies industrielles pour intégrer nos algorithmes dans leur chaîne de valeur.
          </p>
          <Link 
            to="/contact" 
            className="inline-block px-12 py-5 bg-[#064e3b] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-900/20 hover:bg-emerald-600 transition-all"
          >
            Contacter un Expert
          </Link>
        </div>
      </section>
    </div>
  )
}