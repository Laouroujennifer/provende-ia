import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Loader2, Star } from 'lucide-react'
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

type PlanID = 'free' | 'annual';

export function PricingPage() {
  const { currency, upgradeSubscription } = useSubscription()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [loadingPlan, setLoadingPlan] = useState<PlanID | null>(null)

  const plans = [
    {
      id: 'free' as PlanID,
      name: 'Éleveur Débutant',
      price: 0,
      period: 'à vie',
      features: [
        'Analyseur manuel illimité', 
        '3 calculs IA offerts', 
        'Historique (10 formules)',
        'Support communauté'
      ],
      buttonText: 'Plan Actuel',
      highlight: false
    },
    {
      id: 'annual' as PlanID,
      name: 'Éleveur Pro',
      price: 5000,
      period: 'an',
      features: [
        'Tout du plan gratuit',
        'Générateur IA illimité', 
        'Historique illimité',
        'Support WhatsApp prioritaire',
        'Accès aux futurs outils'
      ],
      buttonText: 'Passer au Pro',
      highlight: true
    }
  ]

  const handlePaymentSuccess = async () => {
    try {
      await upgradeSubscription('annual');
      alert("Félicitations ! Votre compte est maintenant PRO pour 1 an.");
      navigate('/dashboard');
    } catch (error) {
      console.error("Erreur d'activation:", error);
      alert("Erreur lors de l'activation. Contactez-nous sur WhatsApp.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleSubscribe = (planId: PlanID, amount: number) => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }
    if (planId === 'free') return;

    setLoadingPlan(planId);

    window.openKkiapayWidget({
      amount: amount,
      api_key: "pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx", // REMPLACE PAR TA CLÉ PK_...
      sandbox: true,
      name: user?.user_metadata?.first_name || "Éleveur",
      email: user?.email || "",
      data: planId,
      theme: "#064e3b"
    });

    window.addKkiapayListener('payment_success', () => {
      handlePaymentSuccess();
    });

    window.addKkiapayListener('payment_cancelled', () => {
      setLoadingPlan(null);
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 text-slate-900">
      {/* SECTION HEADER - VERT FONCÉ FIXE */}
      <section className="bg-[#064e3b] pt-32 pb-60 relative overflow-hidden text-white text-center">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <pattern id="grid-p" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid-p)" />
          </svg>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 px-6 text-center max-w-4xl mx-auto">
          <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block border border-emerald-500/20">
            Investissez dans votre ferme
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-tight">
            Un petit prix pour de <span className="text-emerald-400 italic">gros profits</span>.
          </h1>
          <p className="text-emerald-100/70 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Le plan Pro se rentabilise dès votre première tonne d'aliment produite.
          </p>
        </motion.div>
      </section>

      {/* SECTION CARTES */}
      <section className="max-w-5xl mx-auto px-6 -mt-40 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl flex flex-col transition-all duration-500 hover:shadow-emerald-500/10 ${
                plan.highlight ? 'border-4 border-emerald-500 relative z-10 md:scale-105' : 'border border-slate-200'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-900 px-6 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 whitespace-nowrap shadow-lg">
                  <Star size={12} fill="currentColor" /> Option Rentabilité Maximale
                </div>
              )}
              
              <h3 className="text-lg font-black text-slate-400 mb-2 uppercase tracking-widest">{plan.name}</h3>
              <div className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">
                {plan.price === 0 ? "0 F" : formatPrice(plan.price, currency)}
                <span className="text-sm text-slate-400 font-bold uppercase tracking-normal"> / {plan.period}</span>
              </div>
              
              <ul className="space-y-5 mb-12 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-4 text-slate-600 font-bold text-xs uppercase tracking-tight">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                      <Check className="text-emerald-500" size={14} strokeWidth={4}/>
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              {/* BOUTON - COULEUR FIXE VERT FONCÉ */}
              <button 
                onClick={() => handleSubscribe(plan.id as PlanID, plan.price)}
                disabled={loadingPlan !== null || plan.id === 'free'}
                className={`w-full py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl ${
                  plan.highlight 
                  ? 'bg-[#064e3b] text-white hover:bg-emerald-900 shadow-emerald-900/20 active:scale-95' 
                  : 'bg-slate-100 text-slate-400 cursor-default'
                } disabled:opacity-50`}
              >
                {loadingPlan === plan.id ? <Loader2 className="animate-spin" size={20} /> : plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* LOGOS PAIEMENT */}
        <div className="mt-16 text-center">
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Paiement Mobile Money Sécurisé (Bénin & Afrique)</p>
           <div className="flex justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/MTN_Logo.svg" alt="MTN" className="h-10" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a8/Moov_Logo.svg" alt="Moov" className="h-8" />
              <img src="https://upload.wikimedia.org/wikipedia/fr/0/0e/Logo_Celtiis.png" alt="Celtiis" className="h-10" />
           </div>
        </div>
      </section>
    </div>
  )
}