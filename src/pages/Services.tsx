// src/pages/Services.tsx
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Zap, Users, BarChart3, ChevronRight, GraduationCap } from 'lucide-react'

const O = '#FF6800'
const MENTORING_URL = "https://pamphilemehou.systeme.io/frica-volaille"
const COACHING_URL  = "https://pamphilemehou.systeme.io/coaching"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: 'easeOut' as const },
})

const services = [
  {
    num: '01',
    icon: <ShieldCheck size={22} />,
    title: 'Audit & Diagnostic',
    desc: 'Analyse complète de votre ferme pour identifier les pertes et optimiser vos infrastructures avant de lancer la production.',
  },
  {
    num: '02',
    icon: <Zap size={22} />,
    title: 'Formulation sur Mesure',
    desc: "Formules précises basées sur vos matières premières locales pour réduire vos coûts alimentaires jusqu'à 50%.",
  },
  {
    num: '03',
    icon: <Users size={22} />,
    title: 'Mentorat & Coaching',
    desc: 'Accompagnement quotidien par des experts pour suivre la croissance de vos bandes et prévenir les maladies.',
  },
  {
    num: '04',
    icon: <BarChart3 size={22} />,
    title: 'Maîtrise de Rentabilité',
    desc: 'Transformez votre passion en business. Gérez vos marges, vos stocks et vos ventes comme un professionnel.',
  },
]

