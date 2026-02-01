// src/components/Header.tsx
import { Sprout } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export function Header() {
  const location = useLocation()
  
  // Fonction pour vérifier si le lien est actif
  const isActive = (path: string) => location.pathname === path

  const navLinks = [
    { name: 'Services', path: '/services' },
    { name: 'Nos Formations', path: '/formations' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <div className="fixed top-6 left-0 right-0 z-50 px-6">
      <header className="max-w-7xl mx-auto bg-slate-950/40 backdrop-blur-xl border border-white/10 p-2 md:p-3 rounded-full flex items-center shadow-2xl">
        
        {/* 1. LOGO (À GAUCHE) */}
        <div className="flex-1 flex justify-start">
          <Link to="/" className="flex items-center gap-3 ml-4 group">
            <div className="w-10 h-10 bg-linear-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <Sprout className="text-slate-950" size={22} />
            </div>
            <span className="text-lg font-black text-white tracking-tighter uppercase hidden lg:block">
              Provende<span className="text-emerald-400">Builder</span>
            </span>
          </Link>
        </div>

        {/* 2. NAVIGATION (CENTRÉE AU MILIEU) */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-emerald-400 ${
                isActive(link.path) ? 'text-emerald-400' : 'text-white/60'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* 3. ACTIONS (À DROITE) */}
        <div className="flex-1 flex justify-end items-center gap-3 pr-2">
          <Link 
            to="/login" 
            className="text-white/80 hover:text-white font-black text-[10px] uppercase tracking-widest px-4 py-2 transition-all"
          >
            Se connecter
          </Link>
          
          <Link 
            to="/register" 
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
          >
            Essai gratuit
          </Link>
        </div>
      </header>
    </div>
  )
}