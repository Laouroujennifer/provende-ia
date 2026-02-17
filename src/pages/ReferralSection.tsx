import { useState } from 'react'
import { Copy, Check, Share2, Zap } from 'lucide-react'

export function ReferralSection() {
  const [copied, setCopied] = useState(false)
  const referralCode = "AMB-PAMPHILE-2024"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://provendebuilder.com/register?ref=${referralCode}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-slate-950 rounded-[3.5rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full -mr-32 -mt-32" />
      
      <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            <Zap size={14} fill="currentColor" /> Offre de Lancement
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">
            Devenez <span className="text-emerald-400 italic">Ambassadeur</span> <br /> de la souveraineté.
          </h2>
          <p className="text-white/40 text-lg font-medium leading-relaxed mb-10 max-w-md">
            Parrainez un confrère éleveur. Pour chaque nouvel utilisateur actif, vous recevez <span className="text-white">10 formules IA</span> gratuites.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 shadow-2xl shadow-emerald-500/5">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-6">Partagez votre lien</p>
          <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-2xl border border-white/5 mb-8">
            <code className="flex-1 px-4 text-emerald-400 font-bold text-sm truncate">
              pb.com/ref={referralCode}
            </code>
            <button 
              onClick={copyToClipboard}
              className="bg-emerald-500 text-slate-950 p-4 rounded-xl hover:bg-emerald-400 transition-all active:scale-95 shadow-lg"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
          <button className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-emerald-400 transition-all shadow-xl">
            <Share2 size={20} /> Partager sur WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}