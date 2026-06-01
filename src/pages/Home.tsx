import { motion } from 'framer-motion'
import { ArrowRight, ChevronRight, Zap, Microscope, Calculator, CheckCircle2, TrendingDown, Users, Star, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

const O = '#FF6800'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: 'easeOut' as const },
})

export function Home() {
  return (
    <div style={{ background: '#0D0D0D', color: '#fff' }} className="min-h-screen overflow-x-hidden relative">

      {/* ══════════════════════════════════
          1. HERO
      ══════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-20 sm:pt-24 pb-16 sm:pb-20 overflow-hidden">

        {/* Lignes décoratives latérales — masquées sur mobile */}
        <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-px opacity-20"
          style={{ background: `linear-gradient(to bottom, transparent, ${O}, transparent)` }} />
        <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-px opacity-20"
          style={{ background: `linear-gradient(to bottom, transparent, ${O}, transparent)` }} />

        {/* Lettres PB en fond */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-black tracking-tighter leading-none select-none"
            style={{ fontSize: 'clamp(8rem, 30vw, 30vw)', color: 'rgba(255,104,0,0.03)' }}>PB</span>
        </div>

        <motion.div {...fadeUp(0)} className="relative z-10 max-w-5xl w-full flex flex-col items-center">

          {/* ── BADGE ESSAI GRATUIT ── */}
          <motion.div {...fadeUp(0.05)} className="mb-10 sm:mb-14 max-w-full">
            <Link
              to="/register"
              className="flex items-center gap-0 transition-opacity hover:opacity-75"
              style={{
                border: '1px solid rgba(255,104,0,0.5)',
                borderRadius: '999px',
                overflow: 'hidden',
                textDecoration: 'none',
                maxWidth: '100%',
              }}>
              <span
                className="flex items-center gap-1.5 font-black text-white whitespace-nowrap"
                style={{
                  background: O,
                  padding: '0.42rem 0.9rem',
                  fontSize: 'clamp(0.5rem, 1.8vw, 0.57rem)',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                }}>
                <Zap size={10} fill="currentColor" />
                Essai gratuit
              </span>
              <span
                className="flex items-center gap-2 font-bold whitespace-nowrap"
                style={{
                  padding: '0.42rem 0.75rem',
                  fontSize: 'clamp(0.5rem, 1.8vw, 0.57rem)',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)',
                }}>
                <span style={{ width: '1px', height: '0.9rem', background: 'rgba(255,104,0,0.35)', flexShrink: 0 }} />
                <span className="hidden xs:inline">3 formules offertes &mdash; sans carte bancaire</span>
                <span className="xs:hidden">Sans carte bancaire</span>
                <span style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  background: 'rgba(255,104,0,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <ChevronRight size={11} style={{ color: O }} />
                </span>
              </span>
            </Link>
          </motion.div>

          {/* Chapeau */}
          <motion.p {...fadeUp(0.15)}
            className="text-[0.6rem] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-6 sm:mb-8 px-2"
            style={{ color: 'rgba(255,255,255,0.35)' }}>
            Pour toutes les personnes qui souhaitent&nbsp;...
          </motion.p>

          {/* TITRE MASSIF */}
          <motion.h1 {...fadeUp(0.2)}
            className="font-black uppercase leading-[0.92] tracking-tighter px-2"
            style={{ fontSize: 'clamp(2.6rem, 12vw, 8rem)' }}>
            <span style={{ color: '#fff' }}>Lancez et </span>
            <span style={{ color: O }}>Rentabilisez</span>
            <br />
            <span style={{ color: O }}>Votre Elevage</span>
            <br />
            <span style={{ color: '#fff' }}>Sans Perdre</span>
            <br />
            <span style={{ color: '#fff' }}>De l&apos;Argent.</span>
          </motion.h1>

          {/* CTA PRINCIPAL */}
          <motion.div {...fadeUp(0.28)} className="flex flex-col items-center gap-4 mt-10 sm:mt-12 w-full px-4">
            <Link to="/register"
              className="group w-full sm:w-auto flex items-center justify-center gap-3 font-black text-sm uppercase tracking-[0.15em] text-white transition-all duration-300 hover:gap-4"
              style={{ background: O, padding: '1.1rem 2.5rem', borderRadius: '999px', maxWidth: '360px' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#FF8533')}
              onMouseLeave={e => (e.currentTarget.style.background = O)}>
              <Zap size={15} fill="currentColor" />
              Demarrer l&apos;essai gratuit
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            {/* Réassurance */}
            <div className="flex items-center gap-4 sm:gap-5 flex-wrap justify-center">
              {['Sans carte bancaire', 'Acces immediat'].map((label, i) => (
                <span key={i} className="flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-[0.12em]"
                  style={{ color: 'rgba(255,255,255,0.30)' }}>
                  <CheckCircle2 size={10} style={{ color: O }} />
                  {label}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Séparateur */}
          <motion.div {...fadeUp(0.35)} className="flex items-center justify-center gap-3 sm:gap-4 mt-10 sm:mt-12 w-full px-4">
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="w-2 h-2 rotate-45 shrink-0" style={{ background: O }} />
            <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] whitespace-nowrap"
              style={{ color: 'rgba(255,255,255,0.4)' }}>
              Nos Produits et Services
            </p>
            <div className="w-2 h-2 rotate-45 shrink-0" style={{ background: O }} />
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.08)' }} />
          </motion.div>

          <motion.div {...fadeUp(0.4)} className="mt-5 sm:mt-6">
            <Link to="/pricing"
              className="flex items-center gap-1.5 text-[0.62rem] font-black uppercase tracking-[0.2em] transition-colors"
              style={{ color: 'rgba(255,255,255,0.25)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}>
              Voir les tarifs <ChevronRight size={12} />
            </Link>
          </motion.div>

        </motion.div>

        {/* Flèche scroll */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-10 sm:h-12" style={{ background: `linear-gradient(to bottom, transparent, ${O})` }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ background: O }} />
        </motion.div>
      </section>


      {/* ══════════════════════════════════
          2. BANDE STATS
      ══════════════════════════════════ */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#111' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
          {[
            { val: '-25%',    lab: 'Cout / tonne',      icon: <TrendingDown size={15} /> },
            { val: '3 clics', lab: 'Formule optimale',  icon: <Zap size={15} /> },
            { val: '500+',    lab: 'Eleveurs actifs',   icon: <Users size={15} /> },
            { val: '4.9',     lab: 'Note satisfaction', icon: <Star size={15} /> },
          ].map((s, i) => (
            <div key={i}
              className="flex flex-col items-center justify-center text-center py-8 sm:py-10 px-3 sm:px-4"
              style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div className="mb-2" style={{ color: O }}>{s.icon}</div>
              <p className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">{s.val}</p>
              <p className="text-[0.52rem] sm:text-[0.58rem] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1"
                style={{ color: 'rgba(255,255,255,0.3)' }}>{s.lab}</p>
            </div>
          ))}
        </div>
      </section>


      {/* ══════════════════════════════════
          3. POURQUOI
      ══════════════════════════════════ */}
      <section style={{ background: '#fff', color: '#0D0D0D' }} className="py-16 sm:py-24 md:py-36 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 lg:gap-28 items-center">

          <div>
            <p className="text-[0.6rem] font-black uppercase tracking-[0.35em] mb-5 sm:mb-6" style={{ color: O }}>
              Pourquoi ProvendeBuilder ?
            </p>
            <h2 className="font-black uppercase leading-tight tracking-tighter mb-6 sm:mb-8"
              style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', color: '#0D0D0D' }}>
              La science de la nutrition<br />
              <span style={{ color: O }}>au service</span><br />
              de votre rentabilite.
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mb-8 sm:mb-10 leading-relaxed font-medium">
              L&apos;alimentation represente{' '}
              <strong style={{ color: O }}>70% des couts de production</strong>.
              Notre systeme equilibre les Acides Amines essentiels,
              l&apos;Energie Metabolisable et les Mineraux pour maximiser votre rendement.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { t: 'Moindre Cout',     d: 'Prix le plus bas garanti.',       icon: <Zap size={14} /> },
                { t: 'Precision AA',     d: 'Lysine / Methionine equilibres.',  icon: <Microscope size={14} /> },
                { t: 'Profils Speciaux', d: 'Demarrage, Croissance, Finition.', icon: <Calculator size={14} /> },
                { t: 'Vos Matieres',     d: 'Utilisez vos stocks locaux.',      icon: <CheckCircle2 size={14} /> },
              ].map((item, i) => (
                <div key={i}
                  className="flex gap-3 p-4 cursor-default transition-colors"
                  style={{ border: '1px solid #e5e5e5' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = O)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e5e5')}>
                  <div className="shrink-0 mt-0.5" style={{ color: O }}>{item.icon}</div>
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-tight" style={{ color: '#0D0D0D' }}>{item.t}</h4>
                    <p className="text-[0.62rem] font-medium uppercase tracking-wider mt-0.5" style={{ color: '#999' }}>{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="p-8 sm:p-10 md:p-14 flex flex-col justify-between" style={{ background: '#0D0D0D' }}>
              <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] mb-5 sm:mb-6"
                style={{ color: 'rgba(255,255,255,0.3)' }}>
                Impact economique moyen
              </p>
              <div>
                <p className="font-black leading-none tracking-tighter text-white"
                  style={{ fontSize: 'clamp(3rem, 10vw, 6rem)' }}>-25%</p>
                <div className="w-12 h-1 mt-4 mb-4" style={{ background: O }} />
                <p className="text-sm font-bold uppercase tracking-widest"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Sur le cout de la tonne<br />des la premiere bande.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { val: '70%',  lab: 'des couts alimentation' },
                { val: '3x',   lab: 'plus rapide' },
                { val: '100%', lab: 'vos matieres locales' },
              ].map((s, i) => (
                <div key={i} className="p-3 sm:p-4 text-center" style={{ border: '1px solid #e5e5e5' }}>
                  <p className="text-lg sm:text-xl font-black tracking-tight" style={{ color: O }}>{s.val}</p>
                  <p className="text-[0.5rem] sm:text-[0.55rem] font-bold uppercase tracking-widest mt-1 leading-tight"
                    style={{ color: '#999' }}>{s.lab}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════
          4. COMMENT CA MARCHE
      ══════════════════════════════════ */}
      <section style={{ background: '#0D0D0D' }} className="py-16 sm:py-24 md:py-36 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-24">
            <p className="text-[0.6rem] font-black uppercase tracking-[0.35em] mb-4 sm:mb-5" style={{ color: O }}>
              Simple et rapide
            </p>
            <h2 className="font-black uppercase tracking-tighter leading-tight"
              style={{ fontSize: 'clamp(1.8rem, 6vw, 4.5rem)', color: '#fff' }}>
              3 etapes pour votre<br />
              <span style={{ color: O }}>formule optimale.</span>
            </h2>
          </div>

          {/* Grid : 1 col mobile → 3 cols desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { n: '01', t: 'Entrez vos matieres',      d: 'Renseignez les ingredients disponibles dans votre region et leur prix du marche actuel.' },
              { n: '02', t: 'Definissez vos objectifs', d: 'Choisissez votre animal, le stade de production et les criteres nutritionnels cibles.' },
              { n: '03', t: 'Obtenez votre formule',    d: "L'IA calcule en secondes la ration la plus economique qui respecte tous vos besoins." },
            ].map((step, i) => (
              <div key={i} className="p-7 sm:p-8 md:p-12"
                style={{
                  borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                <span className="block font-black mb-5 sm:mb-6 leading-none"
                  style={{ fontSize: 'clamp(3rem, 8vw, 4rem)', color: 'rgba(255,104,0,0.08)', letterSpacing: '-0.04em' }}>
                  {step.n}
                </span>
                <div className="w-6 h-0.5 mb-4 sm:mb-5" style={{ background: O }} />
                <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-white mb-3">{step.t}</h3>
                <p className="text-sm leading-relaxed font-medium"
                  style={{ color: 'rgba(255,255,255,0.38)' }}>{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════
          5. TEMOIGNAGE
      ══════════════════════════════════ */}
      <section style={{ background: '#111', borderTop: '1px solid rgba(255,255,255,0.05)' }}
        className="py-16 sm:py-20 md:py-28 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-8 sm:mb-10">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={O} style={{ color: O }} />)}
          </div>
          <blockquote className="font-black uppercase tracking-tight leading-tight mb-8 sm:mb-10 text-white"
            style={{ fontSize: 'clamp(1.2rem, 4vw, 2.8rem)' }}>
            &ldquo;Avec ProvendeBuilder, j&apos;ai reduit mes couts de{' '}
            <span style={{ color: O }}>22% des la premiere bande.</span>
            {' '}La formule etait parfaite.&rdquo;
          </blockquote>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-white/60">Jean-Baptiste K.</p>
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.2em] mt-1"
            style={{ color: 'rgba(255,255,255,0.2)' }}>
            Eleveur &mdash; 5 000 sujets, Cotonou
          </p>
        </div>
      </section>


      {/* ══════════════════════════════════
          6. SERVICES
      ══════════════════════════════════ */}
      <section style={{ background: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.05)' }}
        className="py-16 sm:py-24 md:py-36 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 sm:gap-8 mb-12 sm:mb-16">
            <div>
              <p className="text-[0.6rem] font-black uppercase tracking-[0.35em] mb-3 sm:mb-4" style={{ color: O }}>
                Ce qu&apos;on vous offre
              </p>
              <h2 className="font-black uppercase tracking-tighter leading-tight text-white"
                style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)' }}>
                Tout ce qu&apos;il faut<br />pour reussir.
              </h2>
            </div>
            <Link to="/services"
              className="shrink-0 flex items-center gap-2 font-black text-[0.65rem] uppercase tracking-[0.2em] transition-colors self-start sm:self-auto"
              style={{ color: 'rgba(255,255,255,0.4)' }}
              onMouseEnter={e => (e.currentTarget.style.color = O)}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
              Tous les services <ArrowRight size={14} />
            </Link>
          </div>

          {/* Grid : 1 col → 2 cols → 4 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px"
            style={{ background: 'rgba(255,255,255,0.06)' }}>
            {[
              { icon: <Shield size={22} />,      t: 'Audit & Diagnostic',   d: 'Identifiez les pertes avant de lancer.' },
              { icon: <Zap size={22} />,          t: 'Formulation IA',       d: 'Ration optimale en 3 clics.' },
              { icon: <Users size={22} />,        t: 'Mentorat & Coaching',  d: 'Accompagnement quotidien par des experts.' },
              { icon: <TrendingDown size={22} />, t: 'Maitrise Rentabilite', d: 'Gerez marges, stocks et ventes.' },
            ].map((s, i) => (
              <div key={i}
                className="p-6 sm:p-8 md:p-10 flex flex-col gap-5 cursor-default transition-colors group"
                style={{ background: '#0D0D0D' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#111')}
                onMouseLeave={e => (e.currentTarget.style.background = '#0D0D0D')}>
                <div style={{ color: O }}>{s.icon}</div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-tight text-white mb-2">{s.t}</h3>
                  <p className="text-xs font-medium leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.35)' }}>{s.d}</p>
                </div>
                <div className="mt-auto w-0 h-px transition-all duration-300 group-hover:w-full"
                  style={{ background: O }} />
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════
          7. CTA FINAL
      ══════════════════════════════════ */}
      <section style={{ background: O }} className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
          <span className="font-black uppercase tracking-tighter text-white select-none"
            style={{ fontSize: 'clamp(3rem, 22vw, 22vw)', whiteSpace: 'nowrap', opacity: 0.08 }}>
            Demarrez
          </span>
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <p className="text-[0.6rem] font-black uppercase tracking-[0.35em] mb-5 sm:mb-6"
            style={{ color: 'rgba(255,255,255,0.6)' }}>
            Rejoignez 500+ eleveurs rentables
          </p>
          <h2 className="font-black uppercase tracking-tighter text-white leading-tight mb-8 sm:mb-10"
            style={{ fontSize: 'clamp(2rem, 8vw, 6rem)' }}>
            Demarrez votre<br />elevage rentable.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
            <Link to="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-3 font-black text-[0.7rem] uppercase tracking-[0.15em] text-white transition-all"
              style={{ background: '#0D0D0D', padding: '1.1rem 2.2rem', maxWidth: '320px' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#1a1a1a')}
              onMouseLeave={e => (e.currentTarget.style.background = '#0D0D0D')}>
              Creer un compte gratuit <ArrowRight size={15} />
            </Link>
            <Link to="/pricing"
              className="w-full sm:w-auto flex items-center justify-center gap-3 font-black text-[0.7rem] uppercase tracking-[0.15em] text-white transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.4)', padding: '1.1rem 2.2rem', maxWidth: '320px' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.9)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)')}>
              Voir les tarifs <ChevronRight size={15} />
            </Link>
          </div>
          <p className="mt-6 sm:mt-8 text-[0.58rem] font-bold uppercase tracking-widest"
            style={{ color: 'rgba(255,255,255,0.45)' }}>
            Essai gratuit &bull; Aucune carte bancaire requise
          </p>
        </div>
      </section>

    </div>
  )
}