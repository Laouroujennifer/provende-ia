// src/pages/Formations.tsx
import { motion } from 'framer-motion'
import { ArrowRight, ChevronRight, Zap, BookOpen, CheckCircle2, Play, GraduationCap, Star } from 'lucide-react'

const O = '#FF6800'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: 'easeOut' as const },
})

const FORMATION_URL = "https://frica-volaille.systeme.io/formation"

export function Formations() {
  return (
    <div style={{ background: '#0D0D0D', color: '#fff' }} className="min-h-screen overflow-x-hidden">

      {/* ══════════════════════════════════
          1. HERO
      ══════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-24 sm:pt-32 pb-16 sm:pb-20 overflow-hidden">

        {/* Lignes décoratives latérales — masquées sur très petit écran */}
        <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-px opacity-20"
          style={{ background: `linear-gradient(to bottom, transparent, ${O}, transparent)` }} />
        <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-px opacity-20"
          style={{ background: `linear-gradient(to bottom, transparent, ${O}, transparent)` }} />

        {/* Lettres BG en fond */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-black tracking-tighter leading-none"
            style={{ fontSize: 'clamp(6rem, 28vw, 28vw)', color: 'rgba(255,104,0,0.03)' }}>FA</span>
        </div>

        <motion.div {...fadeUp(0)} className="relative z-10 max-w-5xl w-full flex flex-col items-center">

          {/* Badge */}
          <motion.div {...fadeUp(0.05)} className="mb-8 sm:mb-10 max-w-full">
            <a
              href={FORMATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-0 transition-opacity hover:opacity-75"
              style={{
                border: '1px solid rgba(255,104,0,0.5)',
                borderRadius: '999px',
                overflow: 'hidden',
                textDecoration: 'none',
                maxWidth: '100%',
              }}>
              <span className="flex items-center gap-1.5 font-black text-white whitespace-nowrap"
                style={{ background: O, padding: '0.42rem 0.9rem', fontSize: 'clamp(0.5rem, 1.8vw, 0.57rem)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                <GraduationCap size={10} />
                Frica-Volaille Academy
              </span>
              <span className="flex items-center gap-2 font-bold whitespace-nowrap"
                style={{ padding: '0.42rem 0.75rem', fontSize: 'clamp(0.5rem, 1.8vw, 0.57rem)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
                <span style={{ width: '1px', height: '0.9rem', background: 'rgba(255,104,0,0.35)', flexShrink: 0 }} />
                <span className="hidden xs:inline">Accéder à la formation</span>
                <span className="xs:hidden">La formation</span>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,104,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ChevronRight size={11} style={{ color: O }} />
                </span>
              </span>
            </a>
          </motion.div>

          {/* Chapeau */}
          <motion.p {...fadeUp(0.15)}
            className="text-[0.6rem] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-6 sm:mb-8 px-4"
            style={{ color: 'rgba(255,255,255,0.35)' }}>
            Pour les éleveurs qui veulent progresser&nbsp;...
          </motion.p>

          {/* Titre */}
          <motion.h1 {...fadeUp(0.2)}
            className="font-black uppercase leading-[0.92] tracking-tighter mb-10 sm:mb-12 px-2"
            style={{ fontSize: 'clamp(2.6rem, 11vw, 7.5rem)' }}>
            <span style={{ color: '#fff' }}>Maîtrisez</span>
            <br />
            <span style={{ color: O }}>la Nutrition</span>
            <br />
            <span style={{ color: '#fff' }}>Animale.</span>
          </motion.h1>

          {/* CTA */}
          <motion.div {...fadeUp(0.28)} className="flex flex-col items-center gap-4 w-full px-4">
            <a
              href={FORMATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 font-black text-sm uppercase tracking-[0.15em] text-white transition-all duration-300 hover:gap-4 w-full sm:w-auto"
              style={{ background: O, padding: '1.1rem 2.5rem', borderRadius: '999px', textDecoration: 'none', maxWidth: '360px' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#FF8533')}
              onMouseLeave={e => (e.currentTarget.style.background = O)}>
              <Play size={14} fill="currentColor" />
              Accéder à la formation
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <div className="flex items-center gap-4 sm:gap-5 flex-wrap justify-center">
              {['Accès immédiat', 'Experts terrain'].map((label, i) => (
                <span key={i} className="flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-[0.12em]"
                  style={{ color: 'rgba(255,255,255,0.28)' }}>
                  <CheckCircle2 size={10} style={{ color: O }} />
                  {label}
                </span>
              ))}
            </div>
          </motion.div>

        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-10 sm:h-12" style={{ background: `linear-gradient(to bottom, transparent, ${O})` }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ background: O }} />
        </motion.div>
      </section>


      {/* ══════════════════════════════════
          2. CE QUE VOUS APPRENEZ
      ══════════════════════════════════ */}
      <section style={{ background: '#fff', color: '#0D0D0D' }} className="py-16 sm:py-24 md:py-36 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 sm:mb-16">
            <p className="text-[0.6rem] font-black uppercase tracking-[0.35em] mb-4 sm:mb-5" style={{ color: O }}>
              Programme
            </p>
            <h2 className="font-black uppercase tracking-tighter leading-tight"
              style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', color: '#0D0D0D' }}>
              Ce que vous allez<br />
              <span style={{ color: O }}>maîtriser.</span>
            </h2>
          </div>

          {/* Grid : 1 col mobile → 2 cols tablet → 4 cols desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px"
            style={{ background: '#e5e5e5' }}>
            {[
              { icon: <BookOpen size={22} />,      t: 'Matières Premières',   d: 'Identifiez et sourcez les meilleurs ingrédients locaux au meilleur prix.' },
              { icon: <Zap size={22} />,            t: 'Formulation automatique', d: 'Utilisez notre outil pour calculer des rations précises en 3 clics.' },
              { icon: <CheckCircle2 size={22} />,   t: 'Gestion des Stocks',   d: 'Optimisez vos achats, réduisez les pertes et maîtrisez vos marges.' },
              { icon: <GraduationCap size={22} />,  t: 'Croissance Rapide',    d: 'Les secrets pour atteindre le poids cible en un minimum de temps.' },
            ].map((s, i) => (
              <div key={i}
                className="p-6 sm:p-8 md:p-10 flex flex-col gap-5 cursor-default transition-colors group"
                style={{ background: '#fff' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#fff9f5')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                <div style={{ color: O }}>{s.icon}</div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-tight mb-2" style={{ color: '#0D0D0D' }}>{s.t}</h3>
                  <p className="text-xs font-medium leading-relaxed" style={{ color: '#999' }}>{s.d}</p>
                </div>
                <div className="mt-auto w-0 h-px transition-all duration-300 group-hover:w-full"
                  style={{ background: O }} />
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════
          3. RÉSULTATS
      ══════════════════════════════════ */}
      <section style={{ background: '#0D0D0D' }} className="py-16 sm:py-24 md:py-36 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 lg:gap-28 items-center">

          <div>
            <p className="text-[0.6rem] font-black uppercase tracking-[0.35em] mb-5 sm:mb-6" style={{ color: O }}>
              Résultats concrets
            </p>
            <h2 className="font-black uppercase leading-tight tracking-tighter mb-6 sm:mb-8 text-white"
              style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)' }}>
              Des compétences qui<br />
              <span style={{ color: O }}>changent tout.</span>
            </h2>
            <div className="flex flex-col gap-3">
              {[
                'Réduire le coût de la tonne de -25% à -50%',
                'Fabriquer vos aliments avec vos matières locales',
                'Analyser et améliorer votre indice de consommation',
                'Prévenir les carences et maladies nutritionnelles',
                'Accéder au réseau de fournisseurs partenaires',
              ].map((item, i) => (
                <div key={i} className="flex items-start sm:items-center gap-3">
                  <div className="w-1.5 h-1.5 rotate-45 shrink-0 mt-1.5 sm:mt-0" style={{ background: O }} />
                  <p className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Bloc stat principal */}
            <div className="p-8 sm:p-10 md:p-14 flex flex-col justify-between" style={{ background: '#111' }}>
              <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] mb-5 sm:mb-6"
                style={{ color: 'rgba(255,255,255,0.3)' }}>
                Réduction moyenne des coûts
              </p>
              <div>
                <p className="font-black leading-none tracking-tighter text-white"
                  style={{ fontSize: 'clamp(3rem, 10vw, 6rem)' }}>-40%</p>
                <div className="w-12 h-1 mt-4 mb-4" style={{ background: O }} />
                <p className="text-sm font-bold uppercase tracking-widest"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Sur le coût alimentaire<br />dès le premier mois.
                </p>
              </div>
            </div>

            {/* Stats secondaires */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { val: '100%', lab: 'En ligne' },
                { val: '5★',   lab: 'Note moyenne' },
                { val: '500+', lab: 'Éleveurs formés' },
              ].map((s, i) => (
                <div key={i} className="p-3 sm:p-4 text-center" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-lg sm:text-xl font-black tracking-tight" style={{ color: O }}>{s.val}</p>
                  <p className="text-[0.5rem] sm:text-[0.55rem] font-bold uppercase tracking-widest mt-1 leading-tight"
                    style={{ color: 'rgba(255,255,255,0.3)' }}>{s.lab}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════
          4. TÉMOIGNAGE
      ══════════════════════════════════ */}
      <section style={{ background: '#111', borderTop: '1px solid rgba(255,255,255,0.05)' }}
        className="py-16 sm:py-20 md:py-28 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-8 sm:mb-10">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={O} style={{ color: O }} />)}
          </div>
          <blockquote className="font-black uppercase tracking-tight leading-tight mb-8 sm:mb-10 text-white"
            style={{ fontSize: 'clamp(1.2rem, 4vw, 2.8rem)' }}>
            &ldquo;Grâce à la formation, j&apos;ai appris à formuler moi-même.{' '}
            <span style={{ color: O }}>J&apos;économise 45% sur l&apos;alimentation.</span>&rdquo;
          </blockquote>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-white/60">Romuald A.</p>
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.2em] mt-1"
            style={{ color: 'rgba(255,255,255,0.2)' }}>
            Éleveur &mdash; 8 000 sujets, Porto-Novo
          </p>
        </div>
      </section>


      {/* ══════════════════════════════════
          5. CTA FINAL
      ══════════════════════════════════ */}
      <section style={{ background: O }} className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
          <span className="font-black uppercase tracking-tighter text-white"
            style={{ fontSize: 'clamp(3rem, 22vw, 22vw)', whiteSpace: 'nowrap', opacity: 0.08 }}>
            Formation
          </span>
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <p className="text-[0.6rem] font-black uppercase tracking-[0.35em] mb-5 sm:mb-6"
            style={{ color: 'rgba(255,255,255,0.6)' }}>
            Frica-Volaille Academy
          </p>
          <h2 className="font-black uppercase tracking-tighter text-white leading-tight mb-8 sm:mb-10"
            style={{ fontSize: 'clamp(2rem, 8vw, 6rem)' }}>
            Cliquez ici pour<br />accéder à la formation.
          </h2>
          <a
            href={FORMATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 font-black text-[0.7rem] uppercase tracking-[0.15em] text-white transition-all w-full sm:w-auto"
            style={{ background: '#0D0D0D', padding: '1.1rem 2.2rem', textDecoration: 'none', maxWidth: '360px' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#1a1a1a')}
            onMouseLeave={e => (e.currentTarget.style.background = '#0D0D0D')}>
            Accéder à la formation <ArrowRight size={16} />
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