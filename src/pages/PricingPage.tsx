import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, Sparkles, Zap, Package, Crown } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, useSearchParams } from 'react-router-dom'

// ⬇️⬇️ À REMPLACER par le domaine du store Chariow de ton client
const STORE_DOMAIN = 'VOTRE-STORE.mychariow.online'

// ⬇️⬇️ IMPORTANT : les `productId` ci-dessous doivent être EXACTEMENT les mêmes
//      que ceux du webhook (supabase/functions/chariow-webhook/index.ts).
const PACKS = [
  {
    id: 'credit_12',
    productId: 'prd_REMPLACER_2400', // ⬅️ ID du produit "Pack 2 400 F" sur Chariow
    name: 'Pack Éleveur',
    credits: 12,
    price: '2 400 F',
    pricePerCredit: '200 F / crédit',
    icon: Zap,
    highlight: false,
    badge: null as string | null,
    color: 'emerald',
    accentColor: '#10b981',
    features: [
      '12 crédits stockés sur votre compte',
      'Jusqu’à 6 générations ou 12 vérifications',
      'Crédits sans expiration',
      'Formules optimisées Goliath',
    ],
  },
  {
    id: 'credit_25',
    productId: 'prd_REMPLACER_5000', // ⬅️ ID du produit "Pack 5 000 F" sur Chariow
    name: 'Pack Pro',
    credits: 25,
    price: '5 000 F',
    pricePerCredit: '200 F / crédit',
    icon: Package,
    highlight: true,
    badge: '⭐ Le plus populaire' as string | null,
    color: 'orange',
    accentColor: '#FF6800',
    features: [
      '25 crédits stockés sur votre compte',
      'Jusqu’à 12 générations ou 25 vérifications',
      'Crédits sans expiration',
      'Formules optimisées Goliath',
      'Support WhatsApp inclus',
    ],
  },
  {
    id: 'credit_35',
    productId: 'prd_REMPLACER_7000', // ⬅️ ID du produit "Pack 7 000 F" sur Chariow
    name: 'Pack Expert',
    credits: 35,
    price: '7 000 F',
    pricePerCredit: '200 F / crédit',
    icon: Crown,
    highlight: false,
    badge: '👑 Meilleure valeur' as string | null,
    color: 'violet',
    accentColor: '#8b5cf6',
    features: [
      '35 crédits stockés sur votre compte',
      'Jusqu’à 17 générations ou 35 vérifications',
      'Crédits sans expiration',
      'Formules optimisées Goliath',
      'Support WhatsApp prioritaire',
      'Accès aux futurs outils',
    ],
  },
]

