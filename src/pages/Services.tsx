// src/pages/Services.tsx
import { motion } from 'framer-motion'
import { 
  ShieldCheck, Zap, Users, BarChart3, 
  ArrowRight, Sparkles, ExternalLink, GraduationCap 
} from 'lucide-react'

export function Services() {
  // LIEN DE LA PAGE DE MENTORAT
  const serviceExternalUrl = "https://pamphilemehou.systeme.io/frica-volaille"

  const serviceItems = [
    { 
      title: "Audit & Diagnostic", 
      icon: <ShieldCheck size={32}/>, 
      desc: "Nous analysons votre ferme pour identifier les pertes et optimiser vos infrastructures avant de lancer la production." 
    },
    { 
      title: "Formulation sur Mesure", 
      icon: <Zap size={32}/>, 
      desc: "Accédez à des formules précises basées sur vos matières premières locales pour réduire vos coûts jusqu'à 50%." 
    },
    { 
      title: "Mentorat & Coaching", 
      icon: <Users size={32}/>, 
      desc: "Un accompagnement quotidien par des experts pour suivre la croissance de vos bandes et prévenir les maladies." 
    },
    { 
      title: "Maîtrise de Rentabilité", 
      icon: <BarChart3 size={32}/>, 
      desc: "Transformez votre passion en business. Apprenez à gérer vos marges, vos stocks et vos ventes comme un pro." 
    },
  ]

  return (
    <div className="bg-white min-h-screen text-slate-900">
      
      {/* 1. HEADER - STYLE PREMIUM DARK (Minea/SaaS) */}
      <section className="relative bg-slate-950 pt-32 pb-48 md:pt-48 md:pb-64 px-6 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-125 h-125 bg-emerald-500/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-white"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-400 mb-8 font-black uppercase tracking-[0.3em] text-[10px]">
              <GraduationCap size={16} />
              Programme de Mentorat Frica-Volaille
            </div>
            
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.05] tracking-tighter">
              Élevez vos <br/>
              <span className="bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent italic">standards</span>.
            </h1>
            
            <p className="text-lg md:text-xl text-white/50 leading-relaxed font-medium mb-12 max-w-2xl mx-auto">
              Ne vous contentez plus de nourrir des oiseaux. Construisez une entreprise avicole rentable et durable avec notre expertise.
            </p>
            
            <a 
              href={serviceExternalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-6 bg-emerald-500 text-slate-950 rounded-full font-black text-xs uppercase tracking-widest shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:scale-105 transition-all"
            >
              Rejoindre le Mentorat <ExternalLink size={18} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* 2. SERVICES GRID - CLEAN & LISIBLE */}
      <section className="py-24 px-6 -mt-8 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceItems.map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col items-start group hover:border-emerald-500 transition-all duration-500"
              >
                {/* Icône avec fond doux */}
                <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 mb-8 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                  {s.icon}
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter">
                  {s.title}
                </h3>
                
                <p className="text-slate-500 mb-10 leading-relaxed font-medium text-sm text-left">
                  {s.desc}
                </p>
                
                <a 
                  href={serviceExternalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest hover:gap-4 transition-all"
                >
                  En savoir plus <ArrowRight size={16}/>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SECTION IMPACT - STYLE ÉPURÉ */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto text-center space-y-12">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
              <Sparkles size={14} /> Pourquoi nous choisir ?
           </div>
           
           <h2 className="text-3xl md:text-5xl font-black tracking-tighter">
             Transformez votre passion en <br /> 
             <span className="text-emerald-600 italic">succès industriel</span>.
           </h2>

           <div className="grid md:grid-cols-3 gap-12 text-left pt-12">
              <div className="space-y-4">
                 <h4 className="text-xl font-black tracking-tight">Expertise Terrain</h4>
                 <p className="text-sm text-slate-500 font-medium leading-relaxed italic">"On ne parle pas depuis un bureau, on vient du hangar."</p>
              </div>
              <div className="space-y-4">
                 <h4 className="text-xl font-black tracking-tight">Résultats Mesurables</h4>
                 <p className="text-sm text-slate-500 font-medium leading-relaxed italic">"Réduisez votre indice de consommation et augmentez vos marges dès le premier mois."</p>
              </div>
              <div className="space-y-4">
                 <h4 className="text-xl font-black tracking-tight">Réseau d'Élite</h4>
                 <p className="text-sm text-slate-500 font-medium leading-relaxed italic">"Accédez aux meilleurs fournisseurs de poussins et de matières premières du Bénin."</p>
              </div>
           </div>

           <div className="pt-16">
              <a 
                href={serviceExternalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 px-12 py-6 bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-emerald-600 hover:scale-105 transition-all"
              >
                Commencer l'accompagnement
              </a>
           </div>
        </div>
      </section>
    </div>
  )
}