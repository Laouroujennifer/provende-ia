import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutGrid, LogOut, Menu, Gift, FlaskConical,
  ArrowUpRight, Wheat, ChevronRight, Sparkles,
  Zap, X, Star, Lock, CreditCard, Plus
} from 'lucide-react'
import { ManualAnalyzer } from './ManualAnalyzer'
import { AutomaticGenerator } from './AutomaticGenerator'
import { ReferralSection } from './ReferralSection'
import { SavedFormulas } from './SavedFormulas'
import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../contexts/SubscriptionContext'

type View = 'home' | 'calculator' | 'referral' | 'history'

interface KpiCardProps {
  label: string
  value: string | number
  sub: string
  icon: React.ReactNode
  colorClass: string
  bgClass: string
  borderClass: string
}

function KpiCard({ label, value, sub, icon, colorClass, bgClass, borderClass }: KpiCardProps) {
  return (
    <div className={`relative bg-[#1A1A1A] rounded-2xl p-6 border ${borderClass} shadow-sm overflow-hidden group hover:shadow-lg hover:shadow-[#FF6800]/10 transition-all duration-300 cursor-default`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgClass} ${colorClass}`}>
          {icon}
        </div>
        <ArrowUpRight size={14} className={`${colorClass} opacity-0 group-hover:opacity-100 transition-opacity`} />
      </div>
      <p className="text-2xl font-black text-white tracking-tight">{value}</p>
      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">{label}</p>
      <p className="text-[11px] text-white/40 font-medium mt-2 italic border-t border-[#2A2A2A] pt-2">{sub}</p>
    </div>
  )
}

// ─── CREDIT PILL ────────────────────────────────────────────────────────────

function CreditPill({ credits, onClick }: { credits: number; onClick: () => void }) {
  const isEmpty = credits === 0
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 border rounded-full px-3.5 py-2 transition-all hover:shadow-sm group ${
        isEmpty
          ? 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30'
          : 'bg-[#FF6800]/10 hover:bg-[#FF6800]/20 border-[#FF6800]/30'
      }`}
    >
      {isEmpty ? (
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
      ) : (
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6800] opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6800]" />
        </span>
      )}
      <span className={`text-[11px] font-black tracking-wide hidden sm:inline ${isEmpty ? 'text-red-400' : 'text-[#FF6800]'}`}>
        Crédits
      </span>
      <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${isEmpty ? 'bg-red-500 text-white' : 'bg-[#FF6800] text-white'}`}>
        {credits}
      </span>
    </button>
  )
}

// ─── CREDIT CARD WIDGET ──────────────────────────────────────────────────────

function CreditCard_({ credits, onRecharge, onDismiss }: {
  credits: number
  onRecharge: () => void
  onDismiss: () => void
}) {
  const isEmpty = credits === 0

  return (
    <div className={`relative rounded-2xl p-6 md:p-8 overflow-hidden border ${
      isEmpty
        ? 'bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/30'
        : 'bg-gradient-to-br from-[#FF6800]/10 to-[#FF6800]/5 border-[#FF6800]/30'
    }`}>
      <button
        onClick={onDismiss}
        className="absolute top-4 right-4 p-1.5 text-white/30 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
      >
        <X size={14} />
      </button>
      <div className={`absolute top-0 right-0 w-48 h-48 rounded-full -mr-16 -mt-16 pointer-events-none blur-2xl ${isEmpty ? 'bg-red-500/10' : 'bg-[#FF6800]/10'}`} />

      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center shadow-lg ${
          isEmpty
            ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/30'
            : 'bg-gradient-to-br from-[#FF8533] to-[#FF6800] shadow-[#FF6800]/30'
        }`}>
          <CreditCard size={24} className="text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-3 border ${
            isEmpty
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : 'bg-[#FF6800]/10 border-[#FF6800]/30 text-[#FF6800]'
          }`}>
            ✦ Solde de crédits
          </div>

          <h3 className="font-black text-white text-lg md:text-xl mb-1 tracking-tight">
            {isEmpty ? 'Plus de crédits disponibles' : `Vous avez ${credits} crédit${credits > 1 ? 's' : ''}`}
          </h3>
          <p className="text-sm text-white/50 font-medium mb-4">
            {isEmpty
              ? 'Rechargez pour continuer à vérifier et générer vos formules.'
              : 'Vérifier une formule = 1 crédit · Générer une formule = 2 crédits.'}
          </p>

          {/* Visualisation des crédits */}
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: Math.max(credits, 0) }).slice(0, 12).map((_, i) => (
              <div
                key={i}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-black ${
                  isEmpty
                    ? 'bg-[#1A1A1A] border-[#2A2A2A] text-white/20'
                    : 'bg-[#1A1A1A] border-[#FF6800]/30 text-[#FF6800]'
                }`}
              >
                <Zap size={11} />
                Crédit {i + 1}
              </div>
            ))}
            {isEmpty && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-red-500/10 border-red-500/30 text-red-400 text-[11px] font-black">
                <Lock size={11} /> Épuisé
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={onRecharge}
            className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg transition-all hover:scale-[1.02] whitespace-nowrap ${
              isEmpty
                ? 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/30'
                : 'bg-[#FF6800] hover:bg-[#FF8533] text-white shadow-[#FF6800]/30'
            }`}
          >
            <Plus size={14} /> Recharger
          </button>
          <p className={`text-center text-[10px] font-bold ${isEmpty ? 'text-red-400' : 'text-[#FF6800]'}`}>
            {isEmpty ? 'Aucun crédit restant' : `${credits} crédit${credits > 1 ? 's' : ''} restant${credits > 1 ? 's' : ''}`}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── UPGRADE MODAL ───────────────────────────────────────────────────────────

function UpgradeModal({ onClose, onGoReferral, onGoPricing }: {
  onClose: () => void
  onGoReferral: () => void
  onGoPricing: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        <div className="bg-[#0A0A0A] px-8 pt-8 pb-12 border-b border-[#2A2A2A]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
          <div className="w-16 h-16 bg-red-500/20 border border-red-400/30 rounded-2xl flex items-center justify-center mb-5">
            <CreditCard size={28} className="text-red-400" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-400/20 rounded-full text-[10px] font-black text-red-400 uppercase tracking-widest mb-4">
            Crédits épuisés
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mb-2">
            Plus de crédits disponibles.
          </h2>
          <p className="text-white/70 text-sm font-medium leading-relaxed">
            Rechargez votre solde pour continuer à générer des formules et lancer des analyses IA.
          </p>
        </div>

        <div className="px-8 py-7 -mt-5 relative space-y-3">
          <button
            onClick={onGoPricing}
            className="w-full flex items-center gap-4 bg-[#FF6800] hover:bg-[#FF8533] text-white rounded-2xl px-6 py-5 text-left transition-all hover:scale-[1.01] shadow-lg shadow-[#FF6800]/30"
          >
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Zap size={18} fill="currentColor" />
            </div>
            <div className="flex-1">
              <p className="font-black text-[13px]">Recharger des crédits</p>
              <p className="text-white/80 text-[11px] font-medium mt-0.5">
                Packs à partir de 2 400 F · Vérifier = 1 crédit · Générer = 2 crédits
              </p>
            </div>
            <ChevronRight size={16} className="shrink-0 opacity-70" />
          </button>

          <button
            onClick={onGoReferral}
            className="w-full flex items-center gap-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-white rounded-2xl px-6 py-5 text-left transition-all"
          >
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
              <Gift size={18} className="text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="font-black text-[13px]">Parrainer un ami</p>
              <p className="text-purple-300 text-[11px] font-medium mt-0.5">
                Gagnez <strong>+1 crédit bonus</strong> par ami invité
              </p>
            </div>
            <ChevronRight size={16} className="shrink-0 opacity-40" />
          </button>

          <p className="text-center text-[10px] text-white/40 font-bold pt-1">
            Pack Éleveur à 2 400 F · Pack Pro à 5 000 F · Pack Expert à 7 000 F
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

export function Dashboard() {
  const { user, signOut } = useAuth()
  const { subscription } = useSubscription()
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState<View>('home')
  const [mode, setMode] = useState<'manual' | 'auto'>('manual')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showCreditCard, setShowCreditCard] = useState(true)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const userName = user?.user_metadata?.first_name || 'Éleveur'
  const userInitials = userName.substring(0, 2).toUpperCase()

  const credits = subscription.credits ?? 0
  const bonusTrials = subscription.bonusCalculations ?? 0

  const navItems = [
    { id: 'home' as View, label: 'Accueil', icon: <LayoutGrid size={17} /> },
    { id: 'calculator' as View, label: 'Calculateur', icon: <FlaskConical size={17} /> },
    { id: 'history' as View, label: 'Mes Formules', icon: <Wheat size={17} /> },
    { id: 'referral' as View, label: 'Parrainage', icon: <Gift size={17} />, badge: bonusTrials > 0 ? `+${bonusTrials}` : undefined },
  ]

  const viewTitles: Record<View, { t: string; s: string }> = {
    home: { t: 'Tableau de bord', s: "Vue d'ensemble de votre activité" },
    calculator: { t: 'Espace Formulation', s: 'Optimisez vos coûts alimentaires' },
    history: { t: 'Mes Formules', s: 'Retrouvez vos calculs enregistrés' },
    referral: { t: 'Programme Ambassadeur', s: 'Invitez des amis et gagnez des bonus' },
  }

  const handleRecharge = () => {
    navigate('/pricing')
  }

  return (
    <div className="min-h-screen flex overflow-hidden text-white font-sans bg-[#0A0A0A]">

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {showUpgradeModal && (
        <UpgradeModal
          onClose={() => setShowUpgradeModal(false)}
          onGoReferral={() => {
            setShowUpgradeModal(false)
            setActiveView('referral')
          }}
          onGoPricing={() => {
            setShowUpgradeModal(false)
            navigate('/pricing')
          }}
        />
      )}

      {/* ─── SIDEBAR ─── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-68 bg-[#0A0A0A] text-white flex flex-col transform transition-transform duration-300 border-r border-[#2A2A2A] ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:w-64`}
      >
        {/* Logo → retour accueil */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full p-7 flex items-center gap-3 border-b border-[#2A2A2A] text-left hover:opacity-80 transition-opacity"
        >
          <div className="w-9 h-9 bg-[#FF6800] rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-[#FF6800]/30">
            PB
          </div>
          <span className="font-black uppercase tracking-tighter text-base text-white">
            Provende<span className="text-[#FF6800]">Builder</span>
          </span>
        </button>

        {/* User block */}
        <div className="mx-4 mt-4 flex items-center gap-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3">
          <div className="w-8 h-8 bg-[#FF6800] rounded-lg flex items-center justify-center font-black text-xs text-white shrink-0">
            {userInitials}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-black text-white truncate">{userName}</p>
            <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest">
              {subscription.status === 'active' ? 'Pro' : 'Free'}
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 mt-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id); setIsSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all ${
                activeView === item.id
                  ? 'bg-[#FF6800] text-white shadow-lg shadow-[#FF6800]/30'
                  : 'text-white/60 hover:text-white hover:bg-[#1A1A1A]'
              }`}
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                  activeView === item.id
                    ? 'bg-white/20 text-white'
                    : 'bg-[#FF6800]/20 text-[#FF6800]'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Credits widget in sidebar */}
        <div className="mx-4 mb-2">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[9px] font-black uppercase tracking-widest ${credits === 0 ? 'text-red-400' : 'text-[#FF6800]'}`}>
                Crédits
              </span>
              <span className={`text-lg font-black ${credits === 0 ? 'text-red-400' : 'text-white'}`}>
                {credits}
              </span>
            </div>
            <div className="flex gap-1 mb-2">
              {Array.from({ length: Math.min(Math.max(credits, 0), 12) }).map((_, i) => (
                <div key={i} className="h-1.5 flex-1 bg-[#FF6800] rounded-full" />
              ))}
              {credits === 0 && <div className="h-1.5 flex-1 bg-[#2A2A2A] rounded-full" />}
            </div>
            <p className="text-[10px] text-white/60 font-medium mb-3">
              {credits === 0 ? 'Aucun crédit — rechargez' : `${credits} crédit${credits > 1 ? 's' : ''} disponible${credits > 1 ? 's' : ''}`}
            </p>
            <button
              onClick={handleRecharge}
              className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#FF6800] hover:bg-[#FF8533] text-white rounded-lg font-black text-[9px] uppercase tracking-widest transition-all"
            >
              <Plus size={11} /> Recharger
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-[#2A2A2A]">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400/80 font-bold text-[10px] uppercase tracking-widest hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut size={16} /> Se déconnecter
          </button>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">

        {/* Mobile header */}
        <header className={`lg:hidden border-b px-4 py-3 flex items-center justify-between sticky top-0 z-30 transition-colors duration-500 ${
          activeView === 'calculator'
            ? 'bg-transparent border-transparent backdrop-blur-md'
            : 'bg-[#0A0A0A] border-[#2A2A2A]'
        }`}>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] rounded-xl text-white transition-colors border border-[#2A2A2A]"
          >
            <Menu size={19} />
          </button>
          <span
            onClick={() => navigate('/')}
            className="font-black uppercase text-sm tracking-tighter text-white cursor-pointer"
          >Provende<span className="text-[#FF6800]">Builder</span></span>
          <div className="flex items-center gap-2">
            <CreditPill credits={credits} onClick={() => setActiveView('home')} />
            <div className="w-8 h-8 bg-[#FF6800] rounded-xl flex items-center justify-center font-black text-xs text-white">
              {userInitials}
            </div>
          </div>
        </header>

        {/* Desktop header */}
        <div className={`hidden lg:flex items-center justify-between px-10 py-5 border-b sticky top-0 z-30 transition-colors duration-500 ${
          activeView === 'calculator'
            ? 'bg-transparent border-transparent backdrop-blur-md'
            : 'bg-[#0A0A0A] border-[#2A2A2A]'
        }`}>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">{viewTitles[activeView].t}</h2>
            <p className="text-[12px] text-white/50 font-medium mt-0.5">{viewTitles[activeView].s}</p>
          </div>
          <div className="flex items-center gap-3">
            <CreditPill credits={credits} onClick={() => setActiveView('home')} />
            <button
              onClick={handleRecharge}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF6800] hover:bg-[#FF8533] text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-[#FF6800]/30"
            >
              <Plus size={13} /> Recharger
            </button>
            <div className="flex items-center gap-3 bg-[#1A1A1A] border border-[#2A2A2A] px-3 py-2 rounded-xl">
              <div className="w-7 h-7 bg-[#FF6800] rounded-lg flex items-center justify-center font-black text-xs text-white">
                {userInitials}
              </div>
              <div>
                <p className="text-[9px] font-black uppercase text-white/40 tracking-widest leading-none">Éleveur</p>
                <p className="text-[12px] font-bold text-white leading-tight">{userName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── CONTENT ─── */}
        <div className="flex-1 p-5 md:p-10">

          {/* HOME */}
          {activeView === 'home' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

              {/* Welcome banner */}
              <div className="relative bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-7 py-8 overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6800]/10 rounded-full -mr-20 -mt-20 blur-2xl" />
                  <div className="absolute bottom-0 left-40 w-32 h-32 bg-[#FF6800]/5 rounded-full blur-xl" />
                </div>
                <div className="relative z-10">
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-1">
                    Bienvenue, {userName} 👋
                  </h1>
                  <p className="text-white/60 text-sm font-medium">Voici le résumé de votre activité.</p>
                </div>
                <div className="relative z-10 flex items-center gap-2 px-4 py-2 bg-[#FF6800]/10 border border-[#FF6800]/30 rounded-full self-start sm:self-auto">
                  <Sparkles size={13} className="text-[#FF6800]" />
                  <span className="text-[10px] font-black text-[#FF6800] uppercase tracking-widest">Système Actif</span>
                </div>
              </div>

              {/* Credit card widget */}
              {showCreditCard && (
                <CreditCard_
                  credits={credits}
                  onRecharge={handleRecharge}
                  onDismiss={() => setShowCreditCard(false)}
                />
              )}

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                  label="Formules"
                  value={subscription.formulasCount ?? 0}
                  sub="Sauvegardées"
                  icon={<FlaskConical size={17} />}
                  colorClass="text-emerald-400"
                  bgClass="bg-emerald-500/10"
                  borderClass="border-[#2A2A2A]"
                />
                <KpiCard
                  label="Crédits"
                  value={credits}
                  sub="Disponibles"
                  icon={<Zap size={17} />}
                  colorClass={credits === 0 ? 'text-red-400' : 'text-[#FF6800]'}
                  bgClass={credits === 0 ? 'bg-red-500/10' : 'bg-[#FF6800]/10'}
                  borderClass={credits === 0 ? 'border-red-500/30' : 'border-[#2A2A2A]'}
                />
                <KpiCard
                  label="Bonus"
                  value={bonusTrials}
                  sub="Via parrainage"
                  icon={<Gift size={17} />}
                  colorClass="text-purple-400"
                  bgClass="bg-purple-500/10"
                  borderClass="border-[#2A2A2A]"
                />
                <KpiCard
                  label="Statut"
                  value={subscription.status === 'active' ? 'PRO' : 'FREE'}
                  sub="Niveau d'accès"
                  icon={<LayoutGrid size={17} />}
                  colorClass="text-blue-400"
                  bgClass="bg-blue-500/10"
                  borderClass="border-[#2A2A2A]"
                />
              </div>

              {/* Actions rapides */}
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em] mb-4 flex items-center gap-3">
                  Actions rapides
                  <span className="flex-1 h-px bg-[#2A2A2A]" />
                </p>
                <div className="grid md:grid-cols-2 gap-5">
                  <button
                    onClick={() => setActiveView('calculator')}
                    className="group relative bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] p-7 rounded-2xl text-left hover:scale-[1.01] transition-all shadow-xl overflow-hidden border border-[#FF6800]/30 hover:border-[#FF6800]"
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF6800]/10 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-500 blur-2xl" />
                    <div className="w-11 h-11 bg-[#FF6800]/10 border border-[#FF6800]/30 rounded-xl flex items-center justify-center text-[#FF6800] mb-5 group-hover:bg-[#FF6800] group-hover:text-white transition-colors">
                      <FlaskConical size={20} />
                    </div>
                    <h3 className="text-xl font-black text-white mb-2 tracking-tight">Calculateur de Provende</h3>
                    <p className="text-white/50 text-sm font-medium mb-5 leading-relaxed">
                      Vérifiez vos formules ou générez automatiquement des formules optimisées.
                    </p>
                    <div className="flex items-center gap-2 text-[#FF6800] font-black text-[10px] uppercase tracking-widest">
                      Ouvrir l'outil <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>

                  {/* Recharge button card */}
                  <button
                    onClick={handleRecharge}
                    className="group relative bg-[#1A1A1A] p-7 rounded-2xl text-left border border-[#2A2A2A] hover:border-[#FF6800]/50 hover:shadow-lg hover:shadow-[#FF6800]/10 transition-all overflow-hidden"
                  >
                    <div className="w-11 h-11 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl flex items-center justify-center text-white/40 mb-5 group-hover:bg-[#FF6800]/10 group-hover:text-[#FF6800] group-hover:border-[#FF6800]/30 transition-colors">
                      <CreditCard size={20} />
                    </div>
                    <h3 className="text-xl font-black text-white mb-2 tracking-tight">Recharger des crédits</h3>
                    <p className="text-white/50 text-sm font-medium mb-3 leading-relaxed">
                      Achetez des crédits pour générer des formules IA et lancer des analyses.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {['12 crédits — 2 400 F', '25 crédits — 5 000 F', '35 crédits — 7 000 F'].map(pack => (
                        <span key={pack} className="text-[10px] font-black px-2.5 py-1 bg-[#FF6800]/10 border border-[#FF6800]/20 text-[#FF6800] rounded-lg">
                          {pack}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-[#FF6800] font-black text-[10px] uppercase tracking-widest">
                      Voir les packs <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Historique */}
              <button
                onClick={() => setActiveView('history')}
                className="w-full flex items-center gap-5 bg-[#1A1A1A] border border-[#2A2A2A] hover:border-emerald-500/30 hover:bg-emerald-500/5 rounded-2xl px-6 py-5 transition-all group text-left"
              >
                <div className="w-10 h-10 shrink-0 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400">
                  <Wheat size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm text-white">Historique des Recettes</p>
                  <p className="text-[12px] text-white/50 font-medium mt-0.5">
                    Retrouvez toutes vos formulations sauvegardées
                  </p>
                </div>
                <ChevronRight size={16} className="text-white/30 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>

              {/* Programme ambassadeur */}
              <button
                onClick={() => setActiveView('referral')}
                className="w-full flex items-center gap-5 bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#FF6800]/50 hover:bg-[#FF6800]/5 rounded-2xl px-6 py-5 transition-all group text-left"
              >
                <div className="w-10 h-10 shrink-0 bg-[#FF6800]/10 border border-[#FF6800]/30 rounded-xl flex items-center justify-center text-[#FF6800] group-hover:bg-[#FF6800]/20 transition-colors">
                  <Gift size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm text-white">Programme Ambassadeur</p>
                  <p className="text-[12px] text-white/50 font-medium mt-0.5">
                    Parrainez un ami et gagnez chacun{' '}
                    <strong className="text-[#FF6800] font-black">+1 crédit bonus</strong>
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {[...Array(3)].map((_, i) => (
                    <Star key={i} size={11} className="text-[#FF6800]" fill="currentColor" />
                  ))}
                </div>
                <ChevronRight size={16} className="text-white/30 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>

            </div>
          )}

          {/* CALCULATOR */}
          {activeView === 'calculator' && (
            <div className="max-w-6xl mx-auto space-y-7 animate-in fade-in duration-500">

              {/* Mode selector */}
              <div className="bg-[#1A1A1A] p-3 rounded-2xl border border-[#2A2A2A] shadow-sm flex gap-3 w-full">
                <button
                  onClick={() => setMode('manual')}
                  className={`flex-1 flex items-center justify-center gap-3 px-8 py-6 rounded-xl font-black text-base uppercase tracking-widest transition-all ${
                    mode === 'manual'
                      ? 'bg-[#FF6800] text-white shadow-lg shadow-[#FF6800]/30 scale-[1.01]'
                      : 'text-white/40 hover:text-white hover:bg-[#0A0A0A]'
                  }`}
                >
                  <FlaskConical size={22} />
                  Vérificateur de formules
                </button>
                <button
                  onClick={() => setMode('auto')}
                  className={`flex-1 flex items-center justify-center gap-3 px-8 py-6 rounded-xl font-black text-base uppercase tracking-widest transition-all ${
                    mode === 'auto'
                      ? 'bg-[#FF6800] text-white shadow-lg shadow-[#FF6800]/30 scale-[1.01]'
                      : 'text-white/40 hover:text-white hover:bg-[#0A0A0A]'
                  }`}
                >
                  <Zap size={22} />
                  Générateur automatique
                </button>
              </div>

              {/* Alerte affichée uniquement quand le solde est épuisé */}
              {credits === 0 && (
                <div className="flex items-center justify-between gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Zap size={15} className="text-red-400 shrink-0" />
                    <p className="text-[13px] font-bold text-red-300">
                      Aucun crédit disponible.{' '}
                      <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="underline font-black text-red-200 hover:text-white"
                      >
                        Rechargez
                      </button>{' '}
                      ou{' '}
                      <button
                        onClick={() => setActiveView('referral')}
                        className="underline font-black text-red-200 hover:text-white"
                      >
                        parrainez un ami
                      </button>{' '}
                      pour continuer.
                    </p>
                  </div>
                  <button
                    onClick={handleRecharge}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-400 text-white rounded-lg font-black text-[10px] uppercase tracking-widest transition-all"
                  >
                    <Plus size={11} /> Recharger
                  </button>
                </div>
              )}

              <div>
                {mode === 'manual'
                  ? <ManualAnalyzer onNoCredits={() => setShowUpgradeModal(true)} />
                  : <AutomaticGenerator onTrialExhausted={() => setShowUpgradeModal(true)} />
                }
              </div>
            </div>
          )}

          {/* HISTORY */}
          {activeView === 'history' && (
            <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
              <SavedFormulas />
            </div>
          )}

          {/* REFERRAL */}
          {activeView === 'referral' && (
            <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
              <ReferralSection />
            </div>
          )}

        </div>
      </main>
    </div>
  )
}