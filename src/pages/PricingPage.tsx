import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Loader2, Sparkles, Zap, Package, Crown } from 'lucide-react'
import { useSubscription } from '../contexts/SubscriptionContext'
import { formatPrice } from '../utils/geolocation'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

interface KkiapayConfig {
  amount: number;
  api_key: string;
  sandbox: boolean;
  phone?: string;
  name?: string;
  email?: string;
  callback?: string;
  data?: string;
  theme?: string;
}

interface KkiapayResponse {
  transactionId: string;
  flwRef?: string;
  status?: string;
}

declare global {
  interface Window {
    openKkiapayWidget: (config: KkiapayConfig) => void;
    addKkiapayListener: (event: string, callback: (response: KkiapayResponse) => void) => void;
    removeKkiapayListener: (event: string) => void;
  }
}

type PackID = 'credit_1' | 'credit_4' | 'credit_12'

const PACKS = [
  {
    id: 'credit_1' as PackID,
    name: 'Starter',
    credits: 1,
    price: 200,
    pricePerCredit: 200,
    icon: Zap,
    highlight: false,
    badge: null,
    features: [
      '1 génération IA complète',
      'Résultat instantané',
      'Formule optimisée Goliath',
      'Sans engagement',
    ],
    buttonText: 'Acheter 1 crédit',
    color: 'emerald',
  },
  {
    id: 'credit_4' as PackID,
    name: 'Pack Éleveur',
    credits: 4,
    price: 800,
    pricePerCredit: 200,
    icon: Package,
    highlight: true,
    badge: 'Le plus populaire',
    features: [
      '4 générations IA complètes',
      'Crédits stockés sur votre compte',
      'Utilisez quand vous voulez',
      'Formules optimisées Goliath',
      'Support WhatsApp inclus',
    ],
    buttonText: 'Acheter 4 crédits',
    color: 'orange',
  },
  {
    id: 'credit_12' as PackID,
    name: 'Pack Pro',
    credits: 12,
    price: 2400,
    pricePerCredit: 200,
    icon: Crown,
    highlight: false,
    badge: 'Meilleure valeur',
    features: [
      '12 générations IA complètes',
      'Crédits stockés sur votre compte',
      'Utilisez quand vous voulez',
      'Formules optimisées Goliath',
      'Support WhatsApp prioritaire',
      'Accès aux futurs outils',
    ],
    buttonText: 'Acheter 12 crédits',
    color: 'violet',
  },
]

