// src/pages/Contact.tsx
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, MessageCircle, Sparkles } from 'lucide-react'

export function Contact() {
  return (
    <div className="bg-white min-h-screen">
      {/* 1. HEADER SECTION - VIBRANT ET IMMERSIF */}
      <section className="relative bg-linear-to-br from-[#064e3b] via-[#065f46] to-[#064e3b] pt-48 pb-40 px-6 overflow-hidden text-center">
        {/* Effets de lueur en arrière-plan */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -ml-48 -mt-48" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-[100px] -mr-40 -mb-40" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6">
            <MessageCircle size={14} />
            <span className="font-black uppercase tracking-widest text-[10px]">Support & Partenariat</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter leading-tight">
            Contactez-<span className="text-emerald-400 italic">nous</span>.
          </h1>
          <p className="text-emerald-100/60 text-xl max-w-2xl mx-auto font-medium">
            Une question technique ou besoin d'une démo personnalisée ? Nos experts vous répondent sous 24h.
          </p>
        </motion.div>
      </section>

      {/* 2. CARTE DE CONTACT - SURÉLEVÉE ET ÉPURÉE */}
      <section className="max-w-7xl mx-auto px-6 pb-24 -mt-20 relative z-20">
        <div className="bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col lg:flex-row border border-slate-50">
          
          {/* Côté Gauche : Informations de contact (Sombre & Pro) */}
          <div className="lg:w-1/3 bg-slate-900 p-12 lg:p-16 text-white relative overflow-hidden">
            {/* Petite touche de vert pour la vie */}
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500 rounded-full blur-[60px] opacity-20 -ml-16 -mb-16" />
            
            <h3 className="text-2xl font-black mb-10 flex items-center gap-3">
              <Sparkles className="text-emerald-400" size={24} />
              Nos coordonnées
            </h3>
            
            <div className="space-y-12 relative z-10">
              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-slate-900 transition-all duration-300">
                  <Phone size={20} className="text-emerald-400 group-hover:text-slate-900" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Appelez-nous</p>
                  <p className="font-bold text-lg hover:text-emerald-400 transition-colors cursor-pointer">+229 90 00 00 00</p>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-slate-900 transition-all duration-300">
                  <Mail size={20} className="text-emerald-400 group-hover:text-slate-900" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Email</p>
                  <p className="font-bold text-lg hover:text-emerald-400 transition-colors cursor-pointer">contact@provendebuilder.com</p>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-slate-900 transition-all duration-300">
                  <MapPin size={20} className="text-emerald-400 group-hover:text-slate-900" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Siège social</p>
                  <p className="font-bold text-sm leading-relaxed opacity-80">
                    Cotonou, Bénin <br/>
                    Zone Industrielle Akpakpa
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Côté Droit : Formulaire (Clair & Moderne) */}
          <div className="lg:w-2/3 p-12 lg:p-20 bg-white">
            <form className="grid md:grid-cols-2 gap-8" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom Complet</label>
                <input 
                  type="text" 
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all font-medium placeholder:text-slate-300 shadow-inner" 
                  placeholder="Ex: Jean Koffi" 
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Professionnel</label>
                <input 
                  type="email" 
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all font-medium placeholder:text-slate-300 shadow-inner" 
                  placeholder="jean@exemple.com" 
                />
              </div>
              
              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Comment pouvons-nous vous aider ?</label>
                <textarea 
                  rows={5} 
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all font-medium placeholder:text-slate-300 shadow-inner" 
                  placeholder="Détaillez votre besoin ou posez votre question technique..."
                ></textarea>
              </div>
              
              <div className="md:col-span-2 pt-4">
                <button className="group relative px-12 py-5 bg-[#064e3b] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-emerald-600 transition-all flex items-center gap-3 shadow-2xl shadow-emerald-900/20 overflow-hidden">
                  <span className="relative z-10 flex items-center gap-3">
                    Envoyer le message 
                    <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}