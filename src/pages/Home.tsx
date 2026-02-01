// src/pages/Home.tsx
import { motion } from 'framer-motion'
import { ArrowRight, Layout, CheckCircle2, ChevronRight, Calculator, Zap, Microscope } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Home() {
  return (
    <div className="bg-white">
      {/* SECTION HERO - AFFINÉE */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#064e3b]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=2000" 
            className="w-full h-full object-cover opacity-40" 
            alt="Ferme"
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#064e3b]/80 to-[#064e3b]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
          <div className="max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black text-white leading-tight mb-6"
            >
              L'IA au service d'une <span className="text-emerald-400">production performante</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-emerald-50/70 mb-10 leading-relaxed"
            >
              Optimisez la croissance de vos volailles et réduisez vos coûts alimentaires grâce à notre algorithme de formulation intelligente.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/dashboard" className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-[#064e3b] rounded-2xl font-black transition-all flex items-center gap-2">
                DÉMARRER LE CALCULATEUR <ArrowRight size={20} />
              </Link>
              {/* CHANGEMENT : "Voir la démo" devient "Nos Solutions" */}
              <Link to="/services" className="px-8 py-4 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all flex items-center gap-2 backdrop-blur-sm">
                <Layout size={20} className="text-emerald-400" /> NOS SOLUTIONS
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION EXPERTISE TECHNIQUE - MAINTENUE CAR CONCRÈTE */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="w-12 h-1 bg-emerald-500 mb-6"></div>
              <h2 className="text-4xl font-black text-[#064e3b] mb-8 leading-tight">
                La science de la nutrition <br/>au service de votre rentabilité.
              </h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                L'alimentation représente 70% des coûts de production. Notre IA ne se contente pas de mélanger des ingrédients : elle équilibre les <strong>Acides Aminés essentiels</strong> (Lysine, Méthionine), l'<strong>Énergie Métabolisable</strong> et les <strong>Minéraux</strong> pour maximiser l'Indice de Consommation (IC).
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { t: "Moindre Coût", d: "Algorithme linéaire pour trouver le prix le plus bas.", i: <Zap className="text-emerald-500" size={20}/> },
                  { t: "Précision Acide Aminé", d: "Équilibre parfait entre Lysine et Méthionine.", i: <Microscope className="text-emerald-500" size={20}/> },
                  { t: "Profils Spécifiques", d: "Démarrage, Croissance et Finition optimisés.", i: <Calculator className="text-emerald-500" size={20}/> },
                  { t: "Analyse des Stocks", d: "Utilisez vos matières premières disponibles.", i: <CheckCircle2 className="text-emerald-500" size={20}/> },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 border border-slate-100 rounded-2xl">
                    <div className="mt-1">{item.i}</div>
                    <div>
                      <h4 className="font-bold text-slate-800">{item.t}</h4>
                      <p className="text-xs text-slate-500 mt-1">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1516383274235-5f42d6c6426d?q=80&w=2000" className="rounded-[3rem] shadow-2xl" alt="Matières premières" />
              <div className="absolute -bottom-10 -right-6 bg-[#064e3b] p-8 rounded-3xl text-white shadow-2xl">
                <p className="text-sm font-bold opacity-60 uppercase tracking-widest mb-2">Résultat Moyen</p>
                <p className="text-4xl font-black text-emerald-400">-15% à -25%</p>
                <p className="text-sm font-bold">Sur le coût de la tonne</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION CTA - REVISITÉE (SANS TARIFS) */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto bg-[#064e3b] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <h2 className="text-3xl md:text-5xl font-black text-white mb-8">
            Prêt à optimiser votre production ?
          </h2>
          <p className="text-emerald-100/60 mb-10 max-w-lg mx-auto font-medium">
            Rejoignez gratuitement la communauté ProvendeBuilder et commencez à formuler comme un expert.
          </p>
          {/* CHANGEMENT : Redirige vers /register au lieu de /pricing */}
          <Link to="/register" className="inline-flex items-center gap-3 px-10 py-5 bg-emerald-500 text-[#064e3b] rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 uppercase tracking-widest text-sm">
            CRÉER UN COMPTE GRATUIT <ChevronRight />
          </Link>
        </div>
      </section>
    </div>
  )
}