export function PricingPage() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Détection retour paiement réussi
  useEffect(() => {
    if (searchParams.get('status') === 'success') {
      alert("Paiement réussi ! Vos crédits seront ajoutés dans quelques secondes.")
      navigate('/pricing', { replace: true })
    }
  }, [searchParams, navigate])

  // Charge script + CSS Chariow une seule fois
  useEffect(() => {
    if (!document.getElementById('chariow-script')) {
      const script = document.createElement('script')
      script.id = 'chariow-script'
      script.src = 'https://js.chariowcdn.com/v1/widget.min.js'
      script.async = true
      document.head.appendChild(script)
    }
    if (!document.getElementById('chariow-style')) {
      const link = document.createElement('link')
      link.id = 'chariow-style'
      link.rel = 'stylesheet'
      link.href = 'https://js.chariowcdn.com/v1/widget.min.css'
      document.head.appendChild(link)
    }
  }, [])

  return (
    <div className="bg-[#0A0A0A] min-h-screen pb-24 text-white">

      {/* HERO */}
      <section className="bg-[#0A0A0A] pt-32 pb-64 relative overflow-hidden text-center border-b border-[#2A2A2A]">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <pattern id="grid-p" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid-p)" />
          </svg>
        </div>
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
            Achetez des crédits, stockez-les sur votre compte et utilisez-les quand vous en avez besoin.
            <span className="text-white/80 font-bold"> 3 crédits offerts dès l’inscription.</span>
          </p>
          <div className="mt-10 inline-flex flex-wrap items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white/70">
            <Zap size={16} className="text-[#FF6800]" />
            <span>Vérifier une formule = 1 crédit</span>
            <span className="text-white/20">·</span>
            <span>Générer une formule = 2 crédits</span>
          </div>
        </motion.div>
      </section>

      {/* CARTES */}
      <section className="max-w-6xl mx-auto px-6 -mt-44 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PACKS.map((pack, i) => {
            const Icon = pack.icon

            const borderClass =
              pack.highlight
                ? 'border-2 border-[#FF6800] shadow-[0_25px_80px_-15px_rgba(255,104,0,0.35)] md:scale-105'
                : pack.color === 'violet'
                ? 'border border-violet-500/30 hover:border-violet-500/60'
                : 'border border-[#2A2A2A] hover:border-[#FF6800]/30'

            const iconBg =
              pack.color === 'orange' ? 'bg-[#FF6800]/15 text-[#FF6800]'
              : pack.color === 'violet' ? 'bg-violet-500/15 text-violet-400'
              : 'bg-emerald-500/15 text-emerald-400'

            const accentClass =
              pack.color === 'orange' ? 'text-[#FF6800]'
              : pack.color === 'violet' ? 'text-violet-400'
              : 'text-emerald-400'

            const checkBorder =
              pack.color === 'orange' ? 'bg-[#FF6800]/10 border-[#FF6800]/30'
              : pack.color === 'violet' ? 'bg-violet-500/10 border-violet-500/30'
              : 'bg-emerald-500/10 border-emerald-500/30'

            const barColor =
              pack.color === 'orange' ? 'bg-[#FF6800]'
              : pack.color === 'violet' ? 'bg-violet-500'
              : 'bg-emerald-500'

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
                  <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest whitespace-nowrap shadow-lg ${
                    pack.highlight
                      ? 'bg-[#FF6800] text-white shadow-[#FF6800]/40'
                      : 'bg-violet-600 text-white shadow-violet-500/40'
                  }`}>
                    {pack.badge}
                  </div>
                )}

                {pack.highlight && (
                  <div className="absolute -inset-1 bg-gradient-to-br from-[#FF6800]/15 via-transparent to-[#FF6800]/8 rounded-[2.5rem] blur-xl -z-10 opacity-60" />
                )}

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg}`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className={`font-black text-[10px] uppercase tracking-widest ${accentClass}`}>{pack.name}</p>
                    <p className="text-white/40 text-xs font-bold">{pack.credits} crédit{pack.credits > 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Prix */}
                <div className="mb-4">
                  <span className="text-5xl font-black text-white tracking-tighter">{pack.price}</span>
                  <p className="text-white/30 text-xs font-bold mt-1 uppercase tracking-wide">{pack.pricePerCredit}</p>
                </div>

                {/* Barre crédits */}
                <div className="flex gap-1.5 mb-6">
                  {Array.from({ length: Math.min(pack.credits, 8) }).map((_, j) => (
                    <div key={j} className={`h-1.5 flex-1 rounded-full ${barColor}`} />
                  ))}
                  {pack.credits > 8 && (
                    <div className={`h-1.5 px-2 rounded-full ${barColor} flex items-center justify-center`}>
                      <span className="text-white text-[8px] font-black">+{pack.credits - 8}</span>
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {pack.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-white/60 font-bold text-xs">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${checkBorder}`}>
                        <Check className={accentClass} size={11} strokeWidth={3} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Widget Chariow Snap ou bouton connexion */}
                {isAuthenticated ? (
                  <div
                    id="chariow-widget"
                    data-product-id={pack.productId}
                    data-store-domain={STORE_DOMAIN}
                    data-style="tap"
                    data-border-style="rounded"
                    data-cta-width="full"
                    data-background-color="#1A1A1A"
                    data-cta-animation="shine"
                    data-locale="fr"
                    data-primary-color={pack.accentColor}
                    data-metadata={JSON.stringify({ user_id: user?.id })}
                  />
                ) : (
                  <button
                    onClick={() => navigate('/register')}
                    className="w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white hover:bg-white/20"
                  >
                    <Zap size={14} /> Créer un compte pour acheter
                  </button>
                )}
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
                icon: '🎁',
                title: '3 crédits offerts',
                desc: 'À l’inscription, vous recevez 3 crédits gratuits : de quoi vérifier une formule (1 crédit) et en générer une (2 crédits).',
              },
              {
                step: '02',
                icon: '💳',
                title: 'Achetez un pack',
                desc: 'Rechargez quand vous voulez. Paiement sécurisé via Chariow — Mobile Money (MTN, Moov, Wave) ou carte bancaire.',
              },
              {
                step: '03',
                icon: '⚡',
                title: 'Utilisez vos crédits',
                desc: 'Vérifier une formule consomme 1 crédit · Générer une formule consomme 2 crédits. Vos crédits n’expirent jamais.',
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
            Paiement 100% sécurisé via Chariow
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/40 text-xs font-medium">
            <span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-400" /> Crédits sans expiration</span>
            <span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-400" /> Mobile Money accepté</span>
            <span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-400" /> 3 crédits offerts à l’inscription</span>
            <span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-400" /> Support WhatsApp inclus</span>
          </div>
        </div>
      </section>
    </div>
  )
}