import { motion } from 'framer-motion' // Correction : Import manquant
import { Check, Star } from 'lucide-react' // Correction : Zap supprimé (inutile)
import { useSubscription } from '../contexts/SubscriptionContext'
import { formatPrice } from '../utils/geolocation'

export function PricingPage() {
  const { currency } = useSubscription() // Utilisé maintenant pour le formatage

  const plans = [
    {
      id: 'free',
      name: 'Essai Gratuit',
      price: 0,
      period: '7 jours',
      features: ['5 formules manuelles', 'Analyse de base', 'Support email'],
      buttonText: 'Commencer',
      highlight: false
    },
    {
      id: 'monthly',
      name: 'Pro Mensuel',
      price: 5000,
      period: 'mois',
      features: ['Formules illimitées', 'Générateur IA', 'Export PDF', 'Support WhatsApp'],
      buttonText: 'Passer Pro',
      highlight: true
    },
    {
      id: 'annual',
      name: 'Pro Annuel',
      price: 50000,
      period: 'an',
      features: ['Tout du plan Pro', '2 mois gratuits', 'Formation offerte', 'Badge éleveur'],
      buttonText: 'Choisir l\'annuel',
      highlight: false
    }
  ]

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section avec couleur sombre (bg-primary) */}
      <section className="bg-[#064e3b] pt-32 pb-60 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block">
              Tarifs & Plans
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              Prêt à booster votre <span className="text-emerald-400">productivité</span> ?
            </h1>
            <p className="text-emerald-100/70 text-xl max-w-2xl mx-auto">
              Économisez sur vos coûts d'aliments dès le premier mois grâce à nos calculs de précision.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cartes de prix */}
      <section className="max-w-7xl mx-auto px-6 -mt-40 pb-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`bg-white p-10 rounded-[2.5rem] shadow-xl flex flex-col transition-transform hover:scale-105 ${
                plan.highlight ? 'border-4 border-emerald-500 relative scale-105 z-10' : 'border border-gray-100'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-1 rounded-full font-black text-xs flex items-center gap-2">
                  <Star size={14} fill="white" /> POPULAIRE
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="text-4xl font-black mb-6">
                {formatPrice(plan.price, currency)}
                <span className="text-sm text-gray-400 font-medium"> / {plan.period}</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-gray-600 font-medium text-sm">
                    <Check className="text-emerald-500" size={18}/> {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-4 rounded-2xl font-black transition-all ${
                plan.highlight 
                ? 'bg-[#064e3b] text-white shadow-lg' 
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}