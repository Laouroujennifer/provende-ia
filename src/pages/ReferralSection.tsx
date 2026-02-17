// src/pages/ReferralSection.tsx
import { useState } from 'react'
import { Copy, Check, Share2, Zap, Users, Gift, ArrowRight, Link as LinkIcon } from 'lucide-react'

export function ReferralSection() {
  const [copied, setCopied] = useState(false)
  const referralCode = "PB-PAMPHILE-2024"
  const referralLink = `https://provendebuilder.com/register?ref=${referralCode}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700 pb-20 text-slate-900">
      
      {/* 1. CARTE PRINCIPALE - DESIGN CLEAN & HAUT CONTRASTE */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-sm">
        <div className="grid lg:grid-cols-2">
          
          {/* CÔTÉ GAUCHE : TEXTE (Fond très légèrement grisé) */}
          <div className="p-8 md:p-16 bg-slate-50/50 border-b lg:border-b-0 lg:border-r border-slate-200 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-6">
              <Gift size={14} /> Programme Ambassadeur
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tighter mb-6">
              Invitez des éleveurs, <br />
              <span className="text-emerald-600">gagnez des crédits.</span>
            </h2>
            
            <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed mb-10">
              Partagez votre expérience ProvendeBuilder. Pour chaque nouveau membre inscrit via votre lien, votre compte est crédité de <span className="text-slate-900 font-black">10 calculs IA</span>.
            </p>

            {/* Liste d'étapes verticale ultra-lisible */}
            <div className="space-y-6">
              {[
                { i: "01", t: "Copiez votre lien de parrainage unique." },
                { i: "02", t: "Partagez-le par SMS, WhatsApp ou Email." },
                { i: "03", t: "Recevez vos bonus dès leur première connexion." },
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <span className="text-emerald-600 font-black text-sm pt-0.5">{step.i}</span>
                  <p className="text-slate-700 font-bold text-sm md:text-base leading-tight">{step.t}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CÔTÉ DROIT : ACTIONS (Fond blanc) */}
          <div className="p-8 md:p-16 flex flex-col justify-center bg-white">
            <div className="space-y-8 w-full">
              
              {/* CHAMP DU LIEN (Très lisible) */}
              <div className="text-left">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1">
                  Votre lien personnel
                </label>
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  <div className="flex-1 flex items-center gap-3 bg-slate-100 border border-slate-200 px-4 py-4 rounded-2xl">
                    <LinkIcon size={18} className="text-slate-400 shrink-0" />
                    <code className="text-slate-600 font-bold text-sm truncate uppercase tracking-tighter">
                      {referralCode}
                    </code>
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm ${
                      copied ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copié' : 'Copier'}
                  </button>
                </div>
              </div>

              {/* SÉPARATEUR */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <span className="relative bg-white px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Ou partager sur</span>
              </div>

              {/* BOUTON WHATSAPP (Franchement coloré) */}
              <button className="w-full py-5 bg-[#25D366] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-lg shadow-green-100">
                <Share2 size={20} />
                WhatsApp
              </button>

              <p className="text-[10px] font-bold text-slate-400 text-center">
                Aucune limite de parrainage. Plus vous partagez, plus vous calculez.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. STATISTIQUES (RESPONSIVE GRID) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[
          { icon: <Users className="text-blue-600" />, label: "Inscriptions", value: "0", bg: "bg-blue-50" },
          { icon: <Zap className="text-emerald-600" />, label: "Bonus gagnés", value: "0", bg: "bg-emerald-50" },
          { icon: <Gift className="text-purple-600" />, label: "Récompenses", value: "0", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 p-6 md:p-8 rounded-4xl flex items-center justify-between shadow-sm group hover:border-emerald-500 transition-colors">
            <div className="flex items-center gap-4 text-left">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
            <ArrowRight size={18} className="text-slate-200 group-hover:text-emerald-500 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  )
}