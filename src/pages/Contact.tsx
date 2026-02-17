// src/pages/Contact.tsx
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin,  MessageCircle, Sparkles, ArrowRight } from 'lucide-react'

export function Contact() {
  return (
    <div className="bg-slate-950 min-h-screen text-white">
      {/* 1. HEADER SECTION - STYLE MINEA (DARK & GLOW) */}
      <section className="relative pt-48 pb-40 px-6 overflow-hidden text-center">
        {/* Lueurs d'arrière-plan */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-125px bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-400 mb-8 shadow-2xl">
            <MessageCircle size={14} fill="currentColor" className="opacity-20" />
            <span className="font-black uppercase tracking-[0.3em] text-[10px]">Support Prioritaire</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black leading-[1.05] tracking-tighter mb-8">
            Parlons de votre <br />
            <span className="bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent italic">prochaine bande</span>.
          </h1>
          
          <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Une question technique sur l'IA ou besoin d'un accompagnement pour votre ferme ? Nos experts vous répondent sous 24h.
          </p>
        </motion.div>
      </section>

      {/* 2. CARTE DE CONTACT - ULTRA MODERNE */}
      <section className="max-w-7xl mx-auto px-6 pb-32 -mt-16 relative z-20">
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-white/10">
          
          {/* Côté Gauche : Infos (Style Dashboard) */}
          <div className="lg:w-1/3 bg-linear-to-b from-white/3 to-transparent p-12 lg:p-16 relative border-r border-white/5">
            <h3 className="text-2xl font-black mb-12 tracking-tight flex items-center gap-3">
              <Sparkles className="text-emerald-400" size={20} />
              Coordonnées
            </h3>
            
            <div className="space-y-12">
              <div className="group cursor-default">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-3">Téléphone</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-emerald-500/50 transition-colors">
                    <Phone size={18} className="text-white/70 group-hover:text-emerald-400" />
                  </div>
                  <p className="font-bold text-lg group-hover:text-emerald-400 transition-colors">+229 90 00 00 00</p>
                </div>
              </div>

              <div className="group cursor-default">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-3">Email</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-emerald-500/50 transition-colors">
                    <Mail size={18} className="text-white/70 group-hover:text-emerald-400" />
                  </div>
                  <p className="font-bold text-lg group-hover:text-emerald-400 transition-colors">contact@provendebuilder.com</p>
                </div>
              </div>

              <div className="group cursor-default">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-3">Siège</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-emerald-500/50 transition-colors">
                    <MapPin size={18} className="text-white/70 group-hover:text-emerald-400" />
                  </div>
                  <p className="font-bold text-sm text-white/60 leading-relaxed">
                    Zone Industrielle Akpakpa <br /> Cotonou, Bénin
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Côté Droit : Formulaire (Minea Style) */}
          <div className="lg:w-2/3 p-12 lg:p-20 bg-slate-900/20">
            <form className="grid md:grid-cols-2 gap-10" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Nom Complet</label>
                <input 
                  type="text" 
                  className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-medium text-white placeholder:text-white/20 shadow-2xl" 
                  placeholder="Jean Koffi" 
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Email Pro</label>
                <input 
                  type="email" 
                  className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-medium text-white placeholder:text-white/20 shadow-2xl" 
                  placeholder="jean@ferme.com" 
                />
              </div>
              
              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Message</label>
                <textarea 
                  rows={5} 
                  className="w-full p-5 bg-white/5 border border-white/10 rounded-3xl outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-medium text-white placeholder:text-white/20 shadow-2xl resize-none" 
                  placeholder="Comment pouvons-nous optimiser votre production ?"
                ></textarea>
              </div>
              
              <div className="md:col-span-2 pt-6">
                {/* --- LE BOUTON CONTACT OPTIMISÉ --- */}
                <button className="group relative w-full md:w-auto px-12 py-6 bg-emerald-500 text-slate-950 rounded-full font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_50px_rgba(16,185,129,0.4)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-4 overflow-hidden">
                  <span className="relative z-10 flex items-center gap-3">
                    Envoyer le message 
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  {/* Effet de brillance interne */}
                  <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Petit CTA de pied de page pour la cohérence */}
      <section className="py-20 text-center opacity-30">
        <p className="text-[10px] font-black uppercase tracking-[0.5em]">Sécurité & Confidentialité 100% Garantie</p>
      </section>
    </div>
  )
}