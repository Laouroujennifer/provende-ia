import { useState, useEffect } from 'react'
import { Copy, Check, Sparkles, Share2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface DbProfile {
  referral_code: string
}

export function ReferralSection() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<DbProfile | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getProfile() {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('referral_code')
          .eq('id', user.id)
          .single()
        
        if (data) setProfile(data as DbProfile)
        setLoading(false)
      }
    }
    getProfile()
  }, [user])

  // Détection auto de l'URL du site (localhost ou provendebuilder.com)
  const baseUrl = window.location.origin
  const referralCode = profile?.referral_code || "..."
  const referralLink = `${baseUrl}/register?ref=${referralCode}`

  const copyLink = () => {
    if (loading) return
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareWhatsApp = () => {
    const message = encodeURIComponent(
      `🐔 Salut ! J'utilise ProvendeBuilder pour réduire mes coûts d'aliment volaille. Inscris-toi avec mon lien pour gagner des calculs gratuits : ${referralLink}`
    )
    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="relative rounded-[2.5rem] bg-slate-900 p-10 md:p-16 overflow-hidden text-white border border-white/5 shadow-2xl">
        {/* Décoration en arrière-plan */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -mr-32 -mt-32" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-8">
            <Sparkles size={12} /> Programme Ambassadeur
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 tracking-tighter">
            Partagez. <span className="text-emerald-400">Gagnez.</span>
          </h1>
          
          <p className="text-white/40 text-lg mb-10 max-w-lg font-medium">
            Invitez des collègues éleveurs. Pour chaque inscription, vous recevez <span className="text-emerald-400 font-black">+10 calculs IA</span> sur votre compte.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
            {/* Box Lien */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">Votre lien de parrainage</p>
              <div className="flex items-center gap-3 bg-black/30 border border-white/10 rounded-2xl px-4 py-3">
                <code className="text-emerald-400 font-bold truncate flex-1 text-sm">
                  {loading ? "Chargement..." : referralLink}
                </code>
                <button 
                  onClick={copyLink} 
                  disabled={loading}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all text-white/60 hover:text-white"
                >
                  {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            {/* Bouton WhatsApp Rapide */}
            <button 
              onClick={shareWhatsApp}
              disabled={loading}
              className="flex flex-col items-center justify-center gap-3 bg-[#25D366]/10 border border-[#25D366]/20 rounded-3xl p-6 hover:bg-[#25D366]/20 transition-all group"
            >
              <div className="w-12 h-12 bg-[#25D366] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20 group-hover:scale-110 transition-transform">
                <Share2 size={20} className="text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#25D366]">Partager sur WhatsApp</span>
            </button>
          </div>

          {/* Info bulle */}
          <div className="mt-10 flex items-center gap-3 text-white/20">
             <div className="h-px grow bg-white/5"></div>
             <p className="text-[9px] font-bold uppercase tracking-[0.2em]">Récompense créditée instantanément</p>
             <div className="h-px grow bg-white/5"></div>
          </div>
        </div>
      </div>
    </div>
  )
}