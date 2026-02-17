// src/components/Header.tsx
import { useState } from 'react'
import { Sprout, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path

  const navLinks = [
    { name: 'Services', path: '/services' },
    { name: 'Formations', path: '/formations' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <div className="fixed top-4 md:top-6 left-0 right-0 z-50 px-3 md:px-6">
      <header className="max-w-7xl mx-auto bg-slate-950/80 backdrop-blur-xl border border-white/10 p-2 rounded-full flex items-center justify-between shadow-2xl relative">
        
        {/* 1. LOGO AREA */}
        <div className="flex items-center ml-2 md:ml-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-linear-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform shrink-0">
              <Sprout className="text-slate-950" size={20} />
            </div>
            <span className="text-sm md:text-lg font-black text-white tracking-tighter uppercase">
              Provende<span className="text-emerald-400 hidden sm:inline">Builder</span>
            </span>
          </Link>
        </div>

        {/* 2. NAVIGATION DESKTOP (Milieu) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-10">
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

        {/* 3. ACTIONS AREA (Droite) */}
        <div className="flex items-center gap-2 md:gap-4 pr-1 md:pr-2">
          {/* Connexion : caché sur mobile, visible dès 'sm' */}
          <Link 
            to="/login" 
            className="hidden sm:block text-white/80 hover:text-white font-black text-[10px] uppercase tracking-widest px-2 transition-all"
          >
            Connexion
          </Link>
          
          {/* Bouton Essai : Texte raccourci sur mobile */}
          <Link 
            to="/register" 
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 md:px-6 py-2.5 md:py-3 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <span className="sm:hidden">Essai</span>
            <span className="hidden sm:inline">Essai gratuit</span>
          </Link>

          {/* Burger Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center text-white bg-white/5 rounded-full border border-white/10 active:bg-white/10 transition-colors"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* 4. MOBILE MENU OVERLAY */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-full left-0 right-0 mt-3 mx-2 bg-slate-900 border border-white/10 rounded-[2rem] p-6 shadow-2xl md:hidden z-50"
            >
              <div className="flex flex-col gap-5">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.path} 
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-xs font-black uppercase tracking-[0.3em] py-3 px-4 rounded-xl transition-colors ${
                      isActive(link.path) ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/60 hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="h-px bg-white/5 my-2" />
                
                <Link 
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-xs font-black uppercase tracking-[0.3em] text-white/60 py-3 px-4 hover:text-white"
                >
                  Se connecter
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  )
}