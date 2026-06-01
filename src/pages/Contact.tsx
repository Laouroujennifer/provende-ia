// src/pages/Contact.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Phone, Mail, MapPin, ChevronRight, MessageCircle, CalendarCheck } from 'lucide-react'

const O = '#FF6800'
const COACHING_URL  = "https://pamphilemehou.systeme.io/coaching"
const FORMATION_URL = "https://frica-volaille.systeme.io/formation"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: 'easeOut' as const },
})

const INPUT_BASE = "w-full px-4 py-3.5 bg-[#0D0D0D] border border-white/10 text-white text-sm font-medium outline-none transition-all placeholder:text-white/20 focus:border-[#FF6800]"

export function Contact() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div style={{ background: '#0D0D0D', color: '#fff' }} className="min-h-screen overflow-x-hidden">

      {/* ══════ 1. HERO ══════ */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-28 sm:pt-32 pb-20 overflow-hidden">

        <div className="absolute left-0 top-0 bottom-0 w-px opacity-20"
          style={{ background: `linear-gradient(to bottom, transparent, ${O}, transparent)` }} />
        <div className="absolute right-0 top-0 bottom-0 w-px opacity-20"
          style={{ background: `linear-gradient(to bottom, transparent, ${O}, transparent)` }} />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-black tracking-tighter leading-none"
            style={{ fontSize: '28vw', color: 'rgba(255,104,0,0.03)' }}>CT</span>
        </div>

        <motion.div {...fadeUp(0)} className="relative z-10 max-w-4xl w-full flex flex-col items-center">

          {/* Badge */}
          <motion.div {...fadeUp(0.05)} className="mb-8 sm:mb-10">
            <div className="flex items-center gap-0"
              style={{ border: '1px solid rgba(255,104,0,0.5)', borderRadius: '999px', overflow: 'hidden' }}>
              <span className="flex items-center gap-1.5 font-black text-white whitespace-nowrap"
                style={{ background: O, padding: '0.42rem 0.9rem', fontSize: '0.57rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                <MessageCircle size={10} />
                Support Prioritaire
              </span>
              <span className="flex items-center gap-2 font-bold whitespace-nowrap"
                style={{ padding: '0.42rem 1rem', fontSize: '0.57rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
                <span style={{ width: '1px', height: '0.9rem', background: 'rgba(255,104,0,0.35)', flexShrink: 0 }} />
                Réponse sous 24h
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,104,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ChevronRight size={11} style={{ color: O }} />
                </span>
              </span>
            </div>
          </motion.div>

          <motion.p {...fadeUp(0.15)}
            className="text-[0.6rem] font-black uppercase tracking-[0.4em] mb-6 sm:mb-8"
            style={{ color: 'rgba(255,255,255,0.35)' }}>
            Une question ? Un projet d'élevage&nbsp;?
          </motion.p>

          <motion.h1 {...fadeUp(0.2)}
            className="font-black uppercase leading-[0.92] tracking-tighter mb-10"
            style={{ fontSize: 'clamp(2.6rem, 11vw, 7rem)' }}>
            <span style={{ color: '#fff' }}>Parlons de</span>
            <br />
            <span style={{ color: O }}>votre bande.</span>
          </motion.h1>

        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-12" style={{ background: `linear-gradient(to bottom, transparent, ${O})` }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ background: O }} />
        </motion.div>
      </section>

      {/* ══════ 2. ACTIONS RAPIDES ══════ */}
      <section style={{ background: '#111', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        className="py-8 sm:py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {[
            { icon: <CalendarCheck size={18} />, label: 'Réserver un appel gratuit', sub: 'Disponible 7j/7', href: COACHING_URL, primary: true },
            { icon: <ArrowRight size={18} />,    label: 'Rejoindre la formation',    sub: 'Accès immédiat',  href: FORMATION_URL, primary: false },
          ].map((btn, i) => (
            <a key={i} href={btn.href} target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-4 p-4 sm:p-5 transition-all"
              style={{ background: btn.primary ? O : 'transparent', border: `1px solid ${btn.primary ? O : 'rgba(255,255,255,0.08)'}`, textDecoration: 'none', color: '#fff' }}
              onMouseEnter={e => { if (!btn.primary) e.currentTarget.style.borderColor = O }}
              onMouseLeave={e => { if (!btn.primary) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}>
              <div className="shrink-0" style={{ color: btn.primary ? '#fff' : O }}>{btn.icon}</div>
              <div className="min-w-0">
                <p className="font-black text-sm uppercase tracking-tight truncate">{btn.label}</p>
                <p className="text-[0.58rem] font-bold uppercase tracking-widest mt-0.5"
                  style={{ color: btn.primary ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)' }}>{btn.sub}</p>
              </div>
              <ArrowRight size={14} className="ml-auto shrink-0 transition-transform group-hover:translate-x-1"
                style={{ color: btn.primary ? '#fff' : O }} />
            </a>
          ))}
        </div>
      </section>

      {/* ══════ 3. FORMULAIRE + INFOS ══════ */}
      <section style={{ background: '#fff', color: '#0D0D0D' }} className="py-16 sm:py-24 md:py-36 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 md:gap-28 items-start">

          {/* Gauche — infos */}
          <div>
            <p className="text-[0.6rem] font-black uppercase tracking-[0.35em] mb-4 sm:mb-5" style={{ color: O }}>
              Coordonnées
            </p>
            <h2 className="font-black uppercase tracking-tighter leading-tight mb-10 sm:mb-12"
              style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', color: '#0D0D0D' }}>
              Trouvez-nous<br />
              <span style={{ color: O }}>facilement.</span>
            </h2>

            <div className="flex flex-col gap-6 sm:gap-8">
              {[
                { icon: <Phone size={18} />,  label: 'Téléphone', value: '+229 90 00 00 00' },
                { icon: <Mail size={18} />,   label: 'Email',     value: 'contact@provendebuilder.com' },
                { icon: <MapPin size={18} />, label: 'Siège',     value: 'Zone Industrielle Akpakpa, Cotonou, Bénin' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 shrink-0 flex items-center justify-center"
                    style={{ background: 'rgba(255,104,0,0.08)', color: O }}>
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.58rem] font-black uppercase tracking-[0.2em] mb-1"
                      style={{ color: 'rgba(0,0,0,0.3)' }}>{item.label}</p>
                    <p className="text-sm font-bold break-words" style={{ color: '#0D0D0D' }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Droite — formulaire */}
          <div>
            <p className="text-[0.6rem] font-black uppercase tracking-[0.35em] mb-4 sm:mb-5" style={{ color: O }}>
              Formulaire
            </p>
            <h2 className="font-black uppercase tracking-tighter leading-tight mb-8 sm:mb-10"
              style={{ fontSize: 'clamp(1.4rem, 3vw, 2.5rem)', color: '#0D0D0D' }}>
              Envoyez un<br />
              <span style={{ color: O }}>message.</span>
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4"
              style={{ background: '#0D0D0D', padding: 'clamp(1.2rem, 4vw, 2rem)', borderTop: `3px solid ${O}` }}>

              {/* Nom + Téléphone : stack sur mobile, 2 col sur sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.58rem] font-black uppercase tracking-[0.2em] mb-2"
                    style={{ color: 'rgba(255,255,255,0.3)' }}>Nom complet</label>
                  <input type="text" placeholder="Jean Koffi" className={INPUT_BASE} />
                </div>
                <div>
                  <label className="block text-[0.58rem] font-black uppercase tracking-[0.2em] mb-2"
                    style={{ color: 'rgba(255,255,255,0.3)' }}>Téléphone</label>
                  <input type="tel" placeholder="+229 …" className={INPUT_BASE} />
                </div>
              </div>

              <div>
                <label className="block text-[0.58rem] font-black uppercase tracking-[0.2em] mb-2"
                  style={{ color: 'rgba(255,255,255,0.3)' }}>Email</label>
                <input type="email" placeholder="jean@ferme.com" className={INPUT_BASE} />
              </div>

              <div>
                <label className="block text-[0.58rem] font-black uppercase tracking-[0.2em] mb-2"
                  style={{ color: 'rgba(255,255,255,0.3)' }}>Votre besoin</label>
                <select className={INPUT_BASE} style={{ appearance: 'none', cursor: 'pointer' }}>
                  <option value="" disabled>Choisir un service...</option>
                  <option>Audit &amp; Diagnostic</option>
                  <option>Formulation sur Mesure</option>
                  <option>Mentorat &amp; Coaching</option>
                  <option>Maîtrise de Rentabilité</option>
                  <option>Autre demande</option>
                </select>
              </div>

              <div>
                <label className="block text-[0.58rem] font-black uppercase tracking-[0.2em] mb-2"
                  style={{ color: 'rgba(255,255,255,0.3)' }}>Message</label>
                <textarea rows={4} placeholder="Comment pouvons-nous optimiser votre production ?"
                  className={INPUT_BASE + " resize-none"} />
              </div>

              <button type="submit"
                className="w-full flex items-center justify-center gap-3 font-black uppercase tracking-[0.15em] text-white transition-all mt-2 touch-manipulation"
                style={{ background: sent ? '#1a7a3a' : O, padding: '1.1rem', border: 'none', cursor: 'pointer', fontSize: 'clamp(0.62rem, 2vw, 0.7rem)', minHeight: '52px' }}>
                {sent ? '✅ Message envoyé !' : <><span>Envoyer le message</span><ArrowRight size={15} /></>}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ══════ 4. CTA FINAL (fond orange) ══════ */}
      <section style={{ background: O }} className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
          <span className="font-black uppercase tracking-tighter text-white"
            style={{ fontSize: '22vw', whiteSpace: 'nowrap', opacity: 0.08 }}>Contact</span>
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <p className="text-[0.6rem] font-black uppercase tracking-[0.35em] mb-5 sm:mb-6"
            style={{ color: 'rgba(255,255,255,0.6)' }}>
            Frica-Volaille — Support Expert
          </p>
          <h2 className="font-black uppercase tracking-tighter text-white leading-tight mb-8 sm:mb-10"
            style={{ fontSize: 'clamp(2rem, 8vw, 6rem)' }}>
            Prêt à démarrer<br />votre élevage ?
          </h2>
          <a href={COACHING_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 font-black uppercase tracking-[0.15em] text-white transition-all w-full sm:w-auto touch-manipulation"
            style={{ background: '#0D0D0D', padding: '1.2rem 2rem', textDecoration: 'none', fontSize: 'clamp(0.62rem, 2vw, 0.7rem)', maxWidth: '380px' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#1a1a1a')}
            onMouseLeave={e => (e.currentTarget.style.background = '#0D0D0D')}>
            RÉSERVEZ UN APPEL GRATUIT <ArrowRight size={16} />
          </a>
          <p className="mt-6 sm:mt-8 text-[0.58rem] font-bold uppercase tracking-widest"
            style={{ color: 'rgba(255,255,255,0.45)' }}>
            Propulsé par Frica-Volaille Academy
          </p>
        </div>
      </section>

    </div>
  )
}