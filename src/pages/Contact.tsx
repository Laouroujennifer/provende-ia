// src/pages/Contact.tsx
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export function Contact() {
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-[#064e3b] pt-48 pb-32 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6">Contactez-<span className="text-emerald-400">nous</span>.</h1>
        <p className="text-emerald-100/60 text-xl max-w-2xl mx-auto font-medium">Une question technique ou besoin d'une démo personnalisée ?</p>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24 -mt-16">
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-slate-100">
          {/* Info Side */}
          <div className="lg:w-1/3 bg-slate-900 p-12 lg:p-16 text-white">
            <h3 className="text-2xl font-black mb-8">Nos coordonnées</h3>
            <div className="space-y-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shrink-0"><Phone size={20} className="text-slate-900" /></div>
                <div><p className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">Appelez-nous</p><p className="font-bold">+229 90 00 00 00</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shrink-0"><Mail size={20} className="text-slate-900" /></div>
                <div><p className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">Email</p><p className="font-bold">contact@provendebuilder.com</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shrink-0"><MapPin size={20} className="text-slate-900" /></div>
                <div><p className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">Siège social</p><p className="font-bold text-sm">Cotonou, Bénin <br/>Zone Industrielle Akpakpa</p></div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:w-2/3 p-12 lg:p-20 bg-white">
            <form className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nom Complet</label>
              <input type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all font-medium" placeholder="Ex: Jean Koffi" /></div>
              
              <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Professionnel</label>
              <input type="email" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all font-medium" placeholder="jean@exemple.com" /></div>
              
              <div className="md:col-span-2 space-y-2"><label className="text-xs font-black text-slate-400 uppercase tracking-widest">Message</label>
              <textarea rows={5} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all font-medium" placeholder="Détaillez votre besoin..."></textarea></div>
              
              <div className="md:col-span-2"><button className="px-12 py-5 bg-[#064e3b] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-emerald-600 transition-all flex items-center gap-3 shadow-xl">Envoyer le message <Send size={16}/></button></div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}