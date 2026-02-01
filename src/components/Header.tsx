// src/components/Header.tsx
import { Sprout, UserCircle, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="absolute top-0 w-full z-50 py-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
            <Sprout className="text-[#064e3b]" size={28} />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter hidden sm:block">
            PROVENDE<span className="text-emerald-400">BUILDER</span>
          </span>
        </Link>

        {/* Navigation Publique (Sans Tarifs) */}
        <nav className="hidden lg:flex items-center gap-12">
          <Link to="/services" className="text-white/90 hover:text-emerald-400 font-bold text-xs uppercase tracking-[0.2em] transition-all">
            Services
          </Link>
          <Link to="/about" className="text-white/90 hover:text-emerald-400 font-bold text-xs uppercase tracking-[0.2em] transition-all">
            À propos
          </Link>
          <Link to="/contact" className="text-white/90 hover:text-emerald-400 font-bold text-xs uppercase tracking-[0.2em] transition-all">
            Contact
          </Link>
        </nav>

        {/* Actions Auth */}
        <div className="flex items-center gap-6">
          <Link to="/login" className="hidden md:flex items-center gap-2 text-white hover:text-emerald-400 font-black text-xs uppercase tracking-widest transition-all">
            <UserCircle size={18} />
            Connexion
          </Link>
          <Link to="/register" className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#064e3b] px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl">
            <UserPlus size={18} />
            S'inscrire
          </Link>
        </div>
      </div>
    </header>
  )
}