export function Services() {
  return (
    <div style={{ background: '#0D0D0D', color: '#fff' }} className="min-h-screen overflow-x-hidden">

      {/* ══════ 1. HERO ══════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-28 sm:pt-32 pb-20 overflow-hidden">

        <div className="absolute left-0 top-0 bottom-0 w-px opacity-20"
          style={{ background: `linear-gradient(to bottom, transparent, ${O}, transparent)` }} />
        <div className="absolute right-0 top-0 bottom-0 w-px opacity-20"
          style={{ background: `linear-gradient(to bottom, transparent, ${O}, transparent)` }} />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-black tracking-tighter leading-none"
            style={{ fontSize: '28vw', color: 'rgba(255,104,0,0.03)' }}>SV</span>
        </div>

        <motion.div {...fadeUp(0)} className="relative z-10 max-w-5xl w-full flex flex-col items-center">

          {/* Badge */}
          <motion.div {...fadeUp(0.05)} className="mb-8 sm:mb-10 px-2">
            <a href={MENTORING_URL} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-0 transition-opacity hover:opacity-75"
              style={{ border: '1px solid rgba(255,104,0,0.5)', borderRadius: '999px', overflow: 'hidden', textDecoration: 'none' }}>
              <span className="flex items-center gap-1.5 font-black text-white whitespace-nowrap"
                style={{ background: O, padding: '0.42rem 0.9rem', fontSize: '0.57rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                <GraduationCap size={10} />
                Frica-Volaille
              </span>
              <span className="flex items-center gap-2 font-bold whitespace-nowrap"
                style={{ padding: '0.42rem 1rem', fontSize: '0.57rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
                <span style={{ width: '1px', height: '0.9rem', background: 'rgba(255,104,0,0.35)', flexShrink: 0 }} />
                Nos Services
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,104,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ChevronRight size={11} style={{ color: O }} />
                </span>
              </span>
            </a>
          </motion.div>

          <motion.p {...fadeUp(0.15)}
            className="text-[0.6rem] font-black uppercase tracking-[0.4em] mb-6 sm:mb-8"
            style={{ color: 'rgba(255,255,255,0.35)' }}>
            Pour toutes les personnes qui souhaitent&nbsp;...
          </motion.p>

          <motion.h1 {...fadeUp(0.2)}
            className="font-black uppercase leading-[0.92] tracking-tighter mb-10 sm:mb-12"
            style={{ fontSize: 'clamp(2.6rem, 11vw, 7.5rem)' }}>
            <span style={{ color: '#fff' }}>Lancez &amp;</span>
            <br />
            <span style={{ color: O }}>Rentabilisez</span>
            <br />
            <span style={{ color: '#fff' }}>votre élevage.</span>
          </motion.h1>

          <motion.div {...fadeUp(0.28)} className="w-full flex justify-center px-4">
            <a href={MENTORING_URL} target="_blank" rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 font-black text-sm uppercase tracking-[0.15em] text-white transition-all duration-300 hover:gap-4 w-full sm:w-auto"
              style={{ background: O, padding: '1.1rem 2rem', borderRadius: '999px', textDecoration: 'none', maxWidth: '360px' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#FF8533')}
              onMouseLeave={e => (e.currentTarget.style.background = O)}>
              Rejoindre le Programme
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1 shrink-0" />
            </a>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-12" style={{ background: `linear-gradient(to bottom, transparent, ${O})` }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ background: O }} />
        </motion.div>
      </section>

      {/* ══════ 2. STATS ══════ */}
      <section style={{ background: '#111', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        className="py-10 sm:py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3">
          {[
            { val: '+150', lab: 'Clients' },
            { val: '95%',  lab: 'Réussite' },
            { val: '1,5M', lab: 'CA générés' },
          ].map((s, i) => (
            <div key={i} className="text-center py-4 px-2 sm:px-6"
              style={{ borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <p className="font-black tracking-tighter leading-none"
                style={{ fontSize: 'clamp(1.6rem, 6vw, 3.5rem)', color: O }}>{s.val}</p>
              <p className="font-bold uppercase tracking-[0.15em] mt-1.5"
                style={{ fontSize: 'clamp(0.45rem, 1.5vw, 0.55rem)', color: 'rgba(255,255,255,0.3)' }}>{s.lab}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ 3. SERVICES GRID (fond blanc) ══════ */}
      <section style={{ background: '#fff', color: '#0D0D0D' }} className="py-16 sm:py-24 md:py-36 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 sm:mb-16">
            <p className="text-[0.6rem] font-black uppercase tracking-[0.35em] mb-4 sm:mb-5" style={{ color: O }}>
              Ce que nous faisons
            </p>
            <h2 className="font-black uppercase tracking-tighter leading-tight"
              style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', color: '#0D0D0D' }}>
              Nos services<br />
              <span style={{ color: O }}>sur mesure.</span>
            </h2>
          </div>

          {/* Mobile: stack, Tablet: 2col, Desktop: 4col */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px"
            style={{ background: '#e5e5e5' }}>
            {services.map((s, i) => (
              <div key={i}
                className="p-6 sm:p-8 md:p-10 flex flex-col gap-4 sm:gap-5 cursor-default transition-colors group"
                style={{ background: '#fff' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#fff9f5')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                <div className="flex items-center justify-between">
                  <div style={{ color: O }}>{s.icon}</div>
                  <span className="font-black text-[0.58rem] tracking-[0.2em]"
                    style={{ color: 'rgba(0,0,0,0.15)' }}>{s.num}</span>
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-tight mb-2"
                    style={{ color: '#0D0D0D' }}>{s.title}</h3>
                  <p className="text-xs font-medium leading-relaxed" style={{ color: '#999' }}>{s.desc}</p>
                </div>
                <a href={MENTORING_URL} target="_blank" rel="noopener noreferrer"
                  className="mt-auto flex items-center gap-1.5 font-black text-[0.58rem] uppercase tracking-[0.18em] transition-all hover:gap-3"
                  style={{ color: O, textDecoration: 'none' }}>
                  En savoir plus <ArrowRight size={12} />
                </a>
                <div className="w-0 h-px transition-all duration-300 group-hover:w-full"
                  style={{ background: O }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ 4. POURQUOI NOUS ══════ */}
      <section style={{ background: '#0D0D0D' }} className="py-16 sm:py-24 md:py-36 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 md:gap-28 items-center">

          <div>
            <p className="text-[0.6rem] font-black uppercase tracking-[0.35em] mb-5 sm:mb-6" style={{ color: O }}>
              Pourquoi nous choisir
            </p>
            <h2 className="font-black uppercase leading-tight tracking-tighter mb-8 text-white"
              style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)' }}>
              Une expertise qui<br />
              <span style={{ color: O }}>fait la différence.</span>
            </h2>
            <div className="flex flex-col gap-3">
              {[
                "On ne parle pas depuis un bureau, on vient du hangar.",
                "Réduisez votre indice de consommation dès le 1er mois.",
                "Accédez aux meilleurs fournisseurs de poussins du Bénin.",
                "Suivi personnalisé tout au long de votre bande.",
                "Résultats mesurables et garantis sur vos marges.",
              ].map((item, i) => (
                <div key={i} className="flex items-start sm:items-center gap-3">
                  <div className="w-1.5 h-1.5 rotate-45 shrink-0 mt-1.5 sm:mt-0" style={{ background: O }} />
                  <p className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="p-8 sm:p-10 md:p-14 flex flex-col justify-between" style={{ background: '#111' }}>
              <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] mb-5 sm:mb-6"
                style={{ color: 'rgba(255,255,255,0.3)' }}>
                Réduction moyenne des coûts
              </p>
              <div>
                <p className="font-black leading-none tracking-tighter text-white"
                  style={{ fontSize: 'clamp(3rem, 10vw, 6rem)' }}>-50%</p>
                <div className="w-12 h-1 mt-4 mb-4" style={{ background: O }} />
                <p className="text-sm font-bold uppercase tracking-widest"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Sur le coût alimentaire<br />dès le premier mois.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { val: '150+', lab: 'Clients' },
                { val: '95%',  lab: 'Réussite' },
                { val: '24/7', lab: 'Support' },
              ].map((s, i) => (
                <div key={i} className="p-3 sm:p-4 text-center"
                  style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-lg sm:text-xl font-black tracking-tight" style={{ color: O }}>{s.val}</p>
                  <p className="font-bold uppercase tracking-widest mt-1 leading-tight"
                    style={{ fontSize: 'clamp(0.45rem, 1.5vw, 0.55rem)', color: 'rgba(255,255,255,0.3)' }}>{s.lab}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════ 5. CTA FINAL (fond orange) ══════ */}
      <section style={{ background: O }} className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
          <span className="font-black uppercase tracking-tighter text-white"
            style={{ fontSize: '22vw', whiteSpace: 'nowrap', opacity: 0.08 }}>Services</span>
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <p className="text-[0.6rem] font-black uppercase tracking-[0.35em] mb-5 sm:mb-6"
            style={{ color: 'rgba(255,255,255,0.6)' }}>
            Frica-Volaille — Accompagnement Expert
          </p>
          <h2 className="font-black uppercase tracking-tighter text-white leading-tight mb-8 sm:mb-10"
            style={{ fontSize: 'clamp(2rem, 8vw, 6rem)' }}>
            Commencez<br />l'accompagnement.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
            <a href={COACHING_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 font-black uppercase tracking-[0.15em] text-white transition-all w-full sm:w-auto"
              style={{ background: '#0D0D0D', padding: '1.1rem 2rem', textDecoration: 'none', fontSize: 'clamp(0.6rem, 2vw, 0.7rem)' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#1a1a1a')}
              onMouseLeave={e => (e.currentTarget.style.background = '#0D0D0D')}>
              Réserver un appel <ArrowRight size={16} />
            </a>
            <a href={MENTORING_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 font-black uppercase tracking-[0.15em] transition-all w-full sm:w-auto"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '1.1rem 2rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)', fontSize: 'clamp(0.6rem, 2vw, 0.7rem)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}>
              Voir le mentorat <ArrowRight size={16} />
            </a>
          </div>
          <p className="mt-6 sm:mt-8 text-[0.58rem] font-bold uppercase tracking-widest"
            style={{ color: 'rgba(255,255,255,0.45)' }}>
            Propulsé par Frica-Volaille Academy
          </p>
        </div>
      </section>

    </div>
  )
}