export function PricingPage() {
  const { currency, addCredits } = useSubscription()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [loadingPack, setLoadingPack] = useState<PackID | null>(null)
  const [successPack, setSuccessPack] = useState<PackID | null>(null)

  const handlePaymentSuccess = async (packId: PackID, credits: number) => {
    try {
      await addCredits(credits)
      setSuccessPack(packId)
      setTimeout(() => {
        setSuccessPack(null)
        navigate('/dashboard')
      }, 2500)
    } catch (error) {
      console.error('Erreur activation:', error)
      alert("Erreur lors de l'activation. Contactez-nous sur WhatsApp.")
    } finally {
      setLoadingPack(null)
    }
  }

  const handleBuyPack = (packId: PackID, amount: number, credits: number) => {
    if (!isAuthenticated) {
      navigate('/register')
      return
    }

    setLoadingPack(packId)

    window.removeKkiapayListener('payment_success')
    window.removeKkiapayListener('payment_cancelled')

    window.openKkiapayWidget({
      amount,
      api_key: import.meta.env.VITE_KKIAPAY_PUBLIC_KEY,
      sandbox: true,
      name: user?.user_metadata?.first_name || 'Éleveur',
      email: user?.email || '',
      data: packId,
      theme: '#FF6800',
    })

    window.addKkiapayListener('payment_success', () => {
      handlePaymentSuccess(packId, credits)
    })

    window.addKkiapayListener('payment_cancelled', () => {
      setLoadingPack(null)
    })
  }

  return (
    <div className="bg-[#0A0A0A] min-h-screen pb-24 text-white">

      {/* HERO */}
      <section className="bg-[#0A0A0A] pt-32 pb-64 relative overflow-hidden text-white text-center border-b border-[#2A2A2A]">
        {/* Grille pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <pattern id="grid-p" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid-p)" />
          </svg>
        </div>

        {/* Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF6800]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-500/8 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 px-6 max-w-4xl mx-auto"
        >
          <span className="bg-[#FF6800]/10 text-[#FF6800] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-flex items-center gap-2 border border-[#FF6800]/30">
            <Sparkles size={11} /> Payez uniquement ce que vous utilisez
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-tight text-white">
            Des crédits,<br />
            <span className="text-[#FF6800] italic">pas un abonnement.</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Achetez des crédits, stockez-les sur votre compte et générez vos formules quand vous en avez besoin.
          </p>

          {/* Explication crédits */}
          <div className="mt-10 inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white/70">
            <Zap size={16} className="text-[#FF6800]" />
            <span>1 crédit = 1 formule IA générée et optimisée</span>
          </div>
        </motion.div>
      </section>

      {/* CARTES — chevauchent le hero */}
      <section className="max-w-6xl mx-auto px-6 -mt-44 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PACKS.map((pack, i) => {
            const Icon = pack.icon
            const isLoading = loadingPack === pack.id
            const isSuccess = successPack === pack.id

            const borderClass =
              pack.highlight
                ? 'border-2 border-[#FF6800] shadow-[0_25px_80px_-15px_rgba(255,104,0,0.35)] md:scale-105'
                : pack.color === 'violet'
                ? 'border border-violet-500/30 hover:border-violet-500/60'
                : 'border border-[#2A2A2A] hover:border-[#FF6800]/30'

            const iconBg =
              pack.color === 'orange'
                ? 'bg-[#FF6800]/15 text-[#FF6800]'
                : pack.color === 'violet'
                ? 'bg-violet-500/15 text-violet-400'
                : 'bg-emerald-500/15 text-emerald-400'

            const btnClass =
              pack.highlight
                ? 'bg-gradient-to-r from-[#FF6800] to-[#FF8533] text-white hover:from-[#FF8533] hover:to-[#FF6800] shadow-[#FF6800]/30 hover:scale-[1.02] active:scale-95'
                : pack.color === 'violet'
                ? 'bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:from-violet-500 hover:to-violet-400 shadow-violet-500/20 hover:scale-[1.02] active:scale-95'
                : 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-500 hover:to-emerald-400 shadow-emerald-500/20 hover:scale-[1.02] active:scale-95'

            const checkColor =
              pack.color === 'orange'
                ? 'text-[#FF6800]'
                : pack.color === 'violet'
                ? 'text-violet-400'
                : 'text-emerald-400'

            const checkBorder =
              pack.color === 'orange'
                ? 'bg-[#FF6800]/10 border-[#FF6800]/30'
                : pack.color === 'violet'
                ? 'bg-violet-500/10 border-violet-500/30'
                : 'bg-emerald-500/10 border-emerald-500/30'

            return (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-[#1A1A1A] rounded-[2.5rem] p-8 flex flex-col transition-all duration-300 ${borderClass}`}
              >
                {/* Badge */}
                {pack.badge && (
                  <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest whitespace-nowrap shadow-lg flex items-center gap-1.5 ${
                    pack.highlight
                      ? 'bg-[#FF6800] text-white shadow-[#FF6800]/40'
                      : 'bg-violet-600 text-white shadow-violet-500/40'
                  }`}>
                    {pack.highlight ? '⭐' : '👑'} {pack.badge}
                  </div>
                )}

                {/* Glow bg pour highlight */}
                {pack.highlight && (
                  <div className="absolute -inset-1 bg-gradient-to-br from-[#FF6800]/15 via-transparent to-[#FF6800]/8 rounded-[2.5rem] blur-xl -z-10 opacity-60" />
                )}

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg}`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${
                      pack.color === 'orange' ? 'text-[#FF6800]' :
                      pack.color === 'violet' ? 'text-violet-400' : 'text-emerald-400'
                    }`}>{pack.name}</p>
                    <p className="text-white/40 text-xs font-bold">{pack.credits} crédit{pack.credits > 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Prix */}
                <div className="mb-6">
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-black text-white tracking-tighter">
                      {formatPrice(pack.price, currency)}
                    </span>
                  </div>
                  <p className="text-white/30 text-xs font-bold mt-1 uppercase tracking-wide">
                    {pack.pricePerCredit} F / crédit
                  </p>
                </div>

                {/* Visuel crédits */}
                <div className="flex gap-2 mb-6">
                  {Array.from({ length: pack.credits }).map((_, j) => (
                    <div
                      key={j}
                      className={`flex-1 h-2 rounded-full ${
                        pack.color === 'orange' ? 'bg-[#FF6800]' :
                        pack.color === 'violet' ? 'bg-violet-500' : 'bg-emerald-500'
                      }`}
                      style={{ maxWidth: pack.credits > 6 ? '100%' : undefined }}
                    />
                  ))}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {pack.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-white/60 font-bold text-xs">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${checkBorder}`}>
                        <Check className={checkColor} size={11} strokeWidth={3} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Bouton */}
                <button
                  onClick={() => handleBuyPack(pack.id, pack.price, pack.credits)}
                  disabled={loadingPack !== null}
                  className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                    isSuccess
                      ? 'bg-emerald-500 text-white'
                      : btnClass
                  }`}
                >
                  {isSuccess ? (
                    <><Check size={16} strokeWidth={3} /> Crédits ajoutés !</>
                  ) : isLoading ? (
                    <><Loader2 className="animate-spin" size={16} /> Ouverture paiement…</>
                  ) : (
                    <><Zap size={14} /> {pack.buttonText}</>
                  )}
                </button>
              </motion.div>
            )
          })}
        </div>

        {/* Comment ça marche */}
        <div className="mt-20 bg-[#111] border border-[#2A2A2A] rounded-3xl p-8 md:p-12">
          <h2 className="text-center text-[11px] font-black text-white/30 uppercase tracking-[0.3em] mb-10">
            Comment fonctionnent les crédits ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: '💳',
                title: 'Achetez un pack',
                desc: 'Choisissez le nombre de crédits dont vous avez besoin. Paiement sécurisé via Kkiapay (Mobile Money).',
              },
              {
                step: '02',
                icon: '🏦',
                title: 'Crédits stockés',
                desc: 'Vos crédits sont ajoutés à votre compte immédiatement et ne expirent jamais.',
              },
              {
                step: '03',
                icon: '⚡',
                title: 'Générez vos formules',
                desc: 'Chaque génération IA consomme 1 crédit. Le vérificateur manuel reste toujours gratuit.',
              },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-[#FF6800] text-[10px] font-black uppercase tracking-widest mb-2">Étape {item.step}</div>
                <h3 className="text-white font-black text-sm mb-2">{item.title}</h3>
                <p className="text-white/40 text-xs font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Réassurance */}
        <div className="mt-12 text-center">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-5">
            Paiement 100% sécurisé via Kkiapay
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/40 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Check size={12} className="text-emerald-400" /> Crédits sans expiration
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={12} className="text-emerald-400" /> Mobile Money accepté
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={12} className="text-emerald-400" /> Vérificateur toujours gratuit
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={12} className="text-emerald-400" /> Support WhatsApp inclus